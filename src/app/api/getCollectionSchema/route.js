import { clientPromise } from '@/lib/mongodb';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const dbName = searchParams.get('dbName');
  const collectionName = searchParams.get('collectionName');

  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Obtén un ejemplo de documento para inferir la estructura
    const sampleDocument = await collection.findOne();
    
    if (!sampleDocument) {
      return new Response(JSON.stringify({ fields: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Filtra el campo _id
    const fields = Object.keys(sampleDocument).filter(field => field !== '_id');

    return new Response(JSON.stringify({ fields }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener la estructura de la colección' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}