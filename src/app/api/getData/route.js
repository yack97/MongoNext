//aap/api/getData/route.js

import { clientPromise } from '@/lib/mongodb';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const dbName = searchParams.get('dbName');
    const collectionName = searchParams.get('collectionName');
  try {
    const client = await clientPromise;
    const databasesList = await client.db().admin().listDatabases();
    return new Response(JSON.stringify(databasesList.databases), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener las bases de datos' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}