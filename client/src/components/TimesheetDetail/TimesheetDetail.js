/**
 * Author: Kang Wang
 * Version: 1
 * Desc: Timesheet Detail Component displaying timesheet details after user click on a row on Timesheet Portal lists
 */
import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Button } from '@material-ui/core/';
import './TimesheetDetail.css';
import agent from "../../api/agent";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import Paper from '@material-ui/core/Paper';
import ContentEditable from 'react-contenteditable'

// timesheet table css
const timesheetStyle = theme => ({
    table: {
      width: "93%"
    },
    timesheetTable: {
      width: '100%',
      maxHeight: '420px',
      display: "flex",
      justifyContent: "center"
    },
    tableTitle: {
      fontWeight: 'bold',
      fontSize: '10pt !important'
    },
    updateSubmitButton: {
      position: 'absolute',
      margin: '0 0 0 780px'
    },
    submitButton: {
      marginLeft: 25
    }
});


// TimesheetDetail Component
class TimesheetDetail extends Component {

  // Constructor for props, states and functions
  constructor(props) {
    super(props);

    this.state = {
      timesheetrows: [],
      loadUser: {},
      totalWeek: {},
      totalDay: [],
      totalOver: {},
      totalOverDays: [],
      loadedTimesheet: {},
      isEditable: {},
      overtime: 0,
      flextime: 0,
    };
    
    // functions
    this.fetchTimesheetRows = this.fetchTimesheetRows.bind(this);
    this.addRow = this.addRow.bind(this);
    this.totalHourRow = this.totalHourRow.bind(this);
    this.totalSat = this.totalSat.bind(this);
    this.totalSun = this.totalSun.bind(this);
    this.totalMon = this.totalMon.bind(this);
    this.totalTue = this.totalTue.bind(this);
    this.totalWed = this.totalWed.bind(this);
    this.totalThu = this.totalThu.bind(this);
    this.totalFri = this.totalFri.bind(this);
    this.totalHourWeek = this.totalHourWeek.bind(this);
    this.ccyFormat = this.ccyFormat.bind(this);
    this.formatWeekEnding = this.formatWeekEnding.bind(this);
    this.gotoTimesheetDetail = this.gotoTimesheetDetail.bind(this);
    this.isEditable = this.isEditable.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.updateTS = this.updateTS.bind(this);
    this.submitTS = this.submitTS.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleOverFlexTime = this.handleOverFlexTime.bind(this);
    this.checkKey = this.checkKey.bind(this);
  }

  // onLoad function, where i will be fetch data
  componentDidMount(){
    this.fetchTimesheetRows();
  }

