import React from 'react';
import ServeToDash from '../common/serveToDash'

const LandingContent = () => {
    return (
        <ServeToDash
            large={[9,0]}
            med={[10,0]}
            small={[10,2]}
        >
            <h1 className='text-center'>Welcome To Trend Edge 📈</h1>
        </ServeToDash>
     );
}
 
export default LandingContent;