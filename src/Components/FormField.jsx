import PropTypes from 'prop-types';
import { Field, ErrorMessage } from 'formik';

const FormField = ({ label, name, type, placeholder, isCheckbox }) => {
  return (
    <div className={`flex items-center ${isCheckbox ? 'flex-col' : 'mb-4'}`}>
      {!isCheckbox && (
        <label htmlFor={name} className="block text-sm font-semibold mb-1 w-1/3">
          {label}
        </label>
      )}
      <div className={`${isCheckbox ? 'w-full' : 'w-full'}`}>
        <Field
          type={type}
          name={name}
          id={name}
          className={`${
            isCheckbox
              ? 'form-checkbox h-5 w-5 text-lewisRed'
              : 'w-full p-3 border rounded focus:outline-none focus:border-lewisRed'
          }`}
          placeholder={placeholder}
          aria-required="true"
        />
        {!isCheckbox && (
          <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
        )}
      </div>
      {isCheckbox && (
        <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
      )}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  isCheckbox: PropTypes.bool,
};

FormField.defaultProps = {
  type: 'text',
  placeholder: '',
  isCheckbox: false,
};

export default FormField;
