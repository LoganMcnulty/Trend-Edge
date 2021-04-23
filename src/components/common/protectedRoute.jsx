import React from 'react';
import {Route, Redirect} from 'react-router-dom'
import auth from'../../services/authService'

const ProtectedRoute = ({path, adminTrue=false, component:Component, render, ...rest}) => {
    return ( 
    <Route 
        {...rest}
        render={props => {
            const user = auth.getCurrentUser()
            console.log(user)
            if (!user) return (
                    <Redirect to={{
                        pathname:'/Sign in',
                        state: {from: props.location}
                    }}/>
                )
            
            if (user && adminTrue){
                if (!user.isAdmin) return(
                    <Redirect to={{
                        pathname:'/dash',
                        state: {from: props.location}
                    }}/>
                )
            }
            return (
                Component ? <Component {...props} /> : render(props)
              )
        }}

    />
    );
}
 
export default ProtectedRoute