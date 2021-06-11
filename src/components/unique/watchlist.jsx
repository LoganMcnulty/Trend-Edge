// out of house
import React, { Component } from 'react';
import {Img} from 'react-image'

import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

// In House
import ServeToDash from '../common/serveToDash'
import auth from '../../services/authService'
import {getTrendEdge, getAssetNames} from '../../services/assetService';
import {getUser} from '../../services/userService'
import TickerInputNew from './tickerInputNew';
import {saveSettings} from '../../services/userService'
import DataTable from '../common/dataTable'
import Loading from "../common/loading/loading";
import InfoModal from '../common/infoModal'
import InfoList from '../common/infoList'
import csvExample from '../images/csvExample.png'

function cleanData(data){
  return data.map(asset => {
    const {fastSMA, slowSMA, priceSeries} = asset
    if (slowSMA && fastSMA) return asset
    if (priceSeries.length <= 0){
      asset['name'] += ' ⌛'
      return asset
    }
    else {
      asset['name'] += ' ⚠️'
      return asset
    }
  })
}

class Watchlist extends Component {
  state = {
    assetData:[],
    allAssetNames:['cat','dog','mouse','cheese'],
    columns:[
      { title: 'Ticker', field: 'name' },
      { title: 'TrendEdge', field: 'trendEdge', type: 'numeric' },
      { title: 'Price', field: 'priceCurr', type: 'numeric' }
      ],
    status:{
      busy:false,
      dataRetrieved:false,
      errors:false,
      csvErrors:false
    },
    userID:'',
    watchlist: false,
    settings: '',
    currentInput: '',
    csvFile: '',
    modal: false,
    fundamentalModal: {
      open:false
    },
    technicalModal:{
      open:false
    }
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleCSVSubmit.bind(this);
    this.fileInput = React.createRef();
    this.form = React.createRef();
    }

  async componentDidMount() {
    try{
      const {status} = this.state
      status['busy'] = true
      this.setState({status})

      Promise.all([auth.getCurrentUser()])
      .then( async response => {
        const userID = response[0]._id
        const assetRetrieve = await getAssetNames()
        const allAssetNames = assetRetrieve['data']
        console.log('Mounting User to watchlist...')
        const {settings, watchlist} = await getUser(userID)
        this.setState({watchlist, settings, userID, allAssetNames})
        if (watchlist.length === 0) {
            status['busy'] = false
            this.setState({status})
            return
        }
        Promise.all([getTrendEdge(watchlist, settings)]).then( res => 
          {
            const assetData = cleanData(res[0]['data'])
            status['busy'] = false
            this.setState({assetData, status})
          })
      })
    }
    catch(er){
      console.log('something went wrong')
    }
  }

  validateTicker = (ticker) => {
    if (!ticker) return false
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    for (let string in ticker){
      if (!alphabet.includes(ticker[string])) return false
    }
    if (ticker.length >5) return false
    return true
  }

  listCompare = (newList, oldList) => {
    const finalList = oldList
    console.log("Length old list" + oldList.length)
    for(let i=0; i < newList.length; i++){
      let item = String(newList[i].toUpperCase()).trim()
      if (!oldList.includes(item)) {
        if (this.validateTicker(item)) finalList.push(item)
      }
    }
    console.log("Length final list" + finalList.length)
    return finalList
  }

  handleCSVSubmit = e => {
    e.preventDefault();
    this.setState({modal:true})
    const {watchlist, status, userID:_id, settings, csvFile} = this.state
    const input = csvFile
    var obj_csv = {
        size:0,
        dataFile:[]
    };

    const parseData = data => {
      let csvData = [];
      let lbreak = data.split("\n");
      lbreak.forEach(res => {
          csvData.push(res.split(","));
      });
      return csvData.map(d => {return d[0]})
    }

    if (input && input[0]) {
        console.log('csv received')
        let reader = new FileReader();
        reader.readAsBinaryString(input[0]);
        try{
          reader.onload = async (e) => {
            obj_csv.size = e.total;
            obj_csv.dataFile = e.target.result
            await saveSettings(_id, this.listCompare(parseData(obj_csv.dataFile), watchlist), 'watchlistAdd', 'list')
            Promise.all([getTrendEdge(watchlist, settings)]).then( res => 
              {
                const assetData = cleanData(res[0]['data'])
                status['busy'] = false
                this.setState({assetData, status})
              })
            return document.getElementById("fileInputForm").reset();
          }
        }
        catch (err) {
          console.log("Error: CSV Likely incorrect format")
          document.getElementById("fileInputForm").reset();
          return this.setState({csvErrors:true})}
    }
    else{
      document.getElementById("fileInputForm").reset();
      return console.log("csv not received")
    }

    }

