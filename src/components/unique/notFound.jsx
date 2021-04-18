import React from "react";
import ServeToDash from '../common/serveToDash'
import {NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <ServeToDash large={[4,0]}>
      <div className="row text-center justify-content-center mt-3">
        <h3>Nothing seems to exist here</h3>
      </div>

      <NavLink to="/dash" className='row justify-content-center m'>
        <button type='button' className="btn btn-primary w-50 p-0" style={{backgroundColor:'#fc5a3d', border:'none'}}>
          <span className='material-icons' style={{fontSize:'300%'}}>&#xe88a;</span>
        </button>
      </NavLink>
    </ServeToDash>
  )
};

export default NotFound;
