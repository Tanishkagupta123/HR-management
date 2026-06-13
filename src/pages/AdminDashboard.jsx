import { useState, useEffect } from 'react';
import axios from 'axios';
import AddEmployee from './AddEmployee';
import AddTask from './AddTask';
import DataOfTasks from './DataOfTasks';
import logo from '../assets/as group logo.jpeg'; 

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState('Add Employee');
  const [isOpen, setIsOpen] = useState(false); // Mobile menu control
  const [tasksList, setTasksList] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [tasks, setTasks] = useState([{ assign_to: '', dept: '', client_name: '', title: '', task_date: '', hours: 0, minutes: 0, status: 'Pending', priority: 'Normal', description: '' }]);
  const [employee, setEmployee] = useState({ name: '', password: '', department: '', position: 'Admin' });
  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem('companyDepartments');
    return saved ? JSON.parse(saved) : ['IT', 'HR', 'Sales'];
  });

  useEffect(() => {
    localStorage.setItem('companyDepartments', JSON.stringify(departments));
  }, [departments]);

  const fetchData = async () => {
    try {
      const tRes = await axios.get('http://localhost:8000/tasks');
      const eRes = await axios.get('http://localhost:8000/employees');
      setTasksList(tRes.data);
      setEmployeesList(eRes.data);
    } catch (err) { console.error("Error fetching data"); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    window.location.href = '/'; 
  };

  const handleOnboard = async () => {
    if (!employee.name.trim() || !employee.password.trim() || !employee.department) {
      alert("Please saari fields bharein!");
      return;
    }
    await axios.post('http://localhost:8000/employees', employee);
    alert("Employee Added!");
    setEmployee({ name: '', password: '', department: '', position: 'Admin' });
    fetchData();
  };

  const handleTaskChange = (i, field, val) => {
    const newTasks = [...tasks];
    newTasks[i][field] = val;
    setTasks(newTasks);
  };

  const submitAllTasks = async () => {
    if (tasks.some(t => !t.client_name || !t.title)) {
      alert("Please Project Name aur Title bharein!");
      return;
    }
    try {
      await axios.post('http://localhost:8000/tasks', tasks);
      alert("Tasks Successfully Submitted!");
      setTasks([{ assign_to: '', dept: '', client_name: '', title: '', task_date: '', hours: 0, minutes: 0, status: 'Pending', priority: 'Normal', description: '' }]);
      fetchData();
    } catch (err) {
      console.error("Backend Error:", err);
      alert("Submit nahi hua! Console check karein.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50">
      
      {/* Mobile Header (Hamburger Menu) */}
      <div className="md:hidden p-4 bg-white flex justify-between items-center shadow-sm">
        <h1 className="font-extrabold text-lg">AS GROUP</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-3xl text-violet-950">☰</button>
      </div>

      {/* Sidebar */}
      <aside className={`${isOpen ? 'block' : 'hidden'} md:block w-full md:w-72 bg-white border-r border-slate-100 flex flex-col justify-between shadow-sm h-full`}>
        <div className="flex flex-col w-full">
          
          {/* Logo Bada aur Title Bold */}
          <div className="flex items-center gap-4 p-8 mb-6">
             <img src={logo} alt="Logo" className="w-16 h-16 object-contain rounded-xl" />
             <h1 className="font-extrabold text-2xl text-violet-950 tracking-tight">AS GROUP</h1>
          </div>

          <div className="flex flex-col w-full px-4 gap-2">
            {['Add Employee', 'Add Task', 'Data of Tasks'].map(item => (
              <div 
                key={item} 
                onClick={() => { setActivePage(item); setIsOpen(false); }} 
                className={`w-full px-6 py-4 cursor-pointer rounded-xl font-bold transition-all duration-200 text-lg
                ${activePage === item 
                  ? 'bg-violet-900 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-violet-900'}`
                }
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          <button onClick={handleLogout} className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition">Logout</button>
        </div>
      </aside>
      
      <main className="flex-1 p-10 overflow-y-auto">
        {activePage === 'Add Employee' ? (
          <AddEmployee employee={employee} setEmployee={setEmployee} handleOnboard={handleOnboard} departments={departments} addDepartment={() => { const d = prompt("Enter new department:"); if(d && !departments.includes(d)) setDepartments([...departments, d]); }} />
        ) : activePage === 'Add Task' ? (
          <AddTask tasks={tasks} handleTaskChange={handleTaskChange} submitAllTasks={submitAllTasks} employeesList={employeesList} departments={departments} addNewTaskBlock={() => setTasks([...tasks, { assign_to: '', dept: '', client_name: '', title: '', task_date: '', hours: 0, minutes: 0, status: 'Pending', priority: 'Normal', description: '' }])} removeTaskBlock={(i) => setTasks(tasks.filter((_, idx) => idx !== i))} />
        ) : (
          <DataOfTasks tasksList={tasksList} onDelete={async (id) => { await axios.delete(`http://localhost:8000/tasks/${id}`); fetchData(); }} refreshData={fetchData} />
        )}
      </main>
    </div>
  );
}