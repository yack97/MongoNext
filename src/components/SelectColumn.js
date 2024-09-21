// src/components/SelectColumn.js
import { useEffect, useState } from 'react';

const SelectColumn = ({ selectedCollection, selectedDb, onSelect }) => {
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [inputId, setInputId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedCollection) {
      const fetchColumns = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/getColumnsByCollection?dbName=${selectedDb}&collectionName=${selectedCollection}`);
          if (!response.ok) {
            throw new Error('Error al obtener las columnas');
          }
          const data = await response.json();
          setColumns(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchColumns();
    } else {
      setColumns([]);
    }
  }, [selectedCollection, selectedDb]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSelect(selectedColumn);
    // Aquí podrías añadir más lógica si es necesario
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800 rounded-lg">
      {loading ? (
        <p className="text-white">Cargando columnas...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <>
          <label htmlFor="columnSelect" className="block text-white mb-1">
            Selecciona una columna:
          </label>
          <select
            id="columnSelect"
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="mb-4 p-2 w-full bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-green-500"
          >
            <option value="">Seleccione una columna</option>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>

          <label htmlFor="documentId" className="block text-white mb-1">
            Buscar por ID:
          </label>
          <input
            type="text"
            id="documentId"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            className="mb-4 p-2 w-full bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-green-500"
          />
          <button
            type="submit"
            className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-200"
          >
            Buscar
          </button>
        </>
      )}
    </form>
  );
};

export default SelectColumn;