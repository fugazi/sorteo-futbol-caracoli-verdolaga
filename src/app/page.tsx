'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shuffle, 
  UserPlus, 
  Trash2, 
  Calendar, 
  MapPin, 
  Sparkles,
  Users,
  CheckCircle2,
  XCircle,
  RotateCcw,
  PartyPopper,
  Loader2,
  Crown,
  FileDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Datos de los partidos - Temporada 2026
const PARTIDOS = [
  {
    id: 1,
    fecha: 'Sábado, 21 de Febrero',
    rival: 'Alianza FC',
    logoRival: '/logos/Alianza_FC.jpg',
    estadio: 'Estadio Atanasio Girardot',
  },
  {
    id: 2,
    fecha: 'Viernes, 13 de Marzo',
    rival: 'Llaneros FC',
    logoRival: '/logos/Llaneros.jpg',
    estadio: 'Estadio Atanasio Girardot',
  },
  {
    id: 3,
    fecha: 'Sábado, 21 de Marzo',
    rival: 'Internacional de Bogotá',
    logoRival: '/logos/Internacional.jpg',
    estadio: 'Estadio Atanasio Girardot',
  },
  {
    id: 4,
    fecha: 'Miércoles, 1 de Abril',
    rival: 'Cúcuta Deportivo',
    logoRival: '/logos/Cucuta_Deportivo.jpg',
    estadio: 'Estadio Atanasio Girardot',
  },
  {
    id: 5,
    fecha: 'Lunes, 6 de Abril',
    rival: 'Jaguares de Córdoba',
    logoRival: '/logos/Jaguares_FC.jpg',
    estadio: 'Estadio Atanasio Girardot',
  },
  {
    id: 6,
    fecha: 'Lunes, 20 de Abril',
    rival: 'Atlético Bucaramanga',
    logoRival: '/logos/Bucaramanga.jpg',
    estadio: 'Estadio Atanasio Girardot',
  },
]

const LOGO_NACIONAL = '/logos/Atletico_Nacional.jpg'

interface Participante {
  id: string
  nombre: string
  partidoAsignado?: typeof PARTIDOS[0]
}

interface ResultadoSorteo {
  participante: Participante
  partido: typeof PARTIDOS[0]
}

