// out of house
import React, { Component } from 'react';

// in house
import auth from '../../services/authService'
import {getAssetNames, getTrendEdge} from '../../services/assetService';
import FunctionButton from '../common/functionButton'
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
    })
  };

  render() { 
    const {status } = this.state;

    return (
      <>
        <FunctionButton
          btnFunction = {this.handleSubmit}
          status={status}
          size='large'
          btnContent={
            <>
              Check Console
              <span className="material-icons ml-1">&#xea18;</span>
            </>
          }
          className='w-100'
        />
      </>
      );
  }
}
 
export default TEAPITesting;