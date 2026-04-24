const { useState, useEffect } = React;

const WEEKENDS = [
  { id: 1, label: "Weekend 1", days: [1,2,3,4], color: "#F5C518", textColor: "#2a1a00", accent: "#e6a800", name: "Golden Glow" },
  { id: 2, label: "Weekend 2", days: [8,9,10,11], color: "#F472B6", textColor: "#4a0020", accent: "#be185d", name: "Pretty in Pink" },
  { id: 3, label: "Weekend 3", days: [15,16,17,18], color: "#003087", textColor: "#ffffff", accent: "#D21034", name: "Haitian Royale" },
  { id: 4, label: "Birthday Stretch 👑", days: [21,22,23,24,25,26,27,28], color: "#C41E3A", textColor: "#ffffff", accent: "#ff6b6b", name: "Red Reign" },
  { id: 5, label: "Weekend 5", days: [29,30,31], color: "#7C3AED", textColor: "#ffffff", accent: "#a855f7", name: "Purple Royalty" },
];

const WEEKDAY_GROUPS = [
  { id: "w1", label: "Week 1 Days", days: [5,6,7], color: "#64748b", textColor: "#ffffff", accent: "#94a3b8", name: "Week 1 Weekdays" },
  { id: "w2", label: "Week 2 Days", days: [12,13,14], color: "#64748b", textColor: "#ffffff", accent: "#94a3b8", name: "Week 2 Weekdays" },
  { id: "w3", label: "Week 3 Days", days: [19,20], color: "#64748b", textColor: "#ffffff", accent: "#94a3b8", name: "Week 3 Weekdays" },
];

const ALL_GROUPS = [...WEEKENDS, ...WEEKDAY_GROUPS];

const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MAY_START_DOW = 5;
const MAIN_TABS = ["📅 Planner","💰 Budget"];

const LABEL_OPTIONS = ["Solo","With Friends","Family","Date","Self-Care","Party","Travel","Culture","Food","Outdoor"];
const LABEL_COLORS = {
  "Solo":"#6366f1","With Friends":"#f59e0b","Family":"#10b981","Date":"#f43f5e",
  "Self-Care":"#8b5cf6","Party":"#ef4444","Travel":"#0ea5e9","Culture":"#d97706","Food":"#84cc16","Outdoor":"#14b8a6"
};

function getDayOfWeek(day) { return (MAY_START_DOW + day - 1) % 7; }
function getGroupForDay(day) { return ALL_GROUPS.find(g => g.days.includes(day)); }
function getWeekendForDay(day) { return WEEKENDS.find(w => w.days.includes(day)); }
function isBirthday(day) { return day === 24; }
function parseCost(str) {
  if (!str) return 0;
  const m = str.match(/[\d,]+(\.\d+)?/);
  return m ? parseFloat(m[0].replace(",","")) : 0;
}

const mkDay = () => ({ activities: [], outfitNotes: "" });
const mkAct = () => ({ id: Date.now() + Math.random(), name:"", details:"", cost:"", location:"", address:"", label:"" });

function FInput({ value, onChange, placeholder }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"8px", padding:"8px 12px", color:"#e5e7eb", fontSize:"14px", fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} />
  );
}

function FTextarea({ value, onChange, placeholder }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={2}
      style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", padding:"10px 12px", color:"#e5e7eb", fontSize:"14px", fontFamily:"inherit", resize:"vertical", outline:"none", boxSizing:"border-box" }} />
  );
}

