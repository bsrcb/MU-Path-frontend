import React from "react";
import styles from "./title.module.css";
import { THEME_CONTENT } from "../../theme/theme";

export default function Page_title(props) {
  return (
    <div
      className={styles.container}
      style={{
        borderBottom: `thin solid ${THEME_CONTENT[props.theme].divider_color}`,
      }}
    >
      <p className={styles.title}>{props.current_page}</p>
    </div>
  );
}
