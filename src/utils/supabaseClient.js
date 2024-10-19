import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://otgflatuxludmkdetdbc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90Z2ZsYXR1eGx1ZG1rZGV0ZGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxMzk3MDgsImV4cCI6MjA0NDcxNTcwOH0.jI1LE1yIv-8t3gQzdce8IlL9Won1xIxhjTsJx-eFqcU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
