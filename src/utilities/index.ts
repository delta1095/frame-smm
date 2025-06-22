import * as math from "mathjs";
import type { Node } from "../atoms";
import type { Element } from "../atoms";

export function computeElementStiffnessMatrix(
  element: Element,
  from: Node,
  to: Node
): math.Matrix {
  const { E, G, A, Iy, Iz, J } = element;

  // Assuming from and to nodes have x, y, z coordinates
  const [x1, y1, z1] = from.position;
  const [x2, y2, z2] = to.position;
  const L = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);

  const k = math.zeros(12, 12) as math.Matrix;

  // Axial
  const EA_L = (E * A) / L;

  // Torsional
  const GJ_L = (G * J) / L;

  // Bending about Y
  const EIz_L3 = (E * Iz) / Math.pow(L, 3);
  const EIz_L2 = (E * Iz) / Math.pow(L, 2);
  const EIz_L1 = (E * Iz) / L;

  // Bending about Z
  const EIy_L3 = (E * Iy) / Math.pow(L, 3);
  const EIy_L2 = (E * Iy) / Math.pow(L, 2);
  const EIy_L1 = (E * Iy) / L;

  // Fill matrix terms (symmetrically)
  const entries = [
    [0, 0, EA_L],
    [1, 1, 12 * EIz_L3],
    [1, 5, 6 * EIz_L2],
    [1, 7, -12 * EIz_L3],
    [1, 11, 6 * EIz_L2],
    [2, 2, 12 * EIy_L3],
    [2, 4, -6 * EIy_L2],
    [2, 8, -12 * EIy_L3],
    [2, 10, -6 * EIy_L2],
    [3, 3, GJ_L],
    [4, 4, 4 * EIy_L1],
    [4, 8, 6 * EIy_L2],
    [4, 10, 2 * EIy_L1],
    [5, 5, 4 * EIz_L1],
    [5, 7, -6 * EIz_L2],
    [5, 11, 2 * EIz_L1],
  ];

  for (const [i, j, val] of entries) {
    k.set([i, j], val);
    if (i !== j) k.set([j, i], val);
  }

  // Mirror to second node (6-11) using symmetry
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      const val = k.get([i, j]);
      k.set([i + 6, j + 6], val);
    }
  }

  return k;
}

export function computeTransformationMatrix(from: Node, to: Node): math.Matrix {
  const [x1, y1, z1] = from.position;
  const [x2, y2, z2] = to.position;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const dz = z2 - z1;

  const L = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const l = dx / L;
  const m = dy / L;
  const n = dz / L;

  // Choose global Z-axis as reference
  const zAxis = [0, 0, 1];
  const direction = [l, m, n];

  // If parallel to Z-axis, use X instead
  const reference = Math.abs(n) === 1 ? [1, 0, 0] : zAxis;

  const v = math.cross(reference, direction) as number[];
  const v_norm = math.norm(v);
  const yAxis = math.divide(v, v_norm) as number[];

  const xAxis = direction;
  const zNew = math.cross(xAxis, yAxis) as number[];

  const R = [xAxis, yAxis, zNew];

  // Flatten to 3x3 matrix
  const R_mat = math.transpose(math.matrix(R));

  // Build 12x12 T
  const T = math.zeros(12, 12) as math.Matrix;
  for (let i = 0; i < 4; i++) {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        T.set([i * 3 + row, i * 3 + col], R_mat.get([row, col]));
      }
    }
  }

  return T;
}

export function getElementDOFIndices(
  fromNode: Node,
  toNode: Node,
  nodes: Node[]
): number[] {
  const DOF_PER_NODE = 6;
  const fromIndex = nodes.findIndex((n: Node) => n.id === fromNode.id);
  const toIndex = nodes.findIndex((n: Node) => n.id === toNode.id);
  const indices: number[] = [];
  for (let i = 0; i < DOF_PER_NODE; i++) {
    indices.push(fromIndex * DOF_PER_NODE + i);
  }
  for (let i = 0; i < DOF_PER_NODE; i++) {
    indices.push(toIndex * DOF_PER_NODE + i);
  }
  return indices;
}
