const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.resolve(__dirname, '../public/screenshots');

const PAGES = [
    { name: 'dashboard', path: '/dashboard' },
    { name: 'leads', path: '/leads' },
    { name: 'pipeline', path: '/pipeline' },
    { name: 'settings', path: '/settings' },
];

(async () => {
    if (!fs.existsSync(SCREENSHOT_DIR)) {
        fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }

    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: { width: 1920, height: 1080 }
    });

    const page = await browser.newPage();

    try {
        // Login Flow
        console.log('Navigating to login...');
        await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });

        console.log('Logging in...');
        await page.type('input[type="email"]', 'demo@example.com');
        await page.type('input[type="password"]', 'password123');

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('button[type="submit"]')
        ]);

        console.log('Login successful!');

        // Capture Screenshots
        for (const p of PAGES) {
            const url = `${BASE_URL}${p.path}`;
            console.log(`Navigating to ${url}...`);
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

            // Wait a bit for animations
            await new Promise(r => setTimeout(r, 2000));

            const outputPath = path.join(SCREENSHOT_DIR, `${p.name}.png`);
            await page.screenshot({ path: outputPath, fullPage: false });
            console.log(`Saved screenshot: ${outputPath}`);
        }

    } catch (e) {
        console.error('Error during capture process:', e);
    } finally {
        await browser.close();
        console.log('Done!');
    }
})();
