import React, { useState } from "react";

export default function Agents({ agents, onChange }) {
  const [name, setName] = useState("");

  const add = () => {
    if (!name.trim()) return;
    const next = [...agents, { id: `a${Date.now()}`, name: name.trim() }];
    onChange(next);
    setName("");
  };

  const remove = (id) => onChange(agents.filter((a) => a.id !== id));

  return (
    <div className="card">
      <h2>Agents</h2>
      <div className="agents-list">
        {agents.map((a) => (
          <div key={a.id} className="agent">
            <span>{a.name}</span>
            <button onClick={() => remove(a.id)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="agent-form">
        <input placeholder="Agent name" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={add}>Add Agent</button>
      </div>
    </div>
  );
}
