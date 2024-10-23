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
    if not request.data:  # Ensure there's a request body
        return jsonify({"error": "Empty request body."}), 400

    try:
        data = request.get_json(force=True)  # Try to parse JSON even if content-type is wrong
    except Exception as e:
        return jsonify({"error": f"Invalid JSON: {str(e)}"}), 400

    if not data or 'url' not in data:
        return jsonify({"error": "URL is required in JSON format."}), 400

    url = data['url']
    links = scrape_links(url)
    return jsonify({"links": links})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