  handleWLAdd = async (e) => {
    console.log("Handling watchlist addition...")
    e.preventDefault()
    const {currentInput: newAsset, watchlist, status, userID:_id, settings} = this.state
    if (watchlist.includes(newAsset.toUpperCase())) {
      status['errors'] = `${newAsset} already exists in your watchlist`
      this.setState({status})
      return
    }
    status['busy'] = true
    this.setState({status})

    watchlist.push(newAsset)
    document.getElementById('tickerInput').value =''

    try {
      await saveSettings(_id, watchlist, 'watchlistAdd')
    }
    catch (err) {
      status['busy'] = false
      status['errors'] = 'Could not find data for provided ticker'
      this.setState({status, currentInput:''})
      return
    }

    Promise.all([getTrendEdge(watchlist, settings)]).then( res => 
      {
        status['busy'] = false
        status['dataRetrieved'] = true
        const assetData = cleanData(res[0]['data'])
        this.setState({assetData, status, currentInput:''})
      })
    console.log('... complete')
  }

  validateAssetIdentifier(id){
    let inputFieldRef = document.getElementById('tickerInput')
    let inputLength = inputFieldRef.value.length
    const recentInput = id.charAt(id.length-1)
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    const alphabetUpper = alphabet.map(letter => letter.toUpperCase())
    if(recentInput === '') return ''
    const {status, currentInput} = this.state
    if(!alphabet.includes(recentInput) && !alphabetUpper.includes(recentInput)) {
        status['errors'] = 'Only US equity/alphabet oriented tickers at this time ⚠️'
        this.setState({status})
        console.log(this.state.status.errors)
        if (currentInput.length === 1) return inputFieldRef.value = ''
        return inputFieldRef.value = currentInput
    }
    else{
      status['errors'] = ''
      this.setState({status})
    }
    if(inputLength > 5) return inputFieldRef.value =  currentInput
    return id.toUpperCase()
  }

  handleChange = async ({ currentTarget: input }) => {
    const currentInput = this.validateAssetIdentifier(input.value)
    if(!currentInput) return
    await this.setState({ currentInput });
  };

  movingAvgs = (priceSeries, sma) => {
    const dataPoints = []
    for (let i=priceSeries.length; i > sma; i--){
        let dataPoint = []
        const thisSMASeries = priceSeries.slice( i-1-sma, i-1)
        let seriesSum = 0
        for (let i =0; i < thisSMASeries.length; i++){
            seriesSum += thisSMASeries[i]
        }
        dataPoint.push(i-1)
        dataPoint.push(seriesSum/sma)
        dataPoints.push(dataPoint)
    }
    return dataPoints.slice(-100)
  } 

