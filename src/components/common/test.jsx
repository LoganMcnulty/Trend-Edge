import React from 'react';
import Paper from '@material-ui/core/Paper'

const Test = () => {
    return ( 
        <div className="container">
            <div className='row justify-content-center'>
                <div className="col-sm-12 col-lg-6">
                <h1>
                    <br />
                </h1>
                <Paper elevation={3} className='p-3 mt-3 mr-0'>
                    <p className="h4 text-center mb-3">Content</p>
                </Paper>
                </div>
            </div>
        </div>
     );
}
 
export default Test;