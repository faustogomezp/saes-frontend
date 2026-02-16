import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = {
  critico: '#d32f2f',
  advertencia: '#f9a825',
  normal: '#388e3c'
};

export default function SaesSemaforoChart({ data }) {
  const chartData = [
    { name: 'Crítico', value: Number(data.critico), key: 'critico' },
    { name: 'Advertencia', value: Number(data.advertencia), key: 'advertencia' },
    { name: 'Normal', value: Number(data.normal), key: 'normal' }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={index} fill={COLORS[entry.key]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}