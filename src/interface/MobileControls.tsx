import React from "react";

import _ from "lodash";

interface ComponentProps {
}

const size = 50;

let MobileControls: React.FC<ComponentProps> = () => {

    return <>
        <div
            style={{ position: "fixed", left: 0, bottom: 0, width: size * 3, height: size * 3 }}
            className="touch-movement-area"
            onTouchStart={e => e.preventDefault()}
        />
        <div style={{
            position: "fixed",
            bottom: size * 2,
            left: size,
            transform: "translateY(-100%)"
        }}
            onTouchStart={e => e.preventDefault()}
        >
            {
                _.times(4, (index) => {
                    return <img
                        key={index}
                        data-index={index}
                        src="./touch-movement-button.svg"
                        style={{
                            width: size, height: size,
                            position: "absolute",
                            transform: `rotate(${index * 90}deg) translateY(-100%)`,
                            WebkitTouchCallout: "none"
                        }}
                        className="touch-movement-button"
                    />;
                })
            }
        </div>
    </>;
};

export default MobileControls;
