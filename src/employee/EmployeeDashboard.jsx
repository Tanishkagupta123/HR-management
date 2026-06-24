import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/as group logo.jpeg'; 

export default function EmployeeDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Employee menu items
  const menuItems = [
    { name: 'My Profile', path: '/dashboard' },
    { name: 'My Tasks', path: '/dashboard/tasks' },
    { name: 'Apply Leave', path: '/dashboard/apply-leave' },
    { name: 'Attendance', path: '/dashboard/attendance' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('user'); // User info remove karo
    navigate('/'); 
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* SIDEBAR - Bilkul Admin jaisa */}
      <aside className="w-72 bg-white border-r shadow-sm flex flex-col justify-between">
        <div>
            <div className="flex items-center gap-4 p-8">
               <img src={logo} alt="Logo" className="w-16 h-16 object-contain rounded-xl" />
               <h1 className="font-extrabold text-2xl text-violet-950 tracking-tight">AS GROUP</h1>
            </div>
            <nav className="flex flex-col px-4 gap-2">
              {menuItems.map(item => (
                <Link key={item.path} to={item.path} className={`px-6 py-4 rounded-xl font-bold transition ${location.pathname === item.path ? 'bg-violet-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                  {item.name}
                </Link>
              ))}
            </nav>
        </div>

        {/* LOGOUT BUTTON */}
        <div className="p-4">
            <button onClick={handleLogout} className="w-full px-6 py-4 rounded-xl font-bold text-red-600 hover:bg-red-50 transition border border-red-100">
                Logout
            </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-10 overflow-y-auto">
        <Outlet /> 
      </main>
    </div>
  );
}