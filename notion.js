export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, databaseId, apiKey, pageId, order } = req.body;

  if (!apiKey || !databaseId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    if (action === 'query') {
      // Query the database
      const response = await fetch(
        `https://api.notion.com/v1/databases/${databaseId}/query`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sorts: [{ property: 'Order', direction: 'ascending' }]
          })
        }
      );

      const data = await response.json();
      return res.status(200).json(data);

    } else if (action === 'update') {
      // Update a page
      const response = await fetch(
        `https://api.notion.com/v1/pages/${pageId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            properties: {
              Order: { number: order }
            }
          })
        }
      );

      const data = await response.json();
      return res.status(200).json(data);
    }

    return res.status(400).json({ error: 'Invalid action' });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}