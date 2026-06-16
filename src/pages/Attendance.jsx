import React, { useState } from 'react';

export default function Attendance({ employeesList }) {
  // Mock function to simulate attendance calculation
  const getStatus = (time) => {
    return time > "09:30" ? <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-black uppercase rounded-lg">Late</span> : <span className="px-2 py-1 bg-green-100 text-green-600 text-[10px] font-black uppercase rounded-lg">On-Time</span>;
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Present" value="24" color="text-green-600" />
        <StatCard title="Late Entries" value="03" color="text-red-600" />
        <StatCard title="Total Shift" value="Morning" color="text-violet-600" />
        <StatCard title="GPS Status" value="Active" color="text-blue-600" />
      </div>

      {/* 2. Main Attendance Controls */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
            <div className="flex gap-4">
                <button className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-2xl font-black transition">Check-In</button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-black transition">Check-Out</button>
            </div>
            <label className="flex items-center gap-3 bg-slate-50 px-6 py-4 rounded-2xl cursor-pointer">
                <input type="checkbox" className="w-5 h-5 accent-violet-900" />
                <span className="font-bold text-slate-600">Manual Entry (Biometric Issue)</span>
            </label>
        </div>

        {/* 3. Professional Attendance Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-100">
                <th className="pb-4">Employee</th>
                <th className="pb-4">Shift</th>
                <th className="pb-4">Check-In</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Work Hours</th>
                <th className="pb-4">Location</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-slate-700">
              {employeesList.map((emp) => (
                <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                  <td className="py-5 font-bold text-slate-900">{emp.name}</td>
                  <td className="py-5 text-xs text-slate-500 font-bold uppercase">{emp.shift || 'Morning'}</td>
                  <td className="py-5 font-mono">09:15 AM</td>
                  <td className="py-5">{getStatus("09:15")}</td>
                  <td className="py-5 font-mono">06h 45m</td>
                  <td className="py-5 text-xs text-slate-400">Office - Zone A</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
            <h3 className={`text-2xl font-black ${color}`}>{value}</h3>
        </div>
    );
}