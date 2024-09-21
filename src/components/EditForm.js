// app/components/EditForm.js
import { useState } from 'react';

const EditForm = ({ item, onUpdate, onCancel }) => {
    const [formData, setFormData] = useState(item);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Aquí debes hacer la llamada a tu API para actualizar los datos
        await onUpdate(formData);
        onCancel(); // Cierra el formulario después de actualizar
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-800 rounded-lg">
            {Object.keys(formData).map((key) => (
                <div key={key} className="mb-4">
                    <label className="block text-white mb-1">
                        {key}:
                        <input
                            type="text"
                            name={key}
                            value={formData[key] || ''}
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
                    Actualizar
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition duration-200"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
};

export default EditForm;