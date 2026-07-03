import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/as group logo.jpeg';

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [tasksList, setTasksList] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [hiringList, setHiringList] = useState([]);   
  const [tasks, setTasks] = useState([{ assign_to: '', dept: '', client_name: '', title: '', task_date: '', hours: 0, minutes: 0, status: 'Pending', priority: 'Normal', description: '' }]);
  const [employee, setEmployee] = useState({ name: '', password: '', department: '', position: 'Employee', email: '', phone: '', designation: '', joining_date: '' });
  const [departments, setDepartments] = useState(() => JSON.parse(localStorage.getItem('companyDepartments')) || ['IT', 'HR', 'Sales']);

  useEffect(() => { localStorage.setItem('companyDepartments', JSON.stringify(departments)); }, [departments]);

  const fetchData = async () => {
    try {
      const tRes = await axios.get('http://localhost:8000/tasks');
      const eRes = await axios.get('http://localhost:8000/employees');
      setTasksList(tRes.data);
      setEmployeesList(eRes.data);
      const hRes = await axios.get('http://localhost:8000/hiring/all');
setHiringList(hRes.data);
    } catch (err) { console.error("Error fetching data"); }
  };

  useEffect(() => { fetchData(); }, []);

  const addDepartment = () => {
    const newDept = prompt("Enter new department name:");
    if (newDept && !departments.includes(newDept)) {
        setDepartments([...departments, newDept]);
    } else if (departments.includes(newDept)) {
        alert("This department already exists!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/');
  };

  const handleOnboard = async () => {
    if (!employee.name.trim() || !employee.email.trim() || !employee.department) {
      alert("Please Name, Email, aur Department zaroor bharein!");
      return;
    }
    try {
      await axios.post('http://localhost:8000/employees', {
        ...employee,
        phone_number: employee.phone
      });
      alert("Employee Successfully Onboarded!");
      setEmployee({ name: '', password: '', department: '', position: 'Employee', email: '', phone: '', designation: '', joining_date: '' });
      fetchData();
    } catch (err) { alert("Error! Check console."); }
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
    } catch (err) { alert("Submit nahi hua!"); }
  };

  const menuItems = [
    { name: 'Add Employee', path: '/admin/add-employee' },
    { name: 'All Employees', path: '/admin/all-employees' },
    { name: 'Attendance', path: '/admin/attendance' },
    { name: 'Leave Management', path: '/admin/leave-management' },
    // { name: 'Payroll Management', path: '/admin/payroll-management' },
    { name: 'Payroll Management 1', path: '/admin/payroll-management1' },
    { name: 'Payslip Generation', path: '/admin/payslip-generation' },
    // { name: 'PF / ESI / Tax Management', path: '/admin/pf-esi-tax-management' },
    { name: 'Performance Management', path: '/admin/performance-management' },
    { name: 'Employee Self Service', path: '/admin/ess' },
    { name: 'Team Collaboration', path: '/admin/team-collaboration' },
    { name: 'Task & Workflow', path: '/admin/task-workflow-management' },
    { name: 'Add Task', path: '/admin/add-task' },
    { name: 'Data of Tasks', path: '/admin/data-tasks' },
    { name: 'Recruitment', path: '/admin/hiring' }
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-72 bg-white border-r shadow-sm flex flex-col">
        {/* Main Content Area (Menu) */}
        <div className="flex-grow overflow-y-auto">
            <div className="flex items-center gap-4 p-8">
               <img src={logo} alt="Logo" className="w-16 h-16 object-contain rounded-xl" />
               <h1 className="font-extrabold text-2xl text-violet-950 tracking-tight">AS GROUP</h1>
            </div>
            <nav className="flex flex-col px-4 gap-1">
              {menuItems.map(item => (
                <Link key={item.path} to={item.path} className={`px-6 py-3 rounded-xl font-bold transition ${location.pathname === item.path ? 'bg-violet-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                  {item.name}
                </Link>
              ))}
            </nav>
        </div>

        {/* LOGOUT BUTTON - Fixed at the bottom */}
        <div className="p-4 border-t border-slate-100">
            <button onClick={handleLogout} className="w-full px-6 py-4 rounded-xl font-bold text-red-600 hover:bg-red-50 transition border border-red-100">
                Logout
            </button>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <Outlet context={{ tasksList, employeesList, tasks, setTasks, employee, setEmployee, departments, setDepartments, addDepartment, fetchData, handleOnboard, handleTaskChange, submitAllTasks,hiringList}} /> 
      </main>
    </div>
  );
}