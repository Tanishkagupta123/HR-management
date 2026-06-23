import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AddEmployee from './components/AddEmployee';
import AllEmployees from './components/AllEmployees';
import Attendance from './components/Attendance';
import LeaveManagement from './components/LeaveManagement';
import AddTask from './components/AddTask';
import DataOfTasks from './components/DataOfTasks';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AllEmployees />} />
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="all-employees" element={<AllEmployees />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leave-management" element={<LeaveManagement />} />
          <Route path="add-task" element={<AddTask />} />
          <Route path="data-tasks" element={<DataOfTasks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}