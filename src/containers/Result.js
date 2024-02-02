import React, { PureComponent } from "react";
import {
  Typography,
  Divider,
  Button,
  IconButton,
  Select,
  MenuItem,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import { Spin, Alert } from "antd";
import { Empty } from "antd";

// const data = {
//     // 节点
//     nodes: [
//       {
//         id: 'node1',
//         x: 0,
//         y: 0,
//         width: 80,
//         height: 40,
//         label: 'Hello',
//       },
//       {
//         id: 'node2',
//         x: 160,
//         y: 180,
//         width: 80,
//         height: 40,
//         label: 'word',
//       },
//     ],
//     // 边
//     edges: [
//       {
//         source: 'node1',
//         target: 'node2',
//       },
//     ],
//   }

const rowsPerPage = 10;
var graph = null;

// const BOX_STYLE1 = {
//   background: "rgb(255, 255, 255)",
//   height: "64vh",
//   width: "38.25vw",
//   float: "left",
//   marginTop: "3vh",
//   boxShadow:
//     "rgb(50 50 93 / 3%) 0px 2px 5px -1px, rgb(0 0 0 / 5%) 0px 1px 3px -1px",
//   borderRadius: "6px",
//   padding: "1vw",
// };
const BOX_STYLE2 = {
  background: "rgb(255, 255, 255)",
  height: "64vh",
  boxShadow:
    "rgb(50 50 93 / 3%) 0px 2px 5px -1px, rgb(0 0 0 / 5%) 0px 1px 3px -1px",
  borderRadius: "6px",
  display: "inline-block",
  width: "38.25vw",
  // marginLeft:'1.5vw',
  padding: "1vw",
  marginTop: "3vh",
  overflowY: "auto",
  overflowX: "auto",
};
const BOX_STYLE3 = {
  background: "rgb(255, 255, 255)",
  minHeight: "30vh",
  boxShadow:
    "rgb(50 50 93 / 3%) 0px 2px 5px -1px, rgb(0 0 0 / 5%) 0px 1px 3px -1px",
  borderRadius: "6px",
  marginTop: "2.4vh",
  float: "left",
  // padding:'2vh',
  width: "38.25vw",
};
const BOX_STYLE4 = {
  background: "rgb(255, 255, 255)",
  minHeight: "30vh",
  boxShadow:
    "rgb(50 50 93 / 3%) 0px 2px 5px -1px, rgb(0 0 0 / 5%) 0px 1px 3px -1px",
  borderRadius: "6px",
  marginLeft: "1.5vw",
  display: "inline-block",
  // padding:'2vh',
  marginTop: "2vh",
  width: "38.25vw",
};


/**
 * @description
 * @author MaoZane
 * @export Main
 * @class Result
 * @extends {PureComponent}
 */
export default class Result extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      onlineDictionary: "geneCard",
      page_gene: 0,
      page_relation: 0,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      sizeOfFigure: 36.25, //figure width vw
      resultStatus: this.props.resultStatus,
      loading: true,
    };
  }

  componentDidMount() {
    //get the width of the current window to change the width of the simulate figure
    setInterval(() => {
      var innerWidthNow = window.innerWidth;
      var innerHeightNow = window.innerHeight;
      if (
        this.state.innerWidth !== innerWidthNow ||
        this.state.innerHeight !== innerHeightNow
      ) {
        this.setState({
          innerWidth: innerWidthNow,
          innerHeight: innerHeightNow,
        });
      }
    }, 500);

    //create simulate figure
    // if (this.props.figureInfo.length > 0) {
    //     let graphWidth = this.state.innerWidth * 0.3625
    //     let graphHeight = this.state.innerHeight * 0.6
    //     let scale = graphWidth / this.props.figureInfo[0].width //scale of the showed image

    //     let data = {
    //         nodes:[],
    //         edges:[]
    //     }

    //     //generate node info
    //     this.props.geneInfo.forEach((element, index) => {
    //         let X = element.gene_BBox.split(",")[0] //
    //         let Y = element.gene_BBox.split(",")[1]

    //         data.nodes.push(
    //             {
    //                 id: 'node'+ element.gene_id,
    //                 x: X * scale,
    //                 y: Y * scale,
    //                 width: 50,
    //                 height: 20,
    //                 // label: element.gene_name,
    //                 attrs: {
    //                     body: {
    //                     fill: '#2ECC71', // 背景颜色
    //                     stroke: '#000',  // 边框颜色
    //                     },
    //                     label: {
    //                     text: element.gene_name,    // 文本
    //                     fill: '#333',               // 文字颜色
    //                     fontSize: 11,               // 文字大小
    //                     },
    //                 },
    //             }
    //         )
    //     });

    //     //generate arrow
    //     this.props.relationInfo.forEach(e => {
    //         console.log(e)
    //         data.edges.push(
    //             {
    //                 source: 'node' + e.activator,
    //                 target: 'node' + e.receptor,
    //             }
    //         )
    //     })

    //     //generate a graph
    //     graph = new Graph({
    //         container: document.getElementById('container'),
    //         selecting: {
    //             enabled: true,
    //             showNodeSelectionBox: true,
    //         },
    //         width:graphWidth,
    //         height:graphHeight,
    //         background: {
    //             color: '#fffbe6', // 设置画布背景颜色
    //         },
    //         grid: {
    //         size: 10,      // 网格大小 10px
    //         visible: true, // 渲染网格背景
    //         },
    //         scroller: {
    //             enabled: true,
    //             pannable: true,
    //             pageVisible: true,
    //             pageBreak: false,
    //         },
    //         mousewheel: {
    //             enabled: true,
    //             modifiers: ['ctrl', 'meta'],
    //         },
    //     });

    //     graph.fromJSON(data) // load data to graph

    //     // graph.toPNG((dataUri) => {
    //     //     // 下载
    //     //     DataUri.downloadDataUri(dataUri, 'chart.png')
    //     //   })

    //     // graph.on('node:selected', (Node) => {
    //     //     console.log(Node)
    //     //     window.open("https://www.google.com/")
    //     // })
    // }
  }

  componentWillReceiveProps(props) {
    this.setState({
      resultStatus: props.resultStatus,
    });
  }

  handleChangePage = (event, newPage) => {
    // console.log(newPage)
    this.setState({
      page_gene: newPage,
    });
  };

  handleChangeRelationPage = (event, newPage) => {
    // console.log(newPage)
    this.setState({
      page_relation: newPage,
    });
  };

  fn_zoomInFigure = () => {
    //zoo min 5vw
    this.setState({
      sizeOfFigure: this.state.sizeOfFigure + 5,
    });
  };

  fn_zoomOutFigure = () => {
    //zoom out 5vw
    this.setState({
      sizeOfFigure: this.state.sizeOfFigure - 5,
    });
  };

  fn_selectDictionary = (e) => {
    // console.log(e.target.value  )
    this.setState({
      onlineDictionary: e.target.value,
    });
  };

  fn_reviseResult = () => {
    alert("It will be supported in the next version");
  };

  fn_downloadResult = () => {
    // console.log(this.props.geneInfo);
    // console.log(this.props.relationInfo)
    var gene_data =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(this.props.geneInfo));
    var downloadGeneNode = document.createElement("a");
    downloadGeneNode.setAttribute("href", gene_data);
    downloadGeneNode.setAttribute("download", "gene_info.json");
    downloadGeneNode.click();
    downloadGeneNode.remove();

    var relation_data =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(this.props.relationInfo));
    var downloadRelationNode = document.createElement("a");
    downloadRelationNode.setAttribute("href", relation_data);
    downloadRelationNode.setAttribute("download", "relation_info.json");
    downloadRelationNode.click();
    downloadRelationNode.remove();
  };

  render() {
    //geneCard
    if (this.state.onlineDictionary === "geneCard") {
      var url_dic = "https://www.genecards.org/cgi-bin/carddisp.pl?gene=";
    } else if (this.state.onlineDictionary === "uniProt") {
      url_dic = "https://www.uniProt.org/uniProt/?query=";
    }
    // console.log(graph)
    if (graph != null) {
      // console.log("resize")
      graph.resize(
        this.state.innerWidth * 0.3625,
        this.state.innerHeight * 0.6
      );
    }
    // console.log(document.getElementById("node1"))
    // let simulatedFigure = (
    //   <div style={BOX_STYLE1}>
    //     <div id="container"></div>
    //   </div>
    // );

    let realFigure = (
      <div style={BOX_STYLE2}>
        <IconButton
          onClick={this.fn_zoomInFigure}
          color="primary"
          aria-label="upload picture"
          component="span"
          size="small"
        >
          <ZoomInIcon />
        </IconButton>
        <IconButton
          onClick={this.fn_zoomOutFigure}
          color="primary"
          aria-label="upload picture"
          component="span"
          size="small"
        >
          <ZoomOutIcon />
        </IconButton>
        <div style={{ position: "relative", width: "38.25vw", height: "64vh" }}>
          <img
            alt = ""
            style={{ width: this.state.sizeOfFigure + "vw" }}
            src={this.props.base64_figure}
          ></img>

          {
            //gene bbox
            this.props.geneInfo.map((value, index) => {
              // console.log(value)
              let scale_of_bbox =
                (window.innerWidth) /
                100 /
                this.props.figureInfo[0].width;
              console.log(scale_of_bbox)
              let geneBbox = {
                position: "absolute",
                top: value.gene_BBox.split(",")[1] * scale_of_bbox - 2.5 + "px",
                left: value.gene_BBox.split(",")[0] * scale_of_bbox - 2.5 + "px",
                width: value.gene_BBox.split(",")[2] * scale_of_bbox + 5 + "px",
                height: value.gene_BBox.split(",")[3] * scale_of_bbox + 5 + "px",
                border: "2px solid blue",
              };
              return (
                <span
                  id={index}
                  style={geneBbox}
                  href={url_dic + value.gene_name}
                  target="view_window"
                ></span>
              );
            })
          }

          {
            //relation bbox
            this.props.relationInfo.map((value, index) => {
              // console.log(value)
              let scale_of_bbox =
                (this.state.sizeOfFigure * this.state.innerWidth) /
                100 /
                this.props.figureInfo[0].width;
              let relationBbox = {
                position: "absolute",
                top: value.relation_Bbox.split(",")[1] * scale_of_bbox + "px",
                left: value.relation_Bbox.split(",")[0] * scale_of_bbox + "px",
                width: value.relation_Bbox.split(",")[2] * scale_of_bbox + "px",
                height: value.relation_Bbox.split(",")[3] * scale_of_bbox + "px",
                border: "2px solid red",
              };
              return <span id={index} style={relationBbox}></span>;
            })
          }
        </div>
      </div>
    );

    let tableOfGene = (
      <div style={BOX_STYLE3}>
        <Paper>
          <TableContainer style={{ height: "50vh" }}>
            <Table stickyHeader aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">
                    Info in the Gene dictionary
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.geneInfo
                  .slice(
                    this.state.page_gene * rowsPerPage,
                    this.state.page_gene * rowsPerPage + rowsPerPage
                  )
                  .map((e, i) => (
                    <TableRow key={this.state.page * rowsPerPage + i + 1}>
                      <TableCell width="10%">
                        {this.state.page_gene * rowsPerPage + i + 1}
                      </TableCell>
                      <TableCell width="30%" align="left">
                        {e.gene_name}
                      </TableCell>
                      <TableCell align="left" width="60%">
                        <a href={url_dic + e.gene_name} target="view_window">
                          More detail
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={rowsPerPage}
            component="div"
            count={this.props.geneInfo.length}
            rowsPerPage={rowsPerPage}
            page={this.state.page_gene}
            onChangePage={this.handleChangePage}
          />
        </Paper>
      </div>
    );

    let tableOfRelation = (
      <div style={BOX_STYLE4}>
        <Paper>
          <TableContainer style={{ height: "50vh" }}>
            <Table stickyHeader aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="left">Activator</TableCell>
                  <TableCell align="left">Relation type</TableCell>
                  <TableCell align="left">Receptor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.relationInfo
                  .slice(
                    this.state.page_relation * rowsPerPage,
                    this.state.page_relation * rowsPerPage + rowsPerPage
                  )
                  .map((e, i) => (
                    <TableRow
                      key={this.state.page_relation * rowsPerPage + i + 1}
                    >
                      <TableCell width="10%">
                        {this.state.page_relation * rowsPerPage + i + 1}
                      </TableCell>
                      <TableCell width="30%" align="left">
                        {e.activator_name}
                      </TableCell>
                      <TableCell align="left" width="30%">
                        {e.relation_type}
                      </TableCell>
                      <TableCell align="left" width="30%">
                        {e.receptor_name}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={rowsPerPage}
            component="div"
            count={this.props.relationInfo.length}
            rowsPerPage={rowsPerPage}
            page={this.state.page_relation}
            onChangePage={this.handleChangeRelationPage}
          />
        </Paper>
      </div>
    );
    // console.log(this.state.resultStatus)
    let loading = (
      <div >
        <Spin spinning={this.state.loading} size="large">
          <Alert
            message="Alert message title"
            description="Further details about the context of this alert."
            type="info"
          />
        </Spin>
      </div>
    );
    return (
      <div>
        <div
          style={{
            display: this.state.resultStatus === "none" ? "block" : "none",
            marginTop: "5vh",
          }}
        >
          <Empty
            imageStyle={{
              height: 80,
            }}
            description={
              <span>You need to create a job or select a history job.</span>
            }
          >
            <Button
              variant="contained"
              size="small"
              onClick={() => this.props.fn_changePage("prediction")}
              style={{
                background: "rgb(47, 101, 203)",
                color: "white",
                marginTop: "2vh",
              }}
            >
              Create a Job
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => this.props.fn_changePage("history")}
              style={{
                background: "rgb(47, 101, 203)",
                color: "white",
                marginLeft: "1vw",
                marginTop: "2vh",
              }}
            >
              Show a Job
            </Button>
          </Empty>
        </div>
        <div
          style={{
            display: this.state.resultStatus === "start" ? "block" : "none",
          }}
        >
          {loading}
        </div>
        <div
          style={{
            width: "78vw",
            marginLeft: "2vw",
            marginTop: "3vh",
            display: this.state.resultStatus === "end" ? "block" : "none",
          }}
        >
          <p
            style={{
              display: "inline",
              fontSize: "16px",
              fontWeight: "600",
              color: "#f50057",
            }}
          >
            Choose the online dictionary:
          </p>
          <Select
            style={{ width: "7vw", marginLeft: "1vw" }}
            defaultValue={"geneCard"}
            onChange={this.fn_selectDictionary}
          >
            <MenuItem value={"geneCard"}>geneCard</MenuItem>
            <MenuItem value={"uniProt"}>uniProt</MenuItem>
          </Select>
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            onClick={this.fn_downloadResult}
            style={{ marginLeft: "1vw", float: "right" }}
          >
            Download the result
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            onClick={this.fn_reviseResult}
            style={{ marginLeft: "1vw", float: "right" }}
          >
            Edit the result
          </Button>
          <div>
            {tableOfGene}
            {tableOfRelation}
          </div>
          <div>
            {/* {simulatedFigure} */}
            {realFigure}
          </div>
        </div>
        <div style={{ height: "10vh" }}></div>
        {/* <div id = "container"></div> */}
      </div>
    );
  }
}
