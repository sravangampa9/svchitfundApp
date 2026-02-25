import React from "react";

export default function Members({ members, onChange }) {
  const toggleActive = (id) => {
    const updated = members.map((m) => (m.id === id ? { ...m, inactive: !m.inactive } : m));
    onChange(updated);
  };

  return (
    <div className="card">
      <h2>Members ({members.length})</h2>
      <div className="member-list">
        {members.map((m) => (
          <div key={m.id} className={`member ${m.inactive ? "inactive" : ""}`}>
            <div className="member-name">{m.name}</div>
            <div className="member-balance">Balance: {m.balance ?? 0}</div>
            <button onClick={() => toggleActive(m.id)}>{m.inactive ? "Activate" : "Deactivate"}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
