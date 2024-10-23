const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const WebTorrent = require('webtorrent');
const path = require('path');

const client = new WebTorrent();

// Telegram bot details
const BOT_TOKEN = '7820729855:AAG_ph7Skh4SqGxIWYYcRNigQqCKdnVW354'; // Replace with your bot token
const CHAT_ID = '1894915577';               // Replace with your chat ID

// Load settings from a JSON file
let settings = {
    urlsToMonitor: ['https://www.1tamilmv.wf/'] // Replace with your desired URLs
};

// Function to send a Telegram message
async function sendTelegramMessage(text) {
    const messageUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    try {
        await axios.post(messageUrl, { chat_id: CHAT_ID, text });
    } catch (error) {
        console.error('Failed to send message:', error.message);
    }
}

// Function to scrape all post links from a target URL
async function scrapeAllPostLinks(targetURL) {
    try {
        const { data } = await axios.get(targetURL);
        const $ = cheerio.load(data);
        const postLinks = [];

        // Adjust the selector to find all post links on the page
        $('a').each((index, element) => {
            const link = $(element).attr('href');
            if (link && link.includes('/post/') && !postLinks.includes(link)) {
                postLinks.push(link.startsWith('http') ? link : targetURL + link);
            }
        });

        console.log('Found post links:', postLinks);
        return postLinks;
    } catch (error) {
        console.error('Error scraping links:', error.message);
        return [];
    }
}

// Function to check for new notifications
async function checkForNewPosts() {
    const seenLinks = new Set(); // To track seen links
    const postLinksPromises = settings.urlsToMonitor.map(url => scrapeAllPostLinks(url));

    const allPostLinks = await Promise.all(postLinksPromises);
    allPostLinks.flat().forEach(link => {
        if (!seenLinks.has(link)) {
            seenLinks.add(link); // Mark link as seen
            console.log(`New Post Found: ${link}`);
            sendTelegramMessage(`New Post Found: ${link}`); // Notify Telegram
        }
    });
}

// Main function to start the bot
(async () => {
    await checkForNewPosts();
})();
