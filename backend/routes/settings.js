const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

// Helper to convert snake_case to camelCase
const toCamelCase = (settings) => ({
    id: settings.id,
    siteName: settings.site_name,
    siteDescription: settings.site_description,
    logo: settings.logo,
    favicon: settings.favicon,
    primaryColor: settings.primary_color,
    secondaryColor: settings.secondary_color,
    accentColor: settings.accent_color,
    defaultTheme: settings.default_theme,
    enableBlog: settings.enable_blog,
    enableTestimonials: settings.enable_testimonials,
    enableServices: settings.enable_services,
    enableContact: settings.enable_contact,
    maintenanceMode: settings.maintenance_mode,
    // Convert array to comma-separated string for frontend
    seoKeywords: Array.isArray(settings.seo_keywords) ? settings.seo_keywords.join(', ') : (settings.seo_keywords || ''),
    googleAnalyticsId: settings.google_analytics_id,
    customCss: settings.custom_css,
    customJs: settings.custom_js,
    createdAt: settings.created_at,
    updatedAt: settings.updated_at
});

// Helper to convert camelCase to snake_case
const toSnakeCase = (data) => {
    const result = {};
    if (data.siteName !== undefined) result.site_name = String(data.siteName || '');
    if (data.siteDescription !== undefined) result.site_description = String(data.siteDescription || '');
    if (data.logo !== undefined) result.logo = String(data.logo || '');
    if (data.favicon !== undefined) result.favicon = String(data.favicon || '');
    if (data.primaryColor !== undefined) result.primary_color = String(data.primaryColor || '#6366f1');
    if (data.secondaryColor !== undefined) result.secondary_color = String(data.secondaryColor || '#8b5cf6');
    if (data.accentColor !== undefined) result.accent_color = String(data.accentColor || '#06b6d4');
    if (data.defaultTheme !== undefined) result.default_theme = data.defaultTheme || 'dark';

    // Booleans
    if (data.enableBlog !== undefined) result.enable_blog = Boolean(data.enableBlog);
    if (data.enableTestimonials !== undefined) result.enable_testimonials = Boolean(data.enableTestimonials);
    if (data.enableServices !== undefined) result.enable_services = Boolean(data.enableServices);
    if (data.enableContact !== undefined) result.enable_contact = Boolean(data.enableContact);
    if (data.maintenanceMode !== undefined) result.maintenance_mode = Boolean(data.maintenanceMode);

    // CRITICAL: Handle seoKeywords conversion to TEXT[]
    // Ensuring it ALWAYS reaches Supabase as a valid JS array
    if (data.seoKeywords !== undefined) {
        if (Array.isArray(data.seoKeywords)) {
            result.seo_keywords = data.seoKeywords;
        } else if (typeof data.seoKeywords === 'string') {
            const trimmed = data.seoKeywords.trim();
            if (trimmed === '') {
                result.seo_keywords = []; // Empty array for empty input
            } else {
                result.seo_keywords = trimmed.split(',').map(k => k.trim()).filter(k => k !== '');
            }
        } else {
            result.seo_keywords = [];
        }
    }

    if (data.googleAnalyticsId !== undefined) result.google_analytics_id = String(data.googleAnalyticsId || '');
    if (data.customCss !== undefined) result.custom_css = String(data.customCss || '');
    if (data.customJs !== undefined) result.custom_js = String(data.customJs || '');

    return result;
};

// @route   GET /api/settings
// @desc    Get settings
router.get('/', async (req, res) => {
    try {
        let { data: settings, error } = await supabase
            .from('settings')
            .select('*')
            .limit(1);

        if (error) {
            console.error('❌ Database error fetching settings:', error);
            throw error;
        }

        let result = settings && settings.length > 0 ? settings[0] : null;

        // Create default settings if none exists
        if (!result) {
            console.log('📝 No settings found, creating defaults...');
            const { data: newSettings, error: createError } = await supabase
                .from('settings')
                .insert({ site_name: 'Md Azad Portfolio' })
                .select()
                .single();

            if (createError) {
                console.error('❌ Error creating default settings:', createError);
                throw createError;
            }
            result = newSettings;
        }

        res.json(toCamelCase(result));
    } catch (error) {
        console.error('❌ Settings GET error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/settings
// @desc    Update settings
router.put('/', authMiddleware, async (req, res) => {
    try {
        if (!supabase) {
            return res.status(503).json({
                message: 'Database connection not available',
                details: 'Check Vercel environment variables for SUPABASE_URL and SUPABASE_SERVICE_KEY'
            });
        }
        console.log('📥 Updating settings request received');

        // 1. Convert to database format
        const updateData = toSnakeCase(req.body);

        // 2. Clear unwanted fields that shouldn't be updated here
        delete updateData.id;
        delete updateData.created_at;
        updateData.updated_at = new Date();

        // 3. Get existing ID if available (to ensure we update the first record)
        const { data: existingRecords } = await supabase.from('settings').select('id').limit(1);
        const existingId = existingRecords && existingRecords.length > 0 ? existingRecords[0].id : null;

        let upsertData = { ...updateData };
        if (existingId) {
            upsertData.id = existingId;
        }

        // 4. Perform upsert
        console.log('🚀 Upserting settings data...');
        const { data, error } = await supabase
            .from('settings')
            .upsert(upsertData, { onConflict: 'id' })
            .select()
            .single();

        if (error) {
            console.error('❌ Supabase Upsert Error:', error);
            return res.status(400).json({ message: 'Database error', error: error.message });
        }

        console.log('✅ Settings saved successfully');
        res.json(toCamelCase(data));
    } catch (error) {
        console.error('❌ Fatal Settings PUT error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
