const axios = require('axios');
const cheerio = require('cheerio');

// Replace these with your credentials
const BOT_TOKEN = '7820729855:AAG_ph7Skh4SqGxIWYYcRNigQqCKdnVW354';
const CHAT_ID = '1894915577';
const URL = 'https://example.com';  // Replace with the target URL

async function sendTelegramMessage(text, imageUrl = null) {
  try {
    const messageUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    await axios.post(messageUrl, { chat_id: CHAT_ID, text });

    if (imageUrl) {
      const photoUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
      await axios.post(photoUrl, { chat_id: CHAT_ID, photo: imageUrl });
    }
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
  }
}

async function scrapeLatestPost() {
  try {
    const response = await axios.get(URL);
    const $ = cheerio.load(response.data);

    const post = $('div.post').first();
    const title = post.find('a').text();
    const link = post.find('a').attr('href');
    const poster = post.find('img').attr('src');

    const message = `New Post: ${title}\n${link}`;
    await sendTelegramMessage(message, poster);
  } catch (error) {
    console.error('Error scraping the site:', error);
  }
}

// Call the function to execute the bot's logic
scrapeLatestPost();
