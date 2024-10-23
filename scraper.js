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

// Function to scrape all links from a specific post URL
async function scrapePostLinks(targetURL) {
    try {
        console.log('Starting the scraping process for:', targetURL); // Start message
        const { data } = await axios.get(targetURL);
        const $ = cheerio.load(data);
        const postLinks = [];

        // Scrape all links from the post
        $('a').each((index, element) => {
            const link = $(element).attr('href');
            // Check for valid links and ensure they haven't been seen before
            if (link && !seenLinks.has(link)) {
                postLinks.push(link);
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
    const targetURL = 'https://example.com/post-link'; // Replace with the post link you want to scrape
    await scrapePostLinks(targetURL);
})();
