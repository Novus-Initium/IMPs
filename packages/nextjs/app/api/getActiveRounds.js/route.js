import axios from 'axios';

export default async function handler(req, res) {
  const PINATA_API_URL = 'https://api.pinata.cloud/data/pinList?status=pinned';
  
  try {
    const response = await axios.get(PINATA_API_URL, {
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    });
    console.log(response.data.rows)
    const activeRounds = response.data.rows.map((pin) => {
        return {
        ipfsHash: pin.ipfs_pin_hash,
        metadata: pin.metadata,
      };
    });

    res.status(200).json(activeRounds);
  } catch (error) {
    console.error('Error fetching data from Pinata:', error);
    res.status(500).json({ error: 'Failed to fetch data from Pinata' });
  }
}
