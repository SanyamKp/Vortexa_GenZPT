import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const processDataForChart = (reports) => {
  const diseaseCounts = reports.reduce((acc, report) => {
    acc[report.disease] = (acc[report.disease] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(diseaseCounts);
  const data = Object.values(diseaseCounts);
  
  return {
    labels,
    datasets: [
      {
        label: '# of Reports',
        data,
        backgroundColor: [
          'rgba(45, 106, 79, 0.8)',
          'rgba(82, 183, 136, 0.8)',
          'rgba(255, 195, 0, 0.8)',
          'rgba(239, 71, 111, 0.8)',
          'rgba(14, 14, 14, 0.8)',
        ],
        borderColor: [
          '#ffffff',
        ],
        borderWidth: 2,
      },
    ],
  };
};

function AnalyticsCharts({ reports }) {
  const chartData = processDataForChart(reports);
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Disease Distribution',
        font: {
          size: 16
        }
      },
    },
  };

  return (
    <div className="chart-container">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

export default AnalyticsCharts;