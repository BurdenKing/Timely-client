import React, { Component } from "react";
import MUIDatatable from "mui-datatables";
import {
  ThemeProvider,
  createMuiTheme,
  MuiThemeProvider
} from "@material-ui/core/styles";
import MoreVertOption from "./MoreVertOption";
import CustomToolbar from "./CustomToolBar";
import "./HrPortal.css";
import agent from '../../api/agent'
import CircularProgress from '@material-ui/core/CircularProgress';
require('datejs');

/**
 * Material UI styling JSON object.
 */
const styles = () => ({
  pictureUrl: {
    width: 50
  }
});

/**
 * Defines the columns for the HR portal.
 */
const columns = [
  {name:"employeeId", label:"ID", className:"column"},
  {name:"firstName", label:"First Name", className:"column"},
  {name:"lastName", label:"Last Name", className:"column"},
  {name:"startDate", label:"Start Date", className:"column"},
  {name:"endDate", label:"End Date", className:"column"},
  {name:"laborGrade", label:"Labor Grade", className:"column"},
  {name:"supervisor", label:"Supervisor", className:"column"},
  {name:"edit", label:"Edit", className:"column"},
];

/**
 * Configuration object for the MUI data table.
 */
const options = (props, handleCreate) => {
  const { history } = props; 

  const data = {
    selectableRows: false,
    search: true,
    print: false,
    download: false,
    filter: false,
    customToolbar: () => {
      return <CustomToolbar history = {history} handleCreate = {handleCreate}/>;
    },
    textLabels: {
      body: {
          noMatch: <CircularProgress />       
      },
    }
  };
  return data;
};

/**
 * Demo data for now.
 */
const demoData = [
  {
    pictureUrl: "https://api4u.azurewebsites.net/images/flintstone/fred.png",
    employeeId: "1",
    firstName: "John",
    lastName: "Doe",
    laborGrade: "A",
    supervisor: "Bruce Link"
  },
  {
    pictureUrl: "https://api4u.azurewebsites.net/images/flintstone/fred.png",
    employeeId: "2",
    firstName: "Jane",
    lastName: "Kelly",
    laborGrade: "A",
    supervisor: "Bruce Link"
  },
  {
    pictureUrl: "https://api4u.azurewebsites.net/images/flintstone/fred.png",
    employeeId: "3",
    firstName: "Henry",
    lastName: "Peter",
    laborGrade: "A",
    supervisor: "Bruce Link"
  }
];

/**
 * Author: Joe
 * Version: 1.0
 * Description: HR Portal Component. Portal used by HR employee for editing/adding/archiving employee information.
 */
class HrPortal extends Component {
  getCustomTheme = () =>
    createMuiTheme({
      overrides: {
        MUIDataTableHeadCell: {
          data: {
            fontSize: "16px",
          }
        },
        MUIDataTableBodyCell: {
          root: {
            fontSize: "14px"
          }
        },
        MUIDataTableToolbar: {
          root: {
            padding: "0px 0 0 16px"
          }
        }
      }
    });

  constructor(props) {
    super(props);

    this.state = ({
      data: [],
      token: null
    })

    this.fetchData = this.fetchData.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleArchive = this.handleArchive.bind(this);
    this.handleOpen = this.handleOpen.bind(this);

  }

  componentDidMount() {
    const token = localStorage.getItem("token");

    this.setState({
      token: token
    })

    this.fetchData(token);
  }

  handleCreate = () => {
    const { history } = this.props;
    history.push(`/dashboard/hr/create`);
  }

  handleArchive = async (id, body) => {
    const date = new Date().getTime();
    body.end_date = date;
    await agent.employeeInfo.updateEmployee(id, this.state.token, body);
    this.fetchData(this.state.token);
  }

  handleOpen = async (id, body) => {
    body.end_date = null;
    await agent.employeeInfo.updateEmployee(id, this.state.token, body);
    this.fetchData(this.state.token);
  }


  async fetchData(token) {
    const { classes } = this.props; 
    const resp = await agent.employeeInfo.getAllEmployees(token);

    var resultData = [];
    resp.forEach(async (item) => {
      let id = item.employee_id;
      let firstName = item.first_name;
      let lastName = item.last_name;
      let startDate = new Date(item.start_date).toString("MMM dd");
      let endDate = item.end_date;
      let laborGrade = item.labor_grade_id.labor_grade_id
      let supervisor = item.supervisor_id;

      let dateEnd = endDate == null ? 
        (<p style = {{color: 'green' }} > Currently Employed </p>) : 
        (<p style = {{color: 'red' }}> Archived </p>)

      let row = [];
      row.push(id);
      row.push(firstName);
      row.push(lastName);
      row.push(startDate);
      row.push(dateEnd);
      row.push(laborGrade);
      row.push(supervisor);
      row.push(<MoreVertOption 
        link={`/dashboard/hr/${id}`} 
        id = {id} 
        employee = {item} 
        handleArchive = {this.handleArchive} 
        handleOpen = {this.handleOpen}  
        />);
      resultData.push(row);
    })
    
    this.setState({
      data: resultData
    });
  }

  render() {

    return (
      <div className="hrPortal-container">
        <MuiThemeProvider theme={this.getCustomTheme()}>
          <MUIDatatable
            className="hrPortal-datatable"
            title={<div className="hrPortal-title"> Manage Employees</div>}
            options={options(this.props, this.handleCreate)}
            columns={columns}
            data={this.state.data}
          />
        </MuiThemeProvider>
      </div>
    );
  }
}

export default HrPortal;
