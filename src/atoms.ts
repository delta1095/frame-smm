import { atom } from "jotai";

export type Node = { id: string; position: [number, number, number] };

export type Element = {
  id: string;
  from: string;
  to: string;
  E: number;
  G: number;
  A: number;
  Iy: number;
  Iz: number;
  J: number;
};

export type Load = {
  id: string;
  nodeId: string;
  x: number;
  y: number;
  z: number;
  theta_x: number;
  theta_y: number;
  theta_z: number;
};

// Represents reactions at nodes (0: free, 1: fixed))
export type Reaction = {
  nodeId: string;
  x: 0 | 1;
  y: 0 | 1;
  z: 0 | 1;
  theta_x: 0 | 1;
  theta_y: 0 | 1;
  theta_z: 0 | 1;
};

export const nodesAtom = atom<Node[]>([]);
export const elementsAtom = atom<Element[]>([]);
export const loadsAtom = atom<Load[]>([]);
export const reactionsAtom = atom<Record<string, Reaction>>({});
