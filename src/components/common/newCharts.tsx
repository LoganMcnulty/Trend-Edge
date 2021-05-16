import React, { Component } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine, ReferenceArea,
  ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area,
  Label, LabelList } from 'recharts';
import { scalePow, scaleLog } from 'd3-scale';
import { changeNumberOfData } from './utils/utils';
import * as _ from 'lodash';
import randomPriceSeries from './randPriceObject'

console.log(randomPriceSeries())

const data02 = randomPriceSeries()

// const data02 = [
//   { price: 300, time: 1 },
//   { price: 400, time: 2 },
//   { price: 500, time: 3 },
//   { price: 600, time: 4 },
//   { price: 700, time: 5 },
//   { price: 800, time: 6 },
//   { price: 900, time: 7 },
// ];

const initialState = {
  data02,
  opacity: 1,
  anotherState: false,
};


export default class Demo extends Component<any, any> {

  static displayName = 'LineChartDemo';

  state: any = initialState;

  handleChangeData = () => {
    this.setState(() => _.mapValues(initialState, changeNumberOfData));
  };

  handleClick = (data: any, e: React.MouseEvent) => {
    console.log(data);
  };

  handleLineClick = (data: any, e: React.MouseEvent) => {
    console.log('callback', data, e);
  };

  handleLegendMouseEnter = () => {
    this.setState({
      opacity: 0.5,
    });
  };

  handleClickDot = (data: any, e: React.MouseEvent) => {
    console.log('dot click', data, e);
  }

  handleLegendMouseLeave = () => {
    this.setState({
      opacity: 1,
    });
  };

  handleChangeAnotherState = () => {
    this.setState({
      anotherState: !this.state.anotherState,
    });
  };

  render() {
    const {height, width} = this.props.dimensions
    const { data, data01, data02, opacity } = this.state;

    return (
      <div className="line-charts">
        <br />

        <p>A simple LineChart with fixed domain y-axis</p>
        <div className="line-chart-wrapper">
          <LineChart 
            width= {width-50}
            height= {height/3}
          data={data02}>
            <CartesianGrid stroke="#f5f5f5" fill="#e6e6e6" />
            {/* <Legend
              onMouseEnter={this.handleLegendMouseEnter}
              onMouseLeave={this.handleLegendMouseLeave}
            /> */}
            <XAxis type="number" dataKey="time" height={40}>
              <Label value="Time" position="insideBottom" />
            </XAxis>
            <YAxis type="number"  width={80}>
              <Label value="Price" position="insideLeft" angle={90} />
            </YAxis>
            <Line
              key="price"
              type="monotone"
              dataKey="price"
              stroke="#ff7300"
              strokeOpacity={opacity}
              strokeDasharray="3 3"
            >
            </Line>
          </LineChart>
        </div>

      </div>
    );
  }
}
