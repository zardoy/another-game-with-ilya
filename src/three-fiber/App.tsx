import React from "react";

import GlobalStyles from "../components/GlobalStyles";
import MyThemeProvider from "../components/MyThemeProvider";
import Canvas from "./Canvas";

interface ComponentProps {
}

let App: React.FC<ComponentProps> = () => {
    return <MyThemeProvider>
        <GlobalStyles />

        <Canvas />
    </MyThemeProvider>;
};

export default App;
