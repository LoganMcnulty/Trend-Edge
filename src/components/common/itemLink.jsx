import React from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';

const ItemLink = ({name, children}) => {
    return (
        <ListItem >
            <ListItemIcon>
                {children}
            </ListItemIcon>
            <ListItemText primary={name} />
        </ListItem>
     );
}
 
export default ItemLink;