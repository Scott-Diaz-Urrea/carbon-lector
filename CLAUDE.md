# LEO — Contexto del proyecto para Claude Code

## Qué es esto

**LEO** es una app web educativa gratuita para niños, con **Carboncito** (un pug negro,
mascota basada en un pug real de la familia) como personaje guía. Enseña Lenguaje y
Matemática siguiendo la trayectoria escolar oficial chilena: Educación Parvularia →
Educación Básica (1° a 8°) → Educación Media → EPJA.

Repositorio en GitHub: `carbon-lector` (público, desplegado con GitHub Pages).

## Regla de oro del proyecto

**Todo el contenido educativo debe basarse en objetivos de aprendizaje (OA) reales**,
tomados de documentos curriculares oficiales de Mineduc (Chile) — nunca inventados.
Fuentes ya usadas:
- Decreto 481/2017 — Bases Curriculares de Educación Parvularia (Sala Cuna, Medio, Transición)
- Decreto 439/2012 — Bases Curriculares 1° a 6° Básico (todas las asignaturas)
- "Juego Primero NT2" — fichas pedagógicas oficiales para Kínder (referencia de estilo)

Antes de agregar un módulo nuevo, identificar el/los OA específicos que cubre y
mencionarlo en el mensaje de commit o en la conversación. Si no se tienen los OA de
un curso/asignatura todavía, pedirlos al usuario antes de inventar contenido.

## Stack técnico

Un solo archivo: **`index.html`**. HTML + CSS + JavaScript vanilla, sin frameworks ni
build step. Única dependencia externa: Google Fonts (Baloo 2 + Quicksand), vía CDN.
Esto es intencional: el archivo se sube directo a GitHub Pages sin necesidad de compilar
nada.

**No introducir frameworks, bundlers ni dependencias nuevas** salvo que el usuario lo
pida explícitamente — la simplicidad de "un archivo, cero build" es una característica,
no una limitación temporal.

## Arquitectura del código

- **Navegación:** pila de pantallas (`screenStack`) + `goTo()` / `goBack()` + `render()`
  central que reconstruye `#app.innerHTML` en cada cambio de pantalla.
- **Jerarquía de pantallas:** `home` → `etapaMap` (Parvularia/Básica/Media/EPJA) →
  `gradeMap` (islas 1°-8° básico, `selectGrade(id)` guarda `state.currentGrade`) →
  `subjectMap` (Lenguaje/Matemática/Ciencias, lee `state.currentGrade`) →
  `lenguajeMap` / `matematicasMap` (módulos del año actual) → juego individual.
- **Contenido por año:** `LENGUAJE_BY_GRADE` y `MATE_BY_GRADE` son objetos indexados
  por número de año (`{1: {...}, 2: {...}}`), cada uno con `{modules, pos, height}`.
  Para agregar un año nuevo, se agrega una entrada ahí — el resto de la navegación ya
  es genérica y no requiere tocarse.
- **Motor de minijuegos de opción múltiple (reutilizable):** `MC_GAMES` es un mapa
  `{clave: {title, gen, rounds}}` donde `gen` es una función que retorna
  `{promptHTML, options, correctValue, speakText, cols, panel?, kind?}`.
  `MC_KEYS` debe incluir toda clave que use este motor. Para un juego nuevo de este
  tipo, generalmente basta con escribir la función `genXxxRound()` y registrarla ahí.
- **Juegos a medida** (mecánica propia, no encajan en el motor genérico): Sílabas,
  Secuencia (ordenar por pasos), Memorama (memoria por pares). Cada uno tiene su
  propio `render*Screen`, `init*Game`, `draw*Round` y handlers de tap. Sirven de
  plantilla si se necesita un nuevo tipo de mecánica.
- **Recompensas:** XP (`awardXP`), niveles (`level()`), rachas (`streak`), insignias
  (`state.badges`, `MODULE_TITLES` define el nombre de cada insignia), confeti al
  sacar 3 estrellas (`spawnConfetti`). Sonidos vía Web Audio API sintetizado
  (`sfxCorrect`, `sfxWrong`, `sfxStreak`, `sfxLevelup`) — sin archivos de audio externos.
- **Voz:** `speak(texto)` usa `SpeechSynthesisUtterance` del navegador, con lógica en
  `pickBestVoice()` para preferir voces en español de mejor calidad (Google/Natural)
  sobre la voz robótica por defecto.
- **Mascota:** `mascotSVG(size)` genera el SVG de Carboncito inline (sin archivos de
  imagen). Basado en una foto real: ojos café cálidos, arrugas marcadas, hocico
  gris-marrón, lengua asomando de lado.
- **Progreso:** todo vive en memoria (`state`), se reinicia al recargar la página. No
  hay backend ni localStorage (localStorage no funciona en el entorno de artifacts de
  Claude.ai, pero SÍ funcionaría en el sitio ya desplegado — es una mejora pendiente,
  no implementada aún por decisión consciente).

## Estado actual del contenido (julio 2026)

### Educación Parvularia — 🔒 sin construir
Investigado (Decreto 481/2017) pero sin módulos jugables aún.

### 1° Básico — ✅ completo (14 módulos, 3 asignaturas)
- Lenguaje: Vocales, Sílabas, Letras (memorama), Palabras, Comprensión
- Matemática: Contar, Sumar, Comparar, Formas
- Ciencias Naturales: Seres Vivos, Plantas, Mi Cuerpo, Materiales, Día y Noche —
  cubre OA1-OA4, OA6-OA9, OA11-OA12 del eje de Ciencias Naturales (Decreto 439/2012,
  extraídos de curriculumnacional.cl/curriculum/1o-6o-basico/ciencias-naturales/1-basico).
  OA5 (comparar plantas/animales de Chile con medidas de cuidado) y OA10 (diseñar
  instrumentos tecnológicos) y las 4 OAH (habilidades de investigación científica)
  quedaron fuera por no encajar bien en el motor de opción múltiple actual — quedan
  pendientes si se quiere cobertura 100% completa del curso.

### 2° Básico — 🟡 parcial (4 de 8 módulos)
- Lenguaje: Combinaciones ✅, Secuencia ✅ · **Gramática 🔒, Comprensión II 🔒 (pendientes)**
- Matemática: Salta y Cuenta ✅, Multiplicar ✅ · **Geometría 🔒, Medición 🔒 (pendientes)**
- OA ya extraídos del Decreto 439/2012 para Lenguaje 2° básico (30 OA, ejes Lectura/
  Escritura/Comunicación Oral) y Matemática 2° básico (22 OA, ejes Números y
  Operaciones/Patrones y Álgebra/Geometría/Medición/Datos y Probabilidades) — están
  disponibles en el historial de conversación con el usuario si se necesitan de nuevo;
  si no, hay que volver a pedir el PDF `Bases1y6basico.pdf` o extraerlo de ese archivo
  si está en el repo.

### 3° a 8° Básico, Educación Media, EPJA — 🔒 sin construir
`GRADES` los tiene marcados `open:false`. Para desbloquear un año, cambiar su
`open` a `true` Y crear su entrada correspondiente en `LENGUAJE_BY_GRADE` /
`MATE_BY_GRADE` (si no existe una entrada, `renderComingSoonSubject()` se muestra
automáticamente como placeholder — no rompe nada, pero tampoco es jugable).

## Próximos pasos sugeridos (en orden)

1. Completar 2° básico: Gramática (concordancia género/número) y Comprensión II en
   Lenguaje; Geometría (2D/3D) y Medición (calendario, hora, longitud) en Matemática.
2. Extraer los OA de 3° básico del mismo PDF (`Bases1y6basico.pdf`, páginas ~239-260
   para Matemática, buscar "3º básico" en el índice para Lenguaje) y repetir el patrón.
3. Agregar Ciencias Naturales a 2° básico (y subir de nivel), siguiendo el mismo
   patrón usado en 1° básico (`CIENCIAS_BY_GRADE`, `CIENCIAS_MODULES`, etc.) — pedir
   los OA de Ciencias Naturales 2° básico antes de construir contenido.
4. Evaluar agregar persistencia real (localStorage) ahora que el sitio vive en su
   propio dominio (GitHub Pages) y ya no está restringido por el sandbox de artifacts.

## Convenciones a mantener

- Español de Chile en todo el copy visible al usuario.
- Paleta de color en variables CSS (`:root`) — no hardcodear colores nuevos sin
  agregarlos ahí primero.
- Los generadores de rondas (`genXxxRound`) deben producir contenido *dinámico/
  aleatorio* cuando sea posible (números, combinaciones al azar) en vez de bancos
  estáticos gigantes — esto fue un pedido explícito del usuario ("que no se parezca
  una ronda a otra").
- Antes de dar por buena una edición grande, correr `node --check` sobre el JS
  extraído del archivo para detectar errores de sintaxis (el proyecto no tiene tests
  automatizados más allá de eso).
