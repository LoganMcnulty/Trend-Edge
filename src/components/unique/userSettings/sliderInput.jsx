import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Slider, Input, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    width: 200,
    marginTop: 10
  },
});

const SliderInput = ({icon, fieldName, label, updateSettingsState, startingValue, min=1, max=100}) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(5);

  useEffect(() => {
    try {
      if(startingValue )setValue(startingValue)
    } catch (ex) { }
  }, [])

  const handleChangeSlider = (event, newValue) => {
    if(newValue<min) newValue = min
    if(newValue>max) newValue = max
    console.log(newValue)
    setValue(newValue);
    updateSettingsState(fieldName, parseInt(newValue));
  };

  const handleChangeInput = (event, newValue) => {
    let value = event.target.value
    if(value<min) {
      console.log('true')
      value = min}
    if(value>max) value = max
    setValue(value);
    updateSettingsState(fieldName, parseInt(value));
  };

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
          value={value} 
          onChange={handleChangeSlider}
          ria-labelledby="continuous-slider" />
        </Grid>
        <Grid item>
          <Input
              value={value}
              margin="dense"
              onChange={handleChangeInput}
              style={{ width: 50 }}
              inputProps={{
                step: 2,
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