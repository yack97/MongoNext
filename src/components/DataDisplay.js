// components/DataDisplay.js
import React from 'react';

const DataDisplay = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No hay datos para mostrar.</div>;
  }

  return (
    <div className="p-4 bg-black text-white">
      <h3 className="text-xl font-semibold mb-4">Datos de la colección</h3>
      <div className="overflow-auto max-h-96"> {/* Contenedor con desplazamiento */}
        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead>
            <tr className="bg-gray-700 text-left">
              {Object.keys(data[0]).map((key) => (
                <th key={key} className="px-4 py-2 border-b border-gray-600">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-700 transition duration-200">
                {Object.values(item).map((value, idx) => (
                  <td key={idx} className="px-4 py-2 border-b border-gray-600">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

};

export default DataDisplay;