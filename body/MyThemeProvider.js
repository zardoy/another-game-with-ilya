import React, {useMemo} from "../_snowpack/pkg/react.js";
import {createMuiTheme, ThemeProvider} from "../_snowpack/pkg/@material-ui/core.js";
let MyThemeProvider = ({children}) => {
  const muiTheme = useMemo(() => createMuiTheme({
    palette: {
      type: "dark"
    }
  }), []);
  return /* @__PURE__ */ React.createElement(ThemeProvider, {
    theme: muiTheme
  }, children);
};
export default MyThemeProvider;
