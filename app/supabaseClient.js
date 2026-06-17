import { createClient } from '@supabase/supabase-js'

// 1. Aapka sahi URL humne yahan daal diya hai
const supabaseUrl = 'https://ydmtuzkharvuedqbakif.supabase.co'

// 2. Aapki asli Anon Key jo aapne dhoondi thi
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkbXR1emtoYXJ2dWVkcWJha2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2ODkwNjEsImV4cCI6MjA5NzI2NTA2MX0.y6TUlGq4wKSDRvbt9qphHVg9xQNPUeRa55GT2P1ZUSQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)