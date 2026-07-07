import { useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Chatbot from '../employee/Chatbot';
export default function AdminHiring() {
  const { hiringList } = useOutletContext();
  const [hiringData, setHiringData] = useState([]);

  useEffect(() => {
    setHiringData(hiringList || []);
  }, [hiringList]);

  const formatLocalDateTime = (dateTime) => {
    if (!dateTime) return '';
    return dateTime.toString().replace(' ', 'T').slice(0, 16);
  };

  const handleFieldChange = (id, field, value) => {
    setHiringData((prev) => prev.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  // Pipeline update logic
  const handleSave = async (id, status, date) => {
    try {
      await axios.put(`http://localhost:8000/hiring/update-status/${id}`, {
        status,
        interview_date: date || null,
      });
      setHiringData((prev) => prev.map((item) => item.id === id ? { ...item, status, interview_date: date } : item));
      alert('Pipeline Updated Successfully!');
    } catch (err) {
      console.error(err);
      alert('Error updating data');
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
            {hiringData && hiringData.length > 0 ? (
              hiringData.map((app) => (
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
                    <select
                      value={app.status || 'Pending'}
                      onChange={(e) => handleFieldChange(app.id, 'status', e.target.value)}
                      className="border p-1 rounded text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <input
                      type="datetime-local"
                      value={formatLocalDateTime(app.interview_date)}
                      onChange={(e) => handleFieldChange(app.id, 'interview_date', e.target.value)}
                      className="border p-1 rounded text-sm"
                    />
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleSave(app.id, app.status || 'Pending', app.interview_date)}
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
      <div className="fixed bottom-8 right-8 z-[1000] w-80 h-96">
    <Chatbot userType="ADMIN" empId="admin-1" isPage={false} />
</div>
    </div>
  );
}