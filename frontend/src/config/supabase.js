const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ujflplnufhxxtsozmudv.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqZmxwbG51Zmh4eHRzb3ptdWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MTcxMjAsImV4cCI6MjA5NDQ5MzEyMH0.T4oGPlzLgEIJUAPk1WZTzuj-7yJ5dsEjvxqdc-bWYSU';

export const supabaseConfig = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY
};

export const STORAGE_BUCKET = 'book-covers';

export default supabaseConfig;