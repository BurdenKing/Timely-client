import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import { Button } from '@material-ui/core/';

/**
 * Material UI styling JSON object. 
 */
const defaultToolbarStyles = {
  iconButton: {
    marginLeft: 30
  },
};

/**
 * Author: John Ham
 * Version: 1.0 
 * Description: AssignToolBar component for the MUI data table  
 */
class AssignToolBar extends React.Component {

  /**
   * Will be used to assign an employee to a project
   */
  clickRemove = () => {
    this.props.history.push(`/dashboard/supervisor/remove`);
    console.log("remove an employee!");
  }

  render() {
    const { classes } = this.props;

    return (
      <>
        <Tooltip title={"Assign an employee to a project"}>
          <Button 
            className={classes.iconButton} 
            onClick={this.clickRemove} 
            color='primary' 
            variant='contained'> 
              Remove 
          </Button> 
        </Tooltip>
      </>
    );
  }
}

export default withStyles(defaultToolbarStyles, { name: "CustomToolbar" })(AssignToolBar);