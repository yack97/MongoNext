'use client';

import { useState } from 'react';
import Link from 'next/link'; // Importa Link
import DbCollectionSelector from '@/components/DbCollectionSelector';
import DataForm from '@/components/DataForm';

const AddDataPage = () => {
    const [selectedDb, setSelectedDb] = useState('');
    const [selectedCollection, setSelectedCollection] = useState('');
    const [fields, setFields] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [error, setError] = useState(null);

    const handleDbChange = (dbName) => {
        setSelectedDb(dbName);
    };

    const handleCollectionChange = async (collectionName) => {
        setSelectedCollection(collectionName);

        // Obtener la estructura de la colección
        try {
            const response = await fetch(`/api/getCollectionSchema?dbName=${selectedDb}&collectionName=${collectionName}`);
            if (!response.ok) {
                throw new Error('Error fetching collection schema');
            }
            const data = await response.json();
            setFields(data.fields);
            setFormVisible(true); // Muestra el formulario
        } catch (err) {
            setError(err.message);
            console.error('Error fetching collection schema:', err);
        }
    };

    const handleAddData = (formData) => {
        const dataToSend = {
            dbName: selectedDb,
            collectionName: selectedCollection,
            data: formData
        };

        fetch(`/api/addData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error adding data');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Data added:', data);
            setFormVisible(false);
        })
        .catch((err) => {
            console.error('Error adding data:', err);
        });
    };

    return (
        <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
            <DbCollectionSelector 
                onDbChange={handleDbChange} 
                onCollectionChange={handleCollectionChange} 
            />
            {formVisible && (
                <div className="mt-4">
                    <DataForm
                        fields={fields}
                        dbName={selectedDb}
                        collectionName={selectedCollection}
                        onSubmit={handleAddData}
                        onCancel={() => setFormVisible(false)}
                        className="p-4 bg-gray-800 rounded-lg"
                    />
                </div>
            )}

            {/* Agrega el botón para navegar a la página de colecciones */}
            <div className="mt-4">
                <Link href="/collections">
                    <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                        Ir a Colecciones
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default AddDataPage;