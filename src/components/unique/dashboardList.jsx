// Out of house
import React from 'react';
import List from '@material-ui/core/List';
import InfoIcon from '@material-ui/icons/Info';
import SettingsIcon from '@material-ui/icons/Settings';
import { NavLink } from "react-router-dom";
import Divider from '@material-ui/core/Divider';

// In House
import ItemLink from '../common/itemLink'

const DashList = ({userLogged}) => {

    return ( 
        <div>
        <List>
          {userLogged ? (
            <>
                <NavLink className="nav-item nav-link text-dark p-0 m-0" to="/Watchlist">
                    <ItemLink name={'Watchlist'}>
                        <span className="material-icons">&#xe0ee;</span>
                    </ItemLink>
                </NavLink>

                <NavLink className="nav-item nav-link text-dark p-0 m-0" to="/Heatlist">
                    <ItemLink name={'Heatlist'}>
                        <span className="material-icons">&#xe80e;</span>
                    </ItemLink>
                </NavLink>

                <NavLink className="nav-item nav-link text-dark p-0 m-0" to="/Settings">
                    <ItemLink name={'Settings'}>
                    <SettingsIcon />
                </ItemLink>

                </NavLink>
            <>
                <NavLink className="nav-item nav-link text-dark p-0 m-0" to="/Sign Out">
                    <ItemLink name={'Sign Out'}>
                            <span className="material-icons">&#xe9BA;</span>
                    </ItemLink>
                </NavLink>
            </>
              <Divider />
            </>
          ) : (
            <>
                <NavLink className="nav-item nav-link text-dark p-0 m-0" to="/Sign In">
                    <ItemLink name={'Access'}>
                        <span className="material-icons">&#xea77;</span>
                    </ItemLink>
                </NavLink>
          </>
          )}
                <NavLink className="nav-item nav-link text-dark p-0 m-0" to="/about">
                    <ItemLink name={'About'}>
                        <InfoIcon />
                    </ItemLink>
                </NavLink>
        </List>
      </div>
     );
}
 
export default DashList;