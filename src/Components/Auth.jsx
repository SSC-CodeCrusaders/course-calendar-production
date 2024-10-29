// src/Components/Auth.jsx

import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Auth = () => {
  const { signUp, signIn, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Required'),
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-xl font-semibold mb-6">{isSignUp ? 'Sign Up' : 'Log In'}</h1>
        
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            const { email, password } = values;
            if (isSignUp) {
              const { error } = await signUp(email, password);
              if (!error) {
                toast.success('Sign-up successful! Please check your email for verification.');
              }
            } else {
              const { error } = await signIn(email, password);
              if (!error) {
                toast.success('Login successful!');
              }
            }
            resetForm();
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Email Input Field */}
              <div className="mb-3">
                <label htmlFor="email" className="sr-only">Email</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-2 mb-1 border rounded focus:outline-none focus:border-blue-500"
                  aria-required="true"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mb-2" />
              </div>

              {/* Password Input Field with Toggle Button */}
              <PasswordField />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full bg-blue-500 text-white p-2 rounded mb-3 disabled:opacity-50"
              >
                {isSignUp ? (loading ? 'Signing Up...' : 'Sign Up') : (loading ? 'Logging In...' : 'Log In')}
              </button>
            </Form>
          )}
        </Formik>

        {/* Toggle between Sign Up and Log In */}
        <p className="text-center">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 hover:underline"
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

// Separate component for password field to manage show/hide functionality
const PasswordField = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative mb-3">
      <label htmlFor="password" className="sr-only">Password</label>
      <Field
        type={showPassword ? 'text' : 'password'}
        name="password"
        placeholder="Password"
        className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
        aria-required="true"
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 top-2 text-gray-600"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? 'Hide' : 'Show'}
      </button>
      <ErrorMessage name="password" component="div" className="text-red-500 text-sm mb-2" />
    </div>
  );
};

export default Auth;
