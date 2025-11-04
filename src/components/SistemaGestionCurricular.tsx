// @ts-nocheck
import logoUATF from '../assets/logo-uatf.png';
import React, { useState, useEffect } from 'react';
import { Lock, User, LogOut, BookOpen, MapPin, Calendar, CheckCircle2, Circle, Building2, GraduationCap, Clock } from 'lucide-react';

const CARRERAS_DATA = [
  // POTOSÍ
  { facultad: "Facultad de Artes", carrera: "Artes Musicales", sede: "Potosí", duracion: "5 Años", titulo: "Lic. en Artes Musicales" },
  { facultad: "Facultad de Artes", carrera: "Artes Plásticas", sede: "Potosí", duracion: "5 Años", titulo: "Lic. en Artes Plásticas" },
  { facultad: "Facultad de Artes", carrera: "Arquitectura", sede: "Potosí", duracion: "10 Semestres", titulo: "Arquitecto" },
  { facultad: "Facultad de Ciencias Agrícolas y Pecuarias", carrera: "Ingeniería Agronómica", sede: "Potosí", duracion: "9 Semestres", titulo: "Ingeniero Agrónomo" },
  { facultad: "Facultad de Ciencias Agrícolas y Pecuarias", carrera: "Ingeniería Agroindustrial", sede: "Potosí", duracion: "9 Semestres", titulo: "Ingeniero Agroindustrial" },
  { facultad: "Facultad de Ciencias Agrícolas y Pecuarias", carrera: "Ingeniería en Desarrollo Rural", sede: "Potosí", duracion: "9 Semestres", titulo: "Ingeniero en Desarrollo Rural" },
  { facultad: "Facultad de Ciencias Económicas, Financieras y Administrativas", carrera: "Administración de Empresas", sede: "Potosí", duracion: "10 Semestres", titulo: "Administrador de Empresas" },
  { facultad: "Facultad de Ciencias Económicas, Financieras y Administrativas", carrera: "Auditoría - Contaduría Pública", sede: "Potosí", duracion: "10 Semestres", titulo: "Auditor Financiero" },
  { facultad: "Facultad de Ciencias Económicas, Financieras y Administrativas", carrera: "Contabilidad y Finanzas", sede: "Potosí", duracion: "8 Semestres", titulo: "Contador Financiero" },
  { facultad: "Facultad de Ciencias Económicas, Financieras y Administrativas", carrera: "Ingeniería Comercial", sede: "Potosí", duracion: "9 Semestres", titulo: "Ingeniero Comercial" },
  { facultad: "Facultad de Ciencias Económicas, Financieras y Administrativas", carrera: "Economía", sede: "Potosí", duracion: "10 Semestres", titulo: "Economista" },
  { facultad: "Facultad de Ciencias Puras", carrera: "Estadística", sede: "Potosí", duracion: "8 Semestres", titulo: "Lic. en Estadística" },
  { facultad: "Facultad de Ciencias Puras", carrera: "Física", sede: "Potosí", duracion: "10 Semestres", titulo: "Lic. en Física" },
  { facultad: "Facultad de Ciencias Puras", carrera: "Ingeniería Informática", sede: "Potosí", duracion: "8 Semestres", titulo: "Ingeniero Informático" },
  { facultad: "Facultad de Ciencias Puras", carrera: "Matemática", sede: "Potosí", duracion: "10 Semestres", titulo: "Lic. en Matemática" },
  { facultad: "Facultad de Ciencias Puras", carrera: "Ciencias Químicas", sede: "Potosí", duracion: "10 Semestres", titulo: "Lic. en Ciencias Químicas" },
  { facultad: "Facultad de Ciencias Sociales y Humanísticas", carrera: "Lingüística e Idiomas", sede: "Potosí", duracion: "5 Años", titulo: "Lic. en Lingüística e Idiomas" },
  { facultad: "Facultad de Ciencias Sociales y Humanísticas", carrera: "Trabajo Social", sede: "Potosí", duracion: "8 Semestres", titulo: "Lic. en Trabajo Social" },
  { facultad: "Facultad de Ciencias Sociales y Humanísticas", carrera: "Turismo", sede: "Potosí", duracion: "9 Semestres", titulo: "Lic. en Turismo" },
  { facultad: "Facultad de Ciencias Sociales y Humanísticas", carrera: "Ciencias de la Comunicación", sede: "Potosí", duracion: "9 Semestres", titulo: "Lic. en Ciencias de la Comunicación" },
  { facultad: "Facultad de Derecho", carrera: "Derecho", sede: "Potosí", duracion: "4 Años", titulo: "Abogado" },
  { facultad: "Facultad de Ingeniería", carrera: "Construcciones Civiles", sede: "Potosí", duracion: "6 Semestres", titulo: "Tec. Univ. Sup. en Const. Civiles" },
  { facultad: "Facultad de Ingeniería", carrera: "Ingeniería Civil", sede: "Potosí", duracion: "10 Semestres", titulo: "Ingeniero Civil" },
  { facultad: "Facultad de Ingeniería", carrera: "Ingeniería en Geodesia y Topografía", sede: "Potosí", duracion: "5 Años", titulo: "Ingeniero en Geodesia y Topografía" },
  { facultad: "Facultad de Ingeniería Geológica", carrera: "Ingeniería Geológica", sede: "Potosí", duracion: "10 Semestres", titulo: "Ingeniero Geólogo" },
  { facultad: "Facultad de Ingeniería Geológica", carrera: "Ingeniería Ambiental", sede: "Potosí", duracion: "10 Semestres", titulo: "Ingeniero Ambiental" },
  { facultad: "Facultad de Ingeniería Minera", carrera: "Ingeniería de Minas", sede: "Potosí", duracion: "10 Semestres", titulo: "Ingeniero de Minas" },
  { facultad: "Facultad de Ingeniería Minera", carrera: "Ingeniería de Procesos de M.P.M.", sede: "Potosí", duracion: "10 Semestres", titulo: "Ingeniero de Procesos MPM" },
  { facultad: "Facultad de Ingeniería Tecnológica", carrera: "Ingeniería Eléctrica", sede: "Potosí", duracion: "9 Semestres", titulo: "Ingeniero Eléctrico" },
  { facultad: "Facultad de Ingeniería Tecnológica", carrera: "Ingeniería Electrónica", sede: "Potosí", duracion: "9 Semestres", titulo: "Ingeniero Electrónico" },
  { facultad: "Facultad de Ingeniería Tecnológica", carrera: "Ingeniería Mecánica", sede: "Potosí", duracion: "9 Semestres", titulo: "Ingeniero Mecánico" },
  { facultad: "Facultad de Ingeniería Tecnológica", carrera: "Ingeniería Mecatrónica", sede: "Potosí", duracion: "9 Semestres", titulo: "Ingeniero Mecatrónica" },
  { facultad: "Facultad de Ingeniería Tecnológica", carrera: "Ingeniería Industrial", sede: "Potosí", duracion: "9 Semestres", titulo: "Ingeniero Industrial" },
  { facultad: "Facultad de Ingeniería Tecnológica", carrera: "Mecánica Automotriz", sede: "Potosí", duracion: "5 Semestres", titulo: "Tec. Univ. Sup. en Mec. Automotriz" },
  { facultad: "Facultad de Ciencias de la Salud", carrera: "Enfermería", sede: "Potosí", duracion: "5 Años", titulo: "Lic. en Enfermería" },
  { facultad: "Facultad de Ciencias de la Salud", carrera: "Auxiliar de Enfermería", sede: "Potosí", duracion: "2 Años", titulo: "Técnico Univ. Medio Auxiliar de Enfermería" },
  { facultad: "Facultad de Medicina", carrera: "Medicina", sede: "Potosí", duracion: "6 Años", titulo: "Médico Cirujano" },
  { facultad: "Vicerrectorado", carrera: "Ingeniería de Sistemas", sede: "Potosí", duracion: "9 Semestres", titulo: "Ingeniero en Sistemas" },
  { facultad: "Vicerrectorado", carrera: "Ingeniería en Diseño y Programación Digital", sede: "Potosí", duracion: "9 Semestres", titulo: "Ingeniero en Diseño y Programación Digital" },
  { facultad: "Vicerrectorado", carrera: "Odontología", sede: "Potosí", duracion: "5 Años", titulo: "Odontólogo" },
  
  // TUPIZA
  { facultad: "Facultad de Ciencias Agrícolas y Pecuarias", carrera: "Medicina Veterinaria y Zootecnia", sede: "Tupiza", duracion: "10 Semestres", titulo: "Médico Veterinario y Zootecnista" },
  { facultad: "Facultad de Ciencias Económicas, Financieras y Administrativas", carrera: "Contaduría Pública - Auditoría", sede: "Tupiza", duracion: "10 Semestres", titulo: "Auditor Financiero" },
  { facultad: "Facultad de Derecho", carrera: "Derecho", sede: "Tupiza", duracion: "4 Años", titulo: "Abogado" },
  { facultad: "Vicerrectorado", carrera: "Ingeniería de Sistemas", sede: "Tupiza", duracion: "9 Semestres", titulo: "Ingeniero en Sistemas" },
  { facultad: "Facultad de Ciencias Sociales y Humanísticas", carrera: "Escuela de Idiomas", sede: "Tupiza", duracion: "5 Años", titulo: "Lic. en Lingüística e Idiomas" },
  
  // UNCÍA
  { facultad: "Facultad de Ciencias Económicas, Financieras y Administrativas", carrera: "Economía", sede: "Uncía", duracion: "10 Semestres", titulo: "Economista" },
  { facultad: "Facultad de Ciencias Sociales y Humanísticas", carrera: "Trabajo Social", sede: "Uncía", duracion: "4 Años", titulo: "Lic. en Trabajo Social" },
  { facultad: "Facultad de Derecho", carrera: "Derecho", sede: "Uncía", duracion: "4 Años", titulo: "Abogado" },
  { facultad: "Facultad de Ciencias Sociales y Humanísticas", carrera: "Lingüística e Idiomas", sede: "Uncía", duracion: "5 Años", titulo: "Lic. en Lingüística e Idiomas" },
  
  // UYUNI
  { facultad: "Facultad de Ciencias Económicas, Financieras y Administrativas", carrera: "Economía", sede: "Uyuni", duracion: "10 Semestres", titulo: "Economista" },
  { facultad: "Facultad de Ciencias Sociales y Humanísticas", carrera: "Lingüística e Idiomas", sede: "Uyuni", duracion: "5 Años", titulo: "Lic. en Lingüística e Idiomas" },
  { facultad: "Facultad de Ciencias Sociales y Humanísticas", carrera: "Turismo", sede: "Uyuni", duracion: "9 Semestres", titulo: "Lic. en Turismo" },
  { facultad: "Facultad de Ciencias Puras", carrera: "Ciencias Químicas", sede: "Uyuni", duracion: "10 Semestres", titulo: "Lic. en Ciencias Químicas" },
  
  // VILLAZÓN
  { facultad: "Facultad de Ciencias Agrícolas y Pecuarias", carrera: "Ingeniería Agropecuaria", sede: "Villazón", duracion: "9 Semestres", titulo: "Ingeniero Agropecuario" },
  { facultad: "Facultad de Ciencias Agrícolas y Pecuarias", carrera: "Técnico Superior de Agropecuaria", sede: "Villazón", duracion: "6 Semestres", titulo: "Tec. Univ. Sup. en Agropecuaria" },
  { facultad: "Facultad de Ciencias de la Salud", carrera: "Enfermería", sede: "Villazón", duracion: "5 Años", titulo: "Lic. en Enfermería" },
  { facultad: "Facultad de Ciencias Económicas, Financieras y Administrativas", carrera: "Comercio Internacional", sede: "Villazón", duracion: "10 Semestres", titulo: "Lic. en Comercio Internacional" },
  
  // LLICA
  { facultad: "Facultad de Ciencias de la Salud", carrera: "Auxiliar de Enfermería", sede: "Llica", duracion: "2 Años", titulo: "Técnico Univ. Medio Auxiliar de Enfermería" },
  
  // SAN CRISTÓBAL
  { facultad: "Facultad de Ingeniería Tecnológica", carrera: "Ingeniería Eléctrica", sede: "San Cristóbal", duracion: "9 Semestres", titulo: "Ingeniero Eléctrico" },
  { facultad: "Facultad de Ingeniería Tecnológica", carrera: "Ingeniería Mecánica", sede: "San Cristóbal", duracion: "9 Semestres", titulo: "Ingeniero Mecánico" },
  { facultad: "Facultad de Ingeniería Tecnológica", carrera: "Mecánica Automotriz", sede: "San Cristóbal", duracion: "6 Semestres", titulo: "Tec. Univ. Sup. en Mec. Automotriz" },
  
  // RÍO GRANDE
  { facultad: "Facultad de Ciencias Económicas, Financieras y Administrativas", carrera: "Administración de Empresas", sede: "Río Grande", duracion: "10 Semestres", titulo: "Administrador de Empresas" }
];

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

