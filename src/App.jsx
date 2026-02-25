import React, { useEffect, useState } from "react";
import Members from "./components/Members";
import Agents from "./components/Agents";
import Chits from "./components/Chits";

const STORAGE_KEY = "chitfund-data-v1";

const defaultMembers = Array.from({ length: 25 }).map((_, i) => ({
  id: `m${i + 1}`,
  name: `Member ${i + 1}`,
  balance: 0
}));

export default function App() {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { members: defaultMembers, agents: [], chits: [] };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const update = (patch) => setData((d) => ({ ...d, ...patch }));

  return (
    <div className="app">
      <header>
        <h1>Chitfund Manager</h1>
        <p>Small chitfund for a group of 25 members with agents</p>
      </header>

      <main>
        <section>
          <Agents agents={data.agents} onChange={(agents) => update({ agents })} />
        </section>
        <section>
          <Members members={data.members} onChange={(members) => update({ members })} />
        </section>
        <section>
          <Chits
            members={data.members}
            agents={data.agents}
            chits={data.chits}
            onChange={(chits) => update({ chits })}
          />
        </section>
      </main>

      <footer>
        <small>Data stored in browser localStorage (key: {STORAGE_KEY})</small>
      </footer>
    </div>
  );
}
