import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [auth, setAuth] = useState({ name: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/admin/login', auth);
      if (res.data.success) {
        navigate('/admin');
      }
    } catch (err) {
      alert("Login Failed: " + (err.response?.data?.message || "Server Error"));
    }
  };

  return (
    // Yahan style attribute mein background image daal di hai
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
    >
      {/* Glassmorphism Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-10 rounded-[40px] shadow-2xl border border-white/20">
        
        {/* Logo Section */}
        <div className="text-center mb-8">
          <img src="/src/assets/as group logo.jpeg" className="w-20 h-20 mx-auto object-contain rounded-full border-2 border-white/30" />
          <h1 className="text-3xl font-extrabold text-white mt-4 tracking-wide">AS GROUP</h1>
          <p className="text-white/70 font-medium">Secure Sign-In</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-white text-sm font-semibold mb-2">Employee Name</label>
            <input 
              className="w-full px-6 py-4 bg-black/20 border border-white/20 rounded-2xl text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-violet-400 transition"
              placeholder="Enter your full name"
              onChange={(e) => setAuth({...auth, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-white text-sm font-semibold mb-2">Password</label>
            <input 
              type="password"
              className="w-full px-6 py-4 bg-black/20 border border-white/20 rounded-2xl text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-violet-400 transition"
              placeholder="Enter your password"
              onChange={(e) => setAuth({...auth, password: e.target.value})}
            />
          </div>

          <button className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-violet-900/50">
            Sign In
          </button>
        </form>

        <div className="text-center mt-6 space-y-2">
          <p className="text-white/70 text-sm cursor-pointer hover:text-white">Forgot Password?</p>
          <p className="text-white/90 text-sm">
            Don't have an account? <span className="font-bold cursor-pointer underline hover:text-violet-300">Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
}