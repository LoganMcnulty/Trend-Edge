import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Slider, Input, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    width: 200,
    marginTop: 10
  },
});

const SliderInput = ({icon, fieldName, label, updateSettingsState, value, min=1, max=100}) => {
  const classes = useStyles();
  const [thisValue, setValue] = React.useState();

  useEffect(() => {
    try {
      if(!thisValue)setValue(value)
    } catch (ex) { }
  })

  const handleChange = (event, newValue) => {
    let eventValue = event.target.value
    if(eventValue){
      setValue(eventValue);
      updateSettingsState(fieldName, parseInt(eventValue));
    }
    else{
      setValue(newValue);
      updateSettingsState(fieldName, parseInt(newValue));
    }
  }

  return (
    <div className={classes.root}>
      <Typography id="continuous-slider" gutterBottom>
        {label}
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
          {icon}
        </Grid>
        <Grid item xs>
          <Slider
          min={min}
          max={max}
          value={thisValue ? thisValue : 10} 
          onChange={handleChange}
          ria-labelledby="continuous-slider" />
        </Grid>
        <Grid item>
          <Input
              value={thisValue ? thisValue : 10}
              margin="dense"
              onChange={handleChange}
              style={{ width: 50 }}
              // onBlur={() => handleBlur}
              inputProps={{
                step: 1,
                min: min,
                max: max,
                type: 'number',
                'aria-labelledby': 'input-slider',
              }}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default SliderInput