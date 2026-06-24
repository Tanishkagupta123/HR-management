import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;

  useEffect(() => {
    if (!user) return navigate('/');
    // if admin somehow landed here, forward to admin dashboard
    if (user.role === 'admin') return navigate('/admin');

    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:8000/dashboard/task');
        const all = res.data.tasks || [];
        const myTasks = all.filter(t => String(t.assign_to) === String(user.id) || String(t.assign_to) === String(user.name));
        setTasks(myTasks);
      } catch (err) {
        console.error('Failed to load tasks', err);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
      <p className="mt-2 text-slate-700">Role: {user?.role}</p>

      <section className="mt-6">
        <h2 className="text-2xl font-semibold">Your Tasks</h2>
        {tasks.length === 0 ? (
          <p className="mt-4 text-slate-600">No tasks assigned.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {tasks.map(t => (
              <li key={t.id} className="p-4 bg-white rounded shadow">
                <div className="font-bold">{t.task_details || t.title}</div>
                <div className="text-sm text-slate-600">Status: {t.status}</div>
                <div className="text-sm text-slate-600">Remarks: {t.remarks}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
