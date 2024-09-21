// app/api/editData/route.js

import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { dbName, collectionName, data } = req.body;

    const client = new MongoClient(process.env.MONGODB_URI);
    try {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      // Suponiendo que los datos contienen un identificador único para cada documento
      const filter = { _id: data._id }; // Asegúrate de que el _id esté presente en los datos
      const update = { $set: data };

      const result = await collection.updateOne(filter, update);
      res.status(200).json({ message: 'Data updated successfully', result });
    } catch (error) {
      console.error('Error updating data:', error);
      res.status(500).json({ error: 'Error updating data' });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}