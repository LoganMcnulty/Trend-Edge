// Out of House
import React, { useState } from 'react'

import InputField from '@material-ui/core/TextField';
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import FunctionButton from '../common/functionButton'
import Button from '@material-ui/core/Button';

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
                style={{width:"100%"}}
                className="form-group align-items-center  m-0 p-0"
            >
                <div className="input-group justify-content-center align-items-center">
                    <Autocomplete
                        freeSolo
                        key={clearKey}
                        filterOptions={filterOptions}
                        options={searchList ? searchList : [':)']}
                        style={{width:"60%"}}
                        className='px-3'
                        id='tickerInput'
                        onInputChange={handleInputChange}
                        renderInput={(params) => (
                            <InputField
                                {...params}
                                margin="normal"
                                variant="outlined"
                                id='tickerInput'
                                label='Ticker'
                                required={true}
                                value={input ? input : ''}
                                InputProps={{ ...params.InputProps}}
                            />
                        )}
                    /> 
                    <div className="input-group-append align-items-center">
                        {status ? 
                            <FunctionButton
                            btnFunction = {submitThis}
                            status={status}
                            btnContent={
                                <span className="material-icons">&#xea20;</span>
                            }
                        />
                        :''}

                        {!status ? 
                            <Button 
                                variant="contained"
                                style={{backgroundColor:'#5cb85c', color:'white'}}
                                onClick={submitThis}
                                className='w-100'
                            >
                                <>
                                    Search
                                    <span className="material-icons ml-1">&#xe8b6;</span>
                                </>
                            </Button> 
                        :''}

 
                    </div>
                    <div className="input-group-append">
                        {customStatus &&
                            <div className="card text-white text-center bg-danger mt-2">
                            <div className="card-body">
                                <p className="card-text">{customStatus}</p>
                            </div>
                            </div>
                        }
                    </div>

                </div>
            </form>
        </>
    );
}

export default SearchAutoFill;