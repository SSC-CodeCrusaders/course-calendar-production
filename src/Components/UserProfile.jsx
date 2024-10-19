import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiKey, FiEdit2 } from 'react-icons/fi';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    // Fetch user info on mount
    const getUserProfile = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        toast.error('Failed to get user session');
        return;
      }

      if (data.session) {
        const user = data.session.user;
        setUser(user);
        setEmail(user.email); // Set email to the user's current email
      }
    };

    getUserProfile();
  }, []);

  const handleUpdateEmail = async () => {
    if (newEmail === email) {
      toast.error('The new email cannot be the same as the current email');
      return;
    }

    setLoading(true);

    try {
      // Update email
      const { error: emailError } = await supabase.auth.update({
        email: newEmail,
      });
      if (emailError) {
        toast.error('Failed to update email: ' + emailError.message);
        return;
      }

      setEmail(newEmail);
      setShowEmailForm(false);
      toast.success('Email updated successfully');
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Re-authenticate the user with the current password
      const { error: signInError } = await supabase.auth.signIn({
        email,
        password: currentPassword,
      });

      if (signInError) {
        toast.error('Current password is incorrect');
        setLoading(false);
        return;
      }

      // Update password
      const { error: passwordError } = await supabase.auth.update({
        password: newPassword,
      });

      if (passwordError) {
        toast.error('Failed to update password: ' + passwordError.message);
      } else {
        setShowPasswordForm(false);
        toast.success('Password updated successfully');
      }
    } catch (error) {
      toast.error('An unexpected error occurred while changing the password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-md rounded-lg w-full max-w-lg p-6">
          <div className="flex items-center mb-6">
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
                  <p className="text-lg">{email ? email : <span className="text-gray-400">Loading...</span>}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEmailForm(!showEmailForm)}
                className="flex items-center text-blue-500 hover:underline"
              >
                <FiEdit2 className="mr-1" /> Change Email
              </button>
            </div>

            {showEmailForm && (
              <div className="mt-4">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-3 border rounded focus:outline-none focus:border-lewisRed mb-2"
                  placeholder="Enter new email"
                />
                <button
                  onClick={handleUpdateEmail}
                  disabled={loading}
                  className="w-full bg-lewisRed text-white p-3 rounded hover:bg-red-600 transition disabled:opacity-50"
                >
                  {loading ? 'Updating Email...' : 'Save Email'}
                </button>
              </div>
            )}
          </div>

          {/* Password Section */}
          <div className="border-t border-gray-300 pt-4 mt-8">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Password</h2>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="text-blue-500 hover:underline"
            >
              Update Password
            </button>

            {showPasswordForm && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <FiKey className="text-gray-500 mr-3" />
                  <div className="w-full">
                    <label className="block text-sm font-semibold mb-1">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-3 border rounded focus:outline-none focus:border-lewisRed"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <FiKey className="text-gray-500 mr-3" />
                  <div className="w-full">
                    <label className="block text-sm font-semibold mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3 border rounded focus:outline-none focus:border-lewisRed"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <FiKey className="text-gray-500 mr-3" />
                  <div className="w-full">
                    <label className="block text-sm font-semibold mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full p-3 border rounded focus:outline-none focus:border-lewisRed"
                    />
                  </div>
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="w-full bg-lewisRed text-white p-3 rounded hover:bg-red-600 transition disabled:opacity-50 mt-4"
                >
                  {loading ? 'Updating Password...' : 'Change Password'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
