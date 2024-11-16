import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Environment variables for Supabase are missing.");
  throw new Error("supabaseUrl and supabaseAnonKey are required");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fetch schedules for a logged-in user
export const fetchSchedules = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("calendars")
      .select("*")
      .eq("user_id", userId);

    if (error) throw new Error(error.message);

    // Map snake_case to camelCase for the app
    return data.map((calendar) => ({
      id: calendar.id,
      user_id: calendar.user_id,
      className: calendar.class_name,
      instructorName: calendar.instructor_name,
      location: calendar.location,
      firstDay: calendar.first_day,
      lastDay: calendar.last_day,
      startTime: calendar.start_time,
      endTime: calendar.end_time,
      daysOfClass: typeof calendar.days_of_class === "string" ? JSON.parse(calendar.days_of_class) : calendar.days_of_class,
      createdAt: calendar.created_at,
    }));
  } catch (error) {
    console.error("Error fetching schedules:", error.message);
    throw error;
  }
};

// Save a new schedule to Supabase for a logged-in user
export const saveSchedule = async (schedule) => {
  try {
    const { data, error } = await supabase.from("calendars").insert({
      user_id: schedule.user_id,
      class_name: schedule.className,
      instructor_name: schedule.instructorName,
      location: schedule.location,
      first_day: schedule.firstDay,
      last_day: schedule.lastDay,
      start_time: schedule.startTime,
      end_time: schedule.endTime,
      days_of_class: JSON.stringify(schedule.daysOfClass),
    });

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error("Error saving schedule:", error.message);
    throw error;
  }
};

// Update an existing schedule in Supabase
export const updateSchedule = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from("calendars")
      .update({
        class_name: updates.className,
        instructor_name: updates.instructorName,
        location: updates.location,
        first_day: updates.firstDay,
        last_day: updates.lastDay,
        start_time: updates.startTime,
        end_time: updates.endTime,
        days_of_class: JSON.stringify(updates.daysOfClass),
      })
      .eq("id", id);

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error("Error updating schedule:", error.message);
    throw error;
  }
};
