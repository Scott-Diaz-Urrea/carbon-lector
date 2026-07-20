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
    parvularia/
      pensamientoMatematico.js  núcleo Pensamiento Matemático (Educación Parvularia,
                                nivel NT) — mismo patrón que los archivos de asignatura
                                de Básica (bancos + genXxxRound + MODULES/POS), pero
                                vive en su propia subcarpeta porque Parvularia se
                                organiza por núcleos de aprendizaje, no por asignaturas
                                (ver "Parvularia: níveles y núcleos" abajo).
  games/
    silabas.js                Sílabas: contenido + render*Screen/init*Game/draw*Round/tap*.
    secuencia.js               ídem Secuencia.
    memorama.js                ídem Memorama.
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
  nombre (no hay persistencia entre sesiones, así que el overlay reaparece cada vez
  que se recarga la página).
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
  `PARVULARIA_NIVELES`/`PARVULARIA_NIVELES_POS` en `content/grades.js`) y dentro de
  cada nivel, por **núcleo de aprendizaje** (8 núcleos del Decreto 481/2017 en el
  ámbito "Interacción y Comprensión del Entorno" + los otros dos ámbitos — ver
  `NUCLEO_DEFS` en `gradeContent.js`, cada entrada `{icon, label, screen, byNivel}`).
  Jerarquía de pantallas propia: `etapaMap` → `parvulariaNivelMap`
  (`selectNivel(id)` guarda `state.currentNivel`) → `nucleoMap` (tarjetas de núcleo,
  lee `state.currentNivel`) → `<nucleo>Map` (p.ej. `pensamientoMatematicoMap`) →
  juego individual. Deliberadamente **no** se reutilizó `SUBJECT_DEFS`/`*_BY_GRADE` ni
  `selectGrade`/`gradeLabel` — se escribieron equivalentes paralelos
  (`NUCLEO_DEFS`/`*_BY_NIVEL`, `selectNivel`/`nivelLabel`) porque las jerarquías de
  Básica (año→asignatura) y Parvularia (nivel→núcleo) son conceptualmente distintas;
  forzarlas a una abstracción común habría sido la premature abstraction que este
  proyecto evita a propósito. Para agregar un núcleo nuevo: mismo patrón que una
  asignatura de Básica (`<NOMBRE>_MODULES`/`_POS`, `genXxxRound`, registrar en
  `MC_GAMES`/`MC_KEYS`, agregar `render<Nucleo>Map()` de una línea en `render.js` y su
  `else if` en `render()`, agregar entrada a `NUCLEO_DEFS` con `byNivel`). Un núcleo
  sin `byNivel[nivel]` muestra automáticamente una tarjeta "🚧 Núcleo en preparación"
  en `nucleoMap` — no rompe nada, solo no es jugable todavía.
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

### Educación Parvularia — 🟡 parcial (1 de 8 núcleos, nivel NT)
Basado en el Decreto 481/2017, ámbito Interacción y Comprensión del Entorno, nivel
Transición (NT) — curriculumnacional.cl/curriculum/educacion-parvularia/
interaccion-comprension-entorno/nt-nivel-transicion. Sala Cuna y Nivel Medio quedan
marcados `open:false` en `PARVULARIA_NIVELES`: son edades donde el juego en pantalla
no es desarrollo-apropiado (así lo indica el propio Decreto 481/2017 para esos
niveles), así que no está previsto construir módulos jugables para ellos.

- **Pensamiento Matemático** (9): Patrones, Clasificar, ¿Dónde está?, Más/Menos/Igual,
  Antes y Después, Contar hasta 20, Sumar y Quitar, Formas y Cuerpos, Medir — OA01-08,
  OA10-11. Fuera: OA09 (representar objetos desde distintas perspectivas — dibujo/foto)
  y OA12 (comunicar el proceso de resolución de un problema), ambos de producción
  gráfica/oral propia, no aptos para el motor de opción múltiple.
- Núcleos restantes de NT (🔒 sin construir, tarjeta "Próximamente" en `nucleoMap`):
  Lenguaje Verbal, Lenguajes Artísticos, Identidad y Autonomía, Convivencia y
  Ciudadanía, Corporalidad y Movimiento, Exploración del Entorno Natural, Comprensión
  del Entorno Sociocultural. Ninguno tiene OA extraídos todavía — pedirlos al usuario
  antes de construir contenido, uno por uno, siguiendo el mismo patrón que
  Pensamiento Matemático.

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
3. Agregar las 7 asignaturas restantes (Ciencias, Historia, Artes, Música, Ed. Física,
   Orientación, Tecnología) a 2° básico, siguiendo el mismo patrón usado en 1° básico
   (`<NOMBRE>_BY_GRADE` con entrada `2: {...}`) — pedir los OA de 2° básico de cada
   asignatura antes de construir contenido, no reusar los de 1° básico.
4. ~~Evaluar agregar persistencia real (localStorage)~~ — ✅ hecho (`js/persistence.js`).
   Si más adelante se quiere progreso sincronizado entre dispositivos, ahí sí se
   necesitaría un backend real (Firebase/Supabase u otro) — GitHub Pages es hosting
   estático puro, no puede correr una base de datos ni lógica de servidor.
5. Si se quiere cobertura 100% literal de 1° básico, revisar los OA marcados "fuera"
   en cada asignatura (arriba) y decidir si vale la pena forzarlos al motor de opción
   múltiple o si requieren un tipo de juego nuevo (p. ej. grabación de voz para Música,
   o un lienzo de dibujo para Artes Visuales).
6. Construir los 7 núcleos restantes de Educación Parvularia NT (ver lista arriba),
   pidiendo los OA del Decreto 481/2017 de cada uno antes de construir contenido.
   Una vez completo NT, evaluar si construir Nivel Medio/Sala Cuna tiene sentido dado
   que ese rango de edad generalmente no usa juego en pantalla (revisar el Decreto
   481/2017 para esos niveles antes de decidir).
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
