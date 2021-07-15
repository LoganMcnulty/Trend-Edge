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
import {getTrendEdge} from '../../services/assetService';
import {getUser} from '../../services/userService'
import {saveSettings} from '../../services/userService'
import DataTable from '../common/dataTable'
import Loading from "../common/loading/loading";
import InfoModal from '../common/infoModal'
import InfoList from '../common/infoList'
import csvExample from '../images/csvExample.png'
import SearchAutoFill from '../common/searchAutoFill'

function cleanData(data){
  return data.map(asset => {
    const {fastSMA, slowSMA, priceSeries} = asset
    if (slowSMA && fastSMA) return asset
    if (priceSeries.length <= 0){
      asset['name'] += ' ⏳'
      return asset
    }
    else {
      asset['name'] += ' ⚠️'
      return asset
    }
  })
}

class Watchlist extends Component {
  _isMounted = false

  constructor(props) {
    super(props);
    this.state = {
      assetData:[],
      allAssetNames:[],
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
    this.handleSubmit = this.handleCSVSubmit.bind(this);
    this.fileInput = React.createRef();
    this.form = React.createRef();
    }

    componentDidMount() {
      this._isMounted = true
      console.log("Mounting User to Watchlist...")
    
      const mountUser = async () => {
        try{
          const {status} = this.state
          status['busy'] = true
          if (this._isMounted) this.setState({status, allAssetNames:this.props['allAssetNames']})
          
          Promise.all([auth.getCurrentUser()])
          .then( async response => {
            const userID = response[0]._id
            const {settings, watchlist} = await getUser(userID)
            if (this._isMounted) this.setState({watchlist, settings, userID})
    
            if (watchlist.length === 0) {
                status['busy'] = false
                if (this._isMounted) this.setState({status})
            }
            const res = await getTrendEdge(watchlist, settings)
            const assetData = cleanData(res['data'])
            status['busy'] = false
            if (this._isMounted) this.setState({status, assetData})

          })
        }
        catch(er){
          console.log('something went wrong')
        }
      };

     mountUser()
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  listCompare = (newList, oldList) => {
    const {allAssetNames} = this.state
    const finalList = oldList
    console.log("Length old list" + oldList.length)
    for(let i=0; i < newList.length; i++){
      let item = String(newList[i].toUpperCase()).trim()
      if (!oldList.includes(item)) {
        if (allAssetNames.includes(item)) finalList.push(item)
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

  handleWLAdd = async (ticker) => {
    console.log("Handling watchlist addition...")

    const {watchlist, status, userID:_id, settings} = this.state
    if (watchlist.includes(ticker.toUpperCase())) {
      status['errors'] = `${ticker} already exists in your watchlist`
      this.setState({status})
      return
    }
    status['busy'] = true
    this.setState({status})
    watchlist.push(ticker)
    try {
      await saveSettings(_id, watchlist, 'watchlistAdd')
    }
    catch (err) {
      status['busy'] = false
      status['errors'] = 'Could not find data for provided ticker'
      this.setState({status})
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
    const {adx, daysSinceIPO, volume, fastSMA, longName, priceCurr, name, slowSMA, trendEdge, macd, fastOverSlow, lastUpdated} = e

    if (action === 'technical'){

      const {technicalModal} = this.state
      technicalModal['open'] = true
      technicalModal['name'] = name
      technicalModal['longName'] = longName
      technicalModal['priceCurr'] = priceCurr
      technicalModal['daysSinceIPO'] = daysSinceIPO
      technicalModal['fastSMA'] = fastSMA
      technicalModal['slowSMA'] = slowSMA
      technicalModal['adx'] = adx
      technicalModal['volume'] = volume
      technicalModal['trendEdge'] = trendEdge
      technicalModal['macd'] = macd
      technicalModal['fastOverSlow'] = fastOverSlow
      technicalModal['lastUpdated'] = lastUpdated



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

  handleTickerSubmitNew = (input, status='') => {
    if (status) return this.setState({status})
    if (input) return this.handleWLAdd(input)
  }

  handleInputChange = e => {
    const{status} = this.state
    status['errors'] = false
    this.setState({status})
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

    const {longName, trendEdge, priceCurr, open, fastSMA, slowSMA, macd, volume, lastUpdated, adx} = technicalModal

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
                      <SearchAutoFill
                        handleSubmit={this.handleTickerSubmitNew}
                        searchList={allAssetNames}
                        status={status}
                        handleChange={this.handleInputChange}
                      />
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
                            style={{background:'#4682B4', color:'white'}}
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
                                <Button onClick={this.handleClose} style={{background:"white"}}>
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
                <Loading type={'bars'}/> : 
                <div className='card card-body text-center'>Add to your watchlist to get started</div> : ''
            }
          </Paper>
          <div className='container mt-2 mb-5'>
            <div className="row justify-content-around">
              <InfoModal
                  buttonContent={
                    <>
                      <div className='row px-2'>
                        Legend ⚠️ ⏳
                      </div>
                    </>
                  }
                  content={
                    <>
                      <InfoList
                          listContent={[
                            '⏳ - Asset data is being updated in chunks. Check back in a few minutes.', 
                            '⚠️ - Assets with less than ~1 yr of price history may not have correct Trend Edge stats.'
                          ]}
                      />
                    </>
                  }
                />
              <Button 
                variant="contained"
                size='small'
                style={{background:'red', color:'white'}}
                onClick={() => this.clearWatchlist()}
                >
                  Clear Watchlist
                  <span className="material-icons ml-1">&#xe16c;</span>
              </Button>

            {/* Technical Modal */}
              <Dialog
                open={open}
                onClose={this.handleClose}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
              >
                <DialogContent >
                  <ul className="list-group list-group-flush">
                    <h4 className="card-title text-center text-light w-80 p-3 rounded" style={{background:"#4682B4"}}>{longName}</h4>
                    <li className="list-group-item m-0 p-0">

                      <div className="d-flex flex-row justify-content-center allign-items-center p-0 m-0">
                        <p className='text font-weight-bold mr-1'>Trend Edge: </p>
                          {trendEdge}% |
                        <p className='text font-weight-bold mr-1 ml-2'>Price: </p>
                          ${priceCurr}
                      </div>

                      <div className={buildClass(fastSMA ? fastSMA.posSlope === 0 ? 0 : fastSMA.posSlope === 1 ? 1 : false: false)}>

                        <p className='text font-weight-bold mr-1'>{settings.fastSMA} Wk SMA: </p>
                          {fastSMA && fastSMA.value ? fastSMA.posSlope === 0  ? `Trending Dn at $${fastSMA.value}` : fastSMA.posSlope  === 1 ?  `Trending Up at $${fastSMA.value}` : 'Unavailable': 'Unavailable'}
                      </div> 

                      <div className={buildClass(slowSMA ? slowSMA.posSlope === 0 ? 0 : 1 : false)}>
                        <p className='text font-weight-bold mr-1'>{settings.slowSMA} Wk SMA: </p>
                          {slowSMA && slowSMA.value ? slowSMA.posSlope === 0  ? `Trending Dn at $${slowSMA.value}` : slowSMA.posSlope  === 1 ?  `Trending Up at $${slowSMA.value}` : 'Unavailable': 'Unavailable'}
                      </div> 

                      <div className={buildClass(macd ? macd.posSlope === 0 ? 0 : 1 : false)}>
                        <p className='text font-weight-bold mr-1'>MACD: </p>
                        {macd && macd.value ? macd.posSlope  === 1 ? `Trending Up at ${macd.value}` : macd.posSlope  === 0 ? `Trending Dn  at ${macd.value}` : 'Unavailable': 'Unavailable'}
                      </div>

                      <div className={buildClass(slowSMA ? slowSMA.posSlope === 0 ? 0 : 1 : false)}>
                          <p className='text font-weight-bold mr-1'>ADX: </p>{adx && slowSMA.posSlope  === 1 ? `${adx}%` : `Not Applied`}
                      </div>

                        <div className= "d-flex flex-row justify-content-center p-0 m-0 text-dark">
                            <h5 className='text font-weight-bold mr-1'> - Volume Data - </h5>
                        </div>

                        <div className= "row justify-content-center text-center p-0 m-0">
                          <p className='text font-weight-bold mr-1'>Current Wk: </p>
                            {volume ? volume.currValue && volume.fastAverageValue ? ` ${(volume.currOverAverage * 100).toFixed(2)}% of the ${settings.fastSMA} wk Avg.` : 'Vol. data unavailable': 'Vol. data unavailable' }
                        </div>
                        
                        <div className= "row justify-content-center text-center p-0 m-0">
                            <p className='text font-weight-bold mr-1'>Trend:</p>
                            {
                            volume && volume.fastAverageLookbackValue && volume.fastAverageValue ? 
                                volume.fastAverageLookbackValue < volume.fastAverageValue ? 
                                `Up relative to ${settings.lookback} wks ago` :
                                `Down relative to ${settings.lookback} wks ago` :
                                'Vol. trend data unavailable'
                            }
                        </div>
                        
                        <div className= "row justify-content-end p-0 m-0 text-dark" style={{fontSize:'10px'}}>
                            <p className='font-weight-bold p-0 m-0 mr-1' style={{fontSize:'12px'}}>Last Updated: </p> {new Date(lastUpdated).toLocaleDateString('en-US')}
                        </div>
                    </li>

                  </ul>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} style={{background:"white"}}>
                      <span className="material-icons ml-1">&#xe5cd;</span>
                    </Button>
                </DialogActions>
              </Dialog>
                  
              <Dialog
                open={fundamentalModal.open}
                onClose={this.handleClose}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
              >
                  <DialogContent >
                    <ul className="list-group list-group-flush">
                      <h4 className="card-title text-center text-light w-80 p-3 rounded" style={{v:"#4682B4"}}>{fundamentalModal.longName}</h4>
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
                      <Button onClick={this.handleClose} style={{background:"white"}}>
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
  if(code===0) return base += ' text-danger'
  if (code===1) return base += ' text-success'
  return base += ' text-secondary'
}
 
export default Watchlist;