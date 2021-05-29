// out of house
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

// In House
import {populateDatabase} from '../../services/adminService'

class PopulateDBcsv extends Component {
  state = {
    status:{
        busy:false,
        dataRetrieved:false,
        errors:false,
        csvErrors:false
      },
    csvFile: '',
    modal: false
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleCSVSubmit.bind(this);
    this.fileInput = React.createRef();
    this.form = React.createRef();
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

  handleCSVSubmit = e => {
    e.preventDefault();
    // this.setState({modal:true})

    const { userID:_id, csvFile} = this.state
    const input = csvFile
    var obj_csv = {
        size:0,
        dataFile:[]
    };

    const handleCSV = async (data) => {
      let csvData = [];
      let lbreak = data.split("\n");
      lbreak.forEach(res => {
          csvData.push(res.split(","));
      });

      const tickers = csvData.map(d => {return d[0]})
      const names = csvData.map(d => {return d[1]})
      const exchange = csvData.map(d => {return d[2]})
      const assetType = csvData.map(d => {return d[3]})
      const ipoDate = csvData.map(d => {return d[4]})
      const baseAssets = []

      console.log(
          `== lengths of arrays\n
          Tickers - ${tickers.length}\n
          Names - ${names.length}\n
          Exchange - ${exchange.length}\n
          AssetType - ${assetType.length}\n
          IpoDate - ${ipoDate.length}\n
          `
      )
      for (let i=1; i < tickers.length; i++){
        if (!this.validateTicker(tickers[i])) continue
        let baseAsset = {
            ticker: tickers[i],
            longName: names[i],
            ipoDate: ipoDate[i],
            exchange: exchange[i],
            assetType: assetType[i],
            ipoDate: ipoDate[i],
        }
        baseAssets.push(baseAsset)
      }
      return baseAssets
    }


    if (input && input[0]) {
        console.log(input.length)
        console.log(input)
        console.log(input[0])

        console.log('csv received')
        let reader = new FileReader();
        reader.readAsBinaryString(input[0]);
        try{
          reader.onload = async (e) => {
            obj_csv.size = e.total;
            obj_csv.dataFile = e.target.result
            const assetsFromCSV = await handleCSV(obj_csv.dataFile)
            var i,j,temparray,chunk = 100;
            for (i=0, j=assetsFromCSV.length; i<j; i+=chunk) {
                temparray = assetsFromCSV.slice(i,i+chunk);
                await populateDatabase(temparray)
            }
            this.setState({csVFile:''})
            return document.getElementById("fileInputForm").reset();
          }
        }
        catch (err) {
          console.log("Error: CSV Likely incorrect format")
          document.getElementById("fileInputForm").reset();
          return this.setState({csvErrors:true, csvFile:''})
        }

    }
    else{
      document.getElementById("fileInputForm").reset();
      return console.log("Issue reading .csv")
    }

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


  handleClose = () => this.setState({modal:false, csvFile:''})

  onFileChange = () => {
    const csvFile = this.fileInput.current.files
    this.setState({csvFile})
  }

  render() {
    const {status,csvFile, modal} = this.state
      return (
        <>
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
            {status.csvErrors &&
            <div className="card text-white text-center bg-danger w-80 mt-2">
                <div className="card-body">
                <p className="card-text">.csv format error, double check the tool-tip for proper format</p>
                </div>
            </div>
            }
        </>
      );
    }
}
 
export default PopulateDBcsv;