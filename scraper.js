const axios = require('axios');
const cheerio = require('cheerio');

// Function to scrape all post links from a target URL
async function scrapePostLinks(targetURL) {
    try {
        console.log('Starting the scraping process...'); // Start message
        const { data } = await axios.get(targetURL);
        const $ = cheerio.load(data);
        const postLinks = [];

        // Adjust the selector based on the site's structure
        $('a').each((index, element) => {
            const link = $(element).attr('href');
            // Check if the link contains "/post/" or any relevant criteria for posts
            if (link && link.includes('/post/')) {
                postLinks.push(link.startsWith('http') ? link : targetURL + link);
            }
        });

        console.log('Found post links:', postLinks);
        return postLinks;
    } catch (error) {
        console.error('Error scraping links:', error.message);
        return [];
    }
}

// Main function to execute the scraper
(async () => {
    const targetURL = 'https://www.1tamilmv.wf/'; // Replace with the website you want to scrape
    await scrapePostLinks(targetURL);
})();
