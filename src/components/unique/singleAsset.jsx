// Out of House
import React, { useState, useEffect } from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';
import { useParams } from 'react-router-dom'
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import {Redirect} from 'react-router-dom'
import {NavLink } from "react-router-dom";
import Row from 'react-bootstrap/Row'

// In House
import ServeToDash from '../common/serveToDash'
import {getTrendEdge, postAsset, getTrendEdgeHistorical} from '../../services/assetService';
import Loading from "../common/loading/loading";
import {getUser} from '../../services/userService'
import auth from '../../services/authService'
import {saveSettings} from '../../services/userService'
import MultiAxisGraph from '../common/graphs/multiAxisGraph'
import MultiAxisExample from '../common/graphs/multiAxisExample'


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

const AssetPage = (allAssetNames) => {
    const [assetData, setAssetData] = useState('')
    const [trendEdgeHistorical, setTrendEdgeHistorical] = useState(false)
    const [priceSeries, setPriceSeries] = useState(false)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(false)
    const [inWatchlist, setInWatchlist] = useState(false)
    // const autoFillAssetNames = allAssetNames['allAssetNames']

    const { name } = useParams()
    useEffect(() => {
        // console.log(autoFillAssetNames)
        try{
            Promise.all([auth.getCurrentUser()])
            .then( async response => {
                if (!response[0]) return
                const _id = response[0]._id
                console.log('Mounting User to Asset Page...')
                const {watchlist} = await getUser(_id)
                const user = {_id,watchlist}
                if (user['watchlist'].includes(name.toUpperCase())) setInWatchlist(true)
                return setUser(user)
            })
        }
        catch(err){return console.log("Error getting user, doesn't exist")}
        try{
            Promise.all([getTrendEdge([name], settings)])
            .then(async response => {
                try{
                    const resData = response[0].data[0]
                    const today = new Date().getTime()
                    const lastUpdate = new Date(resData['lastUpdated']).getTime()
                    const dateDiff = ((today - lastUpdate) / (1000 * 3600 * 24))
    
                    if (dateDiff >= 1.00 || (resData.priceSeries.length <= 0)){
                        console.log(resData.name + ' needs an update')
                        try{
                            Promise.all([postAsset(name)]).then(async () => {
                                console.log("Asset post complete")
                                const resData = await getTrendEdge([name], settings)
                                console.log("New trend edge received")
                                setAssetData(resData['data'][0])
                                setLoading(false)
                                const histData = await getTrendEdgeHistorical([name], settings)
                                console.log('Historical data retrieved')
                                setTrendEdgeHistorical(handleHistoricalData(histData))
                                return 
                            })
                        }
                        catch(err){
                            console.log(err)
                            console.log('Something went wrong posting this asset 👉' + name)
                            return <Redirect to="/"/>
                        }
                    }
                    else{
                        setAssetData(resData)
                        setLoading(false)
                        const histData = await getTrendEdgeHistorical([name], settings)
                        console.log('Historical data retrieved')
                        setTrendEdgeHistorical(handleHistoricalData(histData))
                        return 
                    }
                }
                catch(err){
                    console.log(err)
                    setAssetData('bad')
                    console.log("Likely invalid URL ")
                    return <Redirect to="/"/>
                }
          })
        }
        catch(er){
          return console.log('something went wrong')
        }
        
    }, [name]);



    const data = [
        {
            label: 'TrendEdge',
            data: trendEdgeHistorical
        },
        {
            label: 'Price',
            data: priceSeries ? priceSeries : []
        },
    ]

    const handleHistoricalData = (histData) => {
        try{
            const data = histData['data'][0]['trendEdgeVector']
            const trendEdgeSeries = []
            const priceSeries = []
            const warnings = []
            for (let i=0; i < data.length && i < 105; i++){
                if (data[i]['complete'] === true){
                    let date = new Date(data[i]['date'])
                    if (i > 0 && data[i]['date'] > data[i-1]['date']) {
                        warnings.push("Date out of order --> " + date + " / Index --> " + i)
                    }
                    else if (i > 0 && (diff_weeks(date,  new Date(data[i-1]['date'])) > 1)) {
                        warnings.push("Date too far --> " + date + " / Index --> " + i)
                    }
                    else if (i > 0 && (diff_weeks(date,  new Date(data[i-1]['date'])) < -1)) {
                        warnings.push("Date too far --> " + date + " / Index --> " + i)
                    }
                    else{
                        trendEdgeSeries.push([date, data[i]['value']])
                        priceSeries.push([date, data[i]['price']])
                    }
                }
            }
            if (warnings.length > 0) {
                console.log("--- Historical Data Scrubbing ---\n") 
                for (let warning in warnings) console.log(warnings[warning] + '\n')
            }
            setPriceSeries(priceSeries.slice(0, 104))
            return trendEdgeSeries.slice(0, 104)
            return trendEdgeSeries.slice(0, 104)

        }
        catch(err){
            console.log('error')
            setTrendEdgeHistorical([])
            return []
        }
      }

    const handleWatchlist = async () => {
        if(!inWatchlist) {
            user['watchlist'].push(name.toUpperCase())
            setUser(user)
            await saveSettings(user['_id'], user['watchlist'], 'watchlistAdd')
        }
        else{
            const newList = user['watchlist'].filter(e => e != name)
            user['watchlist'] = newList
            setUser(user)
            await saveSettings(user['_id'], user['watchlist'], 'watchlistRemove')
        }
        return setInWatchlist(!inWatchlist)
    }

    if (assetData === 'bad') return <Redirect to="/"/>
    return (
    <ServeToDash
        med={[8,4]}
        large={[8,2]}
        small={[12,0]}
    >
        <Paper className='p-3 m-0' style={{backgroundColor:"#4682B4"}}>
            {assetData ? 
                <div className="row align-items-center justify-content-center text-center"><Typography variant="h4" className='text-light'>${name.toUpperCase()}</Typography></div>
                : ''
            }
            <div className="row align-items-center justify-content-center text-center">
                <Typography variant="h6" className='text-light'>{assetData ? assetData.longName : 'Loading ⌛'}</Typography>
            </div>
        </Paper>
        {
            (loading === false) ? 
            <>
                <DialogContent className='p-0 m-0'>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item m-0 p-3">


                        <div className="d-flex flex-row justify-content-center p-0 m-0">
                            <p className='text font-weight-bold mr-1'>Trend Edge: </p>{assetData.trendEdge}% |
                            <p className='text font-weight-bold mr-1 ml-2'>Price: </p>${assetData.priceCurr}
                        </div>

                        <div className={buildClass(assetData.fastSMA.posSlope)}>
                            <p className='text font-weight-bold mr-1'>{settings.fastSMA} Wk SMA: </p>
                            {(assetData.fastSMA.value && assetData.fastSMA.posSlope === 0) ? `Trending Dn at $${assetData.fastSMA.value}` : assetData.fastSMA.posSlope  === 1 ?  `Trending Up at $${assetData.fastSMA.value}` : 'Unavailable'}
                        </div> 

                        <div className={buildClass(assetData.slowSMA.posSlope)}>
                            <p className='text font-weight-bold mr-1'>{settings.slowSMA} Wk SMA: </p>
                            {(assetData.slowSMA.value && assetData.fastSMA.posSlope === 0) ? `Trending Dn at $${assetData.slowSMA.value}` : assetData.slowSMA.posSlope  === 1 ?  `Trending Up at $${assetData.slowSMA.value}` : 'Unavailable'}
                        </div> 

                        <div className={buildClass(assetData.macd.posSlope)}>
                            <p className='text font-weight-bold mr-1'>MACD: </p>{assetData.macd.value && assetData.macd.posSlope  === 1 ? `Trending Up at ${assetData.macd.value}` : assetData.macd.posSlope  === 0 ? `Trending Dn  at ${assetData.macd.value}` : 'Unavailable'}
                        </div>

                        <div className={buildClass(assetData.slowSMA.posSlope)}>
                            <p className='text font-weight-bold mr-1'>ADX: </p>{assetData.adx && assetData.slowSMA.posSlope  === 1 ? `${assetData.adx}%` : `Not Applied`}
                        </div>

                        <div className= "d-flex flex-row justify-content-center p-0 m-0 text-dark">
                            <h5 className='text font-weight-bold mr-1'> - Volume Data - </h5>
                        </div>

                        <div className= "row justify-content-center text-center  p-0 m-0">
                        <p className='text font-weight-bold mr-1'>Current WK: </p>
                            {assetData.volume ? assetData.volume.currValue && assetData.volume.fastAverageValue ? `${(assetData.volume.currOverAverage * 100).toFixed(2)}% of the ${settings.fastSMA} wk Avg.` : 'Vol. data unavailable': 'Vol. data unavailable' }
                        </div>
                        
                        <div className= "row justify-content-center text-center  p-0 m-0">
                            <p className='text font-weight-bold mr-1'>Trend:</p>
                                {
                                assetData.volume.fastAverageLookbackValue && assetData.volume.fastAverageValue ? 
                                    assetData.volume.fastAverageLookbackValue < assetData.volume.fastAverageValue ? 
                                    `Up relative to ${settings.lookback} wks ago` :
                                    `Down relative to ${settings.lookback} wks ago` :
                                    'Vol. trend data unavailable'
                            }
                        </div>

                        <br></br>

                        <div className= "row justify-content-end p-0 m-0 text-dark" style={{fontSize:'10px'}}>
                            <p className='font-weight-bold p-0 mr-1' style={{fontSize:'12px'}}>Last Updated: </p> {new Date(assetData['lastUpdated']).toLocaleDateString('en-US')}
                        </div>

                    </li>
                </ul>
                </DialogContent>
                {
                    user ?
                    <Paper className='p-3 m-0' style={{backgroundColor:"#4682B4"}}>
                        <div className="row align-items-center justify-content-center">
                            {
                                user ? 
                                    inWatchlist ?
                                    <>
                                        <Typography variant='h6' style={{color:'white'}}>Watching ✔️ | </Typography>
                                        <Button 
                                            variant="contained" 
                                            style={{backgroundColor:'red', color:'white'}}
                                            onClick={handleWatchlist}
                                            className='ml-2'
                                        >
                                            <>
                                                Remove
                                                <span className="material-icons ml-1">&#xe8f5;</span>
                                            </>
                                        </Button> 
                                    </> :

                                    <>
                                        <Typography variant='h6' style={{color:'white'}}>Not Watching ❌ | </Typography>
                                        <Button 
                                            variant="contained" 
                                            style={{backgroundColor:'#5cb85c', color:'white'}}
                                            onClick={handleWatchlist}
                                            className='ml-2'
                                        >
                                            <>
                                                Add
                                                <span className="material-icons ml-1">&#xe8f4;</span>
                                            </>
                                        </Button> 
                                    </> :
                                    
                                    'sign'
                            }
                        </div>
                    </Paper>
                    :
                    <Paper className='p-3 m-0' style={{backgroundColor:"#4682B4"}}>
                        <div className="row align-items-center justify-content-center">
                            {
                                <>
                                    <Typography variant='h6' style={{color:'white', textAlign:'center'}}>Login to Build Your Watchlist
                                        <NavLink to={'/sign in'}  style={{ textDecoration: 'none' }} className='m-2'>
                                            <Button 
                                                variant="contained" 
                                                style={{backgroundColor:'#fc5a3d', color:'white'}}
                                            >
                                                <div className='row px-2'>
                                                    Access
                                                    <span className="material-icons ml-1">&#xe0da;</span>
                                                </div>
                                            </Button>
                                        </NavLink>
                                    </Typography>
                                    <Button 
                                        disabled={true}
                                        variant="contained" 
                                        style={{backgroundColor:'gray', color:'lightgray'}}
                                        onClick={handleWatchlist}
                                        className='m-2'
                                    >
                                        <>
                                            Add
                                            <span className="material-icons ml-1">&#xe8f4;</span>
                                        </>
                                    </Button> 
                                </> 
                            }
                        </div>
                    </Paper>
                }

            </>
            :
            <Loading type={'bars'}/>
        }

        <Paper className='px-5 py-2 mt-2 mb-5'
            style={{backgroundColor:'#192734',}}
        >
            {trendEdgeHistorical ? trendEdgeHistorical.length > 10 ? 
            <>
                <Row className="align-items-center justify-content-center text-center">
                    {assetData ? 
                        <div className="row align-items-center justify-content-center text-center"><Typography variant="h5" className='text-light'>${name.toUpperCase()} 2-Year</Typography></div>
                        : ''
                    }
                </Row>
                
                <Row className="align-items-center justify-content-center text-center">
                    <MultiAxisGraph graphData={data}/>
                </Row>
            </>
            :
            <Row className="align-items-center justify-content-center text-center">
                <Typography variant="h6">Trend Edge History Unavailable</Typography>
            </Row>: 
                <Loading type={'bars'}  bgColor={'#192734'}/>
            }
        </Paper>
    </ServeToDash>
    );
}
 
export default AssetPage;

const buildClass = (code) => {
    let base = "d-flex flex-row justify-content-center allign-items-center p-0 m-0"
    if(code===0) return base += ' text-danger'
    if (code===1) return base += ' text-success'
    return base += ' text-secondary'
  }

  function diff_weeks(dt2, dt1) 
  {
   var diff =(dt2.getTime() - dt1.getTime()) / 1000;
   diff /= (60 * 60 * 24 * 7);
   return Math.abs(Math.round(diff));
  }




