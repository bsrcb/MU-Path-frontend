import React from "react";
import styles from "./logo.module.css";
import { CrownFilled } from "@ant-design/icons";

export default function Logo(props) {
  return (
    <div
      className={styles.logo_container}
      style={{ backgroundColor: props.background_logo }}
      color='white'
    >
      <CrownFilled style={{ marginRight: "10px", fontSize: "30px",color:props.logo_icon_color}} />
      <p className={styles.logo_title}>Pathway Curator</p>
      <span className={styles.logo_version}>1.0</span>
    </div>
  );
}
