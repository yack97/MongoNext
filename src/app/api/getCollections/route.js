// app/api/getCollections/route.js
import { clientPromise } from '@/lib/mongodb';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const dbName = searchParams.get('dbName');

  try {
    const client = await clientPromise;
    const collectionsList = await client.db(dbName).collections();
    const collectionNames = collectionsList.map((collection) => collection.collectionName);
    return new Response(JSON.stringify(collectionNames), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener las colecciones' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}