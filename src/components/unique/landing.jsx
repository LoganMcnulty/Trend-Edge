// Out of House
import React, { useState, useEffect } from 'react'
import Row from 'react-bootstrap/Row'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
// import {NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";

// In House
import ServeToDash from '../common/serveToDash'
import LineGraph from '../common/lineGraph'
import InfoList from '../common/infoList'
import InfoModal from '../common/infoModal'
import auth from '../../services/authService';
import SearchAutoFill from '../common/searchAutoFill'

const LandingContent = (allAssetNames) => {
    let history = useHistory();
    const [isActive, setIsActive] = useState(true);
    const [user, setUser] = useState(auth.getCurrentUser())
    const [searchInput, setSearchInput] = useState('')

    const autoFillAssetNames = allAssetNames['allAssetNames']
    
    function toggle() {
      if (!isActive)setPseudoPriceData(randomPriceSeries())
      setIsActive(!isActive);
    }
    
    useEffect(() => {
        console.log("Landing Page Mounted")
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
            setPseudoPriceData(randomPriceSeries())
            }, 3000);
        } else if (!isActive) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive]);
  
      
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
            <Paper className='p-3 m-0'>
                <Row className="align-items-center justify-content-center text-center">
                    <Typography variant="h4">Welcome 📈</Typography>
                </Row>
                <div className="d-flex justify-content-around align-items-center">
                    <SearchAutoFill
                        handleSubmit={handleSubmit}
                        searchList={autoFillAssetNames}
                        handleChange={handleChange}
                    />
                </div>
        </Paper>

            <Paper className='px-5 py-2 mt-2'>
                <Row className='justify-content-around mb-2'>
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
                                        'One may "recognize" a pattern that is similar to an asset in their watchlist.', 
                                        'Patterns appear in markets due to a variety of factors, including random chance.'
                                    ]}
                                    footer={"Trend Edge provides trend statistics that iron out the short-term randomness of markets."}
                                    linkTo = {user ? '' : '/Sign In'}
                                    linkTitle = {user ? '' : 'Access'}
                                    icon={<span className="material-icons ml-1">&#xe0da;</span>}
                                />
                            </>
                            }
                    />
                </Row>
                
                <div
                    style={{position:'absolute', left:'0', 
                    top: '50%'
                }}
                className='card-text ml-1'
                >
                    Px (t)
                </div>
                <Row className="align-items-center justify-content-center text-center">
                    <Typography variant="h6" gutterBottom>$RNDM</Typography>
                </Row>
                
                <Row className="align-items-center justify-content-center text-center">
                    <LineGraph data={data}/>
                </Row>
                <Row className="align-items-center justify-content-center text-center">
                    <div className = 'card-text'>t (weeks)</div>
                </Row>
            </Paper>
        </ServeToDash>

     );
}
 
export default LandingContent;
