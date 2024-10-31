// src/Components/CreateCalendar.jsx

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { supabase } from '../utils/supabaseClient';
import { useUser } from '../contexts/UserContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const CreateCalendar = () => {
  const { state, dispatch } = useUser();
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
    first_day: '',
    last_day: '',
    start_time: '',
    end_time: '',
    days_of_class: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    instructor_name: '',
    class_name: '',
    location: '',
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const newCalendar = {
      ...values,
      user_id: state.user.id,
    };

    try {
      const { data, error } = await supabase
        .from('calendars')
        .insert([newCalendar])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      dispatch({ type: 'ADD_CALENDAR', payload: data });
      dispatch({ type: 'CACHE_CALENDAR', payload: { id: data.id, data } });
      dispatch({ type: 'SET_CURRENT_INDEX', payload: state.calendars.length });

      toast.success('New calendar created successfully!');
      resetForm();
      navigate('/'); // Redirect to main page or desired route
    } catch (error) {
      toast.error('Error creating calendar: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-lewisRed min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-white text-3xl font-bold mb-8 text-center">Create New Calendar</h1>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl border-none">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              {/* Start of Course Date */}
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
                <label htmlFor="first_day" className="mr-4 w-full sm:w-1/3">Start of Course Date</label>
                <Field
                  type="date"
                  name="first_day"
                  className="p-2 border rounded w-full sm:w-2/3"
                  aria-required="true"
                />
              </div>
              <ErrorMessage name="first_day" component="div" className="text-red-500 text-sm mb-2" />

              {/* End of Course Date */}
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
                <label htmlFor="last_day" className="mr-4 w-full sm:w-1/3">End of Course Date</label>
                <Field
                  type="date"
                  name="last_day"
                  className="p-2 border rounded w-full sm:w-2/3"
                  aria-required="true"
                />
              </div>
              <ErrorMessage name="last_day" component="div" className="text-red-500 text-sm mb-2" />

              {/* Start Time */}
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
                <label htmlFor="start_time" className="mr-4 w-full sm:w-1/3">Start Time</label>
                <Field
                  type="time"
                  name="start_time"
                  className="p-2 border rounded w-full sm:w-2/3"
                  aria-required="true"
                />
              </div>
              <ErrorMessage name="start_time" component="div" className="text-red-500 text-sm mb-2" />

              {/* End Time */}
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
                <label htmlFor="end_time" className="mr-4 w-full sm:w-1/3">End Time</label>
                <Field
                  type="time"
                  name="end_time"
                  className="p-2 border rounded w-full sm:w-2/3"
                  aria-required="true"
                />
              </div>
              <ErrorMessage name="end_time" component="div" className="text-red-500 text-sm mb-2" />

              {/* Days of Class */}
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
                <label className="mr-4 w-full sm:w-1/3 text-sm font-semibold">Days of Class</label>
                <div className="w-full sm:w-2/3 p-2 border rounded focus:outline-none focus:border-lewisRed">
                  {Object.keys(values.days_of_class).map((day) => (
                    <div key={day} className="flex items-center mb-2">
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
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
                <label htmlFor="instructor_name" className="mr-4 w-full sm:w-1/3">Instructor Name</label>
                <Field
                  type="text"
                  name="instructor_name"
                  className="p-2 border rounded w-full sm:w-2/3"
                  placeholder="Enter instructor name"
                  aria-required="true"
                />
              </div>
              <ErrorMessage name="instructor_name" component="div" className="text-red-500 text-sm mb-2" />

              {/* Course Name */}
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
                <label htmlFor="class_name" className="mr-4 w-full sm:w-1/3">Course Name</label>
                <Field
                  type="text"
                  name="class_name"
                  className="p-2 border rounded w-full sm:w-2/3"
                  placeholder="Enter course name"
                  aria-required="true"
                />
              </div>
              <ErrorMessage name="class_name" component="div" className="text-red-500 text-sm mb-2" />

              {/* Course Location */}
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
                <label htmlFor="location" className="mr-4 w-full sm:w-1/3">Course Location</label>
                <Field
                  type="text"
                  name="location"
                  className="p-2 border rounded w-full sm:w-2/3"
                  placeholder="Enter course location"
                  aria-required="true"
                />
              </div>
              <ErrorMessage name="location" component="div" className="text-red-500 text-sm mb-2" />

              {/* Save and Cancel Buttons */}
              <div className="flex justify-between mt-6">
                {/* Save Calendar Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-lewisRed text-white p-3 rounded hover:bg-red-600 transition disabled:opacity-50 w-1/2 mr-2"
                >
                  {isSubmitting ? 'Saving...' : 'Save Calendar'}
                </button>

                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-gray-500 text-white p-3 rounded hover:bg-gray-600 transition w-1/2 ml-2"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

CreateCalendar.propTypes = {};

export default CreateCalendar;
