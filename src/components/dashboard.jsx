// Out of House
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import InfoIcon from '@material-ui/icons/Info';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SettingsIcon from '@material-ui/icons/Settings';
import { makeStyles } from '@material-ui/core/styles';
import { Link, NavLink } from "react-router-dom";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// In house
// import useStyles from '../styles/styles'
import auth from '../services/authService';
import NavBar from './common/navBar.jsx'
import ItemLink from './common/itemLink'

const drawerWidth = 200

const Dashboard = ({ children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [userLogged, setUserLogged] = useState();

  useEffect(() => {
    try {
      const userData = auth.getCurrentUser();
      setUserLogged(userData);
    } catch (ex) {}
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />

      <NavBar
        classes={classes}
        userLogged={userLogged}
        handleDrawerOpen={handleDrawerOpen}
        open={open}
      />
      
      <Drawer
        variant='permanent'
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>

        <Divider />

        <div>
          <List>
            {userLogged ? (
              <>
                <ItemLink name={'Settings'}>
                  <NavLink className="nav-item nav-link text-dark p-0 m-0" to="/Sign In"><SettingsIcon /></NavLink>
                </ItemLink>
              <>
                <ItemLink name={'Sign Out'}>
                  <NavLink className="nav-item nav-link text-dark p-0 m-0" to="/Sign Out"><span className="material-icons">&#xe9BA;</span></NavLink>
                </ItemLink>
              </>
                <Divider />
              </>
            ) : (
              <>
              <ItemLink name={'Sign In'}>
                <NavLink className="nav-item nav-link text-dark p-0 m-0" to="/Sign In"><span className="material-icons">&#xea77;</span></NavLink>
              </ItemLink>
            </>
            )}
              <ItemLink name={'About'}>
                <NavLink className="nav-item nav-link text-dark p-0 m-0" to="/Sign In"><InfoIcon /></NavLink>
              </ItemLink>
          </List>
        </div>
      </Drawer>
    </div>
  );
}

export default Dashboard;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    backgroundColor: '#4682B4',
    //#ab3900 <-- complimentary red color or #ab001d
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    // flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  logo: {
    width: 40,
    marginRight: 5,
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  grow: {
    flexGrow: 1,
  },
}));
