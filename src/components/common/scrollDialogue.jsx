import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';

export default function Modal2({buttonContent, title, content}) {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
        <Button 
            variant="contained" 
            // color="primary"
            style={{backgroundColor:'#4682B4', color:'white'}}
            onClick={handleClickOpen('paper')}
        >
            {buttonContent}
        </Button>
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            {/* <DialogTitle id="scroll-dialog-title" style={{backgroundColor:"#4682B4"}}>{title}</DialogTitle> */}
            <DialogContent dividers={scroll === 'paper'}>
              {content}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} style={{backgroundColor:"white"}}>
                  <span className="material-icons ml-1 text-dark">&#xe5c9;</span>
                </Button>
            </DialogActions>
        </Dialog>
    </div>
  );
}