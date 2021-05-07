import React from 'react'

import InputField from '../common/inputField';
import CircularIntegration from '../common/loadingInteractive'

const TickerInputNew = ({currentInput, handleChange, handleSubmit, status, icon}) => {
    return (
      <div className="form-group align-items-center  m-0 p-0">
        <div className="input-group justify-content-center">
          <InputField
            onChange={handleChange}
            inputID='tickerInput'
            label='Ticker'
            required={true}
            value={currentInput}
          />
          <div className="input-group-append">
            <CircularIntegration
              title={'Submit'}
              onClick = {handleSubmit}
              type = {'fullButton'}
              status={status}
              icon={icon}
            />
          </div>
        </div>
     </div>
     );
}
 
export default TickerInputNew;