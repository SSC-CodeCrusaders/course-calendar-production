import { useState } from 'react';
import { toast } from 'react-toastify';
// AuthService.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail, 
} from "firebase/auth";
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
      await sendEmailVerification(user);

      // This will store the user in Firestore
      await setDoc(doc(db,"users", user.uid), {
        email: user.email,
        createdAt: new Date()
      });

      // displays a toast indicating that it was successful in creating a new user
      toast.success("Sign-up successful, please check your email for verification.");
    } catch (error) {
      const msg = error.code === "auth/email-already-in-use"
        ? "Email already in use."
        : error.message;
      // This represents an error if there already exists an email
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handles login logic with Firebase Authentication, sets loading state, and provides feedback via toast notifications
  const handleLogin = async () => {
    // Commenting the line out below gave me the result of when logging in it kicks me back to the main page
    // which is the desired effect, not sure why commenting this out does this but it works.  
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login Successful!");
    } catch (error) {
      toast.error("Email or Password does not match - " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Enter your email first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent.");
    } catch (error) {
      toast.error(error.message);
    }
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
          className="w-full bg-lewisRed text-white p-2 rounded mb-2 disabled:opacity-50"
        >
          {loading ? 'Logging In...' : 'Log In'}
        </button>

        {/* Sign Up Button */}
        <button
          onClick={handleSignUp}
          disabled={loading}
          className="w-full bg-lewisRed text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>

        {/* Forgot Password */}
        <button
          type="button"
          onClick={handleForgotPassword}
          className="mt-2 text-sm text-blue-800 hover:underline"
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
}

export default Auth;
