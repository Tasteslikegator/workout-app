import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const LIGHT = {
  bg: "#FDF8F4", card: "#FFFFFF", accent: "#E8826A", accentLight: "#FDEEE9",
  accentDark: "#C4634E", green: "#6BBF8E", greenLight: "#E8F7EE",
  blue: "#7EB8D4", blueLight: "#E8F4FA", purple: "#A89BC8", purpleLight: "#F0EDF8",
  text: "#2C2420", textMid: "#6B5A54", textLight: "#A89490", border: "#EDE5E0",
  inputBg: "#f8f5f3", navBg: "#FFFFFF", cardAlt: "#faf7f5",
};
const DARK = {
  bg: "#161318", card: "#231F27", accent: "#E8826A", accentLight: "#3A2420",
  accentDark: "#C4634E", green: "#6BBF8E", greenLight: "#1A3028",
  blue: "#7EB8D4", blueLight: "#1A2D38", purple: "#A89BC8", purpleLight: "#27213A",
  text: "#F5EEE8", textMid: "#C4B0A8", textLight: "#7A6A64", border: "#332B30",
  inputBg: "#2C2630", navBg: "#1E1A22", cardAlt: "#2A2530",
};

const MUSCLE_COLOR = {
  "Chest": "#E8826A", "Back": "#7EB8D4", "Legs": "#6BBF8E", "Shoulders": "#A89BC8",
  "Biceps": "#F0C87A", "Triceps": "#E88FA0", "Core": "#84C9C0", "Calves": "#B8D47E",
  "Hamstrings": "#C4A882", "Cardio": "#E8826A", "Full Body": "#A89BC8", "Glutes": "#E8B4D0",
};
const MUSCLES = Object.keys(MUSCLE_COLOR);

const PLAN_COLORS = [
  { bg: "#FDEEE9", tag: "#E8826A" }, { bg: "#F0EDF8", tag: "#A89BC8" },
  { bg: "#E8F7EE", tag: "#6BBF8E" }, { bg: "#E8F4FA", tag: "#7EB8D4" },
  { bg: "#FFF8E8", tag: "#D4A840" }, { bg: "#F8E8F0", tag: "#C870A0" },
];
const PLAN_EMOJIS = ["💪","🔥","⚡","🏋️","🌟","🎯","🚀","🦁","🌊","🏆","✨","🌺"];

const uid = () => Math.random().toString(36).slice(2, 9);

const DEFAULT_PLANS = [
  {
    id: "p1", name: "Full Body Strength", emoji: "💪", tag: "3x/week",
    color: PLAN_COLORS[0].bg, tagColor: PLAN_COLORS[0].tag,
    days: [
      { id: "d1a", name: "Day A", exercises: [
        { id: "e1", name: "Squat", sets: 3, reps: "5", muscle: "Legs" },
        { id: "e2", name: "Bench Press", sets: 3, reps: "5", muscle: "Chest" },
        { id: "e3", name: "Barbell Row", sets: 3, reps: "5", muscle: "Back" },
      ]},
      { id: "d1b", name: "Day B", exercises: [
        { id: "e4", name: "Squat", sets: 3, reps: "5", muscle: "Legs" },
        { id: "e5", name: "Overhead Press", sets: 3, reps: "5", muscle: "Shoulders" },
        { id: "e6", name: "Deadlift", sets: 1, reps: "5", muscle: "Back" },
      ]},
    ]
  },
  {
    id: "p2", name: "Push / Pull / Legs", emoji: "🔥", tag: "6x/week",
    color: PLAN_COLORS[1].bg, tagColor: PLAN_COLORS[1].tag,
    days: [
      { id: "d2a", name: "Push", exercises: [
        { id: "e7", name: "Bench Press", sets: 4, reps: "8-10", muscle: "Chest" },
        { id: "e8", name: "Overhead Press", sets: 3, reps: "8-10", muscle: "Shoulders" },
        { id: "e9", name: "Tricep Pushdown", sets: 3, reps: "12", muscle: "Triceps" },
      ]},
      { id: "d2b", name: "Pull", exercises: [
        { id: "e10", name: "Pull-ups", sets: 4, reps: "8", muscle: "Back" },
        { id: "e11", name: "Barbell Row", sets: 4, reps: "8-10", muscle: "Back" },
        { id: "e12", name: "Bicep Curl", sets: 3, reps: "12", muscle: "Biceps" },
      ]},
      { id: "d2c", name: "Legs", exercises: [
        { id: "e13", name: "Squat", sets: 4, reps: "8-10", muscle: "Legs" },
        { id: "e14", name: "Romanian Deadlift", sets: 3, reps: "10", muscle: "Hamstrings" },
        { id: "e15", name: "Calf Raise", sets: 4, reps: "15", muscle: "Calves" },
      ]},
    ]
  },
  {
    id: "p3", name: "Upper / Lower Split", emoji: "🏋️", tag: "4x/week",
    color: PLAN_COLORS[3].bg, tagColor: PLAN_COLORS[3].tag,
    days: [
      { id: "d3a", name: "Upper A", exercises: [
        { id: "e16", name: "Bench Press", sets: 4, reps: "6-8", muscle: "Chest" },
        { id: "e17", name: "Pull-ups", sets: 4, reps: "6-8", muscle: "Back" },
        { id: "e18", name: "Overhead Press", sets: 3, reps: "8", muscle: "Shoulders" },
      ]},
      { id: "d3b", name: "Lower A", exercises: [
        { id: "e19", name: "Squat", sets: 4, reps: "6-8", muscle: "Legs" },
        { id: "e20", name: "Romanian Deadlift", sets: 3, reps: "10", muscle: "Hamstrings" },
        { id: "e21", name: "Leg Press", sets: 3, reps: "12", muscle: "Legs" },
      ]},
    ]
  },
];

const quotes = [
  "Every rep is a promise to yourself. 🌸",
  "Progress, not perfection. You've got this! ✨",
  "Strong is built one session at a time. 💫",
  "Your future self is cheering you on. 🌟",
  "Show up. That's already half the battle. 🌺",
];

function formatTime(s) {
  return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
}

