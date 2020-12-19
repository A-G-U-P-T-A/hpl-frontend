import React, {Component} from "react";
import Axios from "axios";
import Pagination from '@material-ui/lab/Pagination';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import { Button, TextField, Switch } from '@material-ui/core';
import '../CSS/App.css';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

class App extends Component{

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      totalPages: 0,
      rows: [],
      res: {},
      team: '',
      sortElement: 'score',
      id1: '',
      id2: ''
    };
    this.getPaginatedRecord = this.getPaginatedRecord.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  getPaginatedRecord(val, sortElement) {
    Axios.get('https://hpl-backend-main-3girpzgqo0i7w.herokuapp.com/api/teams?page='+val+'&size=20&sortElement='+sortElement+'&sortOrder=descending', {headers: {"Content-Type": "application/json"}})
      .then(response=>{
        this.setState({
          totalPages: response.data.totalPages,
        });
        this.setState({res: response.data})
    });
  }

  getRecordsByName(name) {
    Axios.get('https://hpl-backend-main-3girpzgqo0i7w.herokuapp.com/api/teambyname?name='+name, {headers: {"Content-Type": "application/json"}})
      .then(response=>{
        this.setState({
          totalPages: 0,
        });
        this.setState({res: response.data})
    });
  }

  createTeam(data){
    Axios.post(
        'https://hpl-backend-main-3girpzgqo0i7w.herokuapp.com/api/createteam',
        data,
        {headers: {"Content-Type": "application/json"}})
        .then( response => {
            if(response.status===200)
                alert("NEW TEAM CREATED");
    });
    this.forceUpdate();
  }

  handlePageChange = (event, value) => {
    var pgValue = value-1;
    this.setState({
      page: pgValue
    });
    this.getPaginatedRecord(pgValue, this.state.sortElement);
    this.forceUpdate();
  }

  addTeam = (event) => {
    this.setState({
      team: event.target.value
    });
  }

  addTeamToDB = (event) => {
    var obj = {};
    obj.name = this.state.team;
    this.createTeam(obj);
  }

  changeOrder = (event, checked) => {
    console.log(checked);
    if(checked===true)
      this.setState({sortElement: 'name'});
    else {
      this.setState({sortElement: 'score'});
    }
  }

  updateOrder = (event) => {
    this.getPaginatedRecord(this.state.page, this.state.sortElement);
    this.forceUpdate();
  }

  componentDidMount() {
    this.getPaginatedRecord(this.state.page, this.state.sortElement);
  }

  createMatch = (result) => {
    let data = [];
    let team1 = {};
    let team2 = {};
    team1.id = this.state.id1;
    team2.id = this.state.id2;
    if(result==="wins") {
      team1.wins = 1;
      team2.losses = 1;
    }
    if(result==="losses") {
      team1.losses = 1;
      team2.wins = 1;
    }
    if(result==="ties") {
      team1.ties = 1;
      team2.ties = 1;
    }
    data[0] = team1;
    data[1] = team2;
    console.log(data);
    
    Axios.put(
      'https://hpl-backend-main-3girpzgqo0i7w.herokuapp.com/api/updatematchresults',
      data,
      {headers: {"Content-Type": "application/json"}})
      .then( response => {
          if(response.status===202)
              alert("MATCH UPDATED SECURELY");
    });
    this.getPaginatedRecord(this.state.page, this.state.sortElement);
    this.forceUpdate();
  }

  addTeamId = (event) => {
    if(event.target.id === 'id1')
      this.setState({id1:event.target.value});
    if(event.target.id === 'id2')
      this.setState({id2:event.target.value});
  }

  render() {
      const divStyle = {
          background: "#eee",
          padding: "10px",
          margin: "10px"
      };
      const divStyle1 = {
          padding: "10px",
      };
      const columns = [
     {  
      Header: 'id',  
      accessor: 'id'  
     },
     {  
      Header: 'name',  
      accessor: 'name'
     },
     {  
      Header: 'wins',  
      accessor: 'wins'
     },
     {  
      Header: 'ties',  
      accessor: 'ties'
     },
     {  
      Header: 'losses',  
      accessor: 'losses'
     },
     {  
      Header: 'score',  
      accessor: 'score'
     }];
    return (
        <div>
          <div style={divStyle}><center><h2>Current Table Standings.</h2></center></div>
          <div className='rowC'>
            <Pagination style={{ width: 500 }} onChange={this.handlePageChange} count={this.state.totalPages} variant="outlined" shape="rounded" showLastButton />
            <Typography component="div">
              <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>Sort By Score</Grid>
                <Grid item><Switch onChange={this.changeOrder} name="checkedC" /></Grid>
                <Grid item>Sort By Name</Grid>
                <Grid item><Button onClick={this.updateOrder} style={{ width: 100 }} variant="outlined" color="primary">Sort</Button></Grid>
              </Grid>
            </Typography>
          </div>
          <br/>
          <div style={divStyle1}>
            <ReactTable data={this.state.res.teams} columns={columns} defaultPageSize = {5} pageSizeOptions = {[5,10]} />
          </div>
          <br/>
          <div style={divStyle1}>
            Total Teams: {this.state.res.totalItems}
          </div>
          <br/>
          <div className='rowC'>
            <div style={divStyle1}>
              <TextField style={{ width: 300 }} id="team" onChange={this.addTeam} label="TEAM" placeholder="ENTER TEAM NAME" variant="outlined" size="small"/>
            <br/><br/>
              <Button onClick={this.addTeamToDB} style={{ width: 300 }} variant="outlined" color="primary">Add a new team</Button><br/><br/>
            </div>
            <div style={divStyle1}>
              <TextField style={{ width: 300 }} onChange={this.addTeamId} label="team 1 id" id="id1" placeholder="enter team 1 id" variant="outlined" size="small"/><br/><br/>
              <TextField style={{ width: 300 }} onChange={this.addTeamId} label="team 2 id" id="id2" placeholder="enter team 2 id" variant="outlined" size="small"/><br/><br/>
              <div className='rowC'>
                <Button onClick={() => this.createMatch("wins")} name="wins" style={{ width: 100 }} variant="outlined" color="primary">Win</Button>
                <Button onClick={() => this.createMatch("losses")} name="losses" style={{ width: 100 }} variant="outlined" color="primary">Loss</Button>
                <Button onClick={() => this.createMatch("ties")} name="ties" style={{ width: 100 }} variant="outlined" color="primary">Tie</Button>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default App;
