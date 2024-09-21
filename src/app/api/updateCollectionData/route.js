// app/api/updateCollectionData/route.js

import { clientPromise } from '@/lib/mongodb';

export async function PUT(req) {
    const { dbName, collectionName, updatedData } = await req.json();

    try {
        const client = await clientPromise;
        const collection = client.db(dbName).collection(collectionName);

        // Asegúrate de que el documento se actualiza utilizando un campo único, como `PropertyID`
        const result = await collection.updateOne(
            { PropertyID: updatedData.PropertyID }, // Puedes usar cualquier campo único
            { $set: updatedData }
        );

        if (result.matchedCount === 0) {
            return new Response(JSON.stringify({ error: 'No se encontró el documento para actualizar' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify(updatedData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error al actualizar los datos' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}