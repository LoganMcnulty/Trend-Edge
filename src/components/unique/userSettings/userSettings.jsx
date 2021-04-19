import React, { Component } from 'react';
import DislpaySettings from './displaySettings'
import auth from '../../../services/authService'

class UserSettings extends Component {
    state = { 
        user:{}
     }

    async componentDidMount() {
        const user = await auth.getCurrentUser()
        this.setState({user})
        console.log('user retrieved')
        console.log(user)
      }

    render() {
        const {user} = this.state
        user['settings'] = {
            fastSMA: 11,
            slowSMA: 41,
            lookback: 6,
            fastWeight: 51,
            slowWeight: 31,
            fastToSlowWeight: 11,
            macdWeight: 6,
            adxWeight: 6
        }
        return (
            <DislpaySettings user={user}/>
         );
    }
}
 
export default UserSettings;