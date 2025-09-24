import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsCharts({ reports = [] }) {
  // Count occurrences of each disease
  const diseaseCounts = reports.reduce((acc, report) => {
    const disease = report.disease || 'Unknown';
    acc[disease] = (acc[disease] || 0) + 1;
    return acc;
  }, {});

  // Convert to Recharts-compatible data
  const data = Object.keys(diseaseCounts).map((key) => ({
    name: key.replace(/_/g, ' '),
    value: diseaseCounts[key],
  }));

  // Color palette
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943'];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md" style={{ height: '320px' }}>
      <h3 className="font-bold mb-4">Disease Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
