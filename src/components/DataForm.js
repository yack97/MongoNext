// components/DataForm.js
import { useState } from 'react';

const DataForm = ({ fields, dbName, collectionName, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null); // Estado para manejar errores

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Eliminar campos vacíos del formData
        const cleanedData = Object.fromEntries(
            Object.entries(formData).filter(([_, v]) => v !== '' && v !== undefined)
        );

        console.log('Datos a enviar:', cleanedData); // Log para verificar los datos que se envían
        console.log('Nombre de la base de datos:', dbName);
        console.log('Nombre de la colección:', collectionName);

        // Invoca onSubmit, pasando los datos del formulario
        onSubmit(cleanedData);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-800 rounded-lg">
            {fields.map((field) => (
                <div key={field} className="mb-4">
                    <label className="block text-white mb-1">
                        {field}:
                        <input
                            type="text"
                            name={field}
                            value={formData[field] || ''}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-green-500"
                        />
                    </label>
                </div>
            ))}
            <div className="flex space-x-4">
                <button
                    type="submit"
                    className="px-6 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition duration-200"
                >
                    Agregar
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition duration-200"
                >
                    Cancelar
                </button>
            </div>
            {error && <p className="mt-4 text-red-500">{error}</p>} {/* Mostrar errores */}
        </form>
    );
};

export default DataForm;