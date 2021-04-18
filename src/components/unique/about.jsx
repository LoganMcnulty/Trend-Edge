import React from 'react'
import mediumZoom from 'medium-zoom'
import ImageZoom from './imageZoom'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Iwm from './img/IWM.png'
import Gme from './img/GME.png'
import Qqq from './img/qqq.png'
import ServeToDash from '../common/serveToDash'

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1200px',
    height: '800px'
  },
  paper: {
    position: 'absolute',
    width: 1300,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}))

const styles = {
  header: {
    textAlign: 'center',
    fontSize: '300%',
    margin: '2% 0'
  },
  paragraph: {
    marginTop: '1%',
    fontFamily: "'Roboto', serif",
    fontSize: '20px',
    paddingLeft: '1em'
  },
  subHeader: {
    marginTop: '2%',
    fontWeight: 'bold'
    // textAlign: "center"
  },
  quote: {
    padding: '.5em 0 0 3em',
    fontWeight: '100',
    fontSize: '20px',
    fontStyle: 'italic'
  },
  note: {
    padding: '0 0 0 3em',
    fontWeight: 'bold',
    fontStyle: 'italic'
  }
}

const About = () => {
  const zoom = React.useRef(mediumZoom())

  return (
    <ServeToDash>
<div className="container">
      <div className="co-lg-10">
      <Paper elevation={6} style={{ marginBottom: '2%' }}>
        <div className='container fluid'>
          <div className='row justify-content-center'>
          <div className='col-lg-8'>
              <h1 style={styles.header}>Trend Edge Scoring</h1>
            </div>
            <div className='col-lg-10'>
                  <p style={styles.paragraph}>
                    Trend Edge is a multi-asset trend monitoring system that
                    applies user-defined weightings to a combination of
                    customizable technical indicators in order to derive a
                    single trend score.
                  </p>
                  <div className="row justify-content-center" style={{marginBottom:"2%"}}>
                    <div className="col-lg-10">
                    <ul className="list-group">
                    <li className="list-group-item list-group-item-secondary"><p style={{fontWeight:"bold"}}>User Defines:</p> 'Fast' weekly SMA, 'Slow' weekly SMA, slope lookbacks, and score weightings</li>
                    <li className="list-group-item list-group-item">Apply lookback to Fast SMA. Fast SMA positive slope? Yes = 1, No = 0.</li>
                    <li className="list-group-item list-group-item">Apply lookback to Slow SMA. Slow SMA positive slope? Yes = 1, No = 0.</li>
                    <li className="list-group-item list-group-item">Fast SMA value > slow SMA value? Yes = 1, No = 0.</li>
                    <li className="list-group-item list-group-item">Weekly MACD positive slope? Yes = 1, No = 0.</li>
                    <li className="list-group-item list-group-item">ADX: IF, Slow SMA has positive slope = weekly ADX Value. Else, 0.</li>
                    <li className="list-group-item list-group-item">TrendEdge = (fastPositive.Slope * weight) + (slowPositive.Slope * weight) + (fastGreaterSlow * weight) + (macdPositiveSlope * weight) + (adx/100 * weight)</li>
                    <li className="list-group-item list-group-item">Example, $Go with user settings: FastSMA = 10, SlowSMA = 40, Lookback = 5, All Weightings = 20% </li>
                    <li className="list-group-item list-group-item-primary">(0.00*.20) + (1.00*.20) + (1.00*.20) + (0.00*.20) + (.2698*.20) = <p style={{fontWeight:"bold"}}>45.40% Trend Edge</p></li>
                  </ul>
                    </div>
                  </div>
                </div>
            
          </div>
        </div>
      </Paper>
      <Paper elevation={6} style={{ marginBottom: '2%', paddingTop:'5%' }}>
        <div className='container fluid'>
          <div className='row justify-content-center'>
            <div className='col-lg-10'>
              <div className='row justify-content-center'>
              </div>

              <blockquote style={styles.quote}>
                “Watch the Market leaders, the stocks that have led the charge
                upward in a bull market [...] as the leaders go, so goes the
                entire market.” - Jesse Livermore
              </blockquote>

              <p style={styles.paragraph}>
                The health of a market can be inferred via the trends in
                the price of the current leading sectors, and the individuals within those sectors.
                The state of a trend (up, down, sideways) can be discerned through the use of technical indicators;{' '}
                <a
                  href='https://www.investopedia.com/terms/m/movingaverage.asp'
                  target='_blank'
                >
                  Moving Averages,
                </a>{' '}
                and the{' '}
                <a
                  href='https://www.investopedia.com/terms/m/macd.asp'
                  target='_blank'
                >
                  MACD (Moving Average Convergence/Divergence Oscillator)
                </a>
                , to name two.
              </p>
              <p style={styles.paragraph}>
                Figure 1 is a price history chart of the IWM Small Cap (Cap =
                Market Capitalization. The value of a stock or index, calculated
                by multiplying the number of shares outstanding by the share
                price) index, ranging from Q’1 2014 to Q’1 2020. Each bar on the
                chart represents one week of price movement. The blue line is
                the 10 period moving average (MA), and the red is the 40 period
                MA. The indicator in the middle pane represents MACD, and the
                bottom pane represents ADX (Average Directional Index, discussed
                later)
              </p>

              <div className="row justify-content-center">
              <ImageZoom
                  src={Iwm}
                  alt='Zoom 1'
                  zoom={zoom.current}
                  background='#000'
                />
              </div>
   

              <p style={styles.paragraph}>
                In Figure 1, inferences about the trend of the index can be made
                by observing the state of the MAs and MACD. During periods in
                which the price of the index is trending up, the “Fast” (10
                period), and “Slow” (40 period) MAs have a positive slope, and
                the Fast MA is above (i.e. maintains a higher value than) the
                Slow MA. During periods in which the market begins to correct or
                trade sideways, these indicators fail to maintain a positive
                slope.{' '}
              </p>
              <p style={styles.paragraph}>
                The MACD indicator is more sensitive than the MA, and thus more
                widely used for shorter term trends in price. Whereas MAs are a
                simple way to track a trend over longer time frames.{' '}
              </p>
              <p style={styles.paragraph}>
                Provided these indicators, the state of the medium to long term trend can be derived to a single score.
              </p>
            </div>
          </div>
        </div>
      </Paper>
      </div>
    </div>
    </ServeToDash>
    
  )
}

export default About
