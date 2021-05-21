// Out of house
import React from 'react'
import { Chart } from 'react-charts'
 
// In house
import useWindowDimensions from './../common/windowDimensions';

const LineGraph = ({data, axes}) => {

  const {height, width} = useWindowDimensions()
    
  return (
      <div
        style={{
            width: `${width-50}px`,
            height: `${height/3}px`,
            padding: '0'
        }}
      >
        <Chart className='w-80' data={data} axes={axes}/>
      </div> 
  );
}
 
export default LineGraph;