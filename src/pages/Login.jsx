import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, setAuthToken } from '../api'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const BACKEND_URL = import.meta.env.VITE_API_URL || ''

export default function Login(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const nav = useNavigate()
  const googleDiv = useRef(null)

  const onSubmit = async (e)=>{
    e.preventDefault()
    setError(null)
    try{
      const form = new FormData()
      form.append('username', username)
      form.append('password', password)
      const { data } = await api.post('/auth/token', form)
      setAuthToken(data.access_token)
      nav('/')
    }catch(err){
      setError(err.response?.data?.detail || 'Login failed')
    }
  }

  useEffect(()=>{
    if(!window.google || !GOOGLE_CLIENT_ID || !googleDiv.current) return
    /* global google */
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (res)=>{
        try{
          const r = await fetch(`${BACKEND_URL}/auth/google/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_token: res.credential })
          })
          const data = await r.json()
          if(data?.access_token){
            setAuthToken(data.access_token)
            nav('/')
          } else {
            setError('Google sign-in failed')
          }
        }catch{ setError('Google sign-in failed') }
      }
    })
    google.accounts.id.renderButton(googleDiv.current, { theme: 'outline', size: 'large' })
  }, [])

  return (
    <div className="min-h-[80vh] grid place-items-center px-4">
      <div className="card w-full max-w-md p-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">ברוכים השבים</h1>
          <p className="text-sm" style={{color:"var(--muted)"}}>היכנס/י כדי להמשיך ל-SpeechTrack</p>
        </div>

        <form className="space-y-3" onSubmit={onSubmit}>
          <div className="space-y-1">
            <label className="text-xs" style={{color:"var(--muted)"}}>שם משתמש</label>
            <input className="input" placeholder="you@example.com" value={username} onChange={e=>setUsername(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs" style={{color:"var(--muted)"}}>סיסמה</label>
            <input className="input" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          {error && <div className="text-sm" style={{color:"var(--danger)"}}>{error}</div>}
          <button className="btn btn-primary btn-lg w-full">כניסה</button>
        </form>

        <div className="relative py-2">
          <div className="h-px" style={{background:"color-mix(in srgb, var(--line), transparent 60%)"}} />
          <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-[var(--card)] px-2 text-[11px]" style={{color:"var(--muted)"}}>או</span>
        </div>

        <div className="flex justify-center">
          <div ref={googleDiv} />
        </div>

        <p className="text-[12px] text-center" style={{color:"var(--muted)"}}>
          בהמשך את/ה מאשר/ת את התנאים ומדיניות הפרטיות.
        </p>
      </div>
    </div>
  )
}
