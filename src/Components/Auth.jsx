// src/Components/Auth.jsx

import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { state } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error('Error signing in: ' + error.message);
    } else {
      toast.success('Successfully signed in!');
      // Redirect to home or creator page
      navigate('/');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      toast.error('Error signing up: ' + error.message);
    } else {
      toast.success('Signup successful! Please check your email for confirmation.');
      navigate('/'); 
    }
  };

  // If already authenticated, redirect to home
  if (state.user) {
    navigate('/');
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            id="email"
            className="w-full p-3 border rounded focus:outline-none focus:border-lewisRed"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-semibold mb-1">Password</label>
          <input
            type="password"
            id="password"
            className="w-full p-3 border rounded focus:outline-none focus:border-lewisRed"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-lewisRed text-white p-3 rounded hover:bg-red-600 transition"
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={handleSignup}
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition mt-4"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

Auth.propTypes = {};

export default Auth;
