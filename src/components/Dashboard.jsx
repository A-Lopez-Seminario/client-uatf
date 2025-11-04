import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, AlertCircle, CheckCircle, Clock, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { obtenerEstadisticas, obtenerTodosProgresos } from '../services/api';
import { exportarReporteConsolidado } from '../utils/exportUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard({ onVolver }) {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [progresos, setProgresos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [statsData, progresosData] = await Promise.all([
        obtenerEstadisticas(token),
        obtenerTodosProgresos(token)
      ]);
      
      setStats(statsData);
      setProgresos(progresosData);
    } catch (error) {
      toast.error('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const handleExportarConsolidado = () => {
    exportarReporteConsolidado(progresos);
    toast.success('Reporte consolidado exportado');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando estadísticas...</div>
      </div>
    );
  }

  // Preparar datos para gráficos
  const dataPie = [
    { name: 'Completadas', value: stats.carrerasCompletadas },
    { name: 'En Proceso', value: stats.carrerasEnProceso },
    { name: 'Sin Iniciar', value: stats.carrerasSinIniciar }
  ];

  // Agrupar por facultad
  const progresosPorFacultad = progresos.reduce((acc, prog) => {
    const facultad = prog.facultad || 'Sin Facultad';
    if (!acc[facultad]) {
      acc[facultad] = { nombre: facultad, carreras: 0, progresoTotal: 0 };
    }
    
    const fasesMap = new Map(Object.entries(prog.fases || {}));
    const completadas = Array.from(fasesMap.values()).filter(f => 
      f === true || (typeof f === 'object' && f?.completado)
    ).length;
    const porcentaje = (completadas / 12) * 100;
    
    acc[facultad].carreras++;
    acc[facultad].progresoTotal += porcentaje;
    
    return acc;
  }, {});

  const dataBarras = Object.values(progresosPorFacultad).map(f => ({
    nombre: f.nombre.replace('Facultad de ', ''),
    promedio: Math.round(f.progresoTotal / f.carreras)
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={onVolver}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <button
            onClick={handleExportarConsolidado}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition"
          >
            <Download className="w-5 h-5" />
            Exportar Reporte Consolidado
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard - Estadísticas Generales</h1>

        {/* Tarjetas de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Carreras</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalCarreras}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Completadas</p>
                <p className="text-3xl font-bold text-gray-800">{stats.carrerasCompletadas}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">En Proceso</p>
                <p className="text-3xl font-bold text-gray-800">{stats.carrerasEnProceso}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Sin Iniciar</p>
                <p className="text-3xl font-bold text-gray-800">{stats.carrerasSinIniciar}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Progreso Promedio */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Progreso Promedio General</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Avance Global</span>
                <span className="text-2xl font-bold text-blue-600">{stats.progresoPromedio}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div 
                  className="bg-blue-600 h-6 rounded-full transition-all duration-500 flex items-center justify-center text-white text-xs font-bold"
                  style={{ width: `${stats.progresoPromedio}%` }}
                >
                  {stats.progresoPromedio}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Pastel */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Distribución de Carreras</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataPie}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dataPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Barras */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Progreso Promedio por Facultad</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataBarras}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="promedio" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabla de Carreras */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Detalle de Carreras</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Carrera</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Facultad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Sede</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Progreso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {progresos.map((prog, idx) => {
                  const fasesMap = new Map(Object.entries(prog.fases || {}));
                  const completadas = Array.from(fasesMap.values()).filter(f => 
                    f === true || (typeof f === 'object' && f?.completado)
                  ).length;
                  const porcentaje = Math.round((completadas / 12) * 100);
                  
                  let estado = 'Sin Iniciar';
                  let colorEstado = 'text-red-600 bg-red-100';
                  
                  if (porcentaje === 100) {
                    estado = 'Completado';
                    colorEstado = 'text-green-600 bg-green-100';
                  } else if (porcentaje > 0) {
                    estado = 'En Proceso';
                    colorEstado = 'text-yellow-600 bg-yellow-100';
                  }

                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{prog.carrera}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{prog.facultad}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{prog.sede}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${porcentaje}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{porcentaje}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorEstado}`}>
                          {estado}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}