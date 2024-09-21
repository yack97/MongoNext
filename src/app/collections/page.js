// app/collections/page.js
'use client';

import { useState } from 'react';
import DbCollectionSelector from '@/components/DbCollectionSelector';
import DataDisplay from '@/components/DataDisplay';
import Link from 'next/link';

export default function CollectionsPage() {
    const [selectedDb, setSelectedDb] = useState('');
    const [selectedCollection, setSelectedCollection] = useState('');
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    const handleDbChange = (dbName) => {
        setSelectedDb(dbName);
    };

    const handleCollectionChange = async (collectionName) => {
        setSelectedCollection(collectionName);

        try {
            const response = await fetch(`/api/getCollectionData?dbName=${selectedDb}&collectionName=${collectionName}`);
            if (!response.ok) {
                throw new Error('Error fetching collection data');
            }
            const data = await response.json();
            setData(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching collection data:', err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black">
            <DbCollectionSelector onDbChange={handleDbChange} onCollectionChange={handleCollectionChange} dbError={error} />
            
            <div className="flex space-x-4 mt-4">
                <Link href="/add-data">
                    <button className="px-6 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition duration-200">
                        Añadir Datos
                    </button>
                </Link>
                <Link href="/edit-data">
                    <button className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-200">
                        Editar Datos
                    </button>
                </Link>
            </div>
    
            {selectedCollection && <DataDisplay data={data} />}
        </div>
    );
    
}