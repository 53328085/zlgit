
import React, {useContext} from "react";
const themes = {
    light: {
      foreground: "#000000",
      background: "#eeeeee"
    },
    dark: {
      foreground: "#ffffff",
      background: "#222222"
    }
  };
const ThemeContext = React.createContext(themes.light)

function Toolbar() {
    return (
        <div>
            <ThemeBtn></ThemeBtn>
        </div>
    )
}
function ThemeBtn() {
    const them = useContext(ThemeContext)
    return (
    <button style={{ background: them.background, color: them.foreground }}>
      I am styled by theme context!
    </button>
    )
}
export default function Custbtn() {
    return (
    <ThemeContext.Provider value={themes.dark}>
        <Toolbar></Toolbar>
    </ThemeContext.Provider>
    )
}