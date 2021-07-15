import React from 'react';
import { makeStyles,  withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: '#fc5a3d',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
}));

const StyledButton = withStyles({
  root: {
    background: '#4682B4',
    '&:hover': {
      background: '#3F75A2'
    },
    color:'white'
  },
})(Button);

const FunctionButton = ({btnContent, status, btnFunction, size=''}) => {
  const {busy, dataRetrieved} = status
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (busy) setLoading(true);
    if (!busy) setLoading(false);
  },[busy, dataRetrieved]);

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <StyledButton
          size='small'
          variant="contained"
          disabled={loading}
          onClick={(e) => btnFunction(e)}
        >
            {btnContent}
        </StyledButton>
        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
    </div>
  );
}
 
export default FunctionButton;