import React, { Component } from "react";
import { Button } from "antd";
import { Typography, Divider } from "@material-ui/core";
import { alpha, styled } from "@mui/material/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Collapse from "@mui/material/Collapse";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import LinearProgress from '@mui/material/LinearProgress';

/**
 * @description History component, display history records.
 * @author MaoZane
 * @export
 * @class History
 * @extends {Component}
 */
var fetch_history_timer
 function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress color={props.value === 100? 'primary':'secondary'} variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyInfo: [],
      expand_table_name: "",
      job_names:[],
      current_page:this.props.current_page
    };
  }

  componentDidMount = () => {
    this.fetch_AllHistory();
    fetch_history_timer = setInterval(()=>this.fetch_AllHistory(),10000)
  };


  componentDidCatch(error, info) {
    console.log(error, info);
  }

  fetch_AllHistory = () => {
    var requestOptions = {
      method: "get",
    };
    fetch(
      process.env.REACT_APP_API +
        "/get_all_history_info/?user_name=" +
        localStorage.pathway,
      requestOptions
    )
      .then((response) => response.json())
      .then((info) => this.fn_getHistoryInfo(info))
      .catch((error) => console.log("error", error));
  };

  fn_getHistoryInfo = (info) => {
    if(info.unfinished_figs  == 0){
      clearInterval(fetch_history_timer);
      fetch_history_timer = null;
    }
    console.log(info);
    let job_names = []
    for(let key in info.info){
      job_names.push(key)
    }
    // job_names=job_names.reverse
    this.setState({
      job_names:job_names.reverse(),
      historyInfo: info.info,
    });
  };

  fn_showHistoryResult = (figId) => {
    // console.log(figId);
    this.props.fn_showHistoryResult(figId);
  };

  test = (fig_id, job_id) => {
    // console.log(45455645)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "multipart/form-data");

    let formData = new FormData();
    formData.append("job_id", job_id);
    formData.append("fig_id", fig_id);

    var requestOptions = {
      method: "POST",
      body: formData,
    };

    fetch(process.env.REACT_APP_API + "/delete_history", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        // console.log(result);
        this.fetch_AllHistory();
      })
      .catch((error) => console.log("error", error));
  };
  expand_table = (name) => {
    if (name === this.state.expand_table_name) {
      this.setState({
        expand_table_name: "",
      });
    } else {
      this.setState({
        expand_table_name: name,
      });
    }
  };

  render() {
    console.log(this.state.current_page)
    // const classes = useStyles();
    // console.log(rows)
    let history_list = (
      <div>
        <TableContainer component={Paper} style={{ backgroundColor: "" }}>
          <Table stickyHeader aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell><p>ID</p></TableCell>
                <TableCell align="left"><p>Job Name</p></TableCell>
                <TableCell align="center"><p># Of Figure</p></TableCell>
                <TableCell align="center"><p>% of Processing</p></TableCell>
                <TableCell align="center"><p>Del</p></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
            
              this.state.job_names.map((e, i) => (
                <React.Fragment>
                  <TableRow key={e}>
                    <TableCell width="5%">
                      <Button
                        shape="circle"
                        onClick={this.expand_table.bind(this, e)}
                      >
                        {this.state.expand_table_name === e ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell width="5%"><p>{i + 1}</p></TableCell>
                    <TableCell width="30%" align="left">
                    <p>{e}</p>
                    </TableCell>
                    <TableCell align="center" width="10%">
                    <p>{this.state.historyInfo[e].length}</p>
                    </TableCell>
                    <TableCell align="center" width="30%">
                    <LinearProgressWithLabel value={this.state.historyInfo[e][0].processing} />
                      
                    </TableCell>
                    <TableCell align="center" width="20%">
                    <p>del</p>
                    </TableCell>
                 
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        id={e}
                        key={e}
                        in={this.state.expand_table_name === e}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ margin: 1 }}>
                          <Table size="small" aria-label="purchases">
                            <TableHead>
                              <TableRow>
                                <TableCell><p>Figure Name</p></TableCell>
                         
                                <TableCell><p>Status</p></TableCell>
                                <TableCell align="center"><p>Action</p></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {
                                this.state.historyInfo[e].map((fig,i)=>(
                                  <TableRow>
                                  <TableCell><p>{fig.fig_name}</p></TableCell>
                                  <TableCell>{fig.predict_status===1? <p style={{color:"#2f65cb"}}>successful</p>:<p style={{color:"rgb(156 39 176)"}}>pending</p>}</TableCell>
                             
                                  <TableCell align="center">
                                    <Button
                                      disabled={!fig.predict_status}
                                      variant="contained"
                                      size="small"
                                      type="primary"
                                      id={e.fig_id}
                                      onClick={this.fn_showHistoryResult.bind(
                                        this,
                                        fig.fig_id
                                      )}
                                    >
                                      <p>Show</p>
                                    </Button>
                                    <Button
                                     disabled={!fig.predict_status}
                                      variant="contained"
                                      size="small"
                                      type="secondary"
                                      id={e.fig_id}
                                      onClick={() =>
                                        this.test(e.fig_id, e.job_id)
                                      }
                                      style={{ marginLeft: "10px" }}
                                    >
                                      <p>Delete</p>
                                    </Button>
                                  </TableCell>
                                </TableRow>
                                ))
                              }
                             
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );

    return (
      <div>
        <div>{history_list}</div>
      </div>
    );
  }
}
