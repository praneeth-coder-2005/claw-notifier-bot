require('dotenv').config(); // Load environment variables
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve the HTML file for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Function to scrape download links from a given URL
const scrapeDownloadLinks = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const downloadLinks = [];

        // Adjust this selector to match the download links in the site's HTML structure
        $('a[href*="download"]').each((index, element) => {
            const link = $(element).attr('href');
            if (link) {
                downloadLinks.push(link.startsWith('http') ? link : url + link);
            }
        });

        return downloadLinks;
    } catch (error) {
        console.error('Error scraping links:', error.message);
        throw new Error('Failed to scrape download links');
    }
};

// Endpoint to scrape download links
app.post('/scrape', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const links = await scrapeDownloadLinks(url);
        return res.json({ links });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
