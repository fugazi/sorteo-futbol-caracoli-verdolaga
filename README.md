# Sorteo de Partidos - Caracolí Verdolaga

Sistema de sorteo aleatorio de partidos de Atlético Nacional para la temporada 2026.

## Descripción

Esta aplicación web permite realizar sorteos aleatorios de partidos de fútbol de Atlético Nacional para asignar entradas a participantes. Es una herramienta diseñada para la organización Caracolí Verdolaga, permitiendo gestionar listas de participantes y realizar sorteos justos y transparentes.

## Características Principales

- **Gestión de Participantes**: Agregar y eliminar participantes de forma dinámica
- **Sorteo Aleatorio**: Asignación aleatoria de partidos con animaciones visuales
- **Persistencia de Datos**: Los datos se guardan automáticamente en LocalStorage
- **Exportación a PDF**: Genera un documento PDF con los resultados del sorteo
- **Diseño Responsivo**: Interfaz adaptable a dispositivos móviles y desktop
- **Tema Oscuro/Claro**: Soporte para modo oscuro automático

## Tecnologías Utilizadas

### Frontend
- **Next.js 16** - Framework de React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Estilos utilitarios
- **shadcn/ui** - Componentes de interfaz
- **Framer Motion** - Animaciones fluidas
- **Lucide React** - Iconografía

### Backend
- **Next.js API Routes** - Endpoints del servidor
- **ReportLab (Python)** - Generación de PDF

## Estructura del Proyecto

```
sorteo-futbol-caracoli-verdolaga/
├── public/
│   └── logos/                    # Logos de los equipos
│       ├── Atletico_Nacional.jpg
│       ├── Alianza_FC.jpg
│       ├── Bucaramanga.jpg
│       ├── Cucuta_Deportivo.jpg
│       ├── Internacional.jpg
│       ├── Jaguares_FC.jpg
│       └── Llaneros.jpg
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── exportar-pdf/
│   │   │       └── route.ts      # API para generar PDF
│   │   ├── globals.css           # Estilos globales
│   │   ├── layout.tsx            # Layout principal
│   │   └── page.tsx              # Página principal
│   ├── components/
│   │   └── ui/                   # Componentes shadcn/ui
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── ...               # Otros componentes UI
│   ├── hooks/
│   │   └── use-toast.ts          # Hook de toasts
│   └── lib/
│       └── utils.ts               # Utilidades
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## Partidos Disponibles (Temporada 2026)

| No. | Fecha | Rival |
|-----|-------|-------|
| 1 | Sábado, 21 de Febrero | Alianza FC |
| 2 | Viernes, 13 de Marzo | Llaneros FC |
| 3 | Sábado, 21 de Marzo | Internacional de Bogotá |
| 4 | Miércoles, 1 de Abril | Cúcuta Deportivo |
| 5 | Lunes, 6 de Abril | Jaguares de Córdoba |
| 6 | Lunes, 20 de Abril | Atlético Bucaramanga |

Todos los partidos se juegan en el **Estadio Atanasio Girardot**.

## Instalación y Ejecución

### Prerrequisitos
- Node.js 18+
- pnpm (gestor de paquetes)
- Python 3 con ReportLab instalado

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Instalar dependencias
pnpm install

# Instalar ReportLab para generación de PDF
pip3 install reportlab --break-system-packages
```

### Ejecución

```bash
# Modo desarrollo
pnpm dev

# Verificar calidad de código
pnpm lint

# Construir para producción
pnpm build
```

## Uso de la Aplicación

1. **Agregar Participantes**
   - Escribe el nombre en el campo de entrada
   - Presiona Enter o haz clic en el botón "+"
   - Los participantes se numeran automáticamente

2. **Realizar Sorteo**
   - Haz clic en "Realizar Sorteo"
   - Los partidos se asignarán aleatoriamente
   - Se mostrará una animación progresiva de los resultados

3. **Ver Resultados**
   - Los ganadores aparecen en tarjetas doradas
   - Los participantes sin asignación se listan al final
   - Los partidos asignados se marcan con "Asignado"

4. **Exportar a PDF**
   - Después del sorteo, haz clic en "Exportar a PDF"
   - Se descargará un documento con todos los resultados

5. **Reiniciar**
   - "Nuevo Sorteo": Mantiene participantes, reinicia resultados
   - "Reiniciar Todo": Borra todos los datos

## API Endpoints

### POST /api/exportar-pdf

Genera un archivo PDF con los resultados del sorteo.

**Request Body:**
```json
{
  "resultados": [
    {
      "participante": { "id": "string", "nombre": "string" },
      "partido": {
        "id": number,
        "fecha": "string",
        "rival": "string",
        "estadio": "string"
      }
    }
  ],
  "sinPartido": [{ "id": "string", "nombre": "string" }],
  "participantes": [{ "id": "string", "nombre": "string" }],
  "fecha": "string"
}
```

**Response:** Archivo PDF descargable

## Almacenamiento Local

La aplicación utiliza LocalStorage para persistir datos:

| Clave | Descripción |
|-------|-------------|
| `nacional-participantes` | Lista de participantes |
| `nacional-resultados` | Resultados del último sorteo |
| `nacional-sorteo-realizado` | Estado del sorteo |

## Personalización

### Modificar Partidos

Edita el array `PARTIDOS` en `src/app/page.tsx`:

```typescript
const PARTIDOS = [
  {
    id: 1,
    fecha: 'Fecha del partido',
    rival: 'Nombre del rival',
    logoRival: '/logos/archivo_logo.jpg',
    estadio: 'Nombre del estadio',
  },
  // ... más partidos
]
```

### Cambiar Colores

Los colores principales se basan en:
- **Verde Esmeralda**: `emerald-*` (primario)
- **Ámbar**: `amber-*` (ganadores)
- **Slate**: `slate-*` (fondos y texto)

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia servidor de desarrollo |
| `pnpm build` | Construye para producción |
| `pnpm lint` | Verifica calidad del código |
| `pnpm db:push` | Sincroniza schema de Prisma |

## Dependencias Principales

```json
{
  "next": "^16.1.1",
  "react": "^19.0.0",
  "framer-motion": "^12.23.2",
  "lucide-react": "^0.525.0",
  "tailwindcss": "^4"
}
```

## Notas

- La carpeta `.next/` se genera al ejecutar `pnpm build`
- La carpeta `node_modules/` se genera al ejecutar `pnpm install`
- Este proyecto usa LocalStorage para persistencia (no requiere base de datos)

## Autor

**Douglas Fugazi**
- Website: [https://douglasfugazi.co](https://douglasfugazi.co)

## Licencia

Este proyecto es de uso interno para Caracolí Verdolaga.

---

**Atlético Nacional** - El Rey de Copas, el Más Grande de Colombia
