import React, { Component } from 'react';
import MUIDatatable from "mui-datatables";
import agent from '../../api/agent.js';
import Alert from '../Alert/Alert';

/**
 * Defines the columns for the HR portal. 
 */
const columns = [
  {name:"projectId", label:"Project ID", className:"column"},
  {name:"projectName", label:"Project Name", className:"column"},
  {name:"projectManager", label:"Project Manager", className:"column"},
  {name:"projectStatus", label:"Status", className:"column"},
];
  
/**
 * Author: John Ham 
 * Version: 1.0 
 * Description: Supervisor Portal Component. 
 * List of projects that an employee is assigned to. 
 */
class ProjectsAssignedTo extends Component {

  constructor(props) {
    super(props); 

    this.state = ({
      data: [],
      errorAlert: false,
    })

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
    try {
      var response = await agent.projects.getProjectsForUser(this.props.match.params.id, token);
    } catch (e) {
      this.setState({
        errorAlert: true,
      });
      setTimeout(() => {
        this.setState({
          errorAlert: false
        });
        this.props.history.push(`/dashboard/supervisor`);
      }, 1000);
      return [];
    }
    return response;
  }

  /**
   * Gets the necessary information from the employees' data and stores
   * them in an array.
   */
  async fetchData() {
    const { classes } = this.props; 
    var projectsData = await this.getProjects();

    var resultData = [];
    for (let i = 0; i < projectsData.length; i++) {
        let id = projectsData[i].project_code;
        let projectName = projectsData[i].project_name;
        let name = projectsData[i].project_manager_id.first_name + " " + projectsData[i].project_manager_id.last_name;
        let status = projectsData[i].status

        let row = [];
        row.push(id);
        row.push(projectName);
        row.push(name);
        row.push(status);

        resultData.push(row);
    }
    
    this.setState({
      data: resultData
    })
  } 

  render() {
    /**
     * Configuration object for the MUI data table. 
     */
    const options = () => {
        const data = {
        selectableRows: false,
        search: true,
        print: false,
        download: false,
        filter: false,
        }
        return data;
    };

    return (
      <>
        {this.state.errorAlert ? <Alert config = {{message: "An error has occurred. Please try again.", variant: "error"}}/> : null}
        <MUIDatatable 
          className="datatable"
          title={<h1>Projects Assigned To {localStorage.name}</h1>}
          options={options(this.props)}
          columns={columns}
          data={this.state.data}
        />
    </>
    )
  }
}

export default ProjectsAssignedTo;
