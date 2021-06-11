export const movingAvgs = (pseudoPriceData, sma) => {
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
