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

**Excepción explícita y acotada a esta regla: "Estudio para Pruebas"** (ver
sección propia más abajo). Pedido directo del usuario (2026-07-26): una etapa
nueva, al mismo nivel que Parvularia/Básica/Media/EPJA, para preparar exámenes
universitarios reales de un familiar (Tecnología Médica, Universidad Central de
Chile) — el contenido no cita OA de Mineduc porque no es currículum escolar
chileno, sino los apuntes/clases/guías de laboratorio/insertos de reactivos
reales del curso universitario. Es la única etapa de la app donde esto aplica;
no cambia la regla de oro para el resto de LEO (Parvularia a 8° básico siguen
exigiendo OA reales de Mineduc como siempre).

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
                           sfxWrong, sfxStreak, sfxLevelup). `speak(text, lang)` acepta
                           un `lang` opcional ('es' por defecto) para buscar una voz en
                           otro idioma — usado por content/ingles.js (5° básico, la
                           primera asignatura en otro idioma) vía `speakLang:'en'` en
                           la ronda, reenviado por mcEngine.js al botón "Escuchar".
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
    ingles.js                 Inglés (desde 5° básico, primera asignatura en otro
                              idioma — ver "Estado actual del contenido").
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
    estudioPruebas/           etapa "Estudio para Pruebas" (ver excepción a la regla de
                              oro arriba) — organizada por submódulo (asignatura
                              universitaria), no por año/núcleo, ya que aquí no existe
                              una trayectoria escolar Mineduc que seguir. Mismo patrón de
                              archivo que un núcleo de Parvularia (bancos + genXxxRound +
                              MODULES/POS), un nivel más profundo que content/.
      quimicaDiagnostica.js    submódulo Química Diagnóstica (11 módulos): casos clínicos
                              reales (función renal, función hepática, líquidos
                              biológicos, LCR) + bancos factuales (valores críticos,
                              control de calidad, endocrinología/marcadores tumorales,
                              gases arteriales, páncreas, reactivos). Contenido extraído
                              literalmente de los apuntes/clases/guías del curso real
                              (nunca inventado) — ver "Estudio para Pruebas" en "Estado
                              actual del contenido" para el detalle de fuentes y
                              metodología de extracción.
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
    diccionario.js             Diccionario Español + English Dictionary — herramienta
                              de consulta transversal (NO es un juego: sin rondas,
                              estrellas ni XP), accesible desde etapaMap bajo
                              "Herramientas de consulta" (pedido explícito del usuario,
                              2026-07-22). Un solo módulo con dos pantallas
                              (`diccionarioEs`/`diccionarioEn` en render.js, ambas
                              renderizadas por `renderDiccionarioScreen(lang)` +
                              `initDiccionario()`). Contenido 100% curado dentro del
                              archivo (~109 palabras ES con tipo/definición/ejemplo,
                              ~84 pares EN con traducción/ejemplo) — deliberadamente
                              SIN API externa: una API de diccionario no garantiza
                              contenido apto para niños, requiere conexión y rompería
                              la regla de cero dependencias. Buscador con
                              normalización de tildes (NFD + strip de diacríticos:
                              "volcan" encuentra "Volcán"); en inglés la búsqueda es
                              bidireccional (por palabra inglesa o por su traducción).
                              La voz reutiliza speak() — español por defecto, 'en'
                              para el diccionario de inglés (mismo mecanismo
                              speakLang de content/ingles.js). El botón 🔊 usa
                              onclick="diccSpeak(i)" con un índice sobre la lista
                              visible (module state) en vez de incrustar el texto en
                              el atributo — así ninguna definición puede romper el
                              HTML por comillas (la restricción documentada de
                              speakText en mcEngine.js, resuelta aquí por diseño).
                              CSS propio en styles.css (familia .dicc-*).
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
- **Tipografías de trazado (`TYPO_STYLES` en `js/games/traza.js`):** además de las
  formas de grafomotricidad, el texto guía se puede dibujar en 4 tipografías —
  imprenta MAYÚSCULA, imprenta minúscula, manuscrita MAYÚSCULA y manuscrita
  minúscula — pedido explícito del usuario para que la práctica de escritura no
  se limite a un solo estilo de letra. Imprenta usa Baloo 2 (la fuente de
  siempre). **Manuscrita usa "Playwrite ES" para mayúscula y minúscula por
  igual** — una tercera fuente de Google Fonts agregada solo para esto (mismo
  mecanismo CDN ya aprobado para Baloo 2/Quicksand, ver "Stack técnico").
  Se probó primero "Playwrite CL" (la variante específica de Chile), pero su
  diseño por defecto mezcla mayúsculas "simples" (A, N) con mayúsculas
  "decorativas" muy ornamentadas (Q, T, Z — difíciles de leer para un niño de
  5-6 años, confirmado en la ficha oficial del tipo en Google Fonts; no hay
  forma vía CSS de pedir una variante más simple — se probaron los stylistic
  sets ss01-09 y character variants cv01-10 sin ningún efecto, la versión que
  sirve Google Fonts vía CDN no expone esos alternates). Por eso una primera
  pasada usaba Baloo 2 como sustituto para la mayúscula manuscrita — pero el
  usuario pidió explícitamente una mayúscula manuscrita "real", no una
  sustituta. Investigando otras variantes de país de la misma familia
  Playwrite se encontró que **"Playwrite ES" (España) ya modela por defecto
  el estilo "híbrido"** (minúscula ligada + MAYÚSCULA de imprenta simple, sin
  ornamentar) — que es justamente el modelo que usan los cuadernos de
  caligrafía más comunes en Chile (Cuadernos Rubio, Santillana). Por eso
  "Manuscrita MAYÚSCULA" ahora es una fuente real y dedicada (no Baloo 2), y
  se ve *parecida* a "Imprenta MAYÚSCULA" (ambas son letra de molde simple)
  pero no idéntica — son tipografías distintas (Playwrite ES es más angosta
  y menos redondeada que Baloo 2 bold), y esa similitud de estilo es fiel al
  modelo real, no una coincidencia ni un bug. Para dígitos (que no tienen
  mayús/minús) el cuaderno de Caligrafía usa `imprenta-mayus`/`manuscrita-mayus`
  (cualquiera de los dos ids de cada familia sirve, ya que el case-transform
  es un no-op sobre números).
  `guide` en `initTraceCanvas()` acepta `{text, styleId}` además del string
  plano (compatibilidad hacia atrás: un string sigue dibujándose en imprenta
  MAYÚSCULA, el look original) y del objeto `{shape}` para grafomotricidad.
  Como una fuente recién solicitada puede no estar descargada en el primer
  `fillText()` (se dibuja con la fuente de respaldo del navegador mientras
  carga, y `document.fonts.ready` no es una señal confiable para saber cuándo
  terminó — un `<canvas>` no siempre cuenta como "necesito esta fuente" a
  tiempo para ese promise), `initTraceCanvas()` pide la carga explícita de la
  fuente puntual vía `document.fonts.load()`/`check()` antes de dibujar, y
  además el módulo precarga las 4 variantes de `TYPO_STYLES` apenas se
  importa. Cada llamada a `initTraceCanvas()` clona y reemplaza el `<canvas>`
  en el DOM (en vez de reutilizar el nodo existente) para descartar los
  listeners de pointerdown/move/up de una llamada anterior — necesario
  porque "Escribe tu Nombre" ahora deja al niño cambiar de estilo sin
  re-renderizar toda la pantalla, y sin este descarte los listeners se
  acumularían uno por cada cambio de estilo. "Escribe tu Nombre" agrega un
  selector de 4 chips (`.typo-selector`/`.typo-chip` en `styles.css`) para
  elegir el estilo; "Caligrafía" practica las 5 vocales en las 4 tipografías y
  los números 1-5 en 2 (imprenta/manuscrita), por lo que el cuaderno pasó de
  18 a 38 hojas (8 trazos básicos + 5×4 vocales + 5×2 números).
- **Puntaje de trazado (`getStars()`, devuelto por `initTraceCanvas()` junto a
  `clear`):** pedido explícito del usuario — antes "Escribe tu Nombre" y
  "Caligrafía" otorgaban siempre 3 estrellas fijas sin mirar el trazo real,
  ahora las estrellas reflejan qué tan bien se repasó. `initTraceCanvas()`
  mantiene un `<canvas>` invisible en paralelo (`inkCanvas`) que acumula solo
  la tinta real del niño (sin la guía tenue de fondo), con la misma
  transformación/coordenadas que el canvas visible. Al llamar `getStars()`,
  se rasteriza la misma guía a opacidad completa en un canvas aparte (nunca
  mostrado) y se compara contra la tinta acumulada en una grilla de 28×28
  celdas (`gridScore()` en `traza.js`) — no píxel a píxel, para tener
  tolerancia natural y ser rápido. Se calculan dos métricas: *cobertura*
  (qué fracción de la guía quedó repasada) y *precisión* (qué fracción de la
  tinta cayó cerca de la guía), cada una dilatada ±1 celda para dar
  tolerancia simétrica (un trazo de un niño de 5-6 años nunca va a calcar el
  modelo a la perfección). El puntaje final es el **mínimo** de ambas
  métricas, no el promedio — promediarlas dejaba puntaje alto a una sola
  rayita que pasara justo por el medio de la palabra (mucha precisión, poca
  cobertura, pero el promedio salía "excelente"); con el mínimo, hace falta
  cubrir la mayoría de la guía Y mantenerse cerca de ella. Se mapea a 0-3
  estrellas (`starsFromScore()`); 0 si no se dibujó nada. La máscara de la
  guía (`forMask=true` en `drawGuideText`/`drawGuideShape`) usa el mismo
  grosor de trazo que se le muestra al niño (antes se probó una máscara
  artificialmente más gruesa "para dar tolerancia", pero eso hacía que un
  trazo perfectamente centrado — más angosto que la máscara inflada — nunca
  llegara a cubrirla del todo, aunque el niño repasara la letra a la
  perfección; la tolerancia real vive en la dilatación por celda, no en
  inflar la máscara). "Escribe tu Nombre" usa el puntaje de esa única pasada;
  "Caligrafía" promedia (redondeado) el puntaje de las 38 hojas al terminar
  el cuaderno.
- **Jerarquía de pantallas:** `home` → `etapaMap` (Parvularia/Básica/Media/EPJA) →
  `gradeMap` (islas 1°-8° básico, `selectGrade(id)` guarda `state.currentGrade`) →
  `subjectMap` (lista de asignaturas, lee `state.currentGrade`) →
  `lenguajeMap` / `matematicasMap` / `cienciasMap` / `historiaMap` / `artesMap` /
  `musicaMap` / `edfisicaMap` / `orientacionMap` / `tecnologiaMap` (módulos del año
  actual) → juego individual. Aparte de esta jerarquía, `etapaMap` también lleva
  directo a `estudioPruebasMap` (tarjetas de submódulo, sin año/nivel intermedio) →
  `quimicaDiagnosticaMap` (u otro submódulo futuro) → juego individual — ver
  "Estudio para Pruebas" más abajo.
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
- **Botón "Recurso" (micro-lección conceptual, agregado 2026-07-27):** pedido
  explícito del usuario, con un prompt detallado de UX/EdTech, para transformar cada
  pregunta en una oportunidad de aprendizaje — no una pista para adivinar la
  respuesta, sino una explicación del concepto evaluado (qué es / cómo funciona /
  por qué importa), visible incluso si el niño responde mal. Igual que `explain`,
  cualquier `genXxxRound()` puede incluir un campo opcional `recurso` (string HTML,
  ~80-200 palabras) en el objeto que retorna. Cuando `recurso` está presente,
  `mcEngine.js` dibuja un botón "📚 Recurso" junto a "🔊 Escuchar" dentro de
  `.prompt-actions`; al tocarlo, `showMCRecurso()` (mcEngine.js) llama a
  `showRecurso(texto, título)` (rewards.js), que abre un modal (`.recurso-overlay`/
  `.recurso-card`, mismo lenguaje visual que `.explain-card`/`.result-card`) con
  scroll interno, animación de entrada/salida, y cierre libre (botón ✕ o tocar el
  fondo) que **no bloquea ni afecta el avance de la ronda** — a diferencia de
  `showExplain()`, que si pausa el juego hasta que el niño confirma haber
  entendido. `recurso` se puede escribir con 2 granularidades distintas según lo
  que necesite el módulo: **por generador** (un solo texto fijo, reusado en todas
  las rondas de ese `genXxxRound()`) cuando el concepto evaluado es siempre el
  mismo aunque el ítem específico cambie cada ronda — p. ej. "Contar" (1° básico)
  siempre enseña sobre la correspondencia uno a uno, sin importar qué objeto o
  cantidad le toque al niño; o **por ítem del banco** (`item.recurso`, reenviado
  por el generador como `recurso: item.recurso`) cuando cada ítem del banco cubre
  un concepto genuinamente distinto — el caso de Química Diagnóstica, donde un
  mismo módulo puede pasar de un caso de glomerulonefritis a una fórmula de
  clearance de creatinina en la ronda siguiente, y un solo texto genérico por
  generador no sería realmente "contextual a la pregunta actual" como pide el
  pedido original del usuario.
  - **Estado del rollout (actualizado 2026-07-27, tras revisión del usuario):**
    motor implementado de forma universal (cualquier `genXxxRound()` de
    cualquier año/asignatura puede usarlo). Contenido completo en:
    - **1° básico** (piloto inicial, por generador): Lenguaje (`genVocalRound`,
      `genPalabraRound`, `genComprensionRound`) y Matemática (`genCountRound`,
      `genAddRound`, `genCompareRound`, `genFormaRound`) — 7 módulos.
    - **Estudio para Pruebas → Química Diagnóstica** (por ítem del banco, a
      pedido explícito del usuario de priorizar este módulo antes que
      cualquier otro): los 11 módulos completos, ~116 ítems individuales, cada
      uno con su propio `recurso` de 120-180 palabras (qué es/cómo funciona/
      por qué importa/aplicaciones), sin actuar nunca como pista de la
      respuesta. Verificado con fuzz test: 0% de ítems sin `recurso`, sin
      texto `undefined`, conteo de palabras dentro de rango en los 11
      generadores (300 iteraciones cada uno).
    - Pedido explícito del usuario: **no avanzar a otros módulos/grados hasta
      que revise y apruebe personalmente la calidad pedagógica, el tono, la
      profundidad y la experiencia de usuario de Química Diagnóstica.** El
      resto de los ~300 módulos de opción múltiple de la app (2°-8° básico,
      Parvularia, Microbiología Clínica) todavía no tienen `recurso` — se
      degradan con gracia (sin el campo, el botón simplemente no aparece).
      Una vez aprobado Química Diagnóstica, el plan acordado es continuar
      grado por grado con el mismo enfoque de calidad. Los juegos a medida
      (Sílabas, Secuencia, Memorama) no usan este motor y por ahora no tienen
      botón Recurso.
- **Optimización de espacio en las alternativas y responsive (2026-07-27):**
  mismo pedido de UX/EdTech de arriba. `.option-btn`/`.option-btn.panel` pasaron de
  tamaño de fuente fijo (24-30px) a `clamp()` fluido, con menos padding y sin el
  `letter-spacing`/`word-spacing` extra que sobraba para respuestas largas tipo
  párrafo (como los casos clínicos de Estudio para Pruebas) — reduce bastante el
  alto vertical desperdiciado sin afectar los módulos con respuestas cortas.
  `#app` (antes fijo en `max-width:480px` en cualquier pantalla) ahora se ensancha
  en 2 escalones (`640px`/`960px` de ancho de viewport) y el grid de opciones pasa
  a 3 columnas en pantallas anchas — el diseño sigue siendo mobile-first a
  propósito (nada cambia por debajo de 640px), solo aprovecha mejor tablet/
  escritorio en vez de dejar franjas vacías a los costados.
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

**Auditoría de íconos vs. texto en toda la app (2026-07-21):** pedido
explícito del usuario tras encontrar que "el vaso de agua está al lado del
plato" (Corporalidad y Movimiento) usaba 🥛 — que es literalmente un vaso
de LECHE, no de agua. En vez de corregir solo ese caso puntual, se revisó
cada emoji/ícono de `js/content/*.js`, `js/content/parvularia/*.js` y
`js/games/*.js` contra la palabra o concepto que representa, buscando la
misma categoría de error (un emoji que se lee como algo distinto de lo que
dice el texto), no solo emoji que no se renderizan (esa categoría ya se
había auditado antes, ver "Segunda auditoría exhaustiva de NT" más abajo).
Se encontraron y corrigieron ~20 casos:

