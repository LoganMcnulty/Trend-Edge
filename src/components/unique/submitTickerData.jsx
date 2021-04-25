import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {postAsset, getAsset} from '../../services/assetService';
import InputField from '../common/inputField';

class TickerInput extends Component {
    state = { 
        identifier:'',
        errors:''
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

    handleSubmit = (e) => {
        const identifier = this.state.identifier
        console.log('Submission request for: ' + identifier)
        postAsset(identifier)
    };

    render() { 
        const { identifier, errors } = this.state;

        return (
            <>
            <Row className="align-items-center justify-content-end text-center mt-3 ">
              <Col className="col-6 text-left">
                <InputField
                    onChange={this.handleChange}
                    inputID='tickerInput'
                    label='Ticker'
                    required={true}
                    value={identifier}
                />
              </Col>
              <Col className="col-6 text-left">
                <button
                  onClick = {this.handleSubmit}
                  className="btn btn-primary btn-block " 
                  style={{ border: '4px solid #6c757d'}}
                >Submit
                </button>
              </Col>
            </Row>
            {errors ? <p className={'pb-0 mb-0'}>{errors}</p>: ''}
            </>
         );
    }
}
 
export default TickerInput;