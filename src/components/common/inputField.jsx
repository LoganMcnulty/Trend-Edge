import React from 'react';
import TextField from '@material-ui/core/TextField';

const InputField = ({inputID, label, onChange, defaultValue=false, required=false, autoFill=false }) => {
    return (
      <TextField
          required = {required}
          id={inputID}
          label={label}
          onChange={onChange}
          defaultValue={defaultValue ? defaultValue : ''}
          variant="outlined"
      />
    );
}

export default InputField;