import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Divider from '@material-ui/core/Divider';
import DropDownProfile from "../DropDownProfile/DropDownProfile"


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: 'black'
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    color: 'black'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.black, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.black, 0.15),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black'
  },
  inputRoot: {
    color: 'black',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
  appBar: {
    backgroundColor: 'white',
    position: 'fixed',
    zIndex: theme.zIndex.drawer + 1,
    flexGrow: 1,
    width: `calc(100% - ${240}px)`,
  },
  userName: {
    color: 'black',
    paddingRight: theme.spacing(3),
  }, 
  divider: {
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(3)
  },
  menu: {
    paddingRight: theme.spacing(3),
  }
});

class Navbar extends Component {

  constructor(props) {
    super(props)
    this.fetchUserData = this.fetchUserData.bind(this);


    this.state = ({
      loaded_user: {}
    })
  }

  componentDidMount(){
    this.fetchUserData();
  }

  fetchUserData(){
    fetch("http://localhost:8080/timely/services/employees/1")
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.setState({
          loaded_user: data
        })
      })
  }

  render() {
    const { classes } = this.props;
    
    return(
      <div className={classes.root}>
        <AppBar className={classes.appBar} position="fixed" elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
              Timely
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
            <Divider className = {classes.divider} orientation="vertical" flexItem />
            <h4 className = {classes.userName}> {this.state.loaded_user.first_name} {this.state.loaded_user.last_name}</h4>
            <DropDownProfile/>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Navbar);