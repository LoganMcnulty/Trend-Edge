// Out of house
import React, { useState, useEffect } from 'react'
import { Chart } from 'react-charts'
 
// In house
import useWindowDimensions from './../common/windowDimensions';

const LineGraph = () => {
    const {height, width} = useWindowDimensions()
    
    const randomPriceSeries = () => {
        const N = 80;
        let price = 100
        const upMove = 1.04
        const downMove = .975
        const pseudoPriceData = []
        const timeArray = Array.from({length: N}, (_, index) => index + 1);

        for (let i = 0; i < timeArray.length; i++) {
          let dataPoint = []
          dataPoint.push(i)
          
          if (Math.random() < 0.5) price *= upMove
          else price *= downMove

          dataPoint.push(price)
          pseudoPriceData.push(dataPoint)
        }
        return pseudoPriceData
    }
    const [pseudoPriceData, setPseudoPriceData] = useState(randomPriceSeries());


    useEffect( () => {
      // setInterval(() => {
      //   console.log("update")
      //   const newData =  randomPriceSeries()
      //   console.log(newData)
      //   setPseudoPriceData(newData)
      //   console.log(pseudoPriceData)
      // }, 7000);
      // return () => clearInterval(interval);
    }, []);

    const handleClick = () => {
      const newData =  randomPriceSeries()
      console.log(newData)
      setPseudoPriceData(newData)
      console.log(pseudoPriceData)
    }

    // useEffect(() => {
    //   setTime()
    // }, []);

    // function setTime() {
    //     let x = 0
    //     setInterval(function() {
    //       console.log('update data...')
    //       setPseudoPriceData(randomPriceSeries())
    //       console.log(pseudoPriceData)
    //     }, 5000);
    // }

    

    const movingAvgs = (pseudoPriceData, sma) => {
        const dataPoints = []
        const priceOnly = pseudoPriceData.map(item => item[1])
        for (let i=pseudoPriceData.length; i > sma; i--){
            let dataPoint = []
            const thisSMASeries = priceOnly.slice( i-1-sma, i-1)
            let seriesSum = 0
            for (let i =0; i < thisSMASeries.length; i++){
                seriesSum += thisSMASeries[i]
            }

            dataPoint.push(i-1)
            dataPoint.push(seriesSum/sma)
            dataPoints.push(dataPoint)
        }
        return dataPoints
    }

    let data = React.useMemo(

        () => [
          {
            label: 'Px (t)',
            data: pseudoPriceData
          },
          {
            label: '10 wk SMA',
            data: pseudoPriceData ? movingAvgs(pseudoPriceData, 10) : []
          },
          {
            label: '40 wk SMA',
            data: pseudoPriceData ? movingAvgs(pseudoPriceData, 40) : []
          }
        ],
        []
      )

     
      const axes = React.useMemo(
        () => [
          { primary: true, type: 'linear', position: 'bottom' },
          { type: 'linear', position: 'left' }
        ],
        []
      )

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