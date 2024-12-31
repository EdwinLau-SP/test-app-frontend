import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jsstuhiulqttybxtkhxq.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3R1aGl1bHF0dHlieHRraHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4MDk4MzQsImV4cCI6MjA0OTM4NTgzNH0.BfpaD9eKi56HGwrWQzGuzNmaLYUY6oLl55EViKn-56U';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
