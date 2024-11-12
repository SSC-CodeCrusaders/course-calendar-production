import PropTypes from "prop-types";

const ProgressBar = ({ currentPage, setCurrentPage }) => {
  const steps = ["User Input", "Calendar", "Link"];

  return (
    <div className="flex flex-col items-center mb-6">
      {/* Progress Line */}
      <div className="flex w-full items-center mb-4 px-8">
        {steps.map((_, index) => (
          <div key={index} className="flex-1">
            <div
              className={`h-1 ${
                index <= currentPage ? "bg-blue-500" : "bg-gray-300"
              } ${index < steps.length - 1 ? "mr-2" : ""}`}
            />
          </div>
        ))}
      </div>

      {/* Step Buttons */}
      <div className="flex justify-around w-full bg-lewisRed rounded-lg py-4 px-4">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`text-lg ${
              index === currentPage ? "font-bold text-white" : "text-gray-300"
            }`}
          >
            {step}
          </button>
        ))}
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

export default ProgressBar;
