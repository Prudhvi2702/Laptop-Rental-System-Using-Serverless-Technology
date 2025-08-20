"use client"

import { Suspense, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { useGLTF, OrbitControls, Environment, Center } from "@react-three/drei"
import * as THREE from "three"
import { motion } from "framer-motion-3d"

function Model() {
  const [hovered, setHovered] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const { scene } = useGLTF("/models/laptop.glb")
  
  useEffect(() => {
    // Set loaded state after model is ready
    const timer = setTimeout(() => setLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  // Clone the scene to avoid mutations
  const clonedScene = scene.clone()
  
  // Center the model
  const box = new THREE.Box3().setFromObject(clonedScene)
  const center = box.getCenter(new THREE.Vector3())
  clonedScene.position.sub(center)
  
  // Base scale with hover effect
  const baseScale = 0.1632 * (1 + 0.0175)  // Increased by 1.75% (0.0175)
  const scale = hovered ? baseScale * 1.04 : baseScale
  clonedScene.scale.multiplyScalar(scale)
  
  return (
    <Center>
      <motion.group
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: hovered ? 1.04 : 1,
          opacity: loaded ? 1 : 0,
          y: loaded ? 0 : 0.5
        }}
        transition={{ 
          scale: { 
            type: "spring",
            stiffness: 80,
            damping: 20,
            mass: 1.5,
            duration: 0.8
          },
          opacity: { 
            duration: 1.2, 
            ease: "easeInOut" 
          },
          y: { 
            duration: 1.2, 
            ease: "easeInOut" 
          }
        }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <primitive 
          object={clonedScene} 
          position={[0, -0.45, 0]} 
          rotation={[0, -Math.PI / 5, 0]}
        />
      </motion.group>
    </Center>
  )
}

function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  )
}

export default function LaptopModel() {
  return (
    <div className="w-full h-full flex items-start justify-center -mt-12">
      <div className="w-[700px] h-[550px] relative overflow-visible">
        <Canvas
          camera={{ position: [4, 2, 18], fov: 30 }}
          style={{ width: "100%", height: "100%" }}
        >
          <Suspense fallback={null}>
            <Environment preset="city" />
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1.4} />
            <Model />
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              autoRotate={true}
              autoRotateSpeed={1.2}
              target={[0, -0.45, 0]}
              maxPolarAngle={Math.PI / 1.7}
              minPolarAngle={Math.PI / 2.3}
            />
          </Suspense>
        </Canvas>
        <Suspense fallback={<LoadingSpinner />}>
          <div className="absolute inset-0 pointer-events-none" />
        </Suspense>
      </div>
    </div>
  )
} 