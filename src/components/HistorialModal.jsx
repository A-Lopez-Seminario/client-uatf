import React from 'react';
import { X, Calendar, User, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function HistorialModal({ historial, carrera, sede, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            Historial de Cambios - {carrera} ({sede})
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 rounded-full p-1 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {historial.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No hay cambios registrados para esta carrera
            </div>
          ) : (
            <div className="space-y-4">
              {historial.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Edit className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-800">
                        Fase {item.fase}: {item.accion}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(item.fecha), "dd/MM/yyyy HH:mm", { locale: es })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <User className="w-4 h-4" />
                    <span>{item.usuario}</span>
                  </div>

                  {item.valorAnterior && (
                    <div className="bg-red-50 border border-red-200 rounded p-2 mb-2">
                      <p className="text-xs font-medium text-red-700 mb-1">Valor Anterior:</p>
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(item.valorAnterior, null, 2)}
                      </pre>
                    </div>
                  )}

                  {item.valorNuevo && (
                    <div className="bg-green-50 border border-green-200 rounded p-2">
                      <p className="text-xs font-medium text-green-700 mb-1">Valor Nuevo:</p>
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(item.valorNuevo, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}