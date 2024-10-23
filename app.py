from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
import os

app = Flask(__name__)

# Function to scrape links from a given URL
def scrape_links(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        links = [a.get('href') for a in soup.find_all('a', href=True)]
        return links
    except Exception as e:
        return [f"Error: {str(e)}"]

# API endpoint to accept POST requests
@app.route('/', methods=['POST'])
def scrape():
    data = request.get_json(force=True, silent=True)  # Force JSON parsing, ignore errors silently
    if not data or 'url' not in data:
        return jsonify({"error": "URL is required in JSON format."}), 400

    url = data['url']
    links = scrape_links(url)
    return jsonify({"links": links})

if __name__ == '__main__':
    # Ensure the app runs on the correct host and port for Render
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
