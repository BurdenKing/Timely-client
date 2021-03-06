import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { TextValidator} from 'react-material-ui-form-validator';

import "./CreationWizard.css";

const useStyles = makeStyles(() => ({
  budget_container: {
    width: "70%",
  },
  budgetInfo: {
    width: "100%",
    margin: "-15px 0 0 0",
  },
}));

/**
 * Author: Prabh
 * Version: 1
 * Desc: Third step for project creation
 */
const ProjectInfo = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.budget_container}>
    <form autoComplete="off">
      <TextValidator
        component="span"
        className="margin"
        id="standard-basic"
        label="Cost"
        value={props.cost}
        name="cost"
        onChange={props.handleChange}
        disabled={props.isDisabled}
        className={classes.budgetInfo}
        validators={['isRequired']}
        errorMessages={['Input is required.']}
      />
    </form>
    </div>
  );
};

export default ProjectInfo;
