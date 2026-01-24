// ===========================================
// SUPABASE REALTIME CONFIGURATION
// ===========================================
// This file handles real-time updates across the portfolio
// Admin changes -> Main page updates instantly
// Main page contact form -> Admin sees new messages instantly

// ===========================================
// ⚠️ IMPORTANT: UPDATE THESE WITH YOUR SUPABASE CREDENTIALS
// ===========================================
// Get these from: Supabase Dashboard → Settings → API
// Use the 'anon' public key (NOT service_role key!)

// Your Supabase Project URL (MUST MATCH YOUR BACKEND .env)
// Check if already defined by supabase-auth.js (avoid duplicate const error)
const SUPABASE_REALTIME_URL = window.SUPABASE_URL || 'https://rihgzpvuhopywaevscmk.supabase.co';

// Your Supabase Anon Key (Public - safe to use in frontend)
// Get this from: Supabase Dashboard → Settings → API → anon public
const SUPABASE_REALTIME_KEY = window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaGd6cHZ1aG9weXdhZXZzY21rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MjcxODEsImV4cCI6MjA3NDQwMzE4MX0.7_mpVwbmvl21EQ6fFQPcwwPzU4Hkp68gFy-Ns7-qXiE';

// Initialize Supabase Client
let supabaseClient = null;
let mainPageChannel = null;    // Channel for main page updates
let adminPageChannel = null;   // Channel for admin page updates (separate!)
let themeChannel = null;      // Global channel for theme broadcasting


// Initialize Supabase when the script loads
let themeBroadcastCallback = null;

function initSupabase() {
    // If already initialized, return
    if (supabaseClient) return true;

    // Try to reuse the auth client if it exists
    if (typeof supabaseAuthClient !== 'undefined' && supabaseAuthClient) {
        supabaseClient = supabaseAuthClient;
    } else if (typeof supabase !== 'undefined' && supabase.createClient) {
        try {
            supabaseClient = supabase.createClient(SUPABASE_REALTIME_URL, SUPABASE_REALTIME_KEY, {
                auth: { persistSession: false, autoRefreshToken: false }
            });
        } catch (e) {
            console.error('❌ Supabase init error:', e);
            return false;
        }
    }

    if (supabaseClient) {
        // Initialize Global Theme Channel for Instant Sync
        themeChannel = supabaseClient.channel('global-theme', {
            config: { broadcast: { self: true } }
        });

        // Listen for theme broadcasts globally
        themeChannel.on('broadcast', { event: 'theme_update' }, (payload) => {
            console.log('⚡ Global Theme Sync:', payload.payload);
            const data = payload.payload;

            // 1. apply to CSS variables immediately
            if (data && data.primary_color && window.ThemeService) {
                window.ThemeService.applyThemeColor(data.primary_color);
            }

            // 2. call any page-specific registration
            if (themeBroadcastCallback) themeBroadcastCallback(data);
        });

        themeChannel.subscribe((status) => {
            console.log(`🌈 Theme Sync Status: ${status}`);
            const badge = document.getElementById('themeStatusBadge');
            if (badge) {
                if (status === 'SUBSCRIBED') {
                    badge.style.opacity = '1';
                    badge.innerHTML = '<i class="fas fa-bolt"></i> Real-time Active';
                    badge.style.background = 'rgba(var(--primary-rgb), 0.1)';
                    badge.style.color = 'rgb(var(--primary-rgb))';
                } else {
                    badge.style.opacity = '0.7';
                    badge.innerHTML = '<i class="fas fa-sync fa-spin"></i> Connecting...';
                    badge.style.background = 'rgba(255, 255, 255, 0.05)';
                    badge.style.color = 'var(--text-muted)';
                }
            }
        });

        console.log('✅ Supabase Realtime Initialized');
        return true;
    }

    return false;
}

// Clear any invalid Supabase auth tokens (call this on main page load)
function clearInvalidTokens() {
    try {
        // Only clear if we're on main page (not admin)
        if (!window.location.pathname.includes('admin')) {
            // Check if there are old tokens causing issues
            const authKey = Object.keys(localStorage).find(k => k.includes('supabase') && k.includes('auth'));
            if (authKey) {
                console.log('🧹 Clearing old auth tokens from main page...');
                // Don't delete - just let the new client handle it
            }
        }
    } catch (e) {
        console.log('Token cleanup skipped');
    }
}

