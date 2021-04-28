import React, { useEffect, useRef, useState } from "react";

import { Vector3 } from "three";

import { Sky } from "@react-three/drei";
import { Canvas as ThreeFiberCanvas, MeshProps, useThree } from "@react-three/fiber";

import { initCameraControl } from "../shared/cameraControl";
import { touchMovement } from "../shared/interface/Root";
import { useInterval } from "../shared/react-util";
import { getActiveMovement } from "../shared/util";

interface ComponentProps {
}

const Box: React.FC<MeshProps> = (props) => {
    const mesh = useRef<THREE.Mesh>(null!);
    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(false);

    // useFrame(() => mesh.current.rotation.x += 0.01);

    return <mesh
        ref={mesh}
        scale={active ? 1.5 : 1}
        onClick={() => setActive(!hovered)}
        // onPointerOver={() => setHovered(true)}
        // onPointerOut={() => setHovered(false)}
        {...props}
    >
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>;
};

const CanvasControl = () => {
    const { camera } = useThree();

    useInterval(() => {
        const movement = getActiveMovement({ touchMovement });
        const movementVector = new Vector3(movement.x, movement.y, movement.z);
        movementVector.divideScalar(10);
        camera.position.add(movementVector);
    }, 15);

    useEffect(() => {
        initCameraControl(document.getElementById("canvas")!, {
            rotateCamera({ x, y }) {
                camera.rotation.y -= x * 0.002;
                camera.rotation.x -= y * 0.002;
            }
        });
        return () => {
            // TODO
            console.log("Canvas unmounted!");
        };
    }, []);

    return null;
};

let Canvas: React.FC<ComponentProps> = () => {
    // fix ref
    // todo use normal resize!
    return <ThreeFiberCanvas id="canvas">
        <CanvasControl />
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
    </ThreeFiberCanvas>;
};

export default Canvas;