import { useState } from 'react';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { auth } from '../utils/firebase';

const ReauthModal = ({ user, onSuccess, onClose }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReauth = async () => {
        setLoading(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);
            toast.success("Re-authenticated successfully.")
            onSuccess();
            onClose();
        } catch (err) {
            alert("Reauthentication failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Confirm Your Password</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Current password"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleReauth}
                className="px-4 py-2 bg-lewisRed text-white rounded disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        </div>
      );
};

ReauthModal.propTypes = {
    user: PropTypes.object.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ReauthModal;