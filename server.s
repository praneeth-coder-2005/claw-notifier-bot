
require('dotenv').config(); // Load environment variables
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Function to scrape links from a given URL
const scrapeLinks = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const links = [];

        // Extract all links
        $('a').each((index, element) => {
            const link = $(element).attr('href');
            if (link) {
                links.push(link.startsWith('http') ? link : url + link);
            }
        });

        return links;
    } catch (error) {
        console.error('Error scraping links:', error.message);
        throw new Error('Failed to scrape links');
    }
};

// Endpoint to scrape links
app.post('/scrape', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const links = await scrapeLinks(url);
        return res.json({ links });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
