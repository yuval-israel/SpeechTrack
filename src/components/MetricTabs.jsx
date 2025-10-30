import React, {useState} from "react"
export default function MetricTabs({tabs, dir="rtl"}){
  const keys = Object.keys(tabs)
  const [active,setActive] = useState(keys[0])
  return (
    <div>
      <div className="flex gap-2 mb-3" dir={dir}>
        {keys.map(k=>(
          <button key={k} className={`btn btn-sm ${active===k?'btn-secondary':'btn-ghost'}`} onClick={()=>setActive(k)}>{k}</button>
        ))}
      </div>
      {tabs[active]}
    </div>
  )
}
