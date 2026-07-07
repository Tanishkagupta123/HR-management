import { useEffect, useState } from 'react';
import axios from 'axios';

export default function EmployeeTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [taskData, setTaskData] = useState({ 
      client_name: '', title: '', task_date: new Date().toISOString().split('T')[0], 
      hours: '', minutes: '', status: 'Pending', priority: 'Normal', description: '' 
  });
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8000/tasks');
      const allTasks = Array.isArray(res.data) ? res.data : (res.data.tasks || []);
      
      const userName = String(user.name || "").toLowerCase().trim();
      // Filter: Sirf wahi tasks jo login employee ko assign hain
      const myTasks = allTasks.filter(t => String(t.assign_to || "").toLowerCase().trim() === userName);
      
      setTasks(myTasks);
    } catch (err) { 
      console.error("Task load error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleSelfAssign = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/tasks', { ...taskData, assign_to: user.name });
      alert("Task self-assigned successfully!");
      setShowForm(false);
      fetchTasks();
    } catch (err) { alert("Failed to assign task"); }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-2 md:p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">My Tasks</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-violet-900 text-white px-6 py-3 rounded-xl font-bold">
          {showForm ? 'Cancel' : '+ Self Assign'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 mb-6 rounded-2xl shadow-sm border">
          <form onSubmit={handleSelfAssign} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input className="p-3 border rounded-xl" placeholder="Client Name" onChange={(e) => setTaskData({...taskData, client_name: e.target.value})} required />
            <input className="p-3 border rounded-xl" placeholder="Task Title" onChange={(e) => setTaskData({...taskData, title: e.target.value})} required />
            <input type="date" className="p-3 border rounded-xl" defaultValue={taskData.task_date} onChange={(e) => setTaskData({...taskData, task_date: e.target.value})} />
            <div className="md:col-span-3">
              <textarea className="w-full p-3 border rounded-xl h-20" placeholder="Description..." onChange={(e) => setTaskData({...taskData, description: e.target.value})} />
            </div>
            <button type="submit" className="md:col-span-3 bg-green-600 text-white py-3 rounded-xl font-bold">Assign to Myself</button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="p-4 text-slate-400 font-bold">Loading tasks...</p>
      ) : (
        tasks.map((t, idx) => {
          // Logic: Agar client_name khali hai toh hum maan rahe hain ki ye self-assigned hai
          const isSelf = !t.client_name || t.client_name.trim() === ""; 
          return (
            <div key={idx} className="bg-white p-6 mb-6 rounded-2xl shadow-sm border hover:border-violet-200 transition">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-slate-900">{t.title}</h3>
                <div className="flex gap-2">
                  {/* Badge: Admin vs Self */}
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${isSelf ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                    {isSelf ? 'Self Assigned' : 'Admin Assigned'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${t.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {t.status || 'Pending'}
                  </span>
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-4">{t.description}</p>
              <div className="flex gap-4 text-xs font-bold text-slate-400 uppercase">
                <span>Client: {t.client_name || 'N/A'}</span>
                <span>Deadline: {t.task_date || 'N/A'}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}