import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { nodesAtom, elementsAtom, loadsAtom, reactionsAtom } from "../atoms";
import * as math from "mathjs";
import {
  computeElementStiffnessMatrix,
  computeTransformationMatrix,
  getElementDOFIndices,
} from "../utilities";

const DOF_PER_NODE = 6;

export const Analysis = () => {
  const nodes = useAtomValue(nodesAtom);
  const elements = useAtomValue(elementsAtom);
  const loads = useAtomValue(loadsAtom);
  const reactions = useAtomValue(reactionsAtom);

  const totalDOF = nodes.length * DOF_PER_NODE;

  const { K, F, U } = useMemo(() => {
    const K_global = math.zeros(totalDOF, totalDOF) as math.Matrix;
    const F_global = math.zeros(totalDOF, 1) as math.Matrix;
    const U_global = math.zeros(totalDOF, 1) as math.Matrix;

    elements.forEach((element) => {
      const fromNode = nodes.find((n) => n.id === element.from);
      const toNode = nodes.find((n) => n.id === element.to);
      if (!fromNode || !toNode) return;

      const kLocal = computeElementStiffnessMatrix(element, fromNode, toNode);
      const T = computeTransformationMatrix(fromNode, toNode);
      const kGlobal = math.multiply(
        math.transpose(T),
        kLocal,
        T
      ) as math.Matrix;
      const dofIndices = getElementDOFIndices(fromNode, toNode, nodes);

      for (let i = 0; i < dofIndices.length; i++) {
        for (let j = 0; j < dofIndices.length; j++) {
          K_global.set(
            [dofIndices[i], dofIndices[j]],
            K_global.get([dofIndices[i], dofIndices[j]]) + kGlobal.get([i, j])
          );
        }
      }
    });

    loads.forEach((load) => {
      const nodeIndex = nodes.findIndex((n) => n.id === load.nodeId);
      if (nodeIndex === -1) return;
      const offset = nodeIndex * DOF_PER_NODE;
      F_global.set([offset + 0, 0], load.x);
      F_global.set([offset + 1, 0], load.y);
      F_global.set([offset + 2, 0], load.z);
      F_global.set([offset + 3, 0], load.theta_x);
      F_global.set([offset + 4, 0], load.theta_y);
      F_global.set([offset + 5, 0], load.theta_z);
    });

    const constrainedDOFs = Object.entries(reactions).flatMap(([nodeId, r]) => {
      const idx = nodes.findIndex((n) => n.id === nodeId);
      if (idx === -1) return [];
      const base = idx * DOF_PER_NODE;
      return [
        ...(r.x ? [base + 0] : []),
        ...(r.y ? [base + 1] : []),
        ...(r.z ? [base + 2] : []),
        ...(r.theta_x ? [base + 3] : []),
        ...(r.theta_y ? [base + 4] : []),
        ...(r.theta_z ? [base + 5] : []),
      ];
    });

    constrainedDOFs.forEach((dof) => {
      for (let i = 0; i < totalDOF; i++) {
        K_global.set([dof, i], dof === i ? 1 : 0);
        K_global.set([i, dof], dof === i ? 1 : 0);
      }
      F_global.set([dof, 0], 0);
    });

    return { K: K_global, F: F_global, U: U_global };
  }, [nodes, elements, loads, reactions]);

  const renderMatrix = (matrix: math.Matrix | number[][], label: string) => {
    const array = math.matrix(matrix).toArray() as number[][];
    const isVector = array.length > 0 && !Array.isArray(array[0]);

    return (
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ marginBottom: 8 }}>{label}</h4>
        <div style={{ overflowX: "auto", maxHeight: 300 }}>
          <table
            style={{
              borderCollapse: "collapse",
              width: isVector ? "auto" : "100%",
              minWidth: 200,
              fontSize: 13,
              textAlign: "right",
            }}
          >
            <tbody>
              {array.map((row, i) => (
                <tr key={i}>
                  {(Array.isArray(row) ? row : [row]).map((val, j) => (
                    <td
                      key={j}
                      style={{
                        border: "1px solid #ccc",
                        padding: "4px 8px",
                        minWidth: 50,
                        backgroundColor: i === j ? "#f4f8fc" : "inherit",
                      }}
                    >
                      {Number(val).toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderMatrix(K, "Global Stiffness Matrix [K]")}
      {renderMatrix(F, "Global Load Vector [F]")}
      {renderMatrix(U, "Displacement Vector [U] (Initial State)")}
    </div>
  );
};
