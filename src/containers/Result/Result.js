import React, { Component } from "react";
import Grid from "@mui/material/Grid";
import styles from "./result.module.css";
import { DataGrid } from "@mui/x-data-grid";
import "antd/dist/antd.css";
import { Button, Select } from "antd";
import Drawer from "@mui/material/Drawer";
import { THEME_CONTENT } from "../../theme/theme";
import { Divider, Col, Row } from "antd";
import set_notification from "../../components/notification/notification";

const { Option } = Select;

const columns_elements = [
  { field: "id", headerName: "ID", width: 50 },
  {
    field: "name",
    headerName: "Gene Name",
    width: 160,
    editable: true,
  },
];

const columns_relations = [
  { field: "id", headerName: "ID", width: 50 },
  {
    field: "activator",
    headerName: "Activator",
    width: 170,
    editable: true,
  },
  {
    field: "category",
    headerName: "Relation type",
    width: 140,
    editable: true,
  },
  {
    field: "receptor",
    headerName: "Receptor",
    width: 170,
    editable: true,
  },
];
const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">
      {title}: {content}
    </p>
  </div>
);
export default class Result extends Component {
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
      expanded: "panel1",
      figure_width: 0,
      visible: false,
    };
  }
  resize = () => {
    if (document.getElementById("paper_figure")) {
      var paper_width = document.getElementById("paper_figure").offsetHeight;
      console.log(paper_width);
    }
    this.setState({
      figure_width: paper_width,
    });
  };
  componentDidMount() {
    window.addEventListener("resize", this.resize);
    //get the width of the current window to change the width of the simulate figure

    var paper_width = document.getElementById("paper_figure").offsetHeight;
    // console.log(paper_width);

    this.setState({
      figure_width: paper_width,
    });
  }

  handleEditGeneInfo = (row) => {
    // console.log(row);
    this.props.handleEditGeneInfo(row);
  };
  handlePanelChange = (panel) => {
    console.log(panel);
    this.setState({
      expanded: panel,
    });
  };
  showDrawer = (open) => (event) => {
    event.stopPropagation();
    console.log(open);
    this.setState({
      visible: open,
    });
  };
  updateOnlineDicName = (name) => {
    let url_dic;
    if (this.state.onlineDictionary === "geneCard") {
      url_dic = "https://www.genecards.org/cgi-bin/carddisp.pl?gene=";
    } else if (this.state.onlineDictionary === "uniProt") {
      url_dic = "https://www.uniprot.org/uniprot/?query=";
    }
    window.open(url_dic + name);
  };

  fn_selectDictionary = (value) => {
    this.setState({
      onlineDictionary: value,
    });
  };

  fn_downloadResult = () => {
    console.log(this.props.geneInfo);
    console.log(this.props.relationInfo);

    let gene_result = [];
    for (let e of this.props.geneInfo) {
      gene_result.push({
        gene_name: e.gene_name,
        coordinates: e.gene_BBox,
      });
    }
    let relation_result = [];
    for (let e of this.props.relationInfo) {
      relation_result.push({
        activator: e.activator,
        category: e.relation_type,
        receptor: e.receptor,
        coordinates: e.relation_Bbox,
      });
    }
    let result = {
      file_name: this.props.figureInfo[0].fig_name,
      element: gene_result,
      relation: relation_result,
    };
    let result_json =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(result));
    let downloadGeneNode = document.createElement("a");
    downloadGeneNode.setAttribute("href", result_json);
    downloadGeneNode.setAttribute(
      "download",
      this.props.figureInfo[0].fig_name + "_result.json"
    );
    downloadGeneNode.click();
    downloadGeneNode.remove();
  };

  render() {
    let rows_element = [];
    let rows_relations = [];
    // console.log(this.props.geneInfo);
    this.props.geneInfo.forEach((element, index) => {
      rows_element.push({
        name: element.gene_name,
        id: index + 1,
        gene_id:element.gene_id,
      });
    });
    this.props.relationInfo.forEach((element, index) => {
      rows_relations.push({
        id: index + 1,
        activator: element.activator,
        category: element.relation_type,
        receptor: element.receptor,
      });
    });

    let detail = (
      <div
        style={{ width: "600px", padding: "20px" }}
        onClick={this.showDrawer(true)}
      >
        <p style={{ marginBottom: 24, fontSize: "18px", fontWeight: "500" }}>
          Metadata
        </p>
        <Divider />
        <p style={{ fontSize: "16px", fontWeight: "500" }}>Figures</p>
        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Figure title"
              content={this.props.fig_metadata.fig_title}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Figure Link"
              content={this.props.fig_metadata.fig_link}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Description"
              content={this.props.fig_metadata.fig_caption}
            />
          </Col>
        </Row>
        <Divider />
        <p style={{ fontSize: "16px", fontWeight: "500" }}>Article</p>
        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Title"
              content={this.props.paper_metadata.title}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Source"
              content={this.props.paper_metadata.paper_link}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem
              title="PMC_ID"
              content={this.props.paper_metadata.pmc_id}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="PM_ID"
              content={this.props.paper_metadata.pm_id}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Author"
              content={this.props.paper_metadata.author}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Year"
              content={this.props.paper_metadata.year}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Journal"
              content={this.props.paper_metadata.journal}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Keywords"
              content={this.props.paper_metadata.key_words}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Description"
              content={this.props.paper_metadata.description}
            />
          </Col>
        </Row>
      </div>
    );

    return (
      <React.Fragment>
        <Button type="primary" onClick={this.showDrawer(true)}>
          Show Metadata
        </Button>
        <Button
          style={{ marginLeft: "10px" }}
          type="primary"
          onClick={() =>
            set_notification(
              "warning",
              "Developing",
              "It will be finished in the next version"
            )
          }
        >
          Add a gene
        </Button>

        <Button
          type="primary"
          style={{ marginLeft: "10px" }}
          onClick={() =>
            set_notification(
              "warning",
              "Developing",
              "It will be finished in the next version"
            )
          }
        >
          Add a relation
        </Button>

        <Button
          type="primary"
          style={{ marginLeft: "10px" }}
          onClick={this.fn_downloadResult}
        >
          Download Result
        </Button>
        <Select
          placeholder="Dictionary"
          style={{ width: 120, marginLeft: "20px" }}
          onChange={this.fn_selectDictionary}
        >
          <Option value="geneCard">geneCard</Option>
          <Option value="uniProt">uniProt</Option>
        </Select>
        <Drawer
          anchor="right"
          open={this.state.visible}
          onClick={this.showDrawer(false)}
        >
          {detail}
        </Drawer>
        <Grid container spacing={2} style={{ marginTop: "10px" }}>
          <Grid item sm={12}>
            <div id="paper_figure" className={styles.container_figure}>
              <img
                id="figure"
                alt=""
                src={this.props.base64_figure}
                style={{ height: "100%" }}
              ></img>
              {
                //gene bbox
                this.props.geneInfo.map((value, index) => {
                  let scale_of_bbox =
                    this.state.figure_width / this.props.figureInfo[0].height;
                  console.log(scale_of_bbox);
                  let geneBbox = {
                    position: "absolute",
                    top:
                      value.gene_BBox.split(",")[1] * scale_of_bbox -
                      2.5 +
                      "px",
                    left:
                      value.gene_BBox.split(",")[0] * scale_of_bbox -
                      2.5 +
                      "px",
                    width:
                      value.gene_BBox.split(",")[2] * scale_of_bbox + 5 + "px",
                    height:
                      value.gene_BBox.split(",")[3] * scale_of_bbox + 5 + "px",
                    border: "2px solid blue",
                  };
                  return (
                    <span
                      id={index}
                      style={geneBbox}
                      onClick={() => this.updateOnlineDicName(value.gene_name)}
                      href={"https://www.google.com/"}
                      target="view_window"
                    ></span>
                  );
                })
              }

              {
                //relation bbox
                this.props.relationInfo.map((value, index) => {
                  let scale_of_bbox =
                    this.state.figure_width / this.props.figureInfo[0].height;
                  let relationBbox = {
                    position: "absolute",
                    top:
                      value.relation_Bbox.split(",")[1] * scale_of_bbox + "px",
                    left:
                      value.relation_Bbox.split(",")[0] * scale_of_bbox + "px",
                    width:
                      value.relation_Bbox.split(",")[2] * scale_of_bbox + "px",
                    height:
                      value.relation_Bbox.split(",")[3] * scale_of_bbox + "px",
                    border: "2px solid red",
                  };
                  return <span id={index} style={relationBbox}></span>;
                })
              }
            </div>
          </Grid>
          <Grid item sm={12} lg={3}>
            <div style={{ height: "55vh" }}>
              <DataGrid
                style={{ color: THEME_CONTENT[this.props.theme].color }}
                rows={rows_element}
                columns={columns_elements}
                pageSize={7}
                rowsPerPageOptions={[7]}
                // checkboxSelection
                // disableSelectionOnClick
                onCellEditCommit={this.handleEditGeneInfo}
              />
            </div>
          </Grid>
          <Grid item sm={12} lg={6}>
            <div style={{ height: "55vh" }}>
              <DataGrid
                style={{ color: THEME_CONTENT[this.props.theme].color }}
                rows={rows_relations}
                columns={columns_relations}
                pageSize={7}
                rowsPerPageOptions={[7]}
                // checkboxSelection
                // disableSelectionOnClick
                onCellEditCommit={this.handleEditRowsModelChange}
              />
            </div>
          </Grid>
        </Grid>
        <br />
      </React.Fragment>
    );
  }
}
