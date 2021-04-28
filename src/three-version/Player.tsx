import React, { useEffect, useRef } from "react";

import { Euler, Vector3 } from "three";
import { Vec3 } from "vec3";

import { useSphere } from "@react-three/cannon";
import { useThree } from "@react-three/fiber";

import { initCameraControl } from "../shared/cameraControl";
import { useInterval } from "../shared/react-util";
import { getActiveMovement } from "../shared/util";

interface ComponentProps {
    defaultPosition: Vec3;
}

const euler = new Euler(0, 0, 0, 'YXZ');
const playerVector = new Vector3();

const _PI_2 = Math.PI / 2;
const polarAngle = {
    min: 0,
    max: Math.PI
};

// const getDirection = () => {
//     const direction = new Vector3(0, 0, - 1);

//     return (v: Vector3) => v.copy(direction).applyQuaternion(camera.quaternion);
// };

const useCameraRotationControl = () => {
    const { camera } = useThree();

    useEffect(() => {
        initCameraControl(document.getElementById("canvas")!, {
            rotateCamera(delta) {
                euler.setFromQuaternion(camera.quaternion);

                euler.y -= delta.x * 0.002;
                euler.x -= delta.y * 0.002;

                euler.x = Math.max(_PI_2 - polarAngle.max, Math.min(_PI_2 - polarAngle.min, euler.x));

                camera.quaternion.setFromEuler(euler);
            }
        });
        return () => {
            // TODO we are not ready for this yet
            console.error("Canvas unmounted!");
        };
    }, []);
};

export const PlayerFlying: React.FC<ComponentProps> = ({ defaultPosition }) => {
    const { camera } = useThree();

    useInterval(() => {
        const movement = getActiveMovement();
        movement.z = movement.z * -1;

        const moveRight = (distance: number) => {
            playerVector.setFromMatrixColumn(camera.matrix, 0);

            camera.position.addScaledVector(playerVector, distance);
        };

        const moveForward = (distance: number) => {
            playerVector.setFromMatrixColumn(camera.matrix, 0);

            playerVector.crossVectors(camera.up, playerVector);

            camera.position.addScaledVector(playerVector, distance);
        };

        const movementVector = new Vector3(movement.x, movement.y, movement.z);
        movementVector.divideScalar(10);
        if (movementVector.x) moveRight(movementVector.x);
        if (movementVector.z) moveForward(movementVector.z);
        camera.position.y += movementVector.y;
    }, 15);

    useCameraRotationControl();

    return null;
};

export const PlayerWithPhysics: React.FC<ComponentProps> = ({ defaultPosition }) => {
    const { camera } = useThree();

    const [sphereRef, sphereApi] = useSphere(() => ({
        mass: 1,
        type: "Dynamic",
        position: defaultPosition.toArray()
    }));

    const velocity = useRef([0, 0, 0]);
    useEffect(() => {
        sphereApi.velocity.subscribe((v) => (velocity.current = v));
    }, [sphereApi.velocity]);

    useInterval(() => {
        const direction = new Vector3();
        const movement = getActiveMovement();
        movement.x = movement.x * -1;

        const frontVector = new Vector3(0, 0, movement.z);
        const sideVector = new Vector3(movement.x, 0, 0);

        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(6)
            .applyEuler(camera.rotation);

        sphereApi.velocity.set(direction.x, velocity.current[1], direction.z);

        if (movement.y && Math.abs(velocity.current[1]) < 0.05) {
            sphereApi.velocity.set(velocity.current[0], 8, velocity.current[2]);
        }

        camera.position.copy(sphereRef.current!.position);
    }, 15);

    useCameraRotationControl();

    return <mesh ref={sphereRef} />;
};