// Placeholder para cuando fallan las imágenes
const LogoPlaceholder = ({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-[8px]',
    md: 'w-11 h-11 text-xs',
    lg: 'w-14 h-14 text-sm'
  }
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center shadow-sm`}>
      <span className="text-slate-500 dark:text-slate-300 font-bold text-center leading-tight">
        {name.split(' ').map(w => w[0]).join('').slice(0, 3)}
      </span>
    </div>
  )
}

export default function SorteoNacional() {
  // Estados con valores iniciales vacíos para evitar hydration mismatch
  const [participantes, setParticipantes] = useState<Participante[]>([])
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [resultados, setResultados] = useState<ResultadoSorteo[]>([])
  const [sorteoRealizado, setSorteoRealizado] = useState(false)
  const [isSorteando, setIsSorteando] = useState(false)
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [isExporting, setIsExporting] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Cargar datos del localStorage después del montaje
  useEffect(() => {
    setMounted(true)
    try {
      const savedParticipantes = localStorage.getItem('nacional-participantes')
      const savedResultados = localStorage.getItem('nacional-resultados')
      const savedSorteoRealizado = localStorage.getItem('nacional-sorteo-realizado')

      if (savedParticipantes) {
        setParticipantes(JSON.parse(savedParticipantes))
      }
      if (savedResultados) {
        setResultados(JSON.parse(savedResultados))
      }
      if (savedSorteoRealizado) {
        setSorteoRealizado(JSON.parse(savedSorteoRealizado))
      }
    } catch (e) {
      console.error('Error loading from localStorage:', e)
    }
  }, [])

  // Guardar en localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('nacional-participantes', JSON.stringify(participantes))
    }
  }, [participantes, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('nacional-resultados', JSON.stringify(resultados))
    }
  }, [resultados, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('nacional-sorteo-realizado', JSON.stringify(sorteoRealizado))
    }
  }, [sorteoRealizado, mounted])

  const agregarParticipante = () => {
    if (nuevoNombre.trim() === '') return
    
    const nuevoParticipante: Participante = {
      id: Date.now().toString(),
      nombre: nuevoNombre.trim(),
    }
    
    setParticipantes([...participantes, nuevoParticipante])
    setNuevoNombre('')
  }

  const eliminarParticipante = (id: string) => {
    setParticipantes(participantes.filter(p => p.id !== id))
  }

  const realizarSorteo = async () => {
    if (participantes.length === 0) return

    setIsSorteando(true)
    setSorteoRealizado(false)
    setResultados([])

    // Mezclar participantes aleatoriamente
    const participantesMezclados = [...participantes].sort(() => Math.random() - 0.5)
    
    // Mezclar partidos aleatoriamente
    const partidosMezclados = [...PARTIDOS].sort(() => Math.random() - 0.5)

    const nuevosResultados: ResultadoSorteo[] = []

    // Animación de sorteo
    for (let i = 0; i < Math.min(participantesMezclados.length, PARTIDOS.length); i++) {
      await new Promise(resolve => setTimeout(resolve, 600))
      
      nuevosResultados.push({
        participante: participantesMezclados[i],
        partido: partidosMezclados[i],
      })
      
      setResultados([...nuevosResultados])
    }

    setSorteoRealizado(true)
    setIsSorteando(false)
  }

  const reiniciarSorteo = () => {
    setResultados([])
    setSorteoRealizado(false)
  }

  const reiniciarTodo = () => {
    setParticipantes([])
    setResultados([])
    setSorteoRealizado(false)
    localStorage.removeItem('nacional-participantes')
    localStorage.removeItem('nacional-resultados')
    localStorage.removeItem('nacional-sorteo-realizado')
  }

  const handleImageError = (src: string) => {
    setFailedImages(prev => new Set(prev).add(src))
  }

  const exportarPDF = async () => {
    if (!sorteoRealizado || resultados.length === 0) return
    
    setIsExporting(true)
    
    try {
      const sinPartidoList = participantes.filter(p => !resultados.find(r => r.participante.id === p.id))
      
      const response = await fetch('/api/exportar-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resultados: resultados.map(r => ({
            participante: { id: r.participante.id, nombre: r.participante.nombre },
            partido: {
              id: r.partido.id,
              fecha: r.partido.fecha,
              rival: r.partido.rival,
              estadio: r.partido.estadio
            }
          })),
          sinPartido: sinPartidoList.map(p => ({ id: p.id, nombre: p.nombre })),
          participantes: participantes.map(p => ({ id: p.id, nombre: p.nombre })),
          fecha: new Date().toLocaleDateString('es-CO', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Server error:', errorData)
        throw new Error(errorData.error || 'Error al generar PDF')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sorteo_nacional_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exportando PDF:', error)
      alert('Error al exportar PDF. Por favor intente nuevamente.')
    } finally {
      setIsExporting(false)
    }
  }

  const ganadores = resultados.map(r => r.participante)
  const sinPartido = participantes.filter(p => !ganadores.find(g => g.id === p.id))

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col">
      {/* Subtle pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Header */}
      <header className="relative border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-2xl blur-xl" />
              {failedImages.has(LOGO_NACIONAL) ? (
                <LogoPlaceholder name="Atlético Nacional" size="lg" />
              ) : (
                <div className="w-20 h-24 sm:w-24 sm:h-28 relative z-10 rounded-xl bg-white p-2 shadow-lg flex items-center justify-center">
                  <img 
                    src={LOGO_NACIONAL} 
                    alt="Atlético Nacional" 
                    className="w-full h-full object-contain drop-shadow-md"
                    onError={() => handleImageError(LOGO_NACIONAL)}
                  />
                </div>
              )}
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                <span className="text-slate-900 dark:text-white">Sorteo de Partidos</span>
              </h1>
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                Caracolí Verdolaga · Temporada 2026
              </p>
              <div className="flex items-center justify-center gap-2 mt-2 text-slate-500 dark:text-slate-500 text-sm">
                <MapPin className="w-3.5 h-3.5" />
                <span>Estadio Atanasio Girardot</span>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full relative z-10">
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Panel de Participantes */}
          <div className="lg:col-span-4">
            <Card className="border-emerald-200/60 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50/80 to-green-50/50 dark:from-emerald-950/40 dark:to-green-950/30 backdrop-blur-sm shadow-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 dark:bg-emerald-800/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <CardHeader className="pb-3 relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-white">
                    <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Participantes
                  </CardTitle>
                  <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-medium border-emerald-200 dark:border-emerald-800">
                    {participantes.length}
                  </Badge>
                </div>
                <CardDescription className="text-emerald-700/70 dark:text-emerald-400/70">
                  Agrega los nombres para el sorteo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nombre del participante..."
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && agregarParticipante()}
                    className="bg-white/80 dark:bg-slate-800/80 border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 focus:ring-emerald-500/20 placeholder:text-emerald-600/50 dark:placeholder:text-emerald-400/50"
                  />
                  <Button 
                    onClick={agregarParticipante}
                    size="icon"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Lista de participantes - crece dinámicamente */}
                <div className="space-y-0">
                  <AnimatePresence mode="popLayout">
                    {participantes.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-emerald-500/60 dark:text-emerald-400/50">
                        <Users className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-sm">Sin participantes</p>
                      </div>
                    ) : (
                      participantes.map((p, index) => (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.03 }}
                          className="flex items-center justify-between bg-white/60 dark:bg-slate-800/60 px-3 py-2.5 group hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors border-b border-emerald-100/50 dark:border-emerald-900/30 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                              {index + 1}
                            </div>
                            <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">{p.nombre}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => eliminarParticipante(p.id)}
                            className="opacity-0 group-hover:opacity-100 h-7 w-7 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel de Partidos */}
          <div className="lg:col-span-8">
            <Card className="border-emerald-200/60 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50/60 to-green-50/40 dark:from-emerald-950/30 dark:to-green-950/20 backdrop-blur-sm shadow-sm overflow-hidden">
              <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-200/20 dark:bg-emerald-800/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-200/20 dark:bg-green-800/10 rounded-full blur-2xl translate-y-1/2 translate-x-1/2" />
              <CardHeader className="pb-3 relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-white">
                    <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Partidos Disponibles
                  </CardTitle>
                  <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-medium border-emerald-200 dark:border-emerald-800">
                    {PARTIDOS.length} partidos
                  </Badge>
                </div>
                <CardDescription className="text-emerald-700/70 dark:text-emerald-400/70">
                  Partidos de local en el Estadio Atanasio Girardot
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="grid sm:grid-cols-2 gap-3">
                  {PARTIDOS.map((partido, index) => (
                    <motion.div
                      key={partido.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative overflow-hidden rounded-xl border transition-all ${
                        sorteoRealizado && resultados.find(r => r.partido.id === partido.id)
                          ? 'border-emerald-400 dark:border-emerald-600 bg-emerald-100/60 dark:bg-emerald-900/40'
                          : 'border-emerald-200/80 dark:border-emerald-800/50 bg-white/60 dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {partido.fecha}
                          </div>
                          {sorteoRealizado && resultados.find(r => r.partido.id === partido.id) && (
                            <Badge className="bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 text-[10px] font-medium border-0">
                              Asignado
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-center gap-3">
                          <div className="flex flex-col items-center">
                            {failedImages.has(LOGO_NACIONAL) ? (
                              <LogoPlaceholder name="Atlético Nacional" />
                            ) : (
                              <img 
                                src={LOGO_NACIONAL} 
                                alt="Atlético Nacional" 
                                className="w-11 h-11 object-contain rounded-full"
                                onError={() => handleImageError(LOGO_NACIONAL)}
                              />
                            )}
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 mt-1 font-medium">Atlético Nacional</span>
                          </div>
                          
                          <div className="flex flex-col items-center px-2">
                            <span className="text-sm font-bold text-emerald-500 dark:text-emerald-400">VS</span>
                          </div>
                          
                          <div className="flex flex-col items-center">
                            {failedImages.has(partido.logoRival) ? (
                              <LogoPlaceholder name={partido.rival} />
                            ) : (
                              <img 
                                src={partido.logoRival} 
                                alt={partido.rival}
                                className="w-11 h-11 object-contain rounded-full"
                                onError={() => handleImageError(partido.logoRival)}
                              />
                            )}
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 mt-1 font-medium text-center max-w-[70px] leading-tight">{partido.rival}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Button
            onClick={realizarSorteo}
            disabled={participantes.length === 0 || isSorteando}
            size="lg"
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-slate-400 disabled:to-slate-500 text-white px-8 shadow-lg shadow-emerald-600/20 disabled:shadow-none transition-all font-medium"
          >
            {isSorteando ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sorteando...
              </>
            ) : (
              <>
                <Shuffle className="w-4 h-4 mr-2" />
                Realizar Sorteo
              </>
            )}
          </Button>

          {sorteoRealizado && (
            <Button
              onClick={reiniciarSorteo}
              variant="outline"
              size="lg"
              className="border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Nuevo Sorteo
            </Button>
          )}

          <Button
            onClick={reiniciarTodo}
            variant="ghost"
            size="lg"
            className="text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Reiniciar Todo
          </Button>
        </div>

        {/* Resultados del Sorteo */}
        <AnimatePresence mode="wait">
          {resultados.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="mt-8"
            >
              <Card className="border-amber-200/60 dark:border-amber-900/50 bg-gradient-to-br from-amber-50/80 to-yellow-50/60 dark:from-amber-950/30 dark:to-yellow-950/20 backdrop-blur-sm shadow-sm overflow-hidden">
                <div className="absolute top-0 left-1/2 w-48 h-48 bg-amber-200/30 dark:bg-amber-800/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <CardHeader className="text-center border-b border-amber-100 dark:border-amber-900/50 relative">
                  <div className="flex items-center justify-center gap-3">
                    <Crown className="w-7 h-7 text-amber-500" />
                    <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">
                      Ganadores del Sorteo
                    </CardTitle>
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <CardDescription className="text-amber-700/70 dark:text-amber-400/70 mt-1">
                    {resultados.length} participantes con partido asignado
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-4 sm:p-6 relative">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence mode="popLayout">
                      {resultados.map((resultado, index) => (
                        <motion.div
                          key={resultado.participante.id}
                          initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                          transition={{ 
                            type: 'spring',
                            stiffness: 200,
                            damping: 20,
                            delay: index * 0.1 
                          }}
                          className="relative"
                        >
                          <div className={`p-4 rounded-xl border-2 transition-all ${
                            sorteoRealizado 
                              ? 'border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-100/80 to-yellow-100/60 dark:from-amber-900/30 dark:to-yellow-900/20' 
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
                          }`}>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                {index + 1}
                              </div>
                              <span className="font-semibold text-slate-800 dark:text-white truncate flex-1">
                                {resultado.participante.nombre}
                              </span>
                              {sorteoRealizado && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                                >
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                </motion.div>
                              )}
                            </div>
                            
                            <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-3 border border-amber-100 dark:border-amber-900/30">
                              <div className="text-[10px] text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {resultado.partido.fecha}
                              </div>
                              
                              <div className="flex items-center justify-center gap-2">
                                {failedImages.has(LOGO_NACIONAL) ? (
                                  <LogoPlaceholder name="Atlético Nacional" size="sm" />
                                ) : (
                                  <img 
                                    src={LOGO_NACIONAL} 
                                    alt="Atlético Nacional"
                                    className="w-8 h-8 object-contain rounded-full"
                                    onError={() => handleImageError(LOGO_NACIONAL)}
                                  />
                                )}
                                <span className="text-xs font-bold text-amber-500 dark:text-amber-400">VS</span>
                                {failedImages.has(resultado.partido.logoRival) ? (
                                  <LogoPlaceholder name={resultado.partido.rival} size="sm" />
                                ) : (
                                  <img 
                                    src={resultado.partido.logoRival}
                                    alt={resultado.partido.rival}
                                    className="w-8 h-8 object-contain rounded-full"
                                    onError={() => handleImageError(resultado.partido.logoRival)}
                                  />
                                )}
                              </div>
                              
                              <p className="text-center text-xs text-slate-700 dark:text-slate-300 mt-2 font-semibold">
                                Atlético Nacional vs {resultado.partido.rival}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Participantes sin partido */}
                  {sinPartido.length > 0 && sorteoRealizado && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: resultados.length * 0.1 + 0.2 }}
                      className="mt-6 pt-6 border-t border-amber-100 dark:border-amber-900/30"
                    >
                      <div className="flex items-center justify-center gap-2 mb-4 text-slate-500 dark:text-slate-400">
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Sin asignación ({sinPartido.length})</span>
                      </div>
                      <div className="flex flex-wrap justify-center gap-3">
                        {sinPartido.map(p => (
                          <div
                            key={p.id}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                          >
                            <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">
                              {p.nombre.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">{p.nombre}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botón Exportar PDF */}
        <AnimatePresence>
          {sorteoRealizado && resultados.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex justify-center"
            >
              <Button
                onClick={exportarPDF}
                disabled={isExporting}
                size="lg"
                variant="outline"
                className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/30 gap-2"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generando PDF...
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    Exportar a PDF
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mensaje de celebración */}
        <AnimatePresence>
          {sorteoRealizado && resultados.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="mt-6 text-center"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 dark:from-emerald-950/30 dark:via-green-950/30 dark:to-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-full">
                <PartyPopper className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300 font-medium text-sm">
                  ¡Sorteo completado!
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm py-4 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {failedImages.has(LOGO_NACIONAL) ? (
                <LogoPlaceholder name="AN" size="sm" />
              ) : (
                <img 
                  src={LOGO_NACIONAL} 
                  alt="Atlético Nacional" 
                  className="w-6 h-6 object-contain rounded-full"
                  onError={() => handleImageError(LOGO_NACIONAL)}
                />
              )}
              <span className="text-slate-700 dark:text-slate-300 font-semibold text-sm">Atlético Nacional</span>
              <span className="text-slate-400 dark:text-slate-500 text-xs">· El Rey de Copas, el Más Grande de Colombia</span>
            </div>
            <div className="text-slate-500 dark:text-slate-500 text-xs">
              Página web desarrollada por{' '}
              <a 
                href="https://douglasfugazi.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
              >
                Douglas Fugazi
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
