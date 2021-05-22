// Out of house
import React, { useState } from 'react'
import Paper from '@material-ui/core/Paper'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Typography from '@material-ui/core/Typography';

// In House
import ServeToDash from '../common/serveToDash'
import {removeUsers} from '../../services/adminService'
import {updateAssets} from '../../services/assetService'
import auth from '../../services/authService'
import  TickerInput  from "./submitTickerData";
import TEAPITesting from './teAPITesting';

const AdminDash = () => {
  const [updatingAssets, setUpdatingAssets] = useState(false);
  const [removingUsers, setUpdatingUsers] = useState(false);

  const handleUpdate = async type =>{
    if (type === 'updateAssets') {
      setUpdatingAssets(true)
      await Promise.all([updateAssets()])
      setUpdatingAssets('complete')
    }
    else if (type === 'removeUsers'){
      let yes = window.confirm('Are you sure?')
      if (yes){
        setUpdatingUsers(true)
        // updatingStocks = true
        const update = [removeUsers(auth.getCurrentUser())]
        Promise.all(update)
        .then(async res => {
          console.log(res)
          setUpdatingUsers('complete')
        })
      }
    }
  }

  return ( 
      <ServeToDash
      large={[8,1]}
      med={[8,4]}
      small={[12,0]}
    >
      <Paper elevation={3} className='p-3 m-0'>
        <Row className="align-items-center justify-content-around text-center">
          <Col className="col-12">
            <Typography variant="h4" gutterBottom>
              Admin Dashboard
            </Typography>
          </Col>
        </Row>
        
        <Row className="d-flex flex-row ht-3 ">
          <Col>
            <Typography variant="h5" >
              Status:
            </Typography>
          </Col>
          <Col>
            <Typography variant="h6" >
              {!updatingAssets ? '' : (updatingAssets === 'complete') ? 'Stocks Updated. ' : 'Stocks Updating. '}
              {!removingUsers ? '' : (removingUsers === 'complete') ? 'Users Removed. ' : 'Removing Users. '}
            </Typography>
          </Col>
        </Row>
      </Paper>

      <Paper elevation={3} className='p-3 mt-3 mx-0'>
          <Row className="align-items-top justify-content-around text-center mt-3">
            <Col className="col-sm-12 col-lg-4 col-md-12 mt-0">
              <Typography variant="h5" >Update An Asset</Typography>
              <TickerInput
                orientation={'x'}
                icon={'save'}
              />
            </Col>
            <Col className="col-sm-12 col-lg-4 col-md-12 mt-0">
              <Typography variant="h5" >Test Trend Edge API</Typography>
              <TEAPITesting/>
            </Col>
          </Row>

          <Row className="align-items-center justify-content-around text-center mt-3">
            <Col className="col-sm-12 col-lg-4 col-md-12 mt-2">
                <Typography variant="h5" >DB Functions</Typography>
                <Row className="align-items-center justify-content-around text-center mt-3">
                  <Col className="col mt-0">
                    <Typography variant="h4" gutterBottom>
                      <button 
                        onClick = {() => handleUpdate('updateAssets')}
                        className="btn btn-warning btn-block" 
                        >Update DB Stock Data
                      </button>
                    </Typography>
                  </Col>
                </Row>
                <Row className="align-items-center justify-content-around text-center">
                  <Col className="col-sm-12 col-lg-6 col-md-8 mt-0">
                    <Typography variant="h4" gutterBottom>
                      <button
                        onClick = {() => handleUpdate('removeUsers')}
                        className="btn btn-danger btn-block" 
                        
                      >Remove All Users
                      </button>
                    </Typography>
                  </Col>
                </Row>
              </Col>
          </Row>

      </Paper>
    </ServeToDash>
   );
}
 
export default AdminDash;