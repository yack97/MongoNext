// src/app/api/getColumnsByCollection/route.js
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dbName = searchParams.get('dbName');
  const collectionName = searchParams.get('collectionName');

  try {
    const db = await connectToDatabase(dbName);
    const collection = db.collection(collectionName);

    // Obtener un documento de ejemplo para inferir los nombres de las columnas
    const sampleDocument = await collection.findOne({});
    const columns = sampleDocument ? Object.keys(sampleDocument) : [];

    return new Response(JSON.stringify(columns), { status: 200 });
  } catch (error) {
    console.error('Error al obtener las columnas:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener las columnas' }), { status: 500 });
  }
}