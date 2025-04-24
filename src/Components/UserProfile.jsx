import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiKey, FiEdit2, FiTrash2, FiChevronDown, } from 'react-icons/fi';
import { auth } from '../utils/firebase';
import { 
  verifyBeforeUpdateEmail, 
  onAuthStateChanged, 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider,  
  deleteUser, 
} from 'firebase/auth';
import { purgeUserCalendars } from "../utils/firestoreDatabase";
import { useNavigate } from "react-router-dom";
import ReauthModal from "../Context/ReauthModal";

const ActionButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center w-full justify-between px-4 py-3 bg-lewisRed hover:bg-[#e00a4a] rounded-md transition"
  >
    <span className="flex items-center gap-2 text-white">
      <Icon className="text-white" />
      {label}
    </span>
    <FiChevronDown className="text-white" />
  </button>
);

const UserProfile = () => {
  // Uses useState to manage various states
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');

  const [newEmail, setNewEmail] = useState("");
  const [pwdForm, setPwdForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [showReauthModal, setShowReauthModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingDelete, setPendingDelete] = useState(false);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // uses Firebase's AuthStateChanged method to listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // updates the new user and the new email
        setUser(user);
        setEmail(user?.email || "");
        setIsVerified(Boolean(user?.emailVerified));
      }
    });
    // removes the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Handle email update
  const handleUpdateEmail = async () => {
    // if the user is not null then it simply just returns the function 
    if (!user || !newEmail) return;
    setPendingEmail(newEmail);
    setShowReauthModal(true);
  };

  const completeEmailUpdate = async () => {
    try {
      await verifyBeforeUpdateEmail(user, pendingEmail);
      setShowEmailForm(false);
      setNewEmail("");
      toast.success(`Verification email sent to ${pendingEmail}`);
    } catch (error) {
      toast.error("Failed to send verification email: " + error.message);
    } finally {
      setPendingEmail("");
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    const { current, next, confirm } = pwdForm;
    if (!user) return;
    if (next !== confirm) {
      return toast.error("Passwords do not match.");
    }
    if (next.length < 6) {
      return toast.error("Password must be at least 6 characters long.")
    }
    try {
      setLoading(true);
      await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, current));
      // sets the new password
      await updatePassword(user, next);
      setShowPwdForm(false);
      setPwdForm({ current: "", next: "", confirm: "" });
      // prints it was successful
      toast.success("Password update successfully.");
    } catch (error) {
      // Says there was an error
      toast.error("Failed to update password: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Permanently delete your account and all calendars? This cannot be undone.")) return;
    setPendingDelete(true);
    setShowReauthModal(true);
  };

  const completeDeleteAccount = async () => {
    try {
      await purgeUserCalendars(user.uid);
      await deleteUser(user);
      localStorage.clear();
      toast.success("Account deleted successfully.");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error("Delete failed: " + err.message);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-lewisRedDarker">
      <div className="w-full max-w-lg bg-gray rounded-lg shadow p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="bg-lewisRed text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl">
            <FiUser />
          </div>
          <div>
            <p className="font-bold">{email || "Loading..."}</p>
            <p 
              className={
                "text-sm" + 
                (isVerified ? "text-green-600" : "text-red-600")
              }
            >
              {isVerified ? "Email Verified" : "Email Not Verified"}
            </p>
          </div>
        </div>

        {/* Account Actions */}
        <section className="space-y-4">
          <h2 className="font-bold text-lg">Account Actions</h2>

          <ActionButton
            icon={FiEdit2}
            label="Change email"
            onClick={() => setShowEmailForm((s) => !s)}
          />

          {showEmailForm && (
            <div className="space-y-3 p-3 bg-gray rounded-md">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="New email address"
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleUpdateEmail}
                disabled={loading}
                className="w-full bg-lewisRed text-white py-2 rounded disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          )}

          <ActionButton
            icon={FiKey}
            label="Change Password"
            onClick={() => setShowPwdForm((s) => !s)}
          />

          {showPwdForm && (
            <div className="space-y-3 p-3 bg-gray rounded-md">
              <input
                type="password"
                placeholder="Current Password"
                value={pwdForm.current}
                onChange={(e) => setPwdForm((p) => ({ ...p, current: e.target.value }))}
                className="w-full p-2 border rounded"
              />
              <input
                type="password"
                placeholder="New Password"
                value={pwdForm.next}
                onChange={(e) => setPwdForm((p) => ({ ...p, next: e.target.value }))}
                className="w-full p-2 border rounded"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={pwdForm.confirm}
                onChange={(e) => setPwdForm((p) => ({ ...p, confirm: e.target.value }))}
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="w-full bg-lewisRed text-white py-2 rounded disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          )}

          <ActionButton
            icon={FiTrash2}
            label="Delete Account"
            onClick={handleDeleteAccount}
          />
        </section>
      </div>
      {showReauthModal && (
        <ReauthModal
          user={user}
          onSuccess={pendingDelete ? completeDeleteAccount : completeEmailUpdate}
          onClose={() => {
            setShowReauthModal(false);
            setPendingDelete(false);
          }}
        />
      )}
    </div>
  );
};

export default UserProfile;
