export default function AddEmployee({ employee, setEmployee, handleOnboard, departments, addDepartment }) {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Add New Employee</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Full Name */}
        <div>
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <input required value={employee.name} className="w-full p-4 border rounded-2xl" placeholder="Full Name" onChange={(e) => setEmployee({...employee, name: e.target.value})} />
        </div>
        
        {/* Password */}
        <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input required value={employee.password} className="w-full p-4 border rounded-2xl" type="password" placeholder="Password" onChange={(e) => setEmployee({...employee, password: e.target.value})} />
        </div>
        
        {/* Department */}
        <div>
            <label className="block text-sm font-semibold mb-2">Department</label>
            <div className="flex gap-2">
                <select 
                    required 
                    className="flex-1 p-4 border rounded-2xl" 
                    value={employee.department} 
                    onChange={(e) => setEmployee({...employee, department: e.target.value})}
                >
                    <option value="" disabled>Select Dept</option>
                    {departments && departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <button onClick={addDepartment} className="bg-violet-100 text-violet-700 px-4 rounded-2xl font-bold">+</button>
            </div>
        </div>
      </div>

      {/* Position */}
      <div className="mb-8">
        <label className="block text-sm font-semibold mb-2">Position</label>
        <select required className="w-full p-4 border rounded-2xl" value={employee.position} onChange={(e) => setEmployee({...employee, position: e.target.value})}>
            <option value="Admin">Admin</option>
            <option value="TL">TL</option>
            <option value="Employee">Employee</option>
        </select>
      </div>

      {/* Submit Button */}
      <button 
        onClick={handleOnboard} 
        className="bg-violet-900 text-white px-10 py-4 rounded-2xl font-bold w-full md:w-auto"
      >
        Onboard New Employee
      </button>
    </div>
  );
}