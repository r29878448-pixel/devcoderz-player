export default async function handler(req, res) {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        const urlObj = new URL(targetUrl);
        const response = await fetch(targetUrl, {
            headers: {
                'Host': urlObj.host,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Origin': 'https://brainboxinstitute.in',
                'Referer': 'https://brainboxinstitute.in/'
            }
        });

        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        const buffer = await response.arrayBuffer();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', contentType);
        return res.status(response.status).send(Buffer.from(buffer));

    } catch (err) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(500).json({ error: err.message });
    }
}
