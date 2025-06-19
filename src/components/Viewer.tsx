import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GridHelper } from "three";
import { Line } from "@react-three/drei";

const Grid = () => {
  const size = 100;
  const divisions = 50;
  const centerColor = 0xaaaaaa;
  const gridColor = 0xcccccc;

  return (
    <>
      {/* XZ Plane */}
      <primitive
        object={new THREE.GridHelper(size, divisions, centerColor, gridColor)}
      />
      {/* YZ Plane */}
      <primitive
        object={new THREE.GridHelper(size, divisions, centerColor, gridColor)}
        rotation={[Math.PI / 2, 0, 0]}
      />
      {/* XY Plane */}
      <primitive
        object={new THREE.GridHelper(size, divisions, centerColor, gridColor)}
        rotation={[0, 0, Math.PI / 2]}
      />
    </>
  );
};

const NodeSphere = ({ position }: { position: [number, number, number] }) => (
  <mesh position={position}>
    <sphereGeometry args={[0.05, 16, 16]} />
    <meshStandardMaterial color="red" />
  </mesh>
);

const ElementLine = ({
  start,
  end,
}: {
  start: [number, number, number];
  end: [number, number, number];
}) => {
  const points = [start, end];
  return (
    <Line
      points={points}
      color="blue"
      lineWidth={5} // in world units
      dashed={false}
    />
  );
};

export default function Viewer({
  nodes,
  elements,
}: {
  nodes: { id: string; position: [number, number, number] }[];
  elements: { id: string; from: string; to: string }[];
}) {
  return (
    <Canvas camera={{ position: [4, 3, 5], fov: 50 }}>
      <Grid />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls
        enableDamping
        dampingFactor={0.1}
        rotateSpeed={0.5}
        zoomSpeed={0.6}
        panSpeed={0.5}
        maxPolarAngle={Math.PI} // Optional: allow full rotation vertically
        minDistance={0.5}
        maxDistance={100}
      />

      {nodes.map((node) => (
        <NodeSphere
          key={node.id}
          position={node.position as [number, number, number]}
        />
      ))}

      {elements.map((el) => {
        const start = nodes.find((n) => n.id === el.from)?.position;
        const end = nodes.find((n) => n.id === el.to)?.position;
        if (!start || !end) return null;
        return (
          <ElementLine
            key={el.id}
            start={start as [number, number, number]}
            end={end as [number, number, number]}
          />
        );
      })}
    </Canvas>
  );
}
