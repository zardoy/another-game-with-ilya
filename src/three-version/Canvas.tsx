import React, { useEffect, useMemo, useRef } from 'react'

import { useControls } from 'leva'
import { times } from 'lodash'
import { LinearMipMapLinearFilter, NearestFilter, PointLight, RepeatWrapping } from 'three'

import { usePlane } from '@react-three/cannon'
import { useTexture } from '@react-three/drei'
import { Canvas as ThreeFiberCanvas, useThree } from '@react-three/fiber'

import { getTextureUrl } from '../shared/minecraft-data'
import vec3 from '../shared/vec3'
import Cube from './Cube'
import DebugOverlay from './DebugOverlay'
import { PlayerFlying } from './Player'
import { PlayerModel } from './playerModel'
import { addTexture } from './textures'
import { useWorldStore } from './worldStore'

const playerModel = new PlayerModel()

playerModel.setSkin(`https://crafthead.net/skin/652a2bc4e8cd405db7b698156ee2dc09`)

const Cubes: React.FC = () => {
    const blocks = useWorldStore(state => state.blocks)

    return (
        <>
            {Array.from(blocks.entries()).map(([position, blockName]) => {
                return <Cube key={`${position.join(',')}${blockName}`} position={position} blockName={blockName} />
            })}
        </>
    )
}

const Ground: React.FC = () => {
    const [planeRef] = usePlane(() => ({
        rotation: [-Math.PI / 2, 0, 0],
        // position: [0, 10, 0],
        // type: "Static"
    }))

    const url = getTextureUrl('block', 'dirt')!

    const texture = useTexture(url)

    texture.magFilter = NearestFilter
    texture.minFilter = LinearMipMapLinearFilter
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(200, 200)

    return (
        <mesh ref={planeRef}>
            <planeGeometry args={[200, 200]} />
            {/* <boxGeometry /> */}
            <meshStandardMaterial map={texture} />
        </mesh>
    )
}

type Block = {
    x: number
    y: number
    z: number
    blockName: string
}

const defaultPlayerPosition = vec3(0, 0, 2)

addTexture('dirt')

const TestCube: React.FC = () => {
    const [dirtTexture, stoneTexture] = useTexture([getTextureUrl('block', 'dirt')!, getTextureUrl('block', 'stone')!])

    useMemo(() => {
        console.log('update texture')
        ;[dirtTexture, stoneTexture].forEach(texture => {
            texture.magFilter = NearestFilter
            texture.minFilter = NearestFilter
            // texture.wrapT = MirroredRepeatWrapping;
            // texture.repeat.set(2, 2);
            // texture.rotation = Math.PI / 4;
            // texture.offset.set(0, .5);
        })
        // [dirtTexture, stoneTexture].forEach(texture => texture.minFilter = LinearMipMapLinearFilter);
    }, [dirtTexture, stoneTexture])

    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            {times(5, index => (
                <meshBasicMaterial key={index} attachArray="material" map={dirtTexture} />
            ))}
            <meshPhongMaterial attachArray="material" map={stoneTexture} />
        </mesh>
    )
}

const PlayerModelObject = () => {
    const scene = useThree(s => s.scene)

    useEffect(() => {
        const object = playerModel.playerObject3d

        scene.add(object)
        return () => {
            scene.remove(object)
        }
    }, [])

    return null
}

let Canvas: React.FC = () => {
    // useEffect(() => {
    //     testApi();
    // }, []);

    const { power } = useControls({
        // time: {
        //     value: 12,
        //     min: 0,
        //     max: 24
        // },
        power: {
            value: 800,
            min: 0,
            max: 1000,
        },
    })

    const pointRef = useRef<PointLight>(null!)

    // fix ref
    // todo use normal resize!
    return (
        <ThreeFiberCanvas
            id="canvas"
            frameloop="always"
            //@ts-ignore
            gl={{
                physicallyCorrectLights: true,
            }}
        >
            <DebugOverlay />
            {/* <ambientLight /> */}
            {/* <pointLight
            ref={pointRef}
            position={[0, 10, 0]}
            color="white" intensity={1} power={power} decay={2} distance={Infinity} />
        {pointRef.current && <pointLightHelper args={[pointRef.current]} />} */}
            {/* <TestCube /> */}
            {/* <PlayerModelObject /> */}
            <mesh>
                <boxBufferGeometry args={[0, 0, 0]} />
                <meshBasicMaterial color="red" />
            </mesh>
            {/* <Sky sunPosition={[0, 500, 0]} /> */}
            {/* <ambientLight /> */}
            <PlayerFlying defaultPosition={defaultPlayerPosition} />
            {/* <pointLight position={[10, 100, 10]} /> */}
            {/* <Physics gravity={[0, -30, 0]}> */}
            {/* <mesh position={[5, 2, 0]}>
            <boxGeometry args={[4, 4, 4]} />
            <meshPhongMaterial color="red" />
        </mesh> */}
            {/* <mesh position={[-4, 5, 0]}>
                <sphereGeometry args={[3, 32, 16]} />
                <meshBasicMaterial color="yellow" />
            </mesh> */}
            {/* <Suspense fallback={null}> */}
            {/* <PlayerWithPhysics defaultPosition={defaultPlayerPosition} /> */}
            {/* <Ground /> */}
            {/* <Cubes /> */}
            {/* <Cube blockName="dirt" position={vec3(0, 0, 0)} /> */}
            {/* </Suspense> */}
            {/* </Physics> */}
        </ThreeFiberCanvas>
    )
}

export default Canvas
