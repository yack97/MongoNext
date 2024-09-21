// pages/api/updateData/rote.js
import { connectToDatabase } from '@/lib/mongodb'; // Asegúrate de importar tu función de conexión a MongoDB

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const { db, collection } = await connectToDatabase();
        const { PropertyID, ...updatedData } = req.body; // Extrae el ID para identificar el documento
        try {
            const result = await db.collection(collection).updateOne(
                { PropertyID }, // Filtrar por PropertyID
                { $set: updatedData }
            );
            res.json(updatedData);
        } catch (error) {
            res.status(500).json({ message: 'Error updating data' });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}