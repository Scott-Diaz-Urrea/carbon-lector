# LEO — Contexto del proyecto para Claude Code

## Qué es esto

**LEO** es una app web educativa gratuita para niños, con **Carboncito** (un pug negro,
mascota basada en un pug real de la familia) como personaje guía. Enseña las asignaturas
del currículum chileno (Lenguaje, Matemática, Ciencias Naturales, Historia/Geografía/Cs.
Sociales, Artes Visuales, Música, Educación Física y Salud, Orientación, Tecnología)
siguiendo la trayectoria escolar oficial: Educación Parvularia → Educación Básica (1° a
8°) → Educación Media → EPJA.

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

HTML + CSS + JavaScript vanilla, **sin frameworks ni build step**. Única dependencia
externa: Google Fonts (Baloo 2 + Quicksand), vía CDN. Esto es intencional: los archivos
se suben directo a GitHub Pages sin necesidad de compilar nada.

Desde julio 2026 el JS vive en **módulos ES nativos** (`<script type="module">`), no en
un único archivo — ver "Arquitectura de archivos" abajo. Esto sigue siendo "cero build":
son archivos `.js` estáticos que el navegador importa directamente vía `import`/`export`,
sin bundler, sin transpilación, sin paso de compilación. GitHub Pages los sirve tal cual.

**No introducir un bundler/framework de UI ni dependencias nuevas** salvo que el usuario
lo pida explícitamente — la simplicidad de "cero build" es una característica, no una
limitación temporal. La modularización con ES modules no viola esto: sigue sin haber
build step, solo se organizó el código en archivos más chicos y con responsabilidades
claras.

### Arquitectura de archivos

```
index.html              shell HTML mínimo: <link rel="stylesheet" href="styles.css">
                         + <script type="module" src="js/main.js">
styles.css               todo el CSS (idéntico al que antes vivía en <style>)
js/
  main.js                 punto de entrada: expone en window las funciones que el HTML
                           generado dinámicamente invoca vía onclick="..." (los módulos
                           ES no son globales por defecto), y llama a render() una vez.
  utils.js                 shuffle/pick/randInt/uniqueDistractors/pathD — sin dependencias.
  svg.js                   helpers de SVG a mano (shapeSVG, mascotSVG, chileFlagSVG,
                           colorSwatchSVG, starSVG, lockIconSVG, backIconSVG).
  audio.js                 voz (speak, pickBestVoice) y sonidos Web Audio (sfxCorrect,
                           sfxWrong, sfxStreak, sfxLevelup).
  state.js                 state global, screenStack, goTo/goBack/selectGrade,
                           XP/nivel/estrellas (awardXP, level, totalStars, maxStars),
                           showToast.
  persistence.js            loadProgress()/saveProgress() — localStorage (ver
                           "Progreso" abajo).
  gradeContent.js           agrega los <NOMBRE>_MODULES/_POS de cada content/*.js en
                           <NOMBRE>_BY_GRADE, y arma SUBJECT_DEFS (la lista que
                           renderSubjectMap() recorre para las tarjetas de materia).
  mcEngine.js               MC_GAMES, MC_KEYS, y el motor genérico de opción múltiple
                           (initMCGame, drawMCRound, answerMC, roundSignature, finishMC).
  rewards.js                MODULE_TITLES, spawnConfetti, showResult, showExplain
                           (Carboncito), replayGame.
  render.js                 render() (el dispatcher central) + renderHome/renderEtapaMap/
                           renderGradeMap/renderSubjectMap/renderModuleMap y los 9
                           render<Asignatura>Map().
  content/
    grades.js                GRADES, GRADE_POS (las 8 islas de Educación Básica).
    lenguaje.js               bancos + genXxxRound() + MODULES/POS de Lenguaje.
    matematica.js             ídem Matemática.
    ciencias.js               ídem Ciencias Naturales.
    historia.js               ídem Historia/Geografía/Cs. Sociales.
    artes.js                  ídem Artes Visuales.
    musica.js                 ídem Música.
    edfisica.js               ídem Educación Física y Salud.
    orientacion.js            ídem Orientación.
    tecnologia.js             ídem Tecnología.
    parvularia/               los 8 núcleos jugables de Educación Parvularia NT — cada
                              archivo sigue el mismo patrón que un archivo de asignatura
                              de Básica (bancos + genXxxRound + MODULES/POS), pero viven
                              en su propia subcarpeta porque Parvularia se organiza por
                              núcleos de aprendizaje, no por asignaturas (ver "Parvularia:
                              níveles y núcleos" abajo).
      pensamientoMatematico.js       núcleo Pensamiento Matemático.
      lenguajeVerbal.js               núcleo Lenguaje Verbal (incluye "Escribe tu
                                     Nombre" y "Caligrafía" en su lista de módulos, pero
                                     ambos en realidad viven en games/escribenombre.js y
                                     games/caligrafia.js — este archivo solo tiene los 4
                                     módulos de opción múltiple del núcleo).
      lenguajesArtisticos.js          núcleo Lenguajes Artísticos.
      identidadAutonomia.js           núcleo Identidad y Autonomía.
      convivenciaCiudadania.js        núcleo Convivencia y Ciudadanía.
      corporalidadMovimiento.js       núcleo Corporalidad y Movimiento.
      exploracionEntornoNatural.js    núcleo Exploración del Entorno Natural.
      comprensionEntornoSociocultural.js núcleo Comprensión del Entorno Sociocultural.
  games/
    silabas.js                Sílabas: contenido + render*Screen/init*Game/draw*Round/tap*.
    secuencia.js               ídem Secuencia.
    memorama.js                ídem Memorama.
    traza.js                   renderTraceCanvas()/initTraceCanvas() — componente de
                              trazado a mano sobre <canvas> (Pointer Events, sirve para
                              mouse/dedo/lápiz óptico por igual). No es un juego en sí,
                              es un helper reutilizable: lo usa showNameEntry()
                              (rewards.js), escribenombre.js y caligrafia.js.
                              `initTraceCanvas(id, guide)` acepta un string ('MAYA',
                              'A', '3' — se dibuja como texto grande) o un objeto
                              `{shape:'horizontal'|'vertical'|'diagonal'|'curva'|
                              'zigzag'|'ondas'|'circulo'|'espiral'}` (trazos básicos de
                              grafomotricidad, dibujados con Canvas paths en vez de
                              texto). Internamente trackea el último listener de
                              `resize` en una variable de módulo y lo limpia antes de
                              adjuntar uno nuevo — necesario porque cada hoja nueva de
                              Caligrafía crea un `<canvas>` distinto y sin este cleanup
                              se acumulaba un listener de `resize` por cada hoja vista
                              en la sesión (detectado al construir el cuaderno de
                              varias hojas).
    escribenombre.js           módulo "Escribe tu Nombre" (núcleo Lenguaje Verbal, NT):
                              envuelve traza.js en un módulo jugable con su propio
                              render/init, sin motor de opción múltiple — no hay
                              respuesta correcta/incorrecta, siempre otorga 3 estrellas
                              al terminar (ver showResult() con customSub más abajo).
    caligrafia.js               módulo "Caligrafía" (núcleo Lenguaje Verbal, NT):
                              cuaderno de 18 hojas en secuencia (8 trazos básicos de
                              grafomotricidad + 5 vocales + números 1-5), cada una un
                              `<canvas>` de traza.js con guía distinta y un botón
                              "Siguiente hoja" que avanza a la próxima; la última hoja
                              dice "¡Terminar!" y llama a showResult() con 3 estrellas
                              fijas, mismo criterio que escribenombre.js (no hay
                              aciertos que contar, es práctica motriz).
```

