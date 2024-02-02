import React, { PureComponent } from "react";
import Introduction from "./containers/Introduction";
import Prediction from "./containers/prediction/Prediction";
import New_Prediction from "./containers/prediction/New_Prediction";
import History from "./containers/History";
import Result from "./containers/Result/Result";
import Edit from "./containers/Edit";
import Datasets from "./containers/Datasets/Datasets"
import Logo from "./components/logo/Logo";
import Header from "./components/header/Header";
import Navbar from "./components/navbar/Navbar";
import PageTitle from "./components/page_title/Page_title";
import styles from "./Main.module.css";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { Container, Typography } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { Menu, Button } from "antd";
import { Empty } from "antd";
import { blue } from "@mui/material/colors";
import {
  CrownFilled,
  UserOutlined,
  ApartmentOutlined,
  AreaChartOutlined,
  BulbOutlined,
  CloudSyncOutlined,
} from "@ant-design/icons";
import { THEME_CONTENT, THEME_NAV } from "./theme/theme";
import { BREAK_POINTS } from "./theme/breakPoint";

//css

const SYMBOL = {
  color: "white",
  fontWeight: "500",
  fontSize: "1.2rem",
  marginLeft: "2.5vw",
  display: "inline",
  width: "20vw",
};

const USER_INFO = {
  color: "white",
  fontWeight: "500",
  fontSize: "1.1rem",
  float: "right",
  marginRight: "2.5vw",
  // width:'20vw',
  display: "inline",
};

/**
 * @description Integrate all components
 * @author MaoZane
 * @export Index
 * @class Main
 * @extends {PureComponent}
 */

