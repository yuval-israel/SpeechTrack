import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Dashboard(){
  const [children, setChildren] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const nav = useNavigate()

  useEffect(()=>{
    (async()=>{
      try{
        const { data } = await api.get('/children/')
        setChildren(data)
      }catch(e){
        if(e.response?.status===401) nav('/login')
        else setError('Failed to load children')
      }finally{ setLoading(false) }
    })()
  }, [])

  const createChild = async ()=>{
    try{
      const { data } = await api.post('/children/', { name })
      setChildren([data, ...children])
      setName('')
    }catch(e){
      setError(e.response?.data?.detail || 'Failed to create child')
    }
  }

  if(loading) return <div>Loading…</div>

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-3">הילדים שלך</h2>
        <div className="flex gap-2">
          <input className="input" placeholder="שם חדש" value={name} onChange={e=>setName(e.target.value)} />
          <button className="btn btn-primary" onClick={createChild}>צור</button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="table">
          <thead><tr className="bg-black/20"><th>ID</th><th>שם</th><th>פעולות</th></tr></thead>
          <tbody>
            {children.map(c=>(
              <tr key={c.id} className="hover:bg-white/5">
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>
                  <Link className="btn btn-secondary" to={`/child/${c.id}`}>פתח</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <div className="badge">{error}</div>}
    </div>
  )
}
