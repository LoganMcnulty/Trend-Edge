// Out of house
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper'

// In House
import ServeToDash from '../common/serveToDash'

class UserSettings extends Component {
    state = { 
      user: {}
     }

     componentDidMount(){
       console.log(' - - - Settings Mounted - - - ')
     }

    render() { 
        return ( 
          <ServeToDash
            large={[6,0]}
            med={[12,0]}
            small={[12,0]}
          >
            <Paper elevation={3} className='p-3 m-0'>
              <div className="jumbotron text-center bg-info">
                <h5>Settings Coming Soon</h5>
              </div>
            </Paper>

          </ServeToDash>
         );
    }
}
 
export default UserSettings;