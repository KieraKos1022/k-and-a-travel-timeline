import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

interface Location {
  name: string;
  coordinates: [number, number];
  isCurrent?: boolean;
}

interface GlobeProps {
  locations: Location[];
}

const LocationMarker = ({ position, name, isCurrent }: { position: THREE.Vector3, name: string, isCurrent?: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.scale.setScalar(isCurrent ? 1 + Math.sin(time * 3) * 0.2 : 1);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color={isCurrent ? "#ff6b35" : "#3b82f6"} />
      <Html distanceFactor={10}>
        <div className={`px-2 py-1 rounded-md shadow-md text-xs whitespace-nowrap pointer-events-none ${
          isCurrent ? 'bg-secondary text-white' : 'bg-primary text-white'
        }`}>
          {name}
        </div>
      </Html>
    </mesh>
  );
};

const Globe = ({ locations }: { locations: Location[] }) => {
  const globeRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002;
    }
  });

  // Convert lat/lng to 3D coordinates
  const coordsToVector3 = (lat: number, lng: number, radius = 1) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    
    return new THREE.Vector3(x, y, z);
  };

  return (
    <>
      <Sphere ref={globeRef} args={[1, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          map={null}
          color="#2563eb"
          roughness={0.7}
          metalness={0.1}
        />
      </Sphere>
      
      {locations.map((location, index) => (
        <LocationMarker
          key={index}
          position={coordsToVector3(location.coordinates[0], location.coordinates[1], 1.02)}
          name={location.name}
          isCurrent={location.isCurrent}
        />
      ))}
    </>
  );
};

export const InteractiveGlobe = ({ locations }: GlobeProps) => {
  return (
    <div className="w-full h-[600px] bg-gradient-to-b from-background to-muted rounded-lg shadow-elevation overflow-hidden">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 75 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Globe locations={locations} />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={1.5}
          maxDistance={4}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
};