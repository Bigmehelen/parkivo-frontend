const https = require('https');
const fs = require('fs');

const baseUrl = 'https://smrt-park-backend.onrender.com';

const testEndpoints = [
    '/api/parking-spaces/all',
    '/health',
    '/'
];

async function probe() {
    let log = `Testing endpoints on ${baseUrl} at ${new Date().toISOString()}\n`;
    console.log('Starting probe...');

    for (const path of testEndpoints) {
        log += await new Promise((resolve) => {
            const url = `${baseUrl}${path}`;
            https.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    let result = `[${res.statusCode}] ${path}\n`;
                    if (res.statusCode === 200) {
                        result += `  SUCCESS! Content snippet: ${data.substring(0, 100).replace(/\n/g, ' ')}\n`;
                    } else {
                        result += `  Error/Status snippet: ${data.substring(0, 200).replace(/\n/g, ' ')}\n`;
                    }
                    resolve(result);
                });
            }).on('error', (err) => {
                resolve(`[FAILED] ${path}: ${err.message}\n`);
            });
        });
    }

    fs.writeFileSync('probe_results.txt', log);
    console.log(log);
    console.log('Probe finished. Results written to probe_results.txt');
}

probe();