**Por qué esta división:** cada `content/<asignatura>.js` es autocontenido (sus bancos +
sus `genXxxRound`), así que agregar o editar una asignatura solo toca 1-2 archivos en vez
de buscar entre miles de líneas. Hay dependencias circulares a nivel de módulo entre
`state.js`↔`render.js`, `mcEngine.js`↔`rewards.js` y `rewards.js`↔`games/*.js` — esto es
intencional y seguro en ES modules mientras el uso quede dentro de cuerpos de función (no
en la evaluación de nivel superior del módulo), que es el caso en todos estos archivos.

## Arquitectura del código

- **Navegación:** pila de pantallas (`screenStack`) + `goTo()` / `goBack()` + `render()`
  central que reconstruye `#app.innerHTML` en cada cambio de pantalla.
- **Nombre del usuario (personalización):** `state.userName` (string, vacío por
  defecto). `main.js` llama a `showNameEntry(render)` al cargar si `state.userName`
  está vacío — un overlay (`js/rewards.js`) donde Carboncito pregunta el nombre antes
  de mostrar la Home. Se usa para personalizar: el saludo en `renderHome()`, el título
  de `showExplain()` ("Carboncito te explica, {nombre}"), el título de `showResult()`
  ("¡Excelente trabajo, {nombre}!"), y el toast de subida de nivel (`awardXP` en
  `state.js`). Patrón a seguir en código nuevo: `const who = state.userName ? ', ' +
  state.userName : '';` y concatenar `who` — así el texto queda igual de bien sin
  nombre. El progreso (incluido el nombre) persiste vía `js/persistence.js`, así que el
  overlay solo aparece la primera vez en cada navegador/dispositivo.
