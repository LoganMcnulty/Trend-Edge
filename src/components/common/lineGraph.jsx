// Out of house
import React from 'react'
import { Chart } from 'react-charts'
// In house
import useWindowDimensions from './../common/windowDimensions';

const LineGraph = ({data, typeArg=''}) => {
  let type = 'linear'
  if (typeArg) {type = typeArg}

  const axes = React.useMemo(
    () => [
    { primary: true, 
      type: type,
      position: 'bottom'
    },
    { type: 'linear', position: 'left' },
    ],
    [type]
  )

  const {height, width} = useWindowDimensions()
    
  return (
      <div
        style={{
            width: `${width-50}px`,
            height: `${height/3}px`,
            padding: '0',
            background:"#192734"
        }}
      >
        <Chart className='w-80' data={data.reverse()} axes={axes} tooltip dark/>
      </div> 
  );
}
 
export default LineGraph;