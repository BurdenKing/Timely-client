import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from "react-router-dom";
import MoreVertIcon from '@material-ui/icons/MoreVert';

/**
 * Author: Joe 
 * Version: 1.0 
 * Description: A vertical dropdown component for the more icon. 
 * @param {JSON} props 
 */
export default function MoreVertOption(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  /**
   * Opens the drop down menu. 
   * @param {event} event 
   */
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Closes the drop down menu.
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <MoreVertIcon onClick={handleClick} aria-controls="simple-menu" aria-haspopup="true"/>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <Link to= {props.link} style = {{textDecoration: 'none', color: 'black'}}><MenuItem> Edit </MenuItem> </Link>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
    </div>
  );
}