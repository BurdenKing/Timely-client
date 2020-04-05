import React, { Component } from "react";
import MUIDatatable from "mui-datatables";
import agent from '../../api/agent.js'
import {
  withStyles,
  ThemeProvider,
  createMuiTheme,
  MuiThemeProvider
} from "@material-ui/core/styles";
import AssignToolBar from "./AssignToolBar";

/**
 * Material UI styling JSON object.
 */
const styles = () => ({
  container: {
    width: "1300px",
    display: "flex",
    justifyContent: "center"
  },
  projectAssignedToTitle: {
    fontSize: "16px",
    fontWeight: "bold"
  },
  pictureUrl: {
    width: 50
  }
});

/**
 * Defines the columns for the HR portal.
 */
const columns = [
  { name: "projectId", label: "Project ID", className: "column" },
  { name: "projectName", label: "Project Name", className: "column" },
  { name: "projectManager", label: "Project Manager", className: "column" }
];

/**
 * Demo data for now.
 */
const demoData = [
  {
    pictureUrl: "https://api4u.azurewebsites.net/images/flintstone/fred.png",
    projectId: "1",
    projectName: "Building a database",
    firstName: "John",
    lastName: "Doe"
  },
  {
    pictureUrl: "https://api4u.azurewebsites.net/images/flintstone/fred.png",
    projectId: "2",
    projectName: "Software Development",
    firstName: "Jane",
    lastName: "Kelly"
  },
  {
    pictureUrl: "https://api4u.azurewebsites.net/images/flintstone/fred.png",
    projectId: "3",
    projectName: "Creating a website",
    firstName: "Henry",
    lastName: "Peter"
  }
];

/**
 * Author: John Ham
 * Version: 1.0
 * Description: Supervisor Portal Component.
 * List of projects that an employee is assigned to.
 */
class ProjectsAssignedTo extends Component {
  getCustomTheme = () =>
    createMuiTheme({
      overrides: {
        MUIDataTableHeadCell: {
          data: {
            fontSize: "16px"
          }
        },
        MUIDataTable: {
          paper: {
            padding: "25px"
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

    this.state = {
      data: []
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }
  
  /**
   * Gets a list of the projects that the employee is assigned to.
   */
  async getProjects() {
    const token = localStorage.getItem("token");
    const response = agent.projects.getProjectsForUser(this.props.match.params.id, token);
    return response;
  }

  /**
   * Gets the necessary information from the employees' data and stores
   * them in an array.
   */
  async fetchData() {
    const { classes } = this.props; 
  
    console.log(this.props);
    var projectsData = await this.getProjects();
    console.log(projectsData);

    var resultData = [];
    for (let i = 0; i < projectsData.length; i++) {
        let id = projectsData[i].project_code;
        let projectName = projectsData[i].project_name;
        let name = projectsData[i].project_manager_id.first_name + " " + projectsData[i].project_manager_id.last_name;

        let row = [];
        row.push(id);
        row.push(projectName);
        row.push(name);

      resultData.push(row);
    }

    this.setState({
      data: resultData
    });
  }

  render() {
    const { classes } = this.props;

    /**
     * Configuration object for the MUI data table.
     */
    const options = () => {
      const data = {
        selectableRows: false,
        search: true,
        print: false,
        download: false,
        filter: false
      };
      return data;
    };

    return (
      <div className={classes.container}>
        <MuiThemeProvider theme={this.getCustomTheme()}>
          <MUIDatatable
            className="datatable"
            title={<div className={classes.projectAssignedToTitle}>Projects Assigned To</div>}
            options={options(this.props)}
            columns={columns}
            data={this.state.data}
          />
        </MuiThemeProvider>
      </div>
    );
  }
}

export default ProjectsAssignedTo;
