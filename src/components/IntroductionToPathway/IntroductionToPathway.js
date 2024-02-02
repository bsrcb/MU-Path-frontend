import React, { Component } from "react";
import { Steps } from "antd";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import step_img from "./step.png";
import { Chart } from "@antv/g2";

export default class InputData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_step: 0,
      number_of_users: null,
      number_of_figures: null,
    };
  }

  componentDidMount = () => {
    //=========================
    //build monthly bar chart
    //=========================
    const data = [
      { name: "User", month: "Mar.2021", numbers: 0 },
      { name: "User", month: "Apr.2021", numbers: 0 },
      { name: "User", month: "May.2021", numbers: 0 },
      { name: "User", month: "Jun.2021", numbers: 0 },
      { name: "User", month: "Jul.2021", numbers: 0 },
      { name: "User", month: "Aug.2021", numbers: 1 },
      { name: "User", month: "Sept.2021", numbers: 1 },
      { name: "User", month: "Oct.2021", numbers: 1 },
      { name: "User", month: "Nov.2021", numbers: 0 },
      { name: "User", month: "Dec.2021", numbers: 5 },
      { name: "User", month: "Jan.2022", numbers: 0 },
      { name: "User", month: "Feb.2022", numbers: 0 },

      { name: "Figure", month: "Mar.2021", numbers: 0 },
      { name: "Figure", month: "Apr.2021", numbers: 0 },
      { name: "Figure", month: "May.2021", numbers: 0 },
      { name: "Figure", month: "Jun.2021", numbers: 0 },
      { name: "Figure", month: "Jul.2021", numbers: 0 },
      { name: "Figure", month: "Aug.2021", numbers: 0 },
      { name: "Figure", month: "Sept.2021", numbers: 0 },
      { name: "Figure", month: "Oct.2021", numbers: 0 },
      { name: "Figure", month: "Nov.2021", numbers: 17 },
      { name: "Figure", month: "Dec.2021", numbers: 20 },
      { name: "Figure", month: "Jan.2022", numbers: 11 },
      { name: "Figure", month: "Feb.2022", numbers: 5 },
    ];

    const chart = new Chart({
      container: "container",
      autoFit: true,
      height: 160,
      padding: [20, 20, 60, 20],
    });

    chart.data(data);
    chart.scale("numbers", {
      nice: true,
    });

    chart.axis("numbers", false);

    chart.tooltip({
      showMarkers: false,
      shared: true,
    });

    chart
      .interval()
      .position("month*numbers")
      .color("name")
      .adjust([
        {
          type: "dodge",
          marginRatio: 0,
        },
      ]);

    chart.interaction("active-region");

    chart.render();

    //=======================================
    //ger total number of users and figures
    //=======================================
    this.fetch_numbers();
  };

  fetch_numbers = () => {
    let requestOptions = {
      method: "GET",
    };
    fetch(process.env.REACT_APP_API + "/get_numbers", requestOptions)
      .then((response) => response.json())
      .then((info) => this.handleNumbers(info))
      .catch((error) => console.log("error", error));
    console.log(process.env.REACT_APP_API)
  };

  handleNumbers = (info) => {
    this.setState({
      number_of_users:info.users,
      number_of_figures:info.figures,
    })
  }

  onChangeSteps = (current) => {
    this.setState({
      current_step: current,
    });
  };

  render() {
    return (
      <React.Fragment>
        <Grid container spacing={2} style={{ marginTop: "10px" }}>
          <Grid item sm={2}>
            <Grid item sm={12}>
              <Card
                style={{
                  backgroundColor: "rgb(47,101,203, 0.15)",
                  height: "100px",
                }}
                variant="none"
              >
                <CardContent>
                  <Typography
                    component="div"
                    style={{ fontWeight: "500", fontSize: "1rem" }}
                  >
                    Total # of Figures
                  </Typography>
                  <Typography
                    style={{
                      marginTop: "15px",
                      fontWeight: "400",
                      fontSize: "1.5rem",
                    }}
                  >
                    {this.state.number_of_figures}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item sm={12} style={{ marginTop: "10px" }}>
              <Card
                style={{
                  backgroundColor: "rgb(47,101,203, 0.15)",
                  height: "100px",
                }}
                variant="none"
              >
                <CardContent>
                  <Typography
                    component="div"
                    style={{ fontWeight: "500", fontSize: "1rem" }}
                  >
                    Total # of Visitors
                  </Typography>
                  <Typography
                    style={{
                      marginTop: "15px",
                      fontWeight: "400",
                      fontSize: "1.5rem",
                    }}
                  >
                    {this.state.number_of_users}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid item sm={10}>
            <Card
              style={{
                height: "210px",
                backgroundColor: "rgb(47,101,203, 0.08)",
              }}
              variant="none"
            >
              <CardContent>
                <Typography
                  component="div"
                  style={{ fontWeight: "500", fontSize: "1rem" }}
                >
                  # of New Users and Figures / per month
                </Typography>
              </CardContent>
              <div id="container"></div>
            </Card>
          </Grid>
        </Grid>
        <Grid container>
          <Typography
            style={{ marginTop: "40px", fontSize: "1.3rem", fontWeight: "500" }}
          >
            How Pathway Curator Works?
          </Typography>
        </Grid>
        <br></br>
        <br></br>
        <br></br>
        <Grid container>
          <img alt="Introduction" src={step_img} style={{ width: "60%" }}></img>
        </Grid>
      </React.Fragment>
    );
  }
}
