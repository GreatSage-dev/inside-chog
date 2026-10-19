const https = require('https');

function fetch(url) {
  https.get(url, res => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      console.log('Redirecting to:', res.headers.location);
      return fetch(res.headers.location);
    }
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Final URL fetched. Length:', data.length);
      const matches = data.match(/https?:\/\/[^"'\s<>]+\.(?:png|jpg|webp)/gi) || [];
      console.log('All image URLs found:', [...new Set(matches)]);
      const srcList = data.match(/src="([^"]+)"/g) || [];
      console.log('Sources found:', srcList.slice(0, 15));
    });
  });
}

fetch('https://www.chog.xyz/maker');
