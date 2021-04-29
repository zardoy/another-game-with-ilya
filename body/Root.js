import * as __SNOWPACK_ENV__ from '../_snowpack/env.js';

import React, {useState} from "../_snowpack/pkg/react.js";
import {Button, Grid, Typography} from "../_snowpack/pkg/@material-ui/core.js";
import {entries} from "../shared/util.js";
import GameVersion from "./GameVersion.js";
import GlobalStyles from "./GlobalStyles.js";
import MyThemeProvider from "./MyThemeProvider.js";
const GameVersionLazy = ({rootComponentPath, onLoad, unloadModule}) => {
  const LazyModule = React.lazy(async () => {
    const module = await import(rootComponentPath);
    onLoad?.();
    return module;
  });
  return /* @__PURE__ */ React.createElement(GameVersion, {
    ...{unloadModule}
  }, /* @__PURE__ */ React.createElement(LazyModule, null));
};
const gameVersions = {
  ilya: {
    module: "../ilya-version/index.js"
  },
  three: {
    module: "../three-version/index.js"
  }
};
let Root = () => {
  const [enginePath, setEnginePath] = useState(null);
  const [moduleLoaded, setModuleLoaded] = useState(false);
  return /* @__PURE__ */ React.createElement(MyThemeProvider, null, /* @__PURE__ */ React.createElement(GlobalStyles, null), !moduleLoaded && /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    justify: "space-between",
    direction: "column",
    alignContent: "center",
    style: {height: "100vh"}
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h1",
    align: "center"
  }, "DIMAKA"), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    container: true,
    justify: "center",
    alignItems: "center",
    direction: "column",
    spacing: 3
  }, entries(gameVersions).map(([label, {module}]) => {
    return /* @__PURE__ */ React.createElement(Grid, {
      item: true,
      key: label
    }, /* @__PURE__ */ React.createElement(Button, {
      variant: "contained",
      color: "primary",
      size: "large",
      onClick: () => setEnginePath(module)
    }, label, " GAME ENGINE"));
  })), /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2",
    align: "right",
    color: "textSecondary"
  }, "BUILT ", __SNOWPACK_ENV__.SNOWPACK_PUBLIC_BUILD_DATE)), enginePath && /* @__PURE__ */ React.createElement(GameVersionLazy, {
    rootComponentPath: enginePath,
    onLoad: () => setModuleLoaded(true)
  }));
};
export default Root;