- **Trazado de nombre (pre-escritura):** después de escribir su nombre con el teclado
  en `showNameEntry()`, el niño pasa a un segundo paso dentro del mismo overlay donde
  Carboncito le pide "repasarlo" a mano — `renderTraceCanvas()`/`initTraceCanvas()`
  (`js/games/traza.js`) dibujan el nombre como guía tenue sobre un `<canvas>` y
  capturan Pointer Events (mouse, dedo o lápiz óptico, todos unificados) para que el
  niño lo repase encima con un trazo de color. No hay corrección automática — es
  puramente motor/pre-escritura, con un botón "Borrar y repetir" y uno "Saltar por
  ahora" para no bloquear a quien no quiera/pueda dibujar en ese momento. Este mismo
  componente se reutiliza en el módulo "Escribe tu Nombre" (`js/games/escribenombre.js`,
  núcleo Lenguaje Verbal) para practicarlo de nuevo cuando quieran, fuera del flujo de
  entrada inicial. Pedido explícito del usuario: fomentar que el trazado se sienta como
  dibujar, no como tipear, dado que es un hito real de pre-escritura en Transición
  (OA08 de Lenguaje Verbal, ver más abajo).
- **Jerarquía de pantallas:** `home` → `etapaMap` (Parvularia/Básica/Media/EPJA) →
  `gradeMap` (islas 1°-8° básico, `selectGrade(id)` guarda `state.currentGrade`) →
  `subjectMap` (lista de asignaturas, lee `state.currentGrade`) →
  `lenguajeMap` / `matematicasMap` / `cienciasMap` / `historiaMap` / `artesMap` /
  `musicaMap` / `edfisicaMap` / `orientacionMap` / `tecnologiaMap` (módulos del año
  actual) → juego individual.
- **Asignaturas data-driven:** `SUBJECT_DEFS` (definido después de todos los
  `*_BY_GRADE`, para evitar Temporal Dead Zone) es la lista que `renderSubjectMap()`
  recorre para dibujar las tarjetas de materias — cada entrada es
  `{icon, label, screen, byGrade}`. Para agregar una asignatura nueva: crear su
  `<NOMBRE>_MODULES` + `<NOMBRE>_POS` + `<NOMBRE>_BY_GRADE` (mismo patrón que
  `CIENCIAS_BY_GRADE`), su `render<Nombre>Map()` (una línea, usa `renderModuleMap()`),
  agregar el `else if` correspondiente en `render()`, y agregar una entrada a
  `SUBJECT_DEFS`. El resto de `renderSubjectMap()` es genérico y no requiere tocarse.
- **Contenido por año:** cada asignatura tiene su propio `<NOMBRE>_BY_GRADE`, objeto
  indexado por número de año (`{1: {...}, 2: {...}}`), con `{modules, pos, height}`.
  Por ahora solo Lenguaje y Matemática tienen entrada para 2° básico; el resto de
  asignaturas solo tiene 1° básico.
- **Educación Parvularia — níveles y núcleos (arquitectura paralela a Básica, no
  compartida):** Parvularia no se organiza por año/asignatura como Básica, sino por
  **nivel** (Sala Cuna, Nivel Medio, Transición — `state.currentNivel`, con
  `PARVULARIA_NIVELES` en `content/grades.js`) y dentro de cada nivel, por **núcleo de
  aprendizaje** (los 8 núcleos del Decreto 481/2017, repartidos en 3 ámbitos —
  Comunicación Integral, Desarrollo Personal y Social, Interacción y Comprensión del
  Entorno — ver `NUCLEO_DEFS` en `gradeContent.js`, cada entrada
  `{icon, label, screen, byNivel}`). Solo NT tiene contenido jugable, así que
  `PARVULARIA_NIVELES` solo lista ese nivel — Sala Cuna y Nivel Medio ni siquiera se
  muestran (ver "Estado actual del contenido" abajo). Como hay un solo nivel jugable,
  el botón "Educación Parvularia" de `renderEtapaMap()` llama directo a
  `selectNivel('nt')` (que guarda `state.currentNivel` y navega a `nucleoMap`) — no
  existe una pantalla intermedia de selección de nivel. Jerarquía de pantallas:
  `etapaMap` → `nucleoMap` (tarjetas de núcleo, lee `state.currentNivel`) →
  `<nucleo>Map` (p.ej. `pensamientoMatematicoMap`) → juego individual. Deliberadamente
  **no** se reutilizó `SUBJECT_DEFS`/`*_BY_GRADE` ni `selectGrade`/`gradeLabel` — se
  escribieron equivalentes paralelos (`NUCLEO_DEFS`/`*_BY_NIVEL`,
  `selectNivel`/`nivelLabel`) porque las jerarquías de Básica (año→asignatura) y
  Parvularia (nivel→núcleo) son conceptualmente distintas; forzarlas a una abstracción
  común habría sido la premature abstraction que este proyecto evita a propósito. Para
  agregar un núcleo nuevo (o un nivel nuevo, si algún día se decide construir Sala
  Cuna/Medio): mismo patrón que una asignatura de Básica (`<NOMBRE>_MODULES`/`_POS`,
  `genXxxRound`, registrar en `MC_GAMES`/`MC_KEYS`, agregar `render<Nucleo>Map()` de
  una línea en `render.js` usando el helper `renderNucleoMapFor()` y su `else if` en
  `render()`, agregar entrada a `NUCLEO_DEFS` con `byNivel`). Un núcleo sin
  `byNivel[nivel]` muestra automáticamente una tarjeta "🚧 Núcleo en preparación" en
  `nucleoMap` — no rompe nada, solo no es jugable todavía (ya no aplica a ningún
  núcleo de NT: los 8 están construidos).
