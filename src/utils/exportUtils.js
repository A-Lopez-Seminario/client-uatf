import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const FASES_CRONOGRAMA = [
  { num: 1, nombre: "Organización en Comisión de Rediseño Curricular", codigo: "RC" },
  { num: 2, nombre: "Recolección de Documentos y Proyecto Curricular", codigo: "PC" },
  { num: 3, nombre: "Diagnóstico Inicial de la Carrera", codigo: "DI" },
  { num: 4, nombre: "Estudio de Contexto", codigo: "EC" },
  { num: 5, nombre: "Mesa Multisectorial", codigo: "MM" },
  { num: 6, nombre: "Elaboración de la Propuesta Macro Curricular", codigo: "MC" },
  { num: 7, nombre: "Reunión Académica de Carrera", codigo: "RAC" },
  { num: 8, nombre: "Validación Técnica", codigo: "VT" },
  { num: 9, nombre: "Validación Normativa", codigo: "VN" },
  { num: 10, nombre: "Comisión Académica", codigo: "CA" },
  { num: 11, nombre: "Honorable Consejo Universitario", codigo: "HCU" },
  { num: 12, nombre: "Reunión Académica Nacional", codigo: "RAN" }
];

// Exportar a PDF
export const exportarPDF = (carrera, sede, facultad, progresoData) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.setTextColor(30, 64, 175);
  doc.text('UATF Potosí', 105, 15, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Sistema de Gestión Curricular', 105, 22, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Carrera: ${carrera}`, 20, 35);
  doc.text(`Facultad: ${facultad}`, 20, 42);
  doc.text(`Sede: ${sede}`, 20, 49);
  doc.text(`Fecha: ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es })}`, 20, 56);
  
  // Calcular progreso
  const fasesCompletadas = Object.values(progresoData).filter(f => 
    f === true || (typeof f === 'object' && f?.completado)
  ).length;
  const porcentaje = Math.round((fasesCompletadas / 12) * 100);
  
  doc.setFontSize(10);
  doc.text(`Progreso General: ${porcentaje}%`, 20, 63);
  
  // Tabla de fases
  const tableData = FASES_CRONOGRAMA.map(fase => {
    const faseData = progresoData[fase.num];
    const completado = faseData === true || (typeof faseData === 'object' && faseData?.completado);
    const fechaInicio = typeof faseData === 'object' ? faseData?.inicio || '-' : '-';
    const fechaFin = typeof faseData === 'object' ? faseData?.fin || '-' : '-';
    const observaciones = typeof faseData === 'object' ? faseData?.observaciones || '-' : '-';
    
    return [
      fase.num,
      fase.codigo,
      fase.nombre,
      completado ? '✓' : '✗',
      fechaInicio,
      fechaFin,
      observaciones
    ];
  });
  
  doc.autoTable({
    startY: 70,
    head: [['#', 'Código', 'Fase', 'Estado', 'F. Inicio', 'F. Fin', 'Observaciones']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [30, 64, 175] },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 20 },
      2: { cellWidth: 50 },
      3: { cellWidth: 15 },
      4: { cellWidth: 25 },
      5: { cellWidth: 25 },
      6: { cellWidth: 45 }
    }
  });
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Guardar
  doc.save(`${carrera}_${sede}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

// Exportar a Excel
export const exportarExcel = (carrera, sede, facultad, progresoData) => {
  // Datos generales
  const infoGeneral = [
    ['UATF Potosí - Sistema de Gestión Curricular'],
    [''],
    ['Carrera:', carrera],
    ['Facultad:', facultad],
    ['Sede:', sede],
    ['Fecha de Reporte:', format(new Date(), "dd/MM/yyyy")],
    ['']
  ];
  
  // Headers de la tabla
  const headers = [['#', 'Código', 'Fase', 'Estado', 'Fecha Inicio', 'Fecha Fin', 'Observaciones']];
  
  // Datos de las fases
  const fasesData = FASES_CRONOGRAMA.map(fase => {
    const faseData = progresoData[fase.num];
    const completado = faseData === true || (typeof faseData === 'object' && faseData?.completado);
    const fechaInicio = typeof faseData === 'object' ? faseData?.inicio || '' : '';
    const fechaFin = typeof faseData === 'object' ? faseData?.fin || '' : '';
    const observaciones = typeof faseData === 'object' ? faseData?.observaciones || '' : '';
    
    return [
      fase.num,
      fase.codigo,
      fase.nombre,
      completado ? 'Completado' : 'Pendiente',
      fechaInicio,
      fechaFin,
      observaciones
    ];
  });
  
  // Combinar todos los datos
  const worksheetData = [...infoGeneral, ...headers, ...fasesData];
  
  // Crear worksheet
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Estilos (ancho de columnas)
  ws['!cols'] = [
    { wch: 5 },   // #
    { wch: 10 },  // Código
    { wch: 50 },  // Fase
    { wch: 15 },  // Estado
    { wch: 15 },  // Fecha Inicio
    { wch: 15 },  // Fecha Fin
    { wch: 40 }   // Observaciones
  ];
  
  // Crear workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Cronograma');
  
  // Guardar archivo
  XLSX.writeFile(wb, `${carrera}_${sede}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};

// Exportar reporte consolidado (todas las carreras)
export const exportarReporteConsolidado = (progresos) => {
  const headers = [['Facultad', 'Carrera', 'Sede', 'Progreso %', 'Fases Completadas', 'Última Actualización']];
  
  const data = progresos.map(prog => {
    const fasesMap = new Map(Object.entries(prog.fases || {}));
    const completadas = Array.from(fasesMap.values()).filter(f => 
      f === true || (typeof f === 'object' && f?.completado)
    ).length;
    const porcentaje = Math.round((completadas / 12) * 100);
    
    return [
      prog.facultad || '',
      prog.carrera,
      prog.sede,
      `${porcentaje}%`,
      `${completadas}/12`,
      prog.ultimaActualizacion ? format(new Date(prog.ultimaActualizacion), 'dd/MM/yyyy HH:mm') : ''
    ];
  });
  
  const worksheetData = [
    ['UATF Potosí - Reporte Consolidado'],
    ['Fecha:', format(new Date(), "dd/MM/yyyy HH:mm")],
    [''],
    ...headers,
    ...data
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  ws['!cols'] = [
    { wch: 40 }, // Facultad
    { wch: 40 }, // Carrera
    { wch: 15 }, // Sede
    { wch: 12 }, // Progreso
    { wch: 18 }, // Fases
    { wch: 20 }  // Fecha
  ];
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
  
  XLSX.writeFile(wb, `Reporte_Consolidado_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};