import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { lightBlue, green, purple } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: lightBlue[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
    // style={{backgroundColor: '#4682B4', border: '4px solid #6c757d'}}
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: purple[500],
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#4682B4',
    },
  },
});

export default function CircularIntegration({title, status, type, onClick, icon=''}) {
  const {busy, dataRetrieved, errors} = status
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  React.useEffect(() => {
    if (busy) setLoading(true);
    if (!busy) setLoading(false);
    if (dataRetrieved) setSuccess(true)
  // })
  },[busy, dataRetrieved]);

  return (
    <div className={classes.root}>

    {type==='fullButton' ? 
      <div className={classes.wrapper}>
        <ThemeProvider theme={theme}>
          <Button
            variant="contained"
            color="secondary"
            disabled={loading}
            onClick={onClick}
            startIcon={icon === 'save' ? <SaveIcon /> : ''}
          >
          {errors ? 'Try Again' : title}
        </Button>
        </ThemeProvider>
        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
    : 
      <div className={classes.wrapper}>
        <Fab
          aria-label="save"
          color="primary"
          className={buttonClassname}
          onClick={onClick}
        >
          {success ? <CheckIcon /> : <SaveIcon />}
        </Fab>
        {loading && <CircularProgress size={68} className={classes.fabProgress} />}
      </div>
    }
    </div>
  );
}