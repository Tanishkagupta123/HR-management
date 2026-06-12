import { useState, useEffect } from 'react';
import axios from 'axios';
import AddEmployee from './AddEmployee';
import AddTask from './AddTask';
import DataOfTasks from './DataOfTasks';

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState('Add Employee');
  const [tasksList, setTasksList] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  
  // Tasks state updated with correct fields
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

  // API Integration logic
  const submitAllTasks = async () => {
    if (tasks.some(t => !t.client_name || !t.title)) {
      alert("Please Project Name aur Title bharein!");
      return;
    }

    try {
      // Backend ko seedha 'tasks' state bhej rahe hain
      await axios.post('http://localhost:8000/tasks', tasks);
      alert("Tasks Successfully Submitted!");
      
      // Form reset
      setTasks([{ assign_to: '', dept: '', client_name: '', title: '', task_date: '', hours: 0, minutes: 0, status: 'Pending', priority: 'Normal', description: '' }]);
      fetchData();
    } catch (err) {
      console.error("Backend Error:", err);
      alert("Submit nahi hua! Console (F12) check karein.");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white p-6 border-r flex flex-col justify-between">
        <div>
          <h1 className="font-extrabold text-2xl mb-10 text-violet-950">AS GROUP</h1>
          {['Add Employee', 'Add Task', 'Data of Tasks'].map(item => (
            <div key={item} onClick={() => setActivePage(item)} className={`p-3 mb-2 cursor-pointer rounded-xl font-bold ${activePage === item ? 'bg-violet-900 text-white' : 'text-slate-500'}`}>{item}</div>
          ))}
        </div>
        <button onClick={handleLogout} className="bg-red-50 text-red-600 p-3 rounded-xl font-bold hover:bg-red-100 transition">Logout</button>
      </aside>
      <main className="flex-1 p-10 overflow-y-auto">
        {activePage === 'Add Employee' ? (
          <AddEmployee employee={employee} setEmployee={setEmployee} handleOnboard={handleOnboard} departments={departments} addDepartment={() => { const d = prompt("Enter new department:"); if(d && !departments.includes(d)) setDepartments([...departments, d]); }} />
        ) : activePage === 'Add Task' ? (
          <AddTask tasks={tasks} handleTaskChange={handleTaskChange} submitAllTasks={submitAllTasks} employeesList={employeesList} departments={departments} addNewTaskBlock={() => setTasks([...tasks, { assign_to: '', dept: '', client_name: '', title: '', task_date: '', hours: 0, minutes: 0, status: 'Pending', priority: 'Normal', description: '' }])} removeTaskBlock={(i) => setTasks(tasks.filter((_, idx) => idx !== i))} />
        ) : (
          <DataOfTasks tasksList={tasksList} />
        )}
      </main>
    </div>
  );
}