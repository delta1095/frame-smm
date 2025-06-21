import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { Text } from "@react-three/drei";

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

const CustomAxes = () => {
  const axisLength = 1;
  const fontSize = 0.15;

  return (
    <>
      {/* X Axis - Red */}
      <Line
        points={[
          [0, 0, 0],
          [axisLength, 0, 0],
        ]}
        color="red"
        lineWidth={2}
      />
      <Text
        position={[axisLength + 0.1, 0, 0]}
        fontSize={fontSize}
        color="red"
        anchorX="left"
        anchorY="middle"
      >
        X
      </Text>

      {/* Y Axis - Green */}
      <Line
        points={[
          [0, 0, 0],
          [0, axisLength, 0],
        ]}
        color="green"
        lineWidth={2}
      />
      <Text
        position={[0, axisLength + 0.1, 0]}
        fontSize={fontSize}
        color="green"
        anchorX="left"
        anchorY="middle"
      >
        Y
      </Text>

      {/* Z Axis - Blue */}
      <Line
        points={[
          [0, 0, 0],
          [0, 0, axisLength],
        ]}
        color="blue"
        lineWidth={2}
      />
      <Text
        position={[0, 0, axisLength + 0.1]}
        fontSize={fontSize}
        color="blue"
        anchorX="left"
        anchorY="middle"
      >
        Z
      </Text>
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
      <CustomAxes />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls
        enableDamping
        dampingFactor={0.1}
        rotateSpeed={0.5}
        zoomSpeed={0.6}
        panSpeed={0.5}
        maxPolarAngle={Math.PI}
        minDistance={0.5}
        maxDistance={100}
      />

      {/* Render Nodes with ID on Sphere */}
      {nodes.map((node) => (
        <React.Fragment key={node.id}>
          <NodeSphere position={node.position} />
          <Text
            position={[
              node.position[0] + 0.1,
              node.position[1] + 0.1,
              node.position[2],
            ]}
            fontSize={0.1}
            color="black"
            anchorX="center"
            anchorY="bottom"
            outlineWidth={0.005}
          >
            {node.id}
          </Text>
        </React.Fragment>
      ))}

      {/* Render Elements and Labels */}
      {elements.map((el) => {
        const start = nodes.find((n) => n.id === el.from)?.position;
        const end = nodes.find((n) => n.id === el.to)?.position;
        if (!start || !end) return null;

        const midpoint: [number, number, number] = [
          (start[0] + end[0]) / 2,
          (start[1] + end[1]) / 2,
          (start[2] + end[2]) / 2,
        ];

        return (
          <React.Fragment key={el.id}>
            <ElementLine start={start} end={end} />
            <Text
              position={[midpoint[0] + 0.1, midpoint[1], midpoint[2]]}
              fontSize={0.09}
              color="blue"
              anchorX="left"
              anchorY="middle"
            >
              {el.id}
            </Text>
          </React.Fragment>
        );
      })}
    </Canvas>
  );
}
