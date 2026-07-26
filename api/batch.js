export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://Thedevcoderz-pw.pages.dev');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, x-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const userApiKey = req.headers['x-api-key'] || req.query.key;
  const SECRET_API_KEY = "Darz_ka_baap_devcoderz";

  if (!userApiKey || userApiKey !== SECRET_API_KEY) {
    return res.status(401).json({ success: false, error: "Me tumhara baap hu is chij me 😂😂😂 API Key kidhar hai?!" });
  }

  const { batch_id } = req.query;

  if (!batch_id) {
    return res.status(400).json({ success: false, error: "Batch ID missing ❌" });
  }

  try {
    const url = `https://api.penpencil.co/v3/batches/${encodeURIComponent(batch_id)}/details?page=1`;

    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch data 💀" });
  }
}
