import React from "react"
export const themes = {
  dark:{
    backGround:"black"
  },
  light:{
    backGround:"white"
  }
}

const themeContext = React.createContext(themes.dark);

export default themeContext