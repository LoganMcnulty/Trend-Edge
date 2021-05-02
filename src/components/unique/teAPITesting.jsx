// out of house
import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// in house
import auth from '../../services/authService'
import {getAssetNames, getTrendEdge} from '../../services/assetService';
import CircularIntegration from '../common/loadingInteractive'
import {getUser} from '../../services/userService'

class TEAPITesting extends Component {
    state = { 
        status:{
          busy:false,
          dataRetrieved:false,
          errors:false
        },
        settings: ''
     }

     componentDidMount() {
        try{
            Promise.all([auth.getCurrentUser()])
            .then( async response => {
                const userInfo = await getUser(response[0]._id)
                const {settings, watchlist} = userInfo
                this.setState({settings, watchlist})
            })
          }
          catch(er){
            console.log('something went wrong')
          }
      }

    handleSubmit = async (e) => {
    // set state to busy
      const {status, settings} = this.state
      console.log('~~~ Test Trend Edge API using Admin Settings and all Stocks ~~~')
      status['busy'] = true
      this.setState({status})

      await getAssetNames().then(async res => {
        const identifiers = res.data
        console.log(identifiers)
        console.log(settings)
        const data = await getTrendEdge(identifiers, settings)
        console.log(data)
        status['busy'] = false
        this.setState({status})
        // await getTrendEdge(identifiers, settings).then( res => {
        //     console.log(res)
        //     status['busy'] = false
        //     this.setState({status})
        // }
        // )
      })
    };

    render() { 
        const {errors, status } = this.state;

        return (
            <>
            <Row className="align-items-center justify-content-center text-center">
              <Col className="col-12">
                <CircularIntegration
                  title={'Submit'}
                  onClick = {this.handleSubmit}
                  type = {'fullButton'}
                  status={status}
                />
              </Col>
            </Row>
            {status.busy ? "Retrieving Data..." : errors ? <p className={'pb-0 mb-0'}>{errors}</p> : status.dataRetrieved ? 'Success': ''}
            </>
         );
    }
}
 
export default TEAPITesting;