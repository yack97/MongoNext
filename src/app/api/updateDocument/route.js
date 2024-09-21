// pages/api/updateDocument/route.js
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  const { dbName, collectionName, id } = req.query;

  if (req.method === 'PUT') {
    try {
      await client.connect();
      const database = client.db(dbName);
      const collection = database.collection(collectionName);

      const result = await collection.updateOne({ _id: ObjectId(id) }, { $set: req.body });

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Documento no encontrado' });
      }

      res.status(200).json({ message: 'Documento actualizado correctamente' });
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}