- **Objeto equivocado:** ANCLA usaba 🪁 (una cometa) → ⚓. ESCUELA usaba 🚂
  (un tren) → 🏫. IGLÚ usaba 🧊 (un cubo de hielo, sin relación con la
  cúpula de un iglú) → `igluSVG()` nuevo. "Vaso de vidrio" (Ciencias
  Naturales) usaba 🍶 (una botella de sake) → `vasoVacioSVG()` nuevo, mismo
  criterio que ya corrigió 🥛→`vasoAguaSVG()`. CARTÓN (Tecnología) usaba 🧻
  (un rollo de papel higiénico) → 📦. "La Gran Muralla China" (Historia)
  usaba 🕌 (una mezquita) → 🧱 (no existe emoji de muralla, ladrillos es la
  aproximación más cercana).
- **Herramienta en vez del material real:** "la plastilina" aparecía dos
  veces (Ciencias Naturales con 🖌️ pincel, Artes Visuales con 🖍️ crayón) —
  ninguno de los dos es plasticina, son herramientas de dibujo. Se creó
  `plasticinaSVG()` (un bloque moldeable con la marca de un pulgar) y se usa
  en ambos archivos.
- **Órgano representado por su función, no por sí mismo:** ESTÓMAGO (Ciencias
  Naturales 2° básico) usaba 🍽️ (plato con cubiertos, "comida") en vez del
  órgano — inconsistente con que el resto del banco (❤️ corazón, 🫁
  pulmones, 🦴 esqueleto) sí muestra el órgano real. Se creó `estomagoSVG()`.
  "Iris" (vocal I) usaba 🌈 (arcoíris) — un niño que reconoce la imagen
  diría "arcoíris", no "iris", rompiendo el juego de "¿con qué vocal
  empieza?"; se cambió la palabra completa a INSECTO (🐜), que sí tiene una
  vocal I inicial y un emoji que representa exactamente lo que dice. "Un
  afiche se decolora" usaba 🌓 (fase de la luna, sin relación) → 🖼️.
- **Ícono al revés de lo que dice el texto (el más engañoso):** dos ítems
  "falso" describían una MALA conducta (botar basura al suelo, dejar
  materiales tirados) pero usaban 🗑️ — un basurero, que en realidad
  representa la buena acción de botar la basura EN SU LUGAR. Se cambiaron a
  🚯 ("prohibido botar basura"). Otro ítem "falso" ("no lavarse las manos
  antes de comer") usaba 🧴 (una botella de jabón/crema, que sugiere buena
  higiene) → 🦠 (gérmenes, la consecuencia real de no lavarse las manos).
- **Emoji crudo reutilizado donde ya existía un SVG propio:** 🪥 (cepillo de
  dientes), 🪨 (piedra) y 🪞 (espejo) ya tenían `toothbrushSVG()`/
  `piedraSVG()`/`espejoSVG()` construidos para otros archivos (no se
  renderizan en varios navegadores), pero seguían apareciendo crudos en
  `lenguaje.js`, `ciencias.js`, `artes.js`, `orientacion.js` y
  `games/secuencia.js` porque esos archivos no formaron parte de la
  auditoría original (esa fue solo de Educación Parvularia NT). Se
  reemplazaron por los helpers existentes en todos esos lugares. Lo mismo
  con "Capullo" (secuencia de la mariposa en `games/secuencia.js`), que
  usaba 🍃 (una hoja) en vez de `crisalidaSVG()` (ya construido para el
  mismo concepto en `exploracionEntornoNatural.js`).
- **Acciones/movimientos que no correspondían al gesto descrito** (Educación
  Física y Salud, "Cuerpo en Movimiento", 1° básico): 🧎 REPTAR mostraba a
  alguien ARRODILLADO, no arrastrándose; 🥅 ATRAPAR UNA PELOTA era un arco de
  fútbol, no la acción de atrapar; 🧘 EQUILIBRIO EN UN PIE era una postura de
  meditación sentada; 🤹 GIRAR era hacer malabares; 🤺 CAMINAR SOBRE UNA
  LÍNEA era esgrima. Se reemplazaron las 10 acciones del banco por
  `personActionSVG()` — la misma figura de palitos animada que ya existía
  para Corporalidad y Movimiento (Educación Parvularia) — extendiendo su set
  de 8 a 12 acciones (`lanzar`, `atrapar`, `patear`, `equilibrio` nuevas).
  "Caminar sobre una línea sin caerse" reusa la acción `equilibrio` por ser,
  en esencia, la misma habilidad motriz.

Casos evaluados y dejados como están por ser aproximaciones razonables sin
alternativa mejor (cóndor/huemul por ave/animal similar sin emoji propio,
empanada≈dumpling, 🍯 para "panal" pese a ser un tarro de miel y no un
panal): no valía la pena forzar un SVG nuevo cuando el emoji ya comunica el
concepto con suficiente fidelidad para un niño de 6-7 años.

