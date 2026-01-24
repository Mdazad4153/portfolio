const ThemeService = {
    async init() {
        // 1. Apply from localStorage immediately for no-flash experience
        const savedColor = localStorage.getItem('themeAccentColor');
        if (savedColor) {
            this.applyThemeColor(savedColor);
        }

        // 2. Fetch fresh settings from API
        const settings = await this.fetchSettings();
        if (settings && settings.primaryColor) {
            this.applyThemeColor(settings.primaryColor);
            // Update other site info if available and on main page
            if (typeof updateSiteInfo === 'function') {
                updateSiteInfo(settings);
            }
        }
    },

    async fetchSettings() {
        try {
            const API_URL = 'https://backend-mu-sage.vercel.app/api';

            const res = await fetch(`${API_URL}/settings`);
            if (res.ok) return await res.json();
        } catch (err) {
            console.warn('ThemeService: Failed to fetch settings', err);
        }
        return null;
    },

    applyThemeColor(hex) {
        if (!hex) return;
        const rgb = this.hexToRgb(hex);
        if (rgb) {
            document.documentElement.style.setProperty('--primary-rgb', rgb);
            localStorage.setItem('themeAccentColor', hex);

            // Update UI elements that might need direct color (like some svgs if any)
            document.querySelectorAll('[data-dynamic-color]').forEach(el => {
                el.style.color = hex;
            });
            document.querySelectorAll('[data-dynamic-bg]').forEach(el => {
                el.style.backgroundColor = hex;
            });
        }
    },

    hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace('#', '');

        // Handle short hex (#f00)
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
        return `${r}, ${g}, ${b}`;
    }
};

// Start initialization
ThemeService.init();

// Export to window
window.ThemeService = ThemeService;
