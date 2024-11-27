import { useState } from "react";
import { toast } from "react-toastify";
import { generateICSAndUpload } from "../../utils/icsGenerator";
import { academicCalendar } from "../../utils/academicCalendar";
import { generateSchedule } from "../../utils/scheduleGenerator";
import PropTypes from "prop-types";

const LinkPage = ({ currentCalendar }) => {
  const [icsLink, setIcsLink] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateLink = async () => {
    console.log("Generating ICS for calendar:", currentCalendar);
    setLoading(true);

    try {
      // Validate required fields
      const { className, startTime, endTime, academicTerm } = currentCalendar;
      if (!className || !startTime || !endTime || !academicTerm) {
        toast.error("Please ensure all fields are filled to generate the ICS link.");
        setLoading(false);
        return;
      }

      // Generate schedule events
      const scheduleEvents = generateSchedule(currentCalendar);

      // Retrieve holidays for the selected academic term
      const termHolidays = academicCalendar[academicTerm]?.holidays || [];
      const holidayEvents = termHolidays.map((holiday) => ({
        name: holiday.name,
        date: new Date(holiday.date),
      }));

      // Generate and upload ICS file, then set the link
      const link = await generateICSAndUpload(scheduleEvents, holidayEvents, className);
      setIcsLink(link.publicUrl);
      toast.success("ICS link generated successfully!");
    } catch (error) {
      console.error("Failed to generate ICS link:", error);
      toast.error("Failed to generate ICS link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (icsLink) {
      navigator.clipboard.writeText(icsLink).then(() => {
        toast.success("Link copied to clipboard!");
      }).catch(() => {
        toast.error("Failed to copy the link.");
      });
    }
  };

  return (
    <div className="bg-lewisRed min-h-screen flex flex-col items-center justify-start p-12">
      <h1 className="text-white text-3xl font-bold mb-8 text-center">Add Your Schedule to Your Calendar</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl text-center">
        {icsLink ? (
          <>
            <p className="mb-6 text-lg">
              Your schedule is ready! Use the link below to add it to your calendar:
            </p>
            <div className="flex justify-center mb-6">
              <button
                onClick={handleCopyToClipboard}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded mr-4"
              >
                Copy Link
              </button>
              {/* <a
                href={icsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded mr-4"
              >
                Open Link
              </a> */}
            </div>
            <div className="text-left">
              <h2 className="text-xl font-semibold mb-4">How to Use This Link</h2>
              <ul className="list-disc ml-6 text-gray-700">
                <li>
                  <strong>Google Calendar:</strong> Go to <strong>Google Calendar</strong>, click on <strong>+ Add Other Calendars {'>'} From URL</strong>, and paste the link.
                </li>
                <li>
                  <strong>Apple Calendar:</strong> Open the Calendar app, go to <strong>File {'>'} New Calendar Subscription</strong>, and paste the link.
                </li>
                <li>
                  <strong>Outlook:</strong> Go to <strong>File {'>'} Account Settings {'>'} Account Settings {'>'} Internet Calendars {'>'} New</strong>, and paste the link.
                </li>
              </ul>
            </div>
          </>
        ) : (
          <button
            onClick={handleGenerateLink}
            className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? "opacity-50" : ""}`}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate ICS Link"}
          </button>
        )}
      </div>
    </div>
  );
};

LinkPage.propTypes = {
  currentCalendar: PropTypes.shape({
    className: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    academicTerm: PropTypes.string.isRequired,
    firstDay: PropTypes.string.isRequired,
    lastDay: PropTypes.string.isRequired,
    daysOfClass: PropTypes.objectOf(PropTypes.bool).isRequired,
    location: PropTypes.string,
    instructorName: PropTypes.string,
  }).isRequired,
};

export default LinkPage;
