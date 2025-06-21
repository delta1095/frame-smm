import React, { useState } from "react";
import "./App.css";
import Viewer from "./components/Viewer";

type Node = { id: string; position: [number, number, number] };
type Element = { id: string; from: string; to: string };
type Load = {
  id: string;
  nodeId: string;
  x: number;
  y: number;
  z: number;
  theta_x: number;
  theta_y: number;
  theta_z: number;
};

type Reaction = {
  nodeId: string;
  x: 0 | 1;
  y: 0 | 1;
  z: 0 | 1;
  theta_x: 0 | 1;
  theta_y: 0 | 1;
  theta_z: 0 | 1;
};

function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [elements, setElements] = useState<Element[]>([]);
  const [loads, setLoads] = useState<Load[]>([]);
  const [reactions, setReactions] = useState<Record<string, Reaction>>({});

  const [nodeForm, setNodeForm] = useState({ x: "", y: "", z: "" });
  const [elementForm, setElementForm] = useState({ from: "", to: "" });
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
    const { from, to } = elementForm;
    if (from && to && from !== to) {
      const newId = (elements.length + 1).toString();
      setElements([...elements, { id: newId, from, to }]);
      setElementForm({ from: "", to: "" });
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
        <h2 style={{ marginBottom: 24, color: "#0078d4" }}>Frame Builder</h2>

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
                padding: "0.5rem 1rem",
                backgroundColor: tab === t ? "#0078d4" : "#e1e1e1",
                color: tab === t ? "#fff" : "#333",
                fontWeight: 600,
                cursor: "pointer",
                borderRadius: "4px 4px 0 0",
                border: "none",
              }}
              onClick={() => setTab(t as any)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}s
            </button>
          ))}
        </div>

        <div style={{ padding: "0 24px 24px", flex: 1, overflowY: "auto" }}>
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
                      Element {e.id}: Node {e.from} → Node {e.to}
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
              {[
                "Force in X (Fx)",
                "Force in Y (Fy)",
                "Force in Z (Fz)",
                "Moment about X (Mx)",
                "Moment about Y (My)",
                "Moment about Z (Mz)",
              ].map((dof) => (
                <input
                  key={dof}
                  type="number"
                  placeholder={`${dof}`}
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
                      <th style={{ textAlign: "left", padding: 8 }}>Node</th>
                      {["X", "Y", "Z", "Mx", "My", "Mz"].map((label) => (
                        <th
                          key={label}
                          style={{ padding: 8, textAlign: "center", width: 40 }}
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
                            {node.id} ({node.position.join(", ")})
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
    </div>
  );
}

const buttonStyle = {
  width: "100%",
  padding: 10,
  marginTop: 8,
  backgroundColor: "#0078d4",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  fontWeight: 600,
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
