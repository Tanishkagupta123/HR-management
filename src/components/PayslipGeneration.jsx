import React, { useState, useEffect } from "react";
import axios from "axios";
import { Download, Mail, FileText, Search } from "lucide-react"; 

export default function PayslipGeneration() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("June 2026");
  const [employees, setEmployees] = useState([]); 

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Backend se Payroll table ka real data laane ka function
  const fetchPayslips = async () => {
    try {
      // route 'http://localhost:8000/payslip/all' use karein
      const res = await axios.get(`http://localhost:8000/payslip/all?search=${searchTerm}&month=${selectedMonth}`);
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchPayslips();
  }, [searchTerm, selectedMonth]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* 1. Header & Stats */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-violet-900">Payslip Generation</h1>
          <p className="text-slate-500 mt-1">Manage and distribute employee salary slips.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-2xl border shadow-sm text-center px-6">
            <p className="text-xs text-slate-400 uppercase font-bold">Processed</p>
            <h3 className="text-2xl font-bold text-green-600">{employees.filter(e=>e.status==="Generated").length}</h3>
          </div>
          <div className="bg-white p-4 rounded-2xl border shadow-sm text-center px-6">
            <p className="text-xs text-slate-400 uppercase font-bold">Pending</p>
            <h3 className="text-2xl font-bold text-yellow-600">{employees.filter(e=>e.status==="Pending").length}</h3>
          </div>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border shadow-sm mb-8 flex flex-wrap gap-4 items-center">
        <div className="flex items-center bg-slate-100 px-4 py-2 rounded-xl border w-full md:w-64">
          <Search size={18} className="text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search employee..." 
            className="bg-transparent outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select 
          className="px-4 py-2 rounded-xl border bg-white outline-none"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {months.map((m) => (
            <option key={m} value={`${m} 2026`}>{m} 2026</option>
          ))}
        </select>
        
        <button 
          onClick={() => { setSearchTerm(""); setSelectedMonth("June 2026"); }}
          className="px-6 py-2 rounded-xl border border-slate-300 font-semibold hover:bg-slate-100"
        >
          Reset
        </button>
      </div>

      {/* 3. Table */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-5 font-semibold text-slate-600">Employee Name</th>
              <th className="p-5 font-semibold text-slate-600">Basic Salary</th>
              <th className="p-5 font-semibold text-slate-600">Net Salary</th>
              <th className="p-5 font-semibold text-slate-600">Status</th>
              <th className="p-5 font-semibold text-slate-600 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp.id} className="border-t hover:bg-slate-50">
                  <td className="p-5 font-bold text-slate-800">{emp.employee_name}</td>
                  <td className="p-5 text-slate-600">₹{emp.basic_salary}</td>
                  <td className="p-5 font-bold text-violet-600">₹{emp.net_salary}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${emp.status === "Generated" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="p-5 flex justify-center gap-3">
                    <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-600"><FileText size={18} /></button>
                    <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-600"><Download size={18} /></button>
                    <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-600"><Mail size={18} /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="p-10 text-center text-slate-400">No records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}