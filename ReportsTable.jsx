export default function ReportsTable({ reports }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-bold mb-4">Recent Reports</h3>
        <div className="overflow-y-auto h-64">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Disease</th>
                        <th scope="col" className="px-6 py-3">Risk</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map(report => (
                        <tr key={report.id} className="bg-white border-b">
                            <td className="px-6 py-4">{new Date(report.timestamp).toLocaleDateString()}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{report.disease.replace(/_/g, ' ')}</td>
                            <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                report.risk_level === 'High' ? 'bg-red-200 text-red-800' :
                                report.risk_level === 'Medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                            }`}>{report.risk_level}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}