import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mfokcfmemcpkqocirvez.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mb2tjZm1lbWNwa3FvY2lydmV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMjM3NTEsImV4cCI6MjA4Njg5OTc1MX0.dnLE_5-I1gopAaz2Tt1IGlmTcwtwiJ-N7XeAZoVyMcU';

export const supabase = createClient(supabaseUrl, supabaseKey);