// Out of house
import React, { useState } from 'react'
import Paper from '@material-ui/core/Paper'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';

// In House
import ServeToDash from '../common/serveToDash'
import {removeUsers, emptyAssetDB, populateDatabase} from '../../services/adminService'
import {updateAssets, updateETFs} from '../../services/assetService'
import auth from '../../services/authService'
import AddUpdateTicker  from "./adminTickerTesting";
import TEAPITesting from './teAPITesting';
import PopulateDBcsv from './populateDBcsv'

const AdminDash = () => {
  const [updatingAssets, setUpdatingAssets] = useState(false);
  const [removingUsers, setUpdatingUsers] = useState(false);
  const [removingAssets, setRemovingAssets] = useState(false);
  const [populatingDatabase, setPopulatingDatabase] = useState(false);


  const handleUpdate = async type =>{
    if (type === 'updateAssets') {
      setUpdatingAssets(true)
      await Promise.all([updateAssets()])
      setUpdatingAssets(false)
    }
    else if (type === 'updateETFs') {
      console.log("Update ETFs")
      setUpdatingAssets(true)
      await Promise.all([updateETFs()])
      setUpdatingAssets(false)
    }
    else if (type === 'removeUsers'){
      if (window.confirm('Are you sure?')){
        setUpdatingUsers(true)
        const update = [removeUsers(auth.getCurrentUser())]
        Promise.all(update)
        .then(async res => {
          console.log(res)
          setUpdatingUsers(false)
        })
      }
    }
    else if (type === 'emptyDatabase'){
      if (window.confirm('Are you sure?')){
        setRemovingAssets(true)
        await emptyAssetDB()
        setRemovingAssets(false)
      }
    }
    else if (type === 'populateDatabase'){
      // if (window.confirm('Are you sure?')){
        setPopulatingDatabase(true)
        await populateDatabase()
        setPopulatingDatabase(false)
      // }
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
              {!updatingAssets ? '' : (updatingAssets === 'complete') ? 'Stocks update send, will take time. ' : 'Stocks Updating... '}
              {!removingUsers ? '' : (removingUsers === 'complete') ? 'Users Removed. ' : 'Removing Users... '}
              {!removingAssets ? '' : (removingAssets === 'complete') ? 'Assets Removed. ' : 'Removing Assets... '}

            </Typography>
          </Col>
        </Row>
      </Paper>

      <Paper elevation={3} className='p-3 mt-3 mx-0'>
        <div className="row justify-content-center">
          <div className="col-lg-6 col-sm-12 col-md-12">
            <CardContent className='p-2'>
              <div className="row m-0 p-0 justify-content-center align-items-center">
                <Typography variant="h5" className='text-center mb-1 mr-2'>Update/Add Ticker</Typography>
              </div>
              <div className="row m-0 p-0 justify-content-center align-items-center">
                <AddUpdateTicker/>
              </div>
            </CardContent>
          </div>

          <div className="col-lg-6 col-sm-12 col-md-12">
            <CardContent  className='p-2'>
              <div className="row m-0 p-0 justify-content-center align-items-center">
                <Typography variant="h5" className='text-center mb-1 mr-2'>Test TE API</Typography>
              </div>
              <div className="row m-0 p-0 justify-content-center align-items-center">
                <TEAPITesting />
              </div>
            </CardContent>
          </div>
        </div>


        <div className="row justify-content-center">

        <div className="col-lg-6 col-sm-12 col-md-12">
            <CardContent className='p-2'>
              <div className="row m-0 p-0 justify-content-center align-items-center">
                <div className="row m-0 p-0 justify-content-center align-items-center">
                  <Typography variant="h5" className='text-center mb-1 mr-2'>Empty Asset Database</Typography>
                </div>
                <button
                  onClick = {() => handleUpdate('emptyDatabase')}
                  className="btn btn-danger btn-block" 
                >
                  Clear Assets
                  <span className="material-icons ml-1 p-0">&#xe16c;</span>
                </button>
              </div>
            </CardContent>
          </div>

          <div className="col-lg-6 col-sm-12 col-md-12">
            <CardContent className='p-2'>
              <div className="row m-0 p-0 justify-content-center align-items-center">
                <div className="row m-0 p-0 justify-content-center align-items-center">
                  <Typography variant="h5" className='text-center mb-1 mr-2'>Populate all listed tickers (no performance data)</Typography>
                </div>
                <PopulateDBcsv/>
                {/* <button
                  onClick = {() => handleUpdate('populateDatabase')}
                  className="btn btn-info btn-block" 
                >
                  Populate DB
                  <span className="material-icons ml-1 p-0">&#xe97a;</span>
                </button> */}
              </div>
            </CardContent>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-6 col-sm-12 col-md-12">
            <CardContent  className='p-2'>
              <div className="row m-0 p-0 justify-content-center align-items-center">
              <div className="row m-0 p-0 justify-content-center align-items-center">
                <Typography variant="h5" className='text-center mb-1 mr-2'>Update All Stocks in Watchlists</Typography>
              </div>
                <button 
                  onClick = {() => handleUpdate('updateAssets')}
                  className="btn btn-info btn-block" 
                  >Update DB Stock Data
                </button>
              </div>
            </CardContent>
          </div>

          <div className="col-lg-6 col-sm-12 col-md-12">
            <CardContent className='p-2'>
              <div className="row m-0 p-0 justify-content-center align-items-center">
                <div className="row m-0 p-0 justify-content-center align-items-center">
                  <Typography variant="h5" className='text-center mb-1 mr-2'>Remove All Users</Typography>
                </div>


                <button
                  onClick = {() => handleUpdate('removeUsers')}
                  className="btn btn-danger btn-block" 
                >Remove All Users
                </button>
              </div>
            </CardContent>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-6 col-sm-12 col-md-12">
            <CardContent  className='p-2'>
              <div className="row m-0 p-0 justify-content-center align-items-center">
                <div className="row m-0 p-0 justify-content-center align-items-center">
                  <Typography variant="h5" className='text-center mb-1 mr-2'>Update All ETFs</Typography>
                </div>
                <button 
                  onClick = {() => handleUpdate('updateETFs')}
                  className="btn btn-info btn-block" 
                  >Update Data
                </button>
              </div>
            </CardContent>
          </div>
        </div>

      </Paper>
    </ServeToDash>
   );
}
 
export default AdminDash;