const axios = require('axios');
const cheerio = require('cheerio');

// Replace with your credentials and target URL
const BOT_TOKEN = '7820729855:AAG_ph7Skh4SqGxIWYYcRNigQqCKdnVW354';
const CHAT_ID = '1894915577';
const URL = 'https://www.1tamilmv.wf/'; // Replace with your legal target URL

async function sendTelegramMessage(text, imageUrl = null) {
  try {
    const messageUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    await axios.post(messageUrl, { chat_id: CHAT_ID, text });

    if (imageUrl) {
      const photoUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
      await axios.post(photoUrl, { chat_id: CHAT_ID, photo: imageUrl });
    }
  } catch (error) {
    console.error('Failed to send Telegram message:', error.message);
  }
}

async function scrapeLatestPost() {
  try {
    const response = await axios.get(URL);
    const $ = cheerio.load(response.data);

    // Adjust the selector to match your target site's structure
    const post = $('div.post').first();
    const title = post.find('a').text().trim();
    const link = post.find('a').attr('href');
    const poster = post.find('img').attr('src');

    if (title && link) {
      const message = `New Post: ${title}\n${link}`;
      await sendTelegramMessage(message, poster);
    } else {
      console.log('No new post found or content is missing.');
    }
  } catch (error) {
    console.error('Error scraping the site:', error.message);
  }
}

// Run the bot logic
scrapeLatestPost();
