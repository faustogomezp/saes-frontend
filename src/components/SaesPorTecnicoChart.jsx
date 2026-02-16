import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function SaesPorTecnicoChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <XAxis type="number" />
        <YAxis type="category" dataKey="tecnico" width={120}/>
        <Tooltip />
        <Bar dataKey="total" fill="#2e7d32" />
      </BarChart>
    </ResponsiveContainer>
  );
}