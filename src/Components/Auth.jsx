import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-toastify';
// AuthService.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
// This imports Firebase authentication
import { auth } from "../utils/firebase";
// Implements Firestore functions
import {doc, setDoc } from "firebase/firestore";
// Imports Firestore
import { db } from "../utils/firebase";

/* This file handles the authentication process and represents the Sign-up / Sign-In screen */

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handles sign-up logic, sets loading state, and provides feedback via toast notifications
  // This will now handle sign-up logic with Firebase Authentication
  const handleSignUp = async () => {
    setLoading(true);

    try {
      // Saves the user credentials when creating a new user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Grabs the user and saves that to a variable from the user credentials
      const user = userCredential.user;

      // This will store the user in Firestore
      await setDoc(doc(db,"users", user.uid), {
        email: user.email,
        createdAt: new Date()
      });

      // displays a toast indicating that it was successful in creating a new user
      toast.success("Sign-up successful, please check your email for verification.");
    } catch (error) {
      toast.error(error.message);
    }
    
    setLoading(false)

    // SECTION BELOW MAY NOT BE NEEDED
    // const { error } = await supabase.auth.signUp({ email, password });
    // if (error) {
    //   toast.error(error.message);
    // } else {
    //   toast.success('Sign-up successful, please check your email for verification.');
    // }
    // setLoading(false); 
  };

  // Handles login logic with Firebase Authentication, sets loading state, and provides feedback via toast notifications
  const handleLogin = async () => {
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login Successful!");
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false)

    // SECTION BELOW MAY NOT BE NEEDED DUE TO USING SUPABASE
    // const { error } = await supabase.auth.signInWithPassword({ email, password });
    // if (error) {
    //   toast.error(error.message);
    // } else {
    //   toast.success('Login successful!'); 
    // }
    // setLoading(false); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-xl font-semibold mb-6">Log In / Sign Up Firestore</h1>
        
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
