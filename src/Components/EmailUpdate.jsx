import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const EmailUpdate = ({ currentEmail, onEmailUpdate }) => {
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateEmail = async () => {
    if (newEmail === currentEmail) {
      toast.error('The new email cannot be the same as the current email');
      return;
    }

    setLoading(true);

    try {
      // Update user email using Supabase
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) {
        toast.error('Failed to update email: ' + error.message);
        return;
      }

      // Update email state and notify parent component
      toast.success('Email updated successfully');
      onEmailUpdate(newEmail);
    } catch (error) {
      toast.error('An unexpected error occurred: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
};

EmailUpdate.propTypes = {
  currentEmail: PropTypes.string.isRequired,
  onEmailUpdate: PropTypes.func.isRequired,
};

export default EmailUpdate;
