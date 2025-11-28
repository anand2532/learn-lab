"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion } from "framer-motion";
import * as THREE from "three";
import { Card } from "@/components/ui/Card";

interface Vector3D {
  x: number;
  y: number;
  z: number;
  label: string;
  color?: string;
}

interface Interactive3DVisualizationProps {
  vectors?: Vector3D[];
  type?: "vectors" | "embedding-space" | "neural-network" | "transform";
  title?: string;
  description?: string;
  animate?: boolean;
}

// Simple orbit controls without drei
function SimpleOrbitControls() {
  const { camera, gl } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setPreviousMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      const spherical = new THREE.Spherical();
      spherical.setFromVector3(camera.position);
      spherical.theta -= deltaX * 0.01;
      spherical.phi += deltaY * 0.01;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 0, 0);
      
      setPreviousMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const distance = camera.position.length();
      const newDistance = distance + e.deltaY * 0.01;
      camera.position.normalize().multiplyScalar(Math.max(3, Math.min(15, newDistance)));
    };

    gl.domElement.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    gl.domElement.addEventListener("wheel", handleWheel);

    return () => {
      gl.domElement.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      gl.domElement.removeEventListener("wheel", handleWheel);
    };
  }, [camera, gl, isDragging, previousMousePosition]);

  return null;
}

// Camera setup component
function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

// Simple grid using native three.js
function SimpleGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);
  
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.material.opacity = 0.3;
      gridRef.current.material.transparent = true;
    }
  }, []);

  return (
    <gridHelper ref={gridRef} args={[10, 10, 0x6b7280, 0x374151]} />
  );
}

// Vector visualization component
function VectorVisualization({ vectors }: { vectors: Vector3D[] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {vectors.map((vec, index) => (
        <group key={index}>
          <mesh position={[vec.x, vec.y, vec.z]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color={vec.color || "#3b82f6"} />
          </mesh>
          {/* Vector line from origin */}
          <line>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([0, 0, 0, vec.x, vec.y, vec.z])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={vec.color || "#3b82f6"} />
          </line>
        </group>
      ))}
    </group>
  );
}

// Embedding space visualization
function EmbeddingSpace() {
  const vectors: Vector3D[] = [
    { x: 2, y: 1, z: 0, label: "king", color: "#ef4444" },
    { x: 2, y: 1.5, z: 0, label: "queen", color: "#ec4899" },
    { x: 1, y: 0.5, z: 0, label: "man", color: "#3b82f6" },
    { x: 1, y: 1, z: 0, label: "woman", color: "#8b5cf6" },
    { x: -1, y: -1, z: 0, label: "apple", color: "#10b981" },
    { x: -0.5, y: -1.2, z: 0, label: "orange", color: "#f59e0b" },
  ];

  return (
    <>
      {vectors.map((vec, index) => (
        <group key={index}>
          <mesh position={[vec.x, vec.y, vec.z]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial 
              color={vec.color || "#3b82f6"} 
              emissive={vec.color || "#3b82f6"}
              emissiveIntensity={0.3}
            />
          </mesh>
          {/* Connection lines between similar vectors */}
          {index > 0 && (
            <line>
              <bufferGeometry attach="geometry">
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([
                    vectors[index - 1].x,
                    vectors[index - 1].y,
                    vectors[index - 1].z,
                    vec.x,
                    vec.y,
                    vec.z,
                  ])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#6b7280" opacity={0.3} transparent />
            </line>
          )}
        </group>
      ))}
    </>
  );
}

// Main visualization component
function Visualization3D({ type, vectors }: { type: string; vectors?: Vector3D[] }) {
  return (
    <>
      <CameraSetup />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      
      <SimpleGrid />
      <SimpleOrbitControls />

      {type === "vectors" && vectors && <VectorVisualization vectors={vectors} />}
      {type === "embedding-space" && <EmbeddingSpace />}
    </>
  );
}

export function Interactive3DVisualization({
  vectors = [],
  type = "embedding-space",
  title,
  description,
  animate = true,
}: Interactive3DVisualizationProps) {
  const content = (
    <Card className="p-6">
      {title && (
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h4>
      )}
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>
      )}
      <div className="relative h-96 w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
          <Suspense
            fallback={
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#3b82f6" wireframe />
              </mesh>
            }
          >
            <Visualization3D type={type} vectors={vectors} />
          </Suspense>
        </Canvas>
        <div className="absolute bottom-4 left-4 text-white text-xs bg-black/50 px-3 py-1 rounded">
          Drag to rotate • Scroll to zoom
        </div>
      </div>
    </Card>
  );

  if (!animate) {
    return <div className="my-6">{content}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="my-6"
    >
      {content}
    </motion.div>
  );
}