  // checking the status of the timesheet to determine if its editable
  isEditable() {
    const thisStatus = this.state.loadedTimesheet.status;
    let isEditable = false;
    if((thisStatus == "REJECTED" || thisStatus == "InProgress") && this.props.dashboardTimesheet == undefined) {
      isEditable = true;
    }
    // setting the state
    this.setState({
      isEditable: isEditable
    })
  }
  // Fetching Timesheet Rows
  async fetchTimesheetRows() {
    // check if its dash board timesheet
    const ifDashboardTs = this.props.dashboardTimesheet;
    var userId, token, tsId;

    // setting userId token and tsId for fetching
    if(ifDashboardTs == undefined) {
      var user = JSON.parse(sessionStorage.getItem('user'));
      userId = user.employee_id;
      token = localStorage.getItem("token");
      
      tsId = localStorage.getItem("timesheetId");
      this.setState({
        loadUser: user
      });
    } else {
        if(this.props.token != null) {
          userId = this.props.userId;
          token = this.props.token;
          // fetching projects
          const projects = await agent.projects.getProjectsForUser(userId, token);
          // fetching employee
          const curEmp = await agent.employeeInfo.getCurrentUser(this.props.userId, this.props.token);
          this.setState({
            loadUser: curEmp
          });

          // looking for the most recent timesheet
          const tsResponse = await agent.timesheetsInfo.getAllTimesheetsByEmp(userId, token);

          if(tsResponse.length != 0) {
            // fetching timesheets
            var timesheetList = [];

            for (let i = 0; i < tsResponse.length; i++) {
                let timesheetid = tsResponse[i].timesheet_id;
                let weeknumber = tsResponse[i].week;
                let weekending = this.formatWeekEnding(tsResponse[i].week_ending);
                let status = tsResponse[i].status;
                let attribute1 = (tsResponse[i].attribute1==null ? "0|0" : tsResponse[i].attribute1);
                
                let eachTimesheet = [];
                eachTimesheet.push(timesheetid);
                eachTimesheet.push(weeknumber);
                eachTimesheet.push(weekending);
                eachTimesheet.push(status);
                eachTimesheet.push(attribute1);
                timesheetList.push(eachTimesheet);
            }
            // sorting timesheet list by week number
            timesheetList.sort( function(a,b){
              return b[1] - a[1];
            });
            tsId = timesheetList[0][0];
            // returning projects, employee and overFlex time to dashboard
            this.props.fetchProject(projects, curEmp, timesheetList[0][4]);
          } else {
            // returning projects, employee and overFlex time to dashboard
            this.props.fetchProject(projects, curEmp, "0|0");
            console.log("no timesheets");
          }
        }
    }
    
    // fetching timesheetRow
    if(userId != null && token != null && tsId != null) {
      const response = await agent.timesheetsInfo.getTimesheetById(userId, token, tsId);
      // getting overtime and flexTime
      let loadedTimesheetattribute1 = (response.attribute1==null ? "0|0" : response.attribute1);
      const res = loadedTimesheetattribute1.split("|");
      const ovTime = parseFloat(res[0]);
      const flTime = parseFloat(res[1]); 
      // fetched timesheet
      this.setState({
        loadedTimesheet: response,
        overtime: ovTime,
        flextime: flTime
      });
      // setting if the timesheet is editable
      this.isEditable();
      if(response.details.length != 0) {
        const timesheetDetails  = response.details;
        // fetching timesheetRows
        var timesheetRowList = [];

        // id, proj, wp, sat, sun, mon, tue, wed, thu, fri, notes
        for (let i = 0; i < timesheetDetails.length; i++) {
          let id = timesheetDetails[i].timesheet_row_id;
          let proj = timesheetDetails[i].project_code;
          let wp = timesheetDetails[i].work_package_id;
          let sat = timesheetDetails[i].saturday;
          let sun = timesheetDetails[i].sunday;
          let mon = timesheetDetails[i].monday;
          let tue = timesheetDetails[i].tuesday;
          let wed = timesheetDetails[i].wednesday;
          let thu = timesheetDetails[i].thursday;
          let fri = timesheetDetails[i].friday;
          let notes = timesheetDetails[i].notes;
          let proj_wp = timesheetDetails[i].project_wp;
          const tol = this.totalHourRow(sat, sun, mon, tue, wed, thu, fri);
        
          let eachTimesheetRow = [];
          eachTimesheetRow.push(id);
          eachTimesheetRow.push(proj);
          eachTimesheetRow.push(wp);
          eachTimesheetRow.push(tol);
          eachTimesheetRow.push(sat);
          eachTimesheetRow.push(sun);
          eachTimesheetRow.push(mon);
          eachTimesheetRow.push(tue);
          eachTimesheetRow.push(wed);
          eachTimesheetRow.push(thu);
          eachTimesheetRow.push(fri);
          eachTimesheetRow.push(notes);
          eachTimesheetRow.push(proj_wp);
          timesheetRowList.push(eachTimesheetRow);
        }
        // setting the state
        this.setState({
          timesheetrows: timesheetRowList
        });
        // calculating total hours of all week
        const weekTotal = this.totalHourWeek(this.state.timesheetrows);
        // array of total hours of each day
        const dayTotal = [this.totalSat(this.state.timesheetrows), this.totalSun(this.state.timesheetrows),
          this.totalMon(this.state.timesheetrows), this.totalTue(this.state.timesheetrows), 
            this.totalWed(this.state.timesheetrows), this.totalThu(this.state.timesheetrows), this.totalFri(this.state.timesheetrows)];
        //  setting state
        this.setState({
          totalWeek: weekTotal,
          totalDay: dayTotal,
        });
      }
    } else {
      document.getElementById("timesheetDetailContainer").innerHTML = "Sorry, you don't have any timesheet records in the database!"
    }
  }

  // work hour data formatting
  ccyFormat(num) {
    return (Math.round(num * 10) / 10).toFixed(1);;
  }

  // calculating total of each row
  totalHourRow(sat, sun, mon, tue, wed, thu, fri) {
    return sat + sun + mon + tue + wed + thu + fri;
  }

