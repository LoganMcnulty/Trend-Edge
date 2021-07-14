import React from "react";
import { Chart } from "react-charts";

import useDemoConfig from "./useDemoConfig";
import ResizableBox from "./ResizableBox";
import "./styles.css";
import useWindowDimensions from './../windowDimensions';
const MultiAxisExample = () => {

  let { data, randomizeData } = useDemoConfig({
    series: 10,
  });

  console.log(data)
  
  data = React.useMemo(
    () =>
      data.map((d, i) =>
        i % 2 === 0
          ? {
              ...d,
              secondaryAxisID: "First Metric",
            }
          : {
              ...d,
              data: d.data.map((f) => ({
                ...f,
                secondary: f.secondary * 5,
              })),
              secondaryAxisID: "Second Metric",
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
        id: "First Metric",
        min: 0,
        position: "left",
      },
      {
        type: "linear",
        id: "Second Metric",
        min: 0,
        position: "right",
        format: (d) => `$${d}`,
      },
    ],
    []
  );
  const tooltip = React.useMemo(
    () => ({
      render: ({ datum, primaryAxis, getStyle }) => {
        return <CustomTooltip {...{ getStyle, primaryAxis, datum }} />;
      }
    }),
    []
  );
  return (
    <>
      <button onClick={randomizeData}>Randomize Data</button>
      <br />
      <br />
      <ResizableBox>
        <Chart data={data} series={series} axes={axes} tooltip />
      </ResizableBox>
    </>
  );
}
 
export default MultiAxisExample;

function CustomTooltip({ getStyle, primaryAxis, datum }) {
    const data = React.useMemo(
      () =>
        datum
          ? [
              {
                data: datum.group.map(d => ({
                  primary: d.series.label,
                  secondary: d.secondary,
                  color: getStyle(d).fill
                }))
              }
            ]
          : [],
      [datum, getStyle]
    );
    return datum ? (
      <div
        style={{
          color: "white",
          pointerEvents: "none"
        }}
      >
        <h3
          style={{
            display: "block",
            textAlign: "center"
          }}
        >
          {primaryAxis.format(datum.primary)}
        </h3>
        <div
          style={{
            width: "300px",
            height: "200px",
            display: "flex"
          }}
        >
          <Chart
            data={data}
            dark
            series={{ type: "bar" }}
            axes={[
              {
                primary: true,
                position: "bottom",
                type: "ordinal"
              },
              {
                position: "left",
                type: "linear"
              }
            ]}
            getDatumStyle={datum => ({
              color: datum.originalDatum.color
            })}
            primaryCursor={{
              value: datum.seriesLabel
            }}
          />
        </div>
      </div>
    ) : null;
  }