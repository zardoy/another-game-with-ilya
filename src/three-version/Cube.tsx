import React from 'react'

import { LinearMipMapLinearFilter, NearestFilter } from 'three'

import { useBox } from '@react-three/cannon'
import { useTexture } from '@react-three/drei'

import { getTextureUrl } from '../shared/minecraft-data'

interface ComponentProps {
    position: number[]
    blockName: string
}

const Cube: React.FC<ComponentProps> = ({ position, blockName }) => {
    const [cubeRef] = useBox(() => ({
        type: 'Dynamic',
        mass: 5,
        // velocity: [5, 0, 0],
        position,
    }))

    const texture = useTexture(getTextureUrl('block', blockName)!)

    texture.magFilter = NearestFilter
    texture.minFilter = LinearMipMapLinearFilter

    // useFrame(() => mesh.current.rotation.x += 0.01);

    return (
        <mesh
        // ref={cubeRef}
        // scale={active ? 1.5 : 1}
        >
            <boxBufferGeometry />
            <meshStandardMaterial
                color="red"
                // map={texture}
                // transparent={true}
                // color={color}
            />
        </mesh>
    )
}

export default Cube
