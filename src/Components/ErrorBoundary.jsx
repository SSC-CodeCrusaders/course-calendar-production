import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    console.log('Error Boundary Line 11: ', error)
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="bg-white p-8 rounded shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
            <p className="mb-4">Please try refreshing the page or contact support if the problem persists.</p>
            {this.state.errorInfo && (
              <details className="whitespace-pre-wrap text-left">
                {this.state.errorInfo.componentStack}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
