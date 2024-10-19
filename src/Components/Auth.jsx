import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-toastify';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handles sign-up logic, sets loading state, and provides feedback via toast notifications
  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Sign-up successful, please check your email for verification.');
    }
    setLoading(false); 
  };

  // Handles login logic, sets loading state, and provides feedback via toast notifications
  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Login successful!'); 
    }
    setLoading(false); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-xl font-semibold mb-6">Log In / Sign Up</h1>
        
        {/* Email Input Field */}
        <input
          className="w-full p-2 mb-3 border rounded focus:outline-none focus:border-blue-500"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Input Field with Toggle Button */}
        <div className="relative w-full mb-3">
          <input
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-2 text-gray-600"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Log In Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded mb-3 disabled:opacity-50"
        >
          {loading ? 'Logging In...' : 'Log In'}
        </button>

        {/* Sign Up Button */}
        <button
          onClick={handleSignUp}
          disabled={loading}
          className="w-full bg-green-500 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </div>
    </div>
  );
}

export default Auth;
