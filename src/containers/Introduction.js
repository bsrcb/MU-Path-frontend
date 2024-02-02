import { Typography, Divider } from "@material-ui/core";
import React, { Component } from "react";
import IntroductionToPathway from "../components/IntroductionToPathway/IntroductionToPathway";


/**
 * @description
 * @author MaoZane
 * @export Main
 * @class Introduction
 * @extends {Component}
 */
export default class Introduction extends Component {
  render() {
    return (
      <div>
        <IntroductionToPathway />
      </div>
    );
  }
}
