import { useState, useMemo } from "react";
import { PYQS } from "./pyqs.js";
import { BANK } from "./bank.js";
import { PYQ_SOLUTIONS } from "./pyq_solutions.js";

/* ============ CONFIG ============ */
const UNITS = ["Algebra", "Number Theory", "Geometry", "Combinatorics"];


/* ============ STYLES ============ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,600;6..72,800&family=Instrument+Sans:wght@400;500;600&display=swap');
:root{--ink:#14213d;--paper:#f3f6fb;--grid:#dbe4f2;--gold:#f2a900;--teal:#0f8b8d;--red:#c8423b;--card:#fff;--mute:#5b6781}
*{box-sizing:border-box}
body{margin:0}
.app{min-height:100vh;color:var(--ink);font-family:'Instrument Sans',sans-serif;
background-color:var(--paper);background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:28px 28px}
.top{background:var(--ink);color:#fff;padding:36px 24px 0}
.wrap{max-width:1040px;margin:0 auto}
h1{font-family:'Newsreader',serif;font-weight:800;font-size:clamp(34px,6vw,60px);margin:0;line-height:1.05}
.sub{color:#b9c6e4;margin:10px 0 26px;max-width:560px}
.tabs{display:flex;gap:6px;flex-wrap:wrap}
.tab{border:0;cursor:pointer;font:600 15px 'Instrument Sans';padding:14px 22px;border-radius:10px 10px 0 0;background:#22335c;color:#cfd8ee}
.tab:hover{background:#2c4172}
.tab.on{background:var(--paper);color:var(--ink)}
.tab:focus-visible,.btn:focus-visible,select:focus-visible,input:focus-visible,textarea:focus-visible{outline:3px solid var(--gold);outline-offset:2px}
.main{padding:28px 24px 60px}
h2{font-family:'Newsreader',serif;font-size:28px;margin:0 0 4px}
.mute{color:var(--mute);font-size:14px}
.row{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin:18px 0}
select,input,textarea{font:400 15px 'Instrument Sans';padding:10px 12px;border:1.5px solid #b7c3dc;border-radius:8px;background:#fff;color:var(--ink)}
textarea{width:100%;min-height:130px;resize:vertical;font-family:'Instrument Sans'}
.btn{cursor:pointer;border:0;border-radius:8px;padding:10px 18px;font:600 14px 'Instrument Sans';background:var(--ink);color:#fff}
.btn:hover{background:#243a6b}
.btn.gold{background:var(--gold);color:var(--ink)}
.btn.gold:hover{background:#ffbb22}
.btn.ghost{background:transparent;color:var(--ink);border:1.5px solid var(--ink)}
.btn:disabled{opacity:.5;cursor:not-allowed}
.card{background:var(--card);border:1.5px solid var(--ink);border-radius:6px;padding:18px 20px;margin-bottom:14px;box-shadow:4px 4px 0 var(--ink)}
.chip{display:inline-block;font-size:12.5px;font-weight:600;padding:3px 10px;border-radius:99px;margin-right:6px;background:#e5ecf8}
.chip.u{background:var(--teal);color:#fff}
.chip.y{background:var(--gold)}
.qtext{white-space:pre-wrap;margin:12px 0;line-height:1.6;font-family:'Newsreader',serif;font-size:18px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin:18px 0}
.stat{background:#fff;border:1.5px solid var(--ink);border-radius:6px;padding:16px}
.stat b{font-family:'Newsreader',serif;font-size:34px;display:block}
.bar{height:8px;background:#e5ecf8;border-radius:9px;margin-top:8px;overflow:hidden}
.bar i{display:block;height:100%;background:var(--teal)}
.two{display:grid;grid-template-columns:1fr 1fr;gap:18px}
@media(max-width:760px){.two{grid-template-columns:1fr}}
label{font-weight:600;font-size:14px;display:block;margin:14px 0 6px}
.score{font-family:'Newsreader',serif;font-size:64px;font-weight:800;line-height:1}
.err{color:var(--red);font-weight:600;margin-top:10px}
.list{margin:6px 0 0 18px;padding:0;line-height:1.6}
@media(prefers-reduced-motion:no-preference){.tab{transition:background .15s}}
`;

/* ============ PYQs ============ */
function Pyqs() {
  const [open, setOpen] = useState({});
  const [year, setYear] = useState("All");
  const [unit, setUnit] = useState("All");
  const [sub, setSub] = useState("All");
  const years = [...new Set(PYQS.map(p => p.year))].sort();
  const subs = [...new Set(PYQS.filter(p => unit === "All" || p.unit === unit).map(p => p.subtopic))];
  const shown = useMemo(() => PYQS.filter(p =>
    (year === "All" || p.year === +year) && (unit === "All" || p.unit === unit) && (sub === "All" || p.subtopic === sub)
  ), [year, unit, sub]);
  return (
    <>
      <h2>RMO previous year questions</h2>
      <div className="mute">Filter by year, chapter and subtopic.</div>
      <div className="row">
        <select aria-label="Year" value={year} onChange={e => setYear(e.target.value)}>
          <option>All</option>{years.map(y => <option key={y}>{y}</option>)}
        </select>
        <select aria-label="Chapter" value={unit} onChange={e => { setUnit(e.target.value); setSub("All"); }}>
          <option>All</option>{UNITS.map(u => <option key={u}>{u}</option>)}
        </select>
        <select aria-label="Subtopic" value={sub} onChange={e => setSub(e.target.value)}>
          <option>All</option>{subs.map(s => <option key={s}>{s}</option>)}
        </select>
        <span className="mute">{shown.length} problems</span>
      </div>
      {shown.length === 0 && <div className="card">No problems match these filters. Reset one of them.</div>}
      {shown.map(p => (
        <div className="card" key={p.id}>
          <span className="chip y">RMO {p.year}</span>
          <span className="chip u">{p.unit}</span>
          <span className="chip">{p.subtopic}</span>
          <div className="qtext">{p.text}</div>
          {open[p.id] && PYQ_SOLUTIONS[p.id] && (
            <div className="qtext" style={{ fontSize: 16, borderLeft: "4px solid var(--teal)", paddingLeft: 12 }}>
              {PYQ_SOLUTIONS[p.id].text}
              <div className="mute" style={{ fontFamily: "Instrument Sans" }}>Source: {PYQ_SOLUTIONS[p.id].src === "video" ? "video solution" : "solved by Claude"}</div>
            </div>
          )}
          <div className="row" style={{ margin: 0 }}>
            {PYQ_SOLUTIONS[p.id]
              ? <button className="btn ghost" onClick={() => setOpen({ ...open, [p.id]: !open[p.id] })}>{open[p.id] ? "Hide solution" : "Show solution"}</button>
              : <span className="mute">Solution not added yet</span>}
          </div>
        </div>
      ))}
    </>
  );
}

