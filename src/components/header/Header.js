import React from "react";
import styles from "./Header.module.css";
import IconButton from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import GitHubIcon from "@mui/icons-material/GitHub";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuSharpIcon from "@mui/icons-material/MenuSharp";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function Logo(props) {
  // console.log(props.innerWidth);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (current_page) => {
    props.update_pages(current_page)
    setAnchorEl(null);
  };
  const handleClose2 = () => {
    setAnchorEl(null);
  };
  const change_theme = (theme) => {
    props.change_theme(theme)
  }
  const github = () => {
    console.log("github1")
    
  }
  return (
    <div
      className={styles.header_container}
      style={{ backgroundColor: props.background_color }}
      color="white"
    >
      <Brightness7Icon
        onClick={() => change_theme('dark')}
        className={styles.icon_theme}
        style={{ display: props.theme === "light" ? "block" : "none" }}
      />
      <DarkModeIcon
        onClick={()=>change_theme("light")}
        className={styles.icon_theme}
        style={{ display: props.theme === "dark" ? "block" : "none" }}
      />
      <AccountCircleIcon className={styles.icon_user}></AccountCircleIcon>
      <GitHubIcon className={styles.icon_github} onClick={()=>github()}></GitHubIcon>

      <IconButton
        className={styles.icon_mini_menu}
        style={{ display: props.innerWidth < 1200 ? "block" : "none" }}
        id="basic-button"
        size="large"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MenuSharpIcon
          style={{ fontSize: "32px", marginTop: "10px" }}
        ></MenuSharpIcon>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose2}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={()=>handleClose('Home')}>Home</MenuItem>
        <MenuItem onClick={()=>handleClose('Prediction')}>Prediction</MenuItem>
        <MenuItem onClick={()=>handleClose('New_Prediction')}> New Prediction</MenuItem>
        <MenuItem onClick={()=>handleClose('History')}>History</MenuItem>
        <MenuItem onClick={()=>handleClose('Result')}>Result</MenuItem>
      </Menu>
    </div>
  );
}