export default class Main extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current_page: "Introduction",
      base64_figure: null,
      figureInfo: [],
      geneInfo: [],
      relationInfo: [],
      resultStatus: "none",
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      theme: "light",
      fig_metadata: {},
      paper_metadata: {},
    };
  }

  change_theme = (theme) => {
    this.setState({
      theme: theme,
    });
  };

  setUserId = () => {
    let randomId = Number(Math.random().toString().substr(2)).toString(36);
    let time = new Date().toISOString();
    let userId = time + randomId;
    userId = userId.replace(/[^a-zA-Z]/g, '');
    console.log("UserId",userId)
    localStorage.setItem("pathway", userId);

    var myData = localStorage.getItem("myData");
    console.log(myData);
  };

  handleClickMenu = (e) => {
    // console.log('click ', e);
    this.setState({
      current_page: e.key,
    });
  };

  searchUserID = () => {
    if (!localStorage.getItem("pathway")) {
      this.setUserId();
    }else{
      this.verifyUserID(localStorage.getItem("pathway"));
    }
  }

  verifyUserID = (id) => {
    let form_data = new FormData();
    form_data.append("user_id", localStorage.pathway);
    let requestOptions = {
      method: "POST",
      body: form_data,
    };
    
    // // ****** fetch post /predict */
    fetch(process.env.REACT_APP_API + "/verify_user_id", requestOptions)
    .then(response => {
      // Handle the response from the server
      console.log('Response received');
    })
    .catch(error => {
      // Handle any errors that occur
      console.error('Error occurred:', error);
    });
      
  }

  componentDidMount = () => {
    this.searchUserID()
    window.addEventListener("resize", () => {
      this.setState({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      });
    });
  };

  fn_showResult = async (info) => {
    this.fn_changePredictionStatus("start");
    console.log(info.relation);
    // console.log(info.figure[0])
    this.setState({
      paper_metadata: info.paper_metadata[0],
      fig_metadata: info.fig_metadata[0],
      figureInfo: [info.figure[0]], // [info, base64]: info:width height fig_id fig_name fig_path
      base64_figure: info.figure[1], // base64:figure's base64
      geneInfo: info.gene, // [obj]: obj:dict_id gene_id gene_name gene_BBox("left top width height")
      relationInfo: info.relation, // [obj]: obj:activator(gene_id) receptor(gene_id) activator_name receptor_name relation_BBox relation_id relation_type
    });
    this.fn_changePredictionStatus("end");
  };

  fn_showHistoryResult = async (index) => {
    // console.log(index);
    this.fn_changePage("Result");
    this.fn_changePredictionStatus("start");
    let info = await this.fetch_historyResult(index);
    console.log(info);
    this.setState({
      paper_metadata: info.paper_metadata[0],
      fig_metadata: info.fig_metadata[0],
      figureInfo: [info.figure[0]], // [info, base64]: info:width height fig_id fig_name fig_path
      base64_figure: info.figure[1], // base64:figure's base64
      geneInfo: info.gene, // [obj]: obj:dict_id gene_id gene_name gene_BBox("left top width height")
      relationInfo: info.relation, // [obj]: obj:activator(gene_id) receptor(gene-id) activator_name receptor_name relation_BBox relation_id relation_type
    });
    this.fn_changePredictionStatus("end");
  };

  fn_reviseResult = () => {
    // console.log("revise")
    this.setState({
      current_page: "edit",
    });
  };

  fetch_historyResult = (figId) => {
    return new Promise((resolve, reject) => {
      // console.log(figId);
      var requestOptions = {
        method: "get",
      };
      fetch(
        process.env.REACT_APP_API + "/get_result/?figId=" + figId,
        requestOptions
      )
        .then((response) => response.json())
        .then((info) => resolve(info))
        .catch((error) => console.log("error", error));
    });
  };

  fetch_editGeneInfo = (row) => {
    return new Promise((resolve, reject) => {
      let formData = new FormData();
      formData.append("gene_id", this.state.geneInfo[row.id-1].gene_id);
      formData.append("gene_name", row.value);
  
      var requestOptions = {
        method: "PUT",
        body: formData,
      };
  
      fetch(process.env.REACT_APP_API + "/edit_geneInfo", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          // console.log(result);
          this.fetch_AllHistory();
        })
        .catch((error) => console.log("error", error));
    })
  };

  fn_changePredictionStatus = (status) => {
    this.setState({
      resultStatus: status,
    });
    this.fn_changePage("Result");
  };

  fn_changePage = (page) => {
    // console.log(page)
    this.setState({
      current_page: page,
    });
  };

  update_pages = (id) => {
    console.log(id);
    this.setState({
      current_page: id,
    });
  };

  handleEditGeneInfo = (row) => {
    console.log(row);
    this.fetch_editGeneInfo(row);
  }

  render() {
    // console.log(this.state.innerWidth);
    // console.log( process.env.REACT_APP_API )
    // console.log(localStorage)
    let menu = (
      <div>
        <Menu
          onClick={this.handleClickMenu}
          style={{
            width: "100%",
            height: "92vh",
            background: "black",
            color: "white",
            borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
          }}
          defaultSelectedKeys="introduction"
          selectedKeys={this.state.current_page}
          mode="inline"
        >
          <Typography
            variant="subtitle2"
            style={{ marginTop: "3vh", marginLeft: "1vw" }}
          >
            Menu
          </Typography>
          <Menu.Item
            key="introduction"
            icon={<BulbOutlined />}
            style={{ marginTop: "1vh" }}
          >
            Introduction
          </Menu.Item>
          <Menu.Item
            key="prediction"
            icon={<ApartmentOutlined />}
            style={{ marginTop: "1vh" }}
          >
            Prediction
          </Menu.Item>

          <Menu.Item
            key="New_prediction"
            icon={<ApartmentOutlined />}
            style={{ marginTop: "1vh" }}
          >
            New_Prediction
          </Menu.Item>

          <Menu.Item
            key="history"
            icon={<CloudSyncOutlined />}
            style={{ marginTop: "1vh" }}
          >
            History
          </Menu.Item>
          <Menu.Item
            key="result"
            icon={<AreaChartOutlined />}
            style={{ marginTop: "1vh" }}
          >
            Result
          </Menu.Item>
          {/* <Menu.Item key="edit" icon={<EditOutlined />} style={{marginTop:'vh'}}>Edit</Menu.Item> */}
        </Menu>
      </div>
    );
    let head = (
      <div
        style={{
          background: "rgb(47, 101, 203)",
          width: "100vw",
          lineHeight: "8vh",
        }}
      >
        <div style={SYMBOL}>
          <CrownFilled style={{ marginRight: "8px", fontSize: "25px" }} />
          Pathway Curator
        </div>
        <div style={USER_INFO}>
          User Name:{localStorage.pathway}{" "}
          <UserOutlined style={{ marginLeft: "8px", fontSize: "20px" }} />
        </div>
      </div>
    );

    //content page
    let content = (
      <div>
        <Introduction></Introduction>
      </div>
    );
    if (this.state.current_page.toLocaleLowerCase === "introduction") {
      content = (
        <div>
          <Introduction theme={this.state.theme}></Introduction>
        </div>
      );
    } else if (this.state.current_page === "Prediction") {
      content = (
        <div>
          <Prediction
            update_pages={this.update_pages}
            theme={this.state.theme}
            fn_showResult={this.fn_showResult}
            changePredictionStatus={this.fn_changePredictionStatus}
          />
        </div>
      );
    } else if (this.state.current_page === "New_Prediction") {
      content = (
        <div>
          <New_Prediction
            update_pages={this.update_pages}
            theme={this.state.theme}
            fn_showResult={this.fn_showResult}
            changePredictionStatus={this.fn_changePredictionStatus}
          />
        </div>
      );
    }else if (this.state.current_page === "History") {
      content = (
        <div>
          <History
            current_page={this.state.current_page}
            fn_showHistoryResult={this.fn_showHistoryResult}
            theme={this.state.theme}
          />
        </div>
      );
    } else if (this.state.current_page === "Result") {
      if (this.state.resultStatus === "end") {
        content = (
          <div
            style={{
              display: this.state.resultStatus === "end" ? "block" : "none",
            }}
          >
            <Result
              update_pages={this.update_pages}
              paper_metadata={this.state.paper_metadata}
              fig_metadata={this.state.fig_metadata}
              theme={this.state.theme}
              geneInfo={this.state.geneInfo}
              base64_figure={this.state.base64_figure}
              relationInfo={this.state.relationInfo}
              fn_reviseResult={this.fn_reviseResult}
              figureInfo={this.state.figureInfo}
              resultStatus={this.state.resultStatus}
              fn_changePage={this.fn_changePage}
              handleEditGeneInfo={this.handleEditGeneInfo}
            />
          </div>
        );
      } else {
        content = (
          <React.Fragment>
            <div
              style={{
                display: this.state.resultStatus === "start" ? "block" : "none",
              }}
            >
              <Stack spacing={2}>
                <Skeleton variant="text" />
                <Skeleton variant="circular" width={50} height={50} />
                <Skeleton variant="rectangular" height={300} />
              </Stack>
            </div>
            <div
              style={{
                display: this.state.resultStatus === "none" ? "block" : "none",
              }}
            >
              <Empty description="Please create a job or select a history job to show the result.">
                <Button
                  type="primary"
                  onClick={() => this.update_pages("Prediction")}
                >
                  Create
                </Button>
                <Button
                  type="primary"
                  onClick={() => this.update_pages("History")}
                  style={{ marginLeft: "20px" }}
                >
                  History
                </Button>
              </Empty>
            </div>
          </React.Fragment>
        );
      }
    }else if(this.state.current_page === "Paper & Datasets"){
      content = (
        <div>
          <Datasets
          />
        </div>
      )
    }
    return (
      // <div>
      //   <container maxwidth="100vw">
      //     <Grid
      //       container
      //       direction="column"
      //       style={{ background: "white", height: "100vh" }}
      //     >
      //       <Grid
      //         container
      //         style={{ height: "8vh", width: "100vw", background: "yellow" }}
      //       >
      //         {head}
      //       </Grid>
      //       <Grid container style={{ width: "100vw", height: "92vh" }}>
      //         <Grid container style={{ background: "red", width: "16vw" }}>
      //           {menu}
      //         </Grid>
      //         <Grid
      //           container
      //           direction="column"
      //           style={{ background: "blue", width: "84vw" }}
      //         >
      //           <Grid
      //             style={{
      //               display: "inline-block",
      //               overflowY: "auto",
      //               overflowX: "hidden",
      //               width: "84vw",
      //               height: "82vh",
      //               background: "rgb(247, 249, 252)",
      //             }}
      //           >
      //             <div style={{ width: "84vw" }}>{content}</div>
      //           </Grid>
      //           <Grid
      //             style={{
      //               padding: "0 3vw",
      //               width: "84vw",
      //               height: "10vh",
      //               background: "rgb(247, 249, 252)",
      //               lineHeight: "10vh",
      //               borderTop: "1px solid rgba(0, 0, 0, 0.12)",
      //             }}
      //           >
      //             @DBL
      //           </Grid>
      //         </Grid>
      //       </Grid>
      //     </Grid>
      //   </container>
      // </div>

      <div id="container_main" className={styles.container_main}>
        <div
          className={styles.nav}
          style={{
            display: window.innerWidth < BREAK_POINTS.lg ? "none" : "block",
          }}
        >
          <Logo
            background_logo={THEME_NAV[this.state.theme].background_logo}
            logo_icon_color={THEME_NAV[this.state.theme].logo_icon_color}
          ></Logo>
          <div
            className={styles.container_navbar}
            style={THEME_NAV[this.state.theme]}
          >
            <Navbar
              update_pages={this.update_pages}
              icon_color={THEME_NAV[this.state.theme].icon_color}
            ></Navbar>
          </div>
        </div>
        <div id="content_container" className={styles.content_container}>
          <Header
            update_pages={this.update_pages}
            theme={this.state.theme}
            change_theme={this.change_theme}
            innerWidth={this.state.innerWidth}
            background_color={
              THEME_CONTENT[this.state.theme].background_color_header
            }
          ></Header>
          <div
            className={styles.content}
            style={{
              background:
                THEME_CONTENT[this.state.theme].background_color_pages,
              height: window.innerHeight - 64 - 60,
              color: THEME_CONTENT[this.state.theme].color,
            }}
          >
            <PageTitle
              theme={this.state.theme}
              current_page={this.state.current_page}
            />
            {content}
          </div>
          <footer
            className={styles.footer}
            style={{
              backgroundColor:
                THEME_CONTENT[this.state.theme].background_color_footer,
              color: THEME_CONTENT[this.state.theme].color,
            }}
          >
            <p>@2021-DBL</p>
          </footer>
        </div>
      </div>
    );
  }
}
