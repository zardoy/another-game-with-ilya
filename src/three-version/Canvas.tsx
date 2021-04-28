import React, { useEffect, useState } from "react";

import { Physics } from "@react-three/cannon";
import { Sky, useDetectGPU } from "@react-three/drei";
import { Canvas as ThreeFiberCanvas } from "@react-three/fiber";

import { world } from "../shared/minecraft-data";
import vec3 from "../shared/vec3";
import Cube from "./Cube";
import Debug from "./Debug";
import Player from "./Player";
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

let Canvas: React.FC = () => {
    const [chunk, setChunk] = useState<Block[] | null>(null);

    const GPUTier = useDetectGPU();

    useEffect(() => {
        console.log(GPUTier);
        (async () => {
            console.time("Blocks scan");
            const blocks: Block[] = [];
            // const y = 5;
            for (let x = 0; x < 15; x++) {
                for (let y = 0; y < 15; y++) {
                    for (let z = 0; z < 15; z++) {
                        const { name: blockName } = await world.getBlock(vec3(x, y, z));
                        console.log(blockName);
                        const hasTexture = addTexture(blockName);
                        if (!hasTexture) continue;
                        blocks.push({
                            x, y, z,
                            blockName
                        });
                    }
                }
            }
            console.timeEnd("Blocks scan");
            setChunk(blocks);
        })();
    }, []);

    // fix ref
    // todo use normal resize!
    return <ThreeFiberCanvas id="canvas">
        <Debug />
        <Sky sunPosition={[0, 500, 0]} />
        <ambientLight />
        {/* <pointLight position={[10, 100, 10]} /> */}
        {chunk && <Physics>
            <Player defaultPosition={vec3(0, 110, 0)} />
            <Cubes blocks={chunk} />
        </Physics>}
    </ThreeFiberCanvas>;
};

export default Canvas;
