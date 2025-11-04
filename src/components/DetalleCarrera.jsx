import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, LogOut, BookOpen, MapPin, Calendar, CheckCircle2, 
  Circle, Download, FileText, History, MessageSquare, Save 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { obtenerProgreso, guardarProgreso, obtenerHistorial } from '../services/api';
import { exportarPDF, exportarExcel } from '../utils/exportUtils';
import toast from 'react-hot-toast';
import HistorialModal from './HistorialModal';

const FASES_CRONOGRAMA = [
  { num: 1, nombre: "Organización en Comisión de Rediseño Curricular", codigo: "RC", verificacion: "Dictamen Consejo de Carrera. Nómina de integrantes" },
  { num: 2, nombre: "Recolección de Documentos y Proyecto Curricular", codigo: "PC", verificacion: "Disponibilidad de documentos. Proyecto Curricular y otros." },
  { num: 3, nombre: "Diagnóstico Inicial de la Carrera", codigo: "DI", verificacion: "Documento entregado al Dpto. Gestión Curricular." },
  { num: 4, nombre: "Estudio de Contexto", codigo: "EC", verificacion: "Documento entregado al Dpto. Gestión Curricular." },
  { num: 5, nombre: "Mesa Multisectorial", codigo: "MM", verificacion: "Programas, invitaciones Actas firmadas (fotos)" },
  { num: 6, nombre: "Elaboración de la Propuesta Macro Curricular", codigo: "MC", verificacion: "Documento borrador revisado listo para la RAC" },
  { num: 7, nombre: "Reunión Académica de Carrera", codigo: "RAC", verificacion: "Convocatoria, reglamento, programa, actas firmadas." },
  { num: 8, nombre: "Validación Técnica", codigo: "VT", verificacion: "Documento (carta) revisado y entregado a la DSA." },
  { num: 9, nombre: "Validación Normativa", codigo: "VN", verificacion: "Documento preparado para la CA." },
  { num: 10, nombre: "Comisión Académica", codigo: "CA", verificacion: "Dictamen emanado para su homologación por el HCU" },
  { num: 11, nombre: "Honorable Consejo Universitario", codigo: "HCU", verificacion: "Resolución del HCU para adjuntar al documento de RC." },
  { num: 12, nombre: "Reunión Académica Nacional", codigo: "RAN", verificacion: "Resolución de aprobación del Rediseño Curricular." }
];

