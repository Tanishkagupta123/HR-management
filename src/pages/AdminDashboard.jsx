import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState('Add Employee');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [employee, setEmployee] = useState({ name: '', password: '', department: 'IT', position: 'Admin' });
  const [tasks, setTasks] = useState([{ empName: '', dept: 'IT', client: '', title: '', date: new Date().toISOString().split('T')[0], hrs: '', mins: '', status: 'Pending', priority: 'Normal', description: '' }]);
  const [employeesList, setEmployeesList] = useState([]);
  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem('departments');
    return saved ? JSON.parse(saved) : ['IT', 'HR', 'Sales'];
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    localStorage.setItem('departments', JSON.stringify(departments));
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:8000/employees');
        setEmployeesList(res.data);
      } catch (err) { console.error("Error fetching employees"); }
    };
    fetchEmployees();
    return () => clearInterval(timer);
  }, [departments]);

  const handleOnboard = async () => {
    try {
      await axios.post('http://localhost:8000/employees', employee);
      alert("Employee Onboarded!");
      setEmployee({ name: '', password: '', department: departments[0] || 'IT', position: 'Admin' });
    } catch (err) { alert("Error saving data."); }
  };

  const addNewTaskBlock = () => {
    setTasks([...tasks, { empName: tasks[0].empName, dept: tasks[0].dept, client: '', title: '', date: new Date().toISOString().split('T')[0], hrs: '', mins: '', status: 'Pending', priority: 'Normal', description: '' }]);
  };

  const removeTaskBlock = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleTaskChange = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    if (field === 'empName' || field === 'dept') {
      const updatedTasks = newTasks.map(t => ({ ...t, [field]: value }));
      setTasks(updatedTasks);
    } else {
      setTasks(newTasks);
    }
  };

  const submitAllTasks = async () => {
    try {
      for (const task of tasks) {
        await axios.post('http://localhost:8000/tasks', task);
      }
      alert("All Tasks Submitted Successfully!");
      setTasks([{ empName: '', dept: 'IT', client: '', title: '', date: new Date().toISOString().split('T')[0], hrs: '', mins: '', status: 'Pending', priority: 'Normal', description: '' }]);
    } catch (err) { alert("Error saving tasks."); }
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
          {['Add Employee', 'Add Task', 'Data of Tasks', 'Positions', 'Reports'].map((item) => (
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
            <select className="w-full p-4 border rounded-2xl mb-8" value={employee.position} onChange={(e) => setEmployee({...employee, position: e.target.value})}><option>Admin</option><option>TL</option><option>Employee</option></select>
            <button onClick={handleOnboard} className="bg-violet-900 text-white px-10 py-4 rounded-2xl font-bold">Onboard New Employee</button>
          </div>
        ) : activePage === 'Add Task' ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Task Reporting</h1>
              {/* Date & Time moved to Main Content */}
              <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border font-bold text-violet-900">
                {currentTime.toLocaleDateString()} | {currentTime.toLocaleTimeString()}
              </div>
            </div>
            
            <div className="bg-white p-8 mb-6 rounded-3xl shadow-sm border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-semibold mb-2">Employee Name</label>
                    <select className="w-full p-4 border rounded-2xl" value={tasks[0].empName} onChange={(e) => handleTaskChange(0, 'empName', e.target.value)}>
                      <option value="">Select Employee</option>
                      {employeesList.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                    </select>
                  </div>
                  <div><label className="block text-sm font-semibold mb-2">Department</label>
                    <select className="w-full p-4 border rounded-2xl" value={tasks[0].dept} onChange={(e) => handleTaskChange(0, 'dept', e.target.value)}>
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
            </div>

            {tasks.map((task, index) => (
              <div key={index} className="bg-white p-8 mb-6 rounded-3xl shadow-sm border relative">
                {index > 0 && <button onClick={() => removeTaskBlock(index)} className="absolute top-4 right-4 text-red-500 font-bold hover:text-red-700">X </button>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div><label className="block text-sm font-semibold mb-2">Project Name</label><input className="w-full p-4 border rounded-2xl" placeholder="Project" onChange={(e) => handleTaskChange(index, 'client', e.target.value)} /></div>
                  <div><label className="block text-sm font-semibold mb-2">Task Title</label><input className="w-full p-4 border rounded-2xl" placeholder="Title" onChange={(e) => handleTaskChange(index, 'title', e.target.value)} /></div>
                  <div><label className="block text-sm font-semibold mb-2">Date</label><input type="date" defaultValue={task.date} className="w-full p-4 border rounded-2xl" onChange={(e) => handleTaskChange(index, 'date', e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div><label className="block text-sm font-semibold mb-2">Hours</label><input type="number" className="w-full p-4 border rounded-2xl" onChange={(e) => handleTaskChange(index, 'hrs', e.target.value)} /></div>
                  <div><label className="block text-sm font-semibold mb-2">Minutes</label><input type="number" className="w-full p-4 border rounded-2xl" onChange={(e) => handleTaskChange(index, 'mins', e.target.value)} /></div>
                  <div><label className="block text-sm font-semibold mb-2">Status</label><select className="w-full p-4 border rounded-2xl" onChange={(e) => handleTaskChange(index, 'status', e.target.value)}><option>Pending</option><option>Completed</option></select></div>
                  <div><label className="block text-sm font-semibold mb-2">Priority</label><select className="w-full p-4 border rounded-2xl" onChange={(e) => handleTaskChange(index, 'priority', e.target.value)}><option>Normal</option><option>High</option></select></div>
                </div>
                <textarea className="w-full p-4 border rounded-2xl h-24" placeholder="Description" onChange={(e) => handleTaskChange(index, 'description', e.target.value)} />
              </div>
            ))}
            <button onClick={addNewTaskBlock} className="bg-violet-100 text-violet-900 px-6 py-4 rounded-2xl font-bold mr-4">+ Add Another Task</button>
            <button onClick={submitAllTasks} className="bg-violet-900 text-white px-10 py-4 rounded-2xl font-bold">Submit All Tasks</button>
          </div>
        ) : null}
      </main>
    </div>
  );
}