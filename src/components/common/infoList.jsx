import React from 'react';

const InfoList = ({title, listContent, footer=''}) => {
    return ( 
        <ul className="list-group list-group-flush">
            <h4 className="card-title text-center text-light bg-dark w-80 p-3 rounded">{title}</h4>
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
                <h5 className="card-footer text-center text-light bg-dark w-80 p-3 rounded">{footer}</h5> :
                ''
            }
        </ul>
     );
}
 
export default InfoList;