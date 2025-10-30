import React from "react"
export default function TTRCard({ttr}){
  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-1">מדד עושר וגיוון לשוני (TTR)</h3>
      <p className="text-sm mb-3" style={{color:"var(--muted)"}}>
        מתוך כל 300 מילים שהילד אמר, {Math.round(ttr*100)}% היו שונות. אחוז גבוה מעיד על עושר וגיוון לשוני.
      </p>
      <div className="h-2 rounded-full bg-black/30 overflow-hidden">
        <div className="h-full" style={{width:`${ttr*100}%`, background:"var(--brand)"}} />
      </div>
    </div>
  )
}