/* ============ QUESTION BANK ============ */
function Bank() {
  const [unit, setUnit] = useState("All");
  const [level, setLevel] = useState("All");
  const [open, setOpen] = useState({});
  const shown = BANK.filter(q => (unit === "All" || q.unit === unit) && (level === "All" || q.level === level));
  return (
    <>
      <h2>Question bank</h2>
      <div className="mute">Real RMO problems from 2013 to 2016, each with a worked solution.</div>
      <div className="grid">
        {UNITS.map(u => {
          const n = BANK.filter(i => i.unit === u).length;
          return (
            <div className="stat" key={u}>
              <span className="mute">{u}</span><b>{n}/25</b>
              <div className="bar"><i style={{ width: (n / 25) * 100 + "%" }} /></div>
            </div>
          );
        })}
      </div>
      <div className="row">
        <select aria-label="Chapter" value={unit} onChange={e => setUnit(e.target.value)}>
          <option>All</option>{UNITS.map(u => <option key={u}>{u}</option>)}
        </select>
        <select aria-label="Level" value={level} onChange={e => setLevel(e.target.value)}>
          <option>All</option><option>Easy</option><option>Medium</option><option>Hard</option>
        </select>
        <span className="mute">{shown.length} problems</span>
      </div>
      {shown.map(q => (
        <div className="card" key={q.id}>
          <span className="chip u">{q.unit}</span>
          <span className="chip">{q.subtopic}</span>
          <span className="chip y">{q.level}</span>
          <span className="chip">{q.source}</span>
          <div className="qtext">{q.text}</div>
          {open[q.id] && <div className="qtext" style={{ fontSize: 16, borderLeft: "4px solid var(--teal)", paddingLeft: 12 }}>{q.solution}</div>}
          <div className="row" style={{ margin: 0 }}>
            <button className="btn ghost" onClick={() => setOpen({ ...open, [q.id]: !open[q.id] })}>{open[q.id] ? "Hide solution" : "Show solution"}</button>
          </div>
        </div>
      ))}
    </>
  );
}

/* ============ APP ============ */
export default function App() {
  const [tab, setTab] = useState("pyq");
  const tabs = [["pyq", "RMO PYQs"], ["bank", "Question bank"]];
  return (
    <div className="app">
      <style>{css}</style>
      <header className="top">
        <div className="wrap">
          <h1>RMO Training Room</h1>
          <p className="sub">Past papers with worked solutions, and practice problems, in one place.</p>
          <nav className="tabs" role="tablist">
            {tabs.map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} className={"tab" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>{l}</button>
            ))}
          </nav>
        </div>
      </header>
      <main className="main"><div className="wrap">
        {tab === "pyq" && <Pyqs />}
        {tab === "bank" && <Bank />}
      </div></main>
    </div>
  );
}
