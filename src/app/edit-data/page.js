// app/edit-data/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link'; // Importa Link
import DbCollectionSelector from '@/components/DbCollectionSelector';
import EditForm from '@/components/EditForm'; // Asegúrate de importar el componente

const EditDataPage = () => {
    const [selectedDb, setSelectedDb] = useState('');
    const [selectedCollection, setSelectedCollection] = useState('');
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [filter, setFilter] = useState(''); // Estado para el filtro

    const handleDbChange = (dbName) => {
        setSelectedDb(dbName);
        setSelectedCollection('');
        setData([]);
        setFilter(''); // Resetea el filtro al cambiar de base de datos
    };

    const handleCollectionChange = async (collectionName) => {
        setSelectedCollection(collectionName);
        try {
            const response = await fetch(`/api/getCollectionData?dbName=${selectedDb}&collectionName=${collectionName}`);
            if (!response.ok) {
                throw new Error('Error fetching collection data');
            }
            const data = await response.json();
            console.log(data);
            setData(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching collection data:', err);
        }
    };

    const handleEdit = (item) => {
        setEditItem(item);
    };

    const handleUpdate = async (updatedData) => {
        try {
            const response = await fetch(`/api/updateCollectionData`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dbName: selectedDb,
                    collectionName: selectedCollection,
                    updatedData: { ...updatedData, PropertyID: editItem.PropertyID }, // Asegúrate de incluir el ID o clave única
                }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar los datos');
            }

            // Opcionalmente, puedes actualizar la lista de datos en el estado
            const updatedDataResponse = await response.json();
            setData((prevData) =>
                prevData.map(item =>
                    item.PropertyID === updatedDataResponse.PropertyID ? updatedDataResponse : item
                )
            );

            setEditItem(null); // Ocultar el formulario de edición después de la actualización
        } catch (err) {
            console.error('Error updating item:', err);
            // Maneja errores aquí si es necesario
        }
    };

    // Filtrar los datos según el valor ingresado
    const filteredData = data.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(filter.toLowerCase())
        )
    );
    return (
        <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-white">Editar Datos</h1>

            {/* Contenedor para los botones */}
            <div className="flex justify-between mt-4">
                <DbCollectionSelector
                    onDbChange={handleDbChange}
                    onCollectionChange={handleCollectionChange}
                    dbError={error}
                />
                <Link href="/collections">
                    <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                        Ir a Colecciones
                    </button>
                </Link>
            </div>

            {selectedCollection && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Datos de la colección seleccionada</h2>
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)} // Actualiza el estado del filtro
                            className="mt-2 p-2 w-full rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400"
                        />

{editItem && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold text-white">Editar Elemento</h2>
                    <EditForm item={editItem} onUpdate={handleUpdate} onCancel={() => setEditItem(null)} />
                </div>
            )}
                    </div>
                                {/* Mostrar el formulario de edición debajo del campo de búsqueda y ocupar el mismo espacio */}


                    <div>
                        {filteredData.length > 0 ? (
                            <table className="mt-4 min-w-full border-collapse border border-gray-700">
                                <thead>
                                    <tr className="bg-gray-700">
                                        {Object.keys(data[0]).slice(0, 4).map((key) => (
                                            <th key={key} className="px-4 py-2 text-left text-gray-300 border border-gray-600">{key}</th>
                                        ))}
                                        <th className="px-4 py-2 text-left text-gray-300 border border-gray-600">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-800">
                                            {Object.values(item).slice(0, 4).map((value, idx) => (
                                                <td key={idx} className="px-4 py-2 border border-gray-600 text-gray-200">{value}</td>
                                            ))}
                                            <td className="px-4 py-2 border border-gray-600">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="px-2 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                                                >
                                                    Editar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="mt-4 text-gray-400">No hay datos para mostrar.</p>
                        )}
                    </div>
                </div>
            )}


        </div>
    );
};

export default EditDataPage;