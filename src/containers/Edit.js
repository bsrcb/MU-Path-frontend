import React, { Component } from "react";
import { Typography, Divider, Radio } from "@material-ui/core";

const BOX_STYLE1 = {
  background: "rgb(255, 255, 255)",
  minHeight: "30vh",
  boxShadow:
    "rgb(50 50 93 / 3%) 0px 2px 5px -1px, rgb(0 0 0 / 5%) 0px 1px 3px -1px",
  borderRadius: "6px",
  marginTop: "2vh",
  float: "left",
  // padding:'2vh',
  width: "38.25vw",
};
const BOX_STYLE2 = {
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
 * @description Edit Component, allow user to review the gene
 *              and relation information.
 * @author MaoZane
 * @export
 * @class Edit
 * @extends {Component}
 */

export default class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRevise: "element",
    };
  }

  fn_selectElement = () => {
    this.setState({
      selectedRevise: "element",
    });
  };

  fn_selectRelation = () => {
    this.setState({
      selectedRevise: "relation",
    });
  };

  render() {
    let figure_element = <div style={BOX_STYLE1}>figure element</div>;

    let table_element = <div style={BOX_STYLE2}>table of element</div>;

    let figure_relation = <div style={BOX_STYLE1}>figure relation</div>;

    let table_relation = <div style={BOX_STYLE2}>table of relation</div>;

    return (
      <div>
        <Typography
          style={{
            fontWeight: "600",
            fontSize: "1.5rem",
            marginTop: "3vw",
            marginLeft: "4vh",
          }}
        >
          Revise
        </Typography>
        <Divider
          style={{ marginLeft: "4vh", width: "80vw", marginTop: "4vh" }}
        ></Divider>

        <div style={{ width: "78vw", marginLeft: "2vw", marginTop: "3vh" }}>
          <Radio
            checked={this.state.selectedRevise === "element"}
            onChange={this.fn_selectElement}
            value="a"
          />
          Revise Element
          <Radio
            style={{ marginLeft: "2vw" }}
            checked={this.state.selectedRevise === "relation"}
            onChange={this.fn_selectRelation}
            value="b"
          />
          Revise Relation
          <div
            style={{
              display:
                this.state.selectedRevise === "element" ? "block" : "none",
            }}
          >
            {figure_element}
            {table_element}
          </div>
          <div
            style={{
              display:
                this.state.selectedRevise === "relation" ? "block" : "none",
            }}
          >
            {figure_relation}
            {table_relation}
          </div>
        </div>
      </div>
    );
  }
}
