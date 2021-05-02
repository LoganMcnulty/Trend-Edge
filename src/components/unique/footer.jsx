import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const FooterPage = () => {
    const classes = useStyles()
  return (
    <div className={classes.footer}>
        <p className='p-0 m-0'>Copyright 2021</p>
        <p  className='p-0 m-0'>Trend Edge</p>
    </div>
  );
}

export default FooterPage;


const useStyles = makeStyles(theme => ({
    footer: {
        position: 'fixed',
        bottom: 0,
        right:0,
        fontSize:'8px',
        width: '100%',
        backgroundColor: 'none',
        color: 'lightgray',
        marginRight:'10px',
        textAlign:'right'
    },
  }));