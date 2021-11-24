import React from 'react'

import { Vec3 } from 'vec3'

import { useBox } from '@react-three/cannon'

import { threeTextures } from './textures'

interface ComponentProps {
    position: Vec3
    blockName: string
}

const Cube: React.FC<ComponentProps> = ({ position, blockName }) => {
    const [cubeRef] = useBox(() => ({
        type: 'Static',
        position: position.toArray(),
    }))

    // useFrame(() => mesh.current.rotation.x += 0.01);

    return (
        <mesh
            ref={cubeRef}
            // scale={active ? 1.5 : 1}
        >
            <boxBufferGeometry attach="geometry" />
            <meshStandardMaterial
                map={threeTextures.get(blockName)}
                // transparent={true}
                // color={color}
            />
        </mesh>
    )
}

export default Cube
