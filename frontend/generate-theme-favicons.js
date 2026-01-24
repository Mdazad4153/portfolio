const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFaviconSet(inputName, theme) {
    const inputPath = path.join(__dirname, inputName);
    const outputDir = path.join(__dirname, 'assets');

    if (!fs.existsSync(inputPath)) {
        console.error(`Input file not found: ${inputPath}`);
        return;
    }

    const sizes = [16, 32, 48, 64, 128, 192, 256, 512];

    // Light is White BG, Dark is Black BG
    const bgColor = theme === 'light' ? '#ffffff' : '#000000';

    try {
        console.log(`Processing ${theme} themed favicon with ${bgColor} background...`);

        for (const size of sizes) {
            const outputName = `favicon-${theme}-${size}.png`;

            await sharp(inputPath)
                .trim({ threshold: 30 }) // Lower threshold to keep more detail
                .resize(size, size, {
                    fit: 'cover',
                    position: 'attention' // Smart cropping to focus on the subject
                })
                .flatten({ background: bgColor })
                .png({ quality: 100 })
                .toFile(path.join(outputDir, outputName));
            console.log(`Created ${outputName}`);
        }

        // Default theme favicon (32x32)
        await sharp(inputPath)
            .trim({ threshold: 30 })
            .resize(32, 32, { fit: 'cover', position: 'attention' })
            .flatten({ background: bgColor })
            .png()
            .toFile(path.join(outputDir, `favicon-${theme}.png`));

        // Create fallback base files if it's the dark theme (default)
        if (theme === 'dark') {
            const fallbackSizes = [16, 32, 48, 64, 128];
            for (const s of fallbackSizes) {
                await sharp(inputPath).trim({ threshold: 30 }).resize(s, s, { fit: 'cover', position: 'attention' }).flatten({ background: '#000000' }).png().toFile(path.join(outputDir, `favicon-${s}.png`));
            }
            await sharp(inputPath).trim({ threshold: 30 }).resize(32, 32, { fit: 'cover', position: 'attention' }).flatten({ background: '#000000' }).png().toFile(path.join(outputDir, 'favicon.ico'));
            await sharp(inputPath).trim({ threshold: 30 }).resize(192, 192, { fit: 'cover', position: 'attention' }).flatten({ background: '#000000' }).png().toFile(path.join(outputDir, 'android-chrome-192x192.png'));
            await sharp(inputPath).trim({ threshold: 30 }).resize(512, 512, { fit: 'cover', position: 'attention' }).flatten({ background: '#000000' }).png().toFile(path.join(outputDir, 'android-chrome-512x512.png'));
            await sharp(inputPath).trim({ threshold: 30 }).resize(180, 180, { fit: 'cover', position: 'attention' }).flatten({ background: '#000000' }).png().toFile(path.join(outputDir, 'apple-touch-icon.png'));
        }

        console.log(`✅ Completed ${theme} favicon set.`);
    } catch (error) {
        console.error(`Error processing ${theme}:`, error);
    }
}

async function run() {
    // Latest light theme image as requested
    await generateFaviconSet('Gemini_Generated_Image_w930mww930mww930.png', 'light');
    // Keeping existing dark theme image
    await generateFaviconSet('ChatGPT Image Jan 23, 2026, 10_01_26 PM.png', 'dark');
}

run();
