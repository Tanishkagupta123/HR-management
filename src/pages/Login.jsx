import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [auth, setAuth] = useState({ name: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Backend URL: http://localhost:8000/admin/login
      const res = await axios.post('http://localhost:8000/admin/login', auth);
      if (res.data.success) {
        navigate('/admin');
      }
    } catch (err) {
      alert("Login Failed: " + (err.response?.data?.message || "Server Error"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-[#1e293b] p-8 rounded-3xl shadow-2xl border border-slate-700">
        <h1 className="text-3xl font-bold text-white text-center mb-2">Welcome Back</h1>
        <div className="space-y-6 mt-8">
          <input 
            className="w-full px-4 py-3 bg-[#0f172a] border border-slate-600 rounded-xl text-white outline-none"
            placeholder="Username (Name)"
            onChange={(e) => setAuth({...auth, name: e.target.value})}
          />
          <input 
            type="password"
            className="w-full px-4 py-3 bg-[#0f172a] border border-slate-600 rounded-xl text-white outline-none"
            placeholder="Password"
            onChange={(e) => setAuth({...auth, password: e.target.value})}
          />
          <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold">Sign In</button>
        </div>
      </form>
    </div>
  );
}