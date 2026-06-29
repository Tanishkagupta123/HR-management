import React from "react";

export default function PayslipGeneration() {
  const employees = [
    {
      name: "Rahul",
      salary: "₹45,000",
      status: "Generated",
    },
    {
      name: "Aman",
      salary: "₹38,500",
      status: "Pending",
    },
    {
      name: "Priya",
      salary: "₹52,000",
      status: "Generated",
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-violet-900">
          Payslip Generation
        </h2>
        <p className="text-slate-500 mt-1">
          Generate, download and email employee payslips.
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Month
          </label>
          <select className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-violet-500 outline-none">
            <option>June</option>
            <option>May</option>
            <option>April</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Department
          </label>
          <select className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-violet-500 outline-none">
            <option>All</option>
            <option>HR</option>
            <option>IT</option>
            <option>Finance</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Employee
          </label>
          <select className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-violet-500 outline-none">
            <option>All</option>
            <option>Rahul</option>
            <option>Aman</option>
            <option>Priya</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-4 font-semibold">Employee</th>
              <th className="text-left p-4 font-semibold">Salary</th>
              <th className="text-left p-4 font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp, index) => (
              <tr
                key={index}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="p-4">{emp.name}</td>
                <td className="p-4 font-semibold">{emp.salary}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      emp.status === "Generated"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 mt-8">
        <button className="px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition">
          Generate Payslip
        </button>

        <button className="px-6 py-3 rounded-xl border border-slate-300 font-semibold hover:bg-slate-100 transition">
          Download PDF
        </button>

        <button className="px-6 py-3 rounded-xl border border-slate-300 font-semibold hover:bg-slate-100 transition">
          Email Payslip
        </button>
      </div>
    </div>
  );
}