export default function SistemaGestionCurricular() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedCarrera, setSelectedCarrera] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [progresoCarreras, setProgresoCarreras] = useState({});
  const [viewMode, setViewMode] = useState('sedes');
  const [selectedSede, setSelectedSede] = useState(null);

  useEffect(() => {
    loadProgreso();
  }, []);

  const loadProgreso = async () => {
    try {
      const result = await window.storage.get('progreso-carreras');
      if (result) {
        setProgresoCarreras(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('No hay progreso guardado');
    }
  };

  const saveProgreso = async (newProgreso) => {
    try {
      await window.storage.set('progreso-carreras', JSON.stringify(newProgreso));
      setProgresoCarreras(newProgreso);
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleLogin = () => {
    if (username === 'admin' && password === 'uatf2025') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setSelectedCarrera(null);
    setSelectedSede(null);
  };

  const getCarreraKey = (carrera) => {
    return `${carrera.carrera}-${carrera.sede}`;
  };

  const toggleFase = (carreraKey, faseNum) => {
    const newProgreso = { ...progresoCarreras };
    if (!newProgreso[carreraKey]) {
      newProgreso[carreraKey] = {};
    }
    newProgreso[carreraKey][faseNum] = !newProgreso[carreraKey][faseNum];
    saveProgreso(newProgreso);
  };

  const setFechas = (carreraKey, faseNum, tipo, fecha) => {
    const newProgreso = { ...progresoCarreras };
    if (!newProgreso[carreraKey]) {
      newProgreso[carreraKey] = {};
    }
    if (!newProgreso[carreraKey][faseNum]) {
      newProgreso[carreraKey][faseNum] = {};
    }
    if (typeof newProgreso[carreraKey][faseNum] === 'boolean') {
      newProgreso[carreraKey][faseNum] = { completado: newProgreso[carreraKey][faseNum] };
    }
    newProgreso[carreraKey][faseNum][tipo] = fecha;
    saveProgreso(newProgreso);
  };

  const calcularProgreso = (carreraKey) => {
    const progreso = progresoCarreras[carreraKey] || {};
    const completadas = Object.keys(progreso).filter(key => {
      const fase = progreso[key];
      return fase === true || (typeof fase === 'object' && fase.completado);
    }).length;
    return Math.round((completadas / FASES_CRONOGRAMA.length) * 100);
  };

  const getSedes = () => {
    const sedes = [...new Set(CARRERAS_DATA.map(c => c.sede))];
    return sedes.sort();
  };

  const getCarrerasPorSede = (sede) => {
    return CARRERAS_DATA.filter(c => c.sede === sede);
  };

  const getEstadisticasSede = (sede) => {
    const carreras = getCarrerasPorSede(sede);
    let totalProgreso = 0;
    carreras.forEach(carrera => {
      const key = getCarreraKey(carrera);
      totalProgreso += calcularProgreso(key);
    });
    return {
      total: carreras.length,
      promedioProgreso: carreras.length > 0 ? Math.round(totalProgreso / carreras.length) : 0
    };
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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <img
                  src={logoUATF}
                  alt="Logo UATF"
                  className="w-24 h-24 mx-auto mb-4 rounded-full shadow-md border border-gray-200"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">UATF POTOSI</h1>
            <p className="text-gray-600">Sistema de Gestión Curricular</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  placeholder="Ingrese usuario"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  placeholder="Ingrese contraseña"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg"
            >
              Iniciar Sesión
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Credenciales demo:</p>
            <p className="font-mono text-xs mt-1">admin / uatf2025</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCarrera) {
    const carreraKey = getCarreraKey(selectedCarrera);
    const progreso = calcularProgreso(carreraKey);

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <button
              onClick={() => {
                setSelectedCarrera(null);
              }}
              className="text-black-600 hover:text-red-700 font-medium flex items-center gap-2"
            >
              ← Volver
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <LogOut className="w-5 h-5" />
              Salir
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">{selectedCarrera.carrera}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen className="w-5 h-5" />
                <span className="text-sm">{selectedCarrera.facultad}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">{selectedCarrera.sede}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span className="text-sm">Duración: {selectedCarrera.duracion}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <GraduationCap className="w-5 h-5" />
                <span className="text-sm">{selectedCarrera.titulo}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progreso General</span>
                <span className="text-sm font-bold text-green-600">{progreso}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progreso}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-green-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Cronograma de Rediseño Curricular 2025
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {FASES_CRONOGRAMA.map((fase) => {
                const faseData = progresoCarreras[carreraKey]?.[fase.num];
                const completado = faseData === true || (typeof faseData === 'object' && faseData?.completado);
                const fechaInicio = typeof faseData === 'object' ? faseData?.inicio : '';
                const fechaFin = typeof faseData === 'object' ? faseData?.fin : '';

                return (
                  <div 
                    key={fase.num}
                    className={`border rounded-lg p-4 transition-all ${
                      completado ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleFase(carreraKey, fase.num)}
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
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1 font-mono">
                              {fase.codigo}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          <strong>Verificación:</strong> {fase.verificacion}
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Fecha Inicio
                            </label>
                            <input
                              type="date"
                              value={fechaInicio || ''}
                              onChange={(e) => setFechas(carreraKey, fase.num, 'inicio', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Fecha Conclusión
                            </label>
                            <input
                              type="date"
                              value={fechaFin || ''}
                              onChange={(e) => setFechas(carreraKey, fase.num, 'fin', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Responsable:</strong> M. Sc. Ing. Remberto Guerrero Torrejón - Dpto. Gestión Curricular
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Vista de selección de sede
  if (selectedSede && !selectedCarrera) {
    const carrerasSede = getCarrerasPorSede(selectedSede);
    const groupedCarreras = carrerasSede.reduce((acc, carrera) => {
      if (!acc[carrera.facultad]) {
        acc[carrera.facultad] = [];
      }
      acc[carrera.facultad].push(carrera);
      return acc;
    }, {});

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setSelectedSede(null)}
                className="text-black-600 hover:text-red-700 font-medium flex items-center gap-2"
              >
                ← Volver a sedes
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-red-200 rounded-lg text-gray-700 transition"
              >
                <LogOut className="w-5 h-5" />
                Cerrar Sesión
              </button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-600 p-3 rounded-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Sede {selectedSede}</h1>
                <p className="text-gray-600 text-sm">{carrerasSede.length} carreras disponibles</p>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {Object.keys(groupedCarreras).sort().map((facultad) => (
            <div key={facultad} className="mb-8">
              <h3 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b-2 border-red-600">
                {facultad}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedCarreras[facultad].map((carrera, idx) => {
                  const carreraKey = getCarreraKey(carrera);
                  const progreso = calcularProgreso(carreraKey);

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedCarrera(carrera)}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-5 text-left border border-gray-200 hover:border-red-400"
                    >
                      <h4 className="font-semibold text-gray-800 mb-3">{carrera.carrera}</h4>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{carrera.duracion}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <GraduationCap className="w-4 h-4" />
                          <span className="text-xs">{carrera.titulo}</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">Progreso RC</span>
                          <span className="text-xs font-bold text-red-600">{progreso}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full transition-all"
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
        </div>
      </div>
    );
  }

  // Vista principal con sedes
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4"> 
            <img
                src={logoUATF}
                alt="Logo UATF"
                className="w-12 h-12 rounded-full border border-gray-200 shadow-sm"
            />
  <div>
    <h1 className="text-2xl font-bold text-gray-800">UATF POTOSI</h1>
    <p className="text-gray-600 text-sm">Sistema de Gestión Curricular</p>
  </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setViewMode('sedes')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                viewMode === 'sedes'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vista por Sedes
            </button>
            <button
              onClick={() => setViewMode('carreras')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                viewMode === 'carreras'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vista por Carreras
            </button>
          </div>

          {viewMode === 'carreras' && (
            <input
              type="text"
              placeholder="Buscar carrera, facultad o sede..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {viewMode === 'sedes' ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Sedes Universitarias
              </h2>
              <p className="text-gray-600 text-sm">
                Seleccione una sede para ver las carreras disponibles
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getSedes().map((sede) => {
                const stats = getEstadisticasSede(sede);
                return (
                  <button
                    key={sede}
                    onClick={() => setSelectedSede(sede)}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-6 text-left border-2 border-transparent hover:border-red-400"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-red-100 p-3 rounded-lg">
                        <Building2 className="w-8 h-8 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {sede}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {stats.total} {stats.total === 1 ? 'carrera' : 'carreras'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Progreso promedio</span>
                        <span className="text-sm font-bold text-black-600">{stats.promedioProgreso}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-red-600 h-2.5 rounded-full transition-all"
                          style={{ width: `${stats.promedioProgreso}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Todas las Carreras ({filteredCarreras.length})
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
                        onClick={() => setSelectedCarrera(carrera)}
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
          </>
        )}
      </div>
    </div>
  );
}