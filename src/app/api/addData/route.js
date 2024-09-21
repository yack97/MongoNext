// app/api/addData/route.js

import { connectToDatabase } from '@/lib/mongodb'; // Asegúrate de que la función de conexión esté correctamente exportada

export async function POST(req) {
    const { dbName, collectionName, data } = await req.json();

    // Validar parámetros
    if (!dbName || !collectionName || !data) {
        return new Response(JSON.stringify({ message: 'Faltan parámetros requeridos.' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
        // Conecta a la base de datos usando el nombre de la base de datos seleccionada
        const db = await connectToDatabase(dbName);
        console.log('Conectado a la base de datos:', dbName); // Log para verificar la conexión
        
        const collection = db.collection(collectionName); // Selecciona la colección proporcionada
        console.log('Colección seleccionada:', collectionName); // Log para verificar la colección

        // Verifica que los datos a insertar no estén vacíos
        console.log('Datos a insertar:', data); // Log para verificar los datos a insertar
        
        // Realiza la inserción de datos
        const result = await collection.insertOne(data);
        console.log('Resultado de la inserción:', result); // Log para verificar el resultado de la inserción

        // Devolver el resultado de la inserción
        return new Response(JSON.stringify({
            acknowledged: result.acknowledged,
            insertedId: result.insertedId
        }), {
            status: 201, // Cambia el estado a 201 para indicar que se creó un nuevo recurso
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error al agregar datos:', error);
        return new Response(JSON.stringify({
            message: 'Error al agregar datos', 
            error: error.message 
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}