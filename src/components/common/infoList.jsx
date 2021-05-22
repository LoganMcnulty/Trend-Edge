import React from 'react';
import {NavLink } from "react-router-dom";
import Button from '@material-ui/core/Button';

const InfoList = ({title, listContent, footer='', linkTo='', linkTitle=''}) => {
    return ( 
        <ul className="list-group list-group-flush">
            <h4 className="card-title text-center text-light w-80 p-3 rounded" style={{backgroundColor:"#4682B4"}}>{title}</h4>
            {listContent.map(content => {
                return(
                    <li className="list-group-item" key={listContent.indexOf(content)}>
                        <div className="d-flex flex-row justify-content-around align-items-center">
                            <h6 className="text text-dark">
                                {content}
                            </h6>
                        </div>
                    </li>
                )

            })}
            {
                footer ? 
                <>
                <h5 className="card-footer text-center text-light w-80 p-3 rounded" style={{backgroundColor:"#fc5a3d"}}>{footer}</h5> 

                    {
                        linkTo && linkTitle ?
                       
                        <div className="row justify-content-center">
                            <NavLink className="h7 p-0 text-white" to={linkTo}>
                                <Button 
                                    variant="contained" 
                                    style={{backgroundColor:'#fc5a3d', color:'white'}}
                                >
                                    <div className='row px-2'>
                                    {linkTitle}
                                        <span className="material-icons ml-1">&#xeb40;</span>
                                    </div>
                                </Button>
                            </NavLink>
                        </div>
                        :
                        ''
                    }
                </>
                :
                ''
            }
        </ul>
     );
}
 
export default InfoList;