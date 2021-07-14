// Out of House
import React, { useState, useEffect } from 'react'
import Row from 'react-bootstrap/Row'
import Card from '@material-ui/core/Card'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";
import CardHeader from '@material-ui/core/CardHeader';

// In House
import ServeToDash from '../common/serveToDash'
import LineGraph from '../common/lineGraph'
import InfoList from '../common/infoList'
import InfoModal from '../common/infoModal'
import auth from '../../services/authService';
import SearchAutoFill from '../common/searchAutoFill'
// import AssetCard from '../common/assetCard'
import {getWLAssetNames, getTrendEdge} from '../../services/assetService'
import LeaderAccordion from './leaderAccordion'
import Loading from "../common/loading/loading";
import {getUser} from '../../services/userService'

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

const LandingContent = (allAssetNames) => {
    let history = useHistory();
    const [isActive, setIsActive] = useState(true);
    const [user, setUser] = useState()
    const [searchInput, setSearchInput] = useState('')
    const [isMounted, setIsMounted] = useState(true)
    const [wlAssetData, setWLAssetData] = useState(null)

    const autoFillAssetNames = allAssetNames['allAssetNames']
    
    function toggle() {
      if (!isActive)setPseudoPriceData(randomPriceSeries())
      setIsActive(!isActive);
    }

    const retrieveAssetData = async () => {
        const resOne = await getWLAssetNames()
        const assetData = await getTrendEdge(resOne['data'], settings)
        setWLAssetData(assetData['data'].slice(0, 20))
        try{
            Promise.all([auth.getCurrentUser()])
            .then( async response => {
                if (!response[0]) return
                const _id = response[0]._id
                console.log('Mounting User to Landing Page...')
                const {watchlist} = await getUser(_id)
                const user = {_id,watchlist}
                setUser(user)
            })
        }
        catch(err){return console.log("Error getting user, doesn't exist")}
        setIsMounted(false)
    }
    
    useEffect(() => {
        console.log("Landing Page Mounted")

        if (isMounted) retrieveAssetData()

        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
            setPseudoPriceData(randomPriceSeries())
            }, 3000);
        } else if (!isActive) {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval)
            setIsMounted(false)
        }

    }, [isActive, isMounted]);
  
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

    const handleChange = e => setSearchInput(e)

    const handleSubmit = ticker => {
        const search = ticker.toUpperCase()
        if (autoFillAssetNames.includes(search)) {
            return history.push(`/asset/${search}`);
        }
        console.log("Input not in list")
    }
  
    const [pseudoPriceData, setPseudoPriceData] = useState(randomPriceSeries());
  
    const data = [
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
    ]
  
    return (
        <ServeToDash
            med={[8,4]}
            large={[8,2]}
            small={[12,0]}
        >
            <div className="card" style={{border:'none'}}>
                <div className="card-header text-center text-light" style={{backgroundColor:'#192734'}}>
                    <Typography variant="h4">Welcome 📈</Typography>
                </div>
                <div v="card-body">
                    <SearchAutoFill
                        handleSubmit={handleSubmit}
                        searchList={autoFillAssetNames}
                        handleChange={handleChange}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-6">
                    <Paper className='p-3 mt-4'>
                        {wlAssetData ?
                        <Row className="align-items-center justify-content-center text-center">
                            <LeaderAccordion
                                topTwentyData={wlAssetData}
                                user={user}
                            />
                        </Row>
                        : <Loading/>}
                    </Paper>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6">
                    <div className="card mt-4" style={{border:'none', backgroundColor:'#192734'}}>
                    <div className="card-header text-center text-light justify-content-around flex" style={{border:'none', backgroundColor:'#192734'}}>
                        <Button 
                            variant="contained" 
                            style={{backgroundColor:'#fc5a3d', color:'white'}}
                            className={`${isActive ? 'active' : 'inactive'}`}
                            onClick={toggle}
                        >
                            <div  className='row px-2'>
                                {isActive ? 
                                <>
                                    Pause
                                    <span className="material-icons ml-1">&#xe034;</span>
                                </>
                                :
                                <>
                                    Play
                                    <span className="material-icons ml-1">&#xe037;</span>
                                </>
                                }
                            </div> 
                        </Button>
                        <InfoModal 
                            buttonContent={
                                <>
                                    <div className='row px-2'>
                                        About
                                        <span className="material-icons ml-1">&#xeb40;</span>
                                    </div>
                                </>
                            }
                            title={'Randomly Generated Price Action'}
                            content={
                                <>
                                    <InfoList
                                        title={'Randomly Generated Price Action'}
                                        listContent={[
                                            'The graph pictured represents randomly generated price action.', 
                                            'Even random patterns can look familiar.', 
                                            'Patterns appear in markets due to a variety of factors, including random chance.'
                                        ]}
                                        footer={"Trend Edge provides trend statistics that iron out the randomness of markets."}
                                        linkTo = {user ? '' : '/Sign In'}
                                        linkTitle = {user ? '' : 'Access'}
                                        icon={<span className="material-icons ml-1">&#xe0da;</span>}
                                    />
                                </>
                                }
                        />
                    </div>
                    <div className="card-body text-center">
                        <Row className="align-items-center justify-content-center text-center">
                            <LineGraph data={data}/>
                        </Row>
                        <Row className="align-items-center justify-content-center text-center">
                            <div className = 'card-text text-light'>t (weeks)</div>
                        </Row>
                    </div>
                </div>
                </div>
            </div>

            <Paper className='p-3 my-4'>
                <Row className="align-items-center justify-content-center text-center">
                    <Typography variant="subtitle1" className='font-weight-bold col-lg-12'> - Trend Edge is in Beta 🛠️ - </Typography>
                </Row>
                <Row className="align-items-center justify-content-center text-center">
                    <Typography variant="subtitle2">Optimized for use on Mobile Phones</Typography>
                </Row>
                <Row className="align-items-center justify-content-center text-center">
                    <Typography variant="subtitle2">Clear cookies for frequent updates</Typography>
                </Row>
            </Paper>
        </ServeToDash>
     );
}
 
export default LandingContent;
