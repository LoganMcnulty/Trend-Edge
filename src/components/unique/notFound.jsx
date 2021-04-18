import React from "react";
import ServeToDash from '../common/serveToDash'
import {NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <ServeToDash>
      <div className="row text-center justify-content-center mx-2">
        <h3>Nothing seemes to exist here</h3>
      </div>

      <NavLink to="/dash">
        <button type='button' className="btn btn-primary btn-block p-0" style={{backgroundColor:'#fc5a3d', border:'none'}}>
          <span className='material-icons' style={{fontSize:'300%'}}>&#xe88a;</span>
        </button>
      </NavLink>
    </ServeToDash>
  )
};

export default NotFound;
