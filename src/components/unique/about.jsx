// Out of House
import React from 'react'
import mediumZoom from 'medium-zoom'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'

// In House
import Iwm from './img/IWM.png'
import ServeToDash from '../common/serveToDash'
import ImageZoom from './imageZoom'
// import HighLighter from '../common/highlightText'

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
  },
  link:{
    color:"#fc5a3d",
    textDecoration:'none'
  },
  example:{
    paddingTop:"1%",
    color:'red',
  }
}

const About = () => {
  const zoom = React.useRef(mediumZoom())

  return (
    <ServeToDash
    small={[12,0]}
    med={[8,4]}
    large={[6,0]
    }
    >
        <div className="container">
              <div className="co-lg-10">
                <>
                <Paper elevation={6} style={{ marginBottom: '2%' }}>
                  <div className='container fluid'>
                    <div className='row justify-content-center'>
                      {/* Title */}
                      <div className='col-lg-8'>
                        <h1 style={styles.header}>Trend Edge Scoring</h1>
                      </div>

                      {/* Calculation explaination */}
                      <div className='col-lg-10'>
                        <p style={styles.paragraph}>
                          Trend Edge is a multi-asset trend monitoring system that
                          applies user-defined weightings to a combination of
                          customizable{' '}                       
                          <a
                            href='https://www.investopedia.com/terms/t/technicalindicator.asp#:~:text=Technical%20indicators%20are%20heuristic%20or,to%20predict%20future%20price%20movements.'
                            target='_blank'
                            style={styles.link}
                          >
                            technical indicators 
                          </a>
                          {' '}in order to derive a
                          single trend score.
                        </p>
                        <div className="row justify-content-center" style={{marginBottom:"2%"}}>
                          <div className="col-lg-10">
                            <ul className="list-group">
                            {/* Input  */}
                              <li className="list-group-item list-group-item-secondary justify-content-center">
                                <h4 className="text-center ">
                                  Input
                                </h4>
                                <div className="text-center">
                                 'Fast' & 'Slow' weekly SMAs, slope lookbacks, & score weightings to be applied to asset data
                                </div>
                              </li>
                            {/* Body */}
                              {/* Example Asset & Settings*/}
                              <li className="list-group-item" >
                                <div className="row justify-content-around">
                                  <div className="col-lg-3 col-sm-12">
                                    <h6 className=" ">
                                      Ex. Asset
                                    </h6>
                                    <div style={{color:'red'}}>
                                      $EDGE
                                    </div>
                                  </div>
                                  <div className="col-lg-5 col-sm-12">
                                    <h6 className="">
                                      Ex. Settings
                                    </h6>
                                    <div style={{color:'red'}}>
                                      Fast SMA: 10 wk
                                    </div>
                                    <div style={{color:'red'}}>
                                      Slow SMA: 40 wk
                                    </div>
                                    <div style={{color:'red'}}>
                                      Lookback: 5 wks
                                    </div>
                                    <div style={{color:'red'}}>
                                      Weightings: 20% * 5
                                    </div>
                                  </div>
                                </div>

                              </li>
                              <span className="material-icons text-center my-2">&#xf1e3;</span>


                              {/* Processing  */}
                              <li className="list-group-item list-group-item-secondary justify-content-center">
                                <h4 className="text-center ">
                                  Processing
                                </h4>
                              </li>
                              {/* Fast and Slow Explain */}
                              <li className="list-group-item pb-0">Apply lookback to Fast & Slow SMAs. 
                              <div>If: Positive Slope → 1 Else: → 0</div>
                                <p className='text-left' style={styles.example}>
                                  <div>- Fast SMA t(0): $140</div>
                                  <div>- Fast SMA t(-5): $155</div>
                                  <div>(140 - 155) {`<`} 0 → 0.00 </div>
                                  <br></br>
                                  <div>- Slow SMA t(0): $140</div>
                                  <div>- Slow SMA t(-5): $108</div>
                                  <div>(140 - 155) {`>`} 0 → 1.00 </div>
                                </p>
                              </li>
                              <br></br>

                              {/* Fast Over Slow Explain */}
                              <li className="list-group-item pb-0">If: Fast SMA {'>'} Slow SMA → 1 Else: → 0
                                <p  className='text-left' style={styles.example}>
                                  <div>- Fast SMA t(0): $140</div>
                                  <div>- Slow SMA t(0): $120</div>
                                  <div>- (140 - 120) {`>`} 0 → 1.00 </div>
                                </p>
                              </li>
                              <br></br>

                              {/* MACD Explain */}
                              <li className="list-group-item pb-0">Apply lookback to Weekly MACD-12. 
                              <div>If: Positive Slope → 1 Else: → 0</div>
                                <p style={styles.example}>
                                  <div>- MACD t(0): 16.00</div>
                                  <div>- MACD t(-5): 21.00</div>
                                  <div>- (16 - 21) {`<`} 0 → 0.00 </div>
                                </p>
                              </li>
                              <br></br>

                              {/* ADX Explain */}
                              <li className="list-group-item pb-0">Apply lookback to Fast SMA. Fast SMA slope positive? T = 1, F = 0.
                                <p style={styles.example}>
                                  <div>- Lookback: 5 (wks)</div>
                                  <div>- 10 Wk SMA t(0): 21.00</div>
                                  <div>- 10 Wk SMA t(-5): 16.00</div>
                                  <div>- (150 - 140) {`<`} 0 → 0.00 </div>
                                </p>
                              </li>
                              <br></br>


                              <li className="list-group-item">Weekly MACD positive slope? T = 1, F = 0.</li>
                              <li className="list-group-item">If Slow SMA </li>
                              <li className="list-group-item">TrendEdge = (fastPositive.Slope * weight) + (slowPositive.Slope * weight) + (fastGreaterSlow * weight) + (macdPositiveSlope * weight) + (adx/100 * weight)</li>
                              <li className="list-group-item">Example, $Go with user settings: FastSMA = 10, SlowSMA = 40, Lookback = 5, All Weightings = 20% </li>
                              <span className="material-icons text-center my-2">&#xf1e3;</span>
                              
                            {/* Output  */}
                              <li className="list-group-item list-group-item-primary">
                                <h4 className="text-center ">
                                  Output
                                </h4>
                                <div className="d-flex flex-row">
                                  (0.00*.20) + (1.00*.20) + (1.00*.20) + (0.00*.20) + (.2698*.20) = <p style={{fontWeight:"bold", paddingLeft:"1%"}}> 45.40% Trend Edge</p>
                                </div>
                              </li>
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
                            style={styles.link}
                          >
                            Moving Averages,
                          </a>{' '}
                          and the{' '}
                          <a
                            href='https://www.investopedia.com/terms/m/macd.asp'
                            target='_blank'
                            style={styles.link}
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
                </>
              </div>
            </div>
    </ServeToDash>
    
  )
}

export default About
