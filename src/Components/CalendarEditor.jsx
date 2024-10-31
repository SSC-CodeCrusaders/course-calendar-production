// src/Components/CalendarEditor.jsx

import PropTypes from 'prop-types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const CalendarEditor = ({ calendar, onSave, onDownloadICS }) => {
  // Destructure with default values to prevent undefined errors
  const {
    first_day = '',
    last_day = '',
    start_time = '',
    end_time = '',
    days_of_class = {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    instructor_name = '',
    class_name = '',
    location = '',
  } = calendar || {};

  const initialValues = {
    first_day,
    last_day,
    start_time,
    end_time,
    days_of_class,
    instructor_name,
    class_name,
    location,
  };

  const validationSchema = Yup.object({
    first_day: Yup.date().required('Start of Course Date is required'),
    last_day: Yup.date()
      .min(Yup.ref('first_day'), 'End date must be after start date')
      .required('End of Course Date is required'),
    start_time: Yup.string().required('Start Time is required'),
    end_time: Yup.string()
      .test('is-greater', 'End time must be later than start time', function (value) {
        const { start_time } = this.parent;
        return start_time && value && start_time < value;
      })
      .required('End Time is required'),
    days_of_class: Yup.object({
      monday: Yup.boolean(),
      tuesday: Yup.boolean(),
      wednesday: Yup.boolean(),
      thursday: Yup.boolean(),
      friday: Yup.boolean(),
      saturday: Yup.boolean(),
      sunday: Yup.boolean(),
    }).test('at-least-one-day', 'Select at least one day of class', (days) =>
      Object.values(days).some((v) => v)
    ),
    instructor_name: Yup.string().required('Instructor Name is required'),
    class_name: Yup.string().required('Course Name is required'),
    location: Yup.string().required('Course Location is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const updatedCalendar = {
      ...calendar,
      ...values,
    };

    try {
      await onSave(updatedCalendar);
      toast.success('Calendar updated successfully!');
      setSubmitting(false);
    } catch (error) {
      console.error('Error updating calendar:', error);
      toast.error('Error updating calendar: ' + error.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {/* Start of Course Date */}
            <div className="flex items-center">
              <label htmlFor="first_day" className="block text-sm font-semibold mb-1 w-1/3">
                Start of Course Date
              </label>
              <Field
                type="date"
                name="first_day"
                className="w-full p-3 border rounded focus:outline-none focus:border-lewisRed"
                aria-required="true"
              />
            </div>
            <ErrorMessage name="first_day" component="div" className="text-red-500 text-sm mb-2" />

            {/* End of Course Date */}
            <div className="flex items-center">
              <label htmlFor="last_day" className="block text-sm font-semibold mb-1 w-1/3">
                End of Course Date
              </label>
              <Field
                type="date"
                name="last_day"
                className="w-full p-3 border rounded focus:outline-none focus:border-lewisRed"
                aria-required="true"
              />
            </div>
            <ErrorMessage name="last_day" component="div" className="text-red-500 text-sm mb-2" />

            {/* Start Time */}
            <div className="flex items-center">
              <label htmlFor="start_time" className="block text-sm font-semibold mb-1 w-1/3">
                Start Time
              </label>
              <Field
                type="time"
                name="start_time"
                className="w-full p-3 border rounded focus:outline-none focus:border-lewisRed"
                aria-required="true"
              />
            </div>
            <ErrorMessage name="start_time" component="div" className="text-red-500 text-sm mb-2" />

            {/* End Time */}
            <div className="flex items-center">
              <label htmlFor="end_time" className="block text-sm font-semibold mb-1 w-1/3">
                End Time
              </label>
              <Field
                type="time"
                name="end_time"
                className="w-full p-3 border rounded focus:outline-none focus:border-lewisRed"
                aria-required="true"
              />
            </div>
            <ErrorMessage name="end_time" component="div" className="text-red-500 text-sm mb-2" />

            {/* Days of Class */}
            <div className="flex items-center">
              <label className="block text-sm font-semibold mb-1 w-1/3">Days of Class</label>
              <div className="w-full p-3 border rounded focus:outline-none focus:border-lewisRed">
                {Object.keys(days_of_class).map((day) => (
                  <div key={day} className="flex items-center mb-2">
                    <Field
                      type="checkbox"
                      name={`days_of_class.${day}`}
                      id={day}
                      className="form-checkbox h-5 w-5 text-lewisRed"
                    />
                    <label htmlFor={day} className="ml-2 capitalize">
                      {day}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <ErrorMessage name="days_of_class" component="div" className="text-red-500 text-sm mb-2" />

            {/* Instructor Name */}
            <div className="flex items-center">
              <label htmlFor="instructor_name" className="block text-sm font-semibold mb-1 w-1/3">
                Instructor Name
              </label>
              <Field
                type="text"
                name="instructor_name"
                className="w-full p-3 border rounded focus:outline-none focus:border-lewisRed"
                placeholder="Enter instructor name"
                aria-required="true"
              />
            </div>
            <ErrorMessage name="instructor_name" component="div" className="text-red-500 text-sm mb-2" />

            {/* Course Name */}
            <div className="flex items-center">
              <label htmlFor="class_name" className="block text-sm font-semibold mb-1 w-1/3">
                Course Name
              </label>
              <Field
                type="text"
                name="class_name"
                className="w-full p-3 border rounded focus:outline-none focus:border-lewisRed"
                placeholder="Enter course name"
                aria-required="true"
              />
            </div>
            <ErrorMessage name="class_name" component="div" className="text-red-500 text-sm mb-2" />

            {/* Course Location */}
            <div className="flex items-center">
              <label htmlFor="location" className="block text-sm font-semibold mb-1 w-1/3">
                Course Location
              </label>
              <Field
                type="text"
                name="location"
                className="w-full p-3 border rounded focus:outline-none focus:border-lewisRed"
                placeholder="Enter course location"
                aria-required="true"
              />
            </div>
            <ErrorMessage name="location" component="div" className="text-red-500 text-sm mb-2" />

            {/* Save and Download Buttons */}
            <div className="flex justify-between mt-6">
              {/* Save Calendar Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-lewisRed text-white p-3 rounded hover:bg-red-600 transition disabled:opacity-50 w-1/2 mr-2"
              >
                {isSubmitting ? 'Saving...' : 'Save Calendar'}
              </button>

              {/* Download ICS Button */}
              <button
                type="button"
                onClick={onDownloadICS}
                className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition w-1/2 ml-2"
              >
                Download ICS
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

CalendarEditor.propTypes = {
  calendar: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onDownloadICS: PropTypes.func.isRequired,
};

export default CalendarEditor;
