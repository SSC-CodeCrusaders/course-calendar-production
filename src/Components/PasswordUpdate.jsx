import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useUser } from '../contexts/UserContext';

const PasswordUpdate = () => {
  const { user } = useUser();

  const validationSchema = Yup.object({
    currentPassword: Yup.string()
      .required('Current password is required'),
    newPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('New password is required'),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Please confirm your new password'),
  });

  return (
    <div className="mt-4">
      <Formik
        initialValues={{
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          const { currentPassword, newPassword } = values;
          setSubmitting(true);

          try {
            // Re-authenticate user with the current password
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email: user.email,
              password: currentPassword,
            });

            if (signInError) {
              toast.error('Current password is incorrect');
              setSubmitting(false);
              return;
            }

            // Update user password using Supabase
            const { error: passwordError } = await supabase.auth.updateUser({
              password: newPassword,
            });

            if (passwordError) {
              toast.error('Failed to update password: ' + passwordError.message);
            } else {
              toast.success('Password updated successfully');
              resetForm();
            }
          } catch (error) {
            toast.error('An unexpected error occurred while changing the password: ', error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {/* Current Password Input */}
            <div className="flex items-center">
              <label htmlFor="currentPassword" className="block text-sm font-semibold mb-1 w-1/3">Current Password</label>
              <Field
                type="password"
                name="currentPassword"
                className="w-full p-3 border rounded focus:outline-none focus:border-lewisRed"
                placeholder="Enter current password"
                aria-required="true"
              />
            </div>
            <ErrorMessage name="currentPassword" component="div" className="text-red-500 text-sm mb-2" />

            {/* New Password Input */}
            <div className="flex items-center">
              <label htmlFor="newPassword" className="block text-sm font-semibold mb-1 w-1/3">New Password</label>
              <Field
                type="password"
                name="newPassword"
                className="w-full p-3 border rounded focus:outline-none focus:border-lewisRed"
                placeholder="Enter new password"
                aria-required="true"
              />
            </div>
            <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm mb-2" />

            {/* Confirm New Password Input */}
            <div className="flex items-center">
              <label htmlFor="confirmNewPassword" className="block text-sm font-semibold mb-1 w-1/3">Confirm New Password</label>
              <Field
                type="password"
                name="confirmNewPassword"
                className="w-full p-3 border rounded focus:outline-none focus:border-lewisRed"
                placeholder="Confirm new password"
                aria-required="true"
              />
            </div>
            <ErrorMessage name="confirmNewPassword" component="div" className="text-red-500 text-sm mb-2" />

            {/* Update Password Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-lewisRed text-white p-3 rounded hover:bg-red-600 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Updating Password...' : 'Change Password'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PasswordUpdate;
