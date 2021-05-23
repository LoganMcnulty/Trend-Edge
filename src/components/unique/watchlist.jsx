// out of house
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper'

// In House
import ServeToDash from '../common/serveToDash'
import auth from '../../services/authService'
import {getTrendEdge} from '../../services/assetService';
import {getUser} from '../../services/userService'
import TickerInputNew from './tickerInputNew';
import {saveSettings} from '../../services/userService'
import DataTable from '../common/dataTable'
import Loading from "../common/loading/loading";



class Watchlist extends Component {
    state = {
      assetData:[],
      columns:[
        { title: 'Ticker', field: 'name' },
        { title: 'TrendEdge', field: 'trendEdge', type: 'numeric' },
        { title: 'Price', field: 'priceCurr', type: 'numeric' }

        ],
      status:{
        busy:false,
        dataRetrieved:false,
        errors:false
      },
      userID:'',
      watchlist:[],
      settings: '',
      currentInput: ''
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleCSVSubmit.bind(this);
    this.fileInput = React.createRef();
    }

  async componentDidMount() {
    try{
      const {status} = this.state
      status['busy'] = true
      this.setState({status})
      Promise.all([auth.getCurrentUser()])
      .then( async response => {
        const userID = response[0]._id
        console.log('Mounting User to watchlist...')
        const {settings, watchlist} = await getUser(userID)
        this.setState({watchlist, settings, userID})
        if (watchlist.length === 0) {
            status['busy'] = false
            this.setState({status})
            return
        }
        Promise.all([getTrendEdge(watchlist, settings)]).then( res => 
          {
            console.log(res)
            const assetData = res[0]['data']
            status['busy'] = false
            this.setState({assetData, status})
          })
      })
    }
    catch(er){
      console.log('something went wrong')
    }
  }

  listCompare = (newList, oldList) => {
    const finalList = oldList
    console.log(oldList)
    console.log("Length old list" + oldList.length)
    for(let i=0; i < newList.length; i++){
      let item = String(newList[i].toUpperCase()).trim()
      console.log(item)
      if (!oldList.includes(item)) finalList.push(item)
    }
    console.log("Length final list" + finalList.length)
    return finalList
  }

  handleCSVSubmit = async e => {
    e.preventDefault();
    const {watchlist, status, userID:_id, settings} = this.state
    const input = this.fileInput.current.files
    console.log(input)
    console.log(input[0])

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
      console.table(csvData[0]);
      const csvList = csvData.map(d => {return d[0]})
      saveSettings(_id, this.listCompare(csvList, watchlist), 'watchlistAdd', 'list')
    }

    if (input && input[0]) {
        let reader = new FileReader();
        reader.readAsBinaryString(input[0]);
        reader.onload = function (e) {
          obj_csv.size = e.total;
          obj_csv.dataFile = e.target.result
          console.log(obj_csv.dataFile)
          parseData(obj_csv.dataFile)
        }
    }
    }

  handleWLAdd = async (e) => {
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
    console.log('Watchlist going in: ')
    console.log(watchlist)
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
    
    status['busy'] = false
    this.setState({status, currentInput:''})

    console.log("Fetching data from user WL and settings...")
    console.log(watchlist)
    console.log(settings)
    Promise.all([getTrendEdge(watchlist, settings)]).then( res => 
      {
        const assetData = res[0]['data']
        this.setState({assetData})
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

  handleSeeMore = (e) => {

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

    render() {
      const {userID:_id, settings, watchlist, currentInput, status, assetData} = this.state
        return ( 
          <ServeToDash
            med={[8,4]}
            large={[8,2]}
            small={[12,0]}
          >
            <Paper  className='p-0'>
              <div className="row justify-content-center">
                <div className="col-lg-6 col-sm-12 col-md-12">
                  <CardContent className='p-2'>
                    <div className="row">
                      <div className="col-sm-12">
                        <Typography variant="h5" className='text-center mb-1'>Add To Watchlist</Typography>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-sm-12">
                        <TickerInputNew
                          status={status}
                          handleChange={this.handleChange}
                          handleSubmit={this.handleWLAdd}
                          currentInput={currentInput}
                          icon={'save'}
                        />
                      </div>
                      <form onSubmit={this.handleCSVSubmit}>
                        <label>
                          Upload file:
                          <input type="file" ref={this.fileInput} />
                        </label>
                        <br />
                        <button type="submit">Submit</button>
                      </form>
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
              </div>
            </Paper>

            <Paper className='p-0 mt-2'>
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
          </ServeToDash>
        );
    }
}
 
export default Watchlist;