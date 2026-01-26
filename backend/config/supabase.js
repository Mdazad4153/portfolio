// ===========================================
// SUPABASE CLIENT CONFIGURATION
// ===========================================
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || ''; // Use service key for server-side

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ CRITICAL: Missing Supabase credentials in environment variables!');
}

let supabase = null;

try {
    // Only attempt to initialize if we have BOTH credentials and URL looks valid
    if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
        supabase = createClient(supabaseUrl, supabaseKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });
    } else {
        console.warn('⚠️ Supabase Initialization Skipped: Missing or invalid credentials.');
    }
} catch (error) {
    console.error('❌ Supabase Client Initialization Failed:', error.message);
    supabase = null;
}

// Test connection helper
const testConnection = async () => {
    try {
        if (!supabase) return;

        const { error } = await supabase.from('profiles').select('id').limit(1);
        if (error) {
            console.error('❌ Supabase Auth/Connection Error:', error.message);
        } else {
            console.log('✅ Supabase Connection Verified');
        }
    } catch (err) {
        console.error('❌ Supabase Test Connection Exception:', err.message);
    }
};

module.exports = { supabase, testConnection };
