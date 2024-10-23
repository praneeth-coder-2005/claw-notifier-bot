const axios = require('axios');
const cheerio = require('cheerio');
const WebTorrent = require('webtorrent');
const path = require('path');

// Initialize the WebTorrent client
const client = new WebTorrent();

// Telegram bot details
const BOT_TOKEN = '7820729855:AAG_ph7Skh4SqGxIWYYcRNigQqCKdnVW354'; // Replace with your bot token
const CHAT_ID = '1894915577';               // Replace with your chat ID

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

// Function to download a magnet link using WebTorrent
function downloadMagnet(magnetURI) {
    console.log('Starting download for:', magnetURI);

    client.add(magnetURI, { path: path.join(__dirname, 'downloads') }, (torrent) => {
        console.log(`Downloading: ${torrent.name}`);

        torrent.on('download', () => {
            console.log(`Progress: ${(torrent.progress * 100).toFixed(2)}%`);
        });

        torrent.on('done', () => {
            console.log('Download complete!');
            sendTelegramMessage(`Download complete: ${torrent.name}`);
            client.destroy(); // Clean up after download
        });
    });

    client.on('error', (err) => {
        console.error('Torrent error:', err.message);
    });
}

// Main function to scrape links, notify, and download if applicable
(async () => {
    const targetURL = 'https://www.1tamilmv.wf/'; // Replace with your target website
    const postLinks = await scrapeAllPostLinks(targetURL);

    // Output all post links and send notifications
    for (const link of postLinks) {
        console.log(`New Post Found: ${link}`);
        await sendTelegramMessage(`New Post Found: ${link}`);
        
        // Example: If the link is a magnet link, download it
        if (link.startsWith('magnet:?')) {
            downloadMagnet(link);
        }
    }
})();
