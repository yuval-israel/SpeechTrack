import React from "react"
export default function MLUCard({mlu, stageLabel="שלב צירופים"}){
  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-1">משפטים (MLU)</h3>
      <p className="text-sm mb-2" style={{color:"var(--muted)"}}>כמה מילים בממוצע יש במשפט של הילד</p>
      <div className="text-3xl font-bold">{mlu.toFixed(1)}</div>
      <div className="badge mt-2">{stageLabel}</div>
    </div>
  )
}
