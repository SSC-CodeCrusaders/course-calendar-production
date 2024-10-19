import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';  // Import Hero Icons
import { useNavigate, useLocation } from 'react-router-dom';  // Import React Router hooks

const ProgressBar = () => {
  const navigate = useNavigate();  // For navigation
  const location = useLocation();  // To track the current route

  // Define the steps and their corresponding routes
  const steps = ['/step1', '/step2', '/step3'];

  // Get the current step index based on the URL
  const currentStepIndex = steps.indexOf(location.pathname);

  // Navigate to the next step
  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      navigate(steps[currentStepIndex + 1]);
    }
  };

  // Navigate to the previous step
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      navigate(steps[currentStepIndex - 1]);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-transparent p-4 text-center z-50">
      {/* Progress Bar Dots */}
      <div className="flex justify-center mb-4">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`h-4 w-4 mx-2 rounded-full ${currentStepIndex >= index ? 'bg-green-500' : 'bg-gray-300'}`}
          ></div>
        ))}
      </div>

      {/* Step Navigation */}
      <div className="flex justify-between items-center mt-4">
        {/* Previous Button */}
        <button
          className="bg-transparent text-gray-600 hover:text-black p-2 rounded"
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}  // Disable when on the first step
        >
          <ArrowLeftIcon className="h-6 w-6" />  {/* Hero Icon for Previous */}
        </button>

        {/* Next Button */}
        <button
          className="bg-transparent text-gray-600 hover:text-black p-2 rounded"
          onClick={handleNext}
          disabled={currentStepIndex === steps.length - 1}  // Disable when on the last step
        >
          <ArrowRightIcon className="h-6 w-6" />  {/* Hero Icon for Next */}
        </button>
      </div>

      {/* Display the current step */}
      <p className="mt-4">Step {currentStepIndex + 1} of 3</p>
    </div>
  );
};

export default ProgressBar;
