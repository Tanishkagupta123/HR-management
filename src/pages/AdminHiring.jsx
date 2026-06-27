import { useOutletContext } from 'react-router-dom';
import axios from 'axios';

export default function AdminHiring() {
  const { hiringList } = useOutletContext(); 

  // Pipeline update logic
  const handleSave = async (id, status, date) => {
    try {
      await axios.put(`http://localhost:8000/hiring/update-status/${id}`, { 
        status, 
        interview_date: date 
      });
      alert("Pipeline Updated Successfully!");
    } catch (err) {
      alert("Error updating data");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-black mb-6 text-violet-950">Job Applications</h2>
      
      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl border border-slate-100">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Email</th>
              <th className="p-4">Position</th>
              <th className="p-4">Message</th>
              <th className="p-4">Resume</th>
              {/* Naye columns add kar diye */}
              <th className="p-4 text-violet-700 font-bold">Status</th>
              <th className="p-4 text-violet-700 font-bold">Interview</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {hiringList && hiringList.length > 0 ? (
              hiringList.map((app) => (
                <tr key={app.id} className="border-b hover:bg-slate-50 transition">
                  <td className="p-4 font-bold">{app.name}</td>
                  <td className="p-4">{app.phone}</td>
                  <td className="p-4">{app.email}</td>
                  <td className="p-4 text-violet-800 font-semibold">{app.position}</td>
                  <td className="p-4 text-sm text-slate-600 max-w-xs truncate">{app.message}</td>
                  <td className="p-4">
                    {app.resume ? (
                      <a href={`http://localhost:8000/uploads/${app.resume}`} target="_blank" rel="noopener noreferrer" className="bg-violet-100 text-violet-900 px-3 py-1 rounded-lg font-bold hover:bg-violet-200 transition">View</a>
                    ) : <span className="text-slate-400">No File</span>}
                  </td>
                  
                  {/* Pipeline Inputs */}
                  <td className="p-4">
                    <select id={`status-${app.id}`} className="border p-1 rounded text-sm" defaultValue={app.status}>
                      <option value="Pending">Pending</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <input type="datetime-local" id={`date-${app.id}`} className="border p-1 rounded text-sm" defaultValue={app.interview_date} />
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleSave(app.id, document.getElementById(`status-${app.id}`).value, document.getElementById(`date-${app.id}`).value)}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-700"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-10 text-center text-slate-500">No applications received yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}