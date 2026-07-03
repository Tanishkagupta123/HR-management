import React, { useState, useEffect } from "react";
import axios from "axios";
import { Save, Download, FileText, ChevronDown } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function PFESITaxManagement() {
  const [payrollList, setPayrollList] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [form, setForm] = useState({ pfPercent: 12, esiPercent: 0.75, professionalTax: 200, tds: 0 });

  useEffect(() => {
    axios.get("http://localhost:8000/payroll/all").then(res => setPayrollList(res.data));
  }, []);

  const pf = ((selectedEmp?.basic_salary * form.pfPercent) / 100).toFixed(2);
  const esi = ((selectedEmp?.basic_salary * form.esiPercent) / 100).toFixed(2);
  const totalDeduction = (Number(pf) + Number(esi) + Number(form.professionalTax) + Number(form.tds)).toFixed(2);
  const finalNet = (selectedEmp?.net_salary - totalDeduction).toFixed(2);

  const downloadSalarySlip = () => {
    const doc = new jsPDF();
    doc.text(`Salary Deduction Slip: ${selectedEmp.employee_name}`, 20, 10);
    doc.autoTable({
      head: [['Description', 'Amount']],
      body: [['Basic', selectedEmp.basic_salary], ['PF', pf], ['ESI', esi], ['TDS', form.tds], ['Final Net Salary', finalNet]]
    });
    doc.save(`${selectedEmp.employee_name}_Deduction_Slip.pdf`);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Statutory Deduction Center</h2>
        
        {/* Selection Box */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8 flex items-center gap-4">
          <FileText className="text-violet-600" />
          <select className="flex-1 outline-none text-lg font-medium" onChange={(e) => setSelectedEmp(payrollList.find(p => p.id == e.target.value))}>
            <option>Select Employee to view Deductions</option>
            {payrollList.map(p => <option key={p.id} value={p.id}>{p.employee_name}</option>)}
          </select>
        </div>

        {selectedEmp && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Side */}
            <div className="bg-white p-8 rounded-3xl border shadow-sm">
              <h3 className="font-bold text-xl mb-6">Configuration</h3>
              <div className="space-y-4">
                <div><label className="text-sm font-semibold text-slate-500">PF %</label>
                <input type="number" name="pfPercent" value={form.pfPercent} onChange={e => setForm({...form, pfPercent: e.target.value})} className="w-full border rounded-xl p-3" /></div>
                <div><label className="text-sm font-semibold text-slate-500">TDS (₹)</label>
                <input type="number" name="tds" value={form.tds} onChange={e => setForm({...form, tds: e.target.value})} className="w-full border rounded-xl p-3" /></div>
              </div>
            </div>

            {/* Professional Summary Side */}
            <div className="bg-white p-8 rounded-3xl border shadow-lg border-violet-100">
              <h3 className="font-bold text-xl mb-6">Pay Breakdown</h3>
              <div className="space-y-3 text-slate-600">
                <div className="flex justify-between"><span>Gross Salary</span> <span>₹{selectedEmp.gross_salary}</span></div>
                <div className="flex justify-between text-red-500"><span>PF Deduction</span> <span>-₹{pf}</span></div>
                <div className="flex justify-between text-red-500"><span>ESI Deduction</span> <span>-₹{esi}</span></div>
                <div className="border-t pt-4 flex justify-between text-lg font-bold text-slate-900">
                  <span>Final Net Pay</span> <span>₹{finalNet}</span>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button onClick={downloadSalarySlip} className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-white py-3 rounded-xl hover:bg-black"><Download size={18}/> PDF</button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-violet-600 text-white py-3 rounded-xl hover:bg-violet-700"><Save size={18}/> Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}