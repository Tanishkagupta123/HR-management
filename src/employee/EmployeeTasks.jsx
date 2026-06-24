import { useEffect, useState } from 'react';
import axios from 'axios';

export default function EmployeeTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium' });
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const [adminRes, selfRes] = await Promise.all([
        axios.get('http://localhost:8000/dashboard/task'),
        axios.get('http://localhost:8000/tasks')
      ]);

      // FIX: Ensure data is an array regardless of structure
      const adminTasks = Array.isArray(adminRes.data) ? adminRes.data : (adminRes.data.tasks || []);
      const selfTasks = Array.isArray(selfRes.data) ? selfRes.data : (selfRes.data.tasks || []);
      
      const allTasks = [...adminTasks, ...selfTasks];
      
      // RELAXED FILTER
      const myTasks = allTasks.filter(t => {
        const assigned = String(t.assign_to || "").toLowerCase().trim();
        const userName = String(user.name || "").toLowerCase().trim();
        const userId = String(user.id || "").toLowerCase().trim();
        return assigned === userId || assigned === userName;
      });
      
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
      await axios.post('http://localhost:8000/tasks', {
        ...newTask,
        assign_to: user.name, 
        status: 'Assigned',   
        priority: newTask.priority
      });
      alert("Task self-assigned successfully!");
      setNewTask({ title: '', description: '', priority: 'Medium' });
      setShowForm(false);
      fetchTasks();
    } catch (err) { alert("Failed to assign task"); }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-[32px] shadow-sm border border-slate-100 space-y-8">
      <div className="flex justify-between items-center border-b border-slate-100 pb-6">
        <h2 className="text-3xl font-extrabold text-violet-950">My Tasks</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-violet-900 text-white rounded-2xl font-black hover:bg-black transition"
        >
          {showForm ? 'Cancel' : '+ Self Assign'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSelfAssign} className="p-6 bg-violet-50 rounded-2xl space-y-4">
          <input placeholder="Task Title" className="w-full p-3 rounded-xl border" onChange={(e) => setNewTask({...newTask, title: e.target.value})} required />
          <textarea placeholder="Task Description" className="w-full p-3 rounded-xl border" onChange={(e) => setNewTask({...newTask, description: e.target.value})} required />
          <button type="submit" className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold">Assign to Myself</button>
        </form>
      )}

      {loading ? (
        <p className="text-slate-400 font-bold">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <div className="text-center py-10"><p className="text-slate-400 font-bold">No tasks assigned yet.</p></div>
      ) : (
        <div className="space-y-6">
          {tasks.map((t, idx) => (
            <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-violet-200 transition">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-black text-violet-950">{t.title}</h3>
                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-[10px] font-black uppercase">{t.status}</span>
              </div>
              <p className="text-slate-600 mt-2 text-sm">{t.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}