  handleSeeMore = (e, action='') => {
    const {adx, daysSinceIPO, enoughData, fastOverSlow, fastPosSlope, fastSMA, longName,
    macdPosSlope, name, priceCurr, slowPosSlope, slowSMA, volumeAvg, volumeCurr, trendEdge, macd} = e

    const {fastSMA:fastSMASettings, slowSMA:slowSMASettings} = this.state.settings

    if (action === 'technical'){

      // let priceIndexed = []
      // for (let i = priceSeries.length; i >= 0; i--){
      //   priceIndexed.push([i, priceSeries[i]])
      // }
      // priceIndexed = priceIndexed.slice(-100).reverse()

      const {technicalModal} = this.state
      technicalModal['open'] = true
      technicalModal['longName'] = longName
      technicalModal['priceCurr'] = priceCurr
      technicalModal['fastPosSlope'] = fastPosSlope
      technicalModal['slowPosSlope'] = slowPosSlope
      technicalModal['fastOverSlow'] = fastOverSlow
      technicalModal['daysSinceIPO'] = daysSinceIPO
      technicalModal['enoughData'] = enoughData
      technicalModal['fastSMA'] = fastSMA
      technicalModal['slowSMA'] = slowSMA
      technicalModal['macdPosSlope'] = macdPosSlope
      technicalModal['adx'] = adx
      technicalModal['volumeAvg'] = volumeAvg
      technicalModal['volumeCurr'] = volumeCurr
      technicalModal['trendEdge'] = trendEdge
      technicalModal['macd'] = macd
    


      // technicalModal['priceSeries'] = priceSeries
      // technicalModal['fastSMASeries'] = this.movingAvgs(priceSeries, fastSMASettings)
      // technicalModal['slowSMASeries'] = this.movingAvgs(priceSeries, slowSMASettings)
    
      // technicalModal['data'] = [
      //     {
      //         label: 'Px (t)',
      //         data: priceSeries ? priceIndexed : []
      //     },
      //     {
      //         label: `${fastSMASettings} wk SMA`,
      //         data: priceSeries ? technicalModal['fastSMASeries'] : []
      //     },
      //     {
      //         label: `${slowSMASettings} wk SMA`,
      //         data: priceSeries ? technicalModal['slowSMASeries'] : []
      //     }
      // ]

      this.setState({technicalModal})
      console.log(this.state.technicalModal)
    }
    else if (action === 'fundamental'){
      const {fundamentalModal} = this.state
      fundamentalModal['open'] = true
      fundamentalModal['longName'] = longName
      fundamentalModal['daysSinceIPO'] = daysSinceIPO
      this.setState({fundamentalModal})
    }

  }

  clearWatchlist = async () => {
    const {userID:_id} = this.state
    if (window.confirm('Are you sure?')){
      try{
        await saveSettings(_id, [], 'watchlistRemove')
        this.setState({watchlist:[], assetData:[]})
      }
      catch{
        console.log('something went wrong saving empty watchlist')
      }
    }
    else return
  }

  handleDelete = async (e) => {
    const {watchlist, status, userID:_id, assetData} = this.state
    status['busy'] = true
    this.setState({status})

    const updatedWL = watchlist.filter(asset => {
      if (asset !== e.name) return asset
    })

    const updatedAssetData = assetData.filter(asset => {
      if (asset.name !== e.name) return asset
    })

    this.setState({watchlist: updatedWL, assetData:updatedAssetData})

    try {
      await saveSettings(_id, updatedWL, 'watchlistRemove')
      status['busy'] = false
      this.setState({status})
    }
    catch (err) {
      status['busy'] = false
      status['errors'] = 'Could not delete item'
      this.setState({status})
      return
    }
    }

  handleClose = () => {
    const {technicalModal, fundamentalModal} = this.state
    technicalModal['open'] = false
    fundamentalModal['open'] = false
    this.setState({modal:false, csvFile:'', fundamentalModal, technicalModal})
  }

  onFileChange = () => {
    const csvFile = this.fileInput.current.files
    this.setState({csvFile})
  }