  // calculating total of Sat
  totalSat(items) {
    var total = 0;
    for(let i = 0; i < items.length; i++) {
      total += items[i][4];
    }
    return total;
  }
  // calculating total of Sun
  totalSun(items) {
    var total = 0;
    for(let i = 0; i < items.length; i++) {
      total += items[i][5];
    }
    return total;
  }
  // calculating total of Mon
  totalMon(items) {
    var total = 0;
    for(let i = 0; i < items.length; i++) {
      total += items[i][6];
    }
    return total;
  }
  // calculating total of Tue
  totalTue(items) {
    var total = 0;
    for(let i = 0; i < items.length; i++) {
      total += items[i][7];
    }
    return total;
  }
  // calculating total of Wed
  totalWed(items) {
    var total = 0;
    for(let i = 0; i < items.length; i++) {
      total += items[i][8];
    }
    return total;
  }
  // calculating total of Thu
  totalThu(items) {
    var total = 0;
    for(let i = 0; i < items.length; i++) {
      total += items[i][9];
    }
    return total;
  }
  // calculating total of Fri
  totalFri(items) {
    var total = 0;
    for(let i = 0; i < items.length; i++) {
      total += items[i][10];
    }
    return total;
  }
  // calculating total of week
  totalHourWeek(items) {
    var totalWeekHour = 0;
    for(let i = 0; i < items.length; i++) {
      totalWeekHour += items[i][3];
    }
    return totalWeekHour;
  }

  // handle add row button click
  addRow = () => {
    var curRow = this.state.timesheetrows;
    let eachTimesheetRow = [];
    eachTimesheetRow.push("");
    eachTimesheetRow.push("");
    eachTimesheetRow.push("");
    eachTimesheetRow.push(0.0);
    eachTimesheetRow.push(0.0);
    eachTimesheetRow.push(0.0);
    eachTimesheetRow.push(0.0);
    eachTimesheetRow.push(0.0);
    eachTimesheetRow.push(0.0);
    eachTimesheetRow.push(0.0);
    eachTimesheetRow.push(0.0);
    eachTimesheetRow.push("");
    eachTimesheetRow.push("PJT19257_2");
    curRow.push(eachTimesheetRow);
    this.setState({
      timesheetrows: curRow
    })
  } 
  
  // delelte Row
  deleteRow = (index) => {
    let datas = this.state.timesheetrows.filter((e, i) => i !== index);
    this.setState({ timesheetrows : datas });
  }
  // converting weekending api from milliseconds to date format
  formatWeekEnding(weekending) {
    var weekEnding_date = new Date(weekending);
    var year = weekEnding_date.getFullYear();
    var month = ("0" + (weekEnding_date.getMonth() + 1)).slice(-2)
    var day = ("0" + weekEnding_date.getDate()).slice(-2)  ;
    return (year + "-" + month + "-" + day);
  }

  // updating timesheet
  updateTS = () => {
    console.log("Updating Timesheet");
    console.log(this.state.timesheetrows)
  }

  // updating timesheet
  submitTS = () => {
    console.log("Submitting Timesheet");
    console.log(this.state.timesheetrows)
    console.log(this.state.overtime)
    console.log(this.state.flextime)
  }

  // go to timesheetdetail if on dashboard
  gotoTimesheetDetail = () =>  {
    if(this.props.dashboardTimesheet == true && this.state.timesheetrows.length != 0) {
      var timesheet_id = this.state.loadedTimesheet.timesheet_id;
      localStorage.setItem("timesheetId", timesheet_id);
      this.props.history.push(`/dashboard/timesheet/${timesheet_id}`);
    }
  }

  // handle content change
  handleContentChange(e, row, rowIndex, column) {
    
    if(column > 3 && column < 11) {
      row[column] = parseFloat(this.ccyFormat(e.target.value));
      row[3] = row[4] + row[5] + row[6] + row[7] + row[8] + row[9] + row[10];
      // calculating total hours of all week
      const weekTotal = this.totalHourWeek(this.state.timesheetrows);
      // array of total hours of each day
      const dayTotal = [this.totalSat(this.state.timesheetrows), this.totalSun(this.state.timesheetrows),
        this.totalMon(this.state.timesheetrows), this.totalTue(this.state.timesheetrows), 
          this.totalWed(this.state.timesheetrows), this.totalThu(this.state.timesheetrows), this.totalFri(this.state.timesheetrows)];
      //  setting state
      this.setState({
        totalWeek: weekTotal,
        totalDay: dayTotal,
      });
    } else {
      row[column] = e.target.value;
    }
  }

  //check key pressed
  checkKey(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }

  // handling over flex time content change
  handleOverFlexTime(e, type) {
    //  setting over time
    if(type == "over") {
      this.setState({
        overtime: e.target.value
      })
    }
    //  setting over time
    if(type == "flex") {
      this.setState({
        flextime: e.target.value
      })
    }
  }

  // timesheet row
  timesheetRow = (row, i) => 
    <TableRow key={i}>
      <TableCell scope="row">
        {!this.state.isEditable ? row[1] :
            <ContentEditable
              html={row[1]}
              data-column="item"
              className="content-editable"
              onKeyDown={this.checkKey}
              onChange={(e) => this.handleContentChange(e, row, i, 1)}
            />
        }
      </TableCell>
      <TableCell align="right">
        {!this.state.isEditable ? row[2] :
            <ContentEditable
              html={row[2]}
              data-column="item"
              className="content-editable"
              onKeyDown={this.checkKey}
              onChange={(e) => this.handleContentChange(e, row, i, 2)}
            />
        }
      </TableCell>
      <TableCell align="right">{this.ccyFormat(row[3])}</TableCell>
      <TableCell align="right">
        {!this.state.isEditable ? this.ccyFormat(row[4]) :
            <ContentEditable
              html={this.ccyFormat(row[4])}
              data-column="item"
              className="content-editable"
              onKeyDown={this.checkKey}
              onChange={(e) => this.handleContentChange(e, row, i, 4)}
            />
        }
      </TableCell>
      <TableCell align="right">
        {!this.state.isEditable ? this.ccyFormat(row[5]) :
            <ContentEditable
              html={this.ccyFormat(row[5])}
              data-column="item"
              className="content-editable"
              onKeyDown={this.checkKey}
              onChange={(e) => this.handleContentChange(e, row, i, 5)}
            />
        }
        </TableCell>
      <TableCell align="right">
        {!this.state.isEditable ? this.ccyFormat(row[6]) :
            <ContentEditable
              html={this.ccyFormat(row[6])}
              data-column="item"
              className="content-editable"
              onKeyDown={this.checkKey}
              onChange={(e) => this.handleContentChange(e, row, i, 6)}
            />
        }
      </TableCell>
      <TableCell align="right">
        {!this.state.isEditable ? this.ccyFormat(row[7]) :
            <ContentEditable
              html={this.ccyFormat(row[7])}
              data-column="item"
              className="content-editable"
              onKeyDown={this.checkKey}
              onChange={(e) => this.handleContentChange(e, row, i, 7)}
            />
        }
      </TableCell>
      <TableCell align="right">
        {!this.state.isEditable ? this.ccyFormat(row[8]) :
            <ContentEditable
              html={this.ccyFormat(row[8])}
              data-column="item"
              className="content-editable"
              onKeyDown={this.checkKey}
              onChange={(e) => this.handleContentChange(e, row, i, 8)}
            />
        }
      </TableCell>
      <TableCell align="right">
        {!this.state.isEditable ? this.ccyFormat(row[9]) :
            <ContentEditable
              html={this.ccyFormat(row[9])}
              data-column="item"
              className="content-editable"
              onKeyDown={this.checkKey}
              onChange={(e) => this.handleContentChange(e, row, i, 9)}
            />
        }
      </TableCell>
      <TableCell align="right">
        {!this.state.isEditable ? this.ccyFormat(row[10]) :
            <ContentEditable
              html={this.ccyFormat(row[10])}
              data-column="item"
              className="content-editable"
              onKeyDown={this.checkKey}
              onChange={(e) => this.handleContentChange(e, row, i, 10)}
            />
        }
      </TableCell>
      <TableCell align="right">
        {!this.state.isEditable ? row[11] :
            <ContentEditable
              html={row[11]}
              data-column="item"
              className="content-editable"
              onKeyDown={this.checkKey}
              onChange={(e) => this.handleContentChange(e, row, i, 11)}
            />
        }
      </TableCell>
      {!this.state.isEditable ? null : <TableCell align="right" ><DeleteIcon onClick={() => { this.deleteRow(i) }} /></TableCell>}
    </TableRow>;

