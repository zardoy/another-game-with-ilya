import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { init } from "./gameUtil";

// window.location.reload();

console.clear();

init();

ReactDOM.render(
    <App />,
    document.getElementById("root")
);
