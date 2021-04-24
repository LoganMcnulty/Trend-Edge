// Out of house
import React, { useState, useEffect } from 'react'
import Paper from '@material-ui/core/Paper'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Typography from '@material-ui/core/Typography';

// In House
import ServeToDash from '../common/serveToDash'
import {updateStocks, removeUsers} from '../../services/adminService'
import auth from '../../services/authService'

const AdminDash = () => {
  const [updatingStocks, setUpdatingStocks] = useState(false);
  const [removingUsers, setUpdatingUsers] = useState(false);

  const handleUpdate = (type) =>{
    if (type === 'updateStocks') {
      setUpdatingStocks(true)
      // updatingStocks = true
      const update = [updateStocks(auth.getCurrentUser())]
      Promise.all(update)
      .then( async (response) => {
        const res = response[0]
        console.log(res)
        setUpdatingStocks('complete')
      })
    }
    else if (type === 'removeUsers'){
      let confirm = alert('Are you sure?')
      if (confirm){
        setUpdatingUsers(true)
        // updatingStocks = true
        const update = [removeUsers(auth.getCurrentUser())]
        Promise.all(update)
        .then( async (response) => {
          const res = response[0]
          console.log(res)
          setUpdatingUsers('complete')
        })
      }
    }
  }

  return ( 
      <ServeToDash
      large={[6,0]}
      med={[12,0]}
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
        <Row className="align-items-center justify-content-around text-center ht-3 ">
          <Col className="col-6">
            <Typography variant="h4" gutterBottom>
              <button 
                onClick = {() => handleUpdate('updateStocks')}
                className="btn btn-warning btn-block " 
                style={{ border: '4px solid #6c757d'}}>Update DB Stock Data
                </button>
            </Typography>
          </Col>
          <Col className="col-6">
            <Typography variant="h4" gutterBottom>
              <button
                onClick = {() => handleUpdate('removeUsers')}
                className="btn btn-danger btn-block " 
                style={{ border: '4px solid #6c757d'}}
              >Remove All Users
              </button>
            </Typography>
          </Col>
        </Row>
        <Row className="align-items-center justify-content-end text-center ht-3 ">
          <Col className="col-2">
            <Typography variant="h5" >
              Status:
            </Typography>
          </Col>
          <Col className="col-10 text-left">
            <Typography variant="h6" >
              {!updatingStocks ? '' : (updatingStocks === 'complete') ? 'Stocks Updated. ' : 'Stocks Updating. '}
              {!removingUsers ? '' : (removingUsers === 'complete') ? 'Users Removed. ' : 'Removing Users. '}
            </Typography>
          </Col>
        </Row>
      </Paper>
    </ServeToDash>
   );
}
 
export default AdminDash;