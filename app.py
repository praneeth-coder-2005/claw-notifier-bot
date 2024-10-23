from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
import os

app = Flask(__name__)

def scrape_links(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        links = [a.get('href') for a in soup.find_all('a', href=True)]
        return links
    except Exception as e:
        return [f"Error: {str(e)}"]

@app.route('/', methods=['POST'])
def scrape():
    url = request.json.get('url')
    if not url:
        return jsonify({"error": "URL is required"}), 400
    links = scrape_links(url)
    return jsonify({"links": links})

if __name__ == '__main__':
    # Use '0.0.0.0' for host and port from environment variables for Render
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
