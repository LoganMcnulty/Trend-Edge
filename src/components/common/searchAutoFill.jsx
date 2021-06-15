// Out of House
import React from 'react'
import TextField from '@material-ui/core/TextField';
import { Autocomplete, createFilterOptions } from "@material-ui/lab";

const OPTIONS_LIMIT = 10;
const defaultFilterOptions = createFilterOptions();

const filterOptions = (options, state) => {
  return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT);
};
const SearchAutoFill = ({currentInput, searchList, handleChange}) => {
    return (
        <>
            <Autocomplete
                freeSolo
                filterOptions={filterOptions}
                // inputid='tickerInput'
                // id='tickerInput'
                options={searchList ? searchList : [':)']}
                style={{width:"100%"}}
                className='px-3'
                renderInput={(params) => (
                    <TextField
                        {...params}
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
            /> 
        </>
    );
}

export default SearchAutoFill;