import { useEffect, useState } from 'react';
import { FiUser, FiMail, FiEdit2 } from 'react-icons/fi';
import EmailUpdate from './EmailUpdate';
import PasswordUpdate from './PasswordUpdate';
import { useUser } from '../contexts/UserContext';

const UserProfile = () => {
  const { user, setUser } = useUser();
  const [email, setEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  // Callback to update email in context after successful update
  const handleEmailUpdate = (newEmail) => {
    setEmail(newEmail);
    setUser({ ...user, email: newEmail });
    setShowEmailForm(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg w-full max-w-lg p-6">
        <div className="flex items-center mb-6">
          {/* User profile icon */}
          <div className="bg-lewisRed text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
            <FiUser />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-800">Profile Information</h1>
            <p className="text-sm text-gray-500">Update your personal information</p>
          </div>
        </div>

        {/* Email Section */}
        <div className="border-t border-gray-300 pt-4 mt-4">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Email</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiMail className="text-gray-500 mr-3" />
              <div>
                <p className="text-lg">{email || <span className="text-gray-400">Loading...</span>}</p>
              </div>
            </div>
            {/* Toggle email update form */}
            <button
              onClick={() => setShowEmailForm(!showEmailForm)}
              className="flex items-center text-blue-500 hover:underline"
            >
              <FiEdit2 className="mr-1" /> Change Email
            </button>
          </div>

          {/* Form to update email */}
          {showEmailForm && (
            <EmailUpdate currentEmail={email} onEmailUpdate={handleEmailUpdate} />
          )}
        </div>

        {/* Password Section */}
        <div className="border-t border-gray-300 pt-4 mt-8">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Password</h2>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="text-blue-500 hover:underline flex items-center"
          >
            <FiEdit2 className="mr-1" /> Update Password
          </button>

          {/* Form to update password */}
          {showPasswordForm && (
            <PasswordUpdate />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