function ActivityCard({ act, color, isEditing, onEdit, onChange, onRemove }) {
  const fields = [
    { label:"🎉 Activity Name", field:"name", ph:"e.g. Rooftop Brunch, Kayaking..." },
    { label:"📝 Details", field:"details", ph:"Time, tickets, who's coming..." },
    { label:"💰 Estimated Cost", field:"cost", ph:"e.g. $45/person, Free, TBD..." },
    { label:"📍 Venue / Location", field:"location", ph:"Venue name or area..." },
    { label:"🗺️ Address", field:"address", ph:"Full street address..." },
  ];
  return (
    <div style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${color}30`, borderRadius:"12px", padding:"14px", marginBottom:"10px" }}>
      {!isEditing ? (
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"8px" }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:"600", fontSize:"15px", color:"#f3f4f6", marginBottom:"4px" }}>
              {act.name || <span style={{ color:"#6b7280", fontStyle:"italic" }}>Untitled activity</span>}
            </div>
            {act.label && (
              <span style={{ fontSize:"11px", padding:"2px 10px", borderRadius:"10px", background:(LABEL_COLORS[act.label]||"#6366f1")+"33", color:LABEL_COLORS[act.label]||"#a78bfa", fontWeight:"700", display:"inline-block", marginBottom:"4px" }}>
                {act.label}
              </span>
            )}
            {act.details && <div style={{ fontSize:"13px", color:"#c4b5fd", marginTop:"3px" }}>📝 {act.details}</div>}
            {act.location && <div style={{ fontSize:"13px", color:"#9ca3af", marginTop:"3px" }}>📍 {act.location}{act.address ? ` — ${act.address}` : ""}</div>}
            {act.cost && <div style={{ fontSize:"13px", color:"#86efac", marginTop:"3px" }}>💰 {act.cost}</div>}
          </div>
          <div style={{ display:"flex", gap:"6px", flexShrink:0 }}>
            <button onClick={onEdit} style={{ background:`${color}22`, border:"none", borderRadius:"8px", padding:"7px 12px", color:color, cursor:"pointer", fontSize:"13px", fontWeight:"600" }}>Edit</button>
            <button onClick={onRemove} style={{ background:"rgba(239,68,68,0.12)", border:"none", borderRadius:"8px", padding:"7px 12px", color:"#f87171", cursor:"pointer", fontSize:"13px" }}>✕</button>
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:"11px", color:color, fontWeight:"700", letterSpacing:"1px", textTransform:"uppercase" }}>Editing Activity</span>
            <button onClick={onEdit} style={{ background:"none", border:"none", color:"#86efac", cursor:"pointer", fontSize:"14px", fontWeight:"700" }}>Done ✓</button>
          </div>
          {fields.map(({ label, field, ph }) => (
            <div key={field}>
              <div style={{ fontSize:"10px", color:"#9ca3af", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"4px" }}>{label}</div>
              <FInput value={act[field]} onChange={val => onChange({ [field]: val })} placeholder={ph} />
            </div>
          ))}
          <div>
            <div style={{ fontSize:"10px", color:"#9ca3af", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"6px" }}>🏷️ Label</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
              {LABEL_OPTIONS.map(l => (
                <button key={l} onClick={() => onChange({ label: act.label === l ? "" : l })}
                  style={{ padding:"5px 12px", borderRadius:"20px", border:"none", cursor:"pointer", background:act.label===l?(LABEL_COLORS[l]||"#6366f1"):"rgba(255,255,255,0.08)", color:act.label===l?"#fff":"#9ca3af", fontSize:"12px", fontWeight:"600" }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DayCard({ day, group, getDayData, addAct, updateAct, removeAct, editingAct, setEditingAct, updateDay }) {
  const dow = getDayOfWeek(day);
  const dayData = getDayData(day);
  const bd = isBirthday(day);
  const cardColor = bd ? "#ffd700" : group.color;
  const cardTextColor = bd ? "#2a1000" : group.textColor;

  return (
    <div id={`dc-${day}`} style={{ background: bd ? "linear-gradient(135deg,#2d0a00,#0f0500)" : "rgba(255,255,255,0.04)", border: bd ? "2px solid #ffd700" : `1px solid ${group.color}28`, borderRadius:"18px", padding:"20px", marginBottom:"18px", boxShadow: bd ? "0 0 40px rgba(255,215,0,0.1)" : "none" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{ width:"54px", height:"54px", borderRadius:"13px", flexShrink:0, background: bd ? "linear-gradient(135deg,#ffd700,#ff8c00)" : group.color, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", boxShadow: bd ? "0 0 24px rgba(255,215,0,0.5)" : `0 4px 16px ${group.color}44` }}>
            <span style={{ fontSize: bd ? "22px" : "20px", fontWeight:"800", color: cardTextColor, lineHeight:1 }}>{bd ? "👑" : day}</span>
            <span style={{ fontSize:"10px", color: bd ? "#5a3000" : group.textColor, opacity:0.85, fontWeight:"600" }}>{bd ? "24" : DAY_NAMES[dow]}</span>
          </div>
          <div>
            <div style={{ fontWeight:"700", fontSize:"17px", color:"#f9fafb" }}>{bd ? "Your Birthday 👑" : `${DAY_NAMES[dow]}, May ${day}`}</div>
            <div style={{ fontSize:"13px", color: bd ? "#ffd700" : "#9ca3af" }}>{bd ? "Your day. Your rules." : `${dayData.activities.length} activit${dayData.activities.length===1?"y":"ies"}`}</div>
          </div>
        </div>
        <button onClick={() => addAct(day)}
          style={{ background: bd ? "linear-gradient(135deg,#ffd700,#ff8c00)" : group.color, color: cardTextColor, border:"none", borderRadius:"20px", padding:"9px 18px", fontSize:"13px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit", flexShrink:0 }}>
          + Add
        </button>
      </div>

      {dayData.activities.length === 0 && (
        <div style={{ textAlign:"center", padding:"20px", color: bd ? "rgba(255,215,0,0.4)" : "#4b5563", fontSize:"14px", fontStyle:"italic" }}>
          {bd ? "What does your perfect birthday look like? ✨" : "Nothing planned yet. The canvas is blank ✨"}
        </div>
      )}

      {dayData.activities.map(act => (
        <ActivityCard key={act.id} act={act} color={cardColor}
          isEditing={editingAct === act.id}
          onEdit={() => setEditingAct(editingAct === act.id ? null : act.id)}
          onChange={u => updateAct(day, act.id, u)}
          onRemove={() => removeAct(day, act.id)}
        />
      ))}

      <div style={{ marginTop:"14px" }}>
        <div style={{ fontSize:"10px", color:"#9ca3af", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:"6px" }}>👗 Outfit / Dress Code Ideas</div>
        <FTextarea value={dayData.outfitNotes} onChange={val => updateDay(day, { outfitNotes: val })} placeholder={bd ? "The birthday fit. Make it legendary..." : "Vibe, colors, accessories, dress code..."} />
      </div>
    </div>
  );
}

function BudgetTab({ data, budget, onBudgetChange }) {
  const allActs = [];
  let grandTotal = 0;
  for (let day = 1; day <= 31; day++) {
    const group = getGroupForDay(day);
    (data[day]?.activities || []).forEach(act => {
      const c = parseCost(act.cost);
      if (c > 0) { allActs.push({ ...act, day, group, c }); grandTotal += c; }
    });
  }
  const totalBudget = parseFloat(budget.total) || 0;
  const remaining = totalBudget - grandTotal;
  const pct = totalBudget > 0 ? Math.min((grandTotal / totalBudget) * 100, 100) : 0;
  const over = totalBudget > 0 && grandTotal > totalBudget;

  return (
    <div>
      <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"18px", padding:"20px", marginBottom:"20px" }}>
        <div style={{ fontSize:"11px", color:"#a78bfa", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"14px", fontWeight:"700" }}>May Budget Overview</div>
        <div style={{ marginBottom:"16px" }}>
          <div style={{ fontSize:"10px", color:"#9ca3af", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"6px" }}>Total Birthday Month Budget</div>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <span style={{ color:"#86efac", fontWeight:"700", fontSize:"22px" }}>$</span>
            <input type="number" value={budget.total} onChange={e => onBudgetChange({ total: e.target.value })} placeholder="0.00"
              style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"10px", padding:"10px 14px", color:"#86efac", fontSize:"22px", fontFamily:"inherit", outline:"none", width:"170px", fontWeight:"700" }} />
          </div>
        </div>
        {totalBudget > 0 ? (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
              <span style={{ fontSize:"13px", color:"#9ca3af" }}>Spent: <strong style={{ color: over?"#f87171":"#86efac" }}>${grandTotal.toFixed(2)}</strong></span>
              <span style={{ fontSize:"13px", color:"#9ca3af" }}>{over?"Over by:":"Remaining:"} <strong style={{ color: over?"#f87171":"#c4b5fd" }}>${Math.abs(remaining).toFixed(2)}</strong></span>
            </div>
            <div style={{ height:"12px", borderRadius:"10px", background:"rgba(255,255,255,0.1)", overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct}%`, borderRadius:"10px", background: over?"linear-gradient(90deg,#f87171,#ef4444)":"linear-gradient(90deg,#86efac,#34d399)", transition:"width 0.4s" }} />
            </div>
            {over && <div style={{ fontSize:"12px", color:"#f87171", marginTop:"8px", fontWeight:"600" }}>⚠️ Over budget! Time to prioritize, queen.</div>}
          </div>
        ) : (
          <div style={{ fontSize:"13px", color:"#6b7280", fontStyle:"italic" }}>Set a total budget above to track your spending.</div>
        )}
      </div>

      <div style={{ marginBottom:"20px" }}>
        <div style={{ fontSize:"11px", color:"#a78bfa", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"14px", fontWeight:"700" }}>By Weekend</div>
        {WEEKENDS.map(we => {
          const weActs = allActs.filter(a => a.group && a.group.id === we.id);
          const weTotal = weActs.reduce((s,a) => s+a.c, 0);
          const weBudget = parseFloat(budget[`we${we.id}`]) || 0;
          const weOver = weBudget > 0 && weTotal > weBudget;
          const wePct = weBudget > 0 ? Math.min((weTotal/weBudget)*100,100) : 0;
          return (
            <div key={we.id} style={{ background:`${we.color}10`, border:`1px solid ${we.color}30`, borderRadius:"14px", padding:"16px", marginBottom:"12px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                  <div style={{ width:"10px", height:"10px", borderRadius:"3px", background:we.color }} />
                  <span style={{ fontWeight:"700", fontSize:"14px", color:we.color }}>{we.name}</span>
                  <span style={{ fontSize:"11px", color:"#6b7280" }}>May {we.days[0]}–{we.days[we.days.length-1]}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
                  <span style={{ fontSize:"11px", color:"#9ca3af" }}>$</span>
                  <input type="number" value={budget[`we${we.id}`]||""} onChange={e => onBudgetChange({ [`we${we.id}`]: e.target.value })} placeholder="Budget"
                    style={{ background:"rgba(255,255,255,0.07)", border:`1px solid ${we.color}40`, borderRadius:"8px", padding:"5px 8px", color:we.color, fontSize:"14px", fontFamily:"inherit", outline:"none", width:"90px", fontWeight:"700" }} />
                </div>
              </div>
              {weBudget > 0 && (
                <div style={{ marginBottom:"8px" }}>
                  <div style={{ height:"6px", borderRadius:"6px", background:"rgba(255,255,255,0.08)", overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${wePct}%`, borderRadius:"6px", background:weOver?"#ef4444":we.color, transition:"width 0.4s" }} />
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:"4px" }}>
                    <span style={{ fontSize:"11px", color:"#9ca3af" }}>Spent: <strong style={{ color:weOver?"#f87171":"#86efac" }}>${weTotal.toFixed(2)}</strong></span>
                    <span style={{ fontSize:"11px", color:"#9ca3af" }}>{weOver?"Over":"Left"}: <strong style={{ color:weOver?"#f87171":"#c4b5fd" }}>${Math.abs(weBudget-weTotal).toFixed(2)}</strong></span>
                  </div>
                </div>
              )}
              {weActs.length === 0 ? (
                <div style={{ fontSize:"13px", color:"#4b5563", fontStyle:"italic" }}>No priced activities yet</div>
              ) : (
                <div>
                  {weActs.map(act => (
                    <div key={act.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                      <div>
                        <span style={{ fontSize:"13px", color:"#e5e7eb" }}>{act.name||"Untitled"}</span>
                        <span style={{ fontSize:"11px", color:"#6b7280", marginLeft:"6px" }}>May {act.day}</span>
                      </div>
                      <span style={{ fontSize:"13px", color:"#86efac", fontWeight:"600" }}>${act.c.toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ display:"flex", justifyContent:"space-between", paddingTop:"8px" }}>
                    <span style={{ fontSize:"13px", color:"#9ca3af", fontWeight:"600" }}>Weekend Total</span>
                    <span style={{ fontSize:"14px", color:weOver?"#f87171":"#86efac", fontWeight:"700" }}>${weTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ background:"linear-gradient(135deg,rgba(124,58,237,0.2),rgba(196,30,58,0.2))", border:"1px solid rgba(167,139,250,0.3)", borderRadius:"14px", padding:"18px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:"11px", color:"#a78bfa", letterSpacing:"1.5px", textTransform:"uppercase", fontWeight:"700" }}>Total Estimated Spend</div>
          {grandTotal === 0 && <div style={{ fontSize:"12px", color:"#6b7280", fontStyle:"italic", marginTop:"2px" }}>Add costs in the Planner tab</div>}
        </div>
        <div style={{ fontSize:"32px", fontWeight:"800", color: over?"#f87171":"#86efac" }}>${grandTotal.toFixed(2)}</div>
      </div>
    </div>
  );
}

function App() {
  const [data, setData] = useState(() => { try { const s=localStorage.getItem("erica-bday-2026"); return s?JSON.parse(s):{}; } catch { return {}; } });
  const [budget, setBudget] = useState(() => { try { const s=localStorage.getItem("erica-budget-2026"); return s?JSON.parse(s):{ total:"" }; } catch { return { total:"" }; } });
  const [mainTab, setMainTab] = useState(0);
  const [activeGroup, setActiveGroup] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);
  const [editingAct, setEditingAct] = useState(null);
  const [calOpen, setCalOpen] = useState(true);

  useEffect(() => { try { localStorage.setItem("erica-bday-2026", JSON.stringify(data)); } catch {} }, [data]);
  useEffect(() => { try { localStorage.setItem("erica-budget-2026", JSON.stringify(budget)); } catch {} }, [budget]);

  const getDayData = day => data[day] || mkDay();
  const updateDay = (day, u) => setData(p => ({ ...p, [day]: { ...getDayData(day), ...u } }));
  const addAct = day => { const a=mkAct(); updateDay(day,{ activities:[...getDayData(day).activities,a] }); setEditingAct(a.id); };
  const updateAct = (day,id,u) => updateDay(day,{ activities:getDayData(day).activities.map(a=>a.id===id?{...a,...u}:a) });
  const removeAct = (day,id) => { updateDay(day,{ activities:getDayData(day).activities.filter(a=>a.id!==id) }); if(editingAct===id)setEditingAct(null); };

  const currentGroup = ALL_GROUPS[activeGroup];
  const cells = [...Array(MAY_START_DOW).fill(null), ...Array.from({length:31},(_,i)=>i+1)];

  let totalSpend = 0;
  Object.values(data).forEach(d => (d?.activities||[]).forEach(a => { totalSpend += parseCost(a.cost); }));

  const handleCalClick = day => {
    const g = getGroupForDay(day);
    if (g) {
      setActiveGroup(ALL_GROUPS.indexOf(g));
      setSelectedDay(day);
      setMainTab(0);
      setTimeout(() => document.getElementById(`dc-${day}`)?.scrollIntoView({ behavior:"smooth", block:"center" }), 150);
    } else {
      setSelectedDay(day);
    }
  };

  return (
    <div style={{ minHeight:"100vh" }}>
      {/* HEADER */}
      <div style={{ textAlign:"center", padding:"44px 20px 24px" }}>
        <div style={{ fontSize:"11px", letterSpacing:"5px", color:"#a78bfa", textTransform:"uppercase", marginBottom:"10px" }}>May 2026</div>
        <h1 style={{ fontSize:"clamp(24px,7vw,52px)", fontWeight:"700", margin:"0 0 6px", background:"linear-gradient(90deg,#F5C518 0%,#F472B6 33%,#C41E3A 66%,#7C3AED 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", letterSpacing:"-0.5px", lineHeight:1.1 }}>
          Erica's Birthday Month
        </h1>
        <p style={{ color:"#c4b5fd", fontSize:"15px", margin:"0 0 14px", fontStyle:"italic" }}>Your kingdom, your calendar 👑</p>
        {totalSpend > 0 && (
          <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(134,239,172,0.1)", border:"1px solid rgba(134,239,172,0.25)", borderRadius:"20px", padding:"6px 18px" }}>
            <span style={{ fontSize:"13px", color:"#9ca3af" }}>Month spend so far:</span>
            <span style={{ fontSize:"15px", color:"#86efac", fontWeight:"700" }}>${totalSpend.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* MAIN TABS */}
      <div style={{ maxWidth:"800px", margin:"0 auto 20px", padding:"0 16px" }}>
        <div style={{ display:"flex", gap:"4px", background:"rgba(255,255,255,0.05)", borderRadius:"30px", padding:"4px" }}>
          {MAIN_TABS.map((t,i) => (
            <button key={t} onClick={() => setMainTab(i)}
              style={{ flex:1, padding:"11px", borderRadius:"26px", border:"none", cursor:"pointer", background:mainTab===i?"linear-gradient(135deg,#7C3AED,#C41E3A)":"transparent", color:mainTab===i?"#fff":"#9ca3af", fontWeight:"700", fontSize:"14px", fontFamily:"inherit", transition:"all 0.2s" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:"800px", margin:"0 auto", padding:"0 16px" }}>
        {mainTab === 0 && (
          <div>
            {/* CALENDAR */}
            <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:"20px", padding:"20px", border:"1px solid rgba(255,255,255,0.08)", marginBottom:"24px" }}>
              <div onClick={() => setCalOpen(!calOpen)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", marginBottom:calOpen?"16px":"0" }}>
                <span style={{ fontWeight:"600", fontSize:"14px", letterSpacing:"2px", color:"#e2d9f3", textTransform:"uppercase" }}>May 2026 Calendar</span>
                <span style={{ color:"#a78bfa", fontSize:"18px" }}>{calOpen?"▲":"▼"}</span>
              </div>
              {calOpen && (
                <div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"4px", marginBottom:"6px" }}>
                    {DAY_NAMES.map(d => <div key={d} style={{ textAlign:"center", fontSize:"11px", color:"#6b7280", fontWeight:"700", padding:"4px 0" }}>{d}</div>)}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"4px" }}>
                    {cells.map((day,i) => {
                      if (!day) return <div key={`e${i}`} />;
                      const g = getGroupForDay(day);
                      const we = getWeekendForDay(day);
                      const sel = selectedDay === day;
                      const bd = isBirthday(day);
                      const hasA = getDayData(day).activities.length > 0;
                      const displayColor = bd ? "#ffd700" : we ? we.color : g ? "#64748b" : null;
                      const selTextColor = we ? we.textColor : "#fff";
                      return (
                        <div key={day} onClick={() => handleCalClick(day)}
                          style={{ aspectRatio:"1", borderRadius:"8px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor: g ? "pointer" : "default", position:"relative", background: bd ? "linear-gradient(135deg,#ffd700,#ff8c00)" : g ? (sel ? (we ? we.color : "#64748b") : `${displayColor}28`) : "rgba(255,255,255,0.03)", border: bd ? "2px solid #ffd700" : sel ? `2px solid ${displayColor||"#fff"}` : "2px solid transparent", transform: sel ? "scale(1.1)" : "scale(1)", transition:"all 0.18s", boxShadow: bd ? "0 0 18px rgba(255,215,0,0.4)" : sel ? `0 0 12px ${displayColor}55` : "none" }}>
                          <span style={{ fontSize:"clamp(11px,2vw,14px)", fontWeight: bd?"900": g?"700":"400", color: bd?"#2a1000": g?(sel?selTextColor:displayColor):"#4b5563", lineHeight:1 }}>
                            {bd ? "👑" : day}
                          </span>
                          {bd && <span style={{ fontSize:"9px", color:"#2a1000", fontWeight:"800" }}>24</span>}
                          {hasA && <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:displayColor||"#fff", position:"absolute", bottom:"3px" }} />}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginTop:"16px" }}>
                    {WEEKENDS.map(w => (
                      <div key={w.id} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                        <div style={{ width:"11px", height:"11px", borderRadius:"3px", background:w.color }} />
                        <span style={{ fontSize:"11px", color:"#9ca3af" }}>{w.name}</span>
                      </div>
                    ))}
                    <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                      <div style={{ width:"11px", height:"11px", borderRadius:"3px", background:"#64748b" }} />
                      <span style={{ fontSize:"11px", color:"#9ca3af" }}>Weekdays</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* WEEKEND TABS */}
            <div style={{ fontSize:"10px", color:"#9ca3af", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"8px", fontWeight:"700" }}>Weekends</div>
            <div style={{ display:"flex", gap:"6px", overflowX:"auto", paddingBottom:"6px", marginBottom:"16px" }}>
              {WEEKENDS.map((w,i) => (
                <button key={w.id} onClick={() => { setActiveGroup(i); setSelectedDay(null); }}
                  style={{ padding:"10px 16px", borderRadius:"30px", border:"none", cursor:"pointer", background:activeGroup===i?w.color:"rgba(255,255,255,0.07)", color:activeGroup===i?w.textColor:"#9ca3af", fontWeight:"700", fontSize:"12px", whiteSpace:"nowrap", fontFamily:"inherit", boxShadow:activeGroup===i?`0 4px 24px ${w.color}55`:"none", transition:"all 0.2s" }}>
                  {w.label}
                </button>
              ))}
            </div>

            {/* WEEKDAY TABS */}
            <div style={{ fontSize:"10px", color:"#9ca3af", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"8px", fontWeight:"700" }}>Weekdays</div>
            <div style={{ display:"flex", gap:"6px", overflowX:"auto", paddingBottom:"6px", marginBottom:"20px" }}>
              {WEEKDAY_GROUPS.map((g,i) => {
                const idx = WEEKENDS.length + i;
                return (
                  <button key={g.id} onClick={() => { setActiveGroup(idx); setSelectedDay(null); }}
                    style={{ padding:"10px 16px", borderRadius:"30px", border:"none", cursor:"pointer", background:activeGroup===idx?"#64748b":"rgba(255,255,255,0.07)", color:activeGroup===idx?"#fff":"#9ca3af", fontWeight:"700", fontSize:"12px", whiteSpace:"nowrap", fontFamily:"inherit", transition:"all 0.2s" }}>
                    {g.label}
                  </button>
                );
              })}
            </div>

            {/* CURRENT GROUP BANNER */}
            <div style={{ background:`linear-gradient(135deg,${currentGroup.color}1a,${currentGroup.accent}0d)`, border:`1px solid ${currentGroup.color}40`, borderRadius:"14px", padding:"14px 18px", marginBottom:"20px", display:"flex", alignItems:"center", gap:"12px" }}>
              <div style={{ width:"14px", height:"14px", borderRadius:"4px", background:currentGroup.color, flexShrink:0 }} />
              <div>
                <div style={{ fontWeight:"700", fontSize:"17px", color:currentGroup.color }}>{currentGroup.name}</div>
                <div style={{ fontSize:"12px", color:"#9ca3af" }}>May {currentGroup.days[0]}–{currentGroup.days[currentGroup.days.length-1]}, 2026</div>
              </div>
            </div>

            {/* DAY CARDS */}
            {currentGroup.days.map(day => (
              <DayCard key={day} day={day} group={currentGroup}
                getDayData={getDayData} addAct={addAct} updateAct={updateAct}
                removeAct={removeAct} editingAct={editingAct}
                setEditingAct={setEditingAct} updateDay={updateDay}
              />
            ))}
          </div>
        )}

        {mainTab === 1 && (
          <BudgetTab data={data} budget={budget} onBudgetChange={u => setBudget(p => ({ ...p, ...u }))} />
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
