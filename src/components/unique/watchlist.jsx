// Out of house
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper'

// In House
import ServeToDash from '../common/serveToDash'

class Watchlist extends Component {
    state = { 
      user: {}
     }

     componentDidMount(){
       console.log(' - - - Watchlist Mounted - - - ')
     }

    render() { 
        return ( 
          <ServeToDash
            med={[8,4]}
            large={[6,0]}
            small={[12,0]}
          >
            <Paper elevation={3} className='p-3 m-0'>
              <div className="jumbotron text-center bg-success">
                <h5>Watchlist Coming Soon</h5>
              </div>
            </Paper>

          </ServeToDash>
         );
    }
}
 
export default Watchlist;