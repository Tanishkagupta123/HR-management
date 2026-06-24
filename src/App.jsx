import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './employee/EmployeeDashboard';
import EmployeeAttendance from './employee/EmployeeAttendance';

// Admin Components
import AddEmployee from './components/AddEmployee';
import AllEmployees from './components/AllEmployees';
import Attendance from './components/Attendance';
import LeaveManagement from './components/LeaveManagement';
import AddTask from './components/AddTask';
import DataOfTasks from './components/DataOfTasks';

// Employee Components
import EmployeeProfile from './employee/EmployeeProfile';
import EmployeeTasks from './employee/EmployeeTasks';
import EmployeeLeave from './employee/EmployeeLeave';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Admin Dashboard: Saare Admin ke kaam yahan nested hain */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AllEmployees />} />
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="all-employees" element={<AllEmployees />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leave-management" element={<LeaveManagement />} />
          <Route path="add-task" element={<AddTask />} />
          <Route path="data-tasks" element={<DataOfTasks />} />
        </Route>

        {/* Employee Dashboard: Yahan nested routes ka use hoga */}
        <Route path="/dashboard" element={<EmployeeDashboard />}>
          <Route index element={<EmployeeProfile />} />
          <Route path="tasks" element={<EmployeeTasks />} />
          <Route path="apply-leave" element={<EmployeeLeave />} />
          <Route path="attendance" element={<EmployeeAttendance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}