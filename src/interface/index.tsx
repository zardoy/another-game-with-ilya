import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { init } from "./gameUtil";
import _ from "lodash";

console.clear();

init();

ReactDOM.render(
    <App />,
    document.getElementById("root")
);
