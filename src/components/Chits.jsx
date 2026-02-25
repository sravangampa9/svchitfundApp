import React, { useState } from "react";

function makeInitialContributions(participants, cycles) {
  const contrib = {};
  for (let c = 0; c < cycles; c++) {
    contrib[c] = {};
    participants.forEach((p) => (contrib[c][p.id] = false));
  }
  return contrib;
}

export default function Chits({ members, agents, chits, onChange }) {
  const [form, setForm] = useState({ name: "", amount: 100, participants: members.map((m) => m.id), agentId: agents[0]?.id ?? null });

  const create = () => {
    const participants = members.filter((m) => !m.inactive && form.participants.includes(m.id));
    if (participants.length === 0) return alert("Select at least one participant");
    const cycles = participants.length;
    const contributions = makeInitialContributions(participants, cycles);
    const schedule = participants.map((p, i) => ({ cycle: i, beneficiaryId: p.id }));
    const newChit = {
      id: `c${Date.now()}`,
      name: form.name || `Chit ${chits.length + 1}`,
      amount: Number(form.amount) || 0,
      participants: participants.map((p) => ({ id: p.id, name: p.name })),
      agentId: form.agentId,
      cycles,
      contributions,
      schedule,
      currentCycle: 0,
      completedCycles: []
    };
    onChange([...chits, newChit]);
    setForm({ ...form, name: "" });
  };

  const togglePaid = (chitId, cycle, memberId) => {
    const updated = chits.map((c) => {
      if (c.id !== chitId) return c;
      const contributions = { ...c.contributions };
      contributions[cycle] = { ...contributions[cycle], [memberId]: !contributions[cycle][memberId] };
      // check if cycle complete
      const allPaid = Object.values(contributions[cycle]).every(Boolean);
      const completedCycles = c.completedCycles.includes(cycle) ? c.completedCycles : [...c.completedCycles];
      let currentCycle = c.currentCycle;
      if (allPaid && !completedCycles.includes(cycle)) {
        completedCycles.push(cycle);
        currentCycle = Math.min(c.currentCycle + 1, c.cycles - 1);
      }
      return { ...c, contributions, completedCycles, currentCycle };
    });
    onChange(updated);
  };

  return (
    <div className="card">
      <h2>Chits</h2>
      <div className="chit-form">
        <input placeholder="Chit name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="number" placeholder="Amount per member" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        <select value={form.agentId ?? ""} onChange={(e) => setForm({ ...form, agentId: e.target.value })}>
          <option value="">Select agent (optional)</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <div className="participants">
          <small>Participants (toggle):</small>
          <div className="participants-list">
            {members.map((m) => (
              <label key={m.id}>
                <input
                  type="checkbox"
                  checked={form.participants.includes(m.id) && !m.inactive}
                  onChange={(e) => {
                    const set = new Set(form.participants);
                    if (e.target.checked) set.add(m.id);
                    else set.delete(m.id);
                    setForm({ ...form, participants: Array.from(set) });
                  }}
                />
                {m.name}
              </label>
            ))}
          </div>
        </div>
        <button onClick={create}>Create Chit</button>
      </div>

      <div className="chit-list">
        {chits.map((c) => (
          <div key={c.id} className="chit">
            <h3>{c.name} — ₹{c.amount} per member</h3>
            <div>Agent: {agents.find((a) => a.id === c.agentId)?.name ?? "—"}</div>
            <div>Participants: {c.participants.length}</div>
            <div>Cycles: {c.cycles}</div>
            <div className="cycles">
              {Array.from({ length: c.cycles }).map((_, cycle) => (
                <div key={cycle} className={`cycle ${c.completedCycles.includes(cycle) ? 'done' : ''}`}>
                  <strong>Cycle {cycle + 1} — Beneficiary: {c.schedule[cycle].beneficiaryId}</strong>
                  <div className="payments">
                    {c.participants.map((p) => (
                      <label key={p.id}>
                        <input
                          type="checkbox"
                          checked={!!c.contributions[cycle][p.id]}
                          onChange={() => togglePaid(c.id, cycle, p.id)}
                        />
                        {p.name}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
