import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { NavLink } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  root: {
    width: '90%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function LeaderAccordion({topTwentyData, user}) {
    const classes = useStyles();
    const [thisUser, setThisUser] = useState()

    useEffect(() => {
        setThisUser(user)
        console.log(topTwentyData)
        console.log(user)
    }, [user]);

    const listItems = topTwentyData.map((d) => {
        return (
            <>
                <li className="list-group-item" key={d._id}>
                    <NavLink className="h7 p-0 text-success font-weight-bold" to={"/asset/" + d.name}>
                        <u>${d.name}</u>
                    </NavLink> | {'Trend Edge ' + d.trendEdge}
                </li>
            </>
            )
    })

  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Top 20 Watched Stocks</Typography>
        </AccordionSummary>
        {!user ?
            <div className="row text-center">
               <div className="col">Sign in to add to your watchlist</div>
           </div>
        : ''}
 
        <AccordionDetails>
            <ul className="list-group w-100">
                {listItems}
            </ul>
        </AccordionDetails>
      </Accordion>
      {/* <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Accordion 2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion> */}
      <Accordion disabled>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography className={classes.heading}>Coming Soon</Typography>
        </AccordionSummary>
      </Accordion>
    </div>
  );
}