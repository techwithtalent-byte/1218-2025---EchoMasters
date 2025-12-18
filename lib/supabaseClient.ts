
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://imvvnqsmoyiuuextupkr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltdnZucXNtb3lpdXVleHR1cGtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NjIwMTgsImV4cCI6MjA4MTAzODAxOH0.GZ7nz6DsFDR44HNdpORGs_1tEbyv_E8CIVS-mJjudd4';

export const supabase = createClient(supabaseUrl, supabaseKey);
