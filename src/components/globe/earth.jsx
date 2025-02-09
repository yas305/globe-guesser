import React from 'react'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import Countries from './countries'

const Earth = ({ selectedCountry }) => {
  const texture = useLoader(TextureLoader, '/earth-texture.jpg')
  
  return (
    <group rotation={[0, 0, 0]}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          map={texture}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      <Countries selectedCountry={selectedCountry} />
    </group>
  )
}

export default Earth