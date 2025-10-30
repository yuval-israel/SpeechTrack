import React from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'

export default function App(){
  const nav = useNavigate()
  const loc = useLocation()
  const logout = ()=>{ localStorage.removeItem('token'); nav('/login') }
  return (
    <div className="min-h-screen">
      <header className="app-header">
        <div className="container-narrow py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold tracking-wide text-[18px]">
            <span style={{color:"var(--brand)"}}>●</span> SpeechTrack
          </Link>
          <div className="flex gap-2">
            <Link to="/" className="btn btn-secondary btn-md">בית</Link>
            {loc.pathname !== '/login' && (
              <button className="btn btn-primary btn-md" onClick={logout}>התנתקות</button>
            )}
          </div>
        </div>
      </header>
      <main className="container-narrow py-6">
        <Outlet />
      </main>
    </div>
  )
}
