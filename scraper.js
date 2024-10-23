require('dotenv').config(); // Load environment variables
const axios = require('axios');
const cheerio = require('cheerio');
const readline = require('readline');

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

// Function to scrape all links from a given URL
async function scrapeLinks(targetURL) {
    try {
        console.log('Starting the scraping process for:', targetURL); // Start message
        const { data } = await axios.get(targetURL);
        const $ = cheerio.load(data);
        const foundLinks = [];

        // Adjust the selector based on the site's structure
        $('a').each((index, element) => {
            const link = $(element).attr('href');
            if (link) {
                foundLinks.push(link.startsWith('http') ? link : targetURL + link);
            }
        });

        console.log('Found links:', foundLinks);

        // Notify about found links
        for (const link of foundLinks) {
            await sendTelegramMessage(`Link Found: ${link}`);
        }

        return foundLinks;
    } catch (error) {
        console.error('Error scraping links:', error.message);
        return [];
    }
}

// Function to prompt the user for a URL
async function promptForUrl() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter the URL you want to scrape: ', async (url) => {
        await scrapeLinks(url);
        rl.close();
    });
}

// Main function to execute the scraper
(async () => {
    await promptForUrl();
})();
