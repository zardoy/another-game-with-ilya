import React from "react";

import { Physics } from "@react-three/cannon";
import { Sky } from "@react-three/drei";
import { Canvas as ThreeFiberCanvas } from "@react-three/fiber";

import vec3 from "../shared/vec3";
import Cube from "./Cube";
import DebugOverlay from "./DebugOverlay";
import { PlayerFlying } from "./Player";
import { addTexture } from "./textures";

const Cubes: React.FC<{ blocks: Block[]; }> = ({ blocks }) => {
    return <>
        {
            blocks.map(({ x, y, z, blockName }) => {
                return <Cube key={`${x}${y}${z}`} position={vec3(x, y, z)} blockName={blockName} />;
            })
        }
    </>;
};

type Block = {
    x: number;
    y: number;
    z: number;
    blockName: string;
};

const defaultPlayerPosition = vec3(0, 110, 0);

addTexture("dirt");

let Canvas: React.FC = () => {
    // fix ref
    // todo use normal resize!
    return <ThreeFiberCanvas id="canvas">
        <DebugOverlay />
        <Sky sunPosition={[0, 500, 0]} />
        <ambientLight />
        <PlayerFlying defaultPosition={defaultPlayerPosition} />
        {/* <pointLight position={[10, 100, 10]} /> */}
        <Physics>
            <Cube blockName="dirt" position={vec3(0, 0, 0)} />
        </Physics>
    </ThreeFiberCanvas>;
};

export default Canvas;
