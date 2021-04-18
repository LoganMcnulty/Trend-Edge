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
            large={[3,0]}
            med={[10,0]}
            small={[10,2]}
          >
            <Paper elevation={3} className='p-3 m-0'>
              <div className="jumbotron text-right bg-success">
                <h5>Watchlist Coming Soon</h5>
              </div>
            </Paper>

          </ServeToDash>
         );
    }
}
 
export default Watchlist;