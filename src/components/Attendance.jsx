import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

export default function Attendance() {
  const { employeesList } = useOutletContext();
  const [records, setRecords] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filterDate, setFilterDate] = useState(null);
  const STORAGE_KEY = 'manualAttendanceRecords';

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const getBucketKey = (year, month) => `${year}-${String(month + 1).padStart(2, '0')}`;

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const buildDateCounts = (recordsObj, year, month) => {
    const counts = {};
    Object.values(recordsObj || {}).forEach((rec) => {
      if (!rec || !rec.date) return;
      const d = new Date(rec.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    return counts;
  };

  const calculateWorkHours = (inTime, outTime) => {
    if (!inTime || !outTime) return '--';
    const [h1, m1] = inTime.split(':').map(Number);
    const [h2, m2] = outTime.split(':').map(Number);
    const totalMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
  };

  const getDayName = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '--';
    return date.toLocaleDateString('en-GB', { weekday: 'short' });
  };

  const getMonthNameFromDate = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '--';
    return monthNames[date.getMonth()] || '--';
  };

  const getYearFromDate = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '--';
    return date.getFullYear();
  };

  const readManualRecords = (year, month) => {
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return all[getBucketKey(year, month)] || {};
    } catch {
      return {};
    }
  };

  const saveManualRecords = (year, month, data) => {
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      all[getBucketKey(year, month)] = data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ [getBucketKey(year, month)]: data }));
    }
  };

  const normalizeRemoteRecords = (data) => {
    if (!data) return {};
    if (Array.isArray(data)) {
      return data.reduce((acc, item) => {
        const key = item.empId || item.id || item.employee_id;
        if (key) acc[key] = item;
        return acc;
      }, {});
    }
    if (typeof data === 'object') return data;
    return {};
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' });
  };

  const fetchAttendanceData = async (month) => {
    const manual = readManualRecords(selectedYear, month);
    try {
      const res = await axios.get('http://localhost:8000/attendance/today', {
        params: { year: selectedYear, month: month + 1 }
      });
      const remote = normalizeRemoteRecords(res.data);
      setRecords({ ...remote, ...manual });
    } catch (err) {
      console.error('Data sync error', err);
      setRecords(manual);
    }
  };

  useEffect(() => {
    fetchAttendanceData(selectedMonth);
    const interval = setInterval(() => fetchAttendanceData(selectedMonth), 5000);
    return () => clearInterval(interval);
  }, [selectedMonth, selectedYear]);

  const handleAction = async (empId, type) => {
    setLoadingMap((prev) => ({ ...prev, [empId]: true }));
    const currentTime = getCurrentTime();
    const updatedRecords = { ...records };
    const rec = { ...updatedRecords[empId] };

    if (type === 'CHECK-IN') {
      rec.checkIn = currentTime;
      rec.status = 'IN';
      rec.mode = 'Manual';
    } else {
      rec.checkOut = currentTime;
      rec.status = rec.checkIn ? 'COMPLETED' : 'OUT';
      rec.mode = 'Manual';
    }

    rec.date = filterDate || rec.date || new Date().toISOString().slice(0, 10);
    updatedRecords[empId] = rec;
    setRecords(updatedRecords);
    saveManualRecords(selectedYear, selectedMonth, updatedRecords);

    try {
      await axios.post('http://localhost:8000/attendance/mark', {
        empId,
        student_id: empId,
        type,
        mode: 'Manual',
        year: selectedYear,
        month: selectedMonth + 1,
        date: rec.date
      });
      alert(`${type} Success!`);
      fetchAttendanceData(selectedMonth);
    } catch (err) {
      alert('Manual record saved locally.');
    } finally {
      setLoadingMap((prev) => ({ ...prev, [empId]: false }));
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border shadow-sm">
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="min-w-[260px]">
          <label className="block text-[10px] uppercase text-slate-400 mb-2">Search Employee</label>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name"
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase text-slate-400 mb-2">Select Year</label>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setSelectedYear(selectedYear - 1)}
              className="bg-slate-100 px-2 py-2 rounded text-sm font-bold"
            >
              ← Prev
            </button>
            <span className="font-bold text-lg w-16 text-center">{selectedYear}</span>
            <button
              onClick={() => setSelectedYear(selectedYear + 1)}
              className="bg-slate-100 px-2 py-2 rounded text-sm font-bold"
            >
              Next →
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase text-slate-400 mb-2">Select Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border rounded px-3 py-2 text-sm font-bold"
          >
            {monthNames.map((month, idx) => (
              <option key={idx} value={idx}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="text-slate-500 text-sm font-bold">
          Showing daily attendance for {monthNames[selectedMonth]} {selectedYear}
        </div>
        <div className="mt-4">
          <div className="w-full max-w-md bg-white p-3 rounded-lg border">
            <div className="text-sm font-bold mb-2">{monthNames[selectedMonth]} {selectedYear} — Dates with attendance</div>
            <div className="grid grid-cols-7 gap-1 text-xs text-center">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} className="font-black text-slate-400">{d}</div>
              ))}
              {(() => {
                const startDay = new Date(selectedYear, selectedMonth, 1).getDay();
                const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
                const cells = [];
                const dateCounts = buildDateCounts(records, selectedYear, selectedMonth);

                for (let i = 0; i < startDay; i++) cells.push(<div key={`empty-${i}`} />);

                for (let day = 1; day <= daysInMonth; day++) {
                  const dateKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                  const count = dateCounts[dateKey] || 0;
                  const selected = filterDate === dateKey;
                  cells.push(
                    <button
                      key={dateKey}
                      onClick={() => setFilterDate(selected ? null : dateKey)}
                      className={`py-2 rounded ${count ? 'bg-violet-50' : ''} ${selected ? 'ring-2 ring-violet-400' : ''}`}
                    >
                      <div className="text-sm font-bold">{day}</div>
                      {count ? <div className="text-[10px] text-violet-600">{count}</div> : <div className="text-[10px] text-slate-300">-</div>}
                    </button>
                  );
                }

                return cells;
              })()}
            </div>
            {filterDate ? (
              <div className="mt-2 text-sm">
                Showing records for <span className="font-bold">{filterDate}</span>
                <button onClick={() => setFilterDate(null)} className="ml-3 text-xs text-red-600">Clear</button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="text-slate-400 text-[10px] uppercase border-b border-slate-100">
            <th className="pb-4">Employee</th>
            <th className="pb-4">Shift</th>
            <th className="pb-4">Day</th>
            <th className="pb-4">Date</th>
            <th className="pb-4">Month</th>
            <th className="pb-4">Year</th>
            <th className="pb-4">Check-In</th>
            <th className="pb-4">Check-Out</th>
            <th className="pb-4">Work Hours</th>
            <th className="pb-4">Status</th>
            <th className="pb-4">Mode</th>
            <th className="pb-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {employeesList
            .filter((emp) => emp.name.toLowerCase().includes(searchTerm.trim().toLowerCase()))
            .filter((emp) => {
              if (!filterDate) return true;
              const rec = records[emp.id] || {};
              return rec.date === filterDate;
            })
            .map((emp) => {
              const rec = records[emp.id] || {};
            const hours = rec.checkIn && rec.checkOut ? calculateWorkHours(rec.checkIn, rec.checkOut) : '--';
            const isLocked = rec.mode === 'Biometric' || rec.mode === 'GPS';
            const loading = loadingMap[emp.id];

            return (
              <tr key={emp.id} className="border-b border-slate-50">
                <td className="py-5 font-bold">{emp.name}</td>
                <td className="py-5 text-xs font-black uppercase text-violet-600">{emp.shift || 'MORNING'}</td>
                <td className="py-5 font-mono">{getDayName(rec.date)}</td>
                <td className="py-5 font-mono">{rec.date || '--:--'}</td>
                <td className="py-5 font-mono">{getMonthNameFromDate(rec.date)}</td>
                <td className="py-5 font-mono">{getYearFromDate(rec.date)}</td>
                <td className="py-5 font-mono">{rec.checkIn || '--:--'}</td>
                <td className="py-5 font-mono">{rec.checkOut || '--:--'}</td>
                <td className="py-5 font-bold text-violet-600">{hours}</td>
                <td className="py-5">
                  <span className={`px-2 py-1 rounded text-[10px] font-black ${rec.status === 'LATE' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {rec.status || 'PENDING'}
                  </span>
                </td>
                <td className="py-5 text-xs font-bold text-slate-500">{rec.mode || 'Waiting...'}</td>
                <td className="py-5 flex gap-2">
                  {isLocked ? (
                    <span className="text-[10px] text-green-600 font-black uppercase">LOCKED ({rec.mode})</span>
                  ) : !rec.checkIn ? (
                    <button onClick={() => handleAction(emp.id, 'CHECK-IN')} disabled={loading} className="bg-blue-600 text-white px-2 py-1 rounded text-[9px] font-black">
                      {loading ? 'WAIT' : 'IN'}
                    </button>
                  ) : !rec.checkOut ? (
                    <button onClick={() => handleAction(emp.id, 'CHECK-OUT')} disabled={loading} className="bg-orange-600 text-white px-2 py-1 rounded text-[9px] font-black">
                      {loading ? 'WAIT' : 'OUT'}
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold">DONE</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}