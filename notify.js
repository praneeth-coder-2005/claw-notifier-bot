const WebTorrent = require('webtorrent');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Initialize WebTorrent client
const client = new WebTorrent();

// Telegram bot details
const BOT_TOKEN = '7820729855:AAG_ph7Skh4SqGxIWYYcRNigQqCKdnVW354';
const CHAT_ID = '1894915577';

// Function to send a Telegram message
async function sendTelegramMessage(text) {
  const messageUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    await axios.post(messageUrl, { chat_id: CHAT_ID, text });
  } catch (error) {
    console.error('Failed to send message:', error.message);
  }
}

// Function to download a magnet link
function downloadMagnet(magnetURI) {
  console.log('Starting torrent download...');

  client.add(magnetURI, { path: path.join(__dirname, 'downloads') }, (torrent) => {
    console.log(`Downloading: ${torrent.name}`);

    // Progress handler
    torrent.on('download', () => {
      console.log(`Progress: ${(torrent.progress * 100).toFixed(2)}%`);
    });

    // Finished handler
    torrent.on('done', async () => {
      console.log('Download complete!');
      await sendTelegramMessage(`Download complete: ${torrent.name}`);
      client.destroy(); // Clean up the client
    });
  });

  client.on('error', (err) => {
    console.error('Torrent error:', err.message);
  });
}

// Example usage - Replace this with a real magnet link
const magnetURI = 'magnet:?xt=urn:btih:EXAMPLE1234567890';  // Replace with your legal magnet link
downloadMagnet(magnetURI);
