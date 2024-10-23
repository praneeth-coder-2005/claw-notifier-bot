const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Replace these values
const BOT_TOKEN = '7820729855:AAG_ph7Skh4SqGxIWYYcRNigQqCKdnVW354';
const CHAT_ID = '1894915577';
const URL = 'https://example.com';  // Replace with your legal target URL

// Function to send a Telegram message
async function sendTelegramMessage(text) {
  const messageUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    await axios.post(messageUrl, { chat_id: CHAT_ID, text });
  } catch (error) {
    console.error('Failed to send message:', error.message);
  }
}

// Function to download new content (mirroring/leeching)
async function downloadFile(fileUrl) {
  const fileName = path.basename(fileUrl);
  const filePath = path.join(__dirname, fileName);

  const writer = fs.createWriteStream(filePath);
  const response = await axios({
    url: fileUrl,
    method: 'GET',
    responseType: 'stream'
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

// Function to scrape the latest post and check for new files
async function scrapeLatestPost() {
  try {
    const response = await axios.get(URL);
    const $ = cheerio.load(response.data);

    // Example selectors - Adjust based on the target site's structure
    const post = $('div.post').first();
    const title = post.find('a').text().trim();
    const link = post.find('a').attr('href');
    const fileUrl = post.find('a.download').attr('href');  // Example: File download link

    if (title && link && fileUrl) {
      const message = `New Post Found: ${title}\nLink: ${link}`;
      await sendTelegramMessage(message);

      // Start downloading the new file
      console.log(`Downloading: ${fileUrl}`);
      await downloadFile(fileUrl);
      console.log('Download complete!');
    } else {
      console.log('No new content found.');
    }
  } catch (error) {
    console.error('Error scraping the site:', error.message);
  }
}

// Run the bot logic
scrapeLatestPost();