// ===========================================
// REALTIME SUBSCRIPTIONS FOR MAIN PAGE
// ===========================================

function subscribeToMainPageUpdates(callbacks = {}) {
    if (!supabaseClient) {
        if (!initSupabase()) return;
    }

    // Unsubscribe from existing main page channel if any
    if (mainPageChannel) {
        supabaseClient.removeChannel(mainPageChannel);
    }

    // Create a new channel for all portfolio updates (main page only)
    mainPageChannel = supabaseClient.channel('portfolio-updates')
        // Profile changes
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'profiles' },
            (payload) => {
                console.log('📡 Profile updated in real-time');
                if (callbacks.onProfileUpdate) callbacks.onProfileUpdate(payload);
            }
        )
        // Skills changes
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'skills' },
            (payload) => {
                console.log('📡 Skills updated in real-time');
                if (callbacks.onSkillsUpdate) callbacks.onSkillsUpdate(payload);
            }
        )
        // Projects changes
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'projects' },
            (payload) => {
                console.log('📡 Projects updated in real-time');
                if (callbacks.onProjectsUpdate) callbacks.onProjectsUpdate(payload);
            }
        )
        // Education changes
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'education' },
            (payload) => {
                console.log('📡 Education updated in real-time');
                if (callbacks.onEducationUpdate) callbacks.onEducationUpdate(payload);
            }
        )
        // Services changes
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'services' },
            (payload) => {
                console.log('📡 Services updated in real-time');
                if (callbacks.onServicesUpdate) callbacks.onServicesUpdate(payload);
            }
        )
        // Certificates changes
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'certificates' },
            (payload) => {
                console.log('📡 Certificates updated in real-time');
                if (callbacks.onCertificatesUpdate) callbacks.onCertificatesUpdate(payload);
            }
        )
        // Settings changes (Database replication)
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'settings' },
            (payload) => {
                console.log('📡 Settings updated in database');
                if (callbacks.onSettingsUpdate) callbacks.onSettingsUpdate(payload.new || payload);
            }
        )
        .subscribe((status) => {
            console.log(`📡 Main Page Realtime Status: ${status}`);
        });

    return mainPageChannel;
}

// ===========================================
// REALTIME SUBSCRIPTIONS FOR ADMIN PAGE
// ===========================================

function subscribeToAdminUpdates(callbacks = {}) {
    if (!supabaseClient) {
        if (!initSupabase()) return;
    }

    // Unsubscribe from existing admin channel if any
    if (adminPageChannel) {
        supabaseClient.removeChannel(adminPageChannel);
    }

    // Create a new channel for admin updates (mainly contacts/messages)
    adminPageChannel = supabaseClient.channel('admin-updates')
        // New contact messages
        .on('postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'contacts' },
            (payload) => {
                console.log('📡 New message received in real-time!');
                if (callbacks.onNewMessage) callbacks.onNewMessage(payload);
            }
        )
        // Message updates (read status)
        .on('postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'contacts' },
            (payload) => {
                console.log('📡 Message updated in real-time');
                if (callbacks.onMessageUpdate) callbacks.onMessageUpdate(payload);
            }
        )
        // Message deleted
        .on('postgres_changes',
            { event: 'DELETE', schema: 'public', table: 'contacts' },
            (payload) => {
                console.log('📡 Message deleted in real-time');
                if (callbacks.onMessageDelete) callbacks.onMessageDelete(payload);
            }
        )
        // Session changes (login/logout from any device)
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'admin_sessions' },
            (payload) => {
                console.log('📡 Session changed in real-time:', payload.eventType);
                if (callbacks.onSessionChange) callbacks.onSessionChange(payload);
            }
        )
        // Profile changes (for media section sync)
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'profiles' },
            (payload) => {
                console.log('📡 Profile updated in real-time');
                if (callbacks.onProfileUpdate) callbacks.onProfileUpdate(payload);
            }
        )
        // Skills changes
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'skills' },
            (payload) => {
                console.log('📡 Skills updated in real-time');
                if (callbacks.onSkillsUpdate) callbacks.onSkillsUpdate(payload);
            }
        )
        // Projects changes
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'projects' },
            (payload) => {
                console.log('📡 Projects updated in real-time');
                if (callbacks.onProjectsUpdate) callbacks.onProjectsUpdate(payload);
            }
        )
        // Education changes
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'education' },
            (payload) => {
                console.log('📡 Education updated in real-time');
                if (callbacks.onEducationUpdate) callbacks.onEducationUpdate(payload);
            }
        )
        // Services changes
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'services' },
            (payload) => {
                console.log('📡 Services updated in real-time');
                if (callbacks.onServicesUpdate) callbacks.onServicesUpdate(payload);
            }
        )
        // Certificates changes
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'certificates' },
            (payload) => {
                console.log('📡 Certificates updated in real-time');
                if (callbacks.onCertificatesUpdate) callbacks.onCertificatesUpdate(payload);
            }
        )
        // Settings changes (Database replication)
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'settings' },
            (payload) => {
                console.log('📡 Settings updated in database');
                if (callbacks.onSettingsUpdate) callbacks.onSettingsUpdate(payload.new || payload);
            }
        )
        .subscribe((status, err) => {
            console.log(`📡 Admin Realtime Status: ${status}`);
            if (status === 'SUBSCRIBED') {
                console.log('✅ Admin channel is now live - will receive new messages instantly!');
            } else if (status === 'CHANNEL_ERROR') {
                console.error('❌ Admin channel error:', err);
            } else if (status === 'TIMED_OUT') {
                console.error('❌ Admin channel timed out');
            } else if (status === 'CLOSED') {
                console.warn('⚠️ Admin channel closed');
            }
        });

    return adminPageChannel;
}

