// Out of House
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

//In House
import Modal2 from './scrollDialogue'

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 10 + rand();
  return {
    top: `${top}%`,
    margin:'auto'
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position:'absolute',
    overflow:'auto',
    display:'block',
    width: '75%',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #4682B4',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function SimpleModal({buttonContent, modalBody}) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div 
    style={modalStyle} 
    className={classes.paper}>
      {modalBody}
      {/* !!! Comment this in to put a modal within a modal !!! */}
      {/* <SimpleModal /> */}
    </div>

  );

  return (
    <div>
        <Button 
            variant="contained" 
            // color="primary"
            startIcon='close'
            style={{backgroundColor:'#4682B4', color:'white'}}
            onClick={handleOpen}
        >
            {buttonContent}
        </Button>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            style={{display:'flex',alignItems:'center',justifyContent:'center'}}
        >
            {body}
        </Modal>
    </div>
  );
}