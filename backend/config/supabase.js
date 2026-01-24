// ===========================================
// SUPABASE CLIENT CONFIGURATION
// ===========================================
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || ''; // Use service key for server-side

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ CRITICAL: Missing Supabase credentials in environment variables!');
    console.error('   Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in your hosting (Vercel/Render) dashboard.');
}

// Ensure we don't pass empty strings to createClient if they are missing
// but still create a dummy client if needed to prevent boot crash
const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
    : null;

// Test connection
const testConnection = async () => {
    try {
        if (!supabase) {
            console.error('❌ Supabase client is not initialized. Check environment variables.');
            return;
        }

        const { data, error } = await supabase.from('profiles').select('*').limit(1);

        if (error) {
            console.error('❌ Supabase connection error:', error.message);
        } else {
            console.log('✅ Supabase Connected Successfully');
        }
    } catch (err) {
        console.error('❌ Supabase connection failed:', err.message);
    }
};

// Export supabase client and test function
module.exports = { supabase, testConnection };
