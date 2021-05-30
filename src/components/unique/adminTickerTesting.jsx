// out of house
import React, { Component } from 'react';

// in house
import {postAsset} from '../../services/assetService';
import InputField from '../common/inputField';
import FunctionButton from '../common/functionButton'

class AddUpdateTicker extends Component {
  state = { 
    identifier:'',
    type:'',
    status:{
      busy:false,
      dataRetrieved:false,
      errors:false
    },
  }

  validateAssetIdentifier(id){
    let inputFieldRef = document.getElementById('tickerInput')
    let inputLength = inputFieldRef.value.length
    const recentInput = id.charAt(id.length-1)
    const {status, identifier} = this.state
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    const alphabetUpper = alphabet.map(letter => letter.toUpperCase())
    if(recentInput === '') return ''
    if(!alphabet.includes(recentInput) && !alphabetUpper.includes(recentInput)) {
        this.setState({errors:'Only US equity/alphabet oriented tickers at this time'})
        if (identifier.length === 1) return inputFieldRef.value = ''
        return inputFieldRef.value = identifier
    }
    else{
      status['errors'] = false
      this.setState({status})
    }
    if(inputLength > 5) return inputFieldRef.value =  identifier
    return id.toUpperCase()
  }

  handleChange = async ({ currentTarget: input }) => {
      const identifier = this.validateAssetIdentifier(input.value)
      if(!identifier) return
      await this.setState({ identifier });
    };

  handleSubmit = async (e) => {
    e.preventDefault()
    console.log(' --- Ticker Submission State ---')
    console.log(this.state)

  // get identifier and submit to backend for API data request
    const {status, identifier} = this.state
    status['busy'] = true
    console.log('Submission request for: ' + identifier)
    this.setState({identifier:'', status})
    document.getElementById('tickerInput').value =''

  // set statuses based on response
    await postAsset(identifier, 'test').then(res => {
      if (res.status === 200) {
        (console.log("Asset Update Successful"))
        status['busy'] = false
        status['dataRetrieved'] = true
        status['errors'] = false
        this.setState({status})
      }
    }).catch(err => {
      if (err.response.status === 400) {
        (console.log("Invalid Asset Identifier"))
        status['busy'] = false
        status['dataRetrieved'] = false
        status['errors'] = true
        this.setState({status, identifier:''})
      }
      else if (err.response.status === 500) {
        (console.log("Something went wrong internally"))
        status['busy'] = false
        status['dataRetrieved'] = false
        status['errors'] = true
        this.setState({status, identifier:''})
      }
    })
  };

  render() { 
    const { identifier, status } = this.state;
    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <InputField
            onChange={this.handleChange}
            inputID='tickerInput'
            label='Ticker'
            required={true}
            value={identifier}
          />
        </form>
        <FunctionButton
          btnFunction = {this.handleSubmit}
          status={status}
          btnContent={
            <span className="material-icons">&#xea20;</span>
          }
        />
        {status.errors &&
        <div className="card text-white text-center bg-danger w-100 mt-2">
          <div className="card-body">
            <p className="card-text">Invalid asset identifier ⚠️</p>
          </div>
        </div>
        }
      </>
    );
  }
}
 
export default AddUpdateTicker;