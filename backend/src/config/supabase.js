const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://ujflplnufhxxtsozmudv.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqZmxwbG51Zmh4eHRzb3ptdWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MTcxMjAsImV4cCI6MjA5NDQ5MzEyMH0.T4oGPlzLgEIJUAPk1WZTzuj-7yJ5dsEjvxqdc-bWYSU';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqZmxwbG51Zmh4eHRzb3ptdWR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODkxNzEyMCwiZXhwIjoyMDk0NDkzMTIwfQ.Sl0yK1P0plXXRFYqog1KsEODrUS3i8LVNYV3TwclrKo';

const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;
module.exports.supabaseAdmin = supabaseAdmin;