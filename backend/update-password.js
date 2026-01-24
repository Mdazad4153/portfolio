// ===========================================
// UPDATE SUPABASE USER PASSWORD
// ===========================================
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

const EMAIL = 'azad79900@gmail.com';
const NEW_PASSWORD = 'Azad@4141';

async function updatePassword() {
    console.log('🔐 Updating password for:', EMAIL);
    console.log('   New password:', NEW_PASSWORD);

    try {
        // 1. Find user in Supabase Auth
        const { data: users, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;

        const user = users.users.find(u => u.email === EMAIL);

        if (!user) {
            console.log('❌ User not found in Supabase Auth');
            return;
        }

        console.log('   User ID:', user.id);

        // 2. Update password in Supabase Auth
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
            password: NEW_PASSWORD
        });

        if (updateError) throw updateError;
        console.log('✅ Supabase Auth password updated!');

        // 3. Update password in admins table
        const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 12);
        const { error: dbError } = await supabase
            .from('admins')
            .update({ password: hashedPassword })
            .eq('email', EMAIL);

        if (dbError) {
            console.log('⚠️ Could not update admins table:', dbError.message);
        } else {
            console.log('✅ Admins table password updated!');
        }

        console.log('\n🎉 Password update complete!');
        console.log('📋 Login Credentials:');
        console.log('   Email:', EMAIL);
        console.log('   Password:', NEW_PASSWORD);

    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

updatePassword();