export default function DetalleCarrera({ carrera, onVolver, onDashboard }) {
  const { logout, token } = useAuth();
  const [progresoData, setProgresoData] = useState({});
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    cargarProgreso();
  }, []);

  const cargarProgreso = async () => {
    try {
      const data = await obtenerProgreso(carrera.carrera, carrera.sede, token);
      setProgresoData(data.fases || {});
    } catch (error) {
      toast.error('Error al cargar progreso');
    } finally {
      setLoading(false);
    }
  };

  const cargarHistorial = async () => {
    try {
      const data = await obtenerHistorial(carrera.carrera, carrera.sede, token);
      setHistorial(data);
      setMostrarHistorial(true);
    } catch (error) {
      toast.error('Error al cargar historial');
    }
  };

  const guardarCambios = async () => {
    setGuardando(true);
    try {
      await guardarProgreso(carrera.carrera, carrera.sede, progresoData, carrera.facultad, token);
      toast.success('Progreso guardado correctamente');
    } catch (error) {
      toast.error('Error al guardar progreso');
    } finally {
      setGuardando(false);
    }
  };

  const toggleFase = (faseNum) => {
    const nuevaData = { ...progresoData };
    if (!nuevaData[faseNum]) {
      nuevaData[faseNum] = { completado: true };
    } else if (typeof nuevaData[faseNum] === 'boolean') {
      nuevaData[faseNum] = { completado: !nuevaData[faseNum] };
    } else {
      nuevaData[faseNum] = { ...nuevaData[faseNum], completado: !nuevaData[faseNum].completado };
    }
    setProgresoData(nuevaData);
  };

  const setFecha = (faseNum, tipo, valor) => {
    const nuevaData = { ...progresoData };
    if (!nuevaData[faseNum]) {
      nuevaData[faseNum] = {};
    }
    if (typeof nuevaData[faseNum] === 'boolean') {
      nuevaData[faseNum] = { completado: nuevaData[faseNum] };
    }
    nuevaData[faseNum][tipo] = valor;
    setProgresoData(nuevaData);
  };

  const setObservacion = (faseNum, valor) => {
    const nuevaData = { ...progresoData };
    if (!nuevaData[faseNum]) {
      nuevaData[faseNum] = {};
    }
    if (typeof nuevaData[faseNum] === 'boolean') {
      nuevaData[faseNum] = { completado: nuevaData[faseNum] };
    }
    nuevaData[faseNum].observaciones = valor;
    setProgresoData(nuevaData);
  };

  const calcularProgreso = () => {
    const completadas = Object.keys(progresoData).filter(key => {
      const fase = progresoData[key];
      return fase === true || (typeof fase === 'object' && fase?.completado);
    }).length;
    return Math.round((completadas / 12) * 100);
  };

  const handleExportarPDF = () => {
    exportarPDF(carrera.carrera, carrera.sede, carrera.facultad, progresoData);
    toast.success('PDF exportado correctamente');
  };

  const handleExportarExcel = () => {
    exportarExcel(carrera.carrera, carrera.sede, carrera.facultad, progresoData);
    toast.success('Excel exportado correctamente');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  const progreso = calcularProgreso();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={onVolver}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver a carreras
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={cargarHistorial}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-lg text-purple-700 transition"
              >
                <History className="w-5 h-5" />
                Historial
              </button>
              <button
                onClick={handleExportarPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-700 transition"
              >
                <FileText className="w-5 h-5" />
                PDF
              </button>
              <button
                onClick={handleExportarExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 rounded-lg text-green-700 transition"
              >
                <Download className="w-5 h-5" />
                Excel
              </button>
              <button
                onClick={guardarCambios}
                disabled={guardando}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{carrera.carrera}</h1>
          <div className="flex items-center gap-4 text-gray-600 mb-4">
            <span className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {carrera.facultad}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {carrera.sede}
            </span>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progreso General</span>
              <span className="text-sm font-bold text-blue-600">{progreso}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Cronograma de Rediseño Curricular 2025
            </h2>
          </div>

          <div className="p-6 space-y-4">
            {FASES_CRONOGRAMA.map((fase) => {
              const faseData = progresoData[fase.num];
              const completado = faseData === true || (typeof faseData === 'object' && faseData?.completado);
              const fechaInicio = typeof faseData === 'object' ? faseData?.inicio : '';
              const fechaFin = typeof faseData === 'object' ? faseData?.fin : '';
              const observaciones = typeof faseData === 'object' ? faseData?.observaciones : '';

              return (
                <div 
                  key={fase.num}
                  className={`border rounded-lg p-4 transition-all ${
                    completado ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleFase(fase.num)}
                      className="mt-1 flex-shrink-0"
                    >
                      {completado ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {fase.num}. {fase.nombre}
                          </h3>
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1 font-mono">
                            {fase.codigo}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        <strong>Verificación:</strong> {fase.verificacion}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Fecha Inicio
                          </label>
                          <input
                            type="date"
                            value={fechaInicio || ''}
                            onChange={(e) => setFecha(fase.num, 'inicio', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs">
                          </label>
                          Fecha Conclusión
                          <input
                            type="date"
                            value={fechaFin || ''}
                            onChange={(e) => setFecha(fase.num, 'fin', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">
                          <MessageSquare className="w-4 h-4" />
                          Observaciones
                        </label>
                        <textarea
                          value={observaciones || ''}
                          onChange={(e) => setObservacion(fase.num, e.target.value)}
                          placeholder="Agregar observaciones o comentarios..."
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none"
                          rows="2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Responsable:</strong> M. Sc. Ing. Remberto Guerrero Torrejón - Dpto. Gestión Curricular
          </p>
        </div>
      </div>

      {mostrarHistorial && (
        <HistorialModal
          historial={historial}
          carrera={carrera.carrera}
          sede={carrera.sede}
          onClose={() => setMostrarHistorial(false)}
        />
      )}
    </div>
  );
}