- **Rounds:8 en vez de 10 para Parvularia:** los módulos de Básica usan `rounds:10`;
  los de Parvularia usan `rounds:8`. Decisión pedagógica deliberada (no un descuido):
  la atención sostenida en preescolar (NT, ~5 años) es más corta que en Básica, así
  que partidas más cortas mantienen el juego dentro de un tramo de atención razonable
  sin sacrificar cobertura del núcleo.
- **Motor de minijuegos de opción múltiple (reutilizable):** `MC_GAMES` es un mapa
  `{clave: {title, gen, rounds}}` donde `gen` es una función que retorna
  `{promptHTML, options, correctValue, speakText, cols, panel?, kind?, explain}`.
  `MC_KEYS` debe incluir toda clave que use este motor. Para un juego nuevo de este
  tipo, generalmente basta con escribir la función `genXxxRound()` y registrarla ahí.
  **`explain` es obligatorio** (ver "Carboncito explica" abajo) — todo `genXxxRound()`
  nuevo debe retornarlo.
- **Juegos a medida** (mecánica propia, no encajan en el motor genérico): Sílabas,
  Secuencia (ordenar por pasos), Memorama (memoria por pares). Cada uno tiene su
  propio `render*Screen`, `init*Game`, `draw*Round` y handlers de tap. Sirven de
  plantilla si se necesita un nuevo tipo de mecánica. Sílabas y Secuencia también
  llaman a `showExplain()` en su rama de respuesta incorrecta; Memorama no (es un
  juego de memoria, no hay un "por qué" conceptual que explicar).
- **Carboncito explica (feedback pedagógico):** cuando el jugador responde mal,
  `answerMC()` (o los handlers `tapSyllable`/`tapSecuencia` en los juegos a medida)
  llaman a `showExplain(texto, continuar)`, que muestra un overlay con la mascota y
  el texto de `explain`, y solo avanza a la siguiente ronda cuando el jugador toca
  "¡Entendido, sigamos!" (a diferencia de una respuesta correcta, que avanza sola).
  Esto fue un pedido explícito del usuario: el niño debe entender el porqué antes de
  seguir, no solo ver el error y avanzar. Cada `explain` debe ser concreto y en
  español de Chile (reutilizar campos `desc`/`uso`/`q` ya existentes en los bancos de
  contenido cuando sea posible, en vez de redactar un texto nuevo).
- **Sin preguntas repetidas dentro de una misma partida:** `initMCGame()` guarda un
  `Set` (`mc.seenPrompts`) con la "firma" (`roundSignature()` = `promptHTML` + labels
  de las opciones, ordenadas) de cada ronda ya mostrada; `drawMCRound()` reintenta
  `cfg.gen()` (hasta 60 veces) hasta obtener una firma nueva antes de aceptar la ronda.
  Esto es una capa a nivel de motor — **ningún `genXxxRound()` individual necesita
  lógica de no-repetición propia**, basta con que el banco de contenido tenga
  suficientes ítems únicos para la cantidad de `rounds` del juego (idealmente ≥ rounds,
  hoy son 8 o 10). Si un banco tiene menos ítems únicos que `rounds`, los reintentos
  igual convergen a la mejor variedad posible (mostrar cada ítem único al menos una
  vez) pero habrá alguna repetición inevitable — la solución de fondo ahí es agregar
  más ítems al banco, no tocar el motor. Sílabas y Secuencia ya evitaban repeticiones
  por su cuenta (barajan el banco completo una vez al iniciar y avanzan con
  `pool[round % pool.length]`), así que no necesitaron este cambio.