  render() {
    const {watchlist, currentInput, status, assetData, csvFile, modal, technicalModal, fundamentalModal, settings, allAssetNames} = this.state
      return (
        <ServeToDash
          med={[8,4]}
          large={[8,2]}
          small={[12,0]}
        >
          <Paper  className='p-1 m-0'>
            <div className="row justify-content-center">
              <div className="col-lg-6 col-sm-12 col-md-12">
                <CardContent className='p-2'>
                  <div className="row">
                    <div className="col-sm-12">
                      <form onSubmit={this.handleWLAdd}>
                        <TickerInputNew
                          status={status}
                          handleChange={this.handleChange}
                          handleSubmit={this.handleWLAdd}
                          currentInput={currentInput}
                          listData={allAssetNames}
                        />
                      </form>
                    </div>
                  </div>

                  {status.errors &&
                    <div className="card text-white text-center bg-danger w-80 mt-2">
                      <div className="card-body">
                        <p className="card-text">{status.errors}</p>
                      </div>
                    </div>
                  }
                </CardContent>
              </div>

              <div className="col-lg-6 col-sm-12 col-md-12">
                <CardContent  className='p-2'>
                  <div className="row m-0 p-0 justify-content-center align-items-center">
                    <Typography variant="h5" className='text-center mb-1 mr-2'>Import .csv</Typography>
                    <InfoModal
                      buttonContent={
                        <span className="material-icons">&#xe88e;</span>
                      }
                      iconButton={true}
                      content={
                      <>
                        <InfoList
                            title={'Correct Format'}
                            listContent={[]}
                        />
                        <Img src={csvExample} logo='csv example'/>
                      </> 
                      }
                    />
                  </div>
                  <div className='row justify-content-center'>
                    <form
                      id='fileInputForm'
                      ref={this.form}
                    >
                      <input
                        type="file"
                        ref={this.fileInput}
                        onChange={this.onFileChange}
                        className='w-80'
                        style={{border:'1px solid lightgray', width:'80%'}}
                      />
                    </form>
                      {
                        csvFile &&
                        <div className="row">
                          <Button 
                            variant="contained"
                            size='small'
                            style={{backgroundColor:'#4682B4', color:'white'}}
                            onClick={(e) => this.handleCSVSubmit(e)}
                            >
                              <span className="material-icons m-0 p-0">&#xe2c6;</span>
                          </Button>
                          <Dialog
                            open={modal}
                            onClose={this.handleClose}
                            scroll={'paper'}
                            aria-labelledby="scroll-dialog-title"
                            aria-describedby="scroll-dialog-description"
                          >
                            <DialogContent >
                              <div className="row">
                                Some assets may take longer than others to appear in your watchlist.
                              </div>
                              <div className="row">
                                Check back in a few minutes as data becomes available.
                              </div>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleClose} style={{backgroundColor:"white"}}>
                                  <span className="material-icons ml-1">&#xe5cd;</span>
                                </Button>
                            </DialogActions>
                          </Dialog>
                        </div>  
                      }
                  </div>
                  {status.csvErrors &&
                    <div className="card text-white text-center bg-danger w-80 mt-2">
                      <div className="card-body">
                        <p className="card-text">.csv format error, double check the tool-tip for proper format</p>
                      </div>
                    </div>
                  }
                </CardContent>
              </div>
            </div>
          </Paper>

          <Paper className='p-1 mt-2'>
            {assetData.length > 0 ?                
            <DataTable 
                title=''
                columns={this.state.columns}
                data={this.state.assetData ? this.state.assetData : []}
                handleDelete={this.handleDelete}
                handleSeeMore={this.handleSeeMore}
              /> :
              watchlist ? 
              watchlist.length > 0 ? 
                <Loading style={'bars'}/> : 
                <div className='card card-body text-center'>Add to your watchlist to get started</div> : ''
            }
          </Paper>
          <div className='container mt-2 mb-5'>
            <div className="row justify-content-around">
              <InfoModal
                  buttonContent={
                    <>
                      <div className='row px-2'>
                        Limitations ⚠️
                      </div>
                    </>
                  }
                  content={
                    <>
                      <InfoList
                          title={'Trend Edge is in Beta'}
                          listContent={[
                            'Assets with less than ~1 yr of price history may not have correct Trend Edge stats.', 
                            '⚠️ signifies this'
                          ]}
                      />
                    </>
                  }
                />
              <Button 
                variant="contained"
                size='small'
                style={{backgroundColor:'red', color:'white'}}
                onClick={() => this.clearWatchlist()}
                >
                  Clear Watchlist
                  <span className="material-icons ml-1">&#xe16c;</span>
              </Button>

            {/* Technical Modal */}
              <Dialog
                open={technicalModal.open}
                onClose={this.handleClose}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
              >
                <DialogContent >
                  <ul className="list-group list-group-flush">
                    <h4 className="card-title text-center text-light w-80 p-3 rounded" style={{backgroundColor:"#4682B4"}}>{technicalModal.longName}</h4>
                    <li className="list-group-item m-0 p-0">

                      <div className="d-flex flex-row justify-content-center allign-items-center p-0 m-0">
                        <p className='text font-weight-bold mr-1'>Trend Edge: </p>{technicalModal.trendEdge}
                        <p className='text font-weight-bold mr-1 ml-3'>Price: </p>{technicalModal.priceCurr}
                      </div>

                      <div className={buildClass(technicalModal.fastPosSlope)}>
                        <p className='text font-weight-bold mr-1'>{settings.fastSMA} Wk SMA: </p>
                        {technicalModal.fastPosSlope === 1 ? `Trending Up at $${technicalModal.fastSMA}` : `Trending Dn at $${technicalModal.fastSMA}`}
                      </div> 
                      <div className={buildClass(technicalModal.slowPosSlope)}>
                        <p className='text font-weight-bold mr-1'>{settings.slowSMA} Wk SMA: </p>{technicalModal.slowPosSlope  === 1 ? `Trending Up at $${technicalModal.slowSMA}` : `Trending Dn at $${technicalModal.slowSMA}`}
                      </div>
                      <div className={buildClass(technicalModal.macdPosSlope)}>
                        <p className='text font-weight-bold mr-1'>MACD: </p>{technicalModal.macd ? technicalModal.macdPosSlope  === 1 ? `Trending Up` : `Trending Dn` : 'Unavailable'}
                      </div>
                      <div className={buildClass(technicalModal.slowPosSlope)}>
                        <p className='text font-weight-bold mr-1'>ADX: </p>{technicalModal.adx ? technicalModal.slowPosSlope  === 1 ? `${technicalModal.adx}%` : `Not Applied` : 'Unavailable'}
                      </div>

                      <br></br>

                      <div className= "d-flex flex-row justify-content-center allign-items-center p-0 m-0 text-info">
                        <p className='text font-weight-bold mr-1'>This Week's Volume is {Math.round(technicalModal.volumeCurr / technicalModal.volumeAvg *100)} % of the 10 Week Average </p>
                      </div>

                    </li>

                    {/* <li className="list-group-item m-0 mt-1 p-0">
                      <LineGraph data={technicalModal.data} />
                      <div className="d-flex flex-row justify-content-left allign-items-center p-0 m-0">
                        <p className='text font-weight-bold mr-1'>Months Since IPO: </p>{Math.round(technicalModal.daysSinceIPO / 30.417)}
                      </div>
                    </li> */}
                
                  </ul>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} style={{backgroundColor:"white"}}>
                      <span className="material-icons ml-1">&#xe5cd;</span>
                    </Button>
                </DialogActions>
              </Dialog>
                  
            {/* Fundamental Modal */}
              <Dialog
                open={fundamentalModal.open}
                onClose={this.handleClose}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
              >
                  <DialogContent >
                    <ul className="list-group list-group-flush">
                      <h4 className="card-title text-center text-light w-80 p-3 rounded" style={{backgroundColor:"#4682B4"}}>{fundamentalModal.longName}</h4>
                      <li className="list-group-item">
                        <div className="d-flex flex-row justify-content-around align-items-center">
                            <h6 className="text text-dark">
                                things
                            </h6>
                        </div>
                      </li>
                    </ul>
                    </DialogContent>
                  <DialogActions>
                      <Button onClick={this.handleClose} style={{backgroundColor:"white"}}>
                        <span className="material-icons ml-1">&#xe5cd;</span>
                      </Button>
                  </DialogActions>
                </Dialog>

            </div>
          </div>
        </ServeToDash>
      );
    }
}

const buildClass = (code) => {
  let base = "d-flex flex-row justify-content-center allign-items-center p-0 m-0"
  if (code===1) return base += ' text-success'
  return base += ' text-danger'
}
 
export default Watchlist;