import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req, res) {
  const PINATA_API_URL = 'https://api.pinata.cloud/data/pinList?status=pinned';
  console.log('API KEY:', process.env.PINATA_API_KEY);

  try {
    const response = await axios.get(PINATA_API_URL, {
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    });

    const activeRounds = response.data.rows.map((pin) => ({
      ipfsHash: pin.ipfs_pin_hash,
      metadata: pin.metadata,
    }));

    return NextResponse.json(activeRounds);
    // return new Response(JSON.stringify(activeRounds), { status: 200 });
  } catch (error) {
    console.error('Error fetching data from Pinata:', error);
    return NextResponse.json({ message: 'Failed to fetch data from pinata' }, { status: 500 });
  }
}
