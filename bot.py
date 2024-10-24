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
WEBSITE_URL = 'https://www.1tamilmv.wf'  # URL of the website to scrape

def start(update: Update, context: CallbackContext) -> None:
    """Send a message when the command /start is issued."""
    update.message.reply_text('Hi! Use /getlinks to fetch all post links from the website.')

def get_links(update: Update, context: CallbackContext) -> None:
    """Fetch and send all post links from a specific website."""
    response = requests.get(WEBSITE_URL)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Updated to reflect a hypothetical correct HTML structure
    articles = soup.find_all('article', class_='post-entry')  # Adjust class as needed
    links_found = []

    for article in articles:
        link_tag = article.find('a')  # Assuming the first <a> tag is the desired link
        if link_tag and link_tag['href']:
            links_found.append(f"{link_tag.text.strip()}\n{link_tag['href']}")

    if links_found:
        for link in links_found:
            update.message.reply_text(link)
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
