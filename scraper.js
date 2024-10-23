require('dotenv').config(); // Load environment variables
const axios = require('axios');
const cheerio = require('cheerio');

// Telegram bot details (from environment variables)
const BOT_TOKEN = process.env.BOT_TOKEN; // Load from environment variable
const CHAT_ID = process.env.CHAT_ID;     // Load from environment variable

// Function to send a Telegram message
async function sendTelegramMessage(text) {
    const messageUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    try {
        await axios.post(messageUrl, { chat_id: CHAT_ID, text });
    } catch (error) {
        console.error('Failed to send message:', error.message);
    }
}

// Function to scrape all post links from the target URL
async function scrapePostLinks(targetURL) {
    try {
        console.log('Starting the scraping process...'); // Start message
        const { data } = await axios.get(targetURL);
        const $ = cheerio.load(data);
        const postLinks = [];

        // Adjust the selector based on the site's structure
        $('a').each((index, element) => {
            const link = $(element).attr('href');
            // Check if the link contains relevant criteria for posts
            if (link) {
                postLinks.push(link.startsWith('http') ? link : targetURL + link);
            }
        });

        console.log('Found post links:', postLinks);
        // Send links to Telegram
        for (const postLink of postLinks) {
            await sendTelegramMessage(`Found link: ${postLink}`);
        }
        return postLinks;
    } catch (error) {
        console.error('Error scraping links:', error.message);
        return [];
    }
}

// Main function to execute the scraper
(async () => {
    const targetURL = 'https://site.trooporiginals.cloud/'; // The website to scrape
    await scrapePostLinks(targetURL);
})();
