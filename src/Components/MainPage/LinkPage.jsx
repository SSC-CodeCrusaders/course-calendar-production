import { useState } from "react";
import { toast } from "react-toastify";
import { generateICSAndUpload } from "../../utils/icsGenerator";
import { academicCalendar } from "../../utils/academicCalendar";
import { generateSchedule } from "../../utils/scheduleGenerator";
import PropTypes from "prop-types";
import { createEvents } from "ics";

const LinkPage = ({ currentCalendar }) => {
  const [icsLink, setIcsLink] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDownloadICS = async () => {
    console.log("Generating ICS for calendar:", currentCalendar);
    setLoading(true);

    try {
      // Validate required fields
      const { className, academicTerm } = currentCalendar;
      if (!className || !academicTerm) {
        toast.error("Please ensure all fields are filled to generate the ICS link.");
        setLoading(false);
        return;
      }

      // Generate schedule events
      const scheduleEvents = generateSchedule(currentCalendar);

      // Retrieve holidays for the selected academic term
      const termHolidays = academicCalendar[academicTerm]?.holidays || [];
      const holidayEvents = termHolidays.map((holiday) => {
        return {
          title: holiday.name,
          start: (() => {
            if (holiday.date) {
              const d = new Date(holiday.date);
              return [d.getFullYear(), d.getMonth() + 1, d.getDate()];
            }
            return null;
          })(),
          duration: { hours: 0, minutes: 0 },
          description: `${holiday.name} Holiday`,
        };
      }).filter(ev => ev.start !== null);

      const allEvents = [
        ...scheduleEvents.map((evt) => ({
          title: evt.className,
          start: [
            evt.start.getFullYear(),
            evt.start.getMonth() + 1,
            evt.start.getDate(),
            evt.start.getHours(),
            evt.start.getMinutes(),
          ],
          duration: evt.duration,
          location: evt.location,
          description: `Instructor: ${evt.instructorName || ""}`,
        })),
        ...holidayEvents,
      ];

      createEvents(allEvents, (error, value) => {
        if (error) {
          console.error("ICS creation error:", error);
          toast.error("Failed to generate ICS file.");
          setLoading(false);
          return;
        }

        const blob = new Blob ([value], { type: "text/calendar" });
        const icsUrl = URL.createObjectURL(blob);

        const downloadLink = document.createElement("a");
        downloadLink.href = icsUrl;
        downloadLink.download = `${className || "myschedule"}.ics`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        URL.revokeObjectURL(icsURL);

        toast.success("ICS file downloaded successfully.")
        setLoading(false);
      });
    } catch (err) {
      console.error("Failed to generate ICS locally:", err);
      toast.error("Failed to generate ICS file locally.");
      setLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    setLoading(true);

    try {
      const { className, academicTerm } = currentCalendar;
      if (!className || !academicTerm) {
        toast.error("Please ensure class name and term fields are filled.")
        setLoading(false);
        return;
      }
      const scheduleEvents = generateSchedule(currentCalendar);
      const termHolidays = academicCalendar[academicTerm]?.holidays || [];
      const holidayEvents = termHolidays.map((holiday) => ({
        name: holiday.name,
        date: new Date(holiday.date),
      }));

      const link = await generateICSAndUpload(scheduleEvents, holidayEvents, className);
      setIcsLink(link);
      toast.success("ICS link generated successfully.");
    } catch (error) {
      console.error("Failed to generate ICS link:", error);
      toast.error("Failed to generate ICS link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (icsLink) {
      navigator.clipboard.writeText(icsLink)
        .then(() => toast.success("Link copied to clipboard."))
        .catch(() => toast.error("Failed to copy link to clipboard."));
    }
  };

  return (
    <div className="bg-white text-black rounded-lg p-6 w-full max-w-7xl mx-auto mt-1">
      <h1 className="text-2xl font-bold mb-4 text-center">Add Your Schedule to Your Calendar</h1>

      <div className="text-center space-x-4">
        {/* Direct Download */}
        <button
          onClick={handleDownloadICS}
          className={`bg-lewisRedDarker text-white px-4 py-2 rounded ${loading ? "opacity-50" : ""}`}
          disabled={loading}
        >
          {loading ? "Generating ICS..." : "Download ICS Locally"}
        </button>

        {/* Firebase Link */}
        {icsLink ? (
          <>
            <p className="text-lg">Your sharable link:</p>
            <div className="flex justify-center mb-6 gap-2">
              <button
                onClick={handleCopyToClipboard}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Copy Link
              </button>
              <a
                href={icsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Open Link
              </a>
            </div>

            <div className="text-left mx-auto max-w-lg">
              <h2 className="text-xl font-semibold mb-4">How to use this link:</h2>
              <ul className="list-disc ml-6 text-red-900">
                <li>
                  <strong>Google Calendar:</strong>
                  Go to Google Calendar, click <strong>+ Add Other Calendars {'>'} From URL</strong>, and paste the link.
                </li>
                <li>
                  <strong>Apple Calendar:</strong>
                  Open Apple Calendar,  go <strong>File {'>'} New Calendar Subscription</strong>, and paste the link.
                </li>
                <li>
                  <strong>Outlook:</strong>
                  <strong>File {'>'} Account Settings {'>'} Account Settings {'>'} Internet Calendars {'>'} New</strong>, paste the link.
                </li>
              </ul>
            </div>
          </>
        ) : (
          <button
            onClick={handleGenerateLink}
            className={`bg-lewisRedDarker text-white px-4 py-2 rounded ${loading ? "opacity-50" : ""}`}
            disabled={loading}
          >
            {loading ? "Generating Link..." : "Generate ICS Link Online"}
          </button>
        )}
      </div>
    </div>
  );
};

LinkPage.propTypes = {
  currentCalendar: PropTypes.shape({
    className: PropTypes.string.isRequired,
    academicTerm: PropTypes.string,
    firstDay: PropTypes.string.isRequired,
    lastDay: PropTypes.string.isRequired,
    daysOfClass: PropTypes.objectOf(PropTypes.bool).isRequired,
    location: PropTypes.string,
    instructorName: PropTypes.string,
  }).isRequired,
};

export default LinkPage;
