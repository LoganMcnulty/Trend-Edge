import React from "react";
import { Chart } from "react-charts";

import Grid from '@material-ui/core/Grid';
import useDemoConfig from "./useDemoConfig";
import "./styles.css";
import useWindowDimensions from './../windowDimensions';
// import Box from 'components/Box'

const MultiAxisGraph = ({graphData}) => {
  let data
  Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days)
    date.setHours(0,0,0,0);
    return date;
  }

  const teObjectData = graphData[0]['data'].map((d, i) => {
    var date = new Date(d[0]);
    return {
      primary:date.addDays(1),
      radius:null,
      secondary: d[1] === 0 ? .0000001 : d[1]
    }
  }
  )

  const priceObjectData = graphData[0]['data'].map((d, i) => {
    var date = new Date(d[0]);
    return {
      primary: date.addDays(1),
      radius:null,
      secondary: graphData[1]['data'][i][1]
    }
  }
  )

  const testObjectData = graphData[0]['data'].map((d, i) => {
    var date = new Date(d[0]);
    return {
      primary: date.addDays(1),
      radius:null,
      secondary: graphData[1]['data'][i][1]*.5
    }
  }
  )

  data = [
    {data:teObjectData}, 
    {data:priceObjectData},
  ]
  
  data = React.useMemo(
    () =>
      data.map((d, i) =>
        i % 2 === 0
          ? {
              ...d,
              secondaryAxisID: "Trend Edge",
            }
          : {
              ...d,
              data: d.data.map((f) => ({
                ...f,
                secondary: f.secondary,
              })),
              secondaryAxisID: "Price",
            }
      ),
    [data]
  );

  const series = React.useMemo(
    () => ({
      showPoints: false,
    }),
    []
  );

  const axes = React.useMemo(
    () => [
      { primary: true, type: "time", position: "bottom" },
      {
        type: "linear",
        id: "Trend Edge",
        hardMin: -5,
        hardMax:105,
        position: "left",
      },
      {
        type: "linear",
        id: "Price",
        min: 0,
        // hardMax: Math.round(priceObjectData[0]['secondary'] * 1.1),
        position: "right",
        format: (d) => `$${d}`,
      },
    ],
    []
  );

  const {height} = useWindowDimensions()

  return (
    <>
      <Grid item xs
        style={{
          height: `${height/3}px`,
          borderRadius: '5px',
      }}
      >
        <Chart data={data} series={series} axes={axes} tooltip dark/>
      </Grid>
    </>
  );
}
 
export default MultiAxisGraph;