// ===========================================
// UNSUBSCRIBE / CLEANUP
// ===========================================

function unsubscribeFromUpdates() {
    if (mainPageChannel && supabaseClient) {
        supabaseClient.removeChannel(mainPageChannel);
        mainPageChannel = null;
        console.log('📡 Unsubscribed from main page updates');
    }
    if (adminPageChannel && supabaseClient) {
        supabaseClient.removeChannel(adminPageChannel);
        adminPageChannel = null;
        console.log('📡 Unsubscribed from admin updates');
    }
}

// ===========================================
// SHOW REALTIME NOTIFICATION
// ===========================================

function showRealtimeToast(message, type = 'info') {
    // Create toast element if showToast function exists
    if (typeof showToast === 'function') {
        showToast(message);
    } else {
        // Fallback - create custom toast
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toastMsg');
        if (toast && toastMsg) {
            toastMsg.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 4000);
        }
    }
}

// Broadcast theme update instantly (does not wait for DB)
let themeBroadcastTimeout = null;
function sendThemeUpdate(settings) {
    const channel = themeChannel || adminPageChannel || mainPageChannel;

    if (themeBroadcastTimeout) clearTimeout(themeBroadcastTimeout);

    themeBroadcastTimeout = setTimeout(() => {
        if (channel) {
            const badge = document.getElementById('themeStatusBadge');
            if (badge) {
                badge.innerHTML = '<i class="fas fa-wifi"></i> Syncing...';
            }

            channel.send({
                type: 'broadcast',
                event: 'theme_update',
                payload: settings
            }).then(resp => {
                if (resp === 'ok') {
                    console.log('⚡ Theme sync broadcasted');
                    if (badge) {
                        badge.innerHTML = '<i class="fas fa-bolt"></i> Real-time Active';
                    }
                } else {
                    console.warn('⚠️ Theme broadcast failed', resp);
                }
            });
        }
    }, 50);
}

// Register a callback for theme broadcasts (used by specific pages)
function registerThemeCallback(callback) {
    if (typeof callback === 'function') {
        themeBroadcastCallback = callback;
    }
}

// Export functions globally
window.initSupabase = initSupabase;
window.subscribeToMainPageUpdates = subscribeToMainPageUpdates;
window.subscribeToAdminUpdates = subscribeToAdminUpdates;
window.unsubscribeFromUpdates = unsubscribeFromUpdates;
window.showRealtimeToast = showRealtimeToast;
window.sendThemeUpdate = sendThemeUpdate;
window.registerThemeCallback = registerThemeCallback;

console.log('🔌 Supabase Realtime module v2.1 loaded');
