import React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
const COLORS = ["#82b1ff","#a78bfa","#f472b6","#34d399"]

export default function POSDonut({data, title="חלוקת חלקי דיבר (POS)"}){
  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="label" innerRadius={60} outerRadius={100}>
            {data.map((_, i)=> <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
          </Pie>
          <Tooltip/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