// ── Modal shell ─────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, C=LIGHT }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return createPortal(
    <div
      onClick={onClose}
      style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(44,36,32,0.5)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}>
      <div
        onClick={e=>e.stopPropagation()}
        style={{ background:C.card, borderRadius:"24px", width:"100%", maxWidth:430, maxHeight:"80vh", overflowY:"auto", padding:"24px 20px 32px", WebkitOverflowScrolling:"touch" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ fontSize:18, fontWeight:900, color:C.text, fontFamily:"Playfair Display" }}>{title}</div>
          <button onClick={onClose} style={{ background:C.border, borderRadius:20, width:36, height:36, fontSize:20, color:C.textMid, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>×</button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

function InputField({ label, value, onChange, placeholder, type="text", C=LIGHT }) {
  return (
    <div style={{ marginBottom:12 }}>
      {label && <div style={{ fontSize:11, fontWeight:700, color:C.textLight, textTransform:"uppercase", letterSpacing:.8, marginBottom:5 }}>{label}</div>}
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} type={type}
        style={{ width:"100%", background:C.inputBg, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"10px 12px", fontSize:14, fontFamily:"Nunito", fontWeight:600, color:C.text }} />
    </div>
  );
}

// ── Exercise modal ───────────────────────────────────────────────────────────
function ExerciseModal({ exercise, onSave, onClose, C=LIGHT }) {
  const [name, setName] = useState(exercise?.name || "");
  const [sets, setSets] = useState(String(exercise?.sets || "3"));
  const [reps, setReps] = useState(exercise?.reps || "10");
  const [muscle, setMuscle] = useState(exercise?.muscle || "Chest");
  return (
    <Modal title={exercise ? "Edit Exercise" : "Add Exercise"} onClose={onClose} C={C}>
      <InputField label="Exercise Name" C={C} value={name} onChange={setName} placeholder="e.g. Bench Press" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
        <InputField label="Sets" C={C} value={sets} onChange={setSets} type="number" placeholder="3" />
        <InputField label="Reps / Duration" C={C} value={reps} onChange={setReps} placeholder="10 or 30s" />
      </div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.textLight, textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Muscle Group</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {MUSCLES.map(m => (
            <button key={m} onClick={()=>setMuscle(m)} style={{ background:muscle===m?(MUSCLE_COLOR[m]||C.accent):"#f0ebe8", color:muscle===m?"#fff":C.textMid, borderRadius:20, padding:"5px 12px", fontSize:12, fontWeight:700, fontFamily:"Nunito", border:"none", cursor:"pointer" }}>{m}</button>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={()=>{ if(name.trim()) onSave({ name:name.trim(), sets:parseInt(sets)||3, reps:reps||"10", muscle }); }} style={{ background:"linear-gradient(135deg,#E8826A,#C4634E)", color:"#fff", borderRadius:12, padding:"12px 22px", fontSize:14, fontWeight:800, fontFamily:"Nunito", boxShadow:"0 3px 12px rgba(232,130,106,.35)" }}>Save Exercise</button>
        <button onClick={onClose} style={{ background:C.border, color:C.textMid, borderRadius:12, padding:"12px 18px", fontSize:14, fontWeight:800, fontFamily:"Nunito" }}>Cancel</button>
      </div>
    </Modal>
  );
}

// ── Day modal ────────────────────────────────────────────────────────────────
function DayModal({ day, onSave, onClose, C=LIGHT }) {
  const [name, setName] = useState(day?.name || "");
  return (
    <Modal title={day ? "Rename Day" : "Add Workout Day"} onClose={onClose} C={C}>
      <InputField label="Day Name" C={C} value={name} onChange={setName} placeholder="e.g. Push Day, Day A, Chest & Back" />
      <div style={{ display:"flex", gap:10, marginTop:8 }}>
        <button onClick={()=>{ if(name.trim()) onSave(name.trim()); }} style={{ background:"linear-gradient(135deg,#E8826A,#C4634E)", color:"#fff", borderRadius:12, padding:"12px 22px", fontSize:14, fontWeight:800, fontFamily:"Nunito" }}>Save</button>
        <button onClick={onClose} style={{ background:C.border, color:C.textMid, borderRadius:12, padding:"12px 18px", fontSize:14, fontWeight:800, fontFamily:"Nunito" }}>Cancel</button>
      </div>
    </Modal>
  );
}

// ── Plan modal ───────────────────────────────────────────────────────────────
function PlanModal({ plan, onSave, onClose, C=LIGHT }) {
  const initColorIdx = plan ? Math.max(0, PLAN_COLORS.findIndex(c=>c.bg===plan.color)) : 0;
  const [name, setName] = useState(plan?.name || "");
  const [tag, setTag] = useState(plan?.tag || "");
  const [emoji, setEmoji] = useState(plan?.emoji || "💪");
  const [colorIdx, setColorIdx] = useState(initColorIdx);
  return (
    <Modal title={plan ? "Edit Plan" : "Create New Plan"} onClose={onClose} C={C}>
      <InputField label="Plan Name" C={C} value={name} onChange={setName} placeholder="e.g. My Summer Shred" />
      <InputField label="Frequency Tag" C={C} value={tag} onChange={setTag} placeholder="e.g. 4x/week" />
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.textLight, textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Icon</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {PLAN_EMOJIS.map(e => (
            <button key={e} onClick={()=>setEmoji(e)} style={{ fontSize:22, background:emoji===e?C.accentLight:"#f0ebe8", borderRadius:10, width:42, height:42, border:emoji===e?`2px solid ${C.accent}`:"2px solid transparent", cursor:"pointer" }}>{e}</button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.textLight, textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Color</div>
        <div style={{ display:"flex", gap:10 }}>
          {PLAN_COLORS.map((c,i) => (
            <button key={i} onClick={()=>setColorIdx(i)} style={{ width:36, height:36, borderRadius:"50%", background:c.bg, border:colorIdx===i?`3px solid ${c.tag}`:"3px solid transparent", cursor:"pointer", boxShadow:colorIdx===i?`0 0 0 2px ${c.tag}55`:"none" }} />
          ))}
        </div>
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={()=>{ if(name.trim()) onSave({ name:name.trim(), tag:tag.trim()||"Custom", emoji, color:PLAN_COLORS[colorIdx].bg, tagColor:PLAN_COLORS[colorIdx].tag }); }} style={{ background:"linear-gradient(135deg,#E8826A,#C4634E)", color:"#fff", borderRadius:12, padding:"12px 22px", fontSize:14, fontWeight:800, fontFamily:"Nunito" }}>Save Plan</button>
        <button onClick={onClose} style={{ background:C.border, color:C.textMid, borderRadius:12, padding:"12px 18px", fontSize:14, fontWeight:800, fontFamily:"Nunito" }}>Cancel</button>
      </div>
    </Modal>
  );
}

// ── Exercise Progression Graph ───────────────────────────────────────────────
function ExerciseGraph({ exMap, exNames, COLORS, MUSCLE_COLOR }) {
  const [selEx, setSelEx] = useState(exNames[0]||"");
  const [metric, setMetric] = useState("maxWeight"); // maxWeight | volume | maxReps
  const [showDropdown, setShowDropdown] = useState(false);

  // Keep selEx valid if exNames changes
  const ex = exMap[selEx] || [];

  const metricLabel = { maxWeight:"Max Weight", volume:"Total Volume", maxReps:"Max Reps" };
  const metricUnit  = { maxWeight:"kg", volume:"kg×rep", maxReps:"reps" };

  if(!ex.length) return null;

  // SVG line chart
  const W=320, H=130, PAD={top:14,right:14,bottom:28,left:44};
  const chartW = W-PAD.left-PAD.right;
  const chartH = H-PAD.top-PAD.bottom;

  const vals = ex.map(p=>p[metric]);
  const minV = Math.min(...vals);
  const maxV = Math.max(...vals);
  const range = maxV-minV || 1;

  const pts = ex.map((p,i)=>({
    x: PAD.left + (ex.length===1 ? chartW/2 : (i/(ex.length-1))*chartW),
    y: PAD.top + chartH - ((p[metric]-minV)/range)*chartH,
    val: p[metric],
    date: p.date,
  }));

  const polyline = pts.map(p=>`${p.x},${p.y}`).join(" ");

  // Area fill path
  const areaPath = pts.length>1
    ? `M${pts[0].x},${PAD.top+chartH} `+pts.map(p=>`L${p.x},${p.y}`).join(" ")+` L${pts[pts.length-1].x},${PAD.top+chartH} Z`
    : "";

  // Y axis ticks
  const yTicks = 3;
  const yTickVals = Array.from({length:yTicks+1},(_,i)=>minV+(range/yTicks)*i);

  // Trend: up, down, flat
  const first=vals[0], last=vals[vals.length-1];
  const trend = last>first?"↑ Improving":last<first?"↓ Declining":"→ Steady";
  const trendColor = last>first?COLORS.green:last<first?"#C45050":COLORS.blue;
  const pct = first>0?Math.round(((last-first)/first)*100):0;

  return (
    <div style={{background:C.card,borderRadius:20,padding:18,marginBottom:16,boxShadow:"0 2px 14px rgba(0,0,0,.07)"}}>
      <div style={{fontWeight:900,fontSize:16,color:COLORS.text,marginBottom:14,fontFamily:"Playfair Display"}}>Exercise Progression</div>

      {/* Exercise selector */}
      <div style={{position:"relative",marginBottom:12}}>
        <button onClick={()=>setShowDropdown(v=>!v)}
          style={{width:"100%",background:C.inputBg,border:`1.5px solid ${COLORS.border}`,borderRadius:12,padding:"10px 14px",fontSize:14,fontFamily:"Nunito",fontWeight:700,color:COLORS.text,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
          <span>🏋️ {selEx||"Select exercise"}</span>
          <span style={{color:COLORS.textLight,fontSize:12}}>{showDropdown?"▲":"▼"}</span>
        </button>
        {showDropdown&&(
          <div style={{position:"absolute",top:"110%",left:0,right:0,background:C.card,borderRadius:14,boxShadow:"0 8px 28px rgba(0,0,0,.14)",zIndex:50,maxHeight:200,overflowY:"auto",border:`1px solid ${COLORS.border}`}}>
            {exNames.map(name=>(
              <button key={name} onClick={()=>{setSelEx(name);setShowDropdown(false);}}
                style={{width:"100%",padding:"10px 14px",fontSize:13,fontWeight:selEx===name?800:600,color:selEx===name?COLORS.accent:COLORS.text,background:selEx===name?COLORS.accentLight:"transparent",textAlign:"left",fontFamily:"Nunito",borderBottom:`1px solid ${COLORS.border}`,cursor:"pointer"}}>
                {name}
                <span style={{fontSize:11,color:COLORS.textLight,marginLeft:8}}>{exMap[name].length} session{exMap[name].length!==1?"s":""}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Metric tabs */}
      <div style={{display:"flex",background:COLORS.border,borderRadius:12,padding:3,marginBottom:16,gap:2}}>
        {Object.entries(metricLabel).map(([k,v])=>(
          <button key={k} onClick={()=>setMetric(k)}
            style={{flex:1,padding:"7px 4px",borderRadius:9,background:metric===k?"#fff":"transparent",color:metric===k?COLORS.accent:COLORS.textLight,fontWeight:800,fontSize:11,fontFamily:"Nunito",boxShadow:metric===k?"0 1px 6px rgba(0,0,0,.08)":"none",transition:"all .2s",cursor:"pointer"}}>
            {v}
          </button>
        ))}
      </div>

      {/* Trend summary */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div>
          <div style={{fontSize:24,fontWeight:900,color:COLORS.text,fontFamily:"Playfair Display"}}>
            {last%1===0?last:last.toFixed(1)} <span style={{fontSize:13,color:COLORS.textLight,fontWeight:600}}>{metricUnit[metric]}</span>
          </div>
          <div style={{fontSize:12,color:COLORS.textLight,marginTop:1}}>Latest · {ex[ex.length-1]?.date}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:14,fontWeight:800,color:trendColor}}>{trend}</div>
          {ex.length>1&&<div style={{fontSize:12,color:COLORS.textLight,marginTop:1}}>{pct>0?"+":""}{pct}% from start</div>}
        </div>
      </div>

      {/* SVG Chart */}
      {ex.length===1?(
        <div style={{background:COLORS.accentLight,borderRadius:12,padding:"16px",textAlign:"center",fontSize:13,color:COLORS.accent,fontWeight:700}}>
          Log this exercise in more sessions to see your trend! 🌱
        </div>
      ):(
        <div style={{overflowX:"auto"}}>
          <svg width={W} height={H} style={{display:"block",margin:"0 auto"}}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.accent} stopOpacity="0.25"/>
                <stop offset="100%" stopColor={COLORS.accent} stopOpacity="0.02"/>
              </linearGradient>
            </defs>
            {/* Grid lines */}
            {yTickVals.map((v,i)=>{
              const y=PAD.top+chartH-((v-minV)/range)*chartH;
              return <line key={i} x1={PAD.left} x2={W-PAD.right} y1={y} y2={y} stroke={COLORS.border} strokeWidth="1"/>;
            })}
            {/* Y labels */}
            {yTickVals.map((v,i)=>{
              const y=PAD.top+chartH-((v-minV)/range)*chartH;
              const label = v>=1000?`${(v/1000).toFixed(1)}k`:v%1===0?v:v.toFixed(1);
              return <text key={i} x={PAD.left-5} y={y+4} textAnchor="end" fontSize="9" fill={COLORS.textLight} fontFamily="Nunito">{label}</text>;
            })}
            {/* X labels */}
            {pts.map((p,i)=>{
              if(pts.length>6 && i%Math.ceil(pts.length/5)!==0 && i!==pts.length-1) return null;
              const short = p.date.replace(/[a-zA-Z]+ /,"").trim(); // just the day number
              return <text key={i} x={p.x} y={H-6} textAnchor="middle" fontSize="9" fill={COLORS.textLight} fontFamily="Nunito">{p.date.split(" ").slice(0,2).join(" ")}</text>;
            })}
            {/* Area */}
            {areaPath&&<path d={areaPath} fill="url(#areaGrad)"/>}
            {/* Line */}
            <polyline points={polyline} fill="none" stroke={COLORS.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Dots */}
            {pts.map((p,i)=>(
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="5" fill={COLORS.card} stroke={COLORS.accent} strokeWidth="2"/>
                {i===pts.length-1&&<circle cx={p.x} cy={p.y} r="4" fill={COLORS.accent}/>}
              </g>
            ))}
          </svg>
        </div>
      )}

      {/* Data table */}
      {ex.length>1&&(
        <div style={{marginTop:14,background:C.cardAlt,borderRadius:12,overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",padding:"7px 12px",borderBottom:`1px solid ${COLORS.border}`}}>
            {["Date","Max Wt","Volume","Max Reps"].map((h,i)=>(
              <div key={i} style={{fontSize:10,fontWeight:700,color:COLORS.textLight,textTransform:"uppercase"}}>{h}</div>
            ))}
          </div>
          {[...ex].reverse().slice(0,6).map((p,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",padding:"7px 12px",borderBottom:i<Math.min(ex.length,6)-1?`1px solid ${COLORS.border}`:"none",background:i===0?COLORS.accentLight:"transparent"}}>
              <div style={{fontSize:11,fontWeight:i===0?800:600,color:i===0?COLORS.accent:COLORS.textMid}}>{p.date}</div>
              <div style={{fontSize:11,fontWeight:600,color:COLORS.text}}>{p.maxWeight}kg</div>
              <div style={{fontSize:11,fontWeight:600,color:COLORS.text}}>{p.volume%1===0?p.volume:p.volume.toFixed(0)}</div>
              <div style={{fontSize:11,fontWeight:600,color:COLORS.text}}>{p.maxReps}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function WorkoutApp() {
  const [darkMode, setDarkMode] = useState(false);
  const C = darkMode ? DARK : LIGHT;
  const [tab, setTab] = useState("home");
  const [plans, setPlans] = useState(DEFAULT_PLANS);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);       // plan obj | "new" | null
  const [editingDay, setEditingDay] = useState(null);         // { planId, day|null }
  const [editingExercise, setEditingExercise] = useState(null); // { planId, dayId, ex|null }
  const [sessionLog, setSessionLog] = useState(null);
  const [weightUnit, setWeightUnit] = useState("kg"); // "kg" | "lbs"
  const [prevWeightUnit, setPrevWeightUnit] = useState("kg");
  const [completedSessions, setCompletedSessions] = useState([]);
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerValue, setTimerValue] = useState(90);
  const [stopwatch, setStopwatch] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [timerTab, setTimerTab] = useState("rest");
  const [quoteIdx] = useState(Math.floor(Math.random()*quotes.length));
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedCalDay, setSelectedCalDay] = useState(null);
  const timerRef = useRef(null);
  const swRef = useRef(null);

  useEffect(()=>{
    if(timerRunning){ timerRef.current=setInterval(()=>setTimerSeconds(s=>{ if(s<=1){clearInterval(timerRef.current);setTimerRunning(false);return 0;} return s-1; }),1000); }
    else clearInterval(timerRef.current);
    return ()=>clearInterval(timerRef.current);
  },[timerRunning]);

  useEffect(()=>{
    if(swRunning) swRef.current=setInterval(()=>setStopwatch(s=>s+1),1000);
    else clearInterval(swRef.current);
    return ()=>clearInterval(swRef.current);
  },[swRunning]);

  const selectedPlan = plans.find(p=>p.id===selectedPlanId)||null;

  // Plan CRUD
  const savePlan = (data) => {
    if(editingPlan==="new"){ setPlans(p=>[...p,{...data,id:uid(),days:[]}]); }
    else { setPlans(p=>p.map(pl=>pl.id===editingPlan.id?{...pl,...data}:pl)); }
    setEditingPlan(null);
  };
  const deletePlan = (id) => {
    if(!confirm("Delete this plan?")) return;
    setPlans(p=>p.filter(pl=>pl.id!==id));
    if(selectedPlanId===id) setSelectedPlanId(null);
  };

  // Day CRUD
  const saveDay = (name) => {
    const {planId,day}=editingDay;
    setPlans(p=>p.map(pl=>{
      if(pl.id!==planId) return pl;
      if(day) return {...pl,days:pl.days.map(d=>d.id===day.id?{...d,name}:d)};
      return {...pl,days:[...pl.days,{id:uid(),name,exercises:[]}]};
    }));
    setEditingDay(null);
  };
  const deleteDay = (planId,dayId) => {
    if(!confirm("Remove this day?")) return;
    setPlans(p=>p.map(pl=>pl.id!==planId?pl:{...pl,days:pl.days.filter(d=>d.id!==dayId)}));
  };

  // Exercise CRUD
  const saveExercise = (exData) => {
    const {planId,dayId,ex}=editingExercise;
    const mutate=days=>days.map(d=>{
      if(d.id!==dayId) return d;
      if(ex) return {...d,exercises:d.exercises.map(e=>e.id===ex.id?{...e,...exData}:e)};
      return {...d,exercises:[...d.exercises,{id:uid(),...exData}]};
    });
    setPlans(p=>p.map(pl=>pl.id!==planId?pl:{...pl,days:mutate(pl.days)}));
    setEditingExercise(null);
  };
  const deleteExercise = (planId,dayId,exId) => {
    setPlans(p=>p.map(pl=>pl.id!==planId?pl:{...pl,days:pl.days.map(d=>d.id!==dayId?d:{...d,exercises:d.exercises.filter(e=>e.id!==exId)})}));
  };
  const moveExercise = (planId,dayId,exId,dir) => {
    setPlans(p=>p.map(pl=>{
      if(pl.id!==planId) return pl;
      return {...pl,days:pl.days.map(d=>{
        if(d.id!==dayId) return d;
        const arr=[...d.exercises];
        const i=arr.findIndex(e=>e.id===exId);
        const j=i+dir;
        if(j<0||j>=arr.length) return d;
        [arr[i],arr[j]]=[arr[j],arr[i]];
        return {...d,exercises:arr};
      })};
    }));
  };

  // Session
  const startWorkout=(plan,day)=>{
    const log={};
    day.exercises.forEach(ex=>{ log[ex.id]=Array(ex.sets).fill(null).map(()=>({weight:"",reps:"",done:false})); });
    setSessionLog({plan,day,log,startTime:Date.now()});
    setTab("session");
  };
  const updateSet=(exId,idx,field,val)=>setSessionLog(prev=>({...prev,log:{...prev.log,[exId]:prev.log[exId].map((s,i)=>i===idx?{...s,[field]:val}:s)}}));
  const toggleSetDone=(exId,idx)=>setSessionLog(prev=>({...prev,log:{...prev.log,[exId]:prev.log[exId].map((s,i)=>i===idx?{...s,done:!s.done}:s)}}));
  const finishSession=()=>{
    const duration=Math.round((Date.now()-sessionLog.startTime)/60000);
    setCompletedSessions(prev=>[{...sessionLog,duration,date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})},...prev].slice(0,30));
    setSessionLog(null); setTab("home");
  };

  const totalSessions=completedSessions.length;
  const totalVolume=completedSessions.reduce((acc,s)=>{ Object.values(s.log).forEach(sets=>sets.forEach(set=>{ if(set.done&&set.weight&&set.reps) acc+=parseFloat(set.weight||0)*parseFloat(set.reps||0); })); return acc; },0);
  const weekSessions=completedSessions.filter(s=>(new Date()-new Date(s.date))/86400000<=7).length;
  const circumference=2*Math.PI*54;
  const timerPct=timerValue>0?(timerSeconds/timerValue)*100:0;

  const S = { // shared button styles
    primary: { background:"linear-gradient(135deg,#E8826A,#C4634E)", color:"#fff", boxShadow:"0 3px 12px rgba(232,130,106,.35)" },
    ghost: { background:C.accentLight, color:C.accent, border:`1.5px dashed ${C.accent}` },
    editBtn: { background:C.blueLight, color:C.blue, borderRadius:8, width:28, height:28, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center" },
    delBtn:  { background:"#FEE8E8", color:"#C45050", borderRadius:8, width:28, height:28, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center" },
  };

  return (
    <div style={{ fontFamily:"'Nunito','Georgia',sans-serif", background:C.bg, minHeight:"100vh", width:"100%", margin:"0 auto", paddingBottom:120, overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}button{cursor:pointer;border:none;outline:none}input{outline:none;border:none}::-webkit-scrollbar{width:0}html,body{height:100%;width:100%;overflow-x:hidden;background:#FDF8F4;}#root{width:100%;min-height:100vh;}
        .fade-in{animation:fi .3s ease}@keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        .pulse{animation:pu 2s infinite}@keyframes pu{0%,100%{opacity:1}50%{opacity:.5}}
      `}</style>

      {/* SESSION */}
      {tab==="session"&&sessionLog&&(()=>{
        const KG_TO_LBS = 2.20462;

        const handleUnitSwitch = (newUnit) => {
          if(newUnit === weightUnit) return;
          // Convert all already-entered weights to the new unit
          setSessionLog(prev => {
            const newLog = {};
            Object.entries(prev.log).forEach(([exId, sets]) => {
              newLog[exId] = sets.map(set => {
                const n = parseFloat(set.weight);
                if(!set.weight || set.weight==="" || isNaN(n)) return set;
                const converted = newUnit==="lbs"
                  ? parseFloat((n*KG_TO_LBS).toFixed(1))
                  : parseFloat((n/KG_TO_LBS).toFixed(2));
                return {...set, weight: String(converted)};
              });
            });
            return {...prev, log: newLog};
          });
          setPrevWeightUnit(weightUnit);
          setWeightUnit(newUnit);
        };

        const conversionHint = (val) => {
          const n = parseFloat(val);
          if(!val || val==="" || isNaN(n) || n===0) return null;
          if(weightUnit==="kg") return `${(n*KG_TO_LBS).toFixed(1)} lbs`;
          return `${(n/KG_TO_LBS).toFixed(1)} kg`;
        };

        return (
        <div className="fade-in" style={{paddingBottom:100}}>
          <div style={{background:"linear-gradient(135deg,#E8826A,#C4634E)",padding:"20px 20px 28px",color:"#fff"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <button onClick={()=>{if(confirm("End without saving?")){{setSessionLog(null);setTab("plans");}}}} style={{background:"rgba(255,255,255,.2)",color:"#fff",borderRadius:20,padding:"6px 14px",fontSize:13,fontFamily:"Nunito"}}>← Back</button>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {/* KG / LBS toggle */}
                <div style={{display:"flex",background:"rgba(255,255,255,.2)",borderRadius:20,padding:3,gap:2}}>
                  {["kg","lbs"].map(u=>(
                    <button key={u} onClick={()=>handleUnitSwitch(u)}
                      style={{background:weightUnit===u?"#fff":"transparent",color:weightUnit===u?C.accent:"#fff",borderRadius:16,padding:"4px 12px",fontSize:12,fontWeight:800,fontFamily:"Nunito",transition:"all .2s"}}>
                      {u.toUpperCase()}
                    </button>
                  ))}
                </div>
                <button onClick={finishSession} style={{background:C.card,color:C.accent,borderRadius:20,padding:"6px 16px",fontSize:13,fontWeight:800,fontFamily:"Nunito"}}>Finish ✓</button>
              </div>
            </div>
            <div style={{fontSize:22,fontWeight:900,fontFamily:"Playfair Display"}}>{sessionLog.day.name}</div>
            <div style={{fontSize:13,opacity:.85,marginTop:2}}>{sessionLog.plan.name}</div>
          </div>
          <div style={{padding:"16px 16px 0"}}>
            {sessionLog.day.exercises.map(ex=>{
              const sets=sessionLog.log[ex.id]||[];
              const done=sets.filter(s=>s.done).length;
              return (
                <div key={ex.id} style={{background:C.card,borderRadius:16,marginBottom:14,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
                  <div style={{padding:"14px 16px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.border}`}}>
                    <div>
                      <div style={{fontWeight:800,fontSize:16,color:C.text}}>{ex.name}</div>
                      <div style={{fontSize:12,color:C.textLight,marginTop:2,display:"flex",gap:8,alignItems:"center"}}>
                        <span style={{background:MUSCLE_COLOR[ex.muscle]||C.accent,color:"#fff",borderRadius:8,padding:"1px 8px",fontSize:11,fontWeight:700}}>{ex.muscle}</span>
                        <span>{ex.sets} sets × {ex.reps}</span>
                      </div>
                    </div>
                    <div style={{fontSize:13,color:done===sets.length?C.green:C.textLight,fontWeight:700}}>{done}/{sets.length}</div>
                  </div>
                  <div style={{padding:"8px 16px 12px"}}>
                    <div style={{display:"grid",gridTemplateColumns:"28px 1fr 1fr 36px",gap:6,marginBottom:4}}>
                      {["SET", weightUnit.toUpperCase(),"REPS",""].map((h,i)=><div key={i} style={{fontSize:10,color:C.textLight,fontWeight:700}}>{h}</div>)}
                    </div>
                    {sets.map((set,si)=>{
                      const hint = conversionHint(set.weight);
                      return (
                        <div key={si} style={{marginBottom:8}}>
                          <div style={{display:"grid",gridTemplateColumns:"28px 1fr 1fr 36px",gap:6,background:set.done?C.greenLight:"transparent",borderRadius:10,padding:"2px 0"}}>
                            <div style={{fontSize:13,color:C.textMid,fontWeight:700,paddingTop:9,textAlign:"center"}}>{si+1}</div>
                            <input
                              value={set.weight}
                              onChange={e=>updateSet(ex.id,si,"weight",e.target.value)}
                              placeholder="—"
                              type="number"
                              style={{background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:10,padding:"7px 10px",fontSize:14,fontFamily:"Nunito",fontWeight:600,color:C.text}}/>
                            <input
                              value={set.reps}
                              onChange={e=>updateSet(ex.id,si,"reps",e.target.value)}
                              placeholder="—"
                              type="number"
                              style={{background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:10,padding:"7px 10px",fontSize:14,fontFamily:"Nunito",fontWeight:600,color:C.text}}/>
                            <button onClick={()=>toggleSetDone(ex.id,si)} style={{background:set.done?C.green:"#f0ebe8",borderRadius:10,width:36,height:36,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>{set.done?"✓":""}</button>
                          </div>
                          {hint&&(
                            <div style={{paddingLeft:36,marginTop:2,fontSize:11,color:C.textLight,fontWeight:600}}>
                              = {hint}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <button onClick={finishSession} style={{width:"100%",background:"linear-gradient(135deg,#E8826A,#C4634E)",color:"#fff",borderRadius:16,padding:16,fontSize:16,fontWeight:800,fontFamily:"Nunito",boxShadow:"0 4px 16px rgba(232,130,106,.4)"}}>🎉 Complete Workout</button>
          </div>
        </div>
        );
      })()}

      {tab!=="session"&&(
        <>
          {/* HOME */}
          {tab==="home"&&(
            <div className="fade-in">
              <div style={{padding:"28px 20px 20px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <div style={{fontSize:13,color:C.textLight,fontWeight:600,letterSpacing:1,textTransform:"uppercase"}}>Good {new Date().getHours()<12?"Morning":new Date().getHours()<17?"Afternoon":"Evening"} 👋</div>
                  <button onClick={()=>setDarkMode(d=>!d)} style={{background:darkMode?"#2C2630":"#F0EBE8",borderRadius:20,padding:"6px 12px",fontSize:15,border:"none",cursor:"pointer",transition:"all .2s"}} title="Toggle dark mode">{darkMode?"☀️":"🌙"}</button>
                </div>
                <div style={{fontSize:28,fontWeight:900,color:C.text,fontFamily:"Playfair Display",lineHeight:1.2}}>Let's build something great today</div>
                <div style={{marginTop:14,background:"linear-gradient(135deg,#FFF0EB,#FFE4DC)",borderRadius:16,padding:"14px 18px",borderLeft:`4px solid ${C.accent}`}}>
                  <div style={{fontSize:14,color:C.textMid,fontStyle:"italic"}}>"{quotes[quoteIdx]}"</div>
                </div>
              </div>
              <div style={{padding:"0 20px 20px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                {[
                  {label:"Sessions",val:totalSessions,icon:"🏆",color:C.accentLight,accent:C.accent},
                  {label:"This Week",val:weekSessions,icon:"📅",color:C.purpleLight,accent:C.purple},
                  {label:"Volume",val:totalVolume>999?`${(totalVolume/1000).toFixed(1)}k`:totalVolume,icon:"📈",color:C.greenLight,accent:C.green},
                ].map((s,i)=>(
                  <div key={i} style={{background:s.color,borderRadius:16,padding:"14px 12px",textAlign:"center"}}>
                    <div style={{fontSize:22}}>{s.icon}</div>
                    <div style={{fontSize:22,fontWeight:900,color:s.accent,marginTop:2}}>{s.val}</div>
                    <div style={{fontSize:10,color:C.textMid,fontWeight:600,marginTop:2}}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{padding:"0 20px",maxWidth:800,margin:"0 auto"}}>
                <div style={{fontSize:18,fontWeight:900,color:C.text,marginBottom:12,fontFamily:"Playfair Display"}}>Recent Workouts</div>
                {completedSessions.length===0?(
                  <div style={{background:C.card,borderRadius:16,padding:24,textAlign:"center",color:C.textLight}}>
                    <div style={{fontSize:36,marginBottom:8}}>🌱</div>
                    <div style={{fontSize:15,fontWeight:700}}>No workouts yet</div>
                    <div style={{fontSize:13,marginTop:4}}>Head to Plans to start your first session!</div>
                  </div>
                ):completedSessions.slice(0,4).map((s,i)=>(
                  <div key={i} style={{background:C.card,borderRadius:14,padding:"14px 16px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 2px 10px rgba(0,0,0,.05)"}}>
                    <div>
                      <div style={{fontWeight:800,fontSize:15,color:C.text}}>{s.day.name}</div>
                      <div style={{fontSize:12,color:C.textLight,marginTop:2}}>{s.plan.name} · {s.date}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:13,fontWeight:700,color:C.green}}>✓ Done</div>
                      <div style={{fontSize:11,color:C.textLight}}>{s.duration}m</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PLANS LIST */}
          {tab==="plans"&&!selectedPlan&&(
            <div className="fade-in">
              <div style={{padding:"28px 20px 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                <div>
                  <div style={{fontSize:28,fontWeight:900,color:C.text,fontFamily:"Playfair Display"}}>My Plans</div>
                  <div style={{fontSize:14,color:C.textLight,marginTop:4}}>{plans.length} plan{plans.length!==1?"s":""}</div>
                </div>
                <button onClick={()=>setEditingPlan("new")} style={{...S.primary,borderRadius:14,padding:"10px 16px",fontSize:14,fontWeight:800,fontFamily:"Nunito"}}>+ New Plan</button>
              </div>
              <div style={{padding:"0 16px"}}>
                {plans.length===0&&(
                  <div style={{background:C.card,borderRadius:18,padding:28,textAlign:"center",color:C.textLight}}>
                    <div style={{fontSize:40,marginBottom:10}}>📋</div>
                    <div style={{fontSize:16,fontWeight:700}}>No plans yet</div>
                    <div style={{fontSize:13,marginTop:4}}>Tap "+ New Plan" to get started!</div>
                  </div>
                )}
                {plans.map(plan=>(
                  <div key={plan.id} style={{background:C.card,borderRadius:18,marginBottom:12,padding:18,boxShadow:"0 2px 14px rgba(0,0,0,.07)",cursor:"pointer",transition:"transform .15s"}}
                    onClick={()=>setSelectedPlanId(plan.id)}>
                    <div style={{display:"flex",alignItems:"center",gap:14}}>
                      <div style={{background:plan.color,borderRadius:14,width:52,height:52,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{plan.emoji}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:800,fontSize:17,color:C.text}}>{plan.name}</div>
                        <div style={{fontSize:12,color:plan.tagColor,fontWeight:700,marginTop:2}}>{plan.tag} · {plan.days.length} workout{plan.days.length!==1?"s":""}</div>
                      </div>
                      <div style={{display:"flex",gap:6}}>
                        <button onClick={e=>{e.stopPropagation();setEditingPlan(plan);}} style={{...S.editBtn,width:32,height:32}}>✏️</button>
                        <button onClick={e=>{e.stopPropagation();deletePlan(plan.id);}} style={{...S.delBtn,width:32,height:32}}>🗑</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PLAN DETAIL */}
          {tab==="plans"&&selectedPlan&&(
            <div className="fade-in">
              <div style={{background:`linear-gradient(135deg,${selectedPlan.color} 0%,${selectedPlan.color}99 100%)`,padding:"20px 20px 24px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <button onClick={()=>setSelectedPlanId(null)} style={{background:"rgba(255,255,255,.65)",color:C.textMid,borderRadius:20,padding:"6px 14px",fontSize:13,fontFamily:"Nunito",fontWeight:700}}>← Plans</button>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>setEditingPlan(selectedPlan)} style={{background:"rgba(255,255,255,.65)",color:C.blue,borderRadius:10,width:34,height:34,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✏️</button>
                    <button onClick={()=>setEditingDay({planId:selectedPlan.id,day:null})} style={{...S.primary,borderRadius:12,padding:"7px 14px",fontSize:13,fontWeight:800,fontFamily:"Nunito"}}>+ Day</button>
                  </div>
                </div>
                <div style={{fontSize:32,marginBottom:4}}>{selectedPlan.emoji}</div>
                <div style={{fontSize:24,fontWeight:900,color:C.text,fontFamily:"Playfair Display"}}>{selectedPlan.name}</div>
                <div style={{fontSize:13,color:selectedPlan.tagColor,fontWeight:700,marginTop:2}}>{selectedPlan.tag} · {selectedPlan.days.length} day{selectedPlan.days.length!==1?"s":""}</div>
              </div>
              <div style={{padding:"16px 16px 0"}}>
                {selectedPlan.days.length===0&&(
                  <div style={{background:C.card,borderRadius:16,padding:24,textAlign:"center",color:C.textLight}}>
                    <div style={{fontSize:32,marginBottom:8}}>📅</div>
                    <div style={{fontSize:15,fontWeight:700}}>No workout days yet</div>
                    <div style={{fontSize:13,marginTop:4}}>Tap "+ Day" above to add your first day</div>
                  </div>
                )}
                {selectedPlan.days.map(day=>(
                  <div key={day.id} style={{background:C.card,borderRadius:18,marginBottom:14,overflow:"hidden",boxShadow:"0 2px 14px rgba(0,0,0,.07)"}}>
                    {/* Day header */}
                    <div style={{padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.border}`}}>
                      <div style={{fontWeight:800,fontSize:16,color:C.text}}>
                        {day.name} <span style={{fontSize:12,color:C.textLight,fontWeight:600}}>· {day.exercises.length} exercise{day.exercises.length!==1?"s":""}</span>
                      </div>
                      <div style={{display:"flex",gap:6}}>
                        <button onClick={()=>setEditingDay({planId:selectedPlan.id,day})} style={S.editBtn}>✏️</button>
                        <button onClick={()=>deleteDay(selectedPlan.id,day.id)} style={S.delBtn}>🗑</button>
                      </div>
                    </div>
                    {/* Exercises */}
                    <div style={{padding:"10px 16px 14px"}}>
                      {day.exercises.length===0&&(
                        <div style={{fontSize:13,color:C.textLight,textAlign:"center",padding:"8px 0 10px"}}>No exercises yet — add one below!</div>
                      )}
                      {day.exercises.map((ex,ei)=>(
                        <div key={ex.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,maxHeight:200,overflow:"hidden"}}>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontWeight:700,fontSize:14,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ex.name}</div>
                            <div style={{display:"flex",gap:6,alignItems:"center",marginTop:2,flexWrap:"wrap"}}>
                              <span style={{background:MUSCLE_COLOR[ex.muscle]||C.accent,color:"#fff",borderRadius:6,padding:"1px 7px",fontSize:10,fontWeight:700,flexShrink:0}}>{ex.muscle}</span>
                              <span style={{fontSize:11,color:C.textLight}}>{ex.sets}×{ex.reps}</span>
                            </div>
                          </div>
                          <div style={{display:"flex",gap:4,flexShrink:0}}>
                            <button onClick={()=>moveExercise(selectedPlan.id,day.id,ex.id,-1)} style={{background:C.border,borderRadius:7,width:26,height:26,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",color:C.textMid}} title="Move up">↑</button>
                            <button onClick={()=>moveExercise(selectedPlan.id,day.id,ex.id,1)} style={{background:C.border,borderRadius:7,width:26,height:26,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",color:C.textMid}} title="Move down">↓</button>
                            <button onClick={()=>setEditingExercise({planId:selectedPlan.id,dayId:day.id,ex})} style={S.editBtn}>✏️</button>
                            <button onClick={()=>deleteExercise(selectedPlan.id,day.id,ex.id)} style={S.delBtn}>×</button>
                          </div>
                        </div>
                      ))}
                      <button onClick={()=>setEditingExercise({planId:selectedPlan.id,dayId:day.id,ex:null})} style={{width:"100%",marginTop:4,...S.ghost,borderRadius:12,padding:"9px",fontSize:13,fontWeight:800,fontFamily:"Nunito"}}>+ Add Exercise</button>
                    </div>
                    {day.exercises.length>0&&(
                      <div style={{padding:"0 16px 16px"}}>
                        <button onClick={()=>startWorkout(selectedPlan,day)} style={{width:"100%",...S.primary,borderRadius:14,padding:13,fontSize:15,fontWeight:800,fontFamily:"Nunito"}}>▶ Start {day.name}</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROGRESS */}
          {tab==="progress"&&(()=>{
            // ── Calendar helpers ──────────────────────────────────────────
            const calYear  = calendarDate.getFullYear();
            const calMonth = calendarDate.getMonth();
            const monthName = calendarDate.toLocaleString("default",{month:"long"});
            const firstDay = new Date(calYear, calMonth, 1).getDay(); // 0=Sun
            const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
            const today = new Date();

            // Map "MMM D" dates → sessions for fast lookup
            const sessionsByDate = {};
            completedSessions.forEach(s => {
              const key = s.date; // already "MMM D" format
              if(!sessionsByDate[key]) sessionsByDate[key] = [];
              sessionsByDate[key].push(s);
            });

            // Convert a cell date number → "MMM D" key
            const toKey = (d) => new Date(calYear,calMonth,d).toLocaleDateString("en-US",{month:"short",day:"numeric"});

            const prevMonth = () => setCalendarDate(new Date(calYear, calMonth-1, 1));
            const nextMonth = () => setCalendarDate(new Date(calYear, calMonth+1, 1));

            const isToday = (d) => today.getFullYear()===calYear && today.getMonth()===calMonth && today.getDate()===d;
            const isFuture = (d) => new Date(calYear,calMonth,d) > today;
            const selKey = selectedCalDay ? toKey(selectedCalDay) : null;
            const selSessions = selKey ? (sessionsByDate[selKey]||[]) : [];

            // Build streak
            let streak = 0;
            const check = new Date(today);
            while(true){
              const k = check.toLocaleDateString("en-US",{month:"short",day:"numeric"});
              if(sessionsByDate[k]&&sessionsByDate[k].length>0){ streak++; check.setDate(check.getDate()-1); }
              else break;
            }

            return (
            <div className="fade-in">
              <div style={{padding:"28px 20px 8px",marginTop:220}}>
                <div style={{fontSize:28,fontWeight:900,color:C.text,fontFamily:"Playfair Display"}}>Progress</div>
                <div style={{fontSize:14,color:C.textLight,marginTop:4}}>Track your journey</div>
              </div>
              <div style={{padding:"0 20px",maxWidth:800,margin:"0 auto"}}>

                {/* Stats */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8,maxHeight:200,overflow:"hidden"}}>
                  {[
                    {label:"Total Sessions",val:totalSessions,icon:"🏆",color:C.accentLight,accent:C.accent},
                    {label:"This Week",val:weekSessions,icon:"📅",color:C.purpleLight,accent:C.purple},
                    {label:"Total Volume",val:totalVolume>999?`${(totalVolume/1000).toFixed(1)}k`:totalVolume,icon:"📈",color:C.greenLight,accent:C.green},
                    {label:"🔥 Streak",val:`${streak}d`,icon:"",color:"#FFF3E0",accent:"#E07820"},
                  ].map((s,i)=>(
                    <div key={i} style={{background:s.color,borderRadius:16,padding:"10px 12px",textAlign:"center"}}>
                      {s.icon&&<div style={{fontSize:28}}>{s.icon}</div>}
                      <div style={{fontSize:s.icon?"":32,fontWeight:900,color:s.accent,marginTop:s.icon?4:0}}>{s.val}</div>
                      <div style={{fontSize:12,color:C.textMid,fontWeight:600,marginTop:2}}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* ── CALENDAR ─────────────────────────────────────────── */}
                <div style={{background:C.card,borderRadius:20,padding:18,marginBottom:16,boxShadow:"0 2px 14px rgba(0,0,0,.07)"}}>
                  {/* Month nav */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <button onClick={prevMonth} style={{background:C.border,borderRadius:10,width:32,height:32,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",color:C.textMid}}>‹</button>
                    <div style={{fontWeight:900,fontSize:17,color:C.text,fontFamily:"Playfair Display"}}>{monthName} {calYear}</div>
                    <button onClick={nextMonth} style={{background:C.border,borderRadius:10,width:32,height:32,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",color:C.textMid}}>›</button>
                  </div>
                  {/* Day-of-week headers */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:6,maxWidth:360,margin:"0 auto 6px"}}>
                    {["S","M","T","W","T","F","S"].map((d,i)=>(
                      <div key={i} style={{textAlign:"center",fontSize:11,fontWeight:700,color:C.textLight,paddingBottom:4}}>{d}</div>
                    ))}
                  </div>
                  {/* Calendar grid */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,maxWidth:360,margin:"0 auto"}}>
                    {/* Empty cells before month start */}
                    {Array(firstDay).fill(null).map((_,i)=><div key={`e${i}`}/>)}
                    {/* Day cells */}
                    {Array(daysInMonth).fill(null).map((_,i)=>{
                      const d = i+1;
                      const key = toKey(d);
                      const hasSessions = !!(sessionsByDate[key]?.length);
                      const sessCount = sessionsByDate[key]?.length || 0;
                      const isSelected = selectedCalDay===d;
                      const future = isFuture(d);
                      // Color intensity by session count
                      const dotColor = hasSessions
                        ? (sessCount>=2 ? C.accentDark : C.accent)
                        : null;
                      return (
                        <button key={d} onClick={()=>{ if(!future) setSelectedCalDay(isSelected?null:d); }}
                          style={{
                            aspectRatio:"1",
                            borderRadius:10,
                            background: isSelected ? C.accent
                              : hasSessions ? C.accentLight
                              : isToday(d) ? C.blueLight
                              : "transparent",
                            color: isSelected ? "#fff"
                              : future ? C.border
                              : isToday(d) ? C.blue
                              : hasSessions ? C.accentDark
                              : C.textMid,
                            fontWeight: isToday(d)||hasSessions ? 800 : 600,
                            fontSize: 13,
                            fontFamily:"Nunito",
                            border:"none",
                            cursor: future?"default":"pointer",
                            position:"relative",
                            display:"flex",
                            flexDirection:"column",
                            alignItems:"center",
                            justifyContent:"center",
                            padding:"2px 0",
                          }}>
                          {d}
                          {hasSessions&&!isSelected&&(
                            <div style={{width:4,height:4,borderRadius:"50%",background:dotColor,marginTop:1}}/>
                          )}
                          {isSelected&&hasSessions&&(
                            <div style={{width:4,height:4,borderRadius:"50%",background:"rgba(255,255,255,.7)",marginTop:1}}/>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {/* Legend */}
                  <div style={{display:"flex",gap:14,marginTop:14,justifyContent:"center"}}>
                    {[
                      {color:C.accentLight,dot:C.accent,label:"Workout day"},
                      {color:C.blueLight,dot:C.blue,label:"Today"},
                    ].map((l,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.textLight,fontWeight:600}}>
                        <div style={{width:12,height:12,borderRadius:4,background:l.color,border:`1.5px solid ${l.dot}`}}/>
                        {l.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected day detail */}
                {selectedCalDay&&(
                  <div style={{background:C.card,borderRadius:18,padding:18,marginBottom:16,boxShadow:"0 2px 14px rgba(0,0,0,.07)",animation:"fi .25s ease"}}>
                    <div style={{fontWeight:800,fontSize:15,color:C.text,marginBottom:10,fontFamily:"Playfair Display"}}>
                      {new Date(calYear,calMonth,selectedCalDay).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
                    </div>
                    {selSessions.length===0?(
                      <div style={{textAlign:"center",color:C.textLight,padding:"12px 0",fontSize:13}}>No workouts logged on this day</div>
                    ):selSessions.map((s,i)=>{
                      const tS=Object.values(s.log).reduce((a,sets)=>a+sets.length,0);
                      const dS=Object.values(s.log).reduce((a,sets)=>a+sets.filter(x=>x.done).length,0);
                      return (
                        <div key={i} style={{background:s.plan.color||C.accentLight,borderRadius:14,padding:"12px 14px",marginBottom:8}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            <div>
                              <div style={{fontWeight:800,fontSize:14,color:C.text}}>{s.plan.emoji} {s.day.name}</div>
                              <div style={{fontSize:12,color:C.textMid,marginTop:2}}>{s.plan.name} · {s.duration}m</div>
                            </div>
                            <div style={{fontSize:12,color:C.green,fontWeight:700,background:C.card,borderRadius:10,padding:"3px 10px"}}>{dS}/{tS} sets</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ── EXERCISE PROGRESSION GRAPH ─────────────────────── */}
                {(()=>{
                  // Collect all unique exercise names that have at least one logged set with weight+reps
                  const exMap = {}; // exName -> [{date, session_index, maxWeight, totalVolume, maxReps}]
                  [...completedSessions].reverse().forEach((s, si) => {
                    Object.entries(s.log).forEach(([exId, sets]) => {
                      // Find exercise name from the day
                      const ex = s.day.exercises.find(e=>e.id===exId);
                      if(!ex) return;
                      const doneSets = sets.filter(x=>x.done && x.weight && parseFloat(x.weight)>0);
                      if(!doneSets.length) return;
                      const maxW = Math.max(...doneSets.map(x=>parseFloat(x.weight)));
                      const vol = doneSets.reduce((a,x)=>a+parseFloat(x.weight)*parseFloat(x.reps||1),0);
                      const maxR = Math.max(...doneSets.map(x=>parseFloat(x.reps||0)));
                      if(!exMap[ex.name]) exMap[ex.name]=[];
                      exMap[ex.name].push({date:s.date, maxWeight:maxW, volume:vol, maxReps:maxR, si});
                    });
                  });
                  const exNames = Object.keys(exMap).sort();
                  if(!exNames.length) return null;

                  return <ExerciseGraph exMap={exMap} exNames={exNames} COLORS={C} MUSCLE_COLOR={MUSCLE_COLOR} />;
                })()}

                {/* Sessions per Plan */}
                <div style={{background:C.card,borderRadius:18,padding:18,marginBottom:16,boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
                  <div style={{fontWeight:800,fontSize:16,color:C.text,marginBottom:14,fontFamily:"Playfair Display"}}>Sessions per Plan</div>
                  {plans.map(plan=>{
                    const count=completedSessions.filter(s=>s.plan.id===plan.id).length;
                    const pct=totalSessions>0?(count/totalSessions)*100:0;
                    return (
                      <div key={plan.id} style={{marginBottom:12}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                          <div style={{fontSize:13,fontWeight:700,color:C.textMid}}>{plan.emoji} {plan.name}</div>
                          <div style={{fontSize:13,fontWeight:800,color:plan.tagColor}}>{count}</div>
                        </div>
                        <div style={{background:C.border,borderRadius:10,height:8,overflow:"hidden"}}>
                          <div style={{background:plan.tagColor,width:`${pct}%`,height:"100%",borderRadius:10,transition:"width .6s ease"}}/>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* History */}
                <div style={{background:C.card,borderRadius:18,padding:18,boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
                  <div style={{fontWeight:800,fontSize:16,color:C.text,marginBottom:14,fontFamily:"Playfair Display"}}>Session History</div>
                  {completedSessions.length===0?(
                    <div style={{textAlign:"center",color:C.textLight,padding:"20px 0"}}>
                      <div style={{fontSize:32,marginBottom:8}}>📊</div>
                      <div style={{fontSize:14}}>Complete workouts to see history</div>
                    </div>
                  ):completedSessions.map((s,i)=>{
                    const tS=Object.values(s.log).reduce((a,sets)=>a+sets.length,0);
                    const dS=Object.values(s.log).reduce((a,sets)=>a+sets.filter(x=>x.done).length,0);
                    return (
                      <div key={i} style={{borderBottom:i<completedSessions.length-1?`1px solid ${C.border}`:"none",paddingBottom:12,marginBottom:12}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                          <div>
                            <div style={{fontWeight:800,fontSize:14,color:C.text}}>{s.plan.emoji} {s.day.name}</div>
                            <div style={{fontSize:12,color:C.textLight,marginTop:2}}>{s.plan.name} · {s.date} · {s.duration}m</div>
                          </div>
                          <div style={{fontSize:12,color:C.green,fontWeight:700,background:C.greenLight,borderRadius:10,padding:"3px 10px"}}>{dS}/{tS} sets</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            );
          })()}

          {/* TIMER */}
          {tab==="timer"&&(
            <div className="fade-in">
              <div style={{padding:"28px 20px 20px"}}>
                <div style={{fontSize:28,fontWeight:900,color:C.text,fontFamily:"Playfair Display"}}>Timer</div>
                <div style={{fontSize:14,color:C.textLight,marginTop:4}}>Rest & stopwatch tools</div>
              </div>
              <div style={{padding:"0 20px",maxWidth:800,margin:"0 auto"}}>
                <div style={{display:"flex",background:C.border,borderRadius:14,padding:4,marginBottom:24}}>
                  {["rest","stopwatch"].map(t=>(
                    <button key={t} onClick={()=>setTimerTab(t)} style={{flex:1,padding:"10px",borderRadius:10,background:timerTab===t?"#fff":"transparent",color:timerTab===t?C.accent:C.textLight,fontWeight:800,fontSize:14,fontFamily:"Nunito",boxShadow:timerTab===t?"0 2px 8px rgba(0,0,0,.1)":"none",transition:"all .2s"}}>
                      {t==="rest"?"⏱ Rest Timer":"⏲ Stopwatch"}
                    </button>
                  ))}
                </div>
                {timerTab==="rest"&&(
                  <div style={{textAlign:"center"}}>
                    <div style={{position:"relative",width:160,height:160,margin:"0 auto 28px"}}>
                      <svg width="160" height="160" style={{transform:"rotate(-90deg)"}}>
                        <circle cx="80" cy="80" r="54" fill="none" stroke={C.border} strokeWidth="10"/>
                        <circle cx="80" cy="80" r="54" fill="none" stroke={timerSeconds===0?C.green:C.accent} strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={circumference*(1-timerPct/100)} strokeLinecap="round" style={{transition:"stroke-dashoffset 1s linear"}}/>
                      </svg>
                      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}>
                        <div style={{fontSize:34,fontWeight:900,color:timerSeconds===0?C.green:C.text,fontFamily:"Playfair Display"}}>{formatTime(timerSeconds)}</div>
                        {timerSeconds===0&&<div className="pulse" style={{fontSize:11,color:C.green,fontWeight:700}}>REST DONE!</div>}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:20,flexWrap:"wrap"}}>
                      {[30,60,90,120,180].map(t=>(
                        <button key={t} onClick={()=>{setTimerValue(t);setTimerSeconds(t);setTimerRunning(false);}} style={{background:timerValue===t?C.accent:C.accentLight,color:timerValue===t?"#fff":C.accent,borderRadius:20,padding:"7px 14px",fontSize:13,fontWeight:800,fontFamily:"Nunito"}}>{t}s</button>
                      ))}
                    </div>
                    <div style={{display:"flex",gap:12,justifyContent:"center"}}>
                      <button onClick={()=>setTimerRunning(!timerRunning)} style={{...S.primary,borderRadius:16,padding:"14px 32px",fontSize:16,fontWeight:800,fontFamily:"Nunito"}}>{timerRunning?"⏸ Pause":"▶ Start"}</button>
                      <button onClick={()=>{setTimerRunning(false);setTimerSeconds(timerValue);}} style={{background:C.border,color:C.textMid,borderRadius:16,padding:"14px 20px",fontSize:16,fontWeight:800,fontFamily:"Nunito"}}>↺</button>
                    </div>
                  </div>
                )}
                {timerTab==="stopwatch"&&(
                  <div style={{textAlign:"center"}}>
                    <div style={{background:C.card,borderRadius:24,padding:"40px 20px",marginBottom:24,boxShadow:"0 4px 20px rgba(0,0,0,.08)"}}>
                      <div style={{fontSize:52,fontWeight:900,color:C.text,fontFamily:"Playfair Display",letterSpacing:2}}>{formatTime(stopwatch)}</div>
                      {swRunning&&<div className="pulse" style={{fontSize:13,color:C.green,fontWeight:700,marginTop:8}}>● RUNNING</div>}
                    </div>
                    <div style={{display:"flex",gap:12,justifyContent:"center"}}>
                      <button onClick={()=>setSwRunning(!swRunning)} style={{...S.primary,borderRadius:16,padding:"14px 32px",fontSize:16,fontWeight:800,fontFamily:"Nunito"}}>{swRunning?"⏸ Pause":stopwatch>0?"▶ Resume":"▶ Start"}</button>
                      <button onClick={()=>{setSwRunning(false);setStopwatch(0);}} style={{background:C.border,color:C.textMid,borderRadius:16,padding:"14px 20px",fontSize:16,fontWeight:800,fontFamily:"Nunito"}}>↺</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BOTTOM NAV */}
          <div style={{position:"fixed",bottom:0,left:0,right:0,width:"100%",background:C.navBg,borderTop:`1px solid ${C.border}`,display:"flex",padding:"8px 0 12px",paddingBottom:"max(12px, env(safe-area-inset-bottom))",zIndex:100,boxShadow:"0 -4px 20px rgba(0,0,0,.06)"}}>
            {[{id:"home",icon:"🏠",label:"Home"},{id:"plans",icon:"📋",label:"Plans"},{id:"progress",icon:"📈",label:"Progress"},{id:"timer",icon:"⏱️",label:"Timer"}].map(n=>(
              <button key={n.id} onClick={()=>{setTab(n.id);if(n.id==="plans")setSelectedPlanId(null);}} style={{flex:1,background:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 0",fontFamily:"Nunito"}}>
                <div style={{fontSize:22,filter:tab===n.id?"none":"grayscale(60%)",opacity:tab===n.id?1:.5}}>{n.icon}</div>
                <div style={{fontSize:10,fontWeight:tab===n.id?800:600,color:tab===n.id?C.accent:C.textLight}}>{n.label}</div>
                {tab===n.id&&<div style={{width:18,height:3,background:C.accent,borderRadius:4}}/>}
              </button>
            ))}
          </div>
        </>
      )}

      {/* MODALS */}
      {editingPlan&&<PlanModal plan={editingPlan==="new"?null:editingPlan} onSave={savePlan} onClose={()=>setEditingPlan(null)} C={C}/>}
      {editingDay&&<DayModal day={editingDay.day} onSave={saveDay} onClose={()=>setEditingDay(null)} C={C}/>}
      {editingExercise&&<ExerciseModal exercise={editingExercise.ex} onSave={saveExercise} onClose={()=>setEditingExercise(null)} C={C}/>}
    </div>
  );
}
