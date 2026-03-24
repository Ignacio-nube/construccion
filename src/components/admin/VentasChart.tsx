'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

interface VentasChartProps {
  datos: { dia: string; total: number }[]
}

export default function VentasChart({ datos }: VentasChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={datos} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#dfc0b2" strokeOpacity={0.5} />
        <XAxis
          dataKey="dia"
          tick={{ fontSize: 11, fontFamily: 'Manrope', fill: '#584237' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fontFamily: 'Manrope', fill: '#584237' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
        />
        <Tooltip
          formatter={(v) =>
            new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(Number(v))
          }
          contentStyle={{
            fontFamily: 'Manrope',
            fontSize: 12,
            background: '#fbf9f8',
            border: '1px solid #dfc0b2',
            borderRadius: '0',
          }}
        />
        <Bar dataKey="total" fill="#f2711c" radius={0} />
      </BarChart>
    </ResponsiveContainer>
  )
}
