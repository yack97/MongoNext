import { useState, useEffect } from 'react';

const DbCollectionSelector = ({ onDbChange, onCollectionChange, dbError }) => {
    const [databases, setDatabases] = useState([]);
    const [selectedDb, setSelectedDb] = useState('');
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDatabases = async () => {
            try {
                const response = await fetch('/api/getData');
                if (!response.ok) {
                    throw new Error('Error fetching databases');
                }
                const data = await response.json();
                setDatabases(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching databases:', err);
            }
        };

        fetchDatabases();
    }, []);

    const handleDbChange = async (e) => {
        const dbName = e.target.value;
        setSelectedDb(dbName);
        setCollections([]); // Reset collections when db changes
        setSelectedCollection(''); // Reset selected collection
        onDbChange(dbName);

        try {
            const response = await fetch(`/api/getCollections?dbName=${dbName}`);
            if (!response.ok) {
                throw new Error('Error fetching collections');
            }
            const data = await response.json();
            setCollections(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching collections:', err);
        }
    };

    const handleCollectionChange = (e) => {
        const collectionName = e.target.value;
        setSelectedCollection(collectionName);
        onCollectionChange(collectionName);
    };

    return (
        <div className="p-4 bg-black text-white">
            <h1 className="text-2xl font-bold mb-4">Selecciona una base de datos</h1>
            {error || dbError ? (
                <div className="text-red-500 mb-4">Error: {error || dbError}</div>
            ) : (
                <>
                    <select
                        onChange={handleDbChange}
                        value={selectedDb}
                        className="mb-4 p-2 w-full bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-green-500"
                    >
                        <option value="">Seleccione una base de datos</option>
                        {databases.map((db) => (
                            <option key={db.name} value={db.name}>
                                {db.name}
                            </option>
                        ))}
                    </select>

                    {selectedDb && (
                        <>
                            <h2 className="text-xl font-semibold mb-2">Selecciona una colección</h2>
                            <select
                                onChange={handleCollectionChange}
                                value={selectedCollection}
                                className="mb-4 p-2 w-full bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-green-500"
                            >
                                <option value="">Seleccione una colección</option>
                                {collections.map((collection) => (
                                    <option key={collection} value={collection}>
                                        {collection}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default DbCollectionSelector;