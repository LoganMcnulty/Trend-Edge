// Out of House
import React from 'react'
import TextField from '@material-ui/core/TextField';
import { Autocomplete, createFilterOptions } from "@material-ui/lab";

// In house
import InputField from '../common/inputField';
import FunctionButton from '../common/functionButton'

const OPTIONS_LIMIT = 10;
const defaultFilterOptions = createFilterOptions();

const filterOptions = (options, state) => {
  return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT);
};

const TickerInputNew = ({currentInput, handleChange, handleSubmit, status, icon, listData=''}) => {
    return (
      <>
      <div className="form-group align-items-center  m-0 p-0">
        <div className="input-group justify-content-center">
        {listData ? 
          <Autocomplete
            freeSolo
            filterOptions={filterOptions}
            inputid='tickerInput'
            id='tickerInput'
            options={listData}
            style={{width:"50%"}}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search input"
                margin="normal"
                variant="outlined"
                onChange={handleChange}
                inputid='tickerInput'
                label='Ticker'
                required={true}
                value={currentInput}
                InputProps={{ ...params.InputProps}}
              />
              )}
          /> :
          <InputField
            onChange={handleChange}
            inputid='tickerInput'
            label='Ticker'
            required={true}
            value={currentInput}
          />
      }
        <div className="input-group-append">
          <FunctionButton
            btnFunction = {handleSubmit}
            status={status}
            btnContent={
              <span className="material-icons">&#xea20;</span>
            }
          />
          </div>
        </div>
      </div>
      <div className="row">
        
      </div>

      </>
        
    );
}
 
export default TickerInputNew;