**Escenas de ubicación relativa sin objeto de referencia (2026-07-21,
seguimiento del punto anterior):** el usuario revisó la corrección del vaso
de agua y notó un problema más profundo, no solo de qué ícono usar: la
escena solo mostraba el vaso, no el plato — la mitad de la oración ("___
del plato") no tenía ningún respaldo visual. Todas las preguntas de
ubicación relativa de la app seguían este mismo patrón (mostrar solo al
sujeto, nunca la referencia), incluyendo `POSICION_ESCENAS` en
`pensamientoMatematico.js` (ya existía antes de esta sesión) — el osito
"entre las dos almohadas" tampoco mostraba las almohadas. Se agregó
`refs` (1-2 íconos de la referencia) a cada escena de
`ESCENAS_ESPACIAL_NT` (`corporalidadMovimiento.js`) y `POSICION_ESCENAS`
(`pensamientoMatematico.js`), y un helper compartido
`sceneRefsHTML(subject, refs)` en `utils.js` que arma
referencia-sujeto-referencia (si hay 2, para "entre") o sujeto-referencia
(si hay 1) — así la mitad de la oración que antes solo existía en texto
ahora también se ve. Para referencias sin buen emoji se dibujaron
`nidoSVG()`, `groundSVG()` y `cojinSVG()` en `svg.js` (mismo criterio que
el resto de SVGs propios: emoji de nido/cojín son adiciones Unicode
2021-2022 con el mismo riesgo de no renderizarse que 🪥/🪮/etc.); donde ya
existía un emoji confiable se reusó directamente (🍽️ plato, 🏠 casa, 🪑
silla, 💧 agua, 🕳️ cueva, 🧍/🏁/👫 como referencias de persona/grupo/meta).

**Verificación real de "sin preguntas repetidas" en toda la app (2026-07-21):**
el usuario pidió confirmar explícitamente que ningún módulo repite preguntas
dentro de una partida. En vez de asumirlo, se simuló una partida completa
(mismo algoritmo de `roundSignature`/reintentos que usa `drawMCRound()` en
`mcEngine.js`) cientos de veces por módulo, para los ~90 `MC_KEYS`. Se
encontraron dos niveles de problema:

- **11 módulos con repetición garantizada en el 100% de las partidas**
  (`clima2`, `pueblos2`, `paisajes2`, `ciudadania2`, `cuerporesponde2`,
  `vidaactiva2`, `liderazgo2`, `autocuidado2`, `habitosescolares2`,
  `convivencia2`, `tecdigital2` — todos módulos "II" de 2° básico): su banco
  de contenido tenía **menos ítems únicos que `rounds` configurado** (p.ej.
  `tecdigital2` tenía solo 4 preguntas posibles para 8 rondas). Se amplió
  cada banco con ítems reales dentro del mismo OA ya citado en el archivo
  (nunca un OA nuevo) hasta dejar margen de al menos +2 sobre `rounds`
  (`clima2` de 7→11 combinaciones únicas, `tecdigital2` de 4→10, etc.).
- **7 módulos con una probabilidad residual pequeña pero real** (hasta
  ~0.5% por partida): su banco tenía exactamente el mismo tamaño que
  `rounds` (sin margen — el patrón más común en la app, documentado como
  intencional en el resto de esta sección), lo que deja una posibilidad
  estadística remota de que los 60 reintentos de `drawMCRound()` no
  alcancen a encontrar la última combinación única a tiempo. En vez de
  agrandar banco por banco (habría afectado casi todos los módulos de la
  app, ya que ese es el patrón estándar), se subió el límite de reintentos
  de 60 a 300 en `mcEngine.js` — reduce esa probabilidad a
  estadísticamente nula sin tocar contenido.

Verificado al final: los ~90 módulos de opción múltiple de la app pasan
2000 sesiones simuladas cada uno sin ningún repetido.

**Ampliación de los 7 módulos "sin margen" (mismo día, pedido explícito
del usuario de no conformarse con el parche de motor):** aunque subir los
reintentos a 300 ya dejaba la probabilidad de repetición estadísticamente
nula, se amplió además el contenido real de `colores`, `sonidos`,
`movimiento` y `seguridad` (1° básico Ed. Física/Artes/Música) y
`resolucionnt`/`normasnt`/`seguridadnt`/`materialesnaturalnt` (NT) para que
también tengan margen real sobre `rounds`, mismo criterio que los 11
módulos anteriores. Detalle no trivial encontrado de paso: `seguridad`
(Educación Física 1° básico) todavía usaba el emoji crudo 🪖 para "usar
casco" — un casco MILITAR, no de bicicleta/patines — pese a que el archivo
ya importaba `cascoSVG()` (se había importado pero nunca se llegó a usar
en ese ítem específico durante la auditoría de íconos). Corregido junto con
la ampliación de banco. `colores` sumó CELESTE como color frío nuevo
(agregado también a `COLOR_HEX` en `svg.js`, que no lo tenía).

### Educación Parvularia — ✅ completa (8 de 8 núcleos, nivel NT)
Basado en el Decreto 481/2017, nivel Transición (NT), repartido en 3 ámbitos.
Sala Cuna y Nivel Medio no están en `PARVULARIA_NIVELES` en absoluto (ni bloqueados):
son edades donde el juego en pantalla no es desarrollo-apropiado (así lo indica el
propio Decreto 481/2017 para esos niveles), así que no está previsto construir
módulos jugables para ellos — ver "Educación Parvularia — níveles y núcleos" arriba.

**Segunda auditoría exhaustiva de NT (2026-07-21):** pedido explícito del
usuario de revisar a fondo íconos, letras, formas y preguntas de los 8
núcleos. Se corrigieron ~30 problemas repartidos en varias categorías:

- **Emoji que no se renderizan ("tofu"/recuadro vacío):** se detectó que
  🪱🪥🦭🪮🪨🪟🪞🫘🪖🧋 (todas adiciones Unicode 2019-2022) se ven como un
  recuadro vacío en varios navegadores/sistemas — el mismo problema que ya
  había motivado `chileFlagSVG()`. Se agregaron 11 SVG propios en
  `js/svg.js` (`toothbrushSVG`, `peinetaSVG`, `vidrioSVG`, `espejoSVG`,
  `semillaSVG`, `cascoSVG`, `crisalidaSVG`, `gusanoSVG`, `focaSVG`,
  `piedraSVG`, `bebidaDulceSVG`). **Pedido explícito del usuario, corrigiendo
  el enfoque inicial:** la primera pasada había resuelto 4 de estos casos
  cambiando la palabra/concepto por otro con emoji bien soportado (gusano→
  hormiga, foca→foto, piedra→ladrillo, 🧋→🍹) — el usuario pidió que, en
  vez de sustituir el concepto, siempre se dibuje a mano el concepto
  original (ver [[feedback-custom-art-over-emoji-swap]] en memoria), así que
  esos 4 se revirtieron a sus palabras originales con su propio SVG.
  `cascoSVG()` además corrige un problema aparte: 🪖 es literalmente un
  casco militar, no uno de bicicleta.
- **Íconos de acción animados (Movimientos del Cuerpo):** por el mismo
  pedido, los 8 emoji-metáfora de `MOVIMIENTOS_BANK` (🦘 para saltar, 🐍
  para reptar, 💫 para girar, etc. — ninguno mostraba a una persona
  haciendo la acción) se reemplazaron por `personActionSVG(accion, size)`:
  una figura de palitos (cabeza/torso/brazos/piernas como elementos SVG
  independientes con una clase por parte) animada con CSS `@keyframes` en
  `styles.css` (un set de animación por acción: `act-saltar`, `act-correr`,
  etc.), siguiendo el mismo mecanismo que ya usaba `.float` para animar a
  Carboncito en la Home. Todas las animaciones usan solo `transform`
  (nunca layout) para que corran livianas.
- **Forma geométrica incorrecta:** `shapeSVG('rombo')` tenía diagonales
  iguales (era matemáticamente un cuadrado rotado 45°, no un rombo) — se
  corrigieron las proporciones.
- **Errores de concordancia de género:** varios `explain` generados
  concatenaban un sustantivo femenino con un adjetivo masculino ("La piedra
  es rígido", "La corteza del árbol es rugoso", "La arena es áspero") —
  corregidos a sus formas femeninas (o, en el caso de "piedra", cambiado a
  "el ladrillo" al resolver el problema de renderizado del emoji). También
  se corrigió un literal `"un(a)"` que aparecía sin resolver en el texto de
  Formas y Cuerpos.
- **`speakText` agramatical:** varios generadores construían el texto leído
  en voz alta con `texto.replace('___','')`, dejando oraciones rotas (huecos
  con doble espacio, comas huérfanas) — se agregó un campo `pregunta`
  explícito por escena en vez de derivar el texto del hueco.
- **Ambigüedad/contradicción de contenido:** dos oraciones de posición
  relativa (perro/dueño, osito/niña) no tenían una única respuesta correcta
  posible sin contexto adicional — se reformularon. Una carrera de tortuga
  se cambió a caracol para no contradecir la moraleja de "la tortuga y la
  liebre". Dos ítems de "Resolución Pacífica" eran escenarios de empatía,
  no conflictos genuinos (fuera del alcance documentado OA05 del núcleo) —
  se reemplazaron. Una pregunta de "instituciones" pedía una institución
  pero la respuesta correcta (🚒) era un vehículo — se reformuló la
  pregunta para pedir explícitamente el vehículo.
- **`explain` genérico sin valor pedagógico:** varios generadores solo
  repetían el emoji de la respuesta correcta ("La respuesta correcta es
  🛁.") — se agregaron etiquetas de texto (`label`) por ítem para que el
  explain nombre la respuesta en palabras.
- **Ciclo de vida incompleto:** el ciclo de la mariposa solo tenía
  huevo→oruga→mariposa, saltándose la etapa de crisálida — se agregó
  (con `crisalidaSVG()`, ya que no existe un emoji para esto).
- **Bancos de contenido ampliados/corregidos:** `SELLO_ALIMENTOS`/
  `SIN_SELLO_ALIMENTOS` de 6 a 8 ítems cada uno; un grupo de "clasificar"
  mezclaba una persona (🧑, "piernas") con animales bajo el atributo
  "patas" — se cambió por 🦩.

Los 37 módulos de NT se probaron con fuzz-testing (100 iteraciones cada
uno vía consola del navegador) tras cada tanda de cambios: sin `undefined`,
sin opciones duplicadas, `correctValue` siempre presente, `explain` siempre
presente, `speakText` sin HTML embebido.

**Ampliación de módulos por núcleo (2026-07-21):** pedido explícito del
usuario de aumentar la cantidad de juegos por núcleo para retener más la
atención, siempre que se pudiera fundamentar en el texto literal de un OA ya
citado (no inventar OA nuevos — la regla de oro del proyecto). Se investigó
el texto literal de cada OA candidato en curriculumnacional.cl antes de
decidir; en los núcleos donde el OA ya citado no nombra sub-aspectos sin
explotar (p. ej. Convivencia y Ciudadanía, Comprensión del Entorno
Sociocultural, Identidad y Autonomía, Pensamiento Matemático, Lenguaje
Verbal), se dejó la cantidad de módulos igual — agregar un módulo ahí
habría significado forzar contenido no respaldado por el currículum. Solo
2 núcleos tenían un OA ya citado cuyo texto literal nombraba explícitamente
más atributos/categorías de los que el único módulo existente ejercitaba:
- **Lenguajes Artísticos**: OA01 dice literalmente "...describiendo y
  comparando algunas características visuales, musicales o escénicas
  (desplazamiento, ritmo, carácter expresivo, colorido, formas, diseño,
  entre otros)". El único módulo existente ("Aprecia y Compara") solo
  ejercitaba "colorido". Se agregaron "Compara Formas" y "Líneas y Diseño"
  (reutilizando `shapeSVG()`/`lineTypeSVG()`, ya construidos para Pensamiento
  Matemático y Artes Visuales 2° básico respectivamente) con el mismo
  mecanismo de comparar dos "obras" que ya usaba Aprecia y Compara —
  "desplazamiento/ritmo/carácter expresivo" siguen fuera porque son de
  manifestaciones musicales/escénicas (audio o movimiento real, mismo
  criterio que excluye OA03-04 de este núcleo).
- **Corporalidad y Movimiento**: OA09 dice literalmente "Utilizar categorías
  de ubicación espacial y temporal, tales como: adelante/atrás/al lado/
  entre, día/noche, hoy/mañana, antes/durante/después, en situaciones
  cotidianas y lúdicas". El módulo existente ("Ubicación y Tiempo") no
  cubría "entre" ni "antes/durante/después" — dos categorías que el OA sí
  nombra. Se dividió en dos módulos ("Ubicación Espacial" para
  adelante/atrás/al lado/entre, y "¿Cuándo Ocurre?" para día/noche/hoy/
  mañana/ayer/antes/durante/después) en vez de amontonar 12 categorías en
  un solo juego de rounds:8. El módulo se llama "¿Cuándo Ocurre?" y no
  "Antes y Después" para no duplicar el título del módulo homónimo de
  Pensamiento Matemático (que cubre una habilidad distinta: secuenciar dos
  eventos de una rutina, no el vocabulario temporal en sí).

**Ámbito Comunicación Integral** (curriculumnacional.cl/curriculum/educacion-parvularia/comunicacion-integral/nt-nivel-transicion):
- **Lenguaje Verbal** (6): Escribe tu Nombre y Caligrafía (ambos trazado libre sobre
  canvas, sin motor MC), Sílabas y Sonidos, Escuchar y Comprender, Vocabulario en
  Contexto, Letras y Sonidos — OA01-04, OA06-08. Fuera: OA05 (interés por textos,
  actitudinal) y OA09-10 (mensajes en lengua indígena de la comunidad o lenguas
  maternas de los pares — dependen de la lengua específica de cada comunidad/familia,
  no generalizables sin riesgo de contenido incorrecto o excluyente).
- **Lenguajes Artísticos** (3): Aprecia y Compara, Compara Formas, Líneas y Diseño —
  las 3 son OA01 (ver "Ampliación de módulos por núcleo" arriba). Fuera: OA02 (opinión
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
- **Corporalidad y Movimiento** (3): Ubicación Espacial, ¿Cuándo Ocurre?,
  Movimientos del Cuerpo — OA09 (los dos primeros, ver "Ampliación de módulos
  por núcleo" arriba), OA04. Fuera: OA01-03, OA05-08 (práctica motriz real:
  cuidado corporal, ejercitación, coordinación, fuerza/equilibrio — requieren
  movimiento físico real).

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

### 3° Básico — ✅ completo (36 módulos, las 9 asignaturas)
Todo basado en OA reales del Decreto 439/2012, extraídos de curriculumnacional.cl/
curriculum/1o-6o-basico/<asignatura>/3-basico. El currículum de 3° básico es
sensiblemente más amplio que 1°-2° básico (p.ej. Matemática pasa de 9 a 26 OA,
Lenguaje de un puñado a 31), así que varios módulos combinan más de un OA
relacionado (mismo patrón ya usado en "Geometría"/"Medición" de 2° básico) en vez
de crear un módulo por cada OA individual.

- **Lenguaje** (6): Géneros Literarios (poema/cuento/fábula/leyenda/mito/novela/
  historieta — OA03), Comprensión III (inferencia, textos no literarios, lenguaje
  figurado simple — OA02,04-06), Vocabulario en Contexto (OA10), Orden Alfabético
  (OA11), Gramática III (sustantivo/adjetivo/artículo, pronombres — OA20-21),
  Ortografía (mayúsculas y signos de puntuación, incluye la regla real de que los
  días de la semana NO llevan mayúscula en español — OA22). Fuera: OA01 (lectura
  oral fluida), OA07-09 (gusto por la lectura, biblioteca, investigar en fuentes —
  actitudinales o de proceso), OA12-19 (producción escrita: cuentos, cartas,
  planificación, revisión), OA23-31 (comunicación oral: escuchar narraciones,
  teatro, conversación, recitar) — todos requieren desempeño real, no reconocimiento.
- **Matemática** (9): Números hasta 1000 (contar salteado, leer, comparar, valor
  posicional — OA01-03,05), Sumar/Restar y Dinero (incluye problemas con pesos
  chilenos — OA06-07,10), Tablas de Multiplicar (OA08), Dividir (OA09), Fracciones
  (1/2,1/3,1/2,2/3,3/4 — dibujadas con el nuevo `fraccionSVG()`/`fraccionBarraSVG()`
  en `svg.js`, alternando círculo/barra para no repetir siempre la misma imagen de
  las 6 fracciones posibles — OA11), Patrones y Ecuaciones (OA12-13), Geometría III
  (cuadrícula, cuerpos 3D incluyendo la `piramide` nueva en `solid3DSVG()`, ángulos
  con el nuevo `anguloSVG()` — OA14-16,18), Medición III (hora con cuartos/
  medias/menos cuarto, perímetro, peso — OA19-22), Datos y Gráficos (encuestas,
  gráficos de barra — OA23-26). Fuera: OA04 (describir ESTRATEGIAS de cálculo
  mental, un proceso propio) y OA17 (reconocer traslación/reflexión/rotación,
  que requiere comparar una imagen animada antes/después).
- **Ciencias Naturales** (7): Plantas: Partes y Especies de Chile (raíz/tallo/hojas
  fusionado con copihue/araucaria/trigo/maíz/papa/vid porque "Partes de la Planta"
  por sí solo solo tenía 3 ítems reales — OA01-02), Ciclo de Vida de la Planta
  (OA03), Cuidado de Plantas y Ambiente (OA04-05), Alimentación e Higiene (OA06-07),
  La Luz (OA08-09), El Sonido (OA10), Sistema Solar (incluye rotación/traslación y
  fases de la luna — OA11-13). Ningún OA queda fuera: los 13 de 3° básico son
  observables/descriptivos.
- **Historia, Geografía y Cs. Sociales** (3): Grecia y Roma (polis, democracia
  ateniense, Juegos Olímpicos, Partenón, Coliseo, acueductos, latín, togas — hechos
  de historia universal ampliamente documentados, no de una fuente única, distinto
  del caso de personajes históricos chilenos puntuales — OA01-04,10), Geografía del
  Mundo (puntos cardinales, hemisferios/continentes/océanos, zonas climáticas —
  OA06-09), Formación Ciudadana III (deberes, honestidad, derechos del niño,
  instituciones, participación — OA11-16). Fuera: OA05 (investigar en fuentes,
  proceso de indagación propio).
- **Artes Visuales** (2): Color Expresivo (asociación color-emoción, una convención
  pedagógica ampliamente enseñada, no una verdad científica única — OA02),
  Materiales de Modelado y Reciclaje (arcilla/plasticina vs. cartón/botellas vs.
  hojas/semillas — OA03). Fuera: OA01 (crear un trabajo propio), OA04 (describir Y
  expresar lo que se siente frente a una obra — subjetivo), OA05 (autoevaluación).
- **Música** (2): Lenguaje Musical (pulso, acento, forma A-AB-ABA — OA01), Música en
  la Sociedad (qué música es típica de una celebración o situación cotidiana —
  OA07). Fuera: OA02 (expresar sensaciones propias), OA03 (escuchar repertorio
  extenso, depende de audio real), OA04-06 (cantar/tocar/improvisar/presentar),
  OA08 (autoevaluación).
- **Educación Física y Salud** (2): Vida Activa y Saludable III (actividad física
  regular, respuestas corporales, hábitos — OA06-09), Juego Limpio y Seguridad III
  (honestidad, reglas, comportamientos seguros — OA10-11). Fuera: OA01-05
  (habilidades motrices, juegos predeportivos, danza, entornos — práctica física
  real).
- **Orientación** (4): Manejo Emocional (identificar emociones y estrategias de
  manejo — OA02), Autocuidado III (higiene/descanso/alimentación — OA04), Buen
  Trato y Resolución de Conflictos (solidaridad, empatía, conflictos entre pares —
  OA05-06), Hábitos de Trabajo Escolar (OA08). Fuera: OA01 (valorar fortalezas
  propias, autorreflexión), OA03 (sexualidad como expresión de amor y vínculo — un
  tema sensible que requiere acompañamiento de un adulto, no una trivia de opción
  múltiple) y OA07 (participar en la comunidad escolar — ya cubierto por Formación
  Ciudadana III en historia.js, para no duplicar).
- **Tecnología** (1): Tecnología Digital III (software de presentaciones,
  buscadores, seguridad en internet — contenido nuevo, sin repetir lo ya cubierto
  por "Tecnología Digital" de 2° básico — OA05-07). Fuera: OA01-04 (diseñar/
  planificar/elaborar/evaluar un objeto tecnológico propio — producción práctica).

### 4° Básico — ✅ completo (30 módulos, las 9 asignaturas)
Todo basado en OA reales del Decreto 439/2012, extraídos de curriculumnacional.cl/
curriculum/1o-6o-basico/<asignatura>/4-basico. El currículum de 4° básico repite
casi textualmente varios OA de 3° básico (Música, Educación Física, Orientación),
así que esos módulos usan **contenido nuevo** (escenarios, ejemplos, ángulos)
en vez de duplicar el de 3° básico — documentado caso a caso en el comentario de
cada archivo.

- **Lenguaje** (4): Comprensión IV (estrategias, géneros literarios integrados
  como un ángulo más de la misma pregunta en vez de repetir el módulo dedicado
  de 3° básico, inferencia, lenguaje figurado, textos no literarios — OA02-06),
  Vocabulario en Contexto II (sinónimo por contexto + el ángulo nuevo de
  prefijos/sufijos — OA10), Gramática IV (adverbios, concordancia sujeto-verbo —
  OA19-20), Ortografía II (b/v, h, ay/hay/ahí, acentuación — reglas distintas de
  las de Ortografía de 3° básico). Fuera: OA01 (lectura oral), OA07-09
  (actitudinales/proceso), OA11-18 (producción escrita), OA22-30 (comunicación
  oral).
- **Matemática** (9): Números hasta 10 000 (con descomposición aditiva — OA01),
  Sumar/Restar y Dinero II (incluye propiedades del 0 y 1 — OA03-04,07),
  Multiplicar y Dividir (3 dígitos × 1, división 2 dígitos — OA05-06), Fracciones
  II (denominadores variados, suma de fracciones, números mixtos hasta 5 —
  OA08-10), Decimales (décimos, centésimos, suma — OA11-12), Patrones y
  Ecuaciones II (OA13-14), Geometría IV (coordenadas, vistas 3D frente/lado/
  arriba, simetría, ángulos con el `anguloSVG()` ya creado para 3° básico —
  OA15-17,19), Medición IV (hora AM/PM/24h, conversión de unidades de tiempo,
  longitud, área, volumen — OA20-24), Datos y Probabilidades (encuestas,
  experimentos aleatorios, gráficos — OA25-27). Fuera: OA02 (describir
  ESTRATEGIAS de cálculo mental) y OA18 (trasladar/rotar/reflejar, requiere
  comparar imágenes antes/después).
- **Ciencias Naturales** (5): Ecosistemas (elementos vivos/no vivos,
  adaptaciones, cadenas alimentarias, cuidado de ecosistemas de Chile —
  OA01-04), Cuerpo Humano IV (sistema esquelético, movimiento, sistema
  nervioso — OA05-07), La Materia (masa/espacio, estados, instrumentos de
  medición — OA09-11), Las Fuerzas (efectos y tipos de fuerza — OA12-13), La
  Tierra (capas, placas tectónicas, prevención de riesgos — OA15-17). Fuera:
  OA08 ("investigar en diversas fuentes" los efectos del alcohol — proceso de
  indagación, mismo criterio que otros OA de "investigar") y OA14 (diseñar un
  objeto tecnológico — producción práctica).
- **Historia, Geografía y Cs. Sociales** (3): Civilizaciones Americanas (maya,
  azteca, inca — Tenochtitlán, Machu Picchu, el quipu, los chasquis — hechos de
  historia universal ampliamente documentados, mismo criterio que Grecia y Roma
  en 3° básico — OA01-04), Geografía de América (coordenadas, recursos
  renovables/no renovables, paisajes y climas — OA06-10), Formación Ciudadana IV
  (actores políticos, derechos, honestidad, no discriminación, participación,
  resolución de conflictos — OA11-16). Fuera: OA05 (investigar sobre pueblos
  indígenas hoy) y OA17-18 (proyecto grupal, opinar y argumentar).
- **Artes Visuales** (1): Lenguaje Visual II (línea de contorno, tono/matiz de
  un color, forma figurativa/no figurativa — conceptos nuevos respecto al color
  cálido/frío de 3° básico — OA02). Fuera: OA01,03 (producción propia), OA04
  (apreciación subjetiva), OA05 (autoevaluación).
- **Música** (1): Dinámica y Tempo (piano/forte, crescendo/decrescendo,
  allegro/largo/moderato/andante — un ángulo de OA01 que "Lenguaje Musical" de
  3° básico no cubrió). OA07 (música en situaciones cotidianas) no se repite,
  ya lo cubrió 3° básico con contenido casi idéntico.
- **Educación Física y Salud** (2): Condición Física y Pulso (los 4 componentes
  de la condición física y medir el pulso, un ángulo nuevo — OA06,08), Seguridad
  y Juego Limpio IV (honestidad, hábitos, comportamientos seguros — OA09-11).
  Fuera: OA01-05 (habilidades motrices, juegos, danza, entornos).
- **Orientación** (4): Manejo Emocional II, Autocuidado IV, Buen Trato y
  Resolución de Conflictos II, Hábitos de Trabajo Escolar II — mismos ángulos
  que 3° básico (OA02,05,06-07,09) pero con escenarios y afirmaciones
  completamente nuevos, ya que el texto de los OA es casi idéntico al de 3°
  básico. Fuera: OA01 (fortalezas propias), OA03 (sexualidad como expresión de
  amor y vínculo) y OA04 (desarrollo afectivo y sexual — aún más explícito que
  el OA03 de 3° básico, mismo criterio de requerir el acompañamiento real de un
  adulto) y OA08 (participación en la comunidad escolar, ya cubierta por
  Formación Ciudadana IV).
- **Tecnología** (1): Tecnología Digital IV (hojas de cálculo — contenido nuevo
  respecto a 3° básico — más preguntas frescas de presentaciones/seguridad en
  internet — OA05-07). Fuera: OA01-04 (diseñar/elaborar/evaluar un objeto
  tecnológico propio).

### 5° Básico — ✅ completo (35 módulos, las 9 asignaturas + Inglés nuevo)
Todo basado en OA reales del Decreto 439/2012, extraídos de curriculumnacional.cl/
curriculum/1o-6o-basico/<asignatura>/5-basico. **Primera aparición de Inglés en la
app**: se verificó primero (no se asumió) que el currículum vigente recién
introduce Inglés como Idioma Extranjero en 5° básico
(curriculumnacional.cl/curriculum/1o-6o-basico/ingles/5-basico), así que se creó
`content/ingles.js` + `INGLES_BY_GRADE` + una entrada nueva en `SUBJECT_DEFS`
(ícono 🔤, no la bandera 🇬🇧 — mismo riesgo de renderizado como texto plano "GB"
que ya motivó `chileFlagSVG()`). Como es la primera asignatura con contenido en
otro idioma, `speak()` (`js/audio.js`) ahora acepta un segundo parámetro opcional
`lang` (`pickBestVoice(lang)` filtra por ese prefijo de idioma en vez de fijo
"es") — los generadores de Inglés pasan `speakLang:'en'` en su ronda y
`mcEngine.js` reenvía ese valor al botón "Escuchar"; todo generador anterior
sigue funcionando igual porque el parámetro es opcional y por defecto sigue
siendo español.

- **Lenguaje** (5): Comprensión V (estrategias de comprensión con 4 ángulos:
  inferencia narrativa, texto no literario, evaluación crítica de información
  -emisor/propósito/suficiencia-, idea principal — OA02,04,06-08), Recursos
  Poéticos (personificación, comparación, apelar a los sentidos — OA05, un
  ángulo nuevo que ningún año anterior había cubierto), Vocabulario y
  Sinónimos V (raíces/afijos, matices entre sinónimos — OA12,20), Gramática V
  (conjugación de verbos regulares — OA21), Ortografía III (c/s/z, raya de
  diálogo, acentuación — reglas distintas de Ortografía de 3°/4° básico —
  OA22). Fuera: OA01 (lectura oral fluida), OA03 (repertorio de géneros
  literarios — ya cubierto por "Géneros Literarios" de 3° básico, no
  duplicar), OA09-11 (gusto por la lectura, biblioteca, buscar en fuentes —
  actitudinal/proceso), OA13-19 (producción escrita), OA23-30 (comunicación
  oral — desempeño real o depende de audio).
- **Matemática** (10): Números Grandes (hasta 900 millones, valor posicional
  — OA01), Multiplicar (cálculo mental, 2 dígitos — OA02-03), Dividir
  (dividendo 3 dígitos, resto — OA04), Operaciones y Dinero (orden de
  operaciones, problemas con dinero — OA05-06), Fracciones III (propias/
  impropias, sumar/restar denominadores ≤12 — OA07-09), Decimales II
  (fracción a decimal, comparar, sumar decimales hasta la milésima —
  OA10-13), Patrones y Ecuaciones III (sucesiones, ecuaciones/inecuaciones
  un paso — OA14-15), Geometría V (plano cartesiano, lados paralelos/
  perpendiculares, congruencia vía traslación/reflexión/rotación —
  presentada como identificar el concepto a partir de una descripción, no
  comparar imágenes antes/después — OA16-18), Medición y Área (longitud,
  conversión de unidades, diseñar rectángulos dado el perímetro, área de
  triángulo/paralelogramo/trapecio — OA19-22), Datos y Probabilidades III
  (promedio, probabilidad cualitativa, comparar probabilidades sin
  calcularlas, gráficos, diagrama de tallo y hojas -tabla HTML simple,
  clase `.stem-leaf` sin CSS dedicado, mismo criterio que `.bar-chart`- —
  OA23-27). Ningún OA de 5° básico queda fuera del motor de opción múltiple.
- **Ciencias Naturales** (4): Célula y Sistemas del Cuerpo (la célula como
  unidad básica uni/multicelular, sistema digestivo/respiratorio/circulatorio
  — OA01-04), Alimentación y Salud (función de los alimentos en el
  crecimiento, efectos nocivos del cigarrillo, microorganismos beneficiosos/
  dañinos — OA05-07), Electricidad (transformación de energía eléctrica,
  circuito eléctrico simple, materiales conductores/aisladores, ahorro de
  energía — OA08-11), Agua en la Tierra (distribución agua dulce/salada,
  océanos vs. lagos, efectos de la actividad humana y su protección —
  OA12-14). Ningún OA de 5° básico queda fuera: los 14 son observables o
  explicativos.
- **Historia, Geografía y Cs. Sociales** (4): Descubrimiento y Conquista de
  América (viajes de Colón/Magallanes, conquista de América y Chile, impacto
  en Europa/América, efectos sobre pueblos indígenas — OA01-04), La Colonia
  en Chile (sociedad, oficios, costumbres coloniales, dependencia de España,
  la relación españoles-mapuches presentada de forma neutral y factual -Guerra
  de Arauco, parlamentos de paz-, patrimonio colonial — OA05-08), Geografía
  de Chile (zonas geográficas, recursos naturales, riesgos naturales —
  OA09-12), Formación Ciudadana V (derechos y deberes, mérito y esfuerzo,
  actitudes cívicas, elecciones de curso, proyectos escolares, formas de
  organización comunitaria — OA13-19). Fuera: OA20-22 (opinar y argumentar
  con fundamentos, evaluar soluciones y justificar, informarse por diarios/
  TIC — habilidades de argumentación o proceso de indagación propio).
- **Artes Visuales** (1): Lenguaje Visual III (color complementario, formas
  abiertas/cerradas, luz y sombra -sombra propia vs. proyectada- — conceptos
  nuevos respecto a 3°-4° básico — OA02). Fuera: OA01,03 (crear trabajos
  propios), OA04-05 (analizar obras reales/comparar trabajos de pares —
  subjetivo, además de requerir datos verificables sobre obras específicas).
- **Música** (1): Texturas y Estructura Musical (monofonía/homofonía/
  polifonía, estructura de pregunta-respuesta — OA01, ángulos que 3°-4°
  básico no cubrieron: pulso/acento/forma y dinámica/tempo respectivamente).
  Fuera: OA02 (sensaciones personales), OA03 (escuchar repertorio — depende
  de audio real), OA04-06 (cantar/tocar/improvisar/presentar — desempeño),
  OA07-08 (relación obra-contexto histórico específico, autoevaluación).
- **Educación Física y Salud** (2): Vida Activa y Postura V (intensidad del
  ejercicio, planificar actividad física regular, hábitos de higiene y
  posturales — OA06-09, ángulos nuevos respecto a 4° básico que solo cubrió
  los 4 componentes de la condición física y el pulso), Liderazgo y
  Seguridad V (responsabilidad, liderazgo, comportamientos seguros, con
  escenarios nuevos — OA10-11). Fuera: OA01-05 (habilidades motrices,
  juegos, deportes, danza nacional — práctica física real).
- **Orientación** (5): Manejo Emocional V (identificar emociones
  considerando el impacto en uno mismo Y en otros — OA02, un ángulo más que
  años anteriores), Autocuidado Digital V (comunicación familiar, proteger
  la intimidad en redes sociales, uso seguro de internet — OA04, tema
  completamente nuevo), Prevención y Vida Saludable (factores protectores
  frente al consumo de drogas: hábitos saludables, familia, amistades
  positivas — OA05, presentado siempre en clave preventiva y positiva, sin
  describir sustancias ni detalles operativos, complementando sin repetir el
  ángulo biológico de Ciencias Naturales), Buen Trato y Resolución de
  Conflictos V (solidaridad, empatía, resolución autónoma — OA06-07),
  Hábitos de Trabajo Escolar V (metas propias, trabajo colaborativo — OA09).
  Fuera: OA01 (valorar fortalezas propias), OA03 (desarrollo afectivo y
  sexual en la pubertad — requiere el acompañamiento real de un adulto,
  mismo criterio que años anteriores) y OA08 (participación en la comunidad
  escolar — ya cubierta por Formación Ciudadana V en historia.js).
- **Tecnología** (1): Tecnología Digital V (opciones de formato en un
  procesador de textos -fuentes, alineación, tablas- y comunicación en línea
  responsable — OA05-07, con escenarios completamente nuevos ya que el texto
  de estos OA repite casi lo mismo que años anteriores: presentaciones ya en
  3°, hojas de cálculo ya en 4°, procesador de texto y seguridad en internet
  ya en 2°-4°). Fuera: OA01-04 (diseñar/planificar/elaborar/evaluar un
  objeto tecnológico propio).
- **Inglés** (2, asignatura nueva): Vocabulario Básico (ver una imagen y
  elegir la palabra en inglés que la nombra — OA05,13), Lectura Simple
  (textos breves en inglés con una pregunta de comprensión — OA06-09).
  Fuera: OA01-04 (comprensión auditiva — depende de audio real en inglés),
  OA10-12 (expresión oral — desempeño real), OA14-16 (expresión escrita —
  producción propia).

**Bugs de opciones duplicadas encontrados y corregidos durante el
fuzz-testing de 5° básico:** 6 módulos (`colonia5`, `ciudadania5`,
`manejoemocional5`, `buentrato5`, `habitosestudio5`, `tecdigital5`) tenían un
banco con exactamente el mismo tamaño que `rounds:8` (o menos), garantizando
una repetición en el 100% de las sesiones simuladas — el mismo tipo de bug ya
documentado en 4° básico. Se corrigió ampliando cada banco con contenido real
dentro del mismo OA ya citado (nunca inventando un OA nuevo) hasta dejar
margen de +2 a +4 sobre `rounds`. Verificado: los 35 módulos nuevos, y los 191
módulos de toda la app, pasan 300 sesiones simuladas cada uno sin ningún
repetido, y 100-300 iteraciones de fuzz estructural sin `undefined`, opciones
duplicadas dentro de una ronda, ni `correctValue` ausente de las opciones.

### 6° Básico — ✅ completo (39 módulos, las 9 asignaturas + Inglés)
Todo basado en OA reales del Decreto 439/2012, extraídos de curriculumnacional.cl/
curriculum/1o-6o-basico/<asignatura>/6-basico. Varios OA de 6° básico repiten
textualmente el mismo texto de 5° básico (Música, Ed. Física, Orientación,
Tecnología) — igual que en años anteriores, esos módulos usan escenarios y
afirmaciones completamente nuevos en vez de duplicar contenido.

- **Lenguaje** (5): Comprensión VI (los mismos 4 ángulos de Comprensión V más
  un quinto: evaluar críticamente mensajes publicitarios — OA02,04,06-08,25),
  Recursos Poéticos II (hipérbole y efectos sonoros -aliteración, onomatopeya-
  además de repasar personificación/comparación con versos nuevos — OA05),
  Vocabulario VI (sufijos -ángulo nuevo respecto a prefijos de 4° y raíces de
  5°- e hipónimos/locuciones -más allá de sinónimos con matices de 5°- —
  OA12,20), Gramática VI (participios irregulares: roto, escrito, dicho,
  hecho, puesto, visto, abierto, muerto, resuelto, cubierto, vuelto — OA21),
  Ortografía IV (tilde diacrítica: él/el, tú/tu, mí/mi, sí/si, sé/se, dé/de,
  té/te, más/mas — OA22). Fuera: OA01 (lectura oral), OA03 (repertorio
  literario, ya cubierto en 3°), OA09-11 (actitudinal/proceso), OA13-19
  (producción escrita), OA23-24,26-31 (comunicación oral, desempeño o audio).
- **Matemática** (10): Múltiplos y Factores (primos/compuestos — OA01),
  Operatoria Combinada (números mayores a 10 000 — OA02), Razones y
  Porcentajes (OA03-04), Fracciones y Números Mixtos (OA05-06,08), Decimales
  III (multiplicar/dividir decimales — OA07-08), Patrones, Tablas y
  Ecuaciones (tabla de valores, expresiones algebraicas, ecuaciones un paso —
  OA09-11), Triángulos y Teselados (clasificar por lados, traslación/
  reflexión/rotación en un mosaico — OA12,14), Ángulos VI (clasificación por
  grados incluyendo extendido/completo -presentado como dato numérico, sin
  necesidad de dibujar un ángulo de 180°/360°-, complementarios, opuestos por
  el vértice/correspondientes en paralelas, suma de ángulos interiores —
  OA15-17,20-21), Área y Volumen (superficie y volumen de cubos/
  paralelepípedos — OA13,18-19), Datos y Probabilidades IV (comparar
  promedios de dos grupos, conjeturas sobre experimentos aleatorios, gráfico
  de barra doble y gráfico circular nuevos -`doubleBarChartHTML()`/
  `pieChartHTML()`/`pieChartSVG()`- — OA22-24). Ningún OA de 6° básico queda
  fuera.
- **Ciencias Naturales** (6): Fotosíntesis y Cadenas Alimentarias (OA01-03),
  **Sistema Reproductor y Pubertad** (OA04-05 — estructuras y función del
  sistema reproductor femenino/masculino, cambios físicos observables de la
  pubertad, tratados de forma estrictamente anatómica y factual, igual que
  los demás sistemas del cuerpo ya cubiertos en 5° básico; agregado tras
  conversarlo explícitamente con el usuario — la primera versión de este PR
  excluía el OA por completo, pero el currículum oficial sí lo cubre
  clínicamente a esta edad. Lo afectivo/vincular/de intimidad sigue siendo
  terreno exclusivo de Orientación, excluido ahí desde 3° básico), Hábitos
  Saludables y Prevención (actividad física/higiene durante el crecimiento,
  efectos nocivos de las drogas — OA06-07), Energía y sus
  Transformaciones (OA08-09,11), Calor, Temperatura y Estados de la Materia
  (OA10,12-15), La Tierra: Capas, Suelo y Erosión (OA16-18). Los 18 OA de
  6° básico quedan cubiertos, ninguno queda fuera.
- **Historia, Geografía y Cs. Sociales** (6): Independencia de Chile
  (Primera Junta 1810, cruce de los Andes, batalla de Maipú 1818 — OA01-02),
  La República en el Siglo XIX (Constitución de 1833, ferrocarril, educación
  — OA03-04,09), Salitre y Expansión Territorial (Guerra del Pacífico
  1879-1883 presentada de forma neutral y factual, período salitrero,
  "cuestión social" — OA05-06), Chile en el Siglo XX (voto femenino: ley de
  1949; **y OA08** con hechos puramente cronológicos e indiscutibles del
  golpe de Estado del 11 de septiembre de 1973, el plebiscito del 5 de
  octubre de 1988, y el retorno a un gobierno electo el 11 de marzo de 1990
  con Patricio Aylwin — fechas verificadas con fuentes adicionales antes de
  escribir el contenido. Agregado tras conversarlo explícitamente con el
  usuario: la primera versión de este PR excluía OA08 por completo porque
  el propio texto pide comparar "múltiples perspectivas" sobre el quiebre
  democrático y el régimen militar; esa interpretación sigue sin incluirse
  -ningún juicio de valor, causa o consecuencia-, pero los hitos
  cronológicos básicos sí tienen una única respuesta correcta y un niño de
  6° básico necesita conocerlos como línea de tiempo del país — OA07-08),
  Geografía de Chile VI (territorio tricontinental, ambientes naturales,
  terremoto de Valdivia 1960 — OA10-14), Formación Ciudadana VI (poderes
  del Estado, la Constitución, derechos y deberes, elecciones de curso,
  proyectos comunitarios — OA15-23). Fuera: OA21
  (autoridades político-administrativas de una región, cuyo nombre/cargo
  cambió con la reforma de 2021 y podría volver a cambiar) y OA24-26
  (opinar/argumentar, evaluar y justificar soluciones, informarse por
  diarios/TICs — habilidades de argumentación o proceso de indagación
  propio).
- **Artes Visuales** (1): Lenguaje Visual IV (OA02 esta vez sí nombra
  elementos nuevos: "color -gamas y contrastes-; volumen -lleno y vacío-",
  distintos de los ya cubiertos en 3°-5° básico). Fuera: OA01,03 (producción
  propia), OA04-05 (apreciación/evaluación subjetiva de obras).
- **Música** (1): Melodía: Diseños y Variaciones (MU06 OA01 repite la misma
  lista de elementos que MU05 OA01; de ahí, "reiteración/contraste",
  "diseño melódico" -ascendente/descendente/ondulante- y "variación" son los
  únicos términos que ningún año anterior había cubierto). Fuera: OA02-08
  (subjetivo, depende de audio real, desempeño, autoevaluación).
- **Educación Física y Salud** (2): Vida Activa y Postura VI, Liderazgo y
  Seguridad VI (OA06-11, mismo texto que 5° básico, con escenarios nuevos).
  Fuera: OA01-05 (práctica física real).
- **Orientación** (5): Manejo Emocional VI (OA02), Autocuidado Digital VI
  (OA04), Prevención VI (OA05, esta vez nombrando ejemplos explícitos:
  tabaco/alcohol/marihuana, en clave preventiva y factual), Buen Trato y
  Resolución de Conflictos VI (OA06-07), Hábitos de Trabajo Escolar VI
  (OA09) — todos con escenarios completamente nuevos ya que el texto de los
  OA repite casi lo mismo que 5° básico. Fuera: OA01, OA03 (desarrollo
  afectivo y sexual — mismo criterio de siempre), OA08 (ya cubierta por
  Formación Ciudadana VI en historia.js).
- **Tecnología** (1): Tecnología Digital VI (OA06 agrega "revisar" un
  documento, OA07 agrega "publicar" información — matices nuevos respecto a
  años anteriores, con escenarios frescos). Fuera: OA01-04 (producción
  práctica).
- **Inglés** (2): Vocabulario Intermedio (clima y verbos con emoji, días de
  la semana como traducción español-inglés ya que no tienen representación
  visual distintiva — OA05,13), Lectura Simple II (notas, postales,
  invitaciones, tarjetas de saludo, menús, rimas/poemas/cómics —
  literalmente los formatos que nombra OA06-07, distintos de las oraciones
  sueltas de 5° básico). Fuera: OA01-04 (audio), OA10-13 (oral), OA14-16
  (producción escrita).

**Hallazgos técnicos de esta ronda:**
- **`.bar-chart`/`.bar-col`/`.bar-fill`/`.bar-label`/`.bar-value` no tenían
  NINGÚN CSS propio** desde que existen (2° básico en adelante) — solo el
  `height` inline que arma `barChartHTML()`. Sin flexbox/ancho/color, las
  columnas se apilaban como bloques planos en vez de verse como un gráfico
  de barras. Se detectó al construir el gráfico de barra doble de 6° básico
  y se corrigió con CSS real en `styles.css`, beneficiando también los
  gráficos de barra de 2°-5° básico. Se agregó CSS real también para
  `.stem-leaf` (diagrama de tallo y hojas, 5°-6° básico) y `.pie-legend`
  (leyenda del gráfico circular nuevo).
- **Bug de opciones duplicadas en el generador de "Lenguaje Visual IV"**
  (contraste de color): con solo 2 categorías de contraste posibles, tomar
  todas las demás entradas del banco como distractores podía repetir la
  misma categoría dos veces. Corregido calculando la única "otra" categoría
  en vez de filtrar el banco completo.
- **12 módulos con bank ≤ `rounds:8`** encontrados por fuzz-testing
  (`independencia6`, `republica6`, `salitre6`, `sigloxx6`, `geografiachile6`,
  `lenguajevisual6`, `manejoemocional6`, `autocuidadodigital6`,
  `prevencion6`, `buentrato6`, `habitosestudio6`, `tecdigital6`) —
  ampliados con contenido real dentro del mismo OA ya citado hasta dejar
  margen sobre `rounds`. Verificado: los 39 módulos, y los 230 módulos de
  toda la app, pasan 300 sesiones simuladas cada uno sin ningún repetido.
- **`js/audio.js`**: `speak(text, lang)` y `pickBestVoice(lang)` (agregado en
  5° básico para Inglés) siguen funcionando igual; 6° básico los reutiliza
  sin cambios adicionales.
- **Revisión post-merge de las exclusiones (2026-07-22):** el usuario
  planteó dudas sobre excluir contenido por completo, dado que la app busca
  ser un apoyo real para la enseñanza/acompañamiento escolar. Se conversó
  explícitamente cada exclusión: el sistema reproductor (CN06 OA04-05) se
  incorporó de forma anatómica/factual (ver "Sistema Reproductor y
  Pubertad" arriba); el quiebre democrático (HI06 OA08) se incorporó
  parcialmente, solo como hechos cronológicos indiscutibles, dejando la
  interpretación multiperspectiva fuera del quiz (ver "Chile en el Siglo
  XX" arriba). Ninguna exclusión se revierte "porque sí" — el criterio para
  decidir qué sí entra al motor de opción múltiple sigue siendo el mismo de
  siempre: ¿tiene una única respuesta correcta, factual y verificable? Si
  la respuesta es sí, aunque el tema sea delicado, corresponde incluirlo
  con el tono adecuado; si la respuesta es no (opinión, interpretación,
  vivencia personal, o requiere acompañamiento de un adulto en un contexto
  dedicado), se documenta la exclusión con su razón específica.

### Auditoría completa de contenido, 6° básico → Educación Parvularia (2026-07-22)

Pedido explícito del usuario: revisar TODO el contenido ya construido (no solo
lo nuevo) en 5 dimensiones — tipografía/presentación, sentido de la pregunta,
imagen representativa, sin repetición de preguntas, y precisión de la
información — con énfasis especial en una dimensión nueva: **¿podría una
pregunta tener más de una respuesta correcta defendible?** Motivo explícito
del usuario: la app debe ser "un apoyo vital para la enseñanza y/o
acompañamiento escolar", así que la ambigüedad no es aceptable.

**Metodología:** se paralelizó el trabajo en 7 agentes, divididos por
**archivo de asignatura** (no por año/curso) para evitar que dos agentes
editaran el mismo archivo a la vez, dado que cada `content/<asignatura>.js`
contiene TODOS los años de esa asignatura en un solo archivo:
1. `lenguaje.js` + `parvularia/lenguajeVerbal.js`
2. `matematica.js` + `parvularia/pensamientoMatematico.js`
3. `ciencias.js` + `parvularia/exploracionEntornoNatural.js`
4. `historia.js` + `parvularia/comprensionEntornoSociocultural.js`
5. `artes.js` + `musica.js` + `parvularia/lenguajesArtisticos.js`
6. `edfisica.js` + `orientacion.js` + `parvularia/identidadAutonomia.js` +
   `parvularia/convivenciaCiudadania.js` + `parvularia/corporalidadMovimiento.js`
7. `tecnologia.js` + `ingles.js`

Cada agente recibió instrucción explícita de NO tocar el contenido
específicamente protegido (los hechos cronológicos del período 1973-1990 en
`sigloxx6`, y el contenido de prevención de drogas en Orientación) salvo
error factual genuino, y de reportar en vez de decidir frente a cualquier
duda sobre contenido sensible.

**Hallazgos y correcciones reales** (lista no exhaustiva, ver `git log` para
el detalle completo por archivo):
- **Ambigüedad de más de una respuesta correcta** (el hallazgo más
  importante, la categoría nueva): triángulos generados con lados que
  violaban la desigualdad triangular (6° básico); una pregunta de simetría
  donde el banco completo tenía `simetrico:true` siempre, por lo que "NO"
  nunca podía ser la respuesta correcta; un empate silencioso en "¿qué grupo
  tiene mayor promedio?" resuelto arbitrariamente; dos instrumentos de clima
  (veleta/anemómetro) con descripciones demasiado similares entre sí; dos
  texturas (áspera/rugosa) descritas de forma casi idéntica; dos prefijos
  (des-/in-) cuyas explicaciones se solapaban; dos categorías temporales en
  Corporalidad y Movimiento NT (mañana/noche, antes/después) donde más de
  una palabra completaba la oración correctamente.
- **Precisión de la información**: fecha del voto femenino municipal
  corregida de 1934 (año de la ley) a 1935 (año en que efectivamente se
  votó, que es lo que la pregunta preguntaba) — verificado con fuente
  adicional. Explicación de polifonía/canon corregida (un canon repite la
  MISMA melodía desfasada en el tiempo, no melodías distintas).
  Concordancia de género en "el agua es líquida" (agua es femenino pese al
  artículo "el"). Ejemplo de aceite ilustrado con el emoji de mantequilla
  (sólida) en vez de un líquido real.
- **Imagen representativa**: pincel usado para "apretar la plasticina"
  (ya existía `plasticinaSVG()` en el archivo, sin usar en ese ítem);
  mantequilla para "aceite"; emoji de paleta usada para un ítem sin
  relación alguna con arte; varios emoji de baja compatibilidad
  (🪥🦭🪨) sin su SVG ya existente aplicado en algunos bancos que la
  auditoría original de 2026-07-21 no había cubierto; tres instrumentos
  musicales de Unicode reciente (🪇🪘🪣) sin SVG — se crearon
  `maracasSVG()`/`djembeSVG()`/`baldeSVG()` nuevos.
  Referencia de género inconsistente (🧒 genérico junto a texto que decía
  "la niña") en una escena de posición relativa.
- **Sentido de la pregunta / speakText roto**: 4 generadores de Gramática
  (pronombres, concordancia verbal, conjugación, participios) dejaban el
  placeholder `"___"` literal (y en dos casos la pista `"(VERBO)"` entre
  paréntesis) dentro del texto que lee la voz de Carboncito en vez de leer
  la oración ya completada — corregido rellenando el espacio en blanco
  antes de pasarlo a `speakText`. Placeholder literal `"un(a)"` sin resolver
  en 7 lugares distintos (Lenguaje y Matemática) — se agregaron helpers de
  artículo por género gramatical en vez de dejar el texto sin resolver.
  Una pregunta de perímetro con plural ambiguo ("¿cuáles dimensiones...
  funcionan?") reformulada a singular. Un ítem de seguridad (Ed. Física)
  que mezclaba dos afirmaciones distintas en una sola — separado para que
  la afirmación verdadero/falso apunte a una sola idea.
- **Tipografía/presentación**: `kind:'word'` faltante en un par de
  generadores de Ciencias (inconsistente con sus generadores hermanos en el
  mismo archivo).
- **Contenido sensible revisado y dejado intacto, tal como se pidió**:
  `reproductorpubertad6` (Ciencias), `PREVENCION_SALUDABLE5_ITEMS`/
  `PREVENCION_6_BANK` (Orientación), y los 5 hechos cronológicos del período
  1973-1990 en `SIGLOXX_DEMOCRATIZACION_BANK` (Historia) — todos revisados
  por sus agentes respectivos y confirmados como ya correctos, sin necesidad
  de cambios.

**Verificación final**: los 230 módulos de la app pasan fuzz estructural
(150 iteraciones cada uno) y simulación de sesión completa (150 sesiones
cada uno) sin ningún duplicado, `undefined`, `correctValue` ausente, ni
repetición — confirmando que ninguna de las correcciones de esta auditoría
introdujo una regresión.

**Nota técnica sobre el proceso**: varios agentes reportaron que su entorno
de aislamiento (`isolation: "worktree"`) los apuntaba a un repositorio
distinto y vacío (el superproyecto `aplicaciones web`, no `Carbon-Lector`,
que es un repo Git independiente anidado dentro de esa carpeta), por lo que
la herramienta de edición rechazaba escribir directamente. Los agentes que
detectaron esto aplicaron sus correcciones vía Bash/PowerShell/Perl contra
la ruta real, verificando cada reemplazo antes de escribir; se verificó
después que todos los cambios efectivamente quedaron en el checkout real
antes de dar la auditoría por terminada.

### 7° Básico — ✅ completo (34 módulos, las 9 asignaturas + Inglés)
**Cambio de decreto curricular:** a partir de 7° básico, el currículum vigente
pasa del Decreto 439/2012 (que rige 1°-6° básico) al **Decreto 614/2013**
("Bases Curriculares 7° básico a 2° medio"), verificado en curriculumnacional.cl
antes de construir este año — numeración de OA completamente distinta a la de
años anteriores, y la asignatura de Lenguaje se renombra oficialmente a
**"Lengua y Literatura"** desde este año (la app mantiene el mismo
`lenguajeMap`/ícono por continuidad de navegación, ya que para el usuario final
es la misma pantalla de siempre).

- **Lenguaje** (5): Comprensión VII (inferencia, textos no literarios,
  conflicto narrativo, roles de personaje, disposición temporal —
  OA03,10-11), Rima y Métrica (rima consonante/asonante con versos reales,
  el romance como forma poética tradicional — OA04-05), Pensamiento
  Crítico: Hechos y Opiniones (distinguir hecho de opinión, postura del
  autor, estereotipos — OA08-09), Vocabulario y Gramática VII
  (concordancia sujeto-predicado, sinonimia/hiperonimia, tiempos verbales —
  OA16-18), Ortografía V (por qué/porque/porqué/por que — OA19). Fuera:
  OA01-02,07 (actitudinal/subjetivo), OA06 (mitos, ya cubierto en 3°
  básico), OA12-15 (producción escrita), OA20-23 (comunicación oral),
  OA24-25 (proceso de investigación propio).
- **Matemática** (8): Números Enteros (OA01), Fracciones y Decimales II
  (OA02-03), Porcentaje y Potencias (OA04-05), Álgebra I (traducir frases a
  expresiones algebraicas, reducir términos semejantes — OA06-07),
  Proporciones y Ecuaciones II (proporcionalidad directa/inversa, ecuaciones
  de un paso — OA08-09), Geometría VII (suma de ángulos interiores de
  polígonos, radio/diámetro, plano cartesiano — OA10-11,14), Estadística y
  Muestreo (OA15-17), Probabilidades II (probabilidad teórica como fracción,
  frecuencia experimental — OA18-19). Fuera: OA12 (producción/diseño
  propio) y OA13 (ya cubierto por "Medición y Área" de 5° básico, mismo
  contenido).
- **Ciencias Naturales** (5): **Sexualidad y Reproducción** (CN07 OA01-03 —
  ciclo menstrual y gametos, métodos anticonceptivos, ITS: qué son, cómo
  prevenirlas, y la importancia de consultar a un adulto/profesional de
  salud ante cualquier duda, siempre en tono clínico/preventivo, nunca
  gráfico ni explícito; decisión confirmada explícitamente con el usuario
  vía pregunta directa antes de construir este módulo, dado el salto real de
  madurez del contenido respecto a 6° básico — ver "Sexualidad y Reproducción
  7° básico" en el comentario de `ciencias.js`), Sistema Inmunológico y
  Microorganismos (barreras defensivas, virus/bacterias/hongos,
  biotecnología — OA04-06), Fuerzas y Presión (OA07-08), Geología y Clima
  (tectónica de placas, volcanes, ciclo de las rocas — OA09-11), La Materia
  y los Gases (estados, clasificación, cambios físicos vs. químicos —
  OA12-14). Ningún OA de Ciencias 7° queda fuera del alcance verificado.
- **Historia, Geografía y Cs. Sociales** (6): Prehistoria y Primeras
  Civilizaciones (hominización, agricultura, Sumeria, Egipto — OA01-04),
  Grecia y Roma: Sociedad y Política (democracia ateniense, derecho romano,
  legado cultural — OA05-08,17-18), Edad Media (tradiciones
  grecorromana/judeocristiana/germana, orden estamental, cambios del siglo
  XII — OA09-12), Civilizaciones Americanas II (tecnologías maya/azteca,
  quipu, mita, quechua — profundiza lo ya visto de forma más básica en 4°
  básico — OA13-16), Formación Ciudadana VII (diversidad cultural,
  convivencia entre culturas — OA19-20), Geografía y Medioambiente
  (factores de asentamiento, calentamiento global, mitigación — OA21-23).
  Fuera: OA24-26 (opinar/argumentar, evaluar soluciones, investigar en
  fuentes — a verificar si se repiten en 8° básico antes de asumir el mismo
  criterio).
- **Artes Visuales** (1): Espacios de Difusión del Arte (museo, galería,
  mural/arte público, espacio público, y su función social distinta —
  OA06). Fuera: OA01-05,07 (producción propia, investigar artistas/obras
  específicas con riesgo de datos inexactos, apreciación subjetiva).
- **Música** (1): Procedimientos Compositivos (ostinato y secuencia
  melódica — ángulo nuevo que ningún año anterior había cubierto, distinto
  de "variación"/"reiteración" de 6° básico — OA02). Fuera: OA01,03-08
  (crear música propia, repertorio real, desempeño, contexto histórico
  específico, autoevaluación).
- **Educación Física y Salud** (1): Estrategias y Tácticas Deportivas
  (ocupar espacios, anticipar jugadas, trabajo en equipo, comunicación y
  planificación deportiva — un ángulo conceptual/reconocible sin requerir
  desempeño físico real — OA02). Fuera: OA01,03-05 (habilidades motrices
  reales) y OA06-11 (ya cubiertos en años anteriores).
- **Orientación** (5): Prevención de Conductas de Riesgo (factores de
  riesgo/protección únicamente, sin detalle de sexualidad -eso es del OA02
  excluido- — decisión confirmada explícitamente con el usuario vía
  pregunta directa — OA03), Bienestar y Vida Saludable (OA04), Relaciones
  Saludables en Redes Sociales (uso responsable, ciberacoso, huella digital
  — ángulo nuevo — OA05), Resolución de Conflictos VII (OA06), Autonomía en
  el Aprendizaje (OA09-10). Fuera: OA01 (fortalezas propias, subjetivo),
  OA02 (sexualidad como dimensión del desarrollo humano — mismo criterio de
  siempre: requiere acompañamiento real de un adulto, no una trivia),
  OA07 (ya cubierta por Formación Ciudadana en historia.js), OA08
  (proyecto de vida personal, subjetivo).
- **Tecnología** (1): Soluciones Tecnológicas y su Impacto (evaluar
  beneficios y riesgos de una solución tecnológica sobre las personas y el
  medioambiente — OA05-06). Fuera: OA01-04 (diseñar/elaborar/evaluar una
  solución tecnológica propia) y OA07-08 (ya cubiertos por Tecnología
  Digital de años anteriores).
- **Inglés** (2): Vocabulario Avanzado (funciones del lenguaje:
  cantidades/descripciones comparativas, obligación/sugerencia/necesidad —
  IN07 OA08,16), Lectura Intermedia (comprensión de textos no literarios y
  literarios, incluyendo tema/personajes/entorno/trama — IN07 OA09-11).
  Fuera: OA01-07 (comprensión y producción oral, dependen de audio real),
  OA12 (estrategias de lectura como proceso propio), OA13-15 (expresión
  escrita, producción propia).

**Hallazgos técnicos de esta ronda:**
- **Bug ya conocido, reencontrado al escribir contenido nuevo**: el
  placeholder literal `"un(a)"` sin resolver apareció de nuevo en dos
  generadores nuevos (`genEspaciosDifusion7Round` en `artes.js`,
  `genPensamientoCritico7Round` en `lenguaje.js`) — mismo patrón detectado
  y corregido en la auditoría de 6° básico, ahora evitado reformulando el
  texto del `explain` para no necesitar artículo de género en absoluto
  ("Esto describe: ___" / "Esto es: ___") en vez de intentar resolverlo con
  un helper.
- **12 de los 34 módulos nuevos tenían bank ≤ `rounds:8`** (repetición
  garantizada en el 100% de las sesiones simuladas, detectado por la misma
  metodología de simulación de 150-200 sesiones ya usada en años
  anteriores): `rimametrica7`, `ortografia7`, `prehistoriacivilizaciones7`,
  `greciaroma7`, `edadmedia7`, `civilizacionesamericanas7`, `ciudadania7`,
  `geografiamedioambiente7`, `espaciosdifusion7`,
  `procedimientoscompositivos7`, `estrategiastacticas7`,
  `resolucionconflictos7` — todos ampliados con contenido real dentro del
  mismo OA ya citado (nunca inventando un OA nuevo) hasta dejar margen real
  sobre `rounds:8`; dos de ellos (`geografiamedioambiente7`,
  `estrategiastacticas7`) necesitaron una segunda ronda de ampliación
  porque la primera solo llegó a exactamente 8 ítems, sin margen. Verificado
  al final: los 34 módulos nuevos, y los 265 módulos de toda la app, pasan
  200 sesiones simuladas cada uno sin ningún repetido.
- **Investigación de OA verificada con fuente en vivo** antes de escribir
  contenido: Historia (Decreto 614/2013, confirmando el listado completo de
  OA01-23 y la ausencia de personajes históricos puntuales riesgosos) e
  Inglés (`curriculumnacional.cl/curriculum/7o-basico-2o-medio/ingles/
  7-basico`, confirmando la reorganización en 3 ejes -Comunicación Oral,
  Comprensión de Lectura, Expresión Escrita- distinta a la de 1°-6° básico).

### 8° Básico — ✅ completo (35 módulos, las 9 asignaturas + Inglés)
Mismo Decreto 614/2013 que 7° básico (confirmado antes de construir: 8° básico
usa el mismo decreto y la misma lista de 10 asignaturas que 7°, sin cambios).

- **Lenguaje** (5): Comprensión VIII (narrador, estructura temporal,
  textos no literarios — OA03,11-12), Géneros Dramáticos y Épicos (texto
  dramático, comedia, epopeya en su contexto — OA05-07), Textos
  Argumentativos y Medios (postura del autor, hechos vs. opiniones,
  estereotipos y propósito en medios — OA09-10), Gramática VIII (modos
  verbales indicativo/subjuntivo/imperativo, correferencia con pronombres
  — OA17-19), Ortografía VI (usos de la coma, punto y coma, dos puntos —
  OA20). Fuera: OA01-02,07 (actitudinal/subjetivo), OA04 (lenguaje
  poético, ya cubierto en 5°-7°), OA08 (interpretación personal),
  OA13-16 (producción escrita), OA21-24 (comunicación oral), OA25-26
  (proceso de investigación propio).
- **Matemática** (8): Enteros y Racionales (multiplicación/división con
  regla de signos, operatoria con fracciones — OA01-02), Potencias y
  Raíces (potencias de exponente hasta 3, multiplicación de potencias de
  igual base, raíces cuadradas de cuadrados perfectos — OA03-04),
  Variaciones Porcentuales (aumentos y descuentos — OA05), Álgebra y
  Ecuaciones VIII (reducir términos semejantes, ecuaciones e inecuaciones
  lineales — OA06,08-09), Funciones (evaluar función lineal y función
  afín en un valor — OA07,10), Geometría VIII: Pitágoras y Volumen
  (teorema de Pitágoras con tríos pitagóricos, volumen de prismas rectos
  y cilindros — OA11-12), Transformaciones Geométricas (traslación/
  rotación/reflexión descritas por puntos y vectores, mismo criterio sin
  imágenes animadas que Geometría V de 5° básico — OA13-14), Estadística
  y Combinatoria (principio multiplicativo, mediana por posición,
  detección de gráficos engañosos — OA15-17). Ningún OA de Matemática 8°
  queda fuera.
- **Ciencias Naturales** (5): La Célula VIII (historia del modelo celular
  -Hooke, Leeuwenhoek-, célula procarionte/eucarionte y sus estructuras
  -núcleo, mitocondria, cloroplasto-, difusión y osmosis — OA01-03),
  Nutrición y Sistemas del Cuerpo (sistemas digestivo/circulatorio/
  respiratorio/excretor trabajando en conjunto, nutrientes -carbohidratos,
  proteínas, grasas, vitaminas, minerales, agua- — OA05-07), Electricidad
  II (cargas y electrización, tecnologías de generación eléctrica -paneles
  solares, eólica, hidroeléctrica-, circuitos en serie y en paralelo —
  OA08-10), Calor y Transferencia (conducción, convección y radiación,
  distinto de "Calor, Temperatura y Estados" de 6° básico — OA11), El
  Átomo y la Tabla Periódica (modelos atómicos de Dalton a Bohr,
  partículas del átomo, tabla periódica, elementos esenciales para la
  vida C-H-O-N — OA12-15). Fuera: OA04 (modelos de estructuras vegetales,
  producción práctica). **Nota de proceso:** esta asignatura se completó
  en una sesión posterior a las otras 8 de este año — dos intentos
  previos de escribirla se truncaron a medio archivo por interrupciones
  de la sesión de generación (ver "Nota técnica" más abajo), así que se
  avanzó primero con el resto del año y se retomó Ciencias después.
- **Historia, Geografía y Cs. Sociales** (6): Humanismo y Renacimiento
  (el ser humano como centro, imprenta, revolución científica — OA01-02),
  Estado Moderno y Mercantilismo (concentración del poder real,
  burocracia, rutas comerciales — OA03-04), Conquista de América II
  (choque cultural, factores de la rapidez de la conquista, impacto en
  Europa — profundiza con procesos y causas lo ya visto de forma más
  básica en 5° básico — OA05-07), La Colonia II (rol administrativo de
  las ciudades, Barroco colonial, comercio atlántico, sociedad y
  mestizaje, frontera con el pueblo mapuche, hacienda e inquilinaje —
  profundiza la Colonia de 5° básico — OA08-13), Ilustración y
  Revoluciones (razón, separación de poderes, revoluciones de fines del
  s. XVIII, independencia americana como proceso continental, derechos
  del hombre y del ciudadano — OA14-16,18-19), Geografía Regional
  (criterios que definen una región, problemas regionales, índice de
  desarrollo humano — OA20-22). Fuera: OA17 (contrastar posturas del
  debate de legitimidad de la conquista conectándolo con visiones
  actuales — interpretación multiperspectiva que el propio OA exige,
  mismo criterio que HI06 OA08 de 6° básico; el hecho histórico del
  debate sí se menciona factualmente en Conquista de América II).
- **Artes Visuales** (1): Montaje y Difusión del Arte (AR08 OA06 —
  profundiza el módulo de 7° básico con el ángulo nuevo del OA de 8°: CÓMO
  se monta una exposición -iluminación, cartelas, distancia entre obras- y
  qué aporta a su comunidad). Fuera: OA01-03 (crear trabajos visuales
  propios, incluida instalación — producción práctica), OA04-05
  (analizar/evaluar obras propias y de pares — apreciación subjetiva).
- **Música** (1): Armonía y Acompañamiento (MU08 OA02, ángulo del OA de 8°
  que ningún año anterior había cubierto: qué es un acorde, acompañamiento
  armónico, convención mayor/menor presentada explícitamente como
  convención expresiva de uso pedagógico, no verdad absoluta — mismo
  criterio que Color Expresivo de 3° básico). Fuera: OA01 (sensaciones
  personales), OA03-05 (cantar/tocar/improvisar, desempeño con audio real),
  OA06 (autoevaluación), OA07 (rol social de la música, ya cubierto en 3°).
- **Educación Física y Salud** (2): Sistemas de Juego y Táctica (el texto
  de EF08 OA02 nombra literalmente "ubicar el balón lejos de un
  contrincante", "utilizar espacios para recibir sin oponentes" y
  "aplicar un sistema de juego: uno contra uno, tres contra tres" — más
  específico que las estrategias generales de 7°), Principios de
  Entrenamiento (EF08 OA03 nombra literalmente Frecuencia, Intensidad,
  Tiempo de duración/recuperación, Progresión y Tipo de ejercicio —
  conceptos factuales identificables sin requerir práctica física en
  pantalla). Fuera: OA01 (habilidades motrices específicas por deporte),
  OA04-05 (práctica regular y participación/promoción en la comunidad
  escolar — requieren acción física y comunitaria real).
- **Orientación** (5): Prevención VIII (OA03, aplicando la misma política
  confirmada explícitamente por el usuario para 7° básico: solo factores
  de riesgo/protección, sin ningún detalle de la dimensión sexual del
  OA02 excluido), Bienestar y Autocuidado VIII (OA04: alimentación,
  descanso, actividad física, integridad corporal, uso seguro de redes),
  Relaciones e Inclusión (OA05: igualdad, dignidad, inclusión y no
  discriminación en relaciones presenciales y virtuales), Participación
  Democrática (OA07-08, ángulo genuinamente nuevo que ningún año anterior
  de Orientación había cubierto: intereses comunes del grupo, acuerdos
  por diálogo democrático, debate y representantes electos), Gestión del
  Aprendizaje VIII (OA09-10: metas basadas en intereses/capacidades
  propias, gestión autónoma con monitoreo y ajuste). Fuera: OA01
  (autoconocimiento subjetivo), OA02 (dimensiones de la sexualidad e
  intimidad, mismo criterio de siempre), OA06 (resolución de desacuerdos,
  texto casi idéntico al OA06 de 7° básico ya ejercitado ahí con
  escenarios nuevos).
- **Tecnología** (1): Análisis de Soluciones Tecnológicas (TE08 OA05-06 —
  profundiza el módulo de 7° con los ángulos nuevos del OA de 8°: el
  USUARIO como centro del análisis, y la dimensión ÉTICA). Fuera: OA01-04
  (identificar necesidades y diseñar/elaborar/evaluar/comunicar un
  producto tecnológico propio — producción práctica).
- **Inglés** (2): Funciones del Idioma VIII (comparaciones y
  superlativos, intenciones futuras con going to/will, indicaciones de
  dirección, condicionales simples — IN08 OA08,16, ángulos nuevos
  respecto a 7° básico), Lectura Avanzada (secuencia y relaciones
  causa-efecto en textos no literarios y literarios — IN08 OA09-11).
  Fuera: OA01-07 (comprensión y producción oral), OA12 (estrategias de
  lectura como proceso propio), OA13-15 (expresión escrita, producción
  propia).

**Nota técnica sobre Ciencias Naturales 8°:** durante la construcción de
este año, dos intentos de escribir el contenido de Ciencias 8° (sistema
celular, sistemas del cuerpo, electricidad, calor, modelo atómico)
quedaron truncados a medio archivo por interrupciones de la sesión de
generación, dejando `js/content/ciencias.js` con una escritura parcial que
rompía la sintaxis del módulo (detectado ambas veces con un script de
verificación de imports que aísla qué archivo falla al cargar). Ambas
veces se recortó el archivo de vuelta al último punto limpio (cierre de
`genMateriaGases7Round`, el último generador válido de 7° básico) para no
dejar la app rota, y se avanzó primero con las otras 8 asignaturas. En una
sesión posterior se retomó y completó Ciencias 8° sin problemas: los 5
módulos (`celula8`, `nutricionsistemas8`, `electricidad8`, `calor8`,
`atomotabla8`) se escribieron, registraron y verificaron igual que el
resto del año (300+ módulos de toda la app pasan fuzz estructural y
simulación de sesión sin duplicados ni repeticiones), y se probaron
visualmente en el navegador (mapa de Ciencias con sus 5 módulos, una
ronda jugada en "La Célula VIII"). Lección para sesiones futuras: si una
escritura de contenido queda interrumpida a medio archivo, verificar
siempre con un import-check aislado ANTES de seguir avanzando, y si el
archivo se recorta para dejarlo en un estado limpio, retomar esa
asignatura en la misma sesión o en la siguiente disponible en vez de
dejarla indefinidamente pendiente.

**Otros hallazgos técnicos de esta ronda:**
- **Bug real de uso incorrecto de `uniqueDistractors()`** (`js/utils.js`):
  esa función tiene la firma `uniqueDistractors(correct, min, max, spread,
  count)` — recibe límites numéricos, no un callback generador. Seis
  generadores nuevos de Matemática 8° (`genEnterosRacionales8Round`,
  `genPotenciasRaices8Round`, `genAlgebra8Round`, `genFunciones8Round`,
  `genGeometria8Round`, `genEstadisticaCombinatoria8Round`) la llamaron
  incorrectamente pasando una función como segundo argumento (patrón que
  no existe en ningún generador anterior de la app), lo que producía
  comparaciones con `NaN` y devolvía menos opciones únicas de las
  necesarias — detectado por el fuzz-testing estructural como "bad
  options" en los 6 módulos. Corregido reemplazando cada llamada por
  lógica de deduplicación manual explícita (arrays de candidatos +
  `while` acotado), el mismo patrón que ya usan decenas de otros
  generadores en este archivo. Lección para años futuros: `uniqueDistractors`
  solo sirve para distractores dentro de un rango numérico simple; para
  listas de candidatos ad-hoc (como potencias, exponentes o volúmenes con
  fórmulas distintas) hay que escribir la deduplicación a mano, igual que
  en `genGeometria7Round`/`genFuncionesIdioma8Round` y similares.
- Verificado tras la corrección: los 30 módulos nuevos de 8° básico, y los
  296 módulos de toda la app, pasan fuzz estructural y simulación de
  sesión (150 iteraciones/sesiones para los nuevos, 40-60 para el resto)
  sin ningún duplicado, `undefined`, `correctValue` ausente, ni repetición.
  Verificado también visualmente en el navegador: mapa de 8° básico con
  las 9 materias (Ciencias como placeholder correcto), mapa de módulos de
  Historia, y una partida jugada en "Geometría VIII: Pitágoras y Volumen"
  (incluye verificación manual de que 6×4×4=96 cm³ y el trío pitagórico
  5-12-13 aparecían como respuesta correcta).

### Estudio para Pruebas — 🚧 Química Diagnóstica completa (11 módulos), Microbiología Clínica pendiente
**Excepción explícita a la regla de oro** (ver arriba): etapa pedida directamente
por el usuario (2026-07-26) para preparar exámenes universitarios reales de un
familiar (Tecnología Médica, Universidad Central de Chile) — nunca basada en OA
de Mineduc. Accesible desde `etapaMap` como una etapa más (mismo nivel que
Parvularia/Básica/Media/EPJA), no anidada bajo "Herramientas de consulta" (pedido
explícito del usuario vía AskUserQuestion). El usuario autorizó explícitamente
"fuerza bruta" para la extracción (múltiples agentes de investigación leyendo
cada PDF fuente completo) y pidió priorizar el formato de caso clínico (paciente
+ datos de laboratorio + pregunta), ya que es el mismo formato de evaluación real
del curso.

- **Química Diagnóstica** (11 módulos, 129 ítems, `js/content/estudioPruebas/quimicaDiagnostica.js`):
  Casos Clínicos: Función Renal (11 ítems, incluye clearance de creatinina y calcio
  corregido por albúmina como ejercicios numéricos), Casos Clínicos: Función Hepática
  (7 ítems: colestasis obstructiva + patrón hepatocelular como contraste), Análisis de
  Orina y Sedimento, Líquidos Biológicos: Transudado vs Exudado (Criterios de Light,
  GASA, quiloso/pseudoquiloso, cristales de líquido sinovial), LCR y Diagnóstico de
  Meningitis (bacteriana/viral/tuberculosa), Valores Críticos y de Alerta, Control de
  Calidad y Estadística Dx (sensibilidad/especificidad, reglas de Westgard),
  Endocrinología y Marcadores Tumorales, Gases Arteriales y Equilibrio Ácido-Base
  (caso EPOC + los 4 trastornos primarios), Páncreas: Enzimas y Pancreatitis (caso
  pancreatitis alcohólica), Bioquímica de Reactivos e Insertos. Todo el contenido fue extraído
  literalmente (nunca inventado) de los apuntes/clases/guías de laboratorio/insertos
  de reactivos reales del curso, por agentes de investigación que leyeron cada PDF
  fuente completo y citaron el archivo exacto de cada hecho — ese proceso de
  extracción quedó documentado en la conversación, no en el código. Varios ítems son
  casos clínicos reales ya resueltos en el material del curso (glomerulonefritis
  aguda post-estreptocócica, ERC con hiperparatiroidismo secundario, colestasis
  obstructiva, EPOC descompensado, pancreatitis alcohólica, pseudogota); el resto son
  preguntas factuales de una sola respuesta correcta derivadas directamente de
  definiciones/valores de referencia/mecanismos ya extraídos, evitando expresamente
  las contradicciones internas detectadas en el material fuente (p. ej. rangos de
  referencia que difieren levemente entre dos documentos del mismo curso).
- **Microbiología Clínica**: aún sin contenido — la extracción de PDFs fuente quedó
  parcialmente completada (fundamentos bacterianos, antimicrobianos/resistencia y
  bacilos gram negativos todavía pendientes de extraer) cuando el usuario pidió
  explícitamente priorizar Química Diagnóstica primero. Mientras no tenga `modules`,
  `ESTUDIO_PRUEBAS_SUBMODULOS` (`js/gradeContent.js`) la muestra como tarjeta
  "🚧 Próximamente" en `estudioPruebasMap` — no rompe nada, solo no es jugable
  todavía. Para construirla: mismo patrón que `quimicaDiagnostica.js` (archivo
  nuevo en `js/content/estudioPruebas/`, registrar en `ESTUDIO_PRUEBAS_SUBMODULOS`
  con su propio `screen`, agregar el `else if` en `render.js`, registrar sus
  `genXxxRound` en `MC_GAMES`/`MC_KEYS`, agregar sus `MODULE_TITLES` y claves de
  `state.stars`).

Verificado: los 11 módulos de Química Diagnóstica pasan fuzz estructural (300
iteraciones cada uno: sin `undefined`, sin opciones duplicadas, `correctValue`
siempre presente, exactamente 4 opciones, sin apóstrofes en `speakText` — que
rompen el atributo `onclick` del botón "Escuchar") y simulación de sesión
completa (300 sesiones cada uno, sin ningún repetido). Probado también en el
navegador: navegación completa `etapaMap` → `estudioPruebasMap` →
`quimicaDiagnosticaMap` → módulo individual, con una partida jugada de principio
a fin en "Casos Clínicos: Función Renal" (respuesta correcta avanza sola,
respuesta incorrecta muestra el overlay de Carboncito con el `explain`, la
pantalla de resultados final muestra estrellas/insignia correctamente).

**Auditoría de UX/UI/responsive/banco de preguntas (2026-07-28, pedido explícito
del usuario tras probar el módulo):** se detectaron y corrigieron 3 problemas
reales, todos verificados con capturas de pantalla en 5 anchos de viewport
(320/375/768/1024/1440px):
- **Bug de enrutamiento de columnas** (el más impactante): mcEngine.js interpreta
  `cols:2` como "una sola columna a ancho completo" y `cols:1` como "grid de 2
  columnas" (nomenclatura heredada, contraintuitiva pero ya establecida en el
  resto de la app — p. ej. `comprension5` en `lenguaje.js` ya usa `cols:2` para
  sus alternativas largas). Los 11 generadores de Química Diagnóstica usaban
  `cols:1` con alternativas de texto largo (oraciones clínicas completas),
  forzándolas a un grid de 2 columnas angosto — el causante principal de
  "alternativas sobredimensionadas" y tarjetas demasiado altas. Cambiado a
  `cols:2` en los 11 generadores (una sola línea de `sed`), igualando el patrón
  ya usado en el resto de la app para este tipo de contenido.
- **Espacio desaprovechado en tablet/escritorio:** `#app` pasaba de golpe de
  480px a 640px a 760px (2 escalones), dejando hasta ~47% de la pantalla vacía
  en escritorio ancho (1440px) y saltos bruscos entre anchos intermedios.
  Reemplazado por una escala de 5 escalones (480/560/700/860/980px). Además,
  `.prompt-card` y `.option-btn.panel` ahora limitan su ANCHO DE LECTURA a
  640px (centrado dentro del contenedor más ancho) para que un párrafo clínico
  largo no se estire a líneas de 100+ caracteres en escritorio — el contenedor
  crece para dar más "aire" visual, pero el texto mantiene una medida de
  lectura cómoda. `.option-btn`/`.option-btn.panel` también se afinaron
  (`clamp()` más ajustado, menos padding).
- **Etiquetas de nodo cortadas en el mapa de módulos:** `.node-label` usaba
  `white-space:nowrap`, diseñado para títulos cortos tipo Mineduc ("Contar",
  "Vocales"). Los títulos de Química Diagnóstica son más largos y descriptivos
  ("Líquidos Biológicos: Transudado vs Exudado"), y en nodos cercanos al borde
  del mapa el texto se salía del viewport. Cambiado a `white-space:normal` con
  `max-width:128px` (permite salto de línea) — no afecta los títulos cortos ya
  existentes, que siguen en una sola línea. También se ajustó
  `QUIMICA_DIAGNOSTICA_POS` (el primer nodo quedaba pegado al título
  "Química Diagnóstica", que ocupa 2 líneas por ser más largo que la mayoría de
  los títulos de asignatura).
- **Auditoría del banco de preguntas** (125 → 129 ítems tras la revisión): se
  listaron las 125 preguntas originales y se revisaron una por una buscando
  duplicados literales (ninguno encontrado) y redundancia conceptual entre
  módulos. Se encontró y corrigió 1 redundancia real: `ENDOCRINO_TUMORAL_BANK`
  y `PANCREAS_BANK` preguntaban literalmente el mismo hecho en direcciones
  opuestas (célula beta ↔ insulina) — se reemplazó el ítem de `PANCREAS_BANK`
  por uno sobre la amilasa salival (parotiditis) como tercera causa de
  hiperamilasemia no pancreática, un concepto distinto y ya grounded en el
  propio `recurso` de un ítem vecino del mismo banco. Se identificaron y
  corrigieron 3 vacíos de cobertura reales, agregando ítems nuevos (grounded en
  material ya extraído, nunca inventado): "Casos Clínicos: Función Hepática"
  solo cubría un caso colestásico — se agregó un ítem de contraste con el
  patrón hepatocelular (6→7 ítems); "LCR y Diagnóstico de Meningitis" no cubría
  la meningitis tuberculosa pese a estar en la tabla diferencial ya extraída —
  se agregó (10→11 ítems); "Gases Arteriales" nunca tenía alcalosis metabólica
  ni alcalosis respiratoria como respuesta CORRECTA (solo aparecían como
  distractores) — se agregaron ambos trastornos como ítems nuevos, espejo
  simétrico de los 2 que ya existían (acidosis metabólica/respiratoria)
  (12→14 ítems). Verificado tras los cambios: los 11 generadores pasan fuzz
  estructural y simulación de sesión (400 iteraciones/200 sesiones cada uno)
  sin ningún duplicado ni repetido, y los 312 módulos de toda la app siguen
  pasando la verificación de regresión.

**Alternativas en MAYÚSCULAS y jerarquía tipográfica (2026-07-26, pedido
explícito del usuario — Senior Product Designer/UX/Accesibilidad):** tras la
auditoría anterior, el usuario detectó que las 129 alternativas de los 11
bancos seguían en MAYÚSCULAS SOSTENIDAS (`correcta`/`opts`), un patrón de
autoría propio de este módulo (no una convención de la app — el resto de
asignaturas ya usa "oración normal", confirmado revisando `lenguaje.js`/
`historia.js`/`ciencias.js` antes de decidir el enfoque). Se confirmó primero
que NO era un problema de CSS (`grep -c text-transform styles.css` → 0
resultados): el problema era 100% de contenido. Cambios:
- **Recasing manual de los 129 ítems** (no un regex automático: un script que
  solo hiciera `.toLowerCase()` + capitalizar la primera letra habría
  destruido las siglas/acrónimos médicos incrustados en las respuestas —ASO,
  GGT, LDH, FA, PTH, TFG, ERC, PSA, CA 125, CA 19.9, AFP, TSH, EDTA, LCR, HCO3,
  pH, GOD/POD, BCG, entre ~30 más—, que deben mantenerse en mayúscula porque
  son la forma correcta del término, no una decisión de estilo). Cada
  `correcta`/`opts` se reescribió a mano preservando esas siglas y unidades
  exactamente, dejando el resto en formato de oración natural (ej. "ESPERAR AL
  SIGUIENTE CONTROL DE RUTINA SIN AVISAR A NADIE" → "Esperar al siguiente
  control de rutina sin avisar a nadie").
- **Bug encontrado de paso, corregido antes de que se manifestara:** las 16
  líneas `explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.'`
  (una o dos por generador, los 11 generadores) hacían `.toLowerCase()` sobre
  `item.correcta` — inofensivo mientras `correcta` estaba en MAYÚSCULAS
  (daba una oración en minúsculas normal), pero con `correcta` ya en oración
  natural, ese `.toLowerCase()` habría vuelto a mangled las siglas dentro del
  texto del `explain` (PTH→pth, ASO→aso, GGT→ggt...). Corregido con
  `sed -i "s/item\.correcta\.toLowerCase()/item.correcta/g"` (16 ocurrencias,
  verificado con grep que no queda ninguna).
- **Jerarquía tipográfica pregunta vs. alternativas:** se encontró un problema
  de fondo más allá del CASE: en el ~80% de los ítems (los que no tienen
  `caso`, un caso clínico previo), el `promptHTML` renderizaba la pregunta
  ENTERA con la clase `.prompt-hint` — la misma clase que en TODO el resto de
  la app (`lenguaje.js`, etc.) se usa exclusivamente como subtítulo secundario
  debajo de un elemento principal más grande (un emoji, una oración en
  `.prompt-sentence`), nunca como el único contenido de la pregunta. Eso
  dejaba la pregunta en texto pequeño (13px), peso 600 y color atenuado
  (`--ink-soft`) — más débil visualmente que las propias alternativas. Se
  cambiaron las 9 ocurrencias de
  `promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>'` a
  `'<p class="prompt-sentence">'+item.pregunta+'</p>'` (los ítems que sí tienen
  `caso` ya usaban `.prompt-sentence` para el caso y correctamente dejaban la
  pregunta puntual en `.prompt-hint` como subtítulo — ese patrón no se tocó).
- **Peso y familia tipográfica de `.option-btn.panel`** (`styles.css`): la
  regla ya limitaba el ancho de lectura a 640px (auditoría anterior), pero
  heredaba de `.option-btn` la fuente de titular (Baloo 2) en `font-weight:800`
  — pensada para 1-3 palabras cortas en los juegos de opción múltiple
  normales, no para oraciones completas. Con las MAYÚSCULAS ya corregidas, ese
  peso/fuente seguía haciendo que las alternativas "gritaran" y compitieran
  con la pregunta. Se cambió `.option-btn.panel` a `font-family:
  var(--font-body)` (Quicksand, la fuente de cuerpo de la app) con
  `font-weight:600` y `text-align:left` (un párrafo de varias líneas se
  escanea más rápido alineado a la izquierda que centrado). La pregunta
  (`.prompt-sentence`: Baloo 2, peso 700) queda así claramente por sobre las
  alternativas en peso/familia, cumpliendo el pedido explícito de que la
  pregunta siga siendo el elemento dominante de la pantalla.
- **Verificación:** los 11 generadores pasan fuzz estructural (400
  iteraciones cada uno: sin `undefined`, sin opciones duplicadas,
  `correctValue` siempre presente, sin mayúsculas sostenidas remanentes de
  5+ letras en `correcta`/`opts` vía grep dedicado) y los 312 módulos de toda
  la app pasan la verificación de regresión. Validado visualmente en el
  navegador en 4 anchos (375/768/1024/1440px), en un ítem con `caso` (Casos
  Clínicos: Función Renal/Hepática) y uno sin `caso` (Valores Críticos): en
  los 4 anchos la pregunta se ve en negrita y dominante, las alternativas en
  oración natural, alineadas a la izquierda, sin competir visualmente, y sin
  que el texto se corte ni desborde la tarjeta.

**Auditoría de repetición del banco de preguntas (2026-07-26, pedido explícito
del usuario — auditor de calidad de contenido/diseño instruccional):** análisis
completo de los 129 ítems extraídos programáticamente (no de memoria) vía los
propios `genXxxRound()`, buscando específicamente duplicados literales,
duplicados semánticos (mismo razonamiento clínico con distinta redacción) y
reutilización excesiva de un mismo caso clínico. Hallazgo principal:
**0% de duplicados literales**, pero **4 pares de alta similitud (≥85%)**
detectados y corregidos:
- **Función Hepática, ítem "regla general" vs. ítem del caso principal**: ambos
  pedían identificar el mismo patrón colestásico (FA/GGT↑ + bilirrubina
  directa) con enunciados casi calcados. Se reescribió el ítem de "regla
  general" para evaluar un ángulo distinto ya presente en su propio `recurso`
  pero nunca preguntado: por qué la GGT nunca se interpreta sola (sensible
  pero poco específica — también sube con alcohol o fármacos, sin colestasis
  real).
- **LCR, par "patrón viral" y "patrón bacteriano" del caso de la niña de 5
  años**: las dos ramas del caso (Gram negativo/hallazgo real, y "si el Gram
  hubiera mostrado bacterias") pedían nombrar el diagnóstico —exactamente lo
  mismo que ya preguntan los ítems factuales independientes "¿qué patrón de
  LCR es característico de la meningitis VIRAL/BACTERIANA?". Se reescribieron
  ambas ramas del caso para pedir el MECANISMO (por qué la glucosa se mantiene
  normal en la viral / por qué predominan los neutrófilos en la bacteriana) en
  vez de repetir el nombre del diagnóstico — mecanismo que ya estaba explicado
  en el propio `recurso` de cada ítem pero nunca se preguntaba directamente.
- **Calibrador, Control de Calidad vs. Reactivos**: el ítem de Reactivos
  ("¿qué representa el valor asignado de un calibrador?") repetía casi
  palabra por palabra la definición ya cubierta en Control de Calidad. Se
  reescribió para evaluar la TRAZABILIDAD metrológica (concepto ya presente en
  su propio `recurso` original pero nunca preguntado explícitamente), no la
  definición básica del calibrador.

Se identificaron además ~14 ítems con solapamiento MODERADO (65-84%) que se
dejaron intactos por ser reutilización pedagógica legítima de un mismo caso
para explorar mecanismo/diagnóstico/conducta desde ángulos distintos (técnica
de evaluación clínica estándar, no "reciclaje" de contenido) — documentado en
la auditoría completa entregada al usuario en la conversación. Hallazgo no
accionado aún pero señalado como el de mayor impacto real: los bancos más
chicos (Química Diagnóstica → Función Hepática con solo 7 ítems, `rounds:6`,
margen de apenas 1) generan "sensación de repetición" para un usuario que
repite el módulo en varias sesiones —no por contenido duplicado, sino por el
tamaño acotado del banco. Recomendación pendiente para una sesión futura:
ampliar Función Hepática (7→12+) y los demás bancos de 11 ítems antes que
seguir puliendo pares semánticos puntuales.

Verificado tras las 3 correcciones: `genCasosHepatico7Round`, `genLcr7Round` y
`genReactivos7Round` pasan fuzz estructural (400 iteraciones cada uno, sin
`undefined`, sin opciones duplicadas, `correctValue` siempre presente, sin
apóstrofes en `speakText`) y los 312 módulos de toda la app pasan la
verificación de regresión.

### Educación Media, EPJA — 🔒 sin construir
`GRADES` los tiene marcados `open:false` para 7°-8° ya no aplica (ambos
están abiertos). Antes de construir Educación Media, definir con el
usuario su lista real de asignaturas (probablemente distintas: Física/
Química/Biología separadas, Filosofía, etc. — no asumir que es igual a
Básica) y confirmar su decreto curricular vigente en curriculumnacional.cl.
Luego EPJA, que tiene currículum propio organizado por niveles que
agrupan varios años en uno, no por año individual — revisar su decreto
específico antes de construir.

## Próximos pasos sugeridos (en orden)

**Plan en curso (definido con el usuario 2026-07-20): completar Educación Básica
completa (3° a 8°) antes de tocar Educación Media o EPJA.** Cada PR se confirma
individualmente con el usuario antes de mergear (no hay merge automático en bloque
para esta iniciativa).

1. ~~Completar 2° básico~~ — ✅ hecho, las 9 asignaturas completas (ver "Estado
   actual del contenido" arriba).
2. ~~Completar 3° básico~~ — ✅ hecho (2026-07-21), las 9 asignaturas completas,
   36 módulos (ver "Estado actual del contenido" arriba). El usuario pidió seguir
   con 4°-8° en la misma sesión, pero se decidió mantener el patrón de "un año a
   la vez con su propio PR" ya acordado (2026-07-20) en vez de generar 5 años de
   contenido curricular sin revisión intermedia.
3. ~~Completar 4° básico~~ — ✅ hecho (2026-07-22), las 9 asignaturas completas,
   30 módulos (ver "Estado actual del contenido" arriba). El usuario confirmó
   "un PR por año" como el proceso a seguir. Varios OA de 4° básico repiten
   casi textualmente el texto de 3° básico (Música, Ed. Física, Orientación) —
   se resolvió con contenido/escenarios nuevos en vez de duplicar módulos, y se
   documentó caso a caso en el comentario de cada archivo. Se encontraron y
   corrigieron 3 bugs de opciones duplicadas durante el fuzz-testing (dos dígitos
   iguales colapsando una descomposición numérica, una fracción mixta simétrica
   colapsando con su distractor, y una pregunta de opción múltiple armada con 4
   opciones sobre un banco que solo tenía 2 categorías reales) — lección para
   años futuros: los generadores con distractores derivados de un banco pequeño
   necesitan revisar cuántas categorías/valores ÚNICOS existen realmente antes
   de decidir cuántas opciones ofrecer.
4. ~~Completar 5° básico~~ — ✅ hecho (2026-07-22), las 9 asignaturas de
   Básica completas más Inglés como asignatura nueva (primera vez que la app
   tiene contenido en otro idioma — ver "Estado actual del contenido"
   arriba), 35 módulos. Se verificó primero que Inglés efectivamente
   comienza en 5° básico según el currículum vigente, en vez de asumirlo.
   `speak()`/`pickBestVoice()` en `js/audio.js` ahora aceptan un parámetro
   opcional de idioma para no leer el inglés con voz en español. 6 módulos
   con bug de opciones duplicadas (banco del mismo tamaño que `rounds`, o
   menor) encontrados por fuzz-testing y corregidos ampliando contenido real.
5. ~~Completar 6° básico~~ — ✅ hecho (2026-07-22), las 9 asignaturas más
   Inglés completas, 39 módulos (ver "Estado actual del contenido" arriba).
   La primera versión excluía por completo HI06 OA08 (quiebre democrático/
   régimen militar) y CN06 OA04-05 (sistema reproductor/pubertad); tras
   conversarlo con el usuario (que planteó dudas sobre excluir contenido
   dado el rol de la app como apoyo a la enseñanza), se revisó cada caso: el
   sistema reproductor se incorporó de forma anatómica/factual, y el
   quiebre democrático se incorporó parcialmente como hechos cronológicos
   indiscutibles (fechas del golpe de 1973, el plebiscito de 1988, el
   retorno a la democracia en 1990), dejando fuera del quiz solo la
   interpretación multiperspectiva que el propio OA exige — ver "Revisión
   post-merge de las exclusiones" en "Estado actual del contenido" arriba
   para el criterio completo. Se encontró y corrigió un bug real de CSS
   ausente en `.bar-chart`/`.bar-col`/etc. que llevaba desde 2° básico (los
   gráficos de barra se veían como bloques planos, sin flexbox ni color) —
   corregido para todos los años que ya usaban gráficos de barra, no solo
   6°. Se agregaron `doubleBarChartHTML()`/`pieChartSVG()`/`pieChartHTML()`
   para los gráficos nuevos de Datos y Probabilidades IV. 12 módulos con
   bug de opciones duplicadas (banco ≤ `rounds:8`) encontrados por
   fuzz-testing y corregidos ampliando contenido real — lección reforzada:
   revisar el tamaño real de cada banco ANTES de dar por terminado un
   módulo, no solo al final.
6. ~~Completar 7° básico~~ — ✅ hecho (2026-07-22), las 9 asignaturas más
   Inglés completas, 34 módulos (ver "Estado actual del contenido" arriba).
   Primer año que usa el Decreto 614/2013 en vez del 439/2012 — verificado
   antes de construir, incluyendo la nueva numeración de OA y el renombre
   de Lenguaje a "Lengua y Literatura". El usuario preguntó explícitamente
   por el contenido de Sexualidad y Reproducción (Ciencias) y Prevención de
   Conductas de Riesgo (Orientación) antes de escribirlos, dado el salto de
   madurez respecto a 6° básico — confirmado vía AskUserQuestion: tono
   clínico/completo para Ciencias, solo factores de riesgo/protección (sin
   detalle de sexualidad) para Orientación. Igual que en años anteriores, el
   mismo bug del placeholder `"un(a)"` sin resolver reapareció en 2
   generadores nuevos pese a estar documentado desde la auditoría de 6°
   básico — lección reforzada: no basta con documentar un bug pasado, hay
   que grepear por el patrón (`un\(a\)`) en el contenido nuevo antes de
   darlo por terminado. 12 de los 34 módulos nuevos tenían bank ≤
   `rounds:8` (repetición garantizada), y 2 de esos 12 necesitaron una
   segunda ronda de ampliación porque la primera pasada solo llegó a
   exactamente 8 ítems sin margen real — lección reforzada: verificar el
   conteo final después de expandir, no asumir que "agregué algunos ítems"
   fue suficiente.
7. ~~Completar 7° básico~~ — ✅ hecho (2026-07-22/25), 34 módulos, las 9
   asignaturas más Inglés (ver "### 7° Básico" arriba). Primer año en el
   Decreto 614/2013.
8. ~~Completar 8° básico~~ — ✅ hecho, 35 módulos, las 9 asignaturas más
   Inglés (ver "### 8° Básico" arriba para el detalle completo con OA).
   Ciencias Naturales se completó en dos pasadas: los primeros 8 intentos
   de construirla dentro de la misma sesión se truncaron a medio archivo
   por interrupciones repetidas, así que se avanzó primero con las otras
   8 asignaturas y se retomó Ciencias después con éxito (ver nota técnica
   en "### 8° Básico" para el detalle completo del incidente y la
   lección: verificar con un import-check aislado ANTES de dar por
   terminada una escritura de contenido, no después). También se
   encontró y corrigió un bug real de uso incorrecto de
   `uniqueDistractors()` en 6 generadores de Matemática (se le pasó un
   callback en vez de límites numéricos `(correct, min, max, spread,
   count)`, produciendo comparaciones con `NaN`) — para distractores
   ad-hoc que no calzan con esa firma, hay que deduplicar a mano.
9. Ahora que toda Educación Básica está completa (1° a 8°), definir con
   el usuario el mismo patrón para Educación Media
   (probablemente asignaturas distintas: Física/Química/Biología
   separadas, Filosofía, etc. — pedir la lista real antes de asumir) y
   luego EPJA (currículum propio, organizado por niveles que agrupan
   varios años en uno, no por año individual — revisar su decreto
   específico antes de construir, no asumir que es igual a Básica/Media
   regular).
10. ~~Evaluar agregar persistencia real (localStorage)~~ — ✅ hecho (`js/persistence.js`).
   Si más adelante se quiere progreso sincronizado entre dispositivos, ahí sí se
   necesitaría un backend real (Firebase/Supabase u otro) — GitHub Pages es hosting
   estático puro, no puede correr una base de datos ni lógica de servidor.
9. Si se quiere cobertura 100% literal de 1° básico, revisar los OA marcados "fuera"
   en cada asignatura (arriba) y decidir si vale la pena forzarlos al motor de opción
   múltiple o si requieren un tipo de juego nuevo (p. ej. grabación de voz para Música,
   o un lienzo de dibujo para Artes Visuales).
10. ~~Construir los 7 núcleos restantes de Educación Parvularia NT~~ — ✅ hecho, los 8
   núcleos de NT están completos (ver "Estado actual del contenido" arriba). Si más
   adelante se quiere cobertura 100% literal de algún núcleo, revisar los OA marcados
   "fuera" arriba y decidir si vale la pena forzarlos al motor de opción múltiple o si
   requieren un tipo de juego nuevo (p. ej. movimiento físico real para Corporalidad,
   o producción plástica propia para Lenguajes Artísticos). Evaluar si construir Nivel
   Medio/Sala Cuna tiene sentido en algún momento, dado que ese rango de edad
   generalmente no usa juego en pantalla (revisar el Decreto 481/2017 para esos
   niveles antes de decidir).
11. **Ideas del usuario para explorar más adelante (aún no implementadas, solo
   anotadas — 2026-07-20):**
   - Evaluar qué tan distinto debería ser el diseño (colores, formas, sonidos, ritmo
     de feedback) para captar la atención de perfiles neurotípicos vs. neurodivergentes.
     Requiere investigación/fuente antes de implementar cualquier variante, por la
     misma regla de oro del proyecto (no inventar sin base).
   - Sistema de verificación de edad y conocimientos previos para desbloquear niveles
     más avanzados (algún tipo de prueba de acceso). Pendiente de definir criterios.

## Auditoría frontend global: ancho, mapa de nodos y scroll (2026-07-26)

Pedido explícito del usuario (rol Senior Frontend Engineer): "la app no usa
todo el ancho", "los nodos del mapa se deforman", "hay scroll vertical
excesivo". El prompt original asumía React/Next.js/Tailwind — se aclaró que
el proyecto es HTML/CSS/JS vanilla (ver "Stack técnico" arriba) y se hizo la
auditoría equivalente sobre los archivos reales. El usuario luego delegó
explícitamente la decisión de diseño ("prefiero que decidas tú, considera
como es la aplicación") en vez de pedir un ancho específico.

- **Nodos del mapa con altura variable, causa raíz medida en el navegador**:
  `.node` (`styles.css`) no tenía altura fija — crecía según cuántas líneas
  ocupara `.node-label` (que desde la auditoría de 2026-07-28 permite salto
  de línea sin límite, `white-space:normal`). Medido con
  `getBoundingClientRect()` en Química Diagnóstica (11 nodos): la altura real
  iba de **155.9px** (título de 2 líneas) a **202.75px** (título de 3 líneas,
  "Gases Arteriales y Equilibrio Ácido-Base"), mientras el espaciado vertical
  entre nodos del mismo lado del zigzag es de **162px** (constante, calculado
  desde las coordenadas `%` de `QUIMICA_DIAGNOSTICA_POS` × `height:900`) —
  con esa variación de +47px, dos nodos altos consecutivos (nodo 7 y nodo 9)
  llegaban a solaparse hasta **25px**.
  - **Primer intento (revertido en la misma sesión, tras revisión propia):**
    fijar `.node{height:158px}` + `.node-label` con `-webkit-line-clamp:2` +
    `min-height:55px` — arregló Química Diagnóstica, pero un escaneo
    geométrico posterior de los **86 datasets de mapa de toda la app**
    (comparando cada par de nodos del mismo lado del zigzag contra el
    `height`/coordenadas real de su propio dataset) mostró que 14 de esos
    86 tienen un espaciado vertical MÁS AJUSTADO que 158px (hasta 136.8px en
    Matemática 5°-6° básico). Con una altura fija, nodos de título CORTO que
    antes cabían perfecto (ej. "Dividir", "Contar") se inflaban al mismo
    tamaño que el peor caso de 2 líneas, y pasaban a solaparse en esos
    datasets que antes estaban bien — confirmado navegando a Matemática 5°
    básico y midiendo overlaps reales de hasta 21.2px que NO existían antes
    del primer intento.
  - **Fix definitivo:** se quitó la altura fija de `.node` y el
    `min-height` de `.node-label`, dejando `-webkit-line-clamp:2` como
    único límite (un TOPE máximo, no un mínimo forzado). Un título de 1
    línea conserva su alto natural y compacto (~124.6px medido); uno de 2
    líneas llega a ~140.3px — una variación real de solo ~16px (antes: hasta
    79px sin el fix, o el problema inverso con el fix roto). Verificado con
    `getBoundingClientRect()` en 14 datasets (los 86 escaneados por
    geometría más los ya afectados): **13 de 14 sin ningún solapamiento**
    (incluida Química Diagnóstica, el caso original). El único residual es
    Matemática 6° básico, con **3.5px** de solapamiento entre "Múltiplos y
    Factores" y "Razones y Porcentajes" — imperceptible en la práctica (antes
    del fix roto: hasta 25px; con el fix roto: hasta 21.2px en otro
    dataset) y no se intentó eliminar del todo para no arriesgar volver a
    inflar otros nodos por un margen de unos pocos px. Ninguna de las dos
    versiones del fix tocó los ~30 archivos de contenido con arrays
    `POS`/`height` por dataset — es un fix de CSS puro, general para toda
    la app.
  - **Lección para fixes de CSS futuros que afecten un componente
    reutilizado en muchos datasets/pantallas:** verificar SIEMPRE contra
    una muestra representativa de TODOS los usos del componente (no solo el
    caso puntual que motivó el fix) antes de dar el cambio por terminado —
    un fix que arregla el caso reportado puede romper silenciosamente casos
    que antes funcionaban bien, si el rango de variación real del contenido
    no se midió primero.
- **`#app` no usaba todo el ancho — causa raíz: restricción de ancho
  DUPLICADA en dos capas**: `#app` tiene su propio `max-width` (escalera de
  breakpoints, auditoría 2026-07-28) Y ADEMÁS `.prompt-card`/
  `.option-btn.panel` (los componentes de texto largo) ya se auto-limitan a
  `max-width:640px` de forma independiente para no volver incómoda la
  lectura. Es decir, el techo de `#app` (980px) ya no protegía nada que no
  estuviera protegido también a nivel de componente — solo achicaba
  innecesariamente el mapa, la home y las listas de materias, que sí se
  benefician del ancho extra. Medido en el navegador a 1440px de viewport:
  `#app` ocupaba 980px con **222.5px de margen vacío por lado**. Decisión
  tomada por Claude (el usuario delegó explícitamente el criterio): NO ir a
  ancho completo/infinito — la app es un juego mobile-first con mascota y
  mapa de nodos circulares, y un ancho "infinito" en un monitor ultra-wide
  dejaría el mapa y los botones redondos viéndose dispersos y fuera de
  proporción. Se subió el techo existente (980px→1200px a partir de
  1280px de viewport) y se agregó un escalón nuevo para monitores muy anchos
  (1320px a partir de 1600px) — reduce el margen vacío en 1440px de 230px a
  120px por lado, sin convertir la app en un layout de ancho arbitrario.
- **Scroll vertical / espacio vacío al final de cada pantalla — padding
  duplicado**: `#app{ padding-bottom:24px; }` Y `.screen{ padding:4px 20px
  40px; }` (el `40px` final) sumaban **64px de espacio vacío redundante**
  al final de cada pantalla, en dos capas que nunca se habían revisado
  juntas. Se eliminó el `padding-bottom` de `#app` — `.screen` ya cubre esa
  necesidad. La altura total de un mapa de módulo (`heightPx` hardcodeado
  por dataset, ej. `height:900` en Química Diagnóstica) no se tocó: es un
  tamaño legítimo dado el número de nodos, no un defecto — reducirlo
  arriesgaría volver a apretar los nodos.

Verificado en el navegador tras el fix definitivo: 13 de 14 datasets
revisados sin ningún solapamiento (Química Diagnóstica, Ciencias G1-G3,
Lenguaje G1/G3, Matemática G3-G5, Historia G1, mapa de años, y los 3 núcleos
de Parvularia previamente en riesgo), 1 residual de 3.5px en Matemática 6°
básico, sin errores de consola, `#app` mide 1200px a 1440px de viewport
(antes 980px). No se tocó ningún archivo de contenido (`js/content/**`) — el
fix completo vive en `styles.css`, por lo que beneficia a los ~30 mapas de
módulo de toda la app (Básica, Parvularia, Estudio para Pruebas), no solo a
Química Diagnóstica.

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
