import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AddEmployee from './pages/AddEmployee';
import AddTask from './pages/AddTask';
import DataOfTasks from './pages/DataOfTasks';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Admin ke under saare nested routes */}
        <Route path="/admin" element={<AdminDashboard />}>
           <Route path="add-employee" element={<AddEmployee />} />
           <Route path="add-task" element={<AddTask />} />
           <Route path="data-tasks" element={<DataOfTasks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
