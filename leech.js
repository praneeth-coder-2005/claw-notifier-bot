const WebTorrent = require('webtorrent');
const path = require('path');

const client = new WebTorrent();

function downloadMagnet(magnetURI) {
  console.log('Starting torrent download...');

  client.add(magnetURI, { path: path.join(__dirname, 'downloads') }, (torrent) => {
    console.log(`Downloading: ${torrent.name}`);

    torrent.on('download', () => {
      console.log(`Progress: ${(torrent.progress * 100).toFixed(2)}%`);
    });

    torrent.on('done', () => {
      console.log('Download complete!');
      client.destroy(); // Clean up the client after download
    });
  });

  client.on('error', (err) => {
    console.error('Error:', err.message);
  });
}

// Replace this with your desired magnet link
const magnetURI = 'magnet:?xt=urn:btih:EXAMPLE_HASH&dn=example';
downloadMagnet(magnetURI);
