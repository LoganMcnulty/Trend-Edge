// Out of House
import React, { useState, useEffect } from 'react'
import Row from 'react-bootstrap/Row'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';
import { useParams } from 'react-router-dom'
import DialogContent from '@material-ui/core/DialogContent';

// In House
import ServeToDash from '../common/serveToDash'
import {getTrendEdge, postAsset} from '../../services/assetService';
import Loading from "../common/loading/loading";

const settings = {
    'fastOverSlowWeight': 20,
    'adxWeight': 20,
    'fastSMA': 10,
    'fastWeight': 20,
    'lookback': 5,
    'macdWeight': 20,
    'slowSMA': 40,
    'slowWeight': 20
}

const AssetPage = () => {
    const [assetData, setAssetData] = useState('')
    const [dataRefresh, setDataRefresh] = useState(false)
    const { name } = useParams()
    useEffect(() => {
        try{
            Promise.all([getTrendEdge([name], settings)])
            .then(async response => {
                const resData = response[0].data[0]
                const today = new Date().getTime()
                const lastUpdate = new Date(resData['lastUpdated']).getTime()
                const dateDiff = ((today - lastUpdate) / (1000 * 3600 * 24))
                console.log("Last updated: " + dateDiff + " days ago.")
                if (dateDiff >= 1.00 || (resData.priceSeries.length <= 0)){
                    console.log(resData.name + ' needs an update')
                    setDataRefresh(true)
                    Promise.all([postAsset(name)]).then(async () => {
                        const resData = await getTrendEdge([name], settings)
                        setDataRefresh(false)
                        return setAssetData(resData['data'][0])
                    })
                }
                setAssetData(resData)
          })
        }
        catch(er){
          console.log('something went wrong')
        }
      }, [name]);


    return ( 
    <ServeToDash
        med={[8,4]}
        large={[8,2]}
        small={[12,0]}
    >
        <Paper className='p-3 m-0' style={{backgroundColor:"#4682B4"}}>
            <Row className="align-items-center justify-content-center text-center">
                <Typography variant="h4" className='text-light'>{assetData ? assetData.longName : 'Loading'}</Typography>
            </Row>
        </Paper>

        {!dataRefresh ? 
            <DialogContent className='p-0 m-0'>
            <ul className="list-group list-group-flush">
                <li className="list-group-item m-0 p-3">
                    <div className="d-flex flex-row justify-content-center p-0 m-0">
                        <p className='text font-weight-bold mr-1'>Trend Edge: </p>{assetData.trendEdge}% |
                        <p className='text font-weight-bold mr-1 ml-2'>Price: </p>${assetData.priceCurr}
                    </div>

                    <div className={buildClass(assetData.fastPosSlope)}>
                        <p className='text font-weight-bold mr-1'>{settings.fastSMA} Wk SMA: </p>
                        {assetData.fastPosSlope === 0 ? `Trending Dn at $${assetData.fastSMA}` : assetData.fastPosSlope  === 1 ?  `Trending Up at $${assetData.fastSMA}` : 'Unavailable'}
                    </div> 

                    <div className={buildClass(assetData.slowPosSlope)}>
                        <p className='text font-weight-bold mr-1'>{settings.slowSMA} Wk SMA: </p>
                        {assetData.slowPosSlope === 0 ? `Trending Dn at $${assetData.slowSMA}` : assetData.slowPosSlope  === 1 ?  `Trending Up at $${assetData.slowSMA}` : 'Unavailable'}
                    </div>

                    <div className={buildClass(assetData.macdPosSlope)}>
                        <p className='text font-weight-bold mr-1'>MACD: </p>{assetData.macd ? assetData.macdPosSlope  === 1 ? `Trending Up` : `Trending Dn` : 'Unavailable'}
                    </div>

                    <div className={buildClass(assetData.slowPosSlope)}>
                        <p className='text font-weight-bold mr-1'>ADX: </p>{assetData.adx ? assetData.slowPosSlope  === 1 ? `${assetData.adx}%` : `Not Applied` : 'Unavailable'}
                    </div>

                    <div className= "d-flex flex-row justify-content-center p-0 m-0 text-info">
                        <p className='text font-weight-bold mr-1'>{assetData.volumeAvg ? `This Week's Volume is
                            ${Math.round(assetData.volumeCurr / assetData.volumeAvg *100)}% of the 10 Week Average` : 'Volume data unavailable' }</p>
                    </div>

                    <div className= "row justify-content-end p-0 m-0 text-dark" style={{fontSize:'10px'}}>
                        <p className='font-weight-bold p-0 mr-1' style={{fontSize:'12px'}}>Last Updated: </p> {new Date(assetData['lastUpdated']).toLocaleDateString('en-US')}
                    </div>

                </li>

                {/* <li className="list-group-item m-0 mt-1 p-0">
                    <LineGraph data={assetData.data} />
                    <div className="d-flex flex-row justify-content-left allign-items-center p-0 m-0">
                    <p className='text font-weight-bold mr-1'>Months Since IPO: </p>{Math.round(assetData.daysSinceIPO / 30.417)}
                    </div>
                </li> */}

            </ul>
            </DialogContent>
        :
        <Loading type={'bars'}/>
    }

    </ServeToDash>
    
    );
}
 
export default AssetPage;

const buildClass = (code) => {
    let base = "d-flex flex-row justify-content-center allign-items-center p-0 m-0"
    if (code===1) return base += ' text-success'
    return base += ' text-danger'
  }