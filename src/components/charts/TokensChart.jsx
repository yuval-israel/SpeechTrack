import React from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

export default function TokensChart({data, title="יחידות שפה (Tokens)"}){
  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{left:8,right:8,top:8,bottom:8}}>
          <CartesianGrid stroke="rgba(255,255,255,.06)" />
          <XAxis dataKey="label" stroke="#a9b5d1"/>
          <YAxis stroke="#a9b5d1"/>
          <Tooltip />
          <Line type="monotone" dataKey="tokens" stroke="#6aa3ff" strokeWidth={2} dot={false}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
