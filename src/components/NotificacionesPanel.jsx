import React, { useState, useEffect } from 'react';
import { X, Bell, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { obtenerNotificaciones, marcarNotificacionLeida, marcarTodasLeidas } from '../services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

export default function NotificacionesPanel({ onClose }) {
  const { token } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const cargarNotificaciones = async () => {
    try {
      const data = await obtenerNotificaciones(token);
      setNotificaciones(data);
    } catch (error) {
      toast.error('Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const marcarLeida = async (id) => {
    try {
      await marcarNotificacionLeida(id, token);
      setNotificaciones(notificaciones.map(n => 
        n._id === id ? { ...n, leida: true } : n
      ));
    } catch (error) {
      toast.error('Error al marcar notificación');
    }
  };

  const marcarTodasComoLeidas = async () => {
    try {
      await marcarTodasLeidas(token);
      setNotificaciones(notificaciones.map(n => ({ ...n, leida: true })));
      toast.success('Todas las notificaciones marcadas como leídas');
    } catch (error) {
      toast.error('Error al marcar notificaciones');
    }
  };

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-yellow-600 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">
              Notificaciones {noLeidas > 0 && `(${noLeidas} nuevas)`}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {noLeidas > 0 && (
              <button
                onClick={marcarTodasComoLeidas}
                className="text-white hover:bg-yellow-700 rounded px-3 py-1 text-sm transition flex items-center gap-1"
              >
                <CheckCheck className="w-4 h-4" />
                Marcar todas
              </button>
            )}
            <button
              onClick={onClose}
              className="text-white hover:bg-yellow-700 rounded-full p-1 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Cargando...</div>
          ) : notificaciones.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No tienes notificaciones
            </div>
          ) : (
            <div className="space-y-3">
              {notificaciones.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => !notif.leida && marcarLeida(notif._id)}
                  className={`border rounded-lg p-4 cursor-pointer transition ${
                    notif.leida 
                      ? 'bg-white border-gray-200' 
                      : 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{notif.titulo}</h3>
                    {!notif.leida && (
                      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                        Nueva
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{notif.mensaje}</p>
                  {notif.carrera && (
                    <p className="text-xs text-gray-500">
                      {notif.carrera} - {notif.sede}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {format(new Date(notif.fecha), "dd/MM/yyyy HH:mm", { locale: es })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}