const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateCustomFavicon() {
    const size = 512;

    // Accurate color matching based on user's image
    // Top-left: A vibrant medium blue (#3a7bd5)
    // Bottom-right: A bright cyan (#00d2ff)
    const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#3a7bd5;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#00d2ff;stop-opacity:1" />
            </linearGradient>
        </defs>
        
        <!-- Background Square with Rounded Corners (Large rx for squircle look) -->
        <rect x="0" y="0" width="${size}" height="${size}" rx="120" fill="url(#grad)" />
        
        <!-- "MA" Text Centered with accurate font style -->
        <text 
            x="50%" 
            y="53%" 
            dominant-baseline="middle" 
            text-anchor="middle" 
            fill="white" 
            style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; font-weight: 800; font-size: 260px; letter-spacing: -8px;"
        >MA</text>
    </svg>
    `;

    const assetsDir = path.join(__dirname, 'assets');
    if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);

    const inputPath = Buffer.from(svg);
    const outputDir = assetsDir;

    console.log('🚀 Generating color-matched "MA" favicon files...');

    const sizes = [16, 32, 48, 64, 128, 192, 256, 512];

    try {
        for (const s of sizes) {
            await sharp(inputPath)
                .resize(s, s)
                .png()
                .toFile(path.join(outputDir, `favicon-${s}.png`));
            console.log(`✅ Updated favicon-${s}.png`);
        }

        await sharp(inputPath)
            .resize(32, 32)
            .png()
            .toFile(path.join(outputDir, 'favicon.png'));

        await sharp(inputPath)
            .resize(180, 180)
            .png()
            .toFile(path.join(outputDir, 'apple-touch-icon.png'));

        await sharp(inputPath)
            .resize(192, 192)
            .png()
            .toFile(path.join(outputDir, 'android-chrome-192x192.png'));

        await sharp(inputPath)
            .resize(512, 512)
            .png()
            .toFile(path.join(outputDir, 'android-chrome-512x512.png'));

        console.log('\n✨ Favicon updated with matching colors!');

    } catch (error) {
        console.error('❌ Error updating favicon:', error);
    }
}

generateCustomFavicon();
