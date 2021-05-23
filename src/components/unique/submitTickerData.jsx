// out of house
import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// in house
import {postAsset} from '../../services/assetService';
import InputField from '../common/inputField';
import CircularIntegration from '../common/loadingInteractive'

class TickerInput extends Component {
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
      const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
      const alphabetUpper = alphabet.map(letter => letter.toUpperCase())
      if(recentInput === '') return ''
      if(!alphabet.includes(recentInput) && !alphabetUpper.includes(recentInput)) {
          this.setState({errors:'Only US equity/alphabet oriented tickers at this time'})
          if (this.state.identifier.length === 1) return inputFieldRef.value = ''
          return inputFieldRef.value = this.state.identifier
      }
      else{
          this.setState({errors:''})
      }
      if(inputLength > 5) return inputFieldRef.value =  this.state.identifier
      return id.toUpperCase()
    }

  handleChange = async ({ currentTarget: input }) => {
      const identifier = this.validateAssetIdentifier(input.value)
      if(!identifier) return
      await this.setState({ identifier });
    };

    handleSubmit = async (e) => {
      console.log(' --- Ticker Submission State ---')
      console.log(this.state)

    // get identifier and submit to backend for API data request
      const {status, type, identifier} = this.state
      status['busy'] = true
        console.log('Submission request for: ' + identifier)
      this.setState({identifier:'', status})



    // set statuses based on response
      await postAsset(identifier, 'test').then(res => {
        if (res.status === 201) {
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
        const { identifier, errors, status } = this.state;
        const {orientation, icon} = this.props
        return (
            <>

              {orientation === 'x' ? 
                <div className="d-flex align-items-center justify-content-center">
                  <InputField
                      onChange={this.handleChange}
                      inputID='tickerInput'
                      label='Ticker'
                      required={true}
                      value={identifier}
                  />
                  <CircularIntegration
                    title={'Submit'}
                    onClick = {this.handleSubmit}
                    type = {'fullButton'}
                    status={status}
                    icon={icon}
                  />
                </div>
                :
                <Row className="align-content-center text-center mt-3 ">
                <Col>
                  <InputField
                      onChange={this.handleChange}
                      inputID='tickerInput'
                      label='Ticker'
                      required={true}
                      value={identifier}
                  />
                  <CircularIntegration
                    title={'Submit'}
                    onClick = {this.handleSubmit}
                    type = {'fullButton'}
                    status={status}
                    icon={icon}
                  />
                </Col>
              </Row>
            }

            {errors ? <p className={'pb-0 mb-0'}>{errors}</p>: ''}
           </>
         );
    }
}
 
export default TickerInput;