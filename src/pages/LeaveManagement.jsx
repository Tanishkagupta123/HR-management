import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState([]);
  
  // Dummy data for visual proof
  const employeesData = [
    { name: 'Tanishka ', sick: '2/5', casual: '1/10', paid: '0/12' },
    { name: 'Ruchi Sharma', sick: '0/5', casual: '5/10', paid: '2/12' }
  ];

  const holidays = [
    { date: 'AUG 15', name: 'Independence Day' },
    { date: 'OCT 02', name: 'Gandhi Jayanti' }
  ];

  
  useEffect(() => {
    // API call for pending requests
    setLeaves([
      { _id: 1, employeeName: 'Tanishka', type: 'Sick', reason: 'Fever' },
      { _id: 2, employeeName: 'Ruchi Sharma', type: 'Casual', reason: 'Personal' }
    ]);
  }, []);

  // Function to handle Approval/Rejection
  const handleAction = (id, status) => {
    alert(`Request ${status}ed successfully!`);
    setLeaves(leaves.filter(l => l._id !== id)); // List se refresh karne ke liye
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen space-y-8">
      {/* 1. EMPLOYEE LEAVE LEDGER (Individual Tracking) */}
      <div className="bg-white p-8 rounded-3xl border shadow-sm">
        <h2 className="text-lg font-black text-violet-950 mb-6">Employee Leave Ledger (Used / Limit)</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 text-[10px] uppercase border-b border-slate-100">
              <th className="pb-4">Employee</th>
              <th className="pb-4">Sick (Used/Limit)</th>
              <th className="pb-4">Casual (Used/Limit)</th>
              <th className="pb-4">Paid (Used/Limit)</th>
            </tr>
          </thead>
          <tbody>
            {employeesData.map((e, i) => (
              <tr key={i} className="border-b border-slate-50">
                <td className="py-4 font-black text-sm">{e.name}</td>
                <td className="py-4 font-bold text-violet-600">{e.sick}</td>
                <td className="py-4 font-bold text-violet-600">{e.casual}</td>
                <td className="py-4 font-bold text-violet-600">{e.paid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. APPROVAL WORKFLOW */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border shadow-sm">
          <h2 className="text-lg font-black text-violet-950 mb-6">Pending Approvals</h2>
          {leaves.map(l => (
            <div key={l._id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl mb-4 border">
              <div>
                <p className="font-black text-sm">{l.employeeName}</p>
                <p className="text-[10px] text-slate-400 font-bold">{l.type} • {l.reason}</p>
              </div>
              <div className="flex gap-2">
                {/* APPROVE BUTTON */}
                <button 
                  onClick={() => handleAction(l._id, 'Approve')} 
                  className="bg-green-100 text-green-700 px-4 py-1.5 rounded-lg font-black text-[10px] hover:bg-green-200 transition"
                >APPROVE</button>
                {/* REJECT BUTTON */}
                <button 
                  onClick={() => handleAction(l._id, 'Reject')} 
                  className="bg-red-100 text-red-700 px-4 py-1.5 rounded-lg font-black text-[10px] hover:bg-red-200 transition"
                >REJECT</button>
              </div>
            </div>
          ))}
        </div>

        {/* 3. UPCOMING HOLIDAYS */}
        <div className="bg-white p-8 rounded-3xl border shadow-sm">
          <h2 className="text-lg font-black text-violet-950 mb-6">Upcoming Holidays</h2>
          {holidays.map((h, i) => (
            <div key={i} className="flex items-center gap-4 mb-4 p-4 bg-violet-50 rounded-2xl border-l-4 border-violet-500">
              <div className="text-center">
                <p className="text-[10px] font-black text-violet-600">{h.date.split(' ')[0]}</p>
                <p className="text-lg font-black">{h.date.split(' ')[1]}</p>
              </div>
              <p className="font-black text-sm">{h.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}