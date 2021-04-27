import React from "react";



import GlobalStyles from "../components/GlobalStyles";
import MyThemeProvider from "../components/MyThemeProvider";
import GamePause from "./GamePause";
import MobileControls from "./MobileControls";
import MouseRawInputSnackbar from "./MouseRawInputSnackbar";

interface ComponentProps {
}

let App: React.FC<ComponentProps> = ({ children }) => {


    return <MyThemeProvider>
        <MobileControls />

        <MouseRawInputSnackbar />

        <GlobalStyles />

        <GamePause
            buttons={[
                {
                    label: "SOCIAL"
                },
                {
                    label: "OPTIONS"
                },
                {
                    label: "LEAVE GAME"
                },
            ]}
        />
    </MyThemeProvider>;
};

export default App;
