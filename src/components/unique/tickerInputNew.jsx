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
  const handleInputChange = (event, value) => {
    return handleChange(value)
  }
    return (
      <>
        <div className="form-group align-items-center  m-0 p-0">
          <div className="input-group justify-content-center">
            <Autocomplete
              freeSolo
              filterOptions={filterOptions}
              options={listData ? listData : [':)']}
              style={{width:"50%"}}
              onInputChange={handleInputChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search input"
                  margin="normal"
                  variant="outlined"
                  inputID='tickerInput'
                  id='tickerInput'
                  required={true}
                  value={currentInput}
                  InputProps={{ ...params.InputProps}}
                />
                )}
            /> 
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
      </>
        
    );
}
 
export default TickerInputNew;