require('dotenv').config({ path: './backend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkProfiles() {
    const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Total Profiles: ${count}`);
    console.log('IDs:', data.map(p => ({ id: p.id, name: p.name, created: p.created_at })));
}

checkProfiles();
