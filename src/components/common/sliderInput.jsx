import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
    root: {
        width: 300,
    },
    });

const SliderInput = ({ name, label, error, ...rest }) => {
    console.log({...rest})
    const classes = useStyles();

  return (
    <div className="form-group">
        <div className={classes.root}>
            <Typography id="discrete-slider" gutterBottom>
                Fast SMA
            </Typography>
            <Slider
              min={1}
              max={10}
              step={1}
              {...rest} 
            >
            </Slider>
        </div>

      <label htmlFor={name}>{label}</label>
      <input 
        {...rest} 
        name={name} 
        id={name} 
        className="form-control" 
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>

  );
};

export default SliderInput;
