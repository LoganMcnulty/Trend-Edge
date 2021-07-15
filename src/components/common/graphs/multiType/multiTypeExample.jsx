// out of house
import React from "react";
import { Chart } from "react-charts";
import Grid from '@material-ui/core/Grid';

// in house
import "./styles.css";
import useWindowDimensions from './../../windowDimensions';

const MultiTypeExample = ({graphData}) => {
  Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days)
    date.setHours(0,0,0,0);
    return date;
}
  console.log(graphData)
  const volumeObjectData = graphData[0]['data'].map((d, i) => {
    var date = new Date(d[0]);
    return {
      primary:date.addDays(1),
      radius:null,
      secondary: graphData[2]['data'][i][1]
    }
  }
  )
  const avgVolumeObjectData = graphData[0]['data'].map((d, i) => {
    var date = new Date(d[0]);
    return {
      primary: date.addDays(1),
      radius:null,
      secondary: graphData[3]['data'][i][1]
    }
  }
  )
  const finalData = [{ label:'Avg Vol.', data:avgVolumeObjectData}, {label:'Volume', data:volumeObjectData}]
  let data = finalData
  console.log(data)
  
  const series = React.useCallback(
    (s, i) => ({
      type:
      i % 2 === 0
          ? "area"
          : "bar"
    }),
    []
  );

  const axes = React.useMemo(
    () => [
      { primary: true, position: "bottom", type: "time" },
      { position: "left", type: "linear", min: 0 }
    ],
    []
  );
  const {height, width} = useWindowDimensions()

  return (
    <>
      <Grid item xs
        style={{
          width: `${width-50}px`,
          height: `${height/3}px`,
          borderRadius: '5px',
      }}
      >
        <Chart data={data} series={series} axes={axes} tooltip dark/>
      </Grid>
    </>
  );
}

export default MultiTypeExample
