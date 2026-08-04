export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { get_hls, quality, mpd } = req.query;

    if (!mpd) {
        return res.status(400).json({ error: 'Missing mpd parameter' });
    }

    try {
        let targetUrl = `https://studyuk.online/newproxy/proxy2.php?get_hls=${get_hls || '1'}&quality=${quality || '480'}&mpd=${encodeURIComponent(mpd)}`;
        const response = await fetch(targetUrl);
        
        const contentType = response.headers.get('content-type');
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }

        const buffer = await response.arrayBuffer();
        return res.status(response.status).send(Buffer.from(buffer));
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch proxy' });
    }
}
