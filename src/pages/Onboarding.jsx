import React, {useState} from "react"
import { useNavigate } from "react-router-dom"

const steps = ["intro","profile","voices","schedule","done"]

export default function Onboarding(){
  const [step, setStep] = useState("intro")
  const nav = useNavigate()
  const next = () => {
    const i = steps.indexOf(step)
    if(i < steps.length-1) setStep(steps[i+1])
    else nav("/child/1") // TODO: replace with the real created child id
  }

  return (
    <div className="min-h-[80vh] grid place-items-center px-4" dir="rtl">
      <div className="card w-full max-w-2xl p-8 space-y-6">
        {step==="intro" && <Intro onNext={next} />}
        {step==="profile" && <Profile onNext={next} />}
        {step==="voices" && <Voices onNext={next} />}
        {step==="schedule" && <Schedule onNext={next} />}
        {step==="done" && <Done onNext={()=>nav("/")}/>}
      </div>
    </div>
  )
}

function Intro({onNext}){
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">ברוכים הבאים</h1>
      <p className="text-sm" style={{color:"var(--muted)"}}>
        הסבר קצר על האפליקציה, זמני הקלטה, אישור הקלטה/תנאי שימוש/פרטיות, והודעות פוש.
      </p>
      <div className="flex gap-3 flex-wrap">
        <label className="flex items-center gap-2"><input type="checkbox"/> מאשר/ת הקלטה</label>
        <label className="flex items-center gap-2"><input type="checkbox"/> מאשר/ת תנאי שימוש ופרטיות</label>
        <label className="flex items-center gap-2"><input type="checkbox"/> מאפשר/ת פוש</label>
      </div>
      <button className="btn btn-primary btn-lg" onClick={onNext}>המשך</button>
    </div>
  )
}

function Profile({onNext}){
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">פרטי זיהוי</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        <input className="input" placeholder="תאריך לידה"/>
        <select className="input"><option>זכר</option><option>נקבה</option></select>
        <input className="input" placeholder="טלפון של ההורה"/>
        <input className="input" placeholder="כתובת מייל"/>
      </div>
      <div className="flex justify-end"><button className="btn btn-primary btn-md" onClick={onNext}>המשך</button></div>
    </div>
  )
}

function Voices({onNext}){
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">זיהוי קולות במשפחה</h2>
      <p className="text-sm" style={{color:"var(--muted)"}}>
        ניתן להקליט או להעלות קטע קול לכל משתתף (הורה 1/2, אחים).
      </p>
      <VoiceRow label="הורה 1"/>
      <VoiceRow label="הורה 2"/>
      <AddSibling />
      <div className="flex justify-end"><button className="btn btn-primary btn-md" onClick={onNext}>המשך</button></div>
    </div>
  )
}
function VoiceRow({label}){
  return (
    <div className="flex items-center gap-2">
      <span className="badge">{label}</span>
      <input type="file" accept="audio/*" className="input" />
      <button className="btn btn-secondary btn-sm">הקלט</button>
    </div>
  )
}
function AddSibling(){ return <button className="btn btn-ghost btn-sm">לחץ להוספת אח/אחות</button> }

function Schedule({onNext}){
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">בחירת זמני הקלטה</h2>
      <p className="text-sm" style={{color:"var(--muted)"}}>
        בחר/י מסגרות זמן מוצעות, ימים, או מצב תמיד-דלוק.
      </p>
      <div className="flex flex-wrap gap-2">
        <Chip>ארוחת ערב 18:00–20:00</Chip>
        <Chip>זמן משחק 16:00–18:00</Chip>
        <Chip>השכבות</Chip>
        <Chip variant="ghost">הוסף זמן אישי</Chip>
      </div>
      <div className="flex gap-2 items-center">
        <label className="flex items-center gap-2"><input type="checkbox"/> תמיד דלוק</label>
      </div>
      <div className="flex flex-wrap gap-2">
        {["א","ב","ג","ד","ה","ו","ש"].map(d=> <Day key={d} d={d}/>)}
      </div>
      <div className="flex justify-end"><button className="btn btn-primary btn-md" onClick={onNext}>סיום</button></div>
    </div>
  )
}
function Chip({children,variant="secondary"}){ return <span className={`btn btn-sm ${variant==="ghost"?"btn-ghost":"btn-secondary"}`}>{children}</span> }
function Day({d}){ return <span className="btn btn-secondary btn-sm">{d}</span> }
function Done({onNext}){ return <div className="space-y-4"><h2 className="text-xl font-semibold">הכל מוכן!</h2><button className="btn btn-primary btn-lg" onClick={onNext}>להתחיל</button></div> }
