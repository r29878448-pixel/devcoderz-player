export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { batchId, childId } = req.query;

    if (!batchId  || !childId) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const targetUrl = `https://flat-moon-3350.bhanuyadav.workers.dev/?batchId=${batchId}&childId=${childId}`;
        const response = await fetch(targetUrl);
        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch media API' });
    }
}

