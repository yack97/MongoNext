// pages/api/getDocumentById.js
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  const { dbName, collectionName, id } = req.query;

  if (req.method === 'GET') {
    try {
      await client.connect();
      const database = client.db(dbName);
      const collection = database.collection(collectionName);

      const document = await collection.findOne({ _id: ObjectId(id) });

      if (!document) {
        return res.status(404).json({ message: 'Documento no encontrado' });
      }

      res.status(200).json(document);
    } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}