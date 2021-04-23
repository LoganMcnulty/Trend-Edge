import React, {useState} from 'react';

const Errors = ({errors}) => {
    console.log(errors)
    const listErrors = () => {
        for (const err in errors){
            console.log(errors[err])
            return (<li>{`${errors[err]}`}</li>)
        }
    }

    return (
        <div className='justify-content-center'>
            <ul>
                {errors ? listErrors(errors) : 'no errors'}
            </ul>
        </div>
        
     );
}
 
export default Errors;