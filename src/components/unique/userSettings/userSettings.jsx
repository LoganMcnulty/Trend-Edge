// out of house
import React, { useState, useEffect } from 'react'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { lightBlue, green, purple } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

// In house
import ServeToDash from '../../common/serveToDash'
import auth from '../../../services/authService'
import SliderInput from './sliderInput'
import {saveSettings} from '../../../services/userService'
import {getUser} from '../../../services/userService'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: lightBlue[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
    // style={{backgroundColor: '#4682B4', border: '4px solid #6c757d'}}
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: purple[500],
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#4682B4',
    },
  },
});

const UserSettings = () => {
  const [key, setKey] = useState('AveragePeriod');
  const [currentUserSettings, setcurrentUserSettings] = useState();
  const [user, setUser] = useState()
  const [smaError, setSMAError] = useState();
  const [weightError, setWeightError] = useState();
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState(false);

  const classes = useStyles();

  const handleSave = async () => {
    setLoading(true)
    await saveSettings(user, currentUserSettings, 'settings')
    setLoading(false)
    setMessage("Saved Successfully")
  }

  useEffect(() => {
    try{
      Promise.all([auth.getCurrentUser()])
      .then( async response => {
        const userID = response[0]._id
        setUser(userID)
        console.log('getting user settings')
        const {settings} = await getUser(userID)
        setcurrentUserSettings(settings);
      })
    }
    catch(er){
      console.log('something went wrong')
    }
  }, []);



  const validate = () => {
    const {fastSMA, slowSMA, fastWeight, slowWeight, fastOverSlowWeight, macdWeight, adxWeight} = currentUserSettings
    const fastOverSlow = fastSMA > slowSMA
    const weight100 = fastWeight + slowWeight + fastOverSlowWeight + macdWeight + adxWeight
  
    if (fastOverSlow) {
      const error = 'Fast SMA Cannot be Greater than Slow SMA'
      setSMAError(error)
    }
    else{setSMAError(false)}
    if (weight100 !== 100){
      const error = 'Weights Must Add up to 100%'
      setWeightError(error)
    }
    else{setWeightError(false)}

  }

  const updateSettingsState = (field, value) => {
    const newUserSettings = currentUserSettings
    newUserSettings[field] = value
    setMessage("")
    setcurrentUserSettings(newUserSettings);
    validate()
  }

  return (
    <ServeToDash
    med={[8,4]}
    large={[6,0]
    }
    >
      <Paper className='p-3'>
          <Row className="align-items-center justify-content-around text-center">
            <Col className="col-6">
              <Typography variant="h4" gutterBottom>
                User Settings
              </Typography>
            </Col>

            <Col className='col-6'>
                <div className={classes.wrapper}>
                  <ThemeProvider theme={theme}>
                      <Button
                        variant="contained"
                        color="secondary"
                        disabled={loading || smaError || weightError}
                        onClick={handleSave}
                        startIcon={<SaveIcon />}
                        style={{width:'100%'}}
                      >
                        Apply
                      </Button>
                  </ThemeProvider>
                  {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </div>
              
            </Col>
          </Row>

          <br/>

          <Tabs
            id='controlled-tab-example'
            activeKey={key}
            onSelect={k => setKey(k)}
          >

          {/* Averages and lookback */}
            <Tab eventKey='AveragePeriod' title='Average Period (Weekly)'>
              <Row className="align-items-center justify-content-around text-center">
                <SliderInput
                  min={1}
                  max={40}
                  value={currentUserSettings ? currentUserSettings['fastSMA'] : null}
                //  {currentUserSettings ? currentUserSettings['fastSMA'] : null}
                  icon={<span className="material-icons">&#xe922;</span>} 
                  fieldName='fastSMA' label='Fast SMA' 
                  updateSettingsState={updateSettingsState}
                />
                <SliderInput
                  min={10}
                  max={200}
                  value={currentUserSettings ? currentUserSettings['slowSMA'] : null}
                  icon={<span className="material-icons">&#xe922;</span>} 
                  fieldName='slowSMA' 
                  label='Slow SMA' 
                  updateSettingsState={updateSettingsState}
                />
              </Row>
              <Row className="align-items-center justify-content-around text-center">
              <SliderInput
                  min={1}
                  max={100}
                  value={currentUserSettings ? currentUserSettings['lookback'] : null}
                  icon={<span className="material-icons">&#xe889;</span>} 
                  fieldName='lookback' 
                  label='Lookback' 
                  updateSettingsState={updateSettingsState}
                />
              </Row>
            </Tab>

          {/* Weighting */}
            <Tab eventKey='Weighting' title='Weighting (%)'>
              <Row className="align-items-center justify-content-around text-center">
                <SliderInput
                  value={currentUserSettings ? currentUserSettings['fastWeight'] : null}
                  icon={<i className="fas fa-balance-scale"></i>} 
                  fieldName='fastWeight' label='Fast SMA' 
                  updateSettingsState={updateSettingsState}
                />
                <SliderInput 
                  value={currentUserSettings ? currentUserSettings['slowWeight'] : null}
                  icon={<i className="fas fa-balance-scale"></i>} 
                  fieldName='slowWeight' 
                  label='Slow SMA' 
                  updateSettingsState={updateSettingsState}
                />
              </Row>

              <Row className="align-items-center justify-content-around text-center">
                <SliderInput
                  value={currentUserSettings ? currentUserSettings['fastOverSlowWeight'] : null}
                    icon={<i className="fas fa-balance-scale"></i>} 
                    fieldName='fastOverSlowWeight' 
                    label='Fast Over Slow' 
                    updateSettingsState={updateSettingsState}
                  />
                <SliderInput
                    value={currentUserSettings ? currentUserSettings['macdWeight'] : null}
                    icon={<i className="fas fa-balance-scale"></i>} 
                    fieldName='macdWeight' 
                    label='MACD' 
                    updateSettingsState={updateSettingsState}
                  />
              </Row>

              <Row className="align-items-center justify-content-around text-center">
                <SliderInput
                    value={currentUserSettings ? currentUserSettings['adxWeight'] : null}
                    icon={<i className="fas fa-balance-scale"></i>} 
                    fieldName='adxWeight' 
                    label='ADX' 
                    updateSettingsState={updateSettingsState}
                  />
              </Row>
            </Tab>
          </Tabs>
          <Row className='justify-content-center text-center'>
            <Col className='col-12 text-align-center mb-0 mt-3'>

              {(smaError || weightError) &&
                <div className="card text-white bg-danger w-80">
                  <div className="card-body">
                    {smaError && <p className="card-text">{'Fast SMA must be > Slow SMA ⚠️'}</p>}
                    {weightError && <p className="card-text">Weights must add up to 100% ⚠️</p>}
                  </div>
                </div>
              }
              {(message) &&
                <div className="card text-white bg-success w-80">
                  <div className="card-body">
                    <p className="card-text">{message}</p>
                  </div>
                </div>
              }
              
            </Col>
          </Row>
      </Paper>
    </ServeToDash>
  )

}

export default UserSettings
