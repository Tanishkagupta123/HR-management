import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

export default function Attendance() {
  // Outlet se employeesList nikaal liya
  const { employeesList } = useOutletContext();
  const [records, setRecords] = useState({});

  // Work Hour Calculation Function
  const calculateWorkHours = (inTime, outTime) => {
    if (!inTime || !outTime) return '--';
    const [h1, m1] = inTime.split(':').map(Number);
    const [h2, m2] = outTime.split(':').map(Number);
    const totalMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
  };

  const fetchAttendanceData = async () => {
    try {
      const res = await axios.get('http://localhost:8000/attendance/today');
      setRecords(res.data);
    } catch (err) {
      console.error("Data sync error", err);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
    const interval = setInterval(fetchAttendanceData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (empId, type) => {
    try {
      await axios.post('http://localhost:8000/attendance/mark', { empId, type, mode: 'Manual' });
      alert(`${type} Success!`);
      fetchAttendanceData();
    } catch (err) {
      alert("API Error");
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="text-slate-400 text-[10px] uppercase border-b border-slate-100">
            <th className="pb-4">Employee</th>
            <th className="pb-4">Shift</th>
            <th className="pb-4">Check-In</th>
            <th className="pb-4">Check-Out</th>
            <th className="pb-4">Work Hours</th>
            <th className="pb-4">Status</th>
            <th className="pb-4">Mode</th>
            <th className="pb-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {employeesList.map((emp) => {
            const rec = records[emp.id] || {};
            const hours = rec.checkIn && rec.checkOut ? calculateWorkHours(rec.checkIn, rec.checkOut) : '--';
            
            return (
              <tr key={emp.id} className="border-b border-slate-50">
                <td className="py-5 font-bold">{emp.name}</td>
                <td className="py-5 text-xs font-black uppercase text-violet-600">{emp.shift || 'MORNING'}</td>
                <td className="py-5 font-mono">{rec.checkIn || '--:--'}</td>
                <td className="py-5 font-mono">{rec.checkOut || '--:--'}</td>
                <td className="py-5 font-bold text-violet-600">{hours}</td>
                <td className="py-5">
                  <span className={`px-2 py-1 rounded text-[10px] font-black ${rec.status === 'LATE' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {rec.status || 'PENDING'}
                  </span>
                </td>
                <td className="py-5 text-xs font-bold text-slate-500">
                  {rec.mode || 'Waiting...'}
                </td>
                <td className="py-5 flex gap-2">
                  {rec.mode === 'Biometric' ? (
                    <span className="text-[10px] text-green-600 font-black">LOCKED (BIO)</span>
                  ) : !rec.checkIn ? (
                    <button onClick={() => handleAction(emp.id, 'CHECK-IN')} className="bg-blue-600 text-white px-2 py-1 rounded text-[9px] font-black">IN</button>
                  ) : !rec.checkOut ? (
                    <button onClick={() => handleAction(emp.id, 'CHECK-OUT')} className="bg-orange-600 text-white px-2 py-1 rounded text-[9px] font-black">OUT</button>
                  ) : <span className="text-[10px] text-slate-400 font-bold">DONE</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}