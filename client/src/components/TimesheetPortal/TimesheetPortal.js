/**
 * Author: Kang Wang
 * Version: 1
 * Desc: TimesheetPortal Component displaying the past timesheet lists, create timesheet for current week
 */
import React, { Component } from 'react'
import MUIDatatable from "mui-datatables";
import CurrentTimesheetToolBar from './CurrentTimesheetToolBar';
import './TimesheetPortal.css';
import agent from "../../api/agent";
import Alert from '../Alert/Alert'

  // static columns
  const columns = [
    {
      name:"timesheetid", 
      label:"Timesheet ID", 
      className:"column",
      options: {
        filter: false
      }
    },
    {
      name:"weeknumber", 
      label:"Week Number", 
      className:"column",
      options: {
        filter: false
      }
    },
    {
      name:"weekending", 
      label:"Week Ending", 
      className:"column",
      options: {
        sort: true,
        filter: false
        // display false
      }
  },
    {
      name:"status", 
      label:"Status", 
      className:"column",
      options: {
        filter: true
      }
    },
  ];

  // static options
  const options = (props, states, fetchTimesheets) => {
    const data = {
      selectableRows: false,
      search: true,
      print: false,
      download: false,
      rowHover: true,
      onRowClick: (rowData) => {
        props.history.push(`/dashboard/timesheet/${rowData[0]}`);
        localStorage.setItem("timesheetId", rowData[0]);
      },
      customToolbar: () => {
        return <CurrentTimesheetToolBar {...props} fetchTimesheets={fetchTimesheets} states={states}/>
      }
    }
    return data;
  };

  // TimesheetPortal Component
export default class TimesheetPortal extends Component {

  // Constructor for props, states and functions
  constructor(props) {
    super(props); 

    this.state = ({
      timesheets: [],
      loadedUserID: {},
      errorAlert: false
    })
    this.fetchTimesheets = this.fetchTimesheets.bind(this);
    this.formatWeekEnding = this.formatWeekEnding.bind(this);
  }

  // on page load fetching timesheets data
  componentDidMount() {
    this.fetchTimesheets();
    this.formatWeekEnding();
  }

  // Fetching Timesheets
  async fetchTimesheets() {
    // fetch logined user

    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = localStorage.getItem("token");
    const userId = user.employee_id;
    try {
      const response = await agent.timesheetsInfo.getAllTimesheetsByEmp(userId, token);

      if(response.length != 0) {
        // fetching timesheets
        var timesheetList = [];
  
        for (let i = 0; i < response.length; i++) {
            let timesheetid = response[i].timesheet_id;
            let weeknumber = response[i].week;
            let weekending = this.formatWeekEnding(response[i].week_ending);
            let status = response[i].status;
  
            let eachTimesheet = [];
            eachTimesheet.push(timesheetid);
            eachTimesheet.push(weeknumber);
            eachTimesheet.push(weekending);
            eachTimesheet.push(status);
            timesheetList.push(eachTimesheet);
        }
        // sorting timesheet list by week number
        timesheetList.sort( function(a,b){
          return b[1] - a[1];
        });
        // setting the states
        this.setState({
          timesheets: timesheetList,
          loadedUserID: userId
        })
      }
    } catch(e) {
      this.setState({
        errorAlert: true
      })
      this.props.sessionLogoutHandler();
    }
    // set back
    setTimeout(() => {
      this.setState({
        errorAlert: false
      });
    }, 1000);
  } 

  // converting weekending api from milliseconds to date format
  formatWeekEnding(weekending) {
    var weekEnding_date = new Date(weekending);
    var year = weekEnding_date.getFullYear();
    var month = ("0" + (weekEnding_date.getMonth() + 1)).slice(-2)
    var day = ("0" + weekEnding_date.getDate()).slice(-2)  ;
    return (year + "-" + month + "-" + day);
  }

  // timesheet table UI
  render() {
    return (
      <>
        {this.state.errorAlert ? <Alert config = {{message: "Fetching Timesheets API Call Failed", variant: "error"}}/> : null}
        <MUIDatatable 
            className="datatable"
            title={<h1>Timesheet</h1>}
            options={options(this.props, this.state, this.fetchTimesheets)}
            columns={columns}
            data={this.state.timesheets} />
      </>
    )
  }
}
