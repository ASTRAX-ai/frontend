"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface AIChartProps {
  data: any[]
}

export function AIChart({ data }: AIChartProps) {
  // Detect chart type based on data
  const isPie = data[0]?.SOL !== undefined

  if (isPie) {
    // Pie chart for allocation
    const chartData = [
      { name: "SOL", value: data[0].SOL, fill: "#a855f7" },
      { name: "USDC", value: data[0].USDC, fill: "#06b6d4" },
    ]

    return (
      <div className="h-32 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={2} dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Bar chart for metrics
  return (
    <div className="h-32">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
          <YAxis stroke="rgba(255,255,255,0.5)" />
          <Tooltip contentStyle={{ backgroundColor: "#1f2744", border: "1px solid rgba(255,255,255,0.1)" }} />
          <Bar dataKey="risk" fill="#a855f7" />
          <Bar dataKey="return" fill="#06b6d4" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
