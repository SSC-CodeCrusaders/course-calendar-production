// src/hooks/useAuth.js

import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-toastify';

const useAuth = () => {
  const [loading, setLoading] = useState(false);

  // Handle user sign up
  const signUp = async (email, password) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return { error };
    } else {
      toast.success('Sign-up successful! Please check your email for verification.');
      return { error: null };
    }
  };

  // Handle user login
  const signIn = async (email, password) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return { error };
    } else {
      toast.success('Login successful!');
      return { error: null };
    }
  };

  return { signUp, signIn, loading };
};

export default useAuth;