  render() {
    // link css
    const { classes } = this.props;
    return (
      <Paper elevation = {2} className="container" onClick={() => { this.gotoTimesheetDetail() }}>
        {/* employee info header */}
        <div className="timesheetTitle">
          <div className="attributeRow">
            <div className="empNumContainer">
              <div className="empNumTitle">
                Employee Number:
              </div>
              <div className="empNum">
                {this.state.loadUser.employee_id}
              </div>
            </div>
            <div className="weekNumContainer">
              <div className="weekNumTitle">
                Week Number:
              </div>
              <div className="weekNum">
                {this.state.loadedTimesheet.week}
              </div>
            </div>
            <div className="weekEndContainer">
              <div className="weekEndTitle">
                  Week Ending:
              </div>
              <div className="weekEnd">
              {this.formatWeekEnding(this.state.loadedTimesheet.week_ending)}
              </div>
            </div>
            {!this.state.isEditable ? null :
              <AddIcon fontSize='large'
                onClick={this.addRow} 
                color='primary' 
                variant='contained' />
            }
          </div>
          {this.props.dashboardTimesheet ?  
            null
            :
            <div className="empNameAttribute">
              <div className="empNameTitle">
                Name:
              </div>
              <div className="empName">
                    {this.state.loadUser.first_name} {this.state.loadUser.last_name}
              </div>
            </div>
          }
        </div>
        {/* add row button */}

        {/* timesheet table */}
        <TableContainer className={classes.timesheetTable}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell id="proj" className={classes.tableTitle}>Project</TableCell>
                <TableCell id="wp" align="right" className={classes.tableTitle}>WP</TableCell>
                <TableCell id="tol" align="right" className={classes.tableTitle}>Total</TableCell>
                <TableCell id="sat" align="right" className={classes.tableTitle}>Sat</TableCell>
                <TableCell id="sun" align="right" className={classes.tableTitle}>Sun</TableCell>
                <TableCell id="mon" align="right" className={classes.tableTitle}>Mon</TableCell>
                <TableCell id="tue" align="right" className={classes.tableTitle}>Tue</TableCell>
                <TableCell id="wed" align="right" className={classes.tableTitle}>Wed</TableCell>
                <TableCell id="thu" align="right" className={classes.tableTitle}>Thu</TableCell>
                <TableCell id="fri" align="right" className={classes.tableTitle}>Fri</TableCell>
                <TableCell id="notes" align="right" className={classes.tableTitle}>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* timesheet row date mapping */}
              {this.state.timesheetrows.map((x, i) => this.timesheetRow(x, i))}

              {/* total span column */}
              <TableRow>
                <TableCell  className={classes.tableTitle}>Total</TableCell>
                <TableCell colSpan={2} align="right">{this.ccyFormat(this.state.totalWeek)}</TableCell>
                <TableCell align="right">{this.ccyFormat(this.state.totalDay[0])}</TableCell>
                <TableCell align="right">{this.ccyFormat(this.state.totalDay[1])}</TableCell>
                <TableCell align="right">{this.ccyFormat(this.state.totalDay[2])}</TableCell>
                <TableCell align="right">{this.ccyFormat(this.state.totalDay[3])}</TableCell>
                <TableCell align="right">{this.ccyFormat(this.state.totalDay[4])}</TableCell>
                <TableCell align="right">{this.ccyFormat(this.state.totalDay[5])}</TableCell>
                <TableCell align="right">{this.ccyFormat(this.state.totalDay[6])}</TableCell>
              </TableRow>
              {/* overtime span column */}
              <TableRow>
                <TableCell colSpan={2} className={classes.tableTitle}>Overtime</TableCell>
                <TableCell align="right">
                {!this.state.isEditable ? this.ccyFormat(this.state.overtime) :
                  <ContentEditable
                    html={this.ccyFormat(this.state.overtime)}
                    data-column="item"
                    className="content-editable"
                    onKeyDown={this.checkKey}
                    onChange={(e) => this.handleOverFlexTime(e, "over")}
                  />
                }
                </TableCell>
              </TableRow>
              {/* flex span column */}
              <TableRow>
                <TableCell colSpan={2} className={classes.tableTitle}>Flextime</TableCell>
                <TableCell align="right">
                  {!this.state.isEditable ? this.ccyFormat(this.state.flextime) :
                    <ContentEditable
                      html={this.ccyFormat(this.state.flextime)}
                      data-column="item"
                      className="content-editable"
                      onKeyDown={this.checkKey}
                      onChange={(e) => this.handleOverFlexTime(e, "flex")}
                    />
                  }
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        {/* update and submite button */}
        {!this.state.isEditable ? null :
                <div className={classes.updateSubmitButton}>
                  <Button onClick={this.updateTS} color='primary'variant='contained'>Update</Button>
                  <Button className={classes.submitButton}onClick={this.submitTS} color='secondary'variant='contained'>Submit</Button>
                </div>
              }
      </Paper>
    )
  }
}

export default withStyles(timesheetStyle, { withTheme: true })(TimesheetDetail);