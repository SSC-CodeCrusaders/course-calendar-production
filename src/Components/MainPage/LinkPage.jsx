import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { generateICSAndUpload } from "../../utils/icsGenerator";
import { academicCalendar } from "../../utils/academicCalendar";
import { generateSchedule } from "../../utils/scheduleGenerator";
import PropTypes from "prop-types";
import { createEvents } from "ics";

const LinkPage = ({ currentCalendar }) => {
  const [icsLink, setIcsLink] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIcsLink(null);
  }, [currentCalendar]);

  const handleDownloadICS = () => {
    const { className, academicTerm } = currentCalendar;
    if (!className || !academicTerm) {
      toast.error("Please ensure all fields are filled to generate the ICS file.");
      return;
    }

    const noClassesHolidays = academicCalendar[academicTerm].holidays
      .filter(h => h.name.includes("No Classes"))
      .map(h => ({
        start: new Date(h.startDate || h.date),
        end: new Date(h.endDate || h.date)
      }));
    
    const isNoClassesDay = (date) => {
      return noClassesHolidays.some(h => date >= h.start && date <= h.end);
    };

    const scheduleEvents = generateSchedule(currentCalendar).filter(evt => {
      return !isNoClassesDay(evt.start);
    });

    
    const allEvents = scheduleEvents.map(evt => ({
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
      description: [
        `Instructor: ${evt.instructorName}`,
        evt.notes ? `Notes: ${evt.notes}` : null,
      ].filter(Boolean).join("\n"),
      alarms: [
        {
          action: "display",
          trigger: { minutes: currentCalendar.reminderMinutes || 30, before: true },
          description: "Reminder",
        }
      ]
    }));

    setLoading(true);
    createEvents(allEvents, (error, value) => {
      if (error) {
        console.error("ICS creation error:", error);
        toast.error("Failed to generate ICS file.");
        setLoading(false);
        return;
      }
      const blob = new Blob([value], { type: "text/calendar" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${className}.ics`;
      document.body.appendChild(link)
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("ICS file downloaded successfully.");
      setLoading(false);
    });
  };

  const handleGenerateLink = async () => {
    const { className, academicTerm } = currentCalendar;
    if (!className || !academicTerm) {
      toast.error("Please ensure class name and term fields are filled.")
      setLoading(false);
      return;
    }

    const scheduleEvents = generateSchedule(currentCalendar);
    if (scheduleEvents.length === 0) {
      toast.error("No class sessions to export. Please select a time slot.");
      return;
    }
    setLoading(true);
    try {
      const link = await generateICSAndUpload(scheduleEvents, [], className);
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
    if (!icsLink) return;
    navigator.clipboard
      .writeText(icsLink)
      .then(() => toast.success("Link copied to clipboard."))
      .catch(() => toast.error("Failed to copy link to clipboard."));
  };

  return (
    <div className="bg-white text-black rounded-lg w-full max-w-7xl">
      <h1 className="text-2xl font-bold mb-4 text-center">Generate Calendar File:</h1>

      <div className="text-center space-x-1">
        {/* Direct Download */}
        <button
          onClick={handleDownloadICS}
          className={`bg-lewisRedDarker text-white px-4 py-2 mb-2 rounded ${loading ? "opacity-50" : ""}`}
          disabled={loading}
        >
          {loading ? "Generating ICS..." : "Download ICS File"}
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
            {loading ? "Generating Link..." : "Generate ICS Link"}
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
    firstDay: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.shape({ toDate: PropTypes.func })
    ]).isRequired,
    lastDay: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.shape({ toDate: PropTypes.func })
    ]).isRequired,
    location: PropTypes.string,
    instructorName: PropTypes.string,
    notes: PropTypes.string,
  }).isRequired,
};

export default LinkPage;
