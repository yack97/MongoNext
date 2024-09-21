// app/api/getCollectionData/route.js

import { clientPromise } from '@/lib/mongodb';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const dbName = searchParams.get('dbName');
  const collectionName = searchParams.get('collectionName');

  try {
    const client = await clientPromise;
    const collection = client.db(dbName).collection(collectionName);
    const data = await collection.find({}).toArray();

    // Filtra el campo `_id`
    const filteredData = data.map(({ _id, ...rest }) => rest); // Elimina el campo `_id`

    return new Response(JSON.stringify(filteredData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener los datos de la colección' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}