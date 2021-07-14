// Out of House
import React, { useState } from 'react'

import InputField from '@material-ui/core/TextField';
import { Autocomplete, createFilterOptions } from "@material-ui/lab";

const OPTIONS_LIMIT = 10;
const defaultFilterOptions = createFilterOptions();

const filterOptions = (options, state) => {
    return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT)
};

const SearchAutoFill = ({searchList, handleSubmit, status, handleChange}) => {
    const [input, setInput] = useState('')
    const [clearKey, setClearKey] = useState(1)
    const [customStatus, setCustomStatus] = useState(false)

    const handleInputChange = async (event, value) => {
        setCustomStatus(false)
        setInput(value.toUpperCase())
        handleChange(value.toUpperCase())
    }
    
    const submitThis = (event, value) =>{
        event.preventDefault()
        if (!searchList.includes(input)) {
            if (status){
                status['errors'] = 'Missing from autofill list ⚠️'
                handleSubmit('', status)
            }
            else{
                setCustomStatus('Missing from autofill list ⚠️')
            }
        }
        else{
            handleSubmit(input)
        }
        setInput('')
        if (clearKey === 1) return setClearKey(2)
        return setClearKey(1)
    }

    return (
        <>
            <form
                onSubmit={submitThis}
                id={'resetForm'}
                className="form-group align-items-center  m-0 p-0"
            >
                <div className="inputalign-items-center">
                    <Autocomplete
                        freeSolo
                        key={clearKey}
                        filterOptions={filterOptions}
                        options={searchList ? searchList : [':)']}
                        className='px-4'
                        id='tickerInput'
                        onInputChange={handleInputChange}
                        renderInput={(params) => (
                            <InputField
                                {...params}
                                margin="normal"
                                variant="outlined"
                                className='bg-light'
                                id='tickerInput'
                                label='Ticker'
                                required={true}
                                value={input ? input : ''}
                                InputProps={{ ...params.InputProps}}
                            />
                        )}
                    /> 
                </div>
            </form>
        </>
    );
}

export default SearchAutoFill;