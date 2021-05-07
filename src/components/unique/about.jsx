// Out of House
import React from 'react'
import mediumZoom from 'medium-zoom'
import Paper from '@material-ui/core/Paper'

// In House
import Iwm from './img/IWM.png'
import ServeToDash from '../common/serveToDash'
import ImageZoom from './imageZoom'

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
    color:"#1569C7",
    textDecoration:'none',
    fontWeight: 'bold',
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
    med={[8,3]}
    large={[8,2]
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
                    Trend Edge is a multi-asset
                    {' '}  
                    <a
                      href='https://www.investopedia.com/terms/t/trend.asp'
                      target='_blank'
                      style={styles.link}
                      rel="noreferrer"
                    >
                      trend
                    </a>
                    {' '}  
                      monitoring system that
                    applies user-defined settings to pre-defined{' '}                       
                    <a
                      href='https://www.investopedia.com/terms/t/technicalindicator.asp#:~:text=Technical%20indicators%20are%20heuristic%20or,to%20predict%20future%20price%20movements.'
                      target='_blank'
                      style={styles.link}
                      rel="noreferrer"
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
                          <div className="text-left">
                            {'1) '} Settings: 'Fast' & 'Slow' weekly{' '}                 
                              <a
                                href='https://www.investopedia.com/terms/s/sma.asp'
                                target='_blank'
                                style={styles.link}
                                rel="noreferrer"
                              >
                                simple moving averages (SMAs),
                              </a>
                            {' '}slope lookbacks, & score weightings.
                          </div>
                          <div className="text-left">
                          {'2) '} Asset Data
                          </div>
                        </li>
                      {/* Body */}
                        {/* Example Asset & Settings*/}
                        <li className="list-group-item" >
                          <div className="row justify-content-around">
                            <div className="col-lg-4 col-sm-12">
                              <h6 className="mb-0">
                                Example Asset
                              </h6>
                              <div style={{color:'red'}} className='mb-2'>
                                $EDGE
                              </div>
                            </div>
                            <div className="col-lg-5 col-sm-12">
                              <h6 className="mb-0">
                                Example (Default) Settings
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
                                Weightings: .2/.2/.2/.2/.2
                              </div>
                            </div>
                          </div>

                        </li>
                        <span className="material-icons text-center my-2">&#xf1e3;</span>


                        {/* Processing  */}
                        <li className="list-group-item list-group-item-primary justify-content-center">
                          <h4 className="text-center ">
                            Processing
                          </h4>
                        </li>
                        {/* Fast and Slow Explain */}
                        <li className="list-group-item pb-0">Apply lookback to Fast & Slow SMAs. 
                        <div>If: Positive Slope → 1 Else: → 0</div>
                          <div className='text-left' style={styles.example}>
                            <div>- Fast SMA t(0) = $140</div>
                            <div>- Fast SMA t(-5) = $155</div>
                            <div>(140 - 155) {`<`} 0 → 0.00</div>
                            <div>- Weight: .20</div>
                            <div>(0.00 * .20) = 0.00</div>


                            <br></br>
                            <div>- Slow SMA t(0) = $120</div>
                            <div>- Slow SMA t(-5) = $115</div>
                            <div>(120 - 115) {`>`} 0 → 1.00 </div>
                            <div>- Weight: .20</div>
                            <div>(1.00 * .20) = 0.20</div>
                          </div>
                        </li>
                        <br></br>

                        {/* Fast Over Slow Explain */}
                        <li className="list-group-item pb-0">If: Fast SMA {'>'} Slow SMA → 1 Else: → 0
                          <div  className='text-left' style={styles.example}>
                            <div>- Fast SMA t(0) = $140</div>
                            <div>- Slow SMA t(0) = $120</div>
                            <div>(140 - 120) {`>`} 0 → 1.00 </div>
                            <div>- Weight: .20</div>
                            <div>(1.00 * .20) = 0.20</div>
                          </div>
                        </li>
                        <br></br>

                        {/* MACD Explain */}
                        <li className="list-group-item pb-0">Apply lookback to Weekly{' '}                 
                            <a
                              href='https://www.investopedia.com/terms/t/technicalindicator.asp#:~:text=Technical%20indicators%20are%20heuristic%20or,to%20predict%20future%20price%20movements.'
                              target='_blank'
                              style={styles.link}
                              rel="noreferrer"
                            >
                              MACD-12.
                            </a>{' '}
                        <div>If: Positive Slope → 1 Else: → 0</div>
                          <div style={styles.example}>
                            <div>- MACD t(0) = 16.00</div>
                            <div>- MACD t(-5) = 21.00</div>
                            <div>(16 - 21) {`<`} 0 → 0.00 </div>
                            <div>- Weight: .20</div>
                            <div>(0.00 * .20) = 0.00</div>
                          </div>
                        </li>
                        <br></br>

                        {/* ADX Explain */}
                        <li className="list-group-item pb-0">If Slow SMA has a positive slope, apply ADX
                          <div style={styles.example}>
                            <div>*check prev. step* → True </div>
                            <div>- ADX t(0): 28.50</div>
                            <div>- Weight: .20</div>
                            <div>((28.50/100) * .20) = 0.057</div>
                          </div>
                        </li>
                        <span className="material-icons text-center my-2">&#xf1e3;</span>
                    
                      {/* Output  */}
                        <li className="list-group-item list-group-item-success">
                          <h4 className="text-center text-dark">
                            Output
                          </h4>
                          <div className="text-center">
                            .20 + .00 + .20 + .00 + .057 = <p style={{fontWeight:"bold", paddingLeft:"1%"}}> 45.57% Trend Edge</p>
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
                    the price of the current leading sectors, and individuals within those sectors.
                    The state of a trend (up, down, sideways) can be discerned through the use of technical indicators;{' '}
                    <a
                      href='https://www.investopedia.com/terms/m/movingaverage.asp'
                      target='_blank'
                      style={styles.link}
                      rel="noreferrer"
                    >
                      Moving Averages,
                    </a>{' '}
                    and the{' '}
                    <a
                      href='https://www.investopedia.com/terms/m/macd.asp'
                      target='_blank'
                      style={styles.link}
                      rel="noreferrer"
                    >
                      MACD (Moving Average Convergence/Divergence Oscillator)
                    </a>
                    , to name two.
                  </p>
                  <p style={styles.paragraph}>
                    The top pain of this figure is a price history chart of the IWM Small Cap index, ranging from 2014 to 2021. Each bar on the
                    chart represents one week's worth of price movement. The blue line is
                    the 10 period SMA, and the red is the 40. The indicator in the middle pane represents MACD, and the
                    bottom pane represents{' '}
                    <a
                      href='https://www.investopedia.com/terms/a/adx.asp'
                      target='_blank'
                      style={styles.link}
                      rel="noreferrer"
                    >
                      ADX (Average Directional Index).
                    </a>
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
                    Using technically simple sets of data, we can come to impartial conclusions about the trend of an asset. During periods in
                    which the price of an asset is trending up, the “Fast”, and “Slow” SMAs have a positive slope, and
                    the Fast SMA is rising faster than (above) the
                    Slow SMA. During periods in which the market begins to correct or
                    trade sideways, these indicators fail to maintain a positive
                    slope.{' '}
                  </p>
                  <p style={styles.paragraph}>
                    MACD is more sensitive than the SMA, and thus more
                    widely used for shorter term trends in price.{' '}
                  </p>
                  <p style={styles.paragraph}>
                    ADX is a measure of the strength of a trend (up or down).{' '}
                  </p>
                  <p style={styles.paragraph}>
                    Provided the above, the state of the medium to long term trend of an asset at t(0) can be summarized down to a single score.
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
