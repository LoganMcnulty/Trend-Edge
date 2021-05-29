// Out of house
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { NavLink } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// In house
import auth from '../../services/authService';
import DashList from './dashboardList'
import  Logo  from '../common/Logo/logo';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    backgroundColor: '#4682B4',
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  logo: {
    width: 40,
    marginRight: 5,
  },
}));

const Dashboard = (props) => {

  const curRoute = props.curRoute
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [userLogged, setUserLogged] = useState();

  useEffect(() => {
    try {
      const userData = auth.getCurrentUser();
      setUserLogged(userData);
    } catch (ex) {}
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <DashList userLogged={userLogged}/>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;


  const renderTopRight = (userLogged, curRoute) => {
    return(
      <Grid item>
        {
          <Typography noWrap>
              {
                userLogged ? `👋 ${userLogged.name}` :
                curRoute === '/Sign In' ? 
                ''
                  // <Button variant="contained" style={{backgroundColor:'#fc5a3d'}}><NavLink className="h7 p-0 text-white" to="/Sign Up"> Sign Up</NavLink></Button>
                :
                  <NavLink to='/Sign In' style={{ textDecoration: 'none' }}>
                    <Button
                      variant="contained"
                      className='active'
                      style={{backgroundColor:'#fc5a3d', color:'white'}}
                    >
                      Access
                      <span className="material-icons ml-1">&#xe0da;</span>
                    </Button>
                  </NavLink>
              }
          </Typography>
        }
      </Grid>
    )
}

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
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
                <Typography variant='h6' noWrap>
                  <NavLink className="h7 nav-item nav-link text-light p-0" to="/dash">Trend Edge</NavLink>
                </Typography>
            </Grid>
        </Grid>

        <div className={classes.sectionMobile} style={{textAlign:'center'}}>
            {renderTopRight(userLogged, curRoute)}
        </div>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>

        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}

Dashboard.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default Dashboard