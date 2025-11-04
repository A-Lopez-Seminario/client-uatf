import React, { useState, useEffect } from 'react';
import { LogOut, BookOpen, MapPin, Search, BarChart3, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { obtenerTodosProgresos } from '../services/api';
import toast from 'react-hot-toast';
import NotificacionesPanel from './NotificacionesPanel';

const CARRERAS_DATA = [
  { facultad: "Facultad de Artes", carrera: "Artes Musicales", sede: "Potosí" },
  { facultad: "Facultad de Artes", carrera: "Artes Plásticas", sede: "Potosí" },
  { facultad: "Facultad de Artes", carrera: "Arquitectura", sede: "Potosí" },
  { facultad: "Facultad de Ciencias Agrícolas y Pecuarias", carrera: "Ingeniería Agronómica", sede: "Potosí" },
  { facultad: "Facultad de Ciencias Agrícolas y Pecuarias", carrera: "Ingeniería Agroindustrial", sede: "Potosí" },
  { facultad: "Facultad de Ciencias Agrícolas y Pecuarias", carrera: "Ingeniería en Desarrollo Rural", sede: "Potosí" },
  { facultad: "Facultad de Ciencias Agrícolas y Pecuarias", carrera: "Ingeniería Agropecuaria", sede: "Villazón" },
  { facultad: "Facultad de Ciencias Agrícolas y Pecuarias", carrera: "Medicina Veterinaria y Zootecnia", sede: "Tupiza" },
  { facultad: "Facultad de Ciencias Económicas, Financieras y Administrativas", carrera: "Auditoría - Contaduría Pública", sede: "Potosí" },
  { facultad: "Facultad de Ciencias Económicas, Financieras y Administrativas", carrera: "Contabilidad y Finanzas", sede: "Potosí" },
  { facultad: "Facultad de Ciencias Económicas, Financieras y Administrativas", carrera: "Administración de Empresas", sede: "Potosí" },
  { facultad: "Facultad de Ciencias Económicas, Financieras y Administrativas", carrera: "Economía", sede: "Potosí" },
  { facultad: "Facultad de Ciencias Económicas, Financieras y Administrativas", carrera: "Ingeniería Comercial", sede: "Potosí" },
  { facultad: "Facultad de Ciencias Económicas, Financieras y Administrativas", carrera: "Economía", sede: "Uyuni" },
  { facultad: "Facultad de Ciencias Económicas, Financieras y Administrativas", carrera: "Economía", sede: "Uncía" },
  { facultad: "Facultad de Ciencias Económicas, Financieras y Administrativas", carrera: "Contaduría Pública", sede: "Tupiza" },
  { facultad: "Facultad de Ciencias Puras", carrera: "Química", sede: "Potosí" },
  { facultad: "Facultad de Ciencias Puras", carrera: "Estadística", sede: "Potosí" },
  { facultad: "Facultad de Ciencias Puras", carrera: "Física", sede: "Potosí" },
  { facultad: "Facultad de Ciencias Puras", carrera: "Matemática", sede: "Potosí" },
  { facultad: "Facultad de Ciencias Puras", carrera: "Ingeniería Informática", sede: "Potosí" },
  { facultad: "Vicerrectorado", carrera: "Programa Enfermeria", sede: "Llica" },
  { facultad: "Vicerrectorado", carrera: "Programa Derecho", sede: "Tupiza" },
  { facultad: "Vicerrectorado", carrera: "Programa Ciencias de la Comunicación", sede: "Potosí" },
  { facultad: "Vicerrectorado", carrera: "Odontologia", sede: "Potosí" },
  { facultad: "Vicerrectorado", carrera: "Ingeniería de Sistemas", sede: "Tupiza" },
  { facultad: "Vicerrectorado", carrera: "Programa Diseño y Programacion Digital", sede: "Potosí" },
  { facultad: "Vicerrectorado", carrera: "Ingeniería de Sistemas", sede: "Potosí" },
  { facultad: "Facultad de Ciencias Sociales y Humanísticas", carrera: "Turismo", sede: "Potosí" },
  { facultad: "Facultad de Ciencias Sociales y Humanísticas", carrera: "Lingüística e Idiomas", sede: "Potosí" },
  { facultad: "Facultad de Ciencias Sociales y Humanísticas", carrera: "Trabajo Social", sede: "Potosí" },
  { facultad: "Facultad de Ciencias Sociales y Humanísticas", carrera: "Programa de Ciencias de la Comunicación", sede: "Potosí" },
  { facultad: "Facultad de Ciencias Sociales y Humanísticas", carrera: "Programa de Pedagogía Intercultural", sede: "Potosí" },
  { facultad: "Facultad de Ciencias Sociales y Humanísticas", carrera: "Turismo", sede: "Uyuni" },
  { facultad: "Facultad de Ciencias Sociales y Humanísticas", carrera: "Escuela de Idiomas", sede: "Tupiza" },
  { facultad: "Facultad de Ciencias Sociales y Humanísticas", carrera: "Lingüística e Idiomas", sede: "Uyuni" },
  { facultad: "Facultad de Ciencias Sociales y Humanísticas", carrera: "Trabajo Social", sede: "Uncía" },
  { facultad: "Facultad de Ciencias de la Salud", carrera: "Enfermería", sede: "Potosí" },
  { facultad: "Facultad de Ciencias de la Salud", carrera: "Enfermería", sede: "Villazón" },
  { facultad: "Facultad de Derecho", carrera: "Derecho", sede: "Potosí" },
  { facultad: "Facultad de Derecho", carrera: "Derecho", sede: "Uncía" },
  { facultad: "Facultad de Ingeniería", carrera: "Ingeniería Civil", sede: "Potosí" },
  { facultad: "Facultad de Ingeniería", carrera: "Construcciones Civiles", sede: "Potosí" },
  { facultad: "Facultad de Ingeniería", carrera: "Ingeniería en Geodesia y Topografía", sede: "Potosí" },
  { facultad: "Facultad de Ingeniería Tecnológica", carrera: "Ingeniería Eléctrica", sede: "Potosí" },
  { facultad: "Facultad de Ingeniería Tecnológica", carrera: "Ingeniería Electrónica", sede: "Potosí" },
  { facultad: "Facultad de Ingeniería Tecnológica", carrera: "Ingeniería Mecánica", sede: "Potosí" },
  { facultad: "Facultad de Ingeniería Tecnológica", carrera: "Ingeniería Mecatrónica", sede: "Potosí" },
  { facultad: "Facultad de Ingeniería Tecnológica", carrera: "Mecánica Automotriz", sede: "Potosí" },
  { facultad: "Facultad de Ingeniería Geológica", carrera: "Ingeniería Geológica", sede: "Potosí" },
  { facultad: "Facultad de Ingeniería Geológica", carrera: "Ingeniería del Medio Ambiente", sede: "Potosí" },
  { facultad: "Facultad de Ingeniería Minera", carrera: "Ingeniería Minera", sede: "Potosí" },
  { facultad: "Facultad de Ingeniería Minera", carrera: "Ingeniería de Procesos de Materias Primas Minerales", sede: "Potosí" },
  { facultad: "Facultad de Medicina", carrera: "Medicina", sede: "Potosí" }
];

export default function ListaCarreras({ onSeleccionarCarrera, onDashboard }) {
  const { logout, usuario, token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [progresoCarreras, setProgresoCarreras] = useState({});
  const [loading, setLoading] = useState(true);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

  useEffect(() => {
    cargarProgresos();
  }, []);

  const cargarProgresos = async () => {
    try {
      const progresos = await obtenerTodosProgresos(token);
      const progresoMap = {};
      
      progresos.forEach(prog => {
        const key = `${prog.carrera}-${prog.sede}`;
        progresoMap[key] = prog.fases;
      });
      
      setProgresoCarreras(progresoMap);
    } catch (error) {
      toast.error('Error al cargar progresos');
    } finally {
      setLoading(false);
    }
  };

  const getCarreraKey = (carrera) => {
    return `${carrera.carrera}-${carrera.sede}`;
  };

  const calcularProgreso = (carreraKey) => {
    const progreso = progresoCarreras[carreraKey] || {};
    const completadas = Object.keys(progreso).filter(key => {
      const fase = progreso[key];
      return fase === true || (typeof fase === 'object' && fase?.completado);
    }).length;
    return Math.round((completadas / 12) * 100);
  };

  const filteredCarreras = CARRERAS_DATA.filter(c => 
    c.carrera.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.facultad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.sede.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedCarreras = filteredCarreras.reduce((acc, carrera) => {
    if (!acc[carrera.facultad]) {
      acc[carrera.facultad] = [];
    }
    acc[carrera.facultad].push(carrera);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando carreras...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">UATF Potosí</h1>
              <p className="text-gray-600 text-sm">Sistema de Gestión Curricular</p>
              <p className="text-gray-500 text-xs mt-1">Usuario: {usuario?.nombre} ({usuario?.rol})</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onDashboard}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-700 transition"
              >
                <BarChart3 className="w-5 h-5" />
                Dashboard
              </button>
              <button
                onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
                className="relative flex items-center gap-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-yellow-700 transition"
              >
                <Bell className="w-5 h-5" />
                Notificaciones
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition"
              >
                <LogOut className="w-5 h-5" />
                Cerrar Sesión
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar carrera, facultad o sede..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </header>

      {mostrarNotificaciones && (
        <NotificacionesPanel onClose={() => setMostrarNotificaciones(false)} />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Carreras Disponibles ({filteredCarreras.length})
          </h2>
        </div>

        {Object.keys(groupedCarreras).sort().map((facultad) => (
          <div key={facultad} className="mb-8">
            <h3 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b-2 border-blue-600">
              {facultad}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedCarreras[facultad].map((carrera, idx) => {
                const carreraKey = getCarreraKey(carrera);
                const progreso = calcularProgreso(carreraKey);

                return (
                  <button
                    key={idx}
                    onClick={() => onSeleccionarCarrera(carrera)}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-4 text-left border border-gray-200 hover:border-blue-400"
                  >
                    <h4 className="font-semibold text-gray-800 mb-2">{carrera.carrera}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{carrera.sede}</span>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600">Progreso</span>
                        <span className="text-xs font-bold text-blue-600">{progreso}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${progreso}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {filteredCarreras.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron carreras con ese criterio de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}