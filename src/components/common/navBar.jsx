// Out of house
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Link, NavLink } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

// In House
import  Logo  from '../common/Logo/logo';
// import useStyles from '../../styles/styles'
const drawerWidth = 200

const NavBar = ({userLogged, handleDrawerOpen, open}) => {
    let path = window.location.pathname
    const classes = useStyles()
    console.log(classes)
    

    const renderTopRight = (userLogged, path) => {
        return(
            <Grid item>
                {
                    <Typography noWrap>
                        {
                            userLogged ? `👋 ${userLogged.name}` :
                            path === '/Sign In' ? '' : 
                            <NavLink className="nav-item nav-link text-white p-0 m-0" to="/Sign In">
                                Sign In
                            </NavLink>
                        }
                    </Typography>
                }
            </Grid>
        )
    }

    return ( 
    <AppBar
        position='fixed'
        className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
        })}
        >
        <Toolbar>


        <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={handleDrawerOpen}
              edge='start'
              className={clsx(classes.menuButton, {
              [classes.hide]: open,
              })}
          >
            <MenuIcon />
        </IconButton>


        <Grid
            container
            direction='row'
            justify='flex-start'
            alignItems='center'
        >
            <Grid item className={classes.logo}>
                <Logo />
            </Grid>
            <Grid item >
            {!open ?
                <Typography 
                    variant='h6' 
                    noWrap
                >
                    <a href="/" style={{color:"white", textDecoration:"none"}} >Trend Edge</a>
                </Typography>

                :
                <></>
            }

            </Grid>
        </Grid>
        
        <div className={classes.sectionMobile} style={{textAlign:'center'}}>
            {renderTopRight(userLogged, path)}
        </div>

    </Toolbar>
    </AppBar>

     );
}
 
export default NavBar;

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