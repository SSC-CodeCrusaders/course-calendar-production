import PropTypes from 'prop-types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import FormField from './FormField';
import Button from './Button';

const CalendarEditor = ({ calendar, onSave, onDownloadICS }) => {
  const navigate = useNavigate();

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

  const initialValues = {
    first_day: calendar.first_day || '',
    last_day: calendar.last_day || '',
    start_time: calendar.start_time || '',
    end_time: calendar.end_time || '',
    days_of_class: calendar.days_of_class || {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    instructor_name: calendar.instructor_name || '',
    class_name: calendar.class_name || '',
    location: calendar.location || '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const updatedCalendar = {
      ...calendar,
      ...values,
    };

    try {
      await onSave(updatedCalendar);
      toast.success('Calendar updated successfully!');
      setSubmitting(false);
      navigate('/'); // Redirect to main page or desired route if needed
    } catch (error) {
      console.error('Error updating calendar:', error);
      toast.error('Error updating calendar: ' + error.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-lewisRed min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-white text-3xl font-bold mb-8 text-center">Edit Calendar</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              {/* Start of Course Date */}
              <FormField
                label="Start of Course Date"
                name="first_day"
                type="date"
                placeholder="Select start date"
              />
              <ErrorMessage name="first_day" component="div" className="text-red-500 text-sm mb-2" />

              {/* End of Course Date */}
              <FormField
                label="End of Course Date"
                name="last_day"
                type="date"
                placeholder="Select end date"
              />
              <ErrorMessage name="last_day" component="div" className="text-red-500 text-sm mb-2" />

              {/* Start Time */}
              <FormField
                label="Start Time"
                name="start_time"
                type="time"
                placeholder="Select start time"
              />
              <ErrorMessage name="start_time" component="div" className="text-red-500 text-sm mb-2" />

              {/* End Time */}
              <FormField
                label="End Time"
                name="end_time"
                type="time"
                placeholder="Select end time"
              />
              <ErrorMessage name="end_time" component="div" className="text-red-500 text-sm mb-2" />

              {/* Days of Class */}
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
                <label className="mr-4 w-full sm:w-1/3 text-sm font-semibold">Days of Class</label>
                <div className="w-full sm:w-2/3 p-2 border rounded focus:outline-none focus:border-lewisRed grid grid-cols-2 gap-2">
                  {Object.keys(values.days_of_class).map((day) => (
                    <div key={day} className="flex items-center">
                      <Field
                        type="checkbox"
                        name={`days_of_class.${day}`}
                        id={day}
                        onChange={() => setFieldValue(`days_of_class.${day}`, !values.days_of_class[day])}
                        className="form-checkbox h-5 w-5 text-lewisRed"
                      />
                      <label htmlFor={day} className="ml-2 capitalize">{day}</label>
                    </div>
                  ))}
                </div>
              </div>
              <ErrorMessage name="days_of_class" component="div" className="text-red-500 text-sm mb-2" />

              {/* Instructor Name */}
              <FormField
                label="Instructor Name"
                name="instructor_name"
                type="text"
                placeholder="Enter instructor name"
              />
              <ErrorMessage name="instructor_name" component="div" className="text-red-500 text-sm mb-2" />

              {/* Course Name */}
              <FormField
                label="Course Name"
                name="class_name"
                type="text"
                placeholder="Enter course name"
              />
              <ErrorMessage name="class_name" component="div" className="text-red-500 text-sm mb-2" />

              {/* Course Location */}
              <FormField
                label="Course Location"
                name="location"
                type="text"
                placeholder="Enter course location"
              />
              <ErrorMessage name="location" component="div" className="text-red-500 text-sm mb-2" />

              {/* Action Buttons */}
              <div className="flex justify-between mt-6">
                {/* Save Calendar Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-lewisRed hover:bg-red-600 w-1/2 mr-2"
                >
                  {isSubmitting ? 'Saving...' : 'Save Calendar'}
                </Button>

                {/* Download ICS Button */}
                <Button
                  type="button"
                  onClick={onDownloadICS}
                  className="bg-blue-500 hover:bg-blue-600 w-1/2 ml-2"
                >
                  Download ICS
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

CalendarEditor.propTypes = {
  calendar: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onDownloadICS: PropTypes.func.isRequired,
};

export default CalendarEditor;