- **Recompensas:** XP (`awardXP`), niveles (`level()`), rachas (`streak`), insignias
  (`state.badges`, `MODULE_TITLES` define el nombre de cada insignia), confeti al
  sacar 3 estrellas (`spawnConfetti`). Sonidos vía Web Audio API sintetizado
  (`sfxCorrect`, `sfxWrong`, `sfxStreak`, `sfxLevelup`) — sin archivos de audio externos.
  `showResult(moduleKey, correctOrStars, total, isStarsAlready, customSub?)` tiene un
  5° parámetro opcional `customSub`: si viene, reemplaza el subtítulo por defecto
  ("Acertaste X de Y" / "Lo lograste en N movimientos") por un texto libre — lo usa
  `escribenombre.js` porque ahí no hay "aciertos" que contar (es un ejercicio de
  trazado libre, siempre 3 estrellas).
- **Ilustraciones SVG propias:** además de emoji, hay helpers que dibujan SVG a mano
  (`shapeSVG`, `mascotSVG`, `chileFlagSVG`, `colorSwatchSVG`) para conceptos donde el
  emoji no es representativo o no se renderiza igual en todos los sistemas — ej. las
  banderas (🇨🇱) se ven como texto "CL" en varias configuraciones de Windows, por eso
  `chileFlagSVG()` la dibuja a mano. Preferir este patrón sobre un emoji cuando el
  concepto sea central al módulo (no decorativo) o el emoji tenga soporte inconsistente
  entre plataformas (banderas, ZWJ poco comunes).
- **Voz:** `speak(texto)` usa `SpeechSynthesisUtterance` del navegador, con lógica en
  `pickBestVoice()` para preferir voces en español de mejor calidad (Google/Natural)
  sobre la voz robótica por defecto.
- **Mascota:** `mascotSVG(size)` genera el SVG de Carboncito inline (sin archivos de
  imagen). Basado en una foto real: ojos café cálidos, arrugas marcadas, hocico
  gris-marrón, lengua asomando de lado.
- **Progreso:** persiste en `localStorage` (`js/persistence.js`, clave `leo_progress_v1`)
  — no hay backend ni base de datos real, solo el navegador/dispositivo del jugador
  (no sincroniza entre dispositivos). `loadProgress()` se llama una vez en `main.js`
  antes del primer `render()`, y también evita mostrarle el prompt de nombre a alguien
  que ya lo guardó antes. `saveProgress()` se llama desde `awardXP()` (todo cambio de
  XP/nivel), `selectGrade()`, `showResult()` y el submit de `showNameEntry()` — el
  patrón para código nuevo es: cualquier función que mute `state.xp`, `state.stars`,
  `state.badges`, `state.currentGrade` o `state.userName` debe llamar a
  `saveProgress()` después. `loadProgress()` es tolerante a datos faltantes/corruptos
  (try/catch silencioso) y solo copia claves de `stars` que ya existan en el `state.stars`
  actual — así una asignatura nueva agregada después no se ve pisada por datos viejos
  sin esa clave.

## Estado actual del contenido (julio 2026)

### Educación Parvularia — ✅ completa (8 de 8 núcleos, nivel NT)
Basado en el Decreto 481/2017, nivel Transición (NT), repartido en 3 ámbitos.
Sala Cuna y Nivel Medio no están en `PARVULARIA_NIVELES` en absoluto (ni bloqueados):
son edades donde el juego en pantalla no es desarrollo-apropiado (así lo indica el
propio Decreto 481/2017 para esos niveles), así que no está previsto construir
módulos jugables para ellos — ver "Educación Parvularia — níveles y núcleos" arriba.

**Ámbito Comunicación Integral** (curriculumnacional.cl/curriculum/educacion-parvularia/comunicacion-integral/nt-nivel-transicion):
- **Lenguaje Verbal** (6): Escribe tu Nombre y Caligrafía (ambos trazado libre sobre
  canvas, sin motor MC), Sílabas y Sonidos, Escuchar y Comprender, Vocabulario en
  Contexto, Letras y Sonidos — OA01-04, OA06-08. Fuera: OA05 (interés por textos,
  actitudinal) y OA09-10 (mensajes en lengua indígena de la comunidad o lenguas
  maternas de los pares — dependen de la lengua específica de cada comunidad/familia,
  no generalizables sin riesgo de contenido incorrecto o excluyente).
- **Lenguajes Artísticos** (1): Aprecia y Compara — OA01. Fuera: OA02 (opinión
  subjetiva sobre una obra), OA03-04 (canto/danza, performativo), OA05-07
  (representación plástica o dibujo propio, producción no reconocimiento).

**Ámbito Desarrollo Personal y Social** (PDFs de curriculumnacional.cl,
`articles-115242/115243/115244_bases.pdf`):
- **Identidad y Autonomía** (3): Reconoce Emociones, Autocuidado y Hábitos, Alimentos
  y Sellos — OA01, OA03, OA09, OA11. Fuera: OA02, OA04-08, OA10, OA12-13 (autorregulación,
  identidad/preferencias propias, planificación de juegos, juego sociodramático —
  dependen de la vivencia personal de cada niño/a, sin respuesta objetiva única).
