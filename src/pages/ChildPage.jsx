import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api'
import MetricTabs from "../components/MetricTabs"
import TokensChart from "../components/charts/TokensChart"
import POSDonut from "../components/charts/POSDonut"
import TTRCard from "../components/charts/TTRCard"
import MLUCard from "../components/charts/MLUCard"

function AudioWithAuth({path}){
  const [url, setUrl] = React.useState(null)
  React.useEffect(()=>{
    const token = localStorage.getItem('token')
    const API_URL = import.meta.env.VITE_API_URL || ''
    let cancelled = false
    ;(async()=>{
      try{
        const res = await fetch((API_URL||'') + path, { headers: token ? { 'Authorization': `Bearer ${token}` } : {} })
        const blob = await res.blob()
        if(!cancelled) setUrl(URL.createObjectURL(blob))
      }catch(e){ /* ignore */ }
    })()
    return ()=>{ cancelled = true; if(url) URL.revokeObjectURL(url) }
  }, [path])
  return url ? <audio controls src={url} /> : <span className="badge">טוען…</span>
}

export default function ChildPage(){
  const { id } = useParams()
  const [tab, setTab] = useState('recordings')
  const [child, setChild] = useState(null)
  const [globalAnalysis, setGlobalAnalysis] = useState(null)
  const [recs, setRecs] = useState([])
  const [stamps, setStamps] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAll = async ()=>{
    setError(null)
    try{
      const [c, r, s] = await Promise.all([
        api.get(`/children/${id}`),
        api.get(`/recordings/${id}`),
        api.get(`/voice-stamps/${id}`),
      ])
      setChild(c.data)
      setRecs(r.data)
      setStamps(s.data)
      try{
        const ga = await api.get(`/analysis/children/${id}/global`)
        setGlobalAnalysis(ga.data)
      }catch{ /* may not exist yet */ }
    }catch(e){
      setError(e.response?.data?.detail || 'Failed to load')
    }
  }

  useEffect(()=>{ fetchAll() }, [id])

  const uploadRecording = async (file)=>{
    setUploading(true); setError(null)
    try{
      const form = new FormData()
      form.append('file', file)
      form.append('child_id', id)
      const { data } = await api.post('/recordings/', form, { headers:{'Content-Type':'multipart/form-data'} })
      setRecs([data, ...recs])
    }catch(e){ setError(e.response?.data?.detail || 'Upload failed') }
    finally{ setUploading(false) }
  }

  const uploadStamp = async (file)=>{
    setUploading(true); setError(null)
    try{
      const form = new FormData()
      form.append('file', file)
      form.append('child_id', id)
      form.append('speaker', 'parent')
      const { data } = await api.post('/voice-stamps/', form, { headers:{'Content-Type':'multipart/form-data'} })
      setStamps([data, ...stamps])
    }catch(e){ setError(e.response?.data?.detail || 'Upload failed') }
    finally{ setUploading(false) }
  }

  const deleteRecording = async (recordingId)=>{
    try{
      await api.delete(`/recordings/${recordingId}`)
      setRecs(recs.filter(r=>r.id!==recordingId))
    }catch(e){ setError('Delete failed') }
  }

  const retranscribe = async (recordingId)=>{
    try{
      await api.post(`/recordings/by-id/${recordingId}/retranscribe`)
      await fetchAll()
    }catch(e){ setError('Retranscribe failed') }
  }

  const weekly = ["א","ב","ג","ד","ה","ו","ש"].map((d,i)=>({label:d, tokens: 10 + i*3}))
  const posNow = [
    {label:"שמות עצם", value:61.7},
    {label:"פעלים", value:24.7},
    {label:"שמות תואר", value:8.6},
    {label:"כינויי גוף", value:4.9},
  ]

  return (
    <div className="space-y-6" dir="rtl">
      <div className="card p-4">
        <div className="flex gap-2 items-center">
          <button className={"btn "+(tab==='recordings'?'btn-secondary':'btn-ghost')} onClick={()=>setTab('recordings')}>הקלטות</button>
          <button className={"btn "+(tab==='stamps'?'btn-secondary':'btn-ghost')} onClick={()=>setTab('stamps')}>טביעות קול</button>
          <button className={"btn "+(tab==='global'?'btn-secondary':'btn-ghost')} onClick={()=>setTab('global')}>ניתוח כללי</button>
        </div>
      </div>

      {error && <div className="badge">{error}</div>}

      {tab==='recordings' && (
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="font-semibold mb-2">העלה הקלטה (.wav)</h3>
            <input type="file" accept="audio/wav" onChange={e=>e.target.files[0] && uploadRecording(e.target.files[0])} disabled={uploading} />
          </div>
          <div className="card p-0 overflow-hidden">
            <table className="table">
              <thead><tr className="bg-black/20"><th>ID</th><th>שם קובץ</th><th>מצב</th><th>אודיו</th><th>ניתוח</th><th>פעולות</th></tr></thead>
              <tbody>
                {recs.map(r=>(
                  <tr key={r.id} className="hover:bg-white/5">
                    <td>{r.id}</td>
                    <td>{r.filename}</td>
                    <td><span className="badge">{r.status}</span></td>
                    <td><AudioWithAuth path={`/recordings/file/${r.id}`} /></td>
                    <td>
                      <button className="btn btn-secondary" onClick={async()=>{
                        try{
                          const { data } = await api.get(`/analysis/recordings/${r.id}`)
                          alert(JSON.stringify(data, null, 2))
                        }catch(e){ alert('אין ניתוח עדיין') }
                      }}>הצג</button>
                    </td>
                    <td className="flex gap-2">
                      <button className="btn btn-secondary" onClick={()=>retranscribe(r.id)}>שחזר תמלול</button>
                      <button className="btn btn-primary" onClick={()=>deleteRecording(r.id)}>מחק</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==='stamps' && (
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="font-semibold mb-2">העלה טביעת קול (.wav)</h3>
            <input type="file" accept="audio/wav" onChange={e=>e.target.files[0] && uploadStamp(e.target.files[0])} disabled={uploading} />
          </div>
          <div className="card p-0 overflow-hidden">
            <table className="table">
              <thead><tr className="bg-black/20"><th>ID</th><th>דובר</th><th>אודיו</th></tr></thead>
              <tbody>
                {stamps.map(s=>(
                  <tr key={s.id} className="hover:bg-white/5">
                    <td>{s.id}</td>
                    <td>{s.speaker}</td>
                    <td><AudioWithAuth path={`/voice-stamps/file/${s.id}`} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==='global' && (
        <div className="space-y-4">
          <MetricTabs tabs={{
            "יחידות שפה": (
              <div className="grid lg:grid-cols-2 gap-4">
                <TokensChart data={weekly}/>
                <TTRCard ttr={0.40}/>
              </div>
            ),
            "משפטים": (
              <div className="grid lg:grid-cols-2 gap-4">
                <MLUCard mlu={2.1} stageLabel="שלב צירופים"/>
                <POSDonut data={posNow}/>
              </div>
            ),
            "אינטרקציה ושטף": (
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="card p-4">Turn-taking — בקרוב</div>
                <div className="card p-4">Fluency & Speech Rate — בקרוב</div>
              </div>
            )
          }}/>
          <div className="card p-4">
            {globalAnalysis ? (
              <pre className="bg-black/20 rounded p-3 overflow-auto">{JSON.stringify(globalAnalysis, null, 2)}</pre>
            ) : (
              <div className="badge">אין ניתוח כללי עדיין</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
