// Out of House
import React, { Component } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';

// In House
import ServeToDash from '../common/serveToDash'
import LineGraph from '../common/lineGraph'
// import Demo from '../common/newCharts'
// import useWindowDimensions from './../common/windowDimensions';

const LandingContent = () => {
    // const dimensions = useWindowDimensions()
    return ( 
        <ServeToDash
        med={[8,4]}
        large={[6,0]}
        >
            <Paper className='p-3 m-0'>
                <Row className="align-items-center justify-content-center text-center">
                    {/* <Col className="col-6 p-0"> */}
                    <Typography variant="h4" gutterBottom>
                        Welcome To Trend Edge 📈
                    </Typography>
                    {/* </Col> */}
                </Row>
            </Paper>

            <Paper className='px-5 py-2 mt-2'>
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
                    <LineGraph/>
                </Row>
                <Row className="align-items-center justify-content-center text-center">
                    <div className = 'card-text'>t (weeks)</div>
                </Row>
            </Paper>
            {/* <Paper className='px-5 py-2 mt-2'>
                <Demo 
                    dimensions={dimensions}
                />
            </Paper> */}
        </ServeToDash>

     );
}
 
export default LandingContent;
