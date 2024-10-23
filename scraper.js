require('dotenv').config(); // Load environment variables
const axios = require('axios');
const cheerio = require('cheerio');

// Telegram bot details (from environment variables)
const BOT_TOKEN = process.env.BOT_TOKEN; // Load from environment variable
const CHAT_ID = process.env.CHAT_ID;     // Load from environment variable

// Set to store previously seen links
const seenLinks = new Set();

// Function to send a Telegram message
async function sendTelegramMessage(text) {
    const messageUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    try {
        await axios.post(messageUrl, { chat_id: CHAT_ID, text });
    } catch (error) {
        console.error('Failed to send message:', error.message);
    }
}

// Function to scrape all post links from the main page
async function scrapeAllPostLinks(targetURL) {
    try {
        console.log('Starting the scraping process for:', targetURL); // Start message
        const { data } = await axios.get(targetURL);
        const $ = cheerio.load(data);
        const postLinks = [];

        // Adjust the selector based on the site's structure
        $('a').each((index, element) => {
            const link = $(element).attr('href');
            // Check if the link is relevant to posts and not seen before
            if (link && link.includes('/post/') && !seenLinks.has(link)) {
                postLinks.push(link.startsWith('http') ? link : targetURL + link);
                seenLinks.add(link); // Add to seen links to prevent duplicates
            }
        });

        console.log('Found post links:', postLinks);

        // Notify about new links found
        for (const postLink of postLinks) {
            await sendTelegramMessage(`New Link Found: ${postLink}`);
        }

        return postLinks;
    } catch (error) {
        console.error('Error scraping links:', error.message);
        return [];
    }
}

// Main function to execute the scraper
(async () => {
    const targetURL = 'https://site.trooporiginals.cloud/'; // Change to the homepage or category page
    await scrapeAllPostLinks(targetURL);
})();
