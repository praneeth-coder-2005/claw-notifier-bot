const axios = require('axios');
const cheerio = require('cheerio');

const BOT_TOKEN = 'your_telegram_bot_token'; // Replace with your token
const CHAT_ID = 'your_chat_id'; // Replace with your chat ID
const URL = 'https://example.com'; // Replace with the target URL

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

    const post = $('div.post').first(); // Adjust the selector
    const title = post.find('a').text();
    const link = post.find('a').attr('href');
    const poster = post.find('img').attr('src');

    const message = `New Post: ${title}\n${link}`;
    await sendTelegramMessage(message, poster);
  } catch (error) {
    console.error('Error scraping the site:', error);
  }
}

exports.handler = async (event, context) => {
  await scrapeLatestPost();
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Notification sent!' }),
  };
};
