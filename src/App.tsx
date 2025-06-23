import React, { useState } from "react";
import "./App.css";
import Viewer from "./components/Viewer";
import { useAtom } from "jotai";
import {
  nodesAtom,
  elementsAtom,
  loadsAtom,
  reactionsAtom,
  type Reaction,
} from "./atoms";
import { Analysis } from "./components/Analysis";
import "@fontsource/inter";

const loadPlaceholder = {
  x: "Force in X (Fx)",
  y: "Force in Y (Fy)",
  z: "Force in Z (Fz)",
  theta_x: "Moment in X (Mx)",
  theta_y: "Moment in Y (My)",
  theta_z: "Moment in Z (Mz)",
};

function App() {
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [elements, setElements] = useAtom(elementsAtom);
  const [loads, setLoads] = useAtom(loadsAtom);
  const [reactions, setReactions] = useAtom(reactionsAtom);

  const [nodeForm, setNodeForm] = useState({ x: "", y: "", z: "" });
  const [elementForm, setElementForm] = useState({
    from: "",
    to: "",
    E: "",
    G: "",
    A: "",
    Iy: "",
    Iz: "",
    J: "",
  });
  const [loadForm, setLoadForm] = useState({
    nodeId: "",
    x: "",
    y: "",
    z: "",
    theta_x: "",
    theta_y: "",
    theta_z: "",
  });

  const [tab, setTab] = useState<"node" | "element" | "load" | "reaction">(
    "node"
  );

  const [showAnalysis, setShowAnalysis] = useState(false);

  const toggleRestraint = (
    nodeId: string,
    dof: keyof Omit<Reaction, "nodeId">
  ) => {
    setReactions((prev) => {
      const prevReaction = prev[nodeId] || {
        nodeId,
        x: 0,
        y: 0,
        z: 0,
        theta_x: 0,
        theta_y: 0,
        theta_z: 0,
      };
      return {
        ...prev,
        [nodeId]: {
          ...prevReaction,
          [dof]: prevReaction[dof] === 1 ? 0 : 1,
        },
      };
    });
  };

  const addNode = () => {
    const { x, y, z } = nodeForm;
    if (x && y && z) {
      const newId = (nodes.length + 1).toString();
      setNodes([
        ...nodes,
        { id: newId, position: [Number(x), Number(y), Number(z)] },
      ]);
      setNodeForm({ x: "", y: "", z: "" });
    }
  };

  const addElement = () => {
    const { from, to, E, G, A, Iy, Iz, J } = elementForm;
    if (from && to && from !== to && E && G && A && Iy && Iz && J) {
      const newId = (elements.length + 1).toString();
      setElements([
        ...elements,
        {
          id: newId,
          from,
          to,
          E: Number(E),
          G: Number(G),
          A: Number(A),
          Iy: Number(Iy),
          Iz: Number(Iz),
          J: Number(J),
        },
      ]);
      setElementForm({
        from: "",
        to: "",
        E: "",
        G: "",
        A: "",
        Iy: "",
        Iz: "",
        J: "",
      });
    }
  };

  const addLoad = () => {
    const { nodeId, x, y, z, theta_x, theta_y, theta_z } = loadForm;

    if (nodeId) {
      const newId = (loads.length + 1).toString();
      setLoads([
        ...loads,
        {
          id: newId,
          nodeId,
          x: Number(x) || 0,
          y: Number(y) || 0,
          z: Number(z) || 0,
          theta_x: Number(theta_x) || 0,
          theta_y: Number(theta_y) || 0,
          theta_z: Number(theta_z) || 0,
        },
      ]);
      setLoadForm({
        nodeId: "",
        x: "",
        y: "",
        z: "",
        theta_x: "",
        theta_y: "",
        theta_z: "",
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        fontFamily: "Segoe UI",
        backgroundColor: "#f0f2f5",
      }}
    >
      <aside
        style={{
          width: 360,
          padding: 24,
          backgroundColor: "#fff",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ color: "#0078d4", marginBottom: 2 }}>
          3D Frame Analysis – Stiffness Matrix Method
        </h2>
        <span style={{ marginBottom: 24, marginTop: 2 }}>
          Developed by Deepesh Chhetri
        </span>

        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 12,
            overflowX: "auto",
          }}
        >
          {["node", "element", "load", "reaction"].map((t) => (
            <button
              key={t}
              style={{
                padding: "0.5rem",
                backgroundColor: tab === t ? "#0078d4" : "#e1e1e1",
                color: tab === t ? "#fff" : "#333",
                fontWeight: 600,
                cursor: "pointer",
                borderRadius: "4px",
                border: "none",
              }}
              onClick={() => setTab(t as any)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}s
            </button>
          ))}
        </div>

        <div style={{ padding: "0", flex: 1, overflowY: "auto" }}>
          {/* Node tab */}
          {tab === "node" && (
            <>
              <h3>Add Node</h3>
              {["x", "y", "z"].map((axis) => (
                <input
                  key={axis}
                  type="number"
                  placeholder={`${axis.toUpperCase()} coordinate`}
                  value={nodeForm[axis as "x" | "y" | "z"]}
                  onChange={(e) =>
                    setNodeForm({ ...nodeForm, [axis]: e.target.value })
                  }
                  style={{
                    width: "100%",
                    margin: "8px 0",
                    padding: 8,
                    borderRadius: 4,
                    border: "1px solid #ccc",
                  }}
                />
              ))}
              <button onClick={addNode} style={buttonStyle}>
                Add Node
              </button>
              <h4 style={sectionHeading}>Existing Nodes</h4>
              <ul style={listStyle}>
                {nodes.length === 0 ? (
                  <li>No nodes added yet.</li>
                ) : (
                  nodes.map((n) => (
                    <li key={n.id} style={listItemStyle}>
                      Node {n.id}: ({n.position.join(", ")})
                    </li>
                  ))
                )}
              </ul>
            </>
          )}

          {/* Element tab */}
          {tab === "element" && (
            <>
              <h3>Add Element</h3>

              {/* Node Selection */}
              {["from", "to"].map((key) => (
                <select
                  key={key}
                  value={elementForm[key as "from" | "to"]}
                  onChange={(e) =>
                    setElementForm({ ...elementForm, [key]: e.target.value })
                  }
                  style={selectStyle}
                >
                  <option value="">
                    {key === "from" ? "From Node" : "To Node"}
                  </option>
                  {nodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      Node {n.id}
                    </option>
                  ))}
                </select>
              ))}

              {/* Section and Material Properties */}
              {[
                ["E", "Young’s Modulus (E)"],
                ["G", "Shear Modulus (G)"],
                ["A", "Area (A)"],
                ["Iy", "Moment of Inertia Iy"],
                ["Iz", "Moment of Inertia Iz"],
                ["J", "Torsional Constant (J)"],
              ].map(([key, label]) => (
                <input
                  key={key}
                  type="number"
                  placeholder={label}
                  value={elementForm[key as keyof typeof elementForm]}
                  onChange={(e) =>
                    setElementForm({ ...elementForm, [key]: e.target.value })
                  }
                  style={{
                    width: "100%",
                    margin: "6px 0",
                    padding: 8,
                    borderRadius: 4,
                    border: "1px solid #ccc",
                  }}
                />
              ))}

              <button onClick={addElement} style={buttonStyle}>
                Add Element
              </button>

              <h4 style={sectionHeading}>Existing Elements</h4>
              <ul style={listStyle}>
                {elements.length === 0 ? (
                  <li>No elements added yet.</li>
                ) : (
                  elements.map((e) => (
                    <li key={e.id} style={listItemStyle}>
                      <strong>Element {e.id}</strong>: Node {e.from} → Node{" "}
                      {e.to}
                      <br />
                      E={e.E}, G={e.G}, A={e.A}, Iy={e.Iy}, Iz={e.Iz}, J={e.J}
                    </li>
                  ))
                )}
              </ul>
            </>
          )}

          {/* Load tab */}
          {tab === "load" && (
            <>
              <h3>Add Load</h3>
              <select
                value={loadForm.nodeId}
                onChange={(e) =>
                  setLoadForm({ ...loadForm, nodeId: e.target.value })
                }
                style={selectStyle}
              >
                <option value="">Select Node</option>
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    Node {n.id}
                  </option>
                ))}
              </select>
              {["x", "y", "z", "theta_x", "theta_y", "theta_z"].map((dof) => (
                <input
                  key={dof}
                  type="number"
                  placeholder={
                    loadPlaceholder[dof as keyof typeof loadPlaceholder]
                  }
                  value={loadForm[dof as keyof typeof loadForm]}
                  onChange={(e) =>
                    setLoadForm({ ...loadForm, [dof]: e.target.value })
                  }
                  style={{
                    width: "100%",
                    margin: "4px 0",
                    padding: 8,
                    borderRadius: 4,
                    border: "1px solid #ccc",
                  }}
                />
              ))}
              <button onClick={addLoad} style={buttonStyle}>
                Add Load
              </button>
              <h4 style={sectionHeading}>Existing Loads</h4>
              <ul style={listStyle}>
                {loads.length === 0 ? (
                  <li>No loads added yet.</li>
                ) : (
                  loads.map((l) => (
                    <li key={l.id} style={listItemStyle}>
                      <strong>Load {l.id}</strong> @ Node {l.nodeId}: Fx={l.x},
                      Fy={l.y}, Fz={l.z}, Mx={l.theta_x}, My={l.theta_y}, Mz=
                      {l.theta_z}
                    </li>
                  ))
                )}
              </ul>
            </>
          )}

          {/* Reaction tab */}
          {tab === "reaction" && (
            <>
              <h3>Set Reactions (Restraints) per Node</h3>
              {nodes.length === 0 ? (
                <p>No nodes available.</p>
              ) : (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: 16,
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: "1px solid #ccc" }}>
                      <th style={{ textAlign: "left", padding: 2 }}>Node</th>
                      {["X", "Y", "Z", "Mx", "My", "Mz"].map((label) => (
                        <th
                          key={label}
                          style={{ padding: 2, textAlign: "center", width: 40 }}
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map((node) => {
                      const reaction = reactions[node.id] || {
                        nodeId: node.id,
                        x: 0,
                        y: 0,
                        z: 0,
                        theta_x: 0,
                        theta_y: 0,
                        theta_z: 0,
                      };
                      return (
                        <tr
                          key={node.id}
                          style={{
                            borderBottom: "1px solid #eee",
                            userSelect: "none",
                          }}
                        >
                          <td style={{ padding: 8 }}>
                            <div>{node.id}</div>
                            <div style={{ fontSize: "0.85em", color: "#666" }}>
                              ({node.position.join(", ")})
                            </div>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={reaction.x === 1}
                              onChange={() => toggleRestraint(node.id, "x")}
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={reaction.y === 1}
                              onChange={() => toggleRestraint(node.id, "y")}
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={reaction.z === 1}
                              onChange={() => toggleRestraint(node.id, "z")}
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={reaction.theta_x === 1}
                              onChange={() =>
                                toggleRestraint(node.id, "theta_x")
                              }
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={reaction.theta_y === 1}
                              onChange={() =>
                                toggleRestraint(node.id, "theta_y")
                              }
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={reaction.theta_z === 1}
                              onChange={() =>
                                toggleRestraint(node.id, "theta_z")
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </aside>

      <main style={{ flex: 1 }}>
        <Viewer nodes={nodes} elements={elements} />
      </main>

      <button
        onClick={() => setShowAnalysis(true)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          padding: "12px 20px",
          backgroundColor: "#0078d4",
          color: "#fff",
          border: "none",
          borderRadius: "999px",
          fontSize: 16,
          fontWeight: "bold",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        Show Analysis
      </button>

      {showAnalysis && (
        <div
          style={{
            position: "fixed",
            top: 60,
            right: 40,
            width: "calc(100vw - 120px)",
            height: "calc(100vh - 120px)",
            backgroundColor: "#fff",
            borderRadius: 12,
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            padding: 20,
            overflowY: "auto",
            zIndex: 1001,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0, color: "#0078d4" }}>Analysis Results</h3>
            <button
              onClick={() => setShowAnalysis(false)}
              style={{
                background: "transparent",
                border: "none",
                fontSize: 24,
                cursor: "pointer",
                lineHeight: 1,
                color: "#999",
              }}
              aria-label="Close Analysis"
            >
              ×
            </button>
          </div>
          <div style={{ marginTop: 12 }}>
            <Analysis />
          </div>
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  width: "100%",
  padding: "10px",
  marginTop: 12,
  backgroundColor: "#0078d4",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  fontSize: "15px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "background-color 0.2s",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const sectionHeading = {
  marginTop: 32,
  borderBottom: "1px solid #ddd",
  paddingBottom: 6,
};

const listStyle = {
  maxHeight: 180,
  overflowY: "auto" as const,
  listStyleType: "none" as const,
  paddingLeft: 0,
};

const listItemStyle = {
  padding: "6px 0",
  borderBottom: "1px solid #eee",
};

const selectStyle = {
  width: "100%",
  margin: "8px 0",
  padding: 8,
  borderRadius: 4,
  border: "1px solid #ccc",
};

export default App;
