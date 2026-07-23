export default async function handler(req, res) {
    const { url } = req.query;
    
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is missing' });
    }

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://brainboxinstitute.in/',
                'Origin': 'https://brainboxinstitute.in'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: `Upstream error: ${response.statusText}` });
        }

        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        const buffer = await response.arrayBuffer();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', contentType);
        return res.status(200).send(Buffer.from(buffer));
        
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
