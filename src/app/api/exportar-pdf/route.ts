import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFile, readFile, unlink, mkdir } from 'fs/promises'
import path from 'path'
import os from 'os'

const execAsync = promisify(exec)

// Use venv Python if available, otherwise fall back to system python3
const PYTHON_BIN = path.join(process.cwd(), '.venv', 'bin', 'python3')

interface ResultadoSorteo {
  participante: {
    id: string
    nombre: string
  }
  partido: {
    id: number
    fecha: string
    rival: string
    estadio: string
  }
}

interface ExportData {
  resultados: ResultadoSorteo[]
  sinPartido: { id: string; nombre: string }[]
  participantes: { id: string; nombre: string }[]
  fecha: string
}

export async function POST(request: NextRequest) {
  let pyFile = ''
  let pdfFile = ''
  
  try {
    const data: ExportData = await request.json()
    
    // Crear directorio temporal si no existe
    const tmpDir = path.join(os.tmpdir(), 'sorteo_nacional')
    await mkdir(tmpDir, { recursive: true })
    
    // Crear archivos con nombres únicos
    const timestamp = Date.now()
    pyFile = path.join(tmpDir, `generate_pdf_${timestamp}.py`)
    pdfFile = path.join(tmpDir, `sorteo_${timestamp}.pdf`)
    
    // Escapar datos para Python
    const resultadosJson = JSON.stringify(data.resultados).replace(/'/g, "\\'").replace(/"/g, '\\"')
    const sinPartidoJson = JSON.stringify(data.sinPartido).replace(/'/g, "\\'").replace(/"/g, '\\"')
    const participantesJson = JSON.stringify(data.participantes).replace(/'/g, "\\'").replace(/"/g, '\\"')
    const fechaStr = data.fecha.replace(/'/g, "\\'")
    const pdfPath = pdfFile.replace(/\\/g, '\\\\')
    
    const pythonCode = `# -*- coding: utf-8 -*-
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
import json

# Registrar fuentes
try:
    pdfmetrics.registerFont(TTFont('Times', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
    registerFontFamily('Times', normal='Times', bold='Times')
except:
    pass

# Datos
resultados = json.loads('${resultadosJson}')
sin_partido = json.loads('${sinPartidoJson}')
participantes = json.loads('${participantesJson}')
fecha = '${fechaStr}'

# Crear documento
doc = SimpleDocTemplate(
    '${pdfPath}',
    pagesize=letter,
    title='Sorteo_Partidos_Nacional',
    author='Z.ai',
    creator='Z.ai',
    subject='Resultado del sorteo de partidos de Atletico Nacional'
)

story = []
styles = getSampleStyleSheet()

# Estilos personalizados
title_style = ParagraphStyle(
    'CustomTitle',
    parent=styles['Heading1'],
    fontSize=24,
    alignment=TA_CENTER,
    spaceAfter=12,
    textColor=colors.HexColor('#065f46')
)

subtitle_style = ParagraphStyle(
    'CustomSubtitle',
    parent=styles['Normal'],
    fontSize=14,
    alignment=TA_CENTER,
    spaceAfter=20,
    textColor=colors.HexColor('#047857')
)

header_style = ParagraphStyle(
    'HeaderStyle',
    parent=styles['Heading2'],
    fontSize=16,
    alignment=TA_CENTER,
    spaceBefore=20,
    spaceAfter=12,
    textColor=colors.HexColor('#92400e')
)

normal_style = ParagraphStyle(
    'CustomNormal',
    parent=styles['Normal'],
    fontSize=11,
    alignment=TA_CENTER,
    spaceAfter=6
)

cell_style = ParagraphStyle(
    'CellStyle',
    parent=styles['Normal'],
    fontSize=10,
    alignment=TA_CENTER
)

# Titulo principal
story.append(Paragraph('<b>Sorteo de Partidos</b>', title_style))
story.append(Paragraph('<b>Caracoli Verdolaga - Temporada 2026</b>', subtitle_style))
story.append(Paragraph('Atletico Nacional', normal_style))
story.append(Paragraph('Estadio Atanasio Girardot', normal_style))
story.append(Paragraph('Fecha del sorteo: ' + fecha, normal_style))
story.append(Spacer(1, 20))

# Seccion de ganadores
story.append(Paragraph('<b>Ganadores del Sorteo</b>', header_style))

# Datos de la tabla de ganadores
ganadores_data = [
    [Paragraph('<b>No.</b>', cell_style), Paragraph('<b>Nombre</b>', cell_style), Paragraph('<b>Partido</b>', cell_style), Paragraph('<b>Fecha</b>', cell_style)]
]

for i, r in enumerate(resultados, 1):
    partido_text = 'Atletico Nacional vs ' + r['partido']['rival']
    ganadores_data.append([
        Paragraph(str(i), cell_style),
        Paragraph(r['participante']['nombre'], cell_style),
        Paragraph(partido_text, cell_style),
        Paragraph(r['partido']['fecha'], cell_style)
    ])

table = Table(ganadores_data, colWidths=[0.6*inch, 1.5*inch, 2.5*inch, 1.8*inch])
table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#065f46')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('FONTSIZE', (0, 0), (-1, -1), 10),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0fdf4')])
]))
story.append(table)
story.append(Spacer(1, 20))

# Participantes sin asignacion
if sin_partido and len(sin_partido) > 0:
    story.append(Paragraph('<b>Sin Asignacion</b>', header_style))
    
    sin_asignacion_data = [[Paragraph('<b>Nombre</b>', cell_style)]]
    for p in sin_partido:
        sin_asignacion_data.append([Paragraph(p['nombre'], cell_style)])
    
    table2 = Table(sin_asignacion_data, colWidths=[4*inch])
    table2.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#78716c')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ]))
    story.append(table2)
    story.append(Spacer(1, 20))

# Resumen
story.append(Paragraph('<b>Resumen</b>', header_style))
story.append(Paragraph('Total de participantes: ' + str(len(participantes)), normal_style))
story.append(Paragraph('Ganadores con partido asignado: ' + str(len(resultados)), normal_style))
story.append(Paragraph('Participantes sin asignacion: ' + str(len(sin_partido)), normal_style))
story.append(Spacer(1, 30))

# Footer
story.append(Paragraph('---', normal_style))
story.append(Paragraph('Pagina web desarrollada por Douglas Fugazi', normal_style))
story.append(Paragraph('https://douglasfugazi.co', normal_style))

# Construir PDF
doc.build(story)
print('PDF_GENERADO_OK')
`

    // Escribir archivo Python
    await writeFile(pyFile, pythonCode, 'utf-8')
    
    // Ejecutar el script Python
    const { stdout, stderr } = await execAsync(`"${PYTHON_BIN}" "${pyFile}"`, {
      timeout: 30000,
      maxBuffer: 1024 * 1024 * 10
    })
    
    if (stderr && !stderr.includes('PDF_GENERADO_OK')) {
      console.error('Python stderr:', stderr)
    }
    
    // Verificar que el PDF existe
    try {
      await readFile(pdfFile)
    } catch {
      throw new Error('El archivo PDF no fue generado correctamente')
    }
    
    // Leer el PDF generado
    const pdfBuffer = await readFile(pdfFile)
    
    // Limpiar archivos temporales
    try {
      await unlink(pyFile)
      await unlink(pdfFile)
    } catch {
      // Ignorar errores de limpieza
    }
    
    // Retornar el PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="sorteo_nacional_${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generando PDF:', error)
    
    // Limpiar archivos temporales en caso de error
    if (pyFile) {
      try { await unlink(pyFile) } catch {}
    }
    if (pdfFile) {
      try { await unlink(pdfFile) } catch {}
    }
    
    return NextResponse.json(
      { error: 'Error al generar el PDF: ' + (error instanceof Error ? error.message : 'Error desconocido') },
      { status: 500 }
    )
  }
}
