import logging
from telegram import Update
from telegram.ext import Updater, CommandHandler, CallbackContext
import requests
from bs4 import BeautifulSoup
import os

# Enable logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

TOKEN = os.getenv('TOKEN')  # Telegram Bot Token
WEBSITE_URL = 'https://www.1tamilmv.wf/'  # URL of the website to scrape

def start(update: Update, context: CallbackContext) -> None:
    """Send a message when the command /start is issued."""
    update.message.reply_text('Hi! Use /getlinks to fetch all post links from the website.')

def get_links(update: Update, context: CallbackContext) -> None:
    """Fetch and send all post links from a specific website."""
    response = requests.get(WEBSITE_URL)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Assuming that posts are contained in <a> tags with a specific class
    posts = soup.find_all('a', class_='post-link')
    
    if posts:
        for post in posts:
            link = post.get('href')
            title = post.get_text()
            message = f"{title}\n{link}"
            update.message.reply_text(message)
    else:
        update.message.reply_text('No posts found!')

def main() -> None:
    """Start the bot."""
    updater = Updater(TOKEN)
    dispatcher = updater.dispatcher
    dispatcher.add_handler(CommandHandler("start", start))
    dispatcher.add_handler(CommandHandler("getlinks", get_links))
    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
