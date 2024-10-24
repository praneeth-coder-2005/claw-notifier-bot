import logging
from telegram import Update, ForceReply
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackContext
import feedparser
import os

# Enable logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

TOKEN = os.getenv('TOKEN')  # Read token from environment variable
FEED_URL = 'https://www.1tamilmv.wf/'

def start(update: Update, context: CallbackContext) -> None:
    user = update.effective_user
    update.message.reply_markdown_v2(
        fr'Hi {user.mention_markdown_v2()}\! Type /feed to get the latest RSS feed updates\.',
        reply_markup=ForceReply(selective=True),
    )

def feed(update: Update, context: CallbackContext) -> None:
    feed = feedparser.parse(FEED_URL)
    for entry in feed.entries[:5]:  # send the latest 5 entries
        message = f"{entry.title}\n{entry.link}"
        update.message.reply_text(message)

def main() -> None:
    updater = Updater(TOKEN)
    dispatcher = updater.dispatcher
    dispatcher.add_handler(CommandHandler("start", start))
    dispatcher.add_handler(CommandHandler("feed", feed))
    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
