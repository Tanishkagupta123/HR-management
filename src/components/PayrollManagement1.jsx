import React, { useState, useEffect } from "react";
import axios from "axios";

export default function PayrollManagement1() {
  const [form, setForm] = useState({
    employee: "", basicSalary: "", houseRent: "", medical: "", 
    travel: "", overtime: "", bonus: "", leaveDeduction: "", otherDeduction: "",
  });
  
  const [employees, setEmployees] = useState([]);
  const [payrollList, setPayrollList] = useState([]);

  const grossSalary = Number(form.basicSalary || 0) + Number(form.houseRent || 0) + 
                      Number(form.medical || 0) + Number(form.travel || 0) + 
                      Number(form.overtime || 0) + Number(form.bonus || 0);

  const netSalary = grossSalary - Number(form.leaveDeduction || 0) - Number(form.otherDeduction || 0);

  const fetchData = async () => {
    try {
      const empRes = await axios.get("http://localhost:8000/employees");
      const payRes = await axios.get("http://localhost:8000/payroll/all");
      
      // DEBUG: Yahan dekhein ki data array hai ya object
      console.log("Employees Data:", empRes.data); 
      
      // FIX: Agar API response object hai to .data ya .results use karein
      const empData = Array.isArray(empRes.data) ? empRes.data : (empRes.data.data || []);
      setEmployees(empData);
      
      setPayrollList(Array.isArray(payRes.data) ? payRes.data : (payRes.data.data || []));
    } catch (err) { console.error("Error fetching data:", err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.employee) return alert("Select an employee!");
    try {
      await axios.post("http://localhost:8000/payroll/save", {
        ...form, gross: grossSalary, net: netSalary
      });
      alert("Payroll Saved Successfully!");
      setForm({ employee: "", basicSalary: "", houseRent: "", medical: "", travel: "", overtime: "", bonus: "", leaveDeduction: "", otherDeduction: "" });
      fetchData();
    } catch (err) { alert("Error saving payroll."); }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="bg-white rounded-3xl shadow-md border p-8">
        <h1 className="text-4xl font-bold text-violet-900">Payroll Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
           <div className="bg-violet-50 rounded-2xl p-6 border"><p className="text-gray-500 text-sm">Total Employees</p><h2 className="text-3xl font-bold mt-2">{employees.length}</h2></div>
           <div className="bg-blue-50 rounded-2xl p-6 border"><p className="text-gray-500 text-sm">This Month</p><h2 className="text-3xl font-bold mt-2">June 2026</h2></div>
           <div className="bg-green-50 rounded-2xl p-6 border"><p className="text-gray-500 text-sm">Total Payout</p><h2 className="text-3xl font-bold mt-2">₹{payrollList.reduce((acc, curr) => acc + Number(curr.net_salary || 0), 0).toLocaleString()}</h2></div>
        </div>

        <div className="mt-12 bg-slate-50 rounded-3xl border p-8">
          <h2 className="text-2xl font-bold text-violet-900 mb-8">Salary Calculation</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-medium">Employee</label>
              <select name="employee" value={form.employee} onChange={handleChange} className="w-full mt-2 border rounded-xl p-3">
                <option value="">Select Employee</option>
                {employees.map((emp, i) => (
                  <option key={i} value={emp.name}>{emp.name}</option>
                ))}
              </select>
            </div>
            <div><label className="font-medium">Basic Salary</label><input type="number" name="basicSalary" value={form.basicSalary} onChange={handleChange} className="w-full mt-2 border rounded-xl p-3"/></div>
            <div><label className="font-medium">House Rent</label><input type="number" name="houseRent" value={form.houseRent} onChange={handleChange} className="w-full mt-2 border rounded-xl p-3"/></div>
            <div><label className="font-medium">Medical</label><input type="number" name="medical" value={form.medical} onChange={handleChange} className="w-full mt-2 border rounded-xl p-3"/></div>
            <div><label className="font-medium">Travel Allowance</label><input type="number" name="travel" value={form.travel} onChange={handleChange} className="w-full mt-2 border rounded-xl p-3"/></div>
            <div><label className="font-medium">Overtime</label><input type="number" name="overtime" value={form.overtime} onChange={handleChange} className="w-full mt-2 border rounded-xl p-3"/></div>
            <div><label className="font-medium">Bonus</label><input type="number" name="bonus" value={form.bonus} onChange={handleChange} className="w-full mt-2 border rounded-xl p-3"/></div>
            <div><label className="font-medium">Leave Deduction</label><input type="number" name="leaveDeduction" value={form.leaveDeduction} onChange={handleChange} className="w-full mt-2 border rounded-xl p-3"/></div>
            <div><label className="font-medium">Other Deduction</label><input type="number" name="otherDeduction" value={form.otherDeduction} onChange={handleChange} className="w-full mt-2 border rounded-xl p-3"/></div>
          </div>

          <div className="flex flex-wrap gap-4 mt-10">
            <button onClick={handleSave} className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold">Save Payroll</button>
            <button className="bg-red-500 text-white px-8 py-3 rounded-xl font-semibold" onClick={() => setForm({ employee: "", basicSalary: "", houseRent: "", medical: "", travel: "", overtime: "", bonus: "", leaveDeduction: "", otherDeduction: "" })}>Reset</button>
          </div>
        </div>

      {/* History Table */}
<div className="mt-12 bg-white rounded-3xl p-8 border overflow-x-auto">
  <h2 className="text-2xl font-bold mb-6 text-violet-900">Payroll History</h2>
  <table className="w-full text-left text-sm">
    <thead>
      <tr className="border-b text-slate-500">
        <th className="p-3">Employee</th>
        <th className="p-3">Basic</th>
        <th className="p-3">HRA</th>
        <th className="p-3">Med</th>
        <th className="p-3">Travel</th>
        <th className="p-3">Overtime</th>
        <th className="p-3">Bonus</th>
        <th className="p-3 text-red-500">Deductions</th>
        <th className="p-3">Gross</th>
        <th className="p-3 text-blue-700">Net</th>
      </tr>
    </thead>
    <tbody>
      {payrollList.map((p, i) => (
        <tr key={i} className="border-b hover:bg-slate-50">
          <td className="p-3 font-bold">{p.employee_name}</td>
          <td className="p-3">₹{p.basic_salary}</td>
          <td className="p-3">₹{p.house_rent}</td>
          <td className="p-3">₹{p.medical}</td>
          <td className="p-3">₹{p.travel}</td>
          <td className="p-3">₹{p.overtime}</td>
          <td className="p-3">₹{p.bonus}</td>
          {/* Deductions: Leave + Other */}
          <td className="p-3 text-red-600 font-semibold">
             ₹{Number(p.leave_deduction || 0) + Number(p.other_deduction || 0)}
          </td>
          <td className="p-3 font-semibold">₹{p.gross_salary}</td>
          <td className="p-3 text-blue-700 font-bold">₹{p.net_salary}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      </div>
    </div>
  );
}