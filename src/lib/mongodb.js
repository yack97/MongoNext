// lib/mongodb.js
import { MongoClient } from 'mongodb';

// Asegúrate de que esta variable esté definida en tu archivo .env.local
const uri = process.env.MONGODB_URI; 
const options = { useNewUrlParser: true, useUnifiedTopology: true }; // Opciones para evitar advertencias

let client;
let clientPromise;

// Crea una instancia del cliente de MongoDB
if (process.env.NODE_ENV === 'development') {
  // En desarrollo, utiliza una nueva instancia de cliente para cada conexión
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((error) => {
    console.error('Error connecting to MongoDB in development:', error);
    throw error; // Lanzar el error para que sea manejado más arriba
  });
} else {
  // En producción, reutiliza el cliente de MongoDB
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((error) => {
      console.error('Error connecting to MongoDB in production:', error);
      throw error; // Lanzar el error para que sea manejado más arriba
    });
  }
  clientPromise = global._mongoClientPromise;
}

// Define la función para conectarse a la base de datos con un nombre de base de datos dinámico
export async function connectToDatabase(dbName) {
  try {
    const client = await clientPromise; // Espera a que se conecte el cliente
    const db = client.db(dbName); // Usar el nombre de la base de datos que se pasa como argumento
    return db; // Devuelve la base de datos
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error; // Lanzar el error para que sea manejado más arriba
  }
}

// También puedes exportar el clientPromise si lo necesitas en otro lugar
export { clientPromise };