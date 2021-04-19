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

const DisplaySettings = ({user}) => {
  const [key, setKey] = useState('AveragePeriod');
  const [currentUserSettings, setcurrentUserSettings] = useState(user.settings);
  const [errors, setErrors] = useState();


  const handleSave = () => {
    console.log(currentUserSettings)
    // updateSettings(user.email, userSettings);
  }

  const updateSettingsState = (field, value) => {
    const settings = currentUserSettings
    settings[field] = value
    setcurrentUserSettings(settings);
    console.log(currentUserSettings)
  }

  // const handleExceed = (field, min, max) => {
  //   const settings = currentUserSettings

  //   if (settings[field] < min){
  //     settings[field] = min 
  //     return setcurrentUserSettings(settings)
  //   }
  //   else if(settings[field] > max){
  //     settings[field] = max 
  //     return setcurrentUserSettings(settings)
  //   };

  // }

  const handleExceed = (field) => {
    console.log(field)

  }
  const handleSMAError = (field, newError) => {
    const newErrors = errors
    newErrors[field] = newErrors
    setErrors(newErrors);
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
              {!errors && < button className="btn btn-secondary btn-block" onClick={handleSave} style={{border: '4px solid #4682B4'}}>Apply</button>}
              {errors && <button className="btn btn-danger btn-block " disabled={true}>Save</button>}
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
                  startingValue={currentUserSettings ? currentUserSettings['fastSMA'] : null}
                  icon={<span className="material-icons">&#xe922;</span>} 
                  fieldName='fastSMA' label='Fast SMA' 
                  updateSettingsState={updateSettingsState}
                  handleExceed={handleExceed}
                />
                <SliderInput
                  min={10}
                  max={200}
                  startingValue={currentUserSettings ? currentUserSettings['slowSMA'] : null}
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
                  startingValue={currentUserSettings ? currentUserSettings['lookback'] : null}
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
                  startingValue={currentUserSettings ? currentUserSettings['fastWeight'] : null}
                  icon={<i className="fas fa-balance-scale"></i>} 
                  fieldName='fastWeight' label='Fast SMA' 
                  updateSettingsState={updateSettingsState}
                />
                <SliderInput 
                  startingValue={currentUserSettings ? currentUserSettings['slowWeight'] : null}
                  icon={<i className="fas fa-balance-scale"></i>} 
                  fieldName='slowWeight' 
                  label='Slow SMA' 
                  updateSettingsState={updateSettingsState}
                />
              </Row>

              <Row className="align-items-center justify-content-around text-center">
                <SliderInput
                  startingValue={currentUserSettings ? currentUserSettings['fastToSlowWeight'] : null}
                    icon={<i className="fas fa-balance-scale"></i>} 
                    fieldName='fastToSlowWeight' 
                    label='Fast Over Slow' 
                    updateSettingsState={updateSettingsState}
                  />
                <SliderInput
                    startingValue={currentUserSettings ? currentUserSettings['macdWeight'] : null}
                    icon={<i className="fas fa-balance-scale"></i>} 
                    fieldName='macdWeight' 
                    label='MACD' 
                    updateSettingsState={updateSettingsState}
                  />
              </Row>

              <Row className="align-items-center justify-content-around text-center">
                <SliderInput
                    startingValue={currentUserSettings ? currentUserSettings['adxWeight'] : null}
                    icon={<i className="fas fa-balance-scale"></i>} 
                    fieldName='adxWeight' 
                    label='ADX' 
                    updateSettingsState={updateSettingsState}
                  />
              </Row>

            </Tab>
          </Tabs>
      </Paper>
    </ServeToDash>
  )

}

export default DisplaySettings
