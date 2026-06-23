import React from 'react';
import { useOutletContext } from 'react-router-dom'; // 1. Ye import zaroori hai

export default function AllEmployees() {
  // 2. Props hataye aur context se data nikala
  const { employeesList } = useOutletContext(); 
  
  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
      <h1 className="text-2xl font-black text-slate-900 mb-8">All Employees Directory</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-100">
              <th className="pb-4 font-black">Emp ID</th>
              <th className="pb-4 font-black">Profile</th>
              <th className="pb-4 font-black">Name</th>
              <th className="pb-4 font-black">Role</th>
              <th className="pb-4 font-black">Email</th>
              <th className="pb-4 font-black">Phone</th>
              <th className="pb-4 font-black">Department</th>
              <th className="pb-4 font-black">Designation</th>
              <th className="pb-4 font-black">Joining Date</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium text-slate-700">
            {/* 3. Ab yahan employeesList context se aayega */}
            {employeesList && employeesList.length > 0 ? (
              employeesList.map((emp) => (
                <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                  <td className="py-5 font-mono text-xs text-slate-500">{emp.id || 'AS-000'}</td>
                  
                  <td className="py-3">
                    {emp.profile_pic ? (
                      <img src={emp.profile_pic} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-[10px] font-black text-violet-900">
                        {emp.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  
                  <td className="py-5 font-bold text-slate-900">{emp.name}</td>
                  <td className="py-5 text-violet-700 font-bold">{emp.position || '—'}</td>
                  <td className="py-5">{emp.email || '—'}</td>
                  <td className="py-5">{emp.phone || '—'}</td>
                  <td className="py-5">{emp.department || '—'}</td>
                  <td className="py-5">{emp.designation || '—'}</td>
                  <td className="py-5">{emp.joining_date || '—'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-10 text-center text-slate-400">No employees onboarded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}