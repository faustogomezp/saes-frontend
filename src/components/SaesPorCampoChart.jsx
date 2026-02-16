import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function SaesPorCampoChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="campo" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#1976d2" />
      </BarChart>
    </ResponsiveContainer>
  );
}