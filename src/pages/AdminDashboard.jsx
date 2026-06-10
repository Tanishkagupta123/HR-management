import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState('Add Employee'); 
  const [employee, setEmployee] = useState({ name: '', password: '', department: 'IT', position: 'Admin' });
  const [task, setTask] = useState({ empName: 'Tanishka', dept: 'Developer Team', client: '', title: '', date: '', hrs: '', mins: '', status: 'Pending', priority: 'Normal', description: '' });
  
  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem('departments');
    return saved ? JSON.parse(saved) : ['IT', 'HR', 'Sales'];
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('departments', JSON.stringify(departments));
  }, [departments]);

  const handleOnboard = async () => {
    try {
      await axios.post('http://localhost:8000/employees', employee);
      alert("Employee Onboarded!");
      setEmployee({ name: '', password: '', department: departments[0] || 'IT', position: 'Admin' });
    } catch (err) { alert("Error saving data."); }
  };

  const submitTask = async () => {
    try {
      await axios.post('http://localhost:8000/tasks', task);
      alert("Task Submitted!");
      setTask({ ...task, client: '', title: '', date: '', hrs: '', mins: '', description: '' });
    } catch (err) { alert("Error saving task."); }
  };

  const addDepartment = () => {
    const newDept = prompt("Enter new department name:");
    if (newDept && !departments.includes(newDept)) setDepartments([...departments, newDept]);
  };

  const handleLogout = () => navigate('/');

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <button className="md:hidden p-4 fixed z-50" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <div className="space-y-1.5"><div className="w-6 h-0.5 bg-slate-800"></div><div className="w-6 h-0.5 bg-slate-800"></div><div className="w-6 h-0.5 bg-slate-800"></div></div>
      </button>

      <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-40 w-64 h-full bg-white border-r p-6 flex flex-col transition-transform duration-300`}>
        <div className="flex items-center gap-3 mb-12 mt-10 md:mt-0">
          <img src="/src/assets/as group logo.jpeg" className="w-10 h-10 object-contain rounded" />
          <span className="text-xl font-extrabold text-violet-950">AS GROUP</span>
        </div>
        <nav className="space-y-2 flex-1">
          {['Add Employee', 'Add Task', 'Departments', 'Positions', 'Reports'].map((item) => (
            <div key={item} onClick={() => setActivePage(item)} className={`p-3 rounded-xl cursor-pointer font-semibold ${activePage === item ? 'bg-violet-900 text-white shadow-lg' : 'text-slate-500 hover:bg-violet-50'}`}>
              {item}
            </div>
          ))}
        </nav>
        <button onClick={handleLogout} className="p-3 mt-4 w-full text-left font-bold text-red-600 hover:bg-red-50 rounded-xl">Logout</button>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto mt-12 md:mt-0">
        {activePage === 'Add Employee' ? (
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border">
            <h1 className="text-2xl font-bold text-slate-900 mb-8">Add New Employee</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div><label className="block text-sm font-semibold mb-2">Full Name</label><input value={employee.name} className="w-full p-4 border rounded-2xl" placeholder="Full Name" onChange={(e) => setEmployee({...employee, name: e.target.value})} /></div>
              <div><label className="block text-sm font-semibold mb-2">Password</label><input value={employee.password} className="w-full p-4 border rounded-2xl" type="password" placeholder="Password" onChange={(e) => setEmployee({...employee, password: e.target.value})} /></div>
              <div><label className="block text-sm font-semibold mb-2">Department</label><div className="flex gap-2"><select className="flex-1 p-4 border rounded-2xl" value={employee.department} onChange={(e) => setEmployee({...employee, department: e.target.value})}>{departments.map(d => <option key={d}>{d}</option>)}</select><button onClick={addDepartment} className="bg-violet-100 text-violet-700 px-4 rounded-2xl font-bold">+</button></div></div>
            </div>
            <label className="block text-sm font-semibold mb-2">Position</label>
            <select className="w-full p-4 border rounded-2xl mb-8" value={employee.position} onChange={(e) => setEmployee({...employee, position: e.target.value})}><option>Admin</option><option>TL</option><option>Employee</option></select>
            <button onClick={handleOnboard} className="bg-violet-900 text-white px-10 py-4 rounded-2xl font-bold">Onboard New Employee</button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border">
            <h1 className="text-2xl font-bold text-slate-900 mb-8">Task Reporting</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div><label className="block text-sm font-semibold mb-2">Employee Name</label><input className="w-full p-4 border bg-slate-50 rounded-2xl cursor-not-allowed" value={task.empName} disabled /></div>
              <div><label className="block text-sm font-semibold mb-2">Department</label><input className="w-full p-4 border bg-slate-50 rounded-2xl cursor-not-allowed" value={task.dept} disabled /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div><label className="block text-sm font-semibold mb-2">Project Name</label><input className="w-full p-4 border rounded-2xl" placeholder="Project Name" onChange={(e) => setTask({...task, client: e.target.value})} /></div>
              <div><label className="block text-sm font-semibold mb-2">Task Title</label><input className="w-full p-4 border rounded-2xl" placeholder="Task Title" onChange={(e) => setTask({...task, title: e.target.value})} /></div>
              <div><label className="block text-sm font-semibold mb-2">Date</label><input type="date" className="w-full p-4 border rounded-2xl" onChange={(e) => setTask({...task, date: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div><label className="block text-sm font-semibold mb-2">Hours</label><input type="number" min="0" max="23" className="w-full p-4 border rounded-2xl" placeholder="0-23" onChange={(e) => setTask({...task, hrs: Math.min(23, Math.max(0, e.target.value))})} /></div>
              <div><label className="block text-sm font-semibold mb-2">Minutes</label><input type="number" min="0" max="59" className="w-full p-4 border rounded-2xl" placeholder="0-59" onChange={(e) => setTask({...task, mins: Math.min(59, Math.max(0, e.target.value))})} /></div>
              <div><label className="block text-sm font-semibold mb-2">Status</label><select className="w-full p-4 border rounded-2xl" onChange={(e) => setTask({...task, status: e.target.value})}><option>Pending</option><option>Completed</option></select></div>
              <div><label className="block text-sm font-semibold mb-2">Priority</label><select className="w-full p-4 border rounded-2xl" onChange={(e) => setTask({...task, priority: e.target.value})}><option>Normal</option><option>High</option></select></div>
            </div>
            <label className="block mb-2 font-semibold">Description</label>
            <textarea className="w-full p-4 border rounded-2xl mb-6 h-32" placeholder="What did you do today?" onChange={(e) => setTask({...task, description: e.target.value})} />
            <button onClick={submitTask} className="bg-violet-900 text-white px-10 py-4 rounded-2xl font-bold">+ Add Task</button>
          </div>
        )}
      </main>
    </div>
  );
}