import React, { useState } from "react";
import "./App.css";
import Viewer from "./components/Viewer";

type Node = { id: string; position: [number, number, number] };
type Element = { id: string; from: string; to: string };
type Load = {
  id: string;
  nodeId: string;
  direction: "x" | "y" | "z";
  magnitude: number;
};
type Reaction = { id: string; nodeId: string; x: 0 | 1; y: 0 | 1; z: 0 | 1 };

function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [elements, setElements] = useState<Element[]>([]);
  const [loads, setLoads] = useState<Load[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);

  const [nodeForm, setNodeForm] = useState({ x: "", y: "", z: "" });
  const [elementForm, setElementForm] = useState({ from: "", to: "" });
  const [loadForm, setLoadForm] = useState({
    nodeId: "",
    direction: "x" as "x" | "y" | "z",
    magnitude: "",
  });
  const [reactionForm, setReactionForm] = useState({
    nodeId: "",
    x: false,
    y: false,
    z: false,
  });

  const [tab, setTab] = useState<"node" | "element" | "load" | "reaction">(
    "node"
  );

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
    const { nodeId, direction, magnitude } = loadForm;
    if (nodeId && magnitude && !isNaN(Number(magnitude))) {
      const newId = (loads.length + 1).toString();
      setLoads([
        ...loads,
        { id: newId, nodeId, direction, magnitude: Number(magnitude) },
      ]);
      setLoadForm({ nodeId: "", direction: "x", magnitude: "" });
    }
  };

  const addReaction = () => {
    const { nodeId, x, y, z } = reactionForm;
    if (nodeId && (x || y || z)) {
      const newId = (reactions.length + 1).toString();
      setReactions([
        ...reactions,
        { id: newId, nodeId, x: x ? 1 : 0, y: y ? 1 : 0, z: z ? 1 : 0 },
      ]);
      setReactionForm({ nodeId: "", x: false, y: false, z: false });
    }
  };

  // Styling omitted for brevity - reuse your styles

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
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
          <button
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: tab === "node" ? "#0078d4" : "#e1e1e1",
              color: tab === "node" ? "#fff" : "#333",
              fontWeight: 600,
              cursor: "pointer",
              borderRadius: "4px 4px 0 0",
              border: "none",
            }}
            onClick={() => setTab("node")}
          >
            Nodes
          </button>
          <button
            style={{
              padding: "0.5rem 1rem",
              flex: 1,
              width: "fit-content",
              backgroundColor: tab === "element" ? "#0078d4" : "#e1e1e1",
              color: tab === "element" ? "#fff" : "#333",
              fontWeight: 600,
              cursor: "pointer",
              borderRadius: "4px 4px 0 0",
              border: "none",
            }}
            onClick={() => setTab("element")}
          >
            Elements
          </button>
          <button
            style={{
              padding: "0.5rem 1rem",
              flex: 1,
              width: "fit-content",
              backgroundColor: tab === "load" ? "#0078d4" : "#e1e1e1",
              color: tab === "load" ? "#fff" : "#333",
              fontWeight: 600,
              cursor: "pointer",
              borderRadius: "4px 4px 0 0",
              border: "none",
            }}
            onClick={() => setTab("load")}
          >
            Loads
          </button>
          <button
            style={{
              padding: "0.5rem 1rem",
              flex: 1,
              width: "fit-content",
              backgroundColor: tab === "reaction" ? "#0078d4" : "#e1e1e1",
              color: tab === "reaction" ? "#fff" : "#333",
              fontWeight: 600,
              cursor: "pointer",
              borderRadius: "4px 4px 0 0",
              border: "none",
            }}
            onClick={() => setTab("reaction")}
          >
            Reactions
          </button>
        </div>

        {/* Nodes */}
        <div
          style={{
            padding: "0 24px 24px",
            flex: 1,
            overflowY: "auto",
          }}
        >
          {tab === "node" && (
            <>
              <h3>Add Node</h3>
              <input
                type="number"
                placeholder="X coordinate"
                value={nodeForm.x}
                onChange={(e) =>
                  setNodeForm({ ...nodeForm, x: e.target.value })
                }
                style={{
                  width: "100%",
                  margin: "8px 0",
                  padding: 8,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="number"
                placeholder="Y coordinate"
                value={nodeForm.y}
                onChange={(e) =>
                  setNodeForm({ ...nodeForm, y: e.target.value })
                }
                style={{
                  width: "100%",
                  margin: "8px 0",
                  padding: 8,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="number"
                placeholder="Z coordinate"
                value={nodeForm.z}
                onChange={(e) =>
                  setNodeForm({ ...nodeForm, z: e.target.value })
                }
                style={{
                  width: "100%",
                  margin: "8px 0",
                  padding: 8,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              />
              <button
                onClick={addNode}
                style={{
                  width: "100%",
                  padding: 10,
                  marginTop: 8,
                  backgroundColor: "#0078d4",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Add Node
              </button>

              <h4
                style={{
                  marginTop: 32,
                  borderBottom: "1px solid #ddd",
                  paddingBottom: 6,
                }}
              >
                Existing Nodes
              </h4>
              <ul
                style={{
                  maxHeight: 180,
                  overflowY: "auto",
                  listStyle: "none",
                  paddingLeft: 0,
                }}
              >
                {nodes.length === 0 ? (
                  <li>No nodes added yet.</li>
                ) : (
                  nodes.map((n) => (
                    <li
                      key={n.id}
                      style={{
                        padding: "6px 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      Node {n.id}: ({n.position.join(", ")})
                    </li>
                  ))
                )}
              </ul>
            </>
          )}

          {/* Elements */}
          {tab === "element" && (
            <>
              <h3>Add Element</h3>
              <select
                value={elementForm.from}
                onChange={(e) =>
                  setElementForm({ ...elementForm, from: e.target.value })
                }
                style={{
                  width: "100%",
                  margin: "8px 0",
                  padding: 8,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              >
                <option value="">From Node</option>
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    Node {n.id}
                  </option>
                ))}
              </select>
              <select
                value={elementForm.to}
                onChange={(e) =>
                  setElementForm({ ...elementForm, to: e.target.value })
                }
                style={{
                  width: "100%",
                  margin: "8px 0",
                  padding: 8,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              >
                <option value="">To Node</option>
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    Node {n.id}
                  </option>
                ))}
              </select>
              <button
                onClick={addElement}
                style={{
                  width: "100%",
                  padding: 10,
                  marginTop: 8,
                  backgroundColor: "#0078d4",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Add Element
              </button>

              <h4
                style={{
                  marginTop: 32,
                  borderBottom: "1px solid #ddd",
                  paddingBottom: 6,
                }}
              >
                Existing Elements
              </h4>
              <ul
                style={{
                  maxHeight: 180,
                  overflowY: "auto",
                  listStyle: "none",
                  paddingLeft: 0,
                }}
              >
                {elements.length === 0 ? (
                  <li>No elements added yet.</li>
                ) : (
                  elements.map((e) => (
                    <li
                      key={e.id}
                      style={{
                        padding: "6px 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      Element {e.id}: Node {e.from} → Node {e.to}
                    </li>
                  ))
                )}
              </ul>
            </>
          )}

          {/* Loads */}
          {tab === "load" && (
            <>
              <h3>Add Load</h3>
              <select
                value={loadForm.nodeId}
                onChange={(e) =>
                  setLoadForm({ ...loadForm, nodeId: e.target.value })
                }
                style={{
                  width: "100%",
                  margin: "8px 0",
                  padding: 8,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              >
                <option value="">Select Node</option>
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    Node {n.id}
                  </option>
                ))}
              </select>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "8px 0",
                }}
              >
                {(["x", "y", "z"] as const).map((axis) => (
                  <label
                    key={axis}
                    style={{ flex: 1, textAlign: "center", cursor: "pointer" }}
                  >
                    <input
                      type="radio"
                      name="loadDirection"
                      value={axis}
                      checked={loadForm.direction === axis}
                      onChange={() =>
                        setLoadForm({ ...loadForm, direction: axis })
                      }
                      style={{ marginRight: 6 }}
                    />
                    {axis.toUpperCase()}
                  </label>
                ))}
              </div>

              <input
                type="number"
                placeholder="Magnitude"
                value={loadForm.magnitude}
                onChange={(e) =>
                  setLoadForm({ ...loadForm, magnitude: e.target.value })
                }
                style={{
                  width: "100%",
                  margin: "8px 0",
                  padding: 8,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
                min="0"
              />
              <button
                onClick={addLoad}
                style={{
                  width: "100%",
                  padding: 10,
                  marginTop: 8,
                  backgroundColor: "#0078d4",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Add Load
              </button>

              <h4
                style={{
                  marginTop: 32,
                  borderBottom: "1px solid #ddd",
                  paddingBottom: 6,
                }}
              >
                Existing Loads
              </h4>
              <ul
                style={{
                  maxHeight: 180,
                  overflowY: "auto",
                  listStyle: "none",
                  paddingLeft: 0,
                }}
              >
                {loads.length === 0 ? (
                  <li>No loads added yet.</li>
                ) : (
                  loads.map((l) => (
                    <li
                      key={l.id}
                      style={{
                        padding: "6px 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <strong>Load {l.id}</strong> @ Node {l.nodeId}: Direction{" "}
                      {l.direction.toUpperCase()} × {l.magnitude}
                    </li>
                  ))
                )}
              </ul>
            </>
          )}

          {/* Reactions */}
          {tab === "reaction" && (
            <>
              <h3>Add Reaction</h3>
              <select
                value={reactionForm.nodeId}
                onChange={(e) =>
                  setReactionForm({ ...reactionForm, nodeId: e.target.value })
                }
                style={{
                  width: "100%",
                  margin: "8px 0",
                  padding: 8,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              >
                <option value="">Select Node</option>
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    Node {n.id}
                  </option>
                ))}
              </select>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <input
                  type="checkbox"
                  checked={reactionForm.x}
                  onChange={(e) =>
                    setReactionForm({ ...reactionForm, x: e.target.checked })
                  }
                />
                <span style={{ marginLeft: 8 }}>X (0 or 1)</span>
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <input
                  type="checkbox"
                  checked={reactionForm.y}
                  onChange={(e) =>
                    setReactionForm({ ...reactionForm, y: e.target.checked })
                  }
                />
                <span style={{ marginLeft: 8 }}>Y (0 or 1)</span>
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <input
                  type="checkbox"
                  checked={reactionForm.z}
                  onChange={(e) =>
                    setReactionForm({ ...reactionForm, z: e.target.checked })
                  }
                />
                <span style={{ marginLeft: 8 }}>Z (0 or 1)</span>
              </label>
              <button
                onClick={addReaction}
                style={{
                  width: "100%",
                  padding: 10,
                  marginTop: 8,
                  backgroundColor: "#0078d4",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Add Reaction
              </button>

              <h4
                style={{
                  marginTop: 32,
                  borderBottom: "1px solid #ddd",
                  paddingBottom: 6,
                }}
              >
                Existing Reactions
              </h4>
              <ul
                style={{
                  maxHeight: 180,
                  overflowY: "auto",
                  listStyle: "none",
                  paddingLeft: 0,
                }}
              >
                {reactions.length === 0 ? (
                  <li>No reactions added yet.</li>
                ) : (
                  reactions.map((r) => (
                    <li
                      key={r.id}
                      style={{
                        padding: "6px 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <strong>Reaction {r.id}</strong> @ Node {r.nodeId}: X=
                      {r.x}, Y={r.y}, Z={r.z}
                    </li>
                  ))
                )}
              </ul>
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

export default App;
