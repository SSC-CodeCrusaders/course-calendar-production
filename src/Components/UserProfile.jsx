import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiKey, FiEdit2 } from 'react-icons/fi';
import { auth } from '../utils/firebase';
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

const UserProfile = () => {
  // Uses useState to manage various states
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
    // uses Firebase's AuthStateChanged method to listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // If it does notice a change
      if (user) {
        // updates the new user and the new email
        setUser(user);
        setEmail(user.email);
      } else {
        setUser(null);
      }
    });
    
    // removes the listener when the component unmounts
    return () => unsubscribe();

    // MAY NOT NEED THE CODE SECTION BELOW, IT USES SUPABASE
    // const getUserProfile = async () => {
    //   const { data, error } = await supabase.auth.getSession();

    //   if (error) {
    //     toast.error('Failed to get user session');
    //     return;
    //   }

    //   if (data.session) {
    //     const user = data.session.user;
    //     setUser(user);
    //     setEmail(user.email);
    //   }
    // };

    // getUserProfile();
  }, []);

  // Handle email update
  const handleUpdateEmail = async () => {
    // if the user is not null then it simply just returns the function 
    if (!user) return;

    try {
      // Updates the user's email using a Firebase method
      await updateEmail(user, newEmail);
      // Updates the local use state with the new email
      setEmail(newEmail);
      setShowEmailForm(false);
      // displays a toast displaying it was successful
      toast.success("Email Updated Successfully.");
    } catch (error) {
      // displays a toast displaying it was unsuccessful
      toString.error("Failed to update email:" + error.message);
    }

    // MAY NOT NEED SECTION BELOW, IT USES SUPABASE
    // if (newEmail === email) {
    //   toast.error('The new email cannot be the same as the current email');
    //   return;
    };

    // setLoading(true);

    // try {
    //   // Update user email using Supabase
    //   const { error: emailError } = await supabase.auth.update({
    //     email: newEmail,
    //   });
    //   if (emailError) {
    //     toast.error('Failed to update email: ' + emailError.message);
    //     return;
    //   }

    //   // Update email state and close form on success
    //   setEmail(newEmail);
    //   setShowEmailForm(false);
    //   toast.success('Email updated successfully');
    // } catch (error) {
    //   toast.error('An unexpected error occurred');
    // } finally {
    //   setLoading(false);
    // }

  // Handle password change
  const handleChangePassword = async () => {
    // Added for Firebase authentication 
    if (!user) return;

    // Required by Firebase for security, Re-authenticates the user using their current password before changing the password
    // This is the two sections that require you to type your new password and then retype that new password
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    // THIS PART BELOW IS FOR CHECKING THE LENGTH OF THE PASSWORD
    // if (newPassword.length < 10) {
    //   toast.error("password must be at least 10 characters");
    //   return;
    // }

    setLoading(true);

    try {
      // creates a credential variable from the current user with the current password and email
      const credential = EmailAuthProvider.credential(email, currentPassword);
      // re-authenticates that user with those credentials
      await reauthenticateWithCredential(user, credential);

      // sets the new password
      await updatePassword(user, newPassword);
      setShowPasswordForm(false);
      // prints it was successful
      toast.success("Password update successfully");
    } catch (error) {
      // Says there was an error
      toast.error("Failed to update password: " + error.message);
    } finally {
      setLoading(false);
    }

    // MAY NOT NEED THIS SECTION, USES SUPABASE
    // if (newPassword !== confirmNewPassword) {
    //   toast.error('New passwords do not match');
    //   return;
    // }

    // if (newPassword.length < 6) {
    //   toast.error('Password must be at least 6 characters');
    //   return;
    // }

    // setLoading(true);

    // try {
    //   // Re-authenticate user with the current password
    //   const { error: signInError } = await supabase.auth.signIn({
    //     email,
    //     password: currentPassword,
    //   });

    //   if (signInError) {
    //     toast.error('Current password is incorrect');
    //     setLoading(false);
    //     return;
    //   }

    //   // Update user password using Supabase
    //   const { error: passwordError } = await supabase.auth.update({
    //     password: newPassword,
    //   });

    //   if (passwordError) {
    //     toast.error('Failed to update password: ' + passwordError.message);
    //   } else {
    //     setShowPasswordForm(false);
    //     toast.success('Password updated successfully');
    //   }
    // } catch (error) {
    //   toast.error('An unexpected error occurred while changing the password');
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <>
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
                  <p className="text-lg">{email ? email : <span className="text-gray-400">Loading...</span>}</p>
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

            {/* Form to update password */}
            {showPasswordForm && (
              <div className="mt-4 space-y-4">
                {/* Current Password Input */}
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

                {/* New Password Input */}
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

                {/* Confirm New Password Input */}
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

                {/* Update Password Button */}
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
