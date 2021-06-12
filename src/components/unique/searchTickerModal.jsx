// out of house
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { Autocomplete, createFilterOptions } from "@material-ui/lab";

// in house
import {getTrendEdge} from '../../services/assetService';
import InputField from '../common/inputField';
import FunctionButton from '../common/functionButton'

const OPTIONS_LIMIT = 10;
const defaultFilterOptions = createFilterOptions();

const filterOptions = (options, state) => {
  return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT);
};

class SearchTickerModal extends Component {
  state = { 
    identifier:'',
    type:'',
    status:{
      busy:false,
      dataRetrieved:false,
      errors:false
    },
    allAssetNames:['cat', 'dog', 'turtle', 'mouse']
  }

  validateAssetIdentifier(id){
    let inputFieldRef = document.getElementById('tickerInput')
    const {status, identifier, allAssetNames} = this.state
    console.log(identifier)
    // const {assetNames} = this.state
    // if(recentInput === '') return ''
    // if(!alphabet.includes(recentInput) && !alphabetUpper.includes(recentInput)) {
    //     this.setState({errors:'Only US equity/alphabet oriented tickers at this time'})
    //     if (identifier.length === 1) return inputFieldRef.value = ''
    //     return inputFieldRef.value = identifier
    // }
    // else{
    //   status['errors'] = false
    //   this.setState({status})
    // }
    // if(inputLength > 5) return inputFieldRef.value =  identifier
    // return id.toUpperCase()
    return id
  }

  handleChange = ({ currentTarget: input }) => {
    const identifier = input.value
      // const identifier = this.validateAssetIdentifier(input.value)
      // if(!identifier) return
    this.setState({ identifier });
  };

  handleSubmit = async (e) => {
    e.preventDefault()
    console.log(' --- Ticker Submission State ---')
    console.log(this.state)
    const {status, identifier} = this.state
    console.log(identifier)
    document.getElementById('tickerInput').value =''
    this.setState({identifier:''})

  // // get identifier and submit to backend for API data request
  //   const {status, identifier} = this.state
  //   status['busy'] = true
  //   console.log('Submission request for: ' + identifier)
  //   this.setState({identifier:'', status})
  //   document.getElementById('tickerInput').value =''

  // // set statuses based on response
  //   await postAsset(identifier, 'test').then(res => {
  //     if (res.status === 200 || res.status === 201) {
  //       console.log("Asset Update Successful")
  //       status['busy'] = false
  //       status['dataRetrieved'] = true
  //       status['errors'] = false
  //       this.setState({status})
  //     }
  //   }).catch(err => {
  //     if (err.response.status === 400) {
  //       console.log("Invalid Asset Identifier")
  //       status['busy'] = false
  //       status['dataRetrieved'] = false
  //       status['errors'] = true
  //       this.setState({status, identifier:''})
  //     }
  //     else if (err.response.status === 500) {
  //       console.log("Something went wrong internally")
  //       status['busy'] = false
  //       status['dataRetrieved'] = false
  //       status['errors'] = true
  //       this.setState({status, identifier:''})
  //     }
  //   })
  };

  render() { 
    const { identifier, status, allAssetNames } = this.state;
    return (
      <>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <div className="form-group align-items-center  m-0 p-0">
          <div className="input-group justify-content-center">
          {allAssetNames ? 
            <Autocomplete
              freeSolo
              filterOptions={filterOptions}
              inputID='tickerInput'
              id='tickerInput'
              options={allAssetNames}
              style={{width:"50%"}}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search input"
                  margin="normal"
                  variant="outlined"
                  onChange={this.handleChange}
                  inputID='tickerInput'
                  id='tickerInput'
                  label='Ticker'
                  required={true}
                  value={identifier}
                  InputProps={{ ...params.InputProps, type: 'search' }}
                />
                )}
            /> :
            <InputField
            onChange={this.handleChange}
            inputID='tickerInput'
            id='tickerInput'
            label='Ticker'
            required={true}
            value={identifier}
          />
        }
          <div className="input-group-append">
            <FunctionButton
              btnFunction = {this.handleSubmit}
              status={status}
              btnContent={
                <span className="material-icons">&#xea20;</span>
              }
            />
            </div>
          </div>
        </div>
        </form>
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
 
export default SearchTickerModal;