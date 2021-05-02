// out of house
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

// In House
import ServeToDash from '../common/serveToDash'
import auth from '../../services/authService'
import {getTrendEdge} from '../../services/assetService';
import {getUser} from '../../services/userService'
import TickerInput from './submitTickerData'

class Watchlist extends Component {
    state = { 
      status:{
        busy:false,
        dataRetrieved:false,
        errors:false
      },
      userID:'',
      watchlist:[],
      settings: ''
  }

  tryUpdate = (stuff) => {
    console.log(stuff)
  }

  async componentDidMount() {
      try{
        Promise.all([auth.getCurrentUser()])
        .then( async response => {
          const userID = response[0]._id
          console.log('Mounting User...')
          const {settings, watchlist} = await getUser(userID)
          this.setState({watchlist, settings, userID})
          console.log(this.state)
        })
      }
      catch(er){
        console.log('something went wrong')
      }
    }

    render() {
      const {userID:_id, settings, watchlist} = this.state
        return ( 
          <ServeToDash
            med={[8,4]}
            large={[8,2]}
            small={[12,0]}
          >
            <div className="row justify-content-around mb-3">
              <div className="col-lg-6 col-sm-12 col-md-12">
                <Card>
                  <CardContent>
                    <div className="row">
                      <div className="col-sm-12">
                        <Typography variant="h5" className='text-center'>Add To Watchlist</Typography>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-sm-12">
                        <TickerInput
                          type={'userWLUpdate'}
                          userID={_id}
                          orientation={'x'}
                          icon={'save'}
                          watchlist={watchlist}
                          onTry={() => this.tryUpdate}
                        />
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </div>

              {/* <div className="col-6 jumbotron">
                Fuck
              </div> */}
            </div>

            {/* <div className="row justify-content-around">
              <div className="col-12">
                <Card>
                  <CardContent>

                  </CardContent>
                </Card>
              </div>
            </div> */}
          </ServeToDash>
        );
    }
}
 
export default Watchlist;