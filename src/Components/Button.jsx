import PropTypes from 'prop-types';

const Button = ({ type, onClick, disabled, children, className }) => {
  const baseStyles =
    'text-white p-3 rounded hover:bg-opacity-80 transition disabled:opacity-50';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${className}`}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Button.defaultProps = {
  type: 'button',
  onClick: () => {},
  disabled: false,
  className: '',
};

export default Button;
