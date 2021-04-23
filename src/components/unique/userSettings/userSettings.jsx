// out of house
import React, { useState, useEffect } from 'react'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';

// In house
import ServeToDash from '../../common/serveToDash'
import auth from '../../../services/authService'
import SliderInput from './sliderInput'
import {saveSettings} from '../../../services/userService'
import {getSettings} from '../../../services/userService'

const UserSettings = () => {
  const [key, setKey] = useState('AveragePeriod');
  const [currentUserSettings, setcurrentUserSettings] = useState();
  const [user, setUser] = useState()
  const [smaError, setSMAError] = useState();
  const [weightError, setWeightError] = useState();


  const handleSave = () => {
    saveSettings(user, currentUserSettings)
  }

  useEffect(() => {
    try{
      let request = [auth.getCurrentUser()]
      Promise.all(request)
      .then( async (response) => {
        const user = response[0]
        setUser(user)
        console.log('getting user settings')
        const settings = await getSettings(user._id)
        delete settings._id
        setcurrentUserSettings(settings);
      })
    }
    catch(er){
      console.log('something went wrong')
    }
  }, []);



  const validate = () => {
    const {fastSMA, slowSMA, fastWeight, slowWeight, fastToSlowWeight, macdWeight, adxWeight} = currentUserSettings
    const fastOverSlow = fastSMA > slowSMA
    const weight100 = fastWeight + slowWeight + fastToSlowWeight + macdWeight + adxWeight
  
    if (fastOverSlow) {
      const error = 'Fast SMA Cannot be Greater than Slow SMA'
      setSMAError(error)
    }
    else{setSMAError(false)}
    if (weight100 != 100){
      const error = 'Weights Must Add up to 100%'
      setWeightError(error)
    }
    else{setWeightError(false)}

  }

  const updateSettingsState = (field, value) => {
    const newUserSettings = currentUserSettings
    newUserSettings[field] = value
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
              {!smaError && !weightError && < button className="btn btn-secondary btn-block" onClick={handleSave} style={{backgroundColor: '#4682B4', border: '4px solid #6c757d'}}>Apply</button>}
              {(smaError || weightError) && <button className="btn btn-danger btn-block " disabled={true} style={{ border: '4px solid #6c757d'}}>Apply</button>}
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
                  value={currentUserSettings ? currentUserSettings['fastToSlowWeight'] : null}
                    icon={<i className="fas fa-balance-scale"></i>} 
                    fieldName='fastToSlowWeight' 
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
                <div className="card text-white bg-danger mb-3 w-80">
                  <div className="card-body">
                    {smaError && <p className="card-text">{"Fast SMA must be > slow SMA ⚠️"}</p>}
                    {weightError && <p className="card-text">Weights must add up to 100% ⚠️</p>}
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
