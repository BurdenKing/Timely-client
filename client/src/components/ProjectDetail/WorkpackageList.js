import React from "react";
import MUIDataTable from "mui-datatables";
import Button from '@material-ui/core/Button'
import "./ProjectDetail.css"

/**
 * Author: Prabh
 * Version: 1
 * Desc: List component to list all the workpackages visible to the user
*/

const columns = ["ID", "Name", "Responsible Engineer", "Team", "Status"];

class WorkpackageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wpList: props.wpList,
      data: []
    }
    this.options = {
      print: false,
      responsive: "scroll",
      selectableRows : false,
      onRowClick: (rowData, rowState) => {
        console.log(rowData);
        var wp = null;
          this.state.wpList.forEach(x => {
            if (x.work_package_id === rowData[0]) {
              wp = x;
            }
          });
        this.props.history.push({
          pathname: `/workpackageDetail/${wp.work_package_id}`,
          state: {wp: wp}
        });
      } 
    };
    this.setData = this.setData.bind(this);
  }

  componentDidMount() {
    this.setData(this.state.wpList);
  }

  setData(wpList) {
      var self = this;
      const data = [];
      var curData;
      wpList.map(function(wp) {
        curData = [];
        curData.push(wp.work_package_id);
        curData.push(wp.description.split(":",1)[0]);
        curData.push(wp.responsible_person_id.first_name + " " + wp.responsible_person_id.last_name);
        curData.push(wp.employees.length);
        curData.push(wp.is_open ? <span style={{color: "green"}}>OPEN</span> : <span style={{color: "red"}}>CLOSE</span>)
        data.push(curData);
      });
      this.setState({
          data: data,
      })
  }

  render() {
    return (
      <MUIDataTable
        className="WorkpackageListDT"
        title={"Work Packages"}
        columns={columns}
        options={this.options}
        data={this.state.data}
      />
    )
  }
}

export default WorkpackageList;
