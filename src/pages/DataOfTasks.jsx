export default function DataOfTasks({ tasksList }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Task Overview</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="p-4">Project</th>
              <th className="p-4">Title</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tasksList.length > 0 ? tasksList.map((t, i) => (
              <tr key={i}>
                <td className="p-4 font-semibold">{t.client}</td>
                <td className="p-4">{t.title}</td>
                <td className="p-4"><span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">{t.status}</span></td>
              </tr>
            )) : <tr><td colSpan="3" className="p-10 text-center text-slate-400">No tasks submitted yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}