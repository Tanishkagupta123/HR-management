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
import PayrollManagement from './components/PayrollManagement';
import PayrollManagement1 from './components/PayrollManagement1';
import PerformanceManagement from './components/PerformanceManagement';
import KPITracking from './components/KPITracking';
import EmployeeReviews from './components/EmployeeReviews';
import GoalSetting from './components/GoalSetting';
import PromotionTracking from './components/PromotionTracking';
import EmployeeSelfService from './components/EmployeeSelfService';
import TaskWorkflowManagement from './components/TaskWorkflowManagement';
import TeamCollaboration from './components/TeamCollaboration';
<<<<<<< HEAD
=======
import Communication from './components/communication';
>>>>>>> 8b57427 (first commit)
import AddTask from './components/AddTask';
import DataOfTasks from './components/DataOfTasks';
import AdminHiring from './pages/AdminHiring';

// Employee Components
import EmployeeProfile from './employee/EmployeeProfile';
import EmployeeTasks from './employee/EmployeeTasks';
import EmployeeLeave from './employee/EmployeeLeave';
import PayslipGeneration from './components/PayslipGeneration';
import PFESITaxManagement from './components/PFESITaxManagement';

import Chatbot from './employee/Chatbot';



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
          <Route path="payroll-management" element={<PayrollManagement />} />
          <Route path="payroll-management1" element={<PayrollManagement1 />} />
          <Route path="payslip-generation" element={<PayslipGeneration />} />
          <Route path="pf-esi-tax-management" element={<PFESITaxManagement />} />
          <Route path="performance-management" element={<PerformanceManagement />} />
          <Route path="performance-management/kpi" element={<KPITracking />} />
          <Route path="performance-management/reviews" element={<EmployeeReviews />} />
          <Route path="performance-management/goal" element={<GoalSetting />} />
          <Route path="performance-management/promotion" element={<PromotionTracking />} />
          <Route path="performance-management/feedback" element={<EmployeeReviews />} />
          <Route path="ess" element={<EmployeeSelfService />} />
          <Route path="task-workflow-management" element={<TaskWorkflowManagement />} />
<<<<<<< HEAD
=======
          <Route path="communication-system" element={<Communication />} />
>>>>>>> 8b57427 (first commit)
          <Route path="team-collaboration" element={<TeamCollaboration />} />
          <Route path="add-task" element={<AddTask />} />
          <Route path="data-tasks" element={<DataOfTasks />} />
          <Route path="hiring" element={<AdminHiring />} />
        </Route>

        {/* Employee Dashboard: Yahan nested routes ka use hoga */}
        <Route path="/dashboard" element={<EmployeeDashboard />}>
          <Route index element={<EmployeeProfile />} />
          <Route path="tasks" element={<EmployeeTasks />} />
          <Route path="apply-leave" element={<EmployeeLeave />} />
          <Route path="attendance" element={<EmployeeAttendance />} />
          <Route path="communication-systemm" element={<TeamCollaboration />} />
          <Route path="team-collaboration" element={<TeamCollaboration />} />
          <Route path="chatbot" element={<Chatbot />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}