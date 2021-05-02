// out of house
import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// in house
import {postAsset, getAsset} from '../../services/assetService';
import InputField from '../common/inputField';
import CircularIntegration from '../common/loadingInteractive'

class TickerInput extends Component {
    state = { 
        identifier:'',
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
      console.log(this.state)
    // set state to busy
      const {status, errors} = this.state
      status['busy'] = true

    // get identifier and submit to backend for API data request
      const identifier = this.state.identifier
      console.log('Submission request for: ' + identifier)
      this.setState({identifier:'', status})

    // set statuses based on response
      await postAsset(identifier).then(res => {
        if (res.status === 201) {
          (console.log("Asset Update Successful"))
          status['busy'] = false
          status['dataRetrieved'] = true
          status['errors'] = false
          this.setState({status})
          console.log(this.state)
        }
      }).catch(err => {
        if (err.response.status === 400) {
          (console.log("Invalid Asset Identifier"))
          status['busy'] = false
          status['dataRetrieved'] = false
          status['errors'] = true
          this.setState({status, identifier:''})
          console.log(this.state)
        }
        else if (err.response.status === 500) {
          (console.log("Something went wrong internally"))
          status['busy'] = false
          status['dataRetrieved'] = false
          status['errors'] = true
          this.setState({status, identifier:''})
          console.log(this.state)
        }
      })
    };

    render() { 
        const { identifier, errors, status } = this.state;

        return (
            <>
            <Row className="align-items-center justify-content-center text-center mt-3 ">
              <Col className="col-12">
                <InputField
                    onChange={this.handleChange}
                    inputID='tickerInput'
                    label='Ticker'
                    required={true}
                    value={identifier}
                />
              </Col>
            </Row>
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
            {errors ? <p className={'pb-0 mb-0'}>{errors}</p>: ''}
            </>
         );
    }
}
 
export default TickerInput;