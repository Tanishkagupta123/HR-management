import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function EmployeeAttendance() {
  const [loading, setLoading] = useState(false);
  const [userStatus, setUserStatus] = useState(null); 
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Narmadapuram Coordinates (Backend ke saath match kiye)
  const OFFICE_LOC = { lat: 22.7426385, lon: 77.6838617 };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  const markAttendance = async (type) => {
    // Conflict Rokne ka Logic
    if (type === 'CHECK-IN' && userStatus?.checkIn) return;
    if (type === 'CHECK-OUT' && userStatus?.checkOut) return;

    setLoading(true);
    if (!navigator.geolocation) {
      alert("Browser location support nahi kar raha.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const distance = getDistance(latitude, longitude, OFFICE_LOC.lat, OFFICE_LOC.lon);

      // 70 meter ka geofencing check
      if (distance > 4000) {
        alert(`Attendance Failed! Aap office se ${Math.round(distance)}m door hain.`);
      } else {
        try {
          await axios.post('http://localhost:8000/attendance/mark', { 
            student_id: user.id, // Backend field ke hisaab se
            type, 
            lat: latitude, 
            lon: longitude,
            mode: 'GPS' 
          });
          alert("Attendance marked successfully!");
          fetchStatus();
        } catch (err) { alert("Server Error!"); }
      }
      setLoading(false);
    }, () => { alert("Location access on karein!"); setLoading(false); });
  };

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/attendance/employee/${user.id}`);
      setUserStatus(res.data);
    } catch (err) { console.error("Error fetching status"); }
  };

  useEffect(() => { fetchStatus(); }, []);

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border shadow-sm text-center">
      <h2 className="text-2xl font-black text-violet-950 mb-6">My Attendance</h2>

      {/* SUMMARY DASHBOARD */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-green-50 p-3 rounded-2xl border border-green-100">
          <p className="text-[9px] text-green-600 font-black uppercase">Present</p>
          <p className="text-xl font-black text-green-700">{userStatus?.present || 0}</p>
        </div>
        <div className="bg-red-50 p-3 rounded-2xl border border-red-100">
          <p className="text-[9px] text-red-600 font-black uppercase">Absent</p>
          <p className="text-xl font-black text-red-700">{userStatus?.absent || 0}</p>
        </div>
        <div className="bg-violet-50 p-3 rounded-2xl border border-violet-100">
          <p className="text-[9px] text-violet-600 font-black uppercase">Rate</p>
          <p className="text-xl font-black text-violet-700">{userStatus?.percent || 0}%</p>
        </div>
      </div>

      <div className="space-y-4">
        {!userStatus?.checkIn ? (
          <button onClick={() => markAttendance('CHECK-IN')} disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black">
            {loading ? 'Locating...' : 'CHECK-IN (GPS)'}
          </button>
        ) : !userStatus?.checkOut ? (
          <button onClick={() => markAttendance('CHECK-OUT')} disabled={loading} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black">
            {loading ? 'Locating...' : 'CHECK-OUT (GPS)'}
          </button>
        ) : (
          <p className="text-green-600 font-black text-lg p-4 bg-green-50 rounded-2xl">Attendance Completed!</p>
        )}
      </div>
    </div>
  );
}