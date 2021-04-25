import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '20ch',
    },
  },
}));

const InputField = ({inputID, label, onChange, defaultValue=false, required=false, autoFill=false }) => {
    const classes = useStyles();
    return (
        <form className={classes.root} noValidate autoComplete="off">
            <div>
                <TextField
                    required = {required}
                    id={inputID}
                    label={label}
                    onChange={onChange}
                    defaultValue={defaultValue ? defaultValue : ''}
                    variant="outlined"
                />
            </div>
        </form>
    );
}

export default InputField;