- **Convivencia y Ciudadanía** (3): Resolución Pacífica, Normas de Convivencia,
  Seguridad y Cuidado — OA05-07. Fuera: OA01-04, OA08-11 (participación colaborativa,
  empatía vivida, apreciación cultural/diversidad — vivencia grupal real o juicio
  subjetivo sin respuesta única).
- **Corporalidad y Movimiento** (2): Ubicación y Tiempo, Movimientos del Cuerpo —
  OA04, OA09. Fuera: OA01-03, OA05-08 (práctica motriz real: cuidado corporal,
  ejercitación, coordinación, fuerza/equilibrio — requieren movimiento físico real).

**Ámbito Interacción y Comprensión del Entorno**:
- **Pensamiento Matemático** (9): Patrones, Clasificar, ¿Dónde está?, Más/Menos/Igual,
  Antes y Después, Contar hasta 20, Sumar y Quitar, Formas y Cuerpos, Medir — OA01-08,
  OA10-11. Fuera: OA09 (representar objetos desde distintas perspectivas — dibujo/foto)
  y OA12 (comunicar el proceso de resolución de un problema), ambos de producción
  gráfica/oral propia, no aptos para el motor de opción múltiple.
- **Exploración del Entorno Natural** (5): Agua y Sol, Materiales de la Naturaleza,
  Animales y Plantas, Ciclos de Crecimiento, Cuidado del Ambiente — OA03-04, OA06-07,
  OA11-12. Fuera: OA01-02, OA05, OA08-10 (proceso de indagación propio: asombro,
  conjeturas, explorar cambios al aplicar fuerza/calor, comunicar hallazgos —
  dependen de una experiencia vivida, no de un hecho con respuesta única).
- **Comprensión del Entorno Sociocultural** (4): Roles de mi Comunidad, Objetos
  Tecnológicos, Instituciones de mi Comunidad, Seguridad y Prevención — OA01, OA03,
  OA07, OA10. Fuera: OA02, OA04-06, OA08-09, OA11 (formas de vida de otras
  culturas/épocas, historia de inventos, relatos históricos propios, patrimonio,
  biografías, estrategias de indagación con TICs — arriesgan datos históricos/
  biográficos inexactos sin fuente adicional, mismo criterio que excluyó "personajes
  históricos" en Historia de 1° básico, o dependen de indagación propia del niño/a).

Fuentes exactas por núcleo están citadas como comentario al inicio de cada
`content/parvularia/<nombre>.js`.

### 1° Básico — ✅ completo (31 módulos, las 9 asignaturas aplicables)
Todo el contenido está basado en OA reales del Decreto 439/2012, extraídos de
curriculumnacional.cl/curriculum/1o-6o-basico/<asignatura>/1-basico. En cada asignatura
quedaron algunos OA fuera del motor de opción múltiple (marcados abajo); estos son los
candidatos naturales si se quiere cobertura 100% literal del curso, pero típicamente son
OA de desempeño/creación (dibujar, cantar, moverse, opinar) que no se prestan a preguntas
de opción múltiple sin una reinterpretación forzada.

- **Lenguaje** (5): Vocales, Sílabas, Letras (memorama), Palabras, Comprensión.
- **Matemática** (4): Contar, Sumar, Comparar, Formas.
- **Ciencias Naturales** (5): Seres Vivos, Plantas, Mi Cuerpo, Materiales, Día y Noche —
  OA1-OA4, OA6-OA9, OA11-OA12. Fuera: OA5, OA10, las 4 OAH.
- **Historia, Geografía y Cs. Sociales** (5): Calendario, Mi Identidad, Símbolos de
  Chile, Mapas de Chile, Convivencia y Comunidad — OA1-06, OA8-11, OA13-15. Fuera: OA07
  (personajes históricos — riesgo de datos inexactos sin fuente adicional) y OA12
  (niños del mundo — riesgo de generalización cultural sin fuente).
- **Artes Visuales** (3): Colores, Líneas y Texturas, Materiales de Arte — OA1-03.
  Fuera: OA04-05 (apreciación/opinión personal sobre obras, subjetivo).
- **Música** (2): Sonidos, Instrumentos — OA01, OA04. Fuera: OA02-03, OA05-07
  (expresión, repertorio, improvisación, presentación en vivo — dependen de audio real).
- **Educación Física y Salud** (3): Cuerpo en Movimiento, Vida Activa y Saludable,
  Juego Limpio y Seguridad — OA01-02, OA06-11. Fuera: OA03-05 (variedad de juegos,
  entornos, expresión corporal — dependen de práctica física real).
- **Orientación** (3): Mis Emociones, Autocuidado y Hábitos, Buena Convivencia —
  OA02, OA04-08. Fuera: OA01, OA03 (autodescripción y expresión de afecto, subjetivo).
- **Tecnología** (1): Herramientas y Materiales — OA02-03. Fuera: OA01, OA04-06
  (diseño propio, evaluación de resultados, uso de software real — procesos prácticos).
- **Religión** e **Inglés** no se incluyeron: Religión tiene variantes por credo que
  Mineduc no unifica en un solo documento curricular, e Inglés parte recién en 5° básico
  según el currículum nacional.

### 2° Básico — ✅ completo (33 módulos, las 9 asignaturas)
Todo basado en OA reales del Decreto 439/2012, extraídos de curriculumnacional.cl/
curriculum/1o-6o-basico/<asignatura>/2-basico (páginas por-OA individuales,
verificadas cruzando el listado agregado contra al menos una página `<código>-oa-01`
por asignatura). Igual que en 1° básico, cada asignatura documenta qué OA quedaron
fuera y por qué en el comentario inicial de su archivo `content/<asignatura>.js`
(sección `_G2`/`MODULES_G2`).

- **Lenguaje** (4): Combinaciones, Secuencia, Gramática (concordancia género/número,
  sustantivo/adjetivo — OA19-20), Comprensión II (inferencia en narraciones y textos
  no literarios — OA03,05,07).
- **Matemática** (4): Salta y Cuenta, Multiplicar, Geometría (posición izq/der,
  figuras 2D, figuras 3D con el nuevo `paralelepipedo` en `solid3DSVG` — OA14-16),
  Medición (calendario, hora digital, longitud cm/m — OA17-19).
- **Ciencias Naturales** (6): Vertebrados e Invertebrados, Ciclos de Vida, Hábitats y
  Cuidado Animal, Mi Cuerpo por Dentro, El Agua, Clima e Instrumentos — OA01-13.
  OA14 no se repite (ya lo cubre "Día y Noche" de 1° básico, estaciones del año).
- **Historia, Geografía y Cs. Sociales** (4): Pueblos Originarios (zona geográfica —
  OA10-11), Patrimonio de Chile natural, Paisajes de Chile por zona, Formación
  Ciudadana — OA06-16 (parcial). Fuera: OA01-04 (modos de vida y aportes culturales
  detallados de pueblos precolombinos — riesgo de datos históricos/etimológicos
  inexactos sin fuente adicional más profunda que la lista de OA, mismo criterio que
  excluyó "personajes históricos" en 1° básico); OA05 no se repite (ya lo cubre
  "Símbolos de Chile" de 1° básico).
- **Artes Visuales** (1): Líneas y Colores (línea vertical/horizontal/diagonal/
  espiral/quebrada vía el nuevo helper `lineTypeSVG`; color primario/secundario) —
  OA02. Fuera: OA01,03 (producción propia) y OA04-05 (opinión, subjetivo).
- **Música** (1): Timbre y Pulso — cubre específicamente timbre (qué instrumento
  produce un sonido) y elementos del lenguaje musical (pulso, acento), ya que altura/
  intensidad/duración las cubre "Sonidos" de 1° básico — OA01 (parcial). Fuera:
  OA02-07 (expresión subjetiva, repertorio específico, cantar/tocar, improvisar,
  presentar, reflexión personal).
- **Educación Física y Salud** (3): Mi Cuerpo Responde, Vida Activa y Saludable II,
  Juego en Equipo y Liderazgo — OA06-11. Fuera: OA01-05 (habilidades motrices,
  juegos, entornos, expresión corporal — requieren práctica física real).
- **Orientación** (4): Mis Emociones II (escenas, no solo emoji), Autocuidado y
  Hábitos II, Hábitos de Trabajo Escolar (nuevo este año, OA08), Buena Convivencia II
  (resolución de conflictos por escenario) — OA02,04-06,08. Fuera: OA01,03,07
  (autodescripción, expresión de afecto, pertenencia a grupos — subjetivo).
- **Tecnología** (1): Tecnología Digital (software de dibujo, procesador de texto,
  uso seguro de internet) — OA05-07. Fuera: OA01-04 (diseñar/elaborar/evaluar un
  objeto tecnológico propio — producción práctica).

### 3° a 8° Básico, Educación Media, EPJA — 🔒 sin construir
`GRADES` los tiene marcados `open:false`. Para desbloquear un año, cambiar su
`open` a `true` Y crear su entrada correspondiente en `LENGUAJE_BY_GRADE` /
`MATE_BY_GRADE` (si no existe una entrada, `renderComingSoonSubject()` se muestra
automáticamente como placeholder — no rompe nada, pero tampoco es jugable).

## Próximos pasos sugeridos (en orden)

**Plan en curso (definido con el usuario 2026-07-20): completar Educación Básica
completa (3° a 8°) antes de tocar Educación Media o EPJA.** Cada PR se confirma
individualmente con el usuario antes de mergear (no hay merge automático en bloque
para esta iniciativa).

1. ~~Completar 2° básico~~ — ✅ hecho, las 9 asignaturas completas (ver "Estado
   actual del contenido" arriba).
2. **Siguiente:** extraer los OA de 3° básico de curriculumnacional.cl
   (`curriculumnacional.cl/curriculum/1o-6o-basico/<asignatura>/3-basico`, mismo
   patrón que funcionó para 2° básico) para las 9 asignaturas, y repetir el patrón:
   `<NOMBRE>_MODULES_G3`/`_POS_G3` en cada `content/<asignatura>.js`, agregar
   `3: {...}` a cada `*_BY_GRADE` en `gradeContent.js`, registrar en `MC_GAMES`/
   `MC_KEYS`, agregar estrellas en `state.js` y títulos en `rewards.js`. Luego
   repetir para 4°, 5°, 6°, 7° y 8° básico en orden (7°-8° son parte de Educación
   Básica en la trayectoria chilena actual, verificar la lista exacta de asignaturas
   vigente para esos años en curriculumnacional.cl antes de asumir que es la misma
   que 1°-6°, ya que podría incluir asignaturas nuevas como Inglés desde 5° básico).
3. Una vez completa toda Educación Básica, definir con el usuario el mismo patrón
   para Educación Media (probablemente asignaturas distintas: Física/Química/
   Biología separadas, Filosofía, etc. — pedir la lista real antes de asumir) y
   luego EPJA (currículum propio, organizado por niveles que agrupan varios años
   en uno, no por año individual — revisar su decreto específico antes de construir,
   no asumir que es igual a Básica/Media regular).
4. ~~Evaluar agregar persistencia real (localStorage)~~ — ✅ hecho (`js/persistence.js`).
   Si más adelante se quiere progreso sincronizado entre dispositivos, ahí sí se
   necesitaría un backend real (Firebase/Supabase u otro) — GitHub Pages es hosting
   estático puro, no puede correr una base de datos ni lógica de servidor.
5. Si se quiere cobertura 100% literal de 1° básico, revisar los OA marcados "fuera"
   en cada asignatura (arriba) y decidir si vale la pena forzarlos al motor de opción
   múltiple o si requieren un tipo de juego nuevo (p. ej. grabación de voz para Música,
   o un lienzo de dibujo para Artes Visuales).
6. ~~Construir los 7 núcleos restantes de Educación Parvularia NT~~ — ✅ hecho, los 8
   núcleos de NT están completos (ver "Estado actual del contenido" arriba). Si más
   adelante se quiere cobertura 100% literal de algún núcleo, revisar los OA marcados
   "fuera" arriba y decidir si vale la pena forzarlos al motor de opción múltiple o si
   requieren un tipo de juego nuevo (p. ej. movimiento físico real para Corporalidad,
   o producción plástica propia para Lenguajes Artísticos). Evaluar si construir Nivel
   Medio/Sala Cuna tiene sentido en algún momento, dado que ese rango de edad
   generalmente no usa juego en pantalla (revisar el Decreto 481/2017 para esos
   niveles antes de decidir).
7. **Ideas del usuario para explorar más adelante (aún no implementadas, solo
   anotadas — 2026-07-20):**
   - Evaluar qué tan distinto debería ser el diseño (colores, formas, sonidos, ritmo
     de feedback) para captar la atención de perfiles neurotípicos vs. neurodivergentes.
     Requiere investigación/fuente antes de implementar cualquier variante, por la
     misma regla de oro del proyecto (no inventar sin base).
   - Sistema de verificación de edad y conocimientos previos para desbloquear niveles
     más avanzados (algún tipo de prueba de acceso). Pendiente de definir criterios.

## Convenciones a mantener

- Español de Chile en todo el copy visible al usuario.
- Paleta de color en variables CSS (`:root`) — no hardcodear colores nuevos sin
  agregarlos ahí primero.
- Los generadores de rondas (`genXxxRound`) deben producir contenido *dinámico/
  aleatorio* cuando sea posible (números, combinaciones al azar) en vez de bancos
  estáticos gigantes — esto fue un pedido explícito del usuario ("que no se parezca
  una ronda a otra").
- Antes de dar por buena una edición grande, servir el sitio con un servidor HTTP local
  (los módulos ES no cargan vía `file://` por restricciones CORS del navegador — no basta
  con abrir `index.html` directo) y probar en el navegador: revisar la consola por errores
  de import/export, y ejecutar los generadores (`MC_GAMES[key].gen()`) varias veces por
  juego para pescar bugs de opciones duplicadas o texto `undefined` antes de que aparezcan
  jugando. El proyecto no tiene tests automatizados más allá de eso.
