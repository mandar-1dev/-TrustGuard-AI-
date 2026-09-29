import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  jwtSecret: process.env.JWT_SECRET || 'trustguard_jwt_default_secret_key_change_in_production_2026',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  isSupabaseConfigured: Boolean(
    process.env.SUPABASE_URL && 
    process.env.SUPABASE_SERVICE_ROLE_KEY && 
    !process.env.SUPABASE_URL.includes('your-project-id') &&
    !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('your_supabase')
  ),
  isGeminiConfigured: Boolean(
    process.env.GEMINI_API_KEY && 
    !process.env.GEMINI_API_KEY.includes('your_gemini')
  )
};
