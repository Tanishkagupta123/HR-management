import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [auth, setAuth] = useState({ name: '', password: '' });
  const [errorMessage, setErrorMessage] = useState(''); // 1. Message state add kiya
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Har naye attempt par message clear kar do

    try {
      const res = await axios.post('http://localhost:8000/admin/login', auth);
      if (res.data.success) {
        const role = res.data.user?.role || 'employee';
        localStorage.setItem('user', JSON.stringify(res.data.user));
        if (role === 'admin') navigate('/admin');
        else navigate('/dashboard');
      } else {
        setErrorMessage(res.data.message); // 2. Error aane par message dikhao
      }
    } catch (err) {
      setErrorMessage("Server Error, please try again.");
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
    >
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-10 rounded-[40px] shadow-2xl border border-white/20">
        
        <div className="text-center mb-8">
          <img src="/src/assets/as group logo.jpeg" className="w-20 h-20 mx-auto object-contain rounded-full border-2 border-white/30" />
          <h1 className="text-3xl font-extrabold text-white mt-4 tracking-wide">AS GROUP</h1>
          <p className="text-white/70 font-medium">Secure Sign-In</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* 3. Yahan error message dikhega */}
          {errorMessage && (
            <div className="bg-red-500/20 border border-red-500/50 text-white text-center py-2 rounded-xl text-sm">
              {errorMessage}
            </div>
          )}

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
      </div>
    </div>
  );
}