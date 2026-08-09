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
      microbiologiaClinica.js  submódulo Microbiología Clínica (12 módulos, ~112 ítems):
                              fundamentos bacterianos, antimicrobianos, susceptibilidad,
                              mecanismos de resistencia, carbapenemasas (incluye 2 casos
                              con antibiograma real de Pseudomonas y 3 ejemplos de
                              antibiograma interpretado de carbapenemasas), taxonomía y
                              medios de cultivo, y 6 módulos de bacteriología por familia
                              (Staphylococcus; Streptococcus/Enterococcus; bacilos Gram+;
                              Enterobacterales; bacilos Gram- no fermentadores;
                              Vibrionaceae/Campylobacter/Helicobacter). Extraído por 8
                              agentes de investigación en paralelo que leyeron cada PDF
                              fuente completo (Temas 1-20 del programa real, código 53427);
                              Temas 21-28 (Mycobacterium, Neisseria, Espiroquetas/
                              Mycoplasma/Chlamydia/Rickettsia, Micología, Virología) quedan
                              fuera por no tener PDF fuente disponible — ver el comentario
                              inicial del archivo y "Estudio para Pruebas" en "Estado
                              actual del contenido" para el detalle completo.
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
                              archivo (372 palabras ES con tipo/definición/ejemplo,
                              586 pares EN con traducción/ejemplo — ampliados en dos
                              rondas, 2026-08-01 y 2026-08-02, desde 108/84 originales,
                              a pedido explícito del usuario, cubriendo animales,
                              familia, oficios, geografía/naturaleza de Chile, cuerpo
                              humano, tiempo, hogar, escuela, y adjetivos/verbos de uso
                              frecuente que antes no estaban) — deliberadamente
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
    colorearNumeros.js         "Colorear por Números" — segunda herramienta de consulta
                              transversal (NO es un juego: sin rondas/estrellas/XP,
                              mismo criterio que diccionario.js), pedido explícito del
                              usuario (2026-08-02, con capturas de láminas reales de
                              "colorear por números") para poder pintar un dibujo y
                              descargarlo. Pantalla única `colorearNumeros` con dos
                              vistas internas (selector de dibujo / lienzo de color),
                              alternadas con un estado de módulo simple
                              (`currentDrawingId`/`currentColorNum`, efímero — no vive
                              en state.js/persistence.js a propósito, mismo criterio
                              que el estado interno de games/traza.js). Los 4 dibujos
                              (Carboncito, Auto, Casa, Pez) son SVG 100% propio armado
                              con formas geométricas simples (círculos/elipses/rects/
                              polígonos superpuestos, vía los helpers `circleRegion()`/
                              `ellipseRegion()`/`rectRegion()`/`polyRegion()`) — una
                              adaptación honesta del estilo "lámina de colorear" real
                              (regiones tipo rompecabezas que encajan entre sí) al
                              mismo criterio de "cero dependencias, todo arte a mano"
                              que ya rige mascotSVG()/shapeSVG()/etc., en vez de usar
                              imágenes externas. Cada región tiene un `data-num`
                              (1-8) y una `<text>` con el número como GUÍA — no se
                              valida el color elegido contra ninguna "respuesta
                              correcta": es una actividad de creación libre, mismo
                              espíritu sin-error que escribenombre.js/caligrafia.js.
                              Tocar una región la rellena con el color de la paleta
                              activa (delegación de eventos sobre el `<svg>`, un solo
                              listener en `initColorearNumeros()`); "Borrar todo"
                              vuelve todas las regiones a blanco. Como la app no tiene
                              backend (GitHub Pages es hosting estático), "Guardar"
                              serializa el `<svg>` a un Blob, lo dibuja en un
                              `<canvas>` oculto vía `Image`, y descarga un PNG con
                              `canvas.toBlob()` + un `<a download>` temporal — sin
                              ninguna librería externa, y sin galería interna (se le
                              preguntó al usuario explícitamente vía
                              `AskUserQuestion`: descargar como PNG vs. galería en
                              localStorage vs. ambas — eligió solo descarga). **Bug
                              real encontrado y corregido al probar en el navegador:**
                              `pickColorNum()` llamaba a `render()` al cambiar de
                              color, lo que reconstruye el `<svg>` completo desde
                              `build()` y borraba todo lo ya coloreado — corregido
                              para que cambiar de color solo actualice qué swatch se
                              ve activo (vía `classList`), sin tocar el `<svg>`. CSS
                              propio en styles.css (familia `.colorear-*`/
                              `.drawing-thumb`/`.palette-swatch`).
                              **Arte rehecho (2026-08-02, pedido explícito del
                              usuario: "arregla los dibujos, están mal
                              realizados"):** la primera versión de los 4 dibujos
                              usaba solo formas geométricas puras (círculos/
                              elipses/rectángulos) superpuestas sin ninguna
                              curva, viéndose demasiado primitiva comparada con
                              el resto del arte de la app. Se agregó un helper
                              `pathRegion()` (mismo patrón que `circleRegion()`/
                              `ellipseRegion()`/`rectRegion()`, pero para
                              `<path>` con curvas bézier `Q`) y se rehicieron los
                              4 dibujos con siluetas orgánicas: **Carboncito**
                              reutiliza literalmente las coordenadas de
                              `mascotSVG()` (js/svg.js) en su viewBox nativo
                              "0 0 200 190" (cada dibujo ahora puede declarar su
                              propio `viewBox`, no todos comparten "0 0 300
                              300") — la garantía de calidad más alta posible,
                              ya que es el arte ya aprobado de la mascota, solo
                              con sus formas convertidas a regiones rellenables
                              (blanco + borde) en vez de colores fijos; ojos,
                              nariz, arrugas y collar quedan FIJOS (no
                              rellenables) para no romper el reconocimiento
                              facial, mismo criterio que `mascotSVG()`. **Auto**
                              pasó de un rectángulo + trapezoide a una silueta
                              de sedán real en un solo `<path>` (capó, parabrisas,
                              techo, luneta trasera, paragolpes) con dos
                              ventanas separadas por un pilar. **Casa** ganó un
                              techo con alero (más ancho que el muro) y una
                              puerta con arco (`<path>` en vez de `<rect>`) en
                              vez de una puerta rectangular plana. **Pez** pasó
                              de aletas triangulares filosas a aletas y cola
                              curvas, y su cuerpo ovalado ahora es asimétrico
                              (más redondeado hacia la cabeza, más afilado hacia
                              la cola), como un pez real de dibujos animados. El
                              helper `fontSize` opcional en los helpers de forma
                              compensa el tamaño del número de guía cuando el
                              viewBox de un dibujo es más chico que el estándar
                              (Carboncito usa `fontSize:11` en vez del 15px por
                              defecto). `saveColoringPNG()` ahora lee
                              `svg.viewBox.baseVal` para dimensionar el
                              `<canvas>` oculto según el dibujo activo, en vez
                              de asumir 300×300 fijo — necesario porque
                              Carboncito ya no comparte el viewBox del resto.
                              **Bug real encontrado tras el rehecho, reportado
                              por el usuario ("sigo teniendo problemas con los
                              dibujos") — varios números de guía quedaban
                              tapados por un elemento decorativo dibujado
                              DESPUÉS en el mismo lugar:** en Carboncito, el
                              hocico (dibujado después) tapaba el número de la
                              cabeza, la nariz tapaba el número del hocico, y
                              la lengua/placa del collar tapaban el número del
                              cuerpo — los 3 números eran invisibles en la
                              práctica, no solo "difíciles de ver". En Auto,
                              el tapacubos (círculo oscuro fijo) se dibujaba
                              exactamente encima del centro de cada rueda,
                              tapando su número por completo. En Casa, las
                              líneas cruzadas de las ventanas (parteluz) caían
                              justo sobre el número, dejándolo parcialmente
                              cubierto. Ninguno de estos casos aparece en un
                              fuzz-test de datos (no hay ningún dato incorrecto
                              involucrado) — solo se detecta mirando el SVG
                              renderizado de verdad, que es como el usuario lo
                              encontró. Corregido de dos formas: (1) se agregó
                              un parámetro opcional `labelPos:{x,y}` a
                              `circleRegion()`/`ellipseRegion()` para mover la
                              etiqueta del número lejos de su centro geométrico
                              por defecto cuando ese centro coincide con un
                              elemento fijo dibujado después (cabeza, hocico,
                              cuerpo, ruedas); (2) se eliminó por completo el
                              parteluz de las ventanas de Casa (ya no hacía
                              falta para que se reconocieran como ventanas).
                              **Lección para arte nuevo con números de guía:**
                              cuando un elemento fijo (ojos, nariz, tapacubos,
                              parteluz) se dibuja EN EL MISMO LUGAR que el
                              centro de una región numerada, el número
                              desaparece visualmente aunque el dato/atributo
                              siga estando bien en el DOM — verificar siempre
                              con captura de pantalla real después de agregar
                              cualquier detalle decorativo sobre una región ya
                              numerada, no asumir que "está en el DOM" equivale
                              a "se ve".
                              **Segunda ronda de este mismo bug, encontrada
                              tras un segundo reporte del usuario ("sigo
                              teniendo problemas con los dibujos... los
                              números tienen que ser visibles"), esta vez con
                              auditoría programática en vez de solo captura de
                              pantalla:** en vez de confiar de nuevo en la
                              inspección visual (que ya había dejado pasar
                              este caso una vez), se escribió un chequeo
                              geométrico en el navegador que compara, para
                              cada `<text class="colorear-num">`, el conteo
                              real de `[data-num]` contra el conteo real de
                              etiquetas de texto en el DOM — reveló que
                              Carboncito tenía **9 regiones pero solo 8
                              etiquetas** (un desface invisible a cualquier
                              captura de pantalla a simple vista, porque no es
                              que un número estuviera tapado: directamente
                              nunca se dibujó ninguno). La región sin número
                              era el `pathRegion(..., 5, null, null, fs)` del
                              "hombro/sombra de oreja" (una forma decorativa
                              detrás de la oreja derecha, heredada tal cual de
                              `mascotSVG()` para dar profundidad de capas al
                              personaje) — alguien de la ronda anterior le
                              había pasado `lx=null, ly=null` a propósito
                              (`pathRegion()` omite el `<text>` por completo
                              cuando `lx==null`), probablemente porque la
                              mayor parte de esa forma queda tapada por la
                              oreja/cuerpo dibujados después y no había un
                              lugar obvio donde poner el número dentro del
                              sliver visible. El resultado real: un blob
                              blanco con borde, clickeable y coloreable, pero
                              sin ningún número — exactamente lo que el
                              usuario reportó. **Fix:** en vez de forzarle un
                              número a una región que geométricamente casi no
                              se ve, se sacó del sistema de colorear-por-número
                              por completo — pasó de `pathRegion(...,
                              5, null, null, fs)` (blanco, interactivo, `data-
                              num="5"`) a un `<path>` fijo con relleno gris
                              claro (`#EDE7E3`, tono de sombra de pelaje) y sin
                              `data-num`, igual que los ojos/nariz/collar ya
                              fijos del mismo dibujo — ya no es una región que
                              prometa un número y no lo entregue. Verificado
                              con el mismo chequeo geométrico (ahora
                              reutilizable) sobre los 4 dibujos: **`data-num`
                              count === etiquetas de texto count en los 4**
                              (Carboncito 8=8, Auto 8=8, Casa 11=11, Pez
                              9=9), y un segundo chequeo con
                              `document.elementFromPoint()` en el centro de
                              cada etiqueta confirmó que el elemento
                              clickeable bajo cada número siempre tiene el
                              mismo `data-num` que el texto que muestra (0
                              discrepancias en los 4 dibujos) — es decir, cada
                              número visible corresponde exactamente a la
                              región que se pinta al tocarlo. Probado también
                              que rellenar por clic sigue funcionando tras el
                              cambio (el hombro de oreja ya no es clickeable,
                              por diseño, igual que los ojos no lo son). Sin
                              errores de consola. **Lección reforzada:** para
                              esta clase de bug (número ausente o tapado), una
                              sola captura de pantalla no es prueba suficiente
                              de que "ya se revisó" — conviene además un
                              chequeo programático de conteo (`[data-num]`
                              vs. `text.colorear-num`) y de coincidencia
                              (`elementFromPoint` en el centro de cada
                              etiqueta debe devolver un elemento con el mismo
                              `data-num`), reproducible cada vez que se toque
                              el arte de este módulo.
                              **Paisaje: de SVG a mano a imagen PNG real +
                              flood fill (2026-08-03).** Tras el rehecho de
                              arte de más arriba, el usuario pidió un 5°
                              dibujo nuevo ("Paisaje", bosque y cerros) y,
                              durante varias rondas de correcciones —montañas
                              asimétricas, laguna con forma de nube en vez de
                              agua, sendero con un quiebre antinatural,
                              arbustos deformes—, repitió el mismo veredicto
                              ("quedó horrible, peor que antes", "no es igual
                              a lo que te estoy pidiendo") pese a múltiples
                              intentos de mejora (curvas simétricas
                              generadas por trigonometría en vez de a mano,
                              sombras de ladera, festones decorativos). El
                              usuario finalmente ofreció una salida distinta:
                              generar la lámina en una herramienta externa
                              (Copilot Designer) y que la app la usara tal
                              cual, en vez de seguir intentando igualar esa
                              calidad con SVG a mano. Se aceptó porque es
                              honesto: hay un techo real de calidad
                              alcanzable escribiendo coordenadas de curvas
                              Bézier a mano, y ese techo ya se había
                              alcanzado.
                              **Mecanismo nuevo (convive con el SVG, no lo
                              reemplaza):** un dibujo con la propiedad
                              `image` (en vez de `viewBox`+`build`) usa un
                              `<canvas>` real en vez de un `<svg>`. La imagen
                              (`img/colorear/paisaje-bosque.png`, línea negra
                              semi-transparente sobre fondo TRANSPARENTE —no
                              negro; el fondo negro que se veía en una
                              vista previa era solo un artefacto de
                              renderizado del visor de imágenes, confirmado
                              leyendo los valores RGBA reales del archivo
                              antes de usarlo) se compone sobre blanco con
                              `drawRasterBase()`. El clic dispara
                              `floodFillCanvas()`: relleno por inundación
                              clásico con pila explícita (nunca recursivo,
                              para no desbordar la pila con una región
                              grande), que compara cada píxel contra el
                              color del píxel TOCADO (no contra "blanco"
                              fijo) — así una región ya pintada se puede
                              recolorear, igual que en el mecanismo SVG.
                              **Bug real encontrado en la primera prueba
                              (no hipotético — verificado pintando la lámina
                              completa y viendo qué pasaba): el relleno se
                              "escapaba"** del cielo hacia el pasto, y del
                              sol hacia un árbol/la laguna/un arbusto. La
                              lámina real tiene micro-cortes de 1-2px en
                              algunos trazos donde dos líneas casi se tocan
                              pero no del todo, invisibles a simple vista.
                              Se corrigió con `buildWallMask()`: una máscara
                              de "muro" (cualquier píxel oscuro con algo de
                              opacidad) calculada UNA vez al cargar la
                              imagen, dilatada 1px hacia sus 4 vecinos para
                              sellar esos cortes — `floodFillCanvas()` nunca
                              cruza un píxel de la máscara, sin importar
                              cuán parecido sea su color al buscado (barrera
                              dura, además de la tolerancia de color).
                              **Segundo bug real, más grande: cielo y pasto
                              resultaron ser LA MISMA región conectada** —
                              no un simple corte de 1-2px. Se comprobó
                              muestreando la máscara fila por fila en la
                              banda donde debería estar el horizonte: TODAS
                              las filas tenían cortes de 100 a 300px. La
                              lámina real solo dibuja una "lomita" de piso
                              suelta bajo cada árbol/arbusto, nunca un
                              horizonte continuo de borde a borde. En vez de
                              inventar una curva nueva a mano (la lección ya
                              aprendida ese mismo día con el arte SVG: una
                              curva inventada se nota "pegada"), se
                              construyó `traceGroundPoints()`: RASTREA la
                              altura real de esas lomitas ya dibujadas
                              (columna por columna, primer píxel oscuro en
                              la banda 42%-78% de alto de la imagen) y las
                              conecta con curvas suaves — el horizonte
                              resultante sigue el contorno que el propio
                              dibujo ya insinuaba. `drawSyntheticHorizon()`
                              lo traza directo sobre el `<canvas>` (no sobre
                              el `<img>` original) para que sobreviva a
                              "Borrar todo" vía `resetRasterCanvas()`
                              (redibuja imagen + horizonte + recalcula la
                              máscara, los tres pasos juntos siempre).
                              **Verificación exhaustiva pedida explícitamente
                              por el usuario ("revísalo bien, píntalo
                              completo y analiza si están todas las
                              divisiones"):** en vez de seguir probando con
                              clics sueltos, se implementó un etiquetado de
                              componentes conexas sobre la máscara completa
                              (mismo algoritmo de flood fill, corrido sobre
                              cada píxel de la imagen en vez de desde un solo
                              clic) que encuentra TODAS las regiones
                              separadas de una vez. Resultado real: 15 de 16
                              regiones esperadas quedaron confirmadas como
                              divisiones propias e independientes (cielo,
                              piso, sol, 3 nubes, 4 montañas, 3 árboles, 2
                              arbustos, laguna) — varias de las
                              "fugas" sospechadas en clics manuales previos
                              resultaron ser coordenadas de prueba mal
                              apuntadas (el número "11" dibujado literalmente
                              ENCIMA del centro geométrico de su árbol hace
                              que un clic exacto al centroide caiga sobre un
                              píxel de línea, no sobre la región). La única
                              división real que NO se logró separar es el
                              **sendero** ("6"): confirmado con 5 puntos
                              distintos a lo largo de su curva visible que
                              es la misma región que el pasto, porque en la
                              lámina real el camino es una única línea
                              decorativa (no dos bordes formando una cinta
                              con interior propio) — un intento de rastrear
                              esa línea automáticamente (mismo enfoque que el
                              horizonte) resultó demasiado ruidoso para
                              aislarla del número "6" y las matitas de pasto
                              vecinas sin arriesgar una forma que se viera
                              "pegada"; se dejó documentado como limitación
                              conocida en vez de forzar un parche dudoso.
                              **Paleta ampliada de 8 a 16 colores** (pedido
                              explícito: "considerar una paleta de colores
                              más amplia") con 8 tonos nuevos (rosado,
                              morado, turquesa, verde oscuro, azul oscuro,
                              amarillo claro, blanco, café oscuro) para
                              cubrir casos sin color realista disponible
                              antes (nieve, sombras oscuras, follaje oscuro).
                              **Leyenda de color sugerido** (`colorGuide` en
                              la definición del dibujo, pedido explícito:
                              "los números, podrías colocarlos en los
                              colores que corresponde", igual que la llave de
                              colores al pie de la lámina de referencia que
                              compartió el usuario) — mapea cada número de
                              REGIÓN (1-14, los dibujados en la lámina) a un
                              número de `PALETTE_COLOREAR`, nunca a un hex
                              suelto, para que la leyenda siempre muestre un
                              color que el niño puede elegir de verdad.
                              **Dos bugs de UX reales encontrados por el
                              usuario con capturas, no hipotéticos:** (1)
                              "hay 2 tandas de colores y no todos funcionan"
                              — la leyenda usaba círculos con número
                              IDÉNTICOS en forma y tamaño a los swatches
                              reales, apilados justo encima de la paleta; el
                              usuario tocaba la leyenda esperando que
                              pintara y no pasaba nada porque nunca fue
                              interactiva. Primer intento de arreglo
                              (cuadritos en vez de círculos + rótulo "Guía:")
                              resultó insuficiente — el usuario reportó de
                              nuevo, con otra captura, "son distintos": el
                              verdadero problema de fondo era que la Guía
                              (números 1-14, de REGIÓN) y la paleta
                              (números 1-16, de SLOT de color) son dos
                              sistemas de numeración distintos que se leían
                              apiladas como si debieran coincidir número a
                              número. (2) Fix real: quitarle el número al
                              botón de la paleta por completo (`paletteHTML`)
                              — el número de un swatch nunca significó nada
                              que el niño necesitara leer, era solo un ID
                              interno de posición; sin él, la paleta se lee
                              inequívocamente como "colores para elegir", sin
                              nada que competir visualmente con los números
                              reales de la Guía. Verificado con clics físicos
                              reales (no simulados por código) en ambos
                              casos antes de darlos por resueltos.
                              **6° dibujo, Playa Tropical:** agregado el
                              mismo día a partir de un "prompt maestro" muy
                              detallado que el usuario redactó (estilo libro
                              para colorear infantil, blanco y negro puro,
                              sin sombras/degradados/texturas/3D, contornos
                              cerrados, números grandes centrados, 14
                              elementos con ubicación aproximada) — sigue
                              siendo SVG a mano (no tiene una lámina PNG
                              real todavía), pero usa el mismo criterio ya
                              establecido de "geometría confiable" (elipses
                              rotadas para las hojas de palmera en vez de un
                              path a mano) tras las rondas de formas
                              deformadas de Paisaje. El usuario pidió
                              pausarlo ("prefiero que continúe con el
                              paisaje") antes de iterar sobre su calidad
                              visual, así que queda tal cual, sin el mismo
                              nivel de pulido/verificación que Paisaje.
                              **Prompt maestro reutilizable:** a pedido del
                              usuario, se le entregó un prompt estándar (ver
                              conversación) para pedir a Copilot u otra
                              herramienta nuevas láminas compatibles con el
                              mecanismo de flood fill — insiste en líneas
                              completamente cerradas y exportar PNG (nunca
                              JPG, cuya compresión genera ruido que rompe el
                              relleno automático), ya que la imagen no es
                              solo ilustración: alimenta directamente
                              `buildWallMask()`.
                              Los helpers `birdMark`/`treeCanopy`/
                              `treeTrunk`/`grassTuft` (construidos para la
                              versión SVG anterior de Paisaje) se eliminaron
                              por completo al quedar sin ningún llamador —
                              ninguna otra lámina los usa.
                              **Bug real de responsive encontrado por el
                              usuario (2026-08-08): "no toma la página
                              completa, no es responsivo... tablet,
                              celulares, ipod, iphone".** Causa raíz:
                              `.colorear-canvas-wrap` (styles.css) tenía
                              `max-width:420px` fijo — afecta a los 6
                              dibujos por igual (los 4 SVG y los 2 de
                              canvas/PNG comparten el mismo wrapper), sin
                              importar cuánto creciera `#app` en tablet/
                              escritorio (hasta 1320px). En mobile nunca se
                              notaba porque `#app` ya es más angosto que
                              420px, pero en tablet (`#app` a 700-860px) el
                              lienzo quedaba chico y rodeado de espacio
                              vacío. Subido a `max-width:640px` (768px+
                              hasta 1024px de viewport) y `760px` a partir
                              de 1024px de viewport, mismo criterio de
                              "crecer de forma progresiva" ya usado en los
                              breakpoints de `#app`. Verificado que el
                              mapeo de clic a píxel del flood fill
                              (`initColorearNumeros`, ya usa
                              `getBoundingClientRect()` contra
                              `canvas.width/height` reales, nunca un ancho
                              fijo) sigue alineado tras agrandar el CSS —
                              probado con un clic real sobre el sol de
                              Paisaje a 640px de ancho, rellenó la región
                              correcta. Verificado en 375px (mobile, sin
                              cambios), 768px (tablet, canvas de 420→640px)
                              y 1280px (escritorio, canvas de 420→740px),
                              en un dibujo SVG (Carboncito) y uno de
                              canvas/PNG (Paisaje), sin errores de consola.
                              El resto de canvases de la app (trazado de
                              nombre/Caligrafía, `.trace-canvas` en
                              `traza.js`) no tenían este bug — ya escalan
                              con `width:100%` sin un wrapper con
                              `max-width` propio, así que crecen junto con
                              `#app` sin necesitar este mismo fix.
                              **Reescritura completa a flood fill universal
                              + eliminación de los números (2026-08-08),
                              pedido explícito y detallado del usuario tras
                              jugar el módulo:** la cola de Carboncito no se
                              podía pintar, el fondo no se podía pintar,
                              "algunas partes" quedaban bloqueadas, y pidió
                              eliminar los números por completo y que "cada
                              objeto pueda pintarse de forma independiente...
                              como una app de colorear de verdad". Estos 3
                              bugs compartían la misma causa de fondo: el
                              mecanismo de los 4 dibujos SVG a mano
                              (Carboncito/Auto/Casa/Pez, más Playa Tropical)
                              dependía de asignar `data-num` a mano a cada
                              región — cualquier forma a la que se le
                              olvidara el atributo (o que lo perdiera por
                              falta de espacio, como ya había pasado 3 veces
                              antes con el hombro/sombra de oreja de
                              Carboncito, el tapacubos del Auto y el ojo del
                              Pez) quedaba invisible al clic. Investigando
                              el caso concreto de "la cola": **Carboncito
                              nunca tuvo una forma de cola en absoluto** —
                              ni bloqueada ni con número perdido, literalmente
                              no estaba dibujada (`mascotSVG()`, de donde
                              este dibujo reutiliza sus coordenadas, tampoco
                              tiene una).

                              En vez de seguir parchando `data-num` región
                              por región (la misma clase de bug ya corregida
                              3 veces), **los 6 dibujos ahora comparten un
                              solo mecanismo**: el relleno por inundación
                              (flood fill) sobre `<canvas>` que ya existía
                              para Paisaje, sin cambios de lógica
                              (`floodFillCanvas()`/`buildWallMask()` quedan
                              intactos). La idea clave: el flood fill no
                              necesita que nadie declare qué regiones
                              existen — cualquier área delimitada por una
                              línea oscura cerrada es, automáticamente, su
                              propio objeto pintable, sin ningún atributo
                              que alguien tenga que recordar agregar. Esto
                              resuelve los 3 problemas a la vez: el fondo
                              nunca necesitó una forma propia (el flood fill
                              simplemente se detiene en el borde del canvas
                              o en la primera línea oscura, así que tocar
                              "afuera" del dibujo ya pinta ese espacio); y
                              cualquier parte —incluida una nueva— queda
                              pintable por el simple hecho de estar
                              cerrada, sin mantenimiento aparte. Los 4
                              dibujos SVG a mano + Playa Tropical pasaron de
                              `data-num`+texto a una función `build()` que
                              arma línea negra pura (blanco + borde, sin
                              colores fijos ni números) — se serializa a un
                              `data:image/svg+xml`, se carga como `<img>` y
                              se rasteriza en el mismo `<canvas>` que ya
                              usaba la lámina PNG real de Paisaje
                              (`svgDataUrlFor()` en `colorearNumeros.js`),
                              así que `initColorearNumeros()`/
                              `clearColoring()`/`saveColoringPNG()` quedan
                              con un solo camino de código para los 6
                              dibujos en vez de dos ramas paralelas. Los
                              elementos que antes tenían un color fijo sin
                              borde propio (ojos, pupilas, nariz, collar de
                              Carboncito; tapacubos del Auto; ojo/pupila del
                              Pez) pasaron a ser regiones blancas con su
                              propio trazo, igual que cualquier otra — ahora
                              también se pueden repintar. A Carboncito se le
                              agregó una cola rizada nueva junto a la
                              cadera. **Bug real encontrado durante la
                              verificación (no hipotético): la cola, al
                              superponerse con el óvalo del cuerpo, quedaba
                              fusionada con el cuerpo en una sola región**
                              porque el cuerpo se dibujaba DESPUÉS de la
                              cola en el código, y su relleno blanco tapaba
                              el trazo de la cola justo en la zona de
                              superposición (borrando el "muro" que las
                              debía separar) — se corrigió reordenando para
                              que la cola se dibuje después del cuerpo, no
                              antes, mismo criterio de "lo que se dibuja
                              encima conserva su propio borde" que ya regía
                              el resto del arte de la app.

                              Los detalles puramente decorativos (arrugas,
                              bigotes, rayos de sol, línea de parachoques)
                              se dejaron como trazos sueltos sin relleno, a
                              propósito: ninguna lámina de colorear real
                              separa una arruga en su propia región, y están
                              dibujados bien adentro de la silueta que los
                              contiene para no generar un micro-hueco contra
                              ese borde al rasterizar.

                              **Verificación (2026-08-08):** en vez de solo
                              mirar el resultado, se escribió un chequeo de
                              componentes conexas sobre la máscara de muro
                              de Carboncito (mismo algoritmo de flood fill,
                              corrido una vez sobre toda la imagen) para
                              confirmar cuántas regiones independientes
                              existían de verdad, y luego se dispararon
                              eventos de clic reales (`MouseEvent` sobre el
                              `<canvas>`, con la misma conversión de
                              coordenadas que usa el código real) sobre los
                              15 objetos de Carboncito (cuerpo, hombro/
                              sombra de oreja, cabeza, 2 orejas, 2 patas,
                              collar, hocico, nariz, lengua, 2 ojos, 2
                              pupilas) y la cola nueva — los 16 cambiaron de
                              color de forma independiente, sin que pintar
                              uno afectara a sus vecinos, y el fondo se
                              mantuvo aislado de la cola en ambas
                              direcciones. Se repitió una verificación más
                              liviana (clic real + lectura de píxel antes/
                              después) para Auto (10 puntos, incluida la
                              independencia real entre el aro de la rueda y
                              el tapacubos concéntrico), Casa (10 puntos),
                              Pez (8 puntos) y Playa Tropical (10 puntos) —
                              en los 4, cada punto probado cambió de color
                              sin afectar a sus vecinos. Paisaje (la lámina
                              PNG real, mecanismo sin cambios de lógica) se
                              probó aparte para confirmar que quitar
                              `colorGuide`/la leyenda no rompió nada: cielo
                              y piso pintables como antes, uno con un color
                              de la paleta y el otro con el selector de
                              color personalizado nuevo. "Borrar todo" y
                              "Guardar" (descarga PNG) se probaron después
                              de la reescritura y siguen funcionando sin
                              errores de consola en los 6 dibujos.

                              **Paleta rediseñada** (mismo pedido: "paleta
                              más grande y visible... más moderna...
                              selector de color visual... mostrar
                              claramente el color seleccionado"): los
                              swatches subieron de 42px a 52px con un anillo
                              de selección + marca de verificación en vez de
                              solo agrandarse un poco, se agregó un
                              indicador "Color elegido" (un círculo grande
                              que siempre refleja el color activo, venga de
                              un swatch fijo o del selector) arriba de la
                              paleta, y un `<input type="color">` nativo
                              estilizado como un swatch más (fondo con
                              gradiente cónico tipo arcoíris + ícono 🎨) para
                              cualquier tono fuera de los 16 predefinidos —
                              probado en el navegador con clics reales:
                              cambia el swatch activo, actualiza el
                              indicador, y el color elegido se usa de
                              verdad en el siguiente flood fill. Los 16
                              colores curados de la paleta no cambiaron
                              (ver `PALETTE_COLOREAR`). `pickColorNum()`/la
                              función nueva `pickColorHex()` siguen sin
                              llamar a `render()` — mismo bug ya evitado
                              antes: reconstruir el `<canvas>` completo
                              borraría lo ya pintado.

                              **Primer dibujo tipo "mandala" desde una lámina
                              PNG del usuario (2026-08-08):** pedido
                              explícito del usuario ("prestes especial
                              enfoque... subiré láminas de mandala reales")
                              de integrar `Gemini_Generated_Image_
                              2gb3q42gb3q42gb3.png` (generada por el usuario
                              con una IA de imágenes, en
                              `C:\Development\aplicaciones web\
                              Juego_Interactivo\imagenes\`, fuera del
                              repositorio) — copiada a
                              `img/colorear/mandala-flor.png` y agregada como
                              un dibujo más (`id:'mandala'`) con el mismo
                              mecanismo `image:` ya usado por Paisaje, sin
                              ningún código nuevo de por medio. Antes de
                              integrarla se verificó a fondo que el flood
                              fill la soportara bien, porque un mandala es el
                              caso más exigente posible para este mecanismo:
                              1024×1024px con **cientos de piezas diminutas**
                              (líneas muy finas, muchísimos compartimentos
                              cerrados) en vez de las ~15 regiones grandes de
                              los otros dibujos.
                              - **Verificación de que no hay fugas**: se
                                corrió un etiquetado de componentes conexas
                                sobre la máscara de muro completa (mismo
                                algoritmo de flood fill, aplicado una vez a
                                toda la imagen) — resultado real: **1 sola
                                región de fondo** (328 883px, limpia, sin
                                fugas hacia el mandala) + **920 piezas
                                internas de tamaño pintable** (5-2489px) +
                                ~644 puntos decorativos de 1-4px (demasiado
                                chicos para tocarlos a propósito, mismo
                                criterio que los brillos de ojo ya fijos en
                                Carboncito/Pez — no es un defecto, es el
                                tamaño real de esos detalles en la lámina).
                              - **Hallazgo real, no baked-in transparencia**:
                                se midieron los píxeles de la imagen y
                                resultó tener **alpha=255 en el 100% de la
                                imagen** (sin transparencia real) — el
                                patrón de cuadros gris/blanco que se ve
                                "detrás" del mandala en cualquier visor
                                (incluida la app) está literalmente
                                dibujado como píxeles opacos dentro del PNG
                                (una convención de algunos generadores de
                                imágenes para representar "fondo
                                transparente" cuando no exportan alpha real)
                                — sin efecto en el flood fill (que rellena
                                por similitud de color, no por alfa, y ese
                                patrón de cuadros ya quedó confirmado como
                                UNA sola región pintable de fondo), pero si
                                el niño no pinta el fondo, el PNG exportado
                                ("Guardar") conserva ese cuadriculado en vez
                                de verse blanco liso — a tener en cuenta para
                                mandalas futuros que el usuario suba, y una
                                razón más para que el fondo sea una pieza
                                pintable como cualquier otra (ya lo es).
                              - **Bug real encontrado y corregido durante la
                                verificación — no en el mecanismo de flood
                                fill en sí (que resultó estar perfecto: una
                                llamada directa al algoritmo, sin pasar por
                                clic/coordenadas, rellenó exactamente el
                                tamaño esperado en el 100% de los casos
                                probados), sino en la conversión de un clic
                                real a un píxel exacto:** `MouseEvent.
                                clientX`/`clientY` se redondean a entero por
                                especificación del navegador, y con el
                                lienzo mostrado más chico que su resolución
                                real (620-760px CSS para una imagen de
                                1024px reales), cada píxel de pantalla
                                equivale a más de un píxel real — así que un
                                toque perfectamente intencional sobre una
                                pieza real, con solo ±1px de margen de error
                                (inevitable dado ese redondeo), a veces
                                terminaba exactamente sobre el trazo en vez
                                de dentro de la pieza, y `floodFillCanvas()`
                                se detenía de inmediato sin pintar nada — ni
                                error, ni fuga, simplemente "no pasó nada",
                                que es exactamente lo que reportaría un niño
                                tocando una pieza chica del mandala.
                                Verificado con clics reales dirigidos a
                                píxeles ya confirmados como pintables por el
                                análisis de componentes conexas: 7 de 10
                                fallaban en silencio por este motivo antes
                                del fix. **Corregido con
                                `nearestPaintablePixel()`**: si el píxel
                                exacto que tocó el clic es parte del "muro",
                                se busca en espiral (hasta 6px de radio,
                                bastante más que el grosor de línea de
                                cualquier lámina del módulo) el píxel
                                pintable más cercano y se arranca el relleno
                                ahí en vez de no hacer nada — no cambia el
                                comportamiento de ningún clic que ya caía
                                bien (la función retorna el mismo píxel de
                                inmediato si no es muro), así que no afecta
                                a los otros 5 dibujos, ya mucho más gruesos
                                de línea. Verificado tras el fix: los mismos
                                10 clics que antes fallaban en 7/10 ahora
                                aciertan el tamaño exacto esperado en 10/10,
                                y una regresión rápida de Carboncito/Paisaje
                                confirmó que el resto de dibujos sigue
                                funcionando igual. Probado visualmente en el
                                navegador: 9 piezas grandes + el fondo
                                pintados con 10 colores distintos, todas las
                                fronteras nítidas, sin ningún color
                                filtrándose a una pieza vecina.
                              - **Cómo agregar más mandalas en el futuro**
                                (el usuario ya avisó que subirá más): copiar
                                el PNG nuevo a `img/colorear/`, agregar una
                                entrada `{id, label, icon, image:'img/
                                colorear/<archivo>.png'}` a
                                `DIBUJOS_COLOREAR` — no hace falta ningún
                                código nuevo. Eso sí, conviene repetir la
                                misma verificación (componentes conexas +
                                clics reales dirigidos) antes de darla por
                                buena, ya que cada lámina nueva puede tener
                                sus propias particularidades de línea/
                                grosor; con `nearestPaintablePixel()` ya en
                                su lugar, el riesgo de "clic que no hace
                                nada" por líneas finas queda mitigado para
                                cualquier lámina futura, no solo esta.
                              - **Fondo pre-pintado en blanco automáticamente
                                (2026-08-08), pedido explícito del usuario
                                tras ver el cuadriculado del Mandala: "puedes
                                comenzar pintando automáticamente el fondo
                                blanco... antes de que el usuario comience a
                                interactuar".** Se agregó
                                `autoFillBackgroundWhite(canvas)`, llamada al
                                final de `resetRasterCanvas()` (o sea, tanto
                                al cargar un dibujo como al tocar "Borrar
                                todo"). Prueba 8 puntos a lo largo del borde
                                del lienzo (las 4 esquinas + el punto medio de
                                cada lado, por si el fondo está partido en más
                                de una región desconectada — p. ej. cielo/piso
                                de Paisaje) y por cada uno corre exactamente
                                el mismo camino que un clic real del niño
                                (`nearestPaintablePixel()` +
                                `floodFillCanvas()` con blanco), sin ningún
                                código nuevo de relleno — es 100% equivalente
                                a que alguien tocara el fondo antes de
                                empezar, solo que ya viene hecho. Para los 5
                                dibujos de línea propia y Paisaje (que ya
                                nacían blancos) esto es un no-op casi
                                instantáneo, por el mismo chequeo de "el color
                                bajo el punto ya es el buscado" que ya tenía
                                `floodFillCanvas()` — solo tiene efecto visible
                                real en láminas con el cuadriculado horneado
                                (el Mandala, y cualquier lámina futura del
                                mismo estilo). Verificado en el navegador:
                                Mandala carga con las 4 esquinas en blanco
                                puro (antes mostraban el cuadriculado);
                                Paisaje sin cambios (cielo/piso ya blancos
                                antes y después); Carboncito sin regresión —
                                un clic real en el fondo pinta solo el fondo,
                                el cuerpo (una región separada por el
                                `wallMask`) queda intacto. Sin errores de
                                consola en los 3 casos.
                              - **Segunda ronda de láminas + reemplazo de
                                las que salieron con cuadriculado
                                (2026-08-08), pedido explícito del usuario:
                                "procede con las imagenes... reemplaza los
                                dibujos actuales con las mejoras" y luego
                                "quiero mejor paisajes y despues autos".**
                                Las primeras 7 imágenes que el usuario subió
                                a `Juego_Interactivo\imagenes` (además del
                                Mandala) tenían el mismo problema de fondo
                                horneado ya descrito arriba — se integraron
                                igual (mismo mecanismo, verificado con
                                componentes conexas por imagen) pero el
                                usuario las rechazó después ("no me gusta
                                como quedaron dado que tienen cuadrados y no
                                corresponde"). Se le entregó un prompt
                                maestro para Gemini (ver conversación) que
                                exige explícitamente "fondo blanco sólido,
                                nunca transparente" en vez de dejar que el
                                generador improvisara — las 7 láminas
                                regeneradas en `Juego_Interactivo\imagenes\png`
                                sí vinieron con blanco real (confirmado
                                muestreando color, no solo alfa: ≥250 en R/G/B
                                en el borde de las 7, no solo alfa=255).
                                Reemplazo final en `DIBUJOS_COLOREAR`:
                                `mandalaPetalos`/`heroeCiudad`/`playaCastillo`
                                mantuvieron su `id`/`label` pero con el PNG
                                nuevo; `heroeVuelo`/`heroeEspacial`/
                                `espacioAventura`/`dinosaurios` se retiraron
                                (seguían con cuadriculado y el usuario no
                                subió reemplazo, además de redirigir el
                                pedido a paisajes/autos) y sus PNG se
                                borraron de `img/colorear/`; se agregaron
                                `paisajeMontana`/`paisajeCampo`/`autoCarrera`/
                                `autoVintage` nuevos. `auto-carrera.png`
                                llegó como `.jfif` (JPEG) — convertido a PNG
                                real con `System.Drawing` antes de copiarlo,
                                ya que el flood fill nunca debe alimentarse
                                de un JPEG con artefactos de compresión.
                                **Bug real encontrado en `autoCarrera`, no
                                corregido todavía:** un análisis de
                                componentes conexas mostró una región de
                                fondo sospechosamente grande (72%); clics
                                dirigidos confirmaron que el parabrisas/techo
                                del auto está conectado al fondo exterior a
                                través de una micro-fuga en la línea, justo
                                en la unión con el pilar A — pintar el fondo
                                también pinta esa zona del parabrisas, y
                                viceversa. Sospecha: la compresión JPEG del
                                archivo original suavizó esa línea por debajo
                                del umbral de luminancia de `buildWallMask()`.
                                El resto del auto (puertas, capó, ruedas)
                                está bien separado — se dejó así a propósito
                                (pausado, sin parche) porque el usuario pasó
                                a otro pedido antes de decidir si regenerar
                                la lámina o parchear el hueco a mano.
                                Verificado con el mismo protocolo de siempre
                                (componentes conexas + `getImageData` en
                                puntos dirigidos, sin capturas de pantalla
                                como única prueba) en las 7 láminas de esta
                                ronda antes de darlas por buenas.
                              - **Barra de herramientas ampliada — lápiz,
                                borrador y zoom (2026-08-08), pedido
                                explícito del usuario con capturas de una
                                barra de Paint clásica ("necesito que
                                agreges estos controles, para que así tengan
                                más opciones de pintar").** Se le presentó
                                la lista completa de la captura (lápiz,
                                borrador, texto, gotero, lupa) vía
                                `AskUserQuestion` para priorizar, dado que
                                convertir el módulo de "solo tocar para
                                rellenar" a un editor tipo Paint es un
                                cambio grande — el usuario eligió lápiz,
                                borrador y lupa para esta ronda (gotero y
                                texto sobre el dibujo quedan pendientes).
                                Estado nuevo del módulo: `currentTool`
                                (`'bucket'|'pencil'|'eraser'`, con
                                `pickTool()` exportado) y `currentZoom`
                                (`ZOOM_LEVELS=[1,1.5,2]`, con `zoomIn()`/
                                `zoomOut()` exportados) — ambos se
                                resetean a su valor por defecto en
                                `selectColoringDrawing()` para no arrastrar
                                estado de una lámina a otra. El único
                                listener de `click` que existía en
                                `initRasterCanvas()` se reemplazó por
                                Pointer Events (`pointerdown`/`pointermove`/
                                `pointerup`/`pointerleave`/`pointercancel`,
                                mismo mecanismo ya usado en `traza.js` para
                                unificar mouse/dedo/lápiz óptico): con
                                `currentTool==='bucket'` el `pointerdown` se
                                comporta exactamente igual que el `click`
                                de antes (mismo `nearestPaintablePixel()` +
                                `floodFillCanvas()`, sin cambios); con
                                `'pencil'`/`'eraser'` arranca un trazo libre
                                (círculo relleno en el punto inicial +
                                línea continua en cada `pointermove`, grosor
                                distinto para cada herramienta vía
                                `brushSize()`) con el color elegido o blanco
                                puro respectivamente. Al soltar el trazo
                                (`pointerup`/`pointerleave`/`pointercancel`)
                                se reconstruye `canvas._wallMask` desde el
                                lienzo real — así una línea nueva dibujada a
                                lápiz pasa a actuar como muro para el balde,
                                y una línea original tapada con el borrador
                                deja de serlo, sin necesitar ningún caso
                                especial. Lupa: `applyZoom()` fija
                                `canvas.style.width` a un porcentaje
                                (100/150/200%) y agrega la clase `.zoomed` a
                                `.colorear-canvas-wrap` solo cuando el zoom
                                es mayor a 100% (`styles.css`,
                                `max-height:65vh; overflow:auto`) — a 100%
                                el wrapper se comporta exactamente igual que
                                antes, así que ningún dibujo que nunca use
                                la lupa se ve afectado. El mapeo de
                                coordenadas de clic/trazo ya usaba
                                `getBoundingClientRect()` contra
                                `canvas.width/height` reales (mismo mecanismo
                                que ya validó el responsive de tablet/
                                escritorio), así que sigue alineado sin
                                importar el ancho CSS mostrado. El emoji 🪣
                                (balde) no se renderiza en Windows —mismo
                                problema ya documentado para 🪥🦭🪮🪨🪟🪞🫘🪖🧋—
                                así que el botón usa 🎨 en su lugar (ya
                                confirmado compatible, es el mismo ícono del
                                encabezado de este módulo). Verificado en el
                                navegador (mobile 375px y desktop): balde
                                sigue pintando igual que antes (sin
                                regresión), lápiz dibuja una línea continua
                                del color elegido, borrador vuelve una zona a
                                blanco puro, "Borrar todo" restaura el
                                dibujo original y reconstruye `_wallMask`
                                después de haber dibujado con lápiz/borrador,
                                "Guardar" sigue exportando sin errores, y la
                                lupa activa scroll dentro del lienzo sin
                                empujar el resto de la pantalla. Sin errores
                                de consola en ningún caso probado. Pendiente
                                para una ronda futura: gotero (elegir color
                                tocando una zona ya pintada) y texto sobre el
                                dibujo.
                              - **Bug real de "Borrador" corregido — borraba
                                el dibujo, no solo la pintura (2026-08-09,
                                pedido explícito del usuario: "el borrador
                                borra el dibujo y [...] solo debería borrar
                                la pintura sobre él").** El borrador de la
                                ronda anterior pintaba blanco liso
                                (`#ffffff`) sobre cualquier zona tocada —
                                como todo vive en un único `<canvas>` plano,
                                eso borraba por igual la pintura del niño Y
                                cualquier línea original del dibujo que
                                hubiera debajo, dejando un "agujero" blanco
                                permanente en el arte. Se agregó
                                `captureBaseSnapshot(canvas)`, llamada al
                                final de `resetRasterCanvas()` (carga de un
                                dibujo Y "Borrar todo"): copia el lienzo
                                recién construido —línea original + fondo ya
                                pre-pintado en blanco por
                                `autoFillBackgroundWhite()`— a un
                                `canvas._baseCanvas` aparte, nunca mostrado,
                                que sirve de referencia "estado prístino".
                                El borrador ahora usa `eraseSegment()`: en
                                vez de pintar blanco, copia los píxeles del
                                `_baseCanvas` de vuelta al lienzo real, solo
                                dentro del rectángulo delimitador del
                                segmento tocado (nunca el lienzo completo,
                                para que sea rápido en cada `pointermove`) —
                                para cada píxel calcula la distancia al
                                segmento del trazo (mismo criterio que un
                                pincel real) y solo restaura los que caen
                                dentro del radio del borrador. Esto significa
                                que borrar sobre una línea original la
                                revela intacta (nunca la elimina), y borrar
                                sobre pintura o un trazo de lápiz nuevo lo
                                quita, revelando lo que había antes — el
                                comportamiento que se espera de un borrador
                                real. **Bug de metodología encontrado
                                DURANTE la verificación, no en el código en
                                sí:** las primeras pruebas en el navegador
                                daban `afterErase:[255,255,255,255]` en vez
                                del valor prístino esperado — parecía que el
                                fix no funcionaba. La causa real: el
                                navegador seguía ejecutando una copia
                                cacheada del módulo ES de una carga de
                                página anterior (confirmado pidiendo
                                `fetch('/js/games/colorearNumeros.js',
                                {cache:'no-store'})` y viendo que el archivo
                                en el servidor sí tenía
                                `captureBaseSnapshot`/`eraseSegment`, pero
                                `canvas._baseCanvas` seguía `undefined` en la
                                página activa) — un `navigate` con
                                `force:true` a la misma URL no basta para
                                invalidar el registro de módulos ES ya
                                cargado en esa pestaña; hizo falta
                                `location.reload()` para un ciclo real de
                                descarga/recarga de página. Mismo tipo de
                                problema ya documentado en el historial de
                                EPJA ("recargar la página completa antes de
                                re-verificar, no solo reimportar con un
                                query string distinto") — reforzado aquí:
                                ante un resultado de prueba que no calza con
                                el código que se acaba de escribir, verificar
                                primero que el navegador está corriendo el
                                código nuevo (`fetch` directo al archivo, o
                                `location.reload()`) antes de sospechar del
                                código. Verificado tras el reload real: un
                                píxel de línea genuinamente negro (`[1,1,1]`)
                                pintado y luego borrado vuelve exactamente a
                                `[1,1,1]` (no blanco); un píxel de fondo
                                pintado y borrado vuelve a `[255,255,255]`;
                                "Borrar todo" sigue recapturando el snapshot
                                base correctamente; balde/lápiz sin
                                regresión en Mandala. Sin errores de consola.
                              - **"Auto de Carrera" — el bug de fuga
                                reportado la sesión anterior NO era real,
                                retractado tras una investigación más
                                profunda (2026-08-09).** El usuario pidió
                                "parcha la línea" del parabrisas; antes de
                                tocar el PNG se re-verificó con el mismo
                                rigor de siempre (BFS del camino más corto
                                entre el fondo y el punto sospechoso,
                                lectura de la máscara de muro como grilla
                                ASCII con coordenadas reales, recorte a color
                                a distintos niveles de zoom). Resultado: el
                                punto de prueba original (700,360), usado la
                                sesión anterior para representar "adentro del
                                parabrisas", en realidad está en el cielo
                                ABIERTO por encima de la línea del techo (un
                                BFS trivial en línea recta desde la esquina
                                del lienzo hasta ese punto no cruza ningún
                                muro) — nunca estuvo "adentro" de nada. Se
                                repitió la prueba con puntos verdaderamente
                                dentro del parabrisas (confirmados
                                visualmente en un recorte a color 3×), y los
                                3 dieron el mismo componente correctamente
                                aislado (19791px, separado del fondo de
                                755237px) — se confirmó además con dos clics
                                reales de colores distintos (verde en el
                                parabrisas, azul en el fondo) que no se
                                mezclan. La lección: un solo punto de prueba
                                mal elegido puede parecer un bug real incluso
                                pasando por el mismo protocolo de
                                verificación ya establecido — cuando el
                                resultado de un componente conexo se ve
                                sospechoso (72% de fondo), conviene primero
                                confirmar con un método independiente (BFS
                                del camino, o un recorte a color a alto zoom
                                para ver la línea real) que el punto de
                                prueba está donde uno cree que está, antes de
                                concluir que hay una fuga. No se modificó
                                `auto-carrera.png`.
                              - **Paleta ampliada a 27 tonos + rediseño a
                                barra fija siempre visible (2026-08-09,
                                pedido explícito del usuario tras usar el
                                módulo: "en la gama de colores no es
                                suficiente y hay problemas al momento de
                                seleccion el color y en mobile influye
                                negativamente la experiencia").**
                                `PALETTE_COLOREAR` pasó de 16 a 27 tonos —
                                se agregaron variantes claras/oscuras de
                                las familias que antes tenían un solo tono
                                (amarillo, naranjo, rojo, rosado, morado,
                                celeste, verde) más 2 tonos de piel (útiles
                                para pintar personajes: Héroe en la Ciudad,
                                Playa Tropical) y un negro/casi-negro para
                                detalles — los 16 originales se mantienen
                                con el mismo hex, solo se insertaron tonos
                                nuevos entre medio. Pero el problema de
                                fondo no era solo "pocos colores": la
                                paleta vivía al final de la pantalla,
                                después del lienzo — en mobile, cambiar de
                                color significaba soltar el dibujo,
                                deslizar hacia abajo a buscar el color, y
                                volver a subir para seguir pintando, cada
                                vez. Con un lienzo que ya ocupa la mayor
                                parte de una pantalla de celular, ese viaje
                                de ida y vuelta es el "problema al momento
                                de seleccionar el color" real que reportó
                                el usuario, no un bug puntual de un botón.
                                **Fix:** `paletteHTML()`
                                (`colorearNumeros.js`) ahora arma
                                `.colorear-palette-bar`
                                (`position:sticky; bottom:10px`, mismo
                                mecanismo que ya usa `.topbar` arriba de la
                                pantalla, solo que pegado abajo) — se
                                mantiene visible sobre el lienzo mientras
                                se hace scroll, y en pantallas donde todo
                                el contenido ya cabe (tablet/escritorio, o
                                un dibujo chico) se comporta como una
                                tarjeta normal al final de la pantalla, sin
                                ningún comportamiento raro. Dentro de la
                                barra, `.colorear-palette` pasó de
                                `flex-wrap:wrap` (crecía en alto sin límite
                                a medida que se agregaran más colores) a
                                una fila con scroll horizontal propio
                                (`overflow-x:auto` + `scroll-snap-type:x`)
                                — con 27 tonos, la barra muestra ~6-7
                                swatches a la vez y se desliza para ver el
                                resto, igual que la paleta de cualquier app
                                de dibujo real, sin que la barra crezca en
                                alto. El indicador "Color elegido" (ahora
                                un swatch sin texto, con `title`/
                                `aria-label` para lectores de pantalla, en
                                vez de swatch+texto en su propia fila) vive
                                FUERA de la zona con scroll para que
                                siempre se vea sin importar cuánto se haya
                                deslizado la paleta. Swatches de 52px→46px
                                (siguen muy por sobre el mínimo de 44px
                                recomendado para táctil, solo un poco más
                                compactos para que quepan más por pantalla
                                sin perder tamaño de toque). Verificado en
                                el navegador: en mobile (375×667/812) con
                                un dibujo alto (Paisaje) la barra queda
                                pegada al fondo de la pantalla mientras se
                                hace scroll por el lienzo, sin taparlo; con
                                zoom a 200% (`.colorear-canvas-wrap.zoomed`,
                                que ya tenía su propio scroll interno con
                                `max-height:65vh`) la barra sigue
                                totalmente alcanzable debajo, sin
                                superponerse; en tablet/escritorio se ve
                                como una tarjeta normal. Probado
                                deslizando la paleta hasta el final
                                (llegan los 27 tonos + el selector
                                personalizado) y pintando con un color del
                                extremo de la lista (Negro): el flood fill
                                se aplicó correctamente sobre el lienzo sin
                                ningún error de consola. **Nota de
                                metodología, no de producto:** durante la
                                verificación, un primer intento de hacer
                                clic en un swatch vía referencia de
                                accesibilidad (`ref`) después de mover el
                                scroll de la paleta con JS directo
                                (`el.scrollLeft = ...`) no seleccionó el
                                color esperado — resultó ser un artefacto
                                de la herramienta de automatización (la
                                referencia resolvió a una coordenada
                                obsoleta tras el scroll manual), no un bug
                                real: repetir el clic con una coordenada
                                tomada de una captura de pantalla fresca
                                seleccionó el color correctamente. Sin
                                errores de consola en ningún caso probado.
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
    - **Estudio para Pruebas → Microbiología Clínica** (construida 2026-07-26,
      por ítem del banco): los 12 módulos completos, ~112 ítems, cada uno con
      su propio `recurso` desde el inicio (mismo estándar de calidad que
      Química Diagnóstica) — a diferencia del resto de la app (2°-8° básico,
      Parvularia), que sigue pendiente del enfoque grado por grado mencionado
      arriba. Se aplicó el estándar completo aquí porque "Estudio para
      Pruebas" es la etapa donde el usuario ya había fijado ese nivel de
      calidad como el esperado desde el primer submódulo.
    - **1° básico — ✅ completo (2026-07-27):** pedido explícito del usuario
      de continuar el rollout grado por grado ("agrega los recursos para los
      cursos que continúan"). Se agregó `recurso` (por generador, un texto
      fijo reutilizado en todas las rondas de ese `genXxxRound()`, mismo
      criterio que el piloto de Lenguaje/Matemática) a los 22 módulos de
      opción múltiple de 1° básico que aún no lo tenían: Ciencias Naturales
      (Seres Vivos, Plantas, Mi Cuerpo, Materiales, Día y Noche — 5),
      Historia/Geografía/Cs. Sociales (Calendario, Mi Identidad, Símbolos de
      Chile, Mapas de Chile, Convivencia y Comunidad — 5), Artes Visuales
      (Colores, Líneas y Texturas, Materiales de Arte — 3), Música (Sonidos,
      Instrumentos — 2), Educación Física y Salud (Cuerpo en Movimiento,
      Vida Activa y Saludable, Juego Limpio y Seguridad — 3), Orientación
      (Mis Emociones, Autocuidado y Hábitos, Buena Convivencia — 3),
      Tecnología (Herramientas y Materiales — 1). Varios de estos
      generadores tienen 2-3 ramas (`Math.random()<0.5` o `roll<0.34/0.67`)
      cubriendo sub-conceptos distintos dentro del mismo módulo (p. ej.
      "Seres Vivos" pregunta a veces por vivo/no-vivo y a veces por cubierta
      animal) — en esos casos el `recurso` se declara una sola vez como
      variable local al inicio de la función y se reutiliza en el `return`
      de cada rama, cubriendo el concepto paraguas del módulo en vez de
      forzar un texto por rama. Con esto, 1° básico queda con recurso en
      las 9 asignaturas aplicables (29 de 31 módulos — Sílabas y Letras son
      juegos a medida sin motor MC, no aplica). Verificado: los 22
      generadores nuevos pasan fuzz de 200 iteraciones cada uno (recurso
      siempre presente, sin `undefined`, `correctValue` siempre en
      opciones) y se probó visualmente en el navegador (módulo "Seres
      Vivos": botón Recurso visible y modal con el texto real). Próximo
      paso del mismo pedido: continuar con 2°-8° básico y Parvularia,
      grado por grado, cada uno en su propio commit/PR.
    - **2° básico — ✅ completo (2026-07-27):** mismo pedido, mismo criterio
      (recurso por generador). Se agregó a los 27 módulos de opción múltiple
      de 2° básico: Lenguaje (Combinaciones, Gramática, Comprensión II — 3;
      Secuencia es juego a medida sin motor MC, no aplica), Matemática
      (Salta y Cuenta, Multiplicar, Geometría, Medición — 4), Ciencias
      Naturales (Vertebrados e Invertebrados, Ciclos de Vida, Hábitats y
      Cuidado Animal, Mi Cuerpo por Dentro, El Agua, Clima e Instrumentos —
      6), Historia (Pueblos Originarios, Patrimonio de Chile, Paisajes de
      Chile, Formación Ciudadana — 4), Artes Visuales (Líneas y Colores —
      1), Música (Timbre y Pulso — 1), Educación Física (Mi Cuerpo
      Responde, Vida Activa y Saludable II, Juego en Equipo y Liderazgo —
      3), Orientación (Mis Emociones II, Autocuidado II, Hábitos de Trabajo
      Escolar, Buena Convivencia II — 4), Tecnología (Tecnología Digital —
      1). Dos generadores de Matemática (Geometría, Medición) son
      "dispatchers" que llaman a una de 3 funciones internas distintas
      según un sorteo (posición/figuras 2D/cuerpos 3D; calendario/hora/
      longitud) — en esos casos el `recurso` se declara una sola vez en la
      función exportada y se asigna al resultado de la sub-función interna
      (`r.recurso = recurso; return r;`) en vez de duplicar el texto en
      cada sub-función, un patrón nuevo más limpio que se puede reusar en
      generadores "dispatcher" similares de otros grados. Verificado: los
      27 generadores pasan fuzz de 200 iteraciones cada uno, sin errores de
      consola al cargar la app completa. Próximo paso: 3°-8° básico y
      Parvularia, siguiendo el mismo patrón.
    - **3° básico — ✅ completo (2026-07-27):** mismo pedido, mismo criterio.
      Se agregó recurso a los 36 módulos de opción múltiple: Lenguaje (Géneros
      Literarios, Comprensión III, Vocabulario en Contexto, Orden Alfabético,
      Gramática III, Ortografía — 6), Matemática (Números hasta 1000, Sumar/
      Restar y Dinero, Multiplicar, Dividir, Fracciones, Patrones y Ecuaciones,
      Geometría III, Medición III, Datos y Gráficos — 9), Ciencias Naturales
      (Plantas: Partes y Especies de Chile, Ciclo de Vida de la Planta,
      Cuidado de Plantas y Ambiente, Alimentación e Higiene, La Luz, El
      Sonido, Sistema Solar — 7), Historia (Grecia y Roma, Geografía del
      Mundo, Formación Ciudadana III — 3), Artes Visuales (Color Expresivo,
      Materiales de Modelado y Reciclaje — 2), Música (Lenguaje Musical,
      Música en la Sociedad — 2), Educación Física (Vida Activa y Saludable
      III, Juego Limpio y Seguridad III — 2), Orientación (Manejo Emocional,
      Autocuidado III, Buen Trato y Resolución de Conflictos, Hábitos de
      Trabajo Escolar — 4), Tecnología (Tecnología Digital III — 1) — 36
      módulos en total, coincide exactamente con el total ya documentado en
      "Estado actual del contenido". Varios generadores de Matemática y
      Ciencias con 2-3 ramas usan el mismo patrón de "declarar `recurso` una
      vez arriba y reutilizarlo en cada `return`" ya establecido en 1°-2°
      básico. Verificado: los 36 generadores pasan fuzz de 200 iteraciones
      cada uno, sin errores de consola. Próximo paso: 4°-8° básico y
      Parvularia.
    - **4° básico — ✅ completo (2026-07-27):** mismo pedido, mismo criterio.
      Se agregó recurso a los 30 módulos de opción múltiple: Lenguaje
      (Comprensión IV, Vocabulario en Contexto II, Gramática IV, Ortografía
      II — 4), Matemática (Números hasta 10 000, Sumar/Restar y Dinero II,
      Multiplicar y Dividir, Fracciones II, Decimales, Patrones y Ecuaciones
      II, Geometría IV, Medición IV, Datos y Probabilidades — 9), Ciencias
      Naturales (Ecosistemas, Cuerpo Humano IV, La Materia, Las Fuerzas, La
      Tierra — 5), Historia (Civilizaciones Americanas, Geografía de
      América, Formación Ciudadana IV — 3), Artes Visuales (Lenguaje Visual
      II — 1), Música (Dinámica y Tempo — 1), Educación Física (Condición
      Física y Pulso, Seguridad y Juego Limpio IV — 2), Orientación (Manejo
      Emocional II, Autocuidado IV, Buen Trato y Resolución de Conflictos
      II, Hábitos de Trabajo Escolar II — 4), Tecnología (Tecnología Digital
      IV — 1) — 30 módulos en total, coincide exactamente con el total ya
      documentado en "Estado actual del contenido". Mismo patrón de
      "declarar `recurso` una vez arriba y reutilizarlo en cada `return`"
      para generadores con ramas. Verificado: los 30 generadores pasan fuzz
      de 300 iteraciones cada uno (sin `undefined`, sin opciones duplicadas,
      `correctValue` siempre presente, sin apóstrofes en `speakText`, sin
      `recurso` faltante) y una prueba visual en el navegador (módulo
      "Números hasta 10 000": botón Recurso visible y modal con el texto
      real). Próximo paso: 5°-8° básico y Parvularia.
    - **5° básico — ✅ completo (2026-07-27):** mismo pedido, mismo criterio.
      Se agregó recurso a los 35 módulos de opción múltiple: Lenguaje
      (Comprensión V, Recursos Poéticos, Vocabulario y Sinónimos V, Gramática
      V, Ortografía III — 5), Matemática (Números Grandes, Multiplicar,
      Dividir, Operaciones y Dinero, Fracciones III, Decimales II, Patrones y
      Ecuaciones III, Geometría V, Medición y Área, Datos y Probabilidades
      III — 10), Ciencias Naturales (Célula y Sistemas del Cuerpo,
      Alimentación y Salud, Electricidad, Agua en la Tierra — 4), Historia
      (Descubrimiento y Conquista de América, La Colonia en Chile, Geografía
      de Chile, Formación Ciudadana V — 4), Artes Visuales (Lenguaje Visual
      III — 1), Música (Texturas y Estructura Musical — 1), Educación Física
      (Vida Activa y Postura V, Liderazgo y Seguridad V — 2), Orientación
      (Manejo Emocional V, Autocuidado Digital V, Prevención y Vida
      Saludable, Buen Trato y Resolución de Conflictos V, Hábitos de Trabajo
      Escolar V — 5), Tecnología (Tecnología Digital V — 1), **Inglés**
      (Vocabulario Básico, Lectura Simple — 2, primera vez que el rollout
      cubre una asignatura con contenido bilingüe) — 35 módulos en total,
      coincide exactamente con el total ya documentado en "Estado actual del
      contenido". Mismo patrón de "declarar `recurso` una vez arriba y
      reutilizarlo en cada `return`" para generadores con ramas; en Ciencias
      Naturales, `genCelulaSistemas5Round` reutiliza el helper compartido
      `sistemaRound(bank, sistemaLabel, recurso)` (ahora con un tercer
      parámetro opcional) para sus 3 ramas de sistemas del cuerpo en vez de
      duplicar el texto. En Inglés, `recurso` se escribió en español (mismo
      criterio que el resto de la app) aunque el contenido evaluado esté en
      inglés, ya que es una explicación pedagógica dirigida al niño, no el
      contenido del ítem en sí. Bug real encontrado y corregido durante el
      fuzz-testing: `genOperaciones5Round` (matematica.js) tenía la constante
      `recurso` declarada pero nunca se agregó el campo `recurso: recurso,`
      a ninguno de sus 3 `return` — quedó en evidencia porque
      `missingRecurso` dio 300/300 en el fuzz, en vez de 0 como los demás 34
      generadores. Verificado tras la corrección: los 35 generadores pasan
      fuzz de 300 iteraciones cada uno (sin `undefined`, sin opciones
      duplicadas, `correctValue` siempre presente, sin apóstrofes en
      `speakText`, sin `recurso` faltante) y prueba visual en el navegador
      (módulo "Números Grandes" en Matemática y "Vocabulario Básico" en
      Inglés: botón Recurso visible y modal con el texto real en ambos, sin
      errores de consola). Próximo paso: 6°-8° básico y Parvularia.
    - **6° básico — ✅ completo (2026-07-27):** mismo pedido ("procede con el
      sexto"), mismo criterio. Se agregó recurso a los 39 módulos de opción
      múltiple: Lenguaje (Comprensión VI, Recursos Poéticos II, Vocabulario
      VI, Gramática VI, Ortografía IV — 5), Matemática (Múltiplos y
      Factores, Operatoria Combinada, Razones y Porcentajes, Fracciones y
      Números Mixtos, Decimales III, Patrones/Tablas y Ecuaciones,
      Triángulos y Teselados, Ángulos VI, Área y Volumen, Datos y
      Probabilidades IV — 10), Ciencias Naturales (Fotosíntesis y Cadenas
      Alimentarias, Sistema Reproductor y Pubertad, Hábitos Saludables y
      Prevención, Energía y sus Transformaciones, Calor/Temperatura y
      Estados de la Materia, La Tierra: Capas/Suelo y Erosión — 6),
      Historia (Independencia de Chile, La República en el Siglo XIX,
      Salitre y Expansión Territorial, Chile en el Siglo XX, Geografía de
      Chile VI, Formación Ciudadana VI — 6), Artes Visuales (Lenguaje
      Visual IV — 1), Música (Melodía: Diseños y Variaciones — 1), Educación
      Física (Vida Activa y Postura VI, Liderazgo y Seguridad VI — 2),
      Orientación (Manejo Emocional VI, Autocuidado Digital VI, Prevención
      VI, Buen Trato y Resolución de Conflictos VI, Hábitos de Trabajo
      Escolar VI — 5), Tecnología (Tecnología Digital VI — 1), Inglés
      (Vocabulario Intermedio, Lectura Simple II — 2) — 39 módulos en total,
      coincide exactamente con el total ya documentado en "Estado actual del
      contenido". Mismo patrón de "declarar `recurso` una vez arriba y
      reutilizarlo en cada `return`" para generadores con ramas. Este año
      incluye contenido sensible ya revisado y dejado intacto en sesiones
      anteriores (`reproductorpubertad6` en ciencias.js, la prevención de
      tabaco/alcohol/marihuana en `prevencion6` de orientacion.js, y los 5
      hechos cronológicos del período 1973-1990 en `sigloxx6` de
      historia.js) — el `recurso` de esos módulos se escribió con el mismo
      tono clínico/factual/preventivo ya establecido para ese contenido, sin
      tocar ninguno de los bancos de preguntas protegidos. Verificado: los
      39 generadores pasan fuzz de 300 iteraciones cada uno (sin
      `undefined`, sin opciones duplicadas, `correctValue` siempre presente,
      sin apóstrofes en `speakText`, sin `recurso` faltante) y prueba visual
      en el navegador (módulo "Múltiplos y Factores" en Matemática y
      "Vocabulario Intermedio" en Inglés: botón Recurso visible y modal con
      el texto real en ambos, sin errores de consola). Próximo paso: 7°-8°
      básico y Parvularia.
    - **7° básico — ✅ completo (2026-07-27):** mismo pedido ("si, procede"
      para continuar tras 6° básico), mismo criterio. Se agregó recurso a
      los 35 módulos de opción múltiple: Lenguaje (Comprensión VII, Rima y
      Métrica, Pensamiento Crítico: Hechos y Opiniones, Vocabulario y
      Gramática VII, Ortografía V — 5), Matemática (Números Enteros,
      Fracciones y Decimales II, Porcentaje y Potencias, Álgebra I,
      Proporciones y Ecuaciones II, Geometría VII, Estadística y Muestreo,
      Probabilidades II — 8), Ciencias Naturales (Sexualidad y
      Reproducción, Sistema Inmunológico y Microorganismos, Fuerzas y
      Presión, Geología y Clima, La Materia y los Gases — 5), Historia
      (Prehistoria y Primeras Civilizaciones, Grecia y Roma: Sociedad y
      Política, Edad Media, Civilizaciones Americanas II, Formación
      Ciudadana VII, Geografía y Medioambiente — 6), Artes Visuales
      (Espacios de Difusión del Arte — 1), Música (Procedimientos
      Compositivos — 1), Educación Física (Estrategias y Tácticas
      Deportivas — 1), Orientación (Prevención de Conductas de Riesgo,
      Bienestar y Vida Saludable, Relaciones Saludables en Redes Sociales,
      Resolución de Conflictos VII, Autonomía en el Aprendizaje — 5),
      Tecnología (Soluciones Tecnológicas y su Impacto — 1), Inglés
      (Vocabulario Avanzado, Lectura Intermedia — 2) — 35 módulos en total,
      coincide con el conteo real de generadores `gen*7Round` en los 10
      archivos de asignatura (distinto de los generadores con el mismo
      sufijo "7Round" en `estudioPruebas/quimicaDiagnostica.js` y
      `microbiologiaClinica.js`, que ya tenían `recurso` desde su
      construcción original y no forman parte de este rollout por año).
      "Sexualidad y Reproducción" (Ciencias, contenido ya revisado y
      confirmado con el usuario al construir 7° básico) usa un `recurso`
      estrictamente clínico/factual sobre gametos, ciclo menstrual, métodos
      anticonceptivos e ITS, cerrando con la recomendación de consultar a
      un adulto de confianza o profesional de salud ante cualquier duda —
      mismo tono ya establecido para ese contenido, sin tocar el banco de
      preguntas protegido. "Prevención de Conductas de Riesgo"
      (Orientación) mantiene su `recurso` dentro de la política ya
      confirmada con el usuario para este módulo: solo factores de riesgo/
      protección, sin ningún detalle de la dimensión sexual. Verificado:
      los 35 generadores pasan fuzz de 300 iteraciones cada uno (sin
      `undefined`, sin opciones duplicadas, `correctValue` siempre
      presente, sin apóstrofes en `speakText`, sin `recurso` faltante) y
      prueba visual en el navegador (módulo "Geometría VII" en Matemática y
      "Vocabulario Avanzado" en Inglés: botón Recurso visible y modal con
      el texto real en ambos, sin errores de consola). Próximo paso: 8°
      básico y Parvularia.
    - **8° básico — ✅ completo (2026-07-27):** pedido explícito del usuario
      ("procede") para continuar tras 7° básico, mismo criterio. Se agregó
      recurso a los 36 módulos de opción múltiple: Lenguaje (Comprensión
      VIII, Géneros Dramáticos y Épicos, Textos Argumentativos y Medios,
      Gramática VIII, Ortografía VI — 5), Matemática (Enteros y
      Racionales, Potencias y Raíces, Variaciones Porcentuales, Álgebra y
      Ecuaciones VIII, Funciones, Geometría VIII: Pitágoras y Volumen,
      Transformaciones Geométricas, Estadística y Combinatoria — 8),
      Ciencias Naturales (La Célula VIII, Nutrición y Sistemas del Cuerpo,
      Electricidad II, Calor y Transferencia, El Átomo y la Tabla
      Periódica — 5), Historia (Humanismo y Renacimiento, Estado Moderno y
      Mercantilismo, Conquista de América II, La Colonia II, Ilustración y
      Revoluciones, Geografía Regional — 6), Artes Visuales (Montaje y
      Difusión del Arte — 1), Música (Armonía y Acompañamiento — 1),
      Educación Física (Sistemas de Juego y Táctica, Principios de
      Entrenamiento — 2), Orientación (Prevención VIII, Bienestar y
      Autocuidado VIII, Relaciones e Inclusión, Participación Democrática,
      Gestión del Aprendizaje VIII — 5), Tecnología (Análisis de
      Soluciones Tecnológicas — 1), Inglés (Funciones del Idioma VIII,
      Lectura Avanzada — 2) — 36 módulos en total, coincide con el conteo
      real de generadores `gen*8Round` en los 10 archivos de asignatura
      (sin coincidencia de sufijo con `estudioPruebas/*.js` esta vez, ya
      que esos archivos usan la numeración "7Round"). "Prevención VIII"
      (Orientación) mantiene su `recurso` dentro de la misma política ya
      confirmada para 7° básico: solo factores de riesgo/protección, sin
      ningún detalle de la dimensión sexual, sin tocar el banco de
      preguntas protegido. Verificado: los 36 generadores pasan fuzz de
      300 iteraciones cada uno (sin `undefined`, sin opciones duplicadas,
      `correctValue` siempre presente, sin apóstrofes en `speakText`, sin
      `recurso` faltante) y prueba visual en el navegador (módulo
      "Geometría VIII: Pitágoras y Volumen" en Matemática y "Funciones del
      Idioma VIII" en Inglés: botón Recurso visible y modal con el texto
      real en ambos, sin errores de consola). Con esto, toda Educación
      Básica (1° a 8°) tiene el botón Recurso. Próximo paso: Educación
      Parvularia (los 8 núcleos de NT).
    - **Educación Parvularia — ✅ completo (2026-08-02):** pedido explícito
      del usuario de retomar el rollout tras un paréntesis largo (bug de
      mobile en iPhone, dos rondas de expansión del diccionario, y todo
      EPJA construido de por medio) — el mismo plan documentado arriba,
      ahora aplicado al último tramo pendiente. Se agregó `recurso` (por
      generador, mismo criterio que 1°-8° básico) a los 34 módulos de
      opción múltiple de los 8 núcleos de NT: Pensamiento Matemático
      (Patrones, Clasificar, ¿Dónde está?, Más/Menos/Igual, Antes y
      Después, Contar hasta 20, Sumar y Quitar, Formas y Cuerpos, Medir —
      9), Lenguaje Verbal (Sílabas y Sonidos, Escuchar y Comprender,
      Vocabulario en Contexto, Letras y Sonidos — 4; Escribe tu Nombre y
      Caligrafía no aplican, son trazado libre sin motor MC), Lenguajes
      Artísticos (Aprecia y Compara, Compara Formas, Líneas y Diseño — 3),
      Identidad y Autonomía (Reconoce Emociones, Autocuidado y Hábitos,
      Alimentos y Sellos — 3), Convivencia y Ciudadanía (Resolución
      Pacífica, Normas de Convivencia, Seguridad y Cuidado — 3),
      Corporalidad y Movimiento (Ubicación Espacial, ¿Cuándo Ocurre?,
      Movimientos del Cuerpo — 3), Exploración del Entorno Natural (Agua y
      Sol, Materiales de la Naturaleza, Animales y Plantas, Ciclos de
      Crecimiento, Cuidado del Ambiente — 5), Comprensión del Entorno
      Sociocultural (Roles de mi Comunidad, Objetos Tecnológicos,
      Instituciones de mi Comunidad, Seguridad y Prevención — 4). En
      Lenguajes Artísticos, los 3 módulos comparten un mismo helper interno
      (`genCompareRound()`) — se le agregó un parámetro `recurso` que cada
      uno de los 3 exports (`genApreciarNTRound`/`genCompararFormasNTRound`/
      `genLineasDisenoNTRound`) pasa con su propio texto (colorido/formas/
      diseño, respectivamente), en vez de duplicar la lógica de armado de
      ronda 3 veces — mismo patrón de "declarar `recurso` y reutilizarlo"
      ya usado en generadores "dispatcher" de Básica, aplicado aquí a un
      helper compartido entre módulos en vez de a ramas de un solo
      generador. Verificado: los 34 generadores pasan fuzz de 200
      iteraciones cada uno (recurso siempre presente y con largo mínimo,
      sin `undefined`, `correctValue` siempre en las opciones) vía import
      dinámico de `mcEngine.js` en el navegador (`MC_GAMES` no se expone en
      `window`, a diferencia de las funciones de navegación) y prueba
      visual en dos núcleos distintos (Pensamiento Matemático → "Patrones"
      y Convivencia y Ciudadanía → "Resolución Pacífica", uno en layout de
      grilla y otro en panel de una columna): botón Recurso visible en
      ambos, modal abre con el texto real, sin errores de consola. Con
      esto, **toda la app (Parvularia + Educación Básica 1°-8° + Estudio
      para Pruebas) tiene el botón Recurso** — el rollout grado por grado
      queda 100% completo. Próximo paso posible: Educación Media regular
      (no EPJA), pendiente de que el usuario confirme la lista real de
      asignaturas y el decreto curricular vigente (ver sección "Educación
      Media" más abajo) — EPJA ya está construida por separado y no forma
      parte de este rollout de `recurso`.
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

**Fix de audio roto + animaciones de "Movimientos del Cuerpo" (2026-08-08,
pedido explícito del usuario tras probar el módulo: "no todos se escuchan" +
"muchas imágenes no son iguales a lo que se pregunta, sobretodo los de
movimiento"):**
- **Bug real de audio, encontrado con un fuzz dirigido (no visual):** 3
  ítems (`RIDDLES_NT_BANK` en `lenguajeVerbal.js`, `SEGURIDAD_PREV_BANK` en
  `comprensionEntornoSociocultural.js`, y el `question` de
  `genAlimentosNTRound` en `identidadAutonomia.js`) tenían comillas dobles
  literales dentro del texto usado como `speakText` (`Doy leche y digo
  "muu"`, `significa "Detente"`, `sellos... como "ALTO EN AZÚCARES"`). Como
  `mcEngine.js` arma el botón 🔊 con `onclick="speak('`+r.speakText+`')"`,
  una comilla doble dentro del texto corta el atributo HTML a la mitad —
  el botón queda roto sin ningún error visible en consola, simplemente no
  suena. Corregido reemplazando las comillas rectas por comillas
  tipográficas (“ ”) en esos 3 lugares (los usos de comillas dentro de
  `explain`/`recurso` no se tocaron, porque esos van como innerHTML de un
  overlay, no como atributo, y ahí sí son seguras). Un fuzz de 400
  iteraciones sobre los 34 módulos de los 8 núcleos, buscando
  específicamente `["<>]` dentro de `speakText`, confirmó 0 casos
  restantes — la técnica (fuzz dirigido a un patrón concreto, no solo
  "sin `undefined`") queda documentada para revisar `speakText` de
  contenido nuevo en el futuro.
- **Animaciones de `personActionSVG()` (`js/svg.js`, usada también por
  "Cuerpo en Movimiento" de 1° básico en `edfisica.js` — mismas 8 acciones
  base) que no comunicaban la acción con claridad, ni siquiera viéndolas
  animadas en el navegador (no solo en una captura estática):** *nadar*
  tenía las piernas completamente quietas (sin patada) mientras el cuerpo
  rotaba ~80° — sin ninguna referencia de agua, la pose se leía como
  "alguien cayéndose de lado". *Trepar* tenía los brazos subiendo y
  bajando pero el ángulo de rotación estaba mal calculado (`rotate(-55deg)`
  a `rotate(-100deg)`): medido en el navegador con `getBoundingClientRect()`
  (no a ojo), la mano NUNCA llegaba arriba de la cabeza, además de no haber
  ningún objeto que "trepar". *Reptar* tenía un tirón de brazos casi
  imperceptible (±15°) sin ninguna referencia de suelo. Se agregaron 3
  elementos de contexto siempre presentes en el SVG pero invisibles salvo
  que la acción los necesite (`pf-rope`/`pf-water`/`pf-ground`, controlados
  por `opacity` vía CSS según la clase `.act-nadar`/`.act-trepar`/
  `.act-reptar`) — van FUERA de un `<g class="pf-body">` nuevo que agrupa
  cabeza/torso/brazos/piernas, para que la rotación que "nadar"/"reptar"
  aplican al cuerpo NO arrastre también la referencia de agua/suelo
  (antes, con todo dentro del mismo `<svg>` raíz, una rotación del cuerpo
  habría inclinado el agua junto con él). Se recalcularon los ángulos de
  brazo de *trepar* resolviendo la rotación vectorial real (shoulder→mano)
  en vez de ajustar a ojo, y se verificó con mediciones de posición real en
  el navegador que la mano queda por encima de la cabeza en el punto alto
  del ciclo. *Reptar* subió su rango de tirón de brazos a ±35°. Verificado:
  0 errores de consola jugando una partida completa de "Movimientos del
  Cuerpo", y 300 sesiones simuladas sin ninguna repetición (confirma que el
  cambio de CSS no rompió el mecanismo de no-repetición, que depende de
  `promptHTML` — sin cambios — no de las animaciones). El resto de
  imágenes/emoji de los otros 7 núcleos de NT (reportadas por el usuario
  como "muchas imágenes no son iguales a lo que se pregunta") queda
  pendiente de auditar en una sesión futura — este PR se acotó a
  "movimiento" a pedido explícito del usuario.

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

### Estudio para Pruebas — ✅ ambos submódulos completos (Química Diagnóstica 11 módulos, Microbiología Clínica 12 módulos)
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
- **Microbiología Clínica** (12 módulos, ~112 ítems, `js/content/estudioPruebas/microbiologiaClinica.js`,
  construida 2026-07-26 tras completar Química Diagnóstica): Fundamentos Bacterianos
  (morfología/pared celular, fisiología, genética/transferencia horizontal), Antimicrobianos:
  Mecanismo y Clasificación, Estudios de Susceptibilidad (CLSI, antibiograma, CIM, cepas
  ATCC), Mecanismos de Resistencia (BLEE/AmpC, fenotipos Van, mecA/mecC), Carbapenemasas y
  Detección (incluye 2 casos reales con antibiograma completo de Pseudomonas del propio
  material del curso, y 3 ejemplos de antibiograma interpretado de KPC/NDM/OXA-48-like),
  Taxonomía y Medios de Cultivo (fundamento de medios selectivos/diferenciales y 25 pruebas
  bioquímicas con sus controles ATCC), y 6 módulos organizados por familia bacteriana:
  Staphylococcus, Streptococcus y Enterococcus, Bacilos Gram Positivos (Listeria,
  Corynebacterium, Erysipelothrix, Bacillus, Nocardia), Enterobacterales (Escherichia,
  Shigella, Salmonella, Yersinia, KES, PPM, Citrobacter), Bacilos Gram Negativos No
  Fermentadores (Pseudomonas, Stenotrophomonas, Acinetobacter, Burkholderia, Legionella —
  incluye 1 caso real más de antibiograma de Pseudomonas), y Vibrionaceae/Campylobacter/
  Helicobacter.
  - **Metodología de extracción**: 8 agentes de investigación en paralelo (isolation
    worktree, background), cada uno asignado a un grupo temático de PDFs de la carpeta
    fuente del curso (código 53427, Temas 1-20 del programa real), con instrucción
    explícita de leer cada PDF completo, nunca inventar contenido, transcribir íntegros
    los casos clínicos si existían, y señalar contradicciones internas del material
    fuente. El entorno de estos agentes no tenía `pdftoppm`/renderizador de imágenes de
    PDF instalado; cada uno encontró su propia vía alternativa (extracción de texto con
    `pdftotext` en modo `-layout`/`-raw`, o renderizado de páginas a PNG vía la API
    nativa de Windows `Windows.Data.Pdf` para verificar visualmente tablas/diagramas
    incrustados como imagen) — documentado como lección técnica en cada extracción, sin
    que afectara la fidelidad del contenido final. 3 de los 8 agentes fallaron en su
    primer intento por haber alcanzado el límite de sesión de la cuenta (no un error de
    contenido) y se relanzaron exitosamente tras el reset.
  - **Cobertura real vs. programa del curso**: el programa tiene 28 Temas; Temas 1-20
    (fundamentos, antimicrobianos I-II, susceptibilidad, genética bacteriana, mecanismos
    de resistencia -generalidades/Gram+/Gram-/carbapenemasas-, taxonomía, medios de
    cultivo I-II, Staphylococcaceae, bacilos Gram+, Streptococcaceae/Enterococcaceae,
    Enterobacterales I-II, bacilos Gram- no fermentadores I-II, Vibrionaceae/
    Aeromonadaceae/Campylobacteraceae/Helicobacteraceae) tenían PDF fuente disponible y
    están cubiertos aquí. **Temas 21-28** (Pasteurellaceae/Brucellaceae, Mycobacterium,
    Neisseriaceae, Spirochetales/Mycoplasma/Chlamydia/Rickettsia, Micología, Virología
    I-III) **no tienen PDF fuente disponible** y quedan fuera hasta que se consiga ese
    material — mismo criterio que usa Química Diagnóstica para documentar sus propias
    exclusiones, nunca se inventó contenido para rellenar ese vacío.
  - **Diferencia de género de contenido respecto a Química Diagnóstica**: casi ningún
    documento fuente de Microbiología Clínica tenía casos clínicos narrativos de
    paciente (anamnesis + laboratorio + pregunta) — los 2 documentos que se esperaba
    fueran extensos con casos ("Staphylococcus.pdf", "Streptococcus y Enterococcus.pdf")
    resultaron ser solo algoritmos diagnósticos + tablas CLSI de referencia. El contenido
    "caso" real más rico encontrado en todo el curso son los 2 casos de antibiograma de
    Pseudomonas (Tema 18) y los 3 ejemplos de antibiograma interpretado de Carbapenemasas
    (Tema 17), todos incorporados como ítems `caso` en el módulo correspondiente. El resto
    del contenido es factual (taxonomía, mecanismos, diagnóstico diferencial, controles
    de calidad), fiel a como está realmente el material real del curso — no se forzó un
    formato de caso clínico donde la fuente no lo tenía.
  - **Varios PDFs de este curso tenían el nombre de archivo desalineado con su contenido
    real** (detectado repetidamente por los agentes, ej. "TEMA 9... GRAM (-)" cuyo
    contenido es 100% Gram (+); Tema 18/19 con Pseudomonas/Stenotrophomonas y
    Moraxellaceae/Acinetobacter/Burkholderia/Legionella invertidos respecto a lo
    esperado) — cada extracción cita el contenido real verificado, no el nombre del
    archivo.
  - **Bug real encontrado y corregido durante el testing en navegador**: el dataset de
    12 nodos con `height:900` (mismo valor usado por Química Diagnóstica, con 11 nodos)
    producía un solapamiento vertical real de 6px entre nodos del mismo lado del zigzag
    — medido con `getBoundingClientRect()` en el navegador, no solo calculado
    geométricamente (mismo estándar de verificación que la auditoría de mapa de nodos de
    2026-07-26). Corregido subiendo `height` a 960 en la entrada de
    `ESTUDIO_PRUEBAS_SUBMODULOS` (`js/gradeContent.js`) — nunca se tocaron las
    coordenadas `%` de `MICROBIOLOGIA_CLINICA_POS`, mismo criterio que toda la auditoría
    previa de mapas de nodos. Verificado tras el fix: 0 solapamientos en escritorio y en
    375px de viewport, y Química Diagnóstica (que comparte el mismo componente `.node`)
    sigue sin solapamientos tras el cambio.
  - Para agregar contenido de los Temas 21-28 en el futuro (si se consigue el material
    fuente): mismo patrón que este archivo — nuevos `genXxxRound()` + banco + entrada en
    `MICROBIOLOGIA_CLINICA_MODULES`/`_POS`, registrar en `MC_GAMES`/`MC_KEYS`
    (`js/mcEngine.js`), `MODULE_TITLES` (`js/rewards.js`) y `state.stars`
    (`js/state.js`) — no requiere ningún archivo nuevo de wiring, solo extender los
    ya existentes.

Verificado: los 11 módulos de Química Diagnóstica y los 12 módulos nuevos de
Microbiología Clínica pasan fuzz estructural (300 iteraciones cada uno: sin
`undefined`, sin opciones duplicadas, `correctValue` siempre presente, exactamente
4 opciones, sin apóstrofes en `speakText` — que rompen el atributo `onclick` del
botón "Escuchar") y simulación de sesión completa (300 sesiones cada uno, sin
ningún repetido). Verificación de regresión completa del wiring: `MC_KEYS.length`
== `Object.keys(MC_GAMES).length` == 324, sin claves huérfanas en ninguna
dirección. Probado también en el navegador: navegación completa `etapaMap` →
`estudioPruebasMap` → `quimicaDiagnosticaMap`/`microbiologiaClinicaMap` → módulo
individual, con partidas jugadas de principio a fin en "Casos Clínicos: Función
Renal" (Química Diagnóstica) y "Carbapenemasas y Detección" (Microbiología
Clínica) — respuesta correcta avanza sola, respuesta incorrecta muestra el
overlay de Carboncito con el `explain` (y el botón "Recurso" abre el modal con
el texto real), la pantalla de resultados final muestra estrellas/insignia
correctamente. Probado en 375px (mobile) y desktop: sin errores de consola, sin
solapamiento de nodos, ancho de etiqueta de nodo siempre ≤170px.

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

### Educación Media — ✅ completa: 1°-2° medio (81 módulos) + 3°-4° medio: Plan General (34 módulos) + Plan Diferenciado Científico (25 módulos)
Pedido explícito del usuario (2026-08-02) de comenzar esta etapa tras completar
el rollout de `recurso` en Parvularia. Antes de construir, se investigó con
Claude (WebSearch/WebFetch, sin asumir continuidad con Básica) la estructura
curricular real de Educación Media:

- **1°-2° medio**: mismo **Decreto 614/2013** que ya rige 7°-8° básico, con las
  mismas 10 asignaturas (Lengua y Literatura, Matemática, Ciencias Naturales,
  Historia/Geografía y Cs. Sociales, Inglés, Artes Visuales, Música, Educación
  Física y Salud, Orientación, Tecnología) — estructuralmente idéntico a Básica
  (año → asignatura), solo continúa la numeración de años.
- **3°-4° medio**: currículum distinto (Bases Curriculares 3°-4° medio,
  `curriculumnacional.cl/614/articles-91414_bases.pdf`), organizado como
  **Plan de Formación General** + **Plan Diferenciado** (electivo, ~25 ramos
  en 6 áreas) — un modelo que no encaja en el patrón año→asignatura. Alcance
  acordado con el usuario para cuando se aborde: Plan General completo +
  Diferenciado Científico (5: Biología Celular y Molecular, Biología de los
  Ecosistemas, Ciencias de la Salud, Física, Química), dejando fuera por
  ahora los electivos de Artes/Ed. Física/Cs. Sociales/Filosofía/Matemática/
  Lenguaje diferenciados. **Actualización 2026-08-02, al construir esta
  etapa:** el Plan General se investigó de nuevo antes de escribir contenido
  y resultó tener 6 asignaturas, no 7 — Religión se excluyó por el mismo
  motivo que en Básica (sin documento curricular único, solo variantes por
  credo; ver el detalle completo y la decisión vía `AskUserQuestion` más
  abajo, en "Plan de Formación General"). El **Plan General** (34 módulos)
  y el **Plan Diferenciado Científico** (25 módulos) ya están completos —
  ver "Plan Diferenciado Científico" más abajo para el detalle.

**Arquitectura de navegación (nueva, paralela a Básica — no reutiliza
`GRADES`/`SUBJECT_DEFS`/`state.currentGrade`):** dado que 1°-2° medio es
año→asignatura igual que Básica, se evaluó reutilizar directamente `GRADES`/
`SUBJECT_DEFS` extendiendo los años a 9-10, pero se descartó: (1) "Educación
Media" necesita ser su propia tarjeta en `etapaMap`, separada de "Educación
Básica", y (2) tratar la numeración de Media (1°, 2°) como continuación de la
de Básica (…7°, 8°) habría hecho ambigua la etiqueta de año en cualquier lugar
que lea `state.currentGrade` directamente. Se optó por un tercer par paralelo,
mismo criterio que ya separó Parvularia (`PARVULARIA_NIVELES`/`NUCLEO_DEFS`/
`byNivel`) y EPJA (`EPJA_NIVELES`/`EPJA_SUBJECT_DEFS`/`byNivel`) de Básica:
- `content/grades.js`: `MEDIO_GRADES`/`MEDIO_GRADE_POS` (mismo shape que
  `GRADES`/`GRADE_POS`, con `open:true/false` para ir desbloqueando años).
- `state.js`: `state.currentMedioGrade` + `selectMedioGrade(id)`/
  `medioGradeLabel(id)`, paralelos a `selectGrade`/`gradeLabel`.
- `gradeContent.js`: `<NOMBRE>_BY_GRADE_MEDIO` (uno por asignatura, indexado
  por año igual que `<NOMBRE>_BY_GRADE`) + `MEDIO_SUBJECT_DEFS` (mismo shape
  que `SUBJECT_DEFS`, con `screen` terminado en "MedioMap" en vez de "Map"
  para no chocar con las pantallas de Básica).
  Contenido: **el archivo de asignatura sigue siendo el mismo** que Básica
  (`content/matematica.js`, `content/historia.js`, etc. — no se crearon
  `content/medio/*.js` como en EPJA) porque 1°-2° medio comparte exactamente
  las mismas 10 asignaturas y el mismo patrón de archivo "un archivo por
  asignatura con todos los años dentro"; solo se agregó un bloque nuevo por
  archivo con sufijo `_M1` en vez de `_G<n>` (`MATE_MODULES_M1`/`MATE_POS_M1`,
  generadores `genXxxM1Round`, claves de `state.stars`/`MC_GAMES` en minúscula
  con sufijo `m1`, ej. `numerospotenciasm1`) — mismo criterio de nombrado que
  ya usa Básica (`_G2`.._G8`), reemplazando el número de grado por "M1".
- `render.js`: `renderMedioGradeMap()`/`renderMedioSubjectMap()` (mirror de
  `renderGradeMap()`/`renderSubjectMap()`) + `renderMedioSubjectMapFor()`
  (mirror de `renderEpjaSubjectMapFor()`) + 10 `render<Asignatura>MedioMap()`
  de una línea. `renderEtapaMap()`: la tarjeta "Educación Media" pasó de
  `locked` (🚧) a activa, con subtítulo "1° Medio disponible".
- `main.js`: `window.selectMedioGrade = selectMedioGrade`.
- Jerarquía de pantallas: `etapaMap` → `medioGradeMap` (islas "1° Medio"/
  "2° Medio", solo 1° abierto) → `medioSubjectMap` (10 tarjetas de
  asignatura, lee `state.currentMedioGrade`) → `<asignatura>MedioMap` →
  módulo individual — misma jerarquía de 4 niveles que Básica, con nombres de
  pantalla distintos para no colisionar.

**1° Medio — ✅ completo, 40 módulos, las 10 asignaturas** (curriculumnacional.cl/
curriculum/7o-basico-2o-medio/<asignatura>/1-medio, Decreto 614/2013, verificado
asignatura por asignatura antes de escribir contenido):
- **Matemática** (7): Números Racionales y Potencias (OA01-02), Productos
  Notables (OA03), Sistemas de Ecuaciones (OA04), Funciones Lineales (OA05),
  Sector Circular y Cono (OA06-07), Homotecia, Tales y Semejanza (OA08-11,
  fusionados por ser el mismo bloque conceptual de proporcionalidad), y
  Estadística y Probabilidad (OA12-15, tablas de doble entrada/nube de puntos
  fusionadas con las reglas de probabilidad en un solo módulo). Ningún OA de
  Matemática 1° medio queda fuera.
- **Lenguaje** (5): Narrativa: Conflicto y Perspectiva (OA03), Poesía: Símbolo
  y Lenguaje Figurado (OA04), Texto Dramático y Romanticismo (OA05-07),
  Textos Argumentativos y de Medios (OA09-10), Ortografía (pares de palabras
  que se confunden: sino/si no, haber/a ver, adonde/a dónde, aparte/a parte —
  OA18). Fuera: OA01-02,08 (actitudinal/subjetivo), OA11 (ya cubierto de
  forma transversal), OA12-17 (producción escrita), OA19-23 (comunicación
  oral, desempeño o audio), OA24 (investigación, proceso propio).
- **Historia, Geografía y Cs. Sociales** (7): Ideas Republicanas y Liberales
  (OA01-02), Estado-Nación e Industrialización (OA03-05), Imperialismo y
  Primera Guerra Mundial (OA06-07), Formación de la República de Chile
  (OA08-09), Chile: Salitre y Parlamentarismo (OA10-11,16-17), Geografía y
  Pueblos Originarios (OA12-15,24 — incluye la convivencia/conflicto con
  pueblos indígenas de forma factual, mismo criterio ya establecido en 6°/8°
  básico), Economía Personal y Ciudadanía (OA19-23,25). Ningún OA de Historia
  1° medio queda fuera.
- **Ciencias Naturales** (8): Evidencias de la Evolución (OA01-03),
  Ecosistemas y Poblaciones (OA04-05), Ciclos de Materia e Impacto Humano
  (OA06-08), Ondas: Sonido y Sismología (OA09-10,13), La Luz y los Sentidos
  (OA11-12), Sistema Solar y Universo (OA14-16), Reacciones Químicas
  (OA17-18), Compuestos y Estequiometría (OA19-20). Ningún OA de Ciencias 1°
  medio queda fuera.
- **Inglés** (3): Gramática en Contexto (used to/hábitos pasados, adverbios
  de frecuencia, predicciones con will), Vocabulario en Contexto (adjetivos
  de personalidad), Comprensión de Lectura (ideas generales, información
  explícita, entorno y personajes en textos literarios/no literarios) —
  IN1M OA08-11. Fuera: OA01-07 (oral, depende de audio real), OA12 (proceso
  de lectura), OA13-16 (producción escrita).
- **Educación Física y Salud** (3): Estrategias y Tácticas (OA02, modificar y
  evaluar tácticas — no solo aplicarlas, a diferencia de 7°/8° básico),
  Plan de Entrenamiento Personal (OA03), Vida Activa y Primeros Auxilios
  (OA04). Fuera: OA01 (habilidades motrices reales) y OA05 (participación
  comunitaria real).
- **Orientación** (4): Prevención de Riesgos (OA03, mismo criterio ya
  establecido en 7°-8° básico: solo factores de riesgo/protección, sin
  detalle de sexualidad), Bienestar y Vida Saludable (OA04), Relaciones y
  Redes Sociales (OA05), Resolución de Conflictos (OA06). Fuera: OA01,09-10
  (proyecto de vida, subjetivo), OA02 (sexualidad y vínculos afectivos,
  requiere acompañamiento real de un adulto), OA07-08 (ya cubierta por
  Formación Ciudadana en historia.js).
- **Artes Visuales** (1): Arte, Espacios y Difusión (OA06, continúa el mismo
  eje de "Espacios de Difusión"/"Montaje y Difusión" de 7°-8° básico con
  escenarios nuevos). Fuera: OA01-03 (producción propia), OA04-05
  (apreciación subjetiva).
- **Música** (1): Música e Identidad Cultural (OA01,07 — apreciar
  manifestaciones musicales de Chile y el mundo, y su rol en la construcción
  de identidades, un ángulo nuevo respecto a "Música en la Sociedad" de 3°
  básico). Fuera: OA02 (ya cubierto en 3°-7° básico), OA03-05 (desempeño con
  audio), OA06 (autoevaluación).
- **Tecnología** (1): Evolución Tecnológica y Sociedad (OA05-06). Fuera:
  OA01-04 (diseñar/desarrollar/evaluar/comunicar un servicio propio —
  producción práctica).

**Bugs encontrados y corregidos durante la verificación:**
- **Colisión de nombres de constante**: `MEDIOS_BANK` (el banco nuevo de
  "Textos Argumentativos y de Medios") ya existía en `lenguaje.js` desde el
  módulo `argumentacionmedios8` de 8° básico — un `SyntaxError: Identifier
  'MEDIOS_BANK' has already been declared` detenía la carga de **toda la
  app** (no solo del módulo nuevo), detectado recién al fuzz-testear vía
  import dinámico en el navegador. Renombrado a `MEDIOS_M1_BANK`. Lección
  para archivos grandes con muchos años acumulados: al nombrar un banco
  nuevo, grepear el nombre en el archivo completo antes de asumir que está
  libre, no solo revisar visualmente el bloque del año que se está editando.
- **12 módulos con banco ≤ `rounds:8`** (repetición garantizada en 200/200
  sesiones simuladas): `argumentativomediosm1` (dos bancos de 3+3 ítems),
  `imperialismoguerram1`, `republicachilem1`, `reaccionesquimicasm1`,
  `compuestosestequiometriam1`, `comprensionlecturam1`,
  `estrategiastacticasm1`, `difusionm1`, `musicaidentidadm1`,
  `prevencionriesgosm1`, `relacionesredesm1`, `resolucionconflictosm1` (7
  ítems cada uno, sin margen sobre `rounds:8`) — ampliados con contenido
  real dentro del mismo OA ya citado hasta dejar margen de al menos +2.
  Mismo patrón de bug ya documentado repetidas veces en años anteriores de
  Básica y EPJA ("escribir bancos con margen real desde el principio, no
  exactamente `rounds` ítems").
- **Notación de exponente inconsistente**: el primer borrador de
  `genNumerosPotenciasM1Round` armaba el exponente negativo a mano
  (`base+'⁻'+'^'+Math.abs(exp)`, ej. "2⁻^1"), en vez de usar `<sup>` como ya
  hace `genPotenciasRaices8Round` en el mismo archivo — corregido a
  `base+'<sup>'+exp+'</sup>'` (ej. "2<sup>-1</sup>"), consistente con el
  resto de `matematica.js`.

Verificado: los 40 generadores nuevos pasan fuzz de 200 iteraciones cada uno
(sin `THROW`, sin `undefined`, sin opciones duplicadas, `correctValue`
siempre presente, `recurso` siempre presente con largo ≥30) y simulación de
200 sesiones completas cada uno sin ningún repetido (tras el fix de los 12
bancos). `MC_KEYS.length === Object.keys(MC_GAMES).length === 460` (420
previos + 40 nuevos, sin claves huérfanas) y los 460 módulos de toda la app
pasan un fuzz de regresión de 40 iteraciones sin ningún hallazgo. Probado
visualmente en el navegador: navegación completa `etapaMap` (tarjeta
"Educación Media" ya desbloqueada, subtítulo "1° Medio disponible") →
`medioGradeMap` (1° Medio abierto, 2° Medio bloqueado) → `medioSubjectMap`
(10 asignaturas con conteo de estrellas correcto: 0/15, 0/21, 0/24, 0/21,
0/3, 0/3, 0/9, 0/12, 0/3, 0/9) → mapa de módulos de Matemática (7 nodos, sin
solapamiento) → una ronda jugada en "Números Racionales y Potencias"
(pregunta de fracciones, botón Recurso abriendo el modal con el texto real,
respuesta incorrecta mostrando el overlay de Carboncito con la explicación
correcta) → una ronda en "Ideas Republicanas y Liberales" (Historia, estilo
panel). Probado también en 375px (mobile), sin errores de consola en ningún
caso.

**2° Medio — ✅ completo (2026-08-02), 41 módulos, las 10 asignaturas**
(curriculumnacional.cl/curriculum/7o-basico-2o-medio/<asignatura>/2-medio,
Decreto 614/2013 — mismo decreto que 1° medio, confirmado antes de construir).
Tres URLs de asignatura tienen un slug distinto al que usa 1° medio y al
patrón `<asignatura>-y-<asignatura>` esperado — verificado con WebSearch
antes de reintentar el fetch: Lengua y Literatura vive en
`.../lengua-literatura/2-medio` (no `lengua-y-literatura`), Historia en
`.../historia-geografia-ciencias-sociales/2-medio` (no
`historia-geografia-y-ciencias-sociales`), y Educación Física en
`.../educacion-fisica-salud/2-medio` (no `educacion-fisica-y-salud`) — los
3 fetches directos con el patrón "y" dieron 404 antes de encontrar el slug
real.

- **Matemática** (8): Números Reales y Raíces (MA2M OA01), Potencias/Raíces
  y Logaritmos (OA02), Función Cuadrática (OA03-04, resolución por
  factorización con dos raíces enteras elegidas al azar para que siempre dé
  limpio), Función Inversa (OA05), Interés Compuesto (OA06), Área y Volumen
  de la Esfera (OA07, resultado siempre en términos de π para evitar
  ambigüedad de redondeo), Trigonometría y Vectores (OA08-09, razones sobre
  ternas pitagóricas reales para que los catetos/hipotenusa den siempre
  valores enteros), Variables Aleatorias y Probabilidad (OA10-12, incluye
  el rol social de la probabilidad/interpretación de riesgo relativo vs.
  absoluto en medios). Ningún OA de Matemática 2° medio queda fuera.
- **Lenguaje** (6): Narrativa: Personajes y Estereotipos (OA03, ángulo
  nuevo respecto a conflicto/narrador de 1° medio: personaje redondo/plano,
  estereotipo, intertextualidad), Poesía: Hablante y Soneto (OA04, actitud
  enunciativa/apostrófica/carmínica y estructura del soneto — ángulo nuevo
  respecto a símbolo/metáfora/anáfora de 1° medio), Teatro y Siglo de Oro
  (OA05-06, fusionados: ambiente/símbolo escénico + Cervantes/Lope de Vega/
  comedia nueva), Cuento Latinoamericano (OA07: realismo mágico, cuento
  fantástico, Boom latinoamericano), Textos Argumentativos y Medios
  (OA09-10, fusionados: falacias lógicas + estrategias persuasivas en
  medios), Ortografía y Puntuación (OA18: coma antes de conectores
  adversativos, dos puntos para enumeración/cita, punto y coma — reglas
  distintas de las de 1° medio). Fuera: OA01-02,11 (lectura personal/
  reflexión, actitudinal), OA08 (interpretación con hipótesis propia),
  OA12-17 (producción escrita), OA19-23 (comunicación oral), OA24
  (investigación, proceso propio).
- **Ciencias Naturales** (8): Sistema Nervioso y Regulación Hormonal
  (OA01-02), **Sexualidad y Reproducción Humana II** (OA03-05: dimensiones
  de la sexualidad, fecundación/desarrollo prenatal/responsabilidad
  parental, regulación de la fertilidad y paternidad/maternidad responsable
  — mismo tono clínico/factual/preventivo ya establecido en
  `genSexualidadReproduccion7Round` de 7° básico, nunca gráfico, siempre
  remitiendo a un profesional de la salud ante dudas personales; aplicado
  aquí sin necesidad de replantear la política al usuario porque el
  criterio ya estaba resuelto y documentado), Genética y Herencia (OA06-07),
  Manipulación Genética (OA08), Movimiento y Fuerzas (OA09-10), Energía
  Mecánica y Choques (OA11-12), Universo y Gravitación (OA13-14),
  Disoluciones y Química Orgánica (OA15-18). Ningún OA de Ciencias 2° medio
  queda fuera.
- **Historia, Geografía y Cs. Sociales** (8): Entreguerras y Vanguardias
  (OA01), Crisis del Liberalismo (OA02), Segunda Guerra Mundial (OA03-04),
  República de Chile: Crisis y Reconstrucción (OA05-07), Guerra Fría
  (OA08-11), Chile: Movilización y Crisis (OA12-14), **Dictadura, Modelo
  Económico y Transición** (OA15-21) y Formación Ciudadana (OA22-25).
  HI2M OA15-16 piden explícitamente "comparar interpretaciones
  historiográficas" sobre el golpe de 1973 y "explicar el desarrollo de las
  violaciones sistemáticas a los DD.HH." — un nivel más profundo que el
  criterio ya usado en 6° básico. **Se le preguntó al usuario explícitamente
  vía `AskUserQuestion`** qué enfoque usar (mismo criterio de 6° básico /
  profundizar según pide el OA / excluir estos 2 OA), y confirmó mantener
  el mismo criterio ya establecido: solo hechos cronológicos indiscutibles
  y documentados por fuentes oficiales (fecha del golpe de 1973, comisiones
  oficiales Rettig/Valech que documentaron violaciones a los DD.HH., modelo
  económico neoliberal, Constitución de 1980, plebiscito de 1988, retorno a
  la democracia el 11 de marzo de 1990), sin comparar posturas
  historiográficas ni narrar detalles de violaciones específicas. Ningún OA
  de Historia 2° medio queda fuera del motor de opción múltiple.
- **Inglés** (3): Gramática en Contexto (IN2M OA08: sugerencias con should/
  could/why don't you, situaciones hipotéticas con "if I were", expresiones
  de cantidad a lot of/a few/a little), Palabras Derivadas (OA10, ángulo de
  formación de palabras con prefijos/sufijos -ness/-ful/-less/un- distinto
  del vocabulario de personalidad de 1° medio), Comprensión de Lectura
  (OA11: tema/personajes/entorno/conflicto en textos literarios + propósito/
  idea principal en no literarios). Fuera: OA01-07 (oral, depende de audio
  real), OA09,12 (estrategias de lectura, proceso propio), OA13-16
  (producción escrita).
- **Educación Física y Salud** (2): Diseño de Estrategias y Tácticas
  (EF2M OA02, ángulo de DISEÑO desde cero en vez de solo modificar/evaluar
  como en 1° medio, texto del OA casi idéntico), Entrenamiento y Gasto
  Calórico (OA03, ángulo del gasto calórico/equilibrio calórico que el
  módulo de 1° medio no ejercitó explícitamente). Fuera: OA01 (habilidades
  motrices reales) y OA04-05 (participación/liderazgo comunitario real).
- **Artes Visuales** (1): Implementar la Difusión de Arte (AR2M OA06,
  ángulo de EJECUCIÓN concreta —difusión previa, coordinación de espacio/
  horario/permisos, evaluación posterior— distinto del diseño de montaje/
  espacio/público ya cubierto en "Arte, Espacios y Difusión" de 1° medio,
  ya que el texto del OA es casi idéntico). Fuera: OA01-03 (crear proyectos
  propios), OA04-05 (apreciación/evaluación subjetiva).
- **Música** (1): Contraste Musical y Medios de Registro (MU2M OA02:
  contrastar dos obras por lenguaje musical/procedimientos compositivos/
  contexto/propósito expresivo; OA07: rol de partitura/grabación/radio/
  streaming en la evolución de la música). Fuera: OA01 (ya cubierto por
  "Música e Identidad Cultural" de 1° medio), OA03-05 (desempeño con audio
  real), OA06 (autoevaluación).
- **Orientación** (3): Riesgos y Redes de Apoyo (OR2M OA03, ángulo nuevo
  respecto a 1° medio: identificar redes de apoyo -familia, profesores,
  instituciones de salud- en vez de solo factores de riesgo), Bienestar,
  Relaciones y Conflictos II (OA04-06, fusionados con escenarios enteramente
  nuevos ya que el texto es casi idéntico al de 1° medio), Proyección
  Académica y Laboral (OA09, genuinamente nuevo: contrastar trayectorias
  académicas/laborales posibles). Fuera: OA01 (proyecto de vida, subjetivo),
  OA02 (sexualidad y vínculos afectivos, requiere acompañamiento real de un
  adulto), OA07-08 (ya cubiertos por Formación Ciudadana en historia.js),
  OA10 (diseñar un proyecto de vida propio, subjetivo).
- **Tecnología** (1): Proyectar Escenarios Tecnológicos (TE2M OA05-06,
  ángulo de PROYECCIÓN de escenarios futuros de impacto en vez de evaluar
  innovaciones ya existentes como en 1° medio, mismo texto de OA casi
  idéntico). Fuera: OA01-04 (identificar necesidades y proponer/comunicar
  una solución tecnológica propia).

**Bugs encontrados y corregidos durante la construcción y verificación:**
- **23 de los 41 generadores nuevos tenían bancos con menos ítems únicos
  que `rounds:8`** (repetición garantizada o casi garantizada), detectado
  por la misma simulación de sesión ya usada en años anteriores (300
  sesiones simuladas, retry de hasta 300 intentos por ronda, replicando la
  lógica real de `roundSignature`/reintentos de `mcEngine.js`). Afectó a
  módulos en los 8 archivos de contenido con generadores basados en bancos
  fijos (no dinámicos): Lenguaje (los 6 módulos), Ciencias (5 de 8),
  Historia (7 de 8), Inglés (2 de 3), Ed. Física (2 de 2), Artes (el único
  módulo), Música (el único, pese a tener 4+4=8 ítems combinados — justo en
  el límite, sin margen real), Tecnología (el único) y Orientación (3 de
  3) — los generadores puramente dinámicos de Matemática y Ciencias
  (cálculos con números al azar) no se vieron afectados. Corregido
  ampliando cada banco con contenido real dentro del mismo OA/concepto ya
  citado (nunca inventando un OA nuevo), apuntando a un margen de +2 a +4
  ítems únicos sobre `rounds:8`. **Una primera ronda de ampliación dejó 5
  bancos con exactamente 7 ítems únicos** (`geneticaherenciam2`,
  `entreguerrasm2`, `crisisliberalismom2`, `riesgosredesapoyom2`,
  `proyeccionacademicam2`) — un error de conteo manual al redactar los
  ítems nuevos (se contaron mentalmente como 8 pero el archivo real tenía
  7), detectado solo porque se volvió a correr la simulación completa
  después de la primera ronda de fixes en vez de asumir que ya estaba
  resuelto; se verificó el conteo real de cada banco con `grep -c` antes de
  agregar el ítem final que faltaba. Lección reforzada: tras ampliar un
  banco para resolver este bug, volver a correr la simulación completa (no
  solo revisar visualmente cuántas líneas se agregaron) y, si algo sigue
  fallando, contar el banco real con una herramienta antes de asumir dónde
  está el error.
- **Bug de sintaxis real introducido durante la escritura de
  `genFuncionInversaM2Round`** (`matematica.js`): un primer intento de
  construir `distractCandidates` dejó una coma suelta dentro de una cadena
  concatenada (`'...'+a, no', ...`), un error de sintaxis JS que habría
  roto la carga de todo el archivo. Detectado por revisión manual del
  código inmediatamente después de escribirlo (antes de cualquier prueba en
  el navegador), no por el fuzz-test — reforzando que revisar el diff
  recién escrito sigue siendo necesario incluso cuando se sabe que habrá
  fuzz-testing después.
- Verificado tras las correcciones: los 41 generadores nuevos pasan fuzz
  estructural (300 iteraciones cada uno: sin `THROW`, sin `undefined`, sin
  opciones duplicadas, `correctValue` siempre presente en las opciones,
  `recurso` siempre presente) y simulación de 300 sesiones completas cada
  uno sin ningún repetido. `MC_KEYS.length === Object.keys(MC_GAMES).length
  === 501` (460 previos + 41 nuevos, sin claves huérfanas en ninguna
  dirección) y los 501 módulos de toda la app pasan un fuzz de regresión de
  40 iteraciones sin ningún hallazgo. Probado visualmente en el navegador:
  navegación completa `etapaMap` (tarjeta "Educación Media" con subtítulo
  "1° y 2° Medio disponibles") → `medioGradeMap` (1° y 2° Medio ambos
  abiertos) → `medioSubjectMap` de 2° medio (10 asignaturas con conteo de
  estrellas correcto: 0/18, 0/24, 0/24, 0/24, 0/9, 0/3, 0/3, 0/6, 0/3, 0/9)
  → mapa de módulos de Matemática (8 nodos, sin solapamiento) → una ronda
  completa jugada en "Función Cuadrática" (ecuación cuadrática factorizada
  con raíces enteras, avance correcto de 1/8 a 2/8, modal de Recurso
  abriendo con el texto real) → overlay de Carboncito tras una respuesta
  incorrecta con la explicación correcta. Probado también en 375px
  (mobile): mapa de módulos de Historia sin solapamiento ni truncamiento de
  títulos, y una ronda en "Dictadura, Modelo Económico y Transición"
  confirmando visualmente el tono factual/restringido de esa sección. Sin
  errores de consola en ningún caso.

Con esto, **Educación Media queda con 1° y 2° medio 100% completos** (81
módulos en total).

**3°-4° medio — Plan de Formación General ✅ completo (2026-08-02), 34
módulos, las 6 asignaturas del plan:** pedido explícito del usuario
("procede") de continuar con 3°-4° medio tras completar 2° medio. A
diferencia de 1°-2° medio (mismo Decreto 614/2013, pero año→10 asignaturas
idénticas a Básica), 3°-4° medio tiene una estructura curricular
completamente distinta, verificada en curriculumnacional.cl antes de
construir nada: un **Plan de Formación General** (asignaturas obligatorias
para todos los estudiantes) + un **Plan de Formación Diferenciada**
electivo, organizado en 3 áreas (Humanista, Científica, Artística/Ed.
Física). El alcance para esta etapa, ya acordado en sesiones anteriores,
era Plan General completo + Plan Diferenciado Científico (Biología Celular
y Molecular, Biología de los Ecosistemas, Ciencias de la Salud, Física,
Química) — este PR construye **solo el Plan General**; el Plan
Diferenciado Científico queda para una sesión futura (ver más abajo).

- **Exclusión de Religión del Plan General, decidida en esta sesión (vía
  `AskUserQuestion`):** el plan original (anotado en sesiones anteriores)
  incluía Religión como 1 de 7 asignaturas del Plan General. Al investigar
  el currículum real antes de construir, se confirmó que Religión en
  3°-4° medio tiene el mismo problema ya documentado para excluirla de
  Básica: Mineduc no publica un documento curricular único, sino OA
  distintos por credo (existe un documento "Asignatura Religión Católica"
  con OA completos, pero es confesional, no genérico — Decreto 924 de 1984
  establece que la asignatura es electiva y depende del credo que cada
  familia indique al matricularse). Se le presentó la disyuntiva al
  usuario explícitamente (excluir / incluir solo la variante católica /
  investigar más) y se optó por **excluir Religión, mismo criterio que
  Básica** — el Plan General de esta app queda en **6 asignaturas**: Lengua
  y Literatura, Matemática, Ciencias para la Ciudadanía, Educación
  Ciudadana, Filosofía, Inglés.
- **Arquitectura de navegación (cuarto patrón, ni año/asignatura de Básica
  ni Plan General/Diferenciado de un solo plan): dentro de Educación Media,
  1°-2° medio ya usaba año→10 asignaturas idénticas; 3°-4° medio necesita
  año→Plan(General/Diferenciado)→asignaturas propias de ese plan.** En vez
  de crear una jerarquía de pantallas completamente nueva y desconectada,
  se extendió la ya existente: `MEDIO_GRADES`/`MEDIO_GRADE_POS`
  (`content/grades.js`) pasaron de 2 a 4 islas (1°-4° medio, el mapa de
  zigzag ahora usa las mismas 4 posiciones que `GRADE_POS` usa para pares de
  años en Básica). `selectMedioGrade(id)` (`state.js`) ahora **bifurca
  según el año** en vez de navegar siempre al mismo lugar: `id<=2` sigue
  yendo a `medioSubjectMap` (las 10 materias ya conocidas de 1°-2° medio);
  `id>=3` navega a una pantalla nueva, `planMedioMap` — dos tarjetas, "Plan
  de Formación General" (activa) y "Plan Diferenciado Científico" (con
  toast "🚧 en preparación", mismo patrón que cualquier tarjeta bloqueada
  del resto de la app). El Plan General navega a `planGeneralMap`
  (idéntico en estructura a `renderMedioSubjectMap()`, pero iterando sobre
  `PLAN_GENERAL_SUBJECT_DEFS` en vez de `MEDIO_SUBJECT_DEFS`) y de ahí a 6
  pantallas de mapa de módulos nuevas (`lenguaLiteraturaPlanMap`,
  `matematicaPlanMap`, `cienciasCiudadaniaPlanMap`,
  `educacionCiudadanaPlanMap`, `filosofiaPlanMap`, `inglesPlanMap`), cada
  una un one-liner que usa el helper nuevo `renderPlanGeneralSubjectMapFor()`
  (mismo patrón que `renderMedioSubjectMapFor()`/`renderEpjaSubjectMapFor()`
  ya usados para los otros planes de navegación). No hizo falta ninguna
  variable de estado nueva: `state.currentMedioGrade` ya servía para
  cualquier año 1-4, reutilizado tal cual.
- **Contenido en `content/medio34/` (carpeta nueva, un archivo por
  asignatura, mismo patrón que `content/epja/`):** `matematica.js`,
  `lenguaLiteratura.js`, `educacionCiudadana.js`, `filosofia.js`,
  `cienciasCiudadania.js`, `ingles.js` — nombres de archivo distintos a los
  ya usados en `content/` (que son de Básica/1°-2° medio) para no chocar,
  aunque viven en su propia subcarpeta así que técnicamente no habría
  colisión. Cada archivo exporta `_M3`/`_M4` (bancos + `genXxxRound` +
  `MODULES`/`POS`), mismo patrón que `_G<n>` de Básica o `_M1`/`_M2` de
  1°-2° medio, con sufijo `PG3`/`PG4` ("Plan General") en las claves de
  `state.stars`/`MC_GAMES`.
  - **"Ciencias para la Ciudadanía" es la única de las 6 asignaturas cuyo
    currículum oficial NO se organiza por año**: sus códigos de OA son
    literalmente `FG-CIAS-3y4-OAC-01/02/03` (y lo mismo para sus otras 3
    áreas temáticas) — un solo conjunto de OA compartido entre 3° y 4°
    medio, verificado leyendo el contenido real de cada página de
    curriculumnacional.cl antes de asumirlo (no solo el código). Por eso
    `content/medio34/cienciasCiudadania.js` exporta un solo
    `CIENCIAS_CIUDADANIA_MODULES`/`_POS` (sin sufijo de año), y en
    `gradeContent.js` tanto `byGrade[3]` como `byGrade[4]` apuntan al mismo
    objeto — el contenido es idéntico para ambos años, fiel a como Mineduc
    realmente organiza esta asignatura (no una simplificación de la app).
  - **Lengua y Literatura** (2+2 módulos): los OA de 3°-4° medio son
    mayormente de interpretación/producción de textos propios y diálogo
    argumentativo oral — habilidades de desempeño sin una única respuesta
    correcta. Se adaptó al motor de opción múltiple el aspecto SÍ evaluable:
    3° medio - Interpretación Literaria (reconocer recursos literarios en
    fragmentos ilustrativos **originales**, nunca poemas reales con
    derechos de autor) y Análisis Crítico de Textos y Medios Digitales
    (detectar intención persuasiva/sesgo en escenarios de medios); 4° medio
    - Comparación de Obras Literarias (dos fragmentos originales
    contrastantes sobre un mismo tema) y Evaluación Crítica de Textos
    (detectar sesgo, conflicto de interés, descontextualización).
  - **Matemática** (4+4 módulos, el eje más denso en OA por año — solo 4
    cada uno, pero cada uno mucho más amplio que en Básica): 3° medio -
    Números Complejos, Estadística (dispersión + probabilidad condicional),
    Funciones Exponencial y Logarítmica, Geometría de la Circunferencia; 4°
    medio - Matemática Financiera (interés simple/compuesto), Modelos
    Binomial y Normal, Funciones Potencia y Trigonométricas, Rectas y
    Circunferencias en el Plano. Mismo criterio que 1°-2° medio: generadores
    dinámicos con valores elegidos a propósito (combos de interés compuesto
    precomputados para dar un monto final exacto, ángulos múltiplos de 20°,
    ternas de senos/cosenos exactos) para evitar ambigüedad por redondeo.
  - **Educación Ciudadana** (3+4 módulos) y **Filosofía** (4+3 módulos, la
    primera vez que esta asignatura existe en la app — no forma parte de
    Básica ni de 1°-2° medio): ambas mezclan conceptos factuales
    (instituciones, teorías, corrientes de pensamiento) con habilidades
    reflexivas/participativas propias sin una única respuesta — se adaptó
    el aspecto conceptual con un formato nuevo, reutilizado en las dos:
    `genDefRound(bank, recurso)`, que pregunta "¿qué significa el concepto
    X?" contra una definición correcta y 3 definiciones de otros conceptos
    del mismo banco como distractores. En Filosofía, presentar corrientes
    como posturas históricas con nombre propio (idealismo, empirismo,
    utilitarismo...) evita convertir preguntas filosóficas abiertas en
    preguntas con una sola "respuesta correcta" ilegítima: se pregunta qué
    dice una corriente, no cuál corriente "tiene la razón".
  - **Inglés** (2+2 módulos): mismo criterio que `content/ingles.js` desde
    5° básico — comprensión (vocabulario/gramática en contexto + lectura),
    dejando fuera comprensión/producción oral (audio real) y producción
    escrita (proceso propio). 4° medio introduce estructuras más avanzadas
    (voz pasiva, oraciones relativas, tercer condicional) y lecturas con
    estructura argumentativa más compleja (debates con dos posturas). Mismo
    mecanismo `speakLang:'en'` ya establecido.
- **Bug real de arquitectura encontrado en la primera prueba en el
  navegador (no por el fuzz-test estructural, que no lo detecta):**
  `renderModuleMap()` navega usando `m.id` como nombre de pantalla
  (`onclick="goTo('+m.id+')"`), y el dispatcher central de `render.js`
  reconoce una pantalla de minijuego con `MC_KEYS.indexOf(scr) !== -1` — es
  decir, **`id` y `key` de cada módulo deben ser exactamente la misma
  cadena** (así es en los ~500 módulos ya existentes de toda la app, un
  invariante nunca escrito explícitamente en ningún comentario). Los 34
  módulos nuevos se escribieron inicialmente con `id` en formato
  "camelCase con sufijo PG3/PG4" (ej. `id:'numerosComplejosPG3'`) distinto
  de su `key` en minúsculas (`key:'numeroscomplejospg3'`) — al hacer clic
  en un nodo del mapa, `goTo('numerosComplejosPG3')` navegaba a una
  pantalla que el dispatcher no reconocía como minijuego (no calzaba con
  ningún `MC_KEYS`), dejando el `#app` prácticamente vacío (solo el
  topbar) sin ningún error en consola — el fuzz-test estructural (llamar
  `gen()` directamente) nunca lo iba a encontrar, porque no pasa por
  `renderModuleMap()`/el dispatcher. Corregido igualando `id` a `key` en
  los 6 archivos de contenido (34 módulos). **Lección para contenido
  futuro:** verificar SIEMPRE con una navegación real de clic en el
  navegador (no solo fuzz-test de `gen()` en consola) antes de dar un
  módulo nuevo por terminado, y mantener `id === key` como convención
  explícita al escribir `MODULES`/`POS` de cualquier asignatura nueva.
- **Bug de bank-size ya conocido, encontrado por la simulación de
  no-repetición:** `comparacionobraspg4` (Lengua y Literatura 4° medio)
  tenía exactamente 6 pares de fragmentos para `rounds:8` — 200/200
  sesiones simuladas con repetición garantizada. Ampliado a 10 pares
  (margen de 2) con contenido original nuevo dentro del mismo formato ya
  usado (dos fragmentos contrastantes sobre un tema, con un eje declarado
  -crítica/esperanzadora/nostálgica- para evitar ambigüedad).
- **Bug real de colisión de opciones en `generaVarianza()`** (Matemática,
  Estadística: Dispersión), encontrado por el fuzz-test estructural (10.7%
  de rondas con opciones repetidas): uno de los 6 conjuntos de desviaciones
  precomputados (`{devs:[-2,-2,2,2], varr:4}`) tiene un **rango numérico
  (máximo - mínimo = 4) idéntico a su propia varianza (4)** — el código
  agregaba el rango como distractor sin verificar que fuera distinto de la
  respuesta correcta, produciendo dos copias del mismo valor entre las
  opciones cuando ese conjunto era elegido al azar. Corregido agregando el
  chequeo `if(rango!==correct)` antes de sumarlo como distractor, con un
  fallback que genera un distractor numérico cercano si hacen falta más
  alternativas — mismo patrón de guardia ya usado en otros generadores de
  la app para evitar que un distractor "calculado" coincida por casualidad
  con la respuesta correcta.
- Verificado: los 34 generadores nuevos pasan fuzz de 300 iteraciones cada
  uno (sin `THROW`, sin `undefined`, sin opciones duplicadas, `correctValue`
  siempre presente en las opciones, `recurso` siempre presente con largo
  ≥20) y simulación de 200 sesiones completas cada uno sin ningún repetido
  (tras el fix de `comparacionobraspg4`). `MC_KEYS.length ===
  Object.keys(MC_GAMES).length === 535` (501 previos + 34 nuevos, sin claves
  huérfanas) y los 535 módulos de toda la app pasan un fuzz de regresión de
  40 iteraciones sin ningún hallazgo. Probado visualmente en el navegador
  (tras corregir el bug de `id`/`key`): navegación completa `etapaMap`
  (subtítulo actualizado a "1° a 4° Medio disponibles") → `medioGradeMap`
  (mapa de 4 islas, sin solapamiento) → `planMedioMap` de 3° medio (Plan
  General activo, Plan Diferenciado con toast "🚧 en preparación") →
  `planGeneralMap` (6 materias con conteo de estrellas correcto: 0/6, 0/12,
  0/12, 0/9, 0/12, 0/6) → mapa de módulos de Matemática (4 nodos, sin
  solapamiento) → una partida completa en "Números Complejos" (resolvió
  correctamente una suma y una resta de complejos, modal de Recurso
  abriendo con el texto real, overlay de Carboncito tras una respuesta
  incorrecta) → "Vocabulario y Gramática Avanzada" (Inglés 4° medio,
  oración con hueco y las 4 alternativas en inglés) → confirmación de que
  "Ciencias para la Ciudadanía" muestra el mismo contenido para 3° y 4°
  medio (por diseño). Sin errores de consola en ningún caso.

Con esto, **el Plan de Formación General de 3°-4° medio queda 100%
completo** (34 módulos, las 6 asignaturas del plan).

**3°-4° medio — Plan Diferenciado Científico ✅ completo (2026-08-02), 25
módulos, las 5 asignaturas del plan:** pedido del usuario ("continua con
los PR") de seguir con el último tramo pendiente de Educación Media,
usando el mismo patrón de investigación/construcción/verificación ya
aplicado al Plan General. Fuente real: Decreto 614/2013, Plan de
Formación Diferenciada Humanista-Científico, área Ciencias
(curriculumnacional.cl/curriculum/3o-4o-medio/<asignatura>/3-medio-hc y
4-medio-hc). **Las 5 asignaturas tienen sus OA compartidos entre 3° y 4°
medio** (códigos literalmente "CN-BCMO-3y4-OAC-01", "CN-BECO-3y4-OAC-01",
etc. — verificado leyendo el contenido real de ambas páginas de cada
asignatura antes de asumirlo, mismo criterio que confirmó esto mismo para
"Ciencias para la Ciudadanía" en el Plan General), así que cada asignatura
tiene un solo archivo de contenido (sin sufijo de año) cuyo `byGrade[3]` y
`byGrade[4]` apuntan al mismo objeto de módulos — esto redujo el trabajo a
la mitad de lo que habría sido si cada asignatura tuviera contenido
separado por año, y explica por qué el Plan Diferenciado (25 módulos) es
más chico que el Plan General (34 módulos) pese a tener una asignatura
menos.

- **Arquitectura:** se activó la tarjeta "Plan Diferenciado Científico" de
  `planMedioMap` (antes mostraba un toast "🚧 en preparación") para que
  navegue a una pantalla nueva, `planDiferenciadoMap` — mismo patrón que
  `planGeneralMap`, iterando sobre `PLAN_DIFERENCIADO_SUBJECT_DEFS`
  (`gradeContent.js`) en vez de `PLAN_GENERAL_SUBJECT_DEFS`. Las 5
  asignaturas nuevas tienen su propio helper
  `renderPlanDiferenciadoSubjectMapFor()` (mismo patrón que
  `renderPlanGeneralSubjectMapFor()`) y 5 pantallas de mapa de módulos
  (`biologiaCelularMolecularPlanMap`, `biologiaEcosistemasPlanMap`,
  `cienciasSaludPlanMap`, `fisicaPlanMap`, `quimicaPlanMap`). No hizo falta
  ningún cambio a `selectMedioGrade()`/`planMedioMap` en sí — ya estaban
  preparados desde la construcción del Plan General para este momento.
- **Contenido en `content/medio34/` (5 archivos nuevos):**
  `biologiaCelularMolecular.js`, `biologiaEcosistemas.js`,
  `cienciasSalud.js`, `fisica.js`, `quimica.js` — mismo patrón de archivo
  que el resto de `content/medio34/`, con sufijo `PD` ("Plan
  Diferenciado") en las claves de `state.stars`/`MC_GAMES`. En todas las 5
  asignaturas, los OA de investigación/valoración personal (historia del
  desarrollo científico, "valorar la integración de conocimientos con
  otras ciencias") quedaron fuera del motor de opción múltiple por ser
  actitudinales o de proceso propio, sin una única respuesta correcta —
  documentado caso a caso en el comentario inicial de cada archivo. Mismo
  formato `genDefRound(banco, recurso)` ya usado en Educación
  Ciudadana/Filosofía del Plan General para la mayoría de los módulos
  (definición de conceptos con 3 distractores del mismo banco), con **una
  excepción dinámica**: "Movimiento bajo Fuerzas Centrales" (Física) es un
  generador cuantitativo que aplica la ley del inverso del cuadrado de la
  Ley de Gravitación Universal (si la distancia se multiplica/divide por
  k, la fuerza cambia en un factor de 1/k² o k²), con k y la dirección
  (aumenta/disminuye) elegidos al azar en cada ronda.
  - **Biología Celular y Molecular** (5): Estructura y Organización
    Celular, Dogma Central de la Biología Molecular, Regulación Génica y
    Cáncer, Estructura y Función de Proteínas, Biotecnología y sus
    Aplicaciones.
  - **Biología de los Ecosistemas** (4): Biodiversidad/Evolución/
    Intervención Humana, Servicios Ecosistémicos y Dinámica de
    Poblaciones, Cambio Climático y Resiliencia de Ecosistemas, Ciencia y
    Tecnología frente al Cambio Climático.
  - **Ciencias de la Salud** (5): Salud Pública: Problemas Complejos
    (incluye "enfermedad de transmisión sexual" como una de varias
    categorías de problemas de salud pública -junto a consumo de drogas,
    desequilibrios alimentarios, enfermedades laborales-, tratada con el
    mismo criterio clínico/factual/preventivo y en un marco de
    epidemiología poblacional -no de educación sexual individual- ya
    establecido en el resto de la app, sin necesidad de replantear la
    política al usuario), Genoma y Ambiente en la Salud, Estilos de Vida y
    Salud Integral, Calidad Ambiental y Salud Humana, Tecnología Médica y
    Calidad de Vida.
  - **Física** (5): Cambio Climático: Física del Fenómeno (deliberadamente
    con un ángulo distinto —balance energético, efecto invernadero,
    albedo— al de "Ambiente y Sostenibilidad" del Plan General o "Química
    del Cambio Climático" de esta misma asignatura Diferenciado, que
    abordan el mismo fenómeno desde la sostenibilidad y la química
    respectivamente), Origen y Evolución del Universo, Movimiento bajo
    Fuerzas Centrales (el único módulo dinámico/cuantitativo del Plan
    Diferenciado), Física Moderna: Relatividad y Cuántica, Fluidos/
    Electromagnetismo y Termodinámica.
  - **Química** (6): Nanoquímica y Polímeros, Ácido-Base/Redox y
    Polimerización, Termodinámica y Cinética Química, Química del Cambio
    Climático: Ciclos y Equilibrios (ángulo de ciclos biogeoquímicos/
    acidificación oceánica, distinto del ángulo de física del fenómeno de
    la asignatura Física), Contaminantes Químicos y sus Efectos,
    Tecnologías Químicas para el Clima.
- **Bug real de bank-size encontrado por la simulación de no-repetición:**
  "Movimiento bajo Fuerzas Centrales" (el único generador dinámico) solo
  variaba un factor k entre 4 valores posibles ({2,3,4,5}), dando apenas 4
  combinaciones únicas para `rounds:8` — 200/200 sesiones simuladas con
  repetición garantizada. Corregido ampliando el pool de k a 6 valores
  ({2,3,4,5,6,7}) y agregando una segunda dimensión real (si la distancia
  aumenta o disminuye, cambiando si la respuesta es una fracción o un
  entero), llegando a 12 combinaciones únicas posibles — más que suficiente
  margen sobre `rounds:8`.
- **Alturas de mapa de nodos calculadas, no copiadas por defecto:** a
  diferencia de sesiones anteriores donde se reutilizó un valor de
  `height` ya usado en otro archivo sin verificar, esta vez se calculó el
  espaciado vertical real entre nodos del mismo lado del zigzag (Δy% ×
  height/100) para cada dataset nuevo antes de fijar su altura, apuntando
  a un margen ≥150px (el alto real de un nodo, documentado en la auditoría
  de mapas de 2026-07-26) — evitando tanto el solapamiento como una altura
  excesiva con espacio vacío de sobra. Verificado después con
  `getBoundingClientRect()` en las 5 pantallas nuevas: 0 solapamientos.
- Verificado: los 25 generadores nuevos pasan fuzz de 300 iteraciones cada
  uno (sin `THROW`, sin `undefined`, sin opciones duplicadas, `correctValue`
  siempre presente, `recurso` siempre presente con largo ≥20) y simulación
  de 200 sesiones completas cada uno sin ningún repetido (tras el fix de
  "Movimiento bajo Fuerzas Centrales"). `MC_KEYS.length ===
  Object.keys(MC_GAMES).length === 560` (535 previos + 25 nuevos, sin
  claves huérfanas) y los 560 módulos de toda la app pasan un fuzz de
  regresión de 40 iteraciones sin ningún hallazgo. Probado visualmente en
  el navegador: navegación completa `etapaMap` → `medioGradeMap` →
  `planMedioMap` de 4° medio (ambas tarjetas activas: Plan General y Plan
  Diferenciado Científico) → `planDiferenciadoMap` (5 materias con conteo
  de estrellas correcto: 0/15, 0/12, 0/15, 0/15, 0/18) → los 5 mapas de
  módulos (4 a 6 nodos cada uno, sin solapamiento verificado con
  `getBoundingClientRect()`) → una partida completa en "Movimiento bajo
  Fuerzas Centrales" (resolvió correctamente una pregunta de "distancia ×4
  → fuerza ×1/16" y otra de "distancia ÷6 → fuerza ×36", modal de Recurso
  abriendo con el texto real) → confirmación del tono clínico/factual de
  "Salud Pública: Problemas Complejos". Sin errores de consola en ningún
  caso.

Con esto, **Educación Media queda 100% completa**: 1°-2° medio (81
módulos) + 3°-4° medio con su Plan General (34 módulos) y su Plan
Diferenciado Científico (25 módulos) — 140 módulos en total para esta
etapa.

**Auditoría de estilos de los 59 módulos nuevos (2026-08-02, pedido
explícito del usuario, alcance confirmado vía `AskUserQuestion`: solo los
módulos de esta sesión, no toda la app):** se verificó programáticamente
en el navegador, para los 59 módulos del Plan General y el Plan
Diferenciado Científico, que no hubiera desborde horizontal (`scrollWidth`
vs. ancho de viewport), que las 4 alternativas siempre estuvieran
presentes y sin corte de texto, y que `.prompt-card` renderizara — 0
hallazgos en mobile (375px). Se revisó visualmente el caso más exigente
(la alternativa más larga de los 59 módulos, 157 caracteres, en
"Química del Cambio Climático: Ciclos y Equilibrios") en mobile y
escritorio: el estilo `.option-btn.panel` ya establecido en la app
(ancho de lectura limitado, alineado a la izquierda, acento de color)
maneja bien ese largo de texto sin ajustes adicionales. También se
confirmó que los títulos de módulo más largos de este lote (hasta 47
caracteres) no se truncan en el mapa de nodos. No se encontró ningún
problema de estilo que corregir en estos 59 módulos.

### EPJA (Educación para Personas Jóvenes y Adultas) — ✅ completo (los 5 niveles: Nivel 1/2/3 Básica, Nivel 1/2 Media)
Pedido explícito del usuario (2026-08-01, "procede con epja") de empezar a
construir esta etapa, dejando el orden y el punto de partida a criterio de
Claude ("dejar que yo decida el orden", confirmado vía `AskUserQuestion`).

**Arquitectura (tercer patrón de navegación distinto, ni año/asignatura
como Básica ni nivel/núcleo como Parvularia):** EPJA se organiza por
**niveles que agrupan varios años en un solo examen de Validación de
Estudios** — Nivel 1 Básica (1°-4° básico), Nivel 2 Básica (5°-6°), Nivel 3
Básica (7°-8°), Nivel 1 Media (1°-2° medio), Nivel 2 Media (3°-4° medio) —,
y dentro de cada nivel por **asignatura**, pero la lista de asignaturas
varía según el nivel (Nivel 1 Básica solo tiene 2: Lenguaje y Matemática;
niveles posteriores agregan Ciencias Naturales, Estudios Sociales, Inglés,
y en Media asignaturas propias de adultos como Educación Financiera o
Emprendimiento y Empleabilidad — ver `content/grades.js` para el detalle
completo investigado). Por eso no se reutilizó `SUBJECT_DEFS`/`byGrade` ni
`NUCLEO_DEFS`/`byNivel` de Parvularia: se creó un tercer par paralelo,
`EPJA_NIVELES` (`content/grades.js`) + `EPJA_SUBJECT_DEFS`/`byNivel`
(`gradeContent.js`), mismo criterio de "premature abstraction" ya aplicado
al separar Parvularia de Básica. Jerarquía de pantallas: `etapaMap` →
`epjaMap` (tarjetas de nivel, `EPJA_NIVELES` con `open:true/false` igual que
`GRADES`) → `epjaSubjectMap` (tarjetas de asignatura del nivel actual, lee
`state.currentEpjaNivel`) → `lenguajeEpjaMap`/`matematicaEpjaMap` (mapa de
módulos, vía el helper `renderEpjaSubjectMapFor()` que reutiliza
`renderModuleMap()`, mismo patrón que `renderNucleoMapFor()` de Parvularia)
→ juego individual. `state.currentEpjaNivel` (`selectEpjaNivel()`/
`epjaNivelLabel()` en `state.js`) es el tercer selector de contexto de
navegación, junto a `currentGrade` (Básica) y `currentNivel` (Parvularia).
Contenido en `content/epja/<asignatura>Nivel<N>.js` (mismo patrón de
archivo que un núcleo de Parvularia o un submódulo de Estudio para
Pruebas: bancos + `genXxxRound` + `MODULES`/`POS`).

**Fuente curricular real, investigada antes de escribir contenido (regla
de oro del proyecto):** a diferencia de Básica (Decreto 439/2012, un solo
documento estable), EPJA está en transición — Mineduc publicó nuevas
"Bases Curriculares EPJA 2024", pero solo se implementan progresivamente
(Lenguaje y Matemática de Nivel 1 Básica desde 2025). Se investigó primero
qué documento real y vigente existía para Nivel 1 Básica: el "Temario
Nivel 1 de Educación Básica — Proceso de exámenes de Validación de
Estudios Adultos (mayores de 18 años)", Decreto Supremo N°10 de 2022,
versión 2026 (la más reciente publicada por epja.mineduc.cl al momento de
construir), que lista objetivos de evaluación concretos y evaluables para
Lenguaje y Comunicación y Matemática — más preciso incluso que el programa
pedagógico completo de 2006 ("Educación Básica de Adultos"), porque es
literalmente el temario de examen oficial vigente. Los PDF de
epja.mineduc.cl vinieron en dos variantes: algunos con texto extraíble vía
`pdftotext -layout` (el temario 2026 usado aquí, y el programa 2006 de
Lengua Castellana), y otros como imagen escaneada con CCITT Fax (sin capa
de texto, no legibles ni con WebFetch ni con `pdftotext` — se habría
necesitado `pdftoppm`/OCR, no instalado en este entorno; se evitó ese PDF
en particular buscando una fuente alternativa con texto real en su lugar,
en vez de inventar contenido a partir de un documento no verificable).

- **Lenguaje y Comunicación, Nivel 1** (4 módulos,
  `content/epja/lenguajeNivel1.js`): Comprensión de Lectura (información
  explícita e inferencias sobre textos narrativos y no literarios: cartas,
  avisos, noticias, recetas, instrucciones, textos informativos — 10
  textos breves originales, contextos de vida adulta: trabajo, familia,
  comunidad, trámites), Sinónimos y Antónimos, Tipos de Textos
  (reconocer estructura/propósito de un texto dado, sin requerir
  producción escrita), Gramática y Ortografía (concordancia género/número,
  tildes, mayúsculas, puntuación). El eje "Escribir un texto" del temario
  real queda cubierto solo en sus partes reconocibles en opción múltiple
  (destinatario/propósito/estructura, reglas de concordancia/ortografía);
  la producción escrita real (redactar un texto propio) queda fuera del
  motor de opción múltiple, mismo criterio que excluye OA de producción
  escrita en el resto de la app.
- **Matemática, Nivel 1** (6 módulos,
  `content/epja/matematicaNivel1.js`): Números Naturales (representación en
  palabras/símbolos —incluye un `numeroALetras()` propio hasta 999—, usos
  del número como conteo/medida/ordinal/código, comparar números),
  Unidades de Medida (tiempo, masa, longitud, monetarias — equivalencias y
  elegir la unidad apropiada), Operaciones y Problemas (+,-,×,÷ con
  contextos de compras/precios en pesos chilenos y reparto en partes
  iguales), Patrones y Secuencias, Perímetro y Área (cuadrados,
  rectángulos, elementos de triángulos/cuadriláteros), Datos y Gráficos
  (gráfico de barras propio —`barChartEpjaHTML()`, mismas clases CSS
  `.bar-chart` ya usadas en `matematica.js`, sin necesitar CSS nuevo—,
  tabla de encuestas con contextos adultos: transporte, turnos de trabajo,
  motivo de retomar estudios). Cubre los 3 ejes del temario real (Números y
  Operaciones aritméticas, Geometría, Estadística y Probabilidad).
- Los ejemplos y contextos de ambas asignaturas son deliberadamente de vida
  adulta (trabajo, dinero real en pesos chilenos, trámites, comunidad) en
  vez de escolares/infantiles, siguiendo el enfoque explícito del programa
  EPJA de vincular el aprendizaje con la experiencia vital de personas
  jóvenes y adultas — distinto del resto de la app (Básica/Parvularia),
  donde los ejemplos sí son infantiles a propósito.
- **`DATOS_EPJA_ENCUESTA` ampliado de 3 a 5 ítems durante la construcción**
  (no después, a diferencia de otros años donde este bug se encontró recién
  en el fuzz-testing): con 3 ítems × 2 ramas (categoría más alta / total)
  daban solo 6 combinaciones posibles, insuficiente para `rounds:8` sin
  repetición garantizada — se detectó revisando el tamaño del banco antes
  de fuzz-testear, aplicando la lección ya documentada en años anteriores
  de Básica ("revisar el tamaño real de cada banco ANTES de dar por
  terminado un módulo").
- Verificado: los 10 generadores pasan fuzz de 300 iteraciones cada uno
  (sin `THROW`, sin `undefined`, sin opciones duplicadas, `correctValue`
  siempre presente, sin apóstrofes en `speakText`) y simulación de 200
  sesiones completas cada uno sin ningún repetido. `MC_KEYS.length ===
  Object.keys(MC_GAMES).length === 334` (324 previos + 10 nuevos, sin
  claves huérfanas). Probado visualmente en el navegador: navegación
  completa `etapaMap` (con el botón "Educación para Adultos" ya
  desbloqueado) → `epjaMap` (5 niveles, solo Nivel 1 Básica abierto) →
  `epjaSubjectMap` (2 asignaturas) → mapa de módulos de ambas asignaturas
  (sin solapamiento de nodos) → una partida completa jugada en
  "Comprensión de Lectura" (textos reales, avance correcto tras responder
  bien) y en "Datos y Gráficos" (gráfico de barras renderizando alturas
  proporcionales correctamente, botón Recurso abriendo el modal con el
  texto real). Probado también en 375px (mobile): tarjetas de nivel/
  asignatura se ven bien, sin errores de consola en ningún caso.

**Nivel 2 Básica — ✅ completo (2026-08-01), 18 módulos, 4 asignaturas
(Lenguaje y Comunicación, Matemática, Ciencias Naturales, Estudios
Sociales):** continuación directa del mismo pedido ("procede con epja"),
sin necesidad de una nueva confirmación del usuario dado el patrón de
merge automático ya establecido para este repo. Se investigó primero si
existía un "Temario Nivel 2 de Educación Básica" 2025/2026 equivalente al
usado para Nivel 1 — a diferencia de Nivel 1 (Lenguaje/Matemática ya
migrados a las nuevas Bases EPJA 2024, Decreto Supremo N°10/2022), Nivel 2
Básica **todavía se rige por el Decreto Supremo N°257 de 2009** (el
decreto anterior a la transición curricular), confirmando la naturaleza
gradual de esa transición ya anotada arriba. Se encontró un documento aún
mejor que el de Nivel 1: el "Temario Segundo Nivel de Educación Básica"
2026 (1er semestre) combina los 4 subsectores en un solo PDF con texto
real extraíble vía `pdftotext -layout` (epja.mineduc.cl, descargado con
WebFetch y procesado localmente, mismo mecanismo ya usado para Nivel 1).
- **Lenguaje y Comunicación** (4 módulos, `content/epja/lenguajeNivel2.js`):
  Comprensión de Lectura (información explícita, inferencia, aspectos
  físicos/psicológicos de personajes, secuencia de un relato, sentimientos
  de un poema), Vocabulario en Contexto (sentido de una palabra/expresión
  según pistas del contexto, reemplazo por sinónimo dentro de una
  oración), Tipos de Texto y Noticia (tipo de texto por estructura,
  elementos de una noticia —epígrafe/título/bajada/cuerpo—, emisor/
  receptor), y Hechos y Opiniones (distinguir y fundamentar). Cubre el eje
  completo de NB2 Lenguaje sin dejar ningún OA fuera (a diferencia de
  Nivel 1, este eje no tiene componente de producción escrita).
- **Matemática** (6 módulos, `content/epja/matematicaNivel2.js`):
  Múltiplos y Factores (identificar divisores/múltiplos/todos los factores
  de un número), Fracciones y Decimales (orden, suma, multiplicación,
  conversión decimal↔fracción), Operatoria y Problemas (prioridad de
  operaciones, redondeo/estimación, problemas de dinero), Perímetro y Área
  (polígonos, cuadrados/rectángulos/**triángulos** —ángulo nuevo respecto
  a Nivel 1—), Volumen de Prismas Rectos (módulo nuevo, no existía en
  Nivel 1), y Datos y Promedio (gráfico de barras + cálculo de promedio
  aritmético, ambos explícitos en el temario de NB2). Cubre los 17
  objetivos de NB2 Matemática.
- **Ciencias Naturales** (5 módulos, `content/epja/cienciasNivel2.js`,
  primera aparición de esta asignatura en EPJA): Seres Vivos y Ecosistemas
  (clasificación unicelular/pluricelular, los 5 reinos, cadenas
  alimenticias, factores bióticos/abióticos, intervención humana),
  Nutrición y Sistema Digestivo, Sistema Solar y Universo (movimientos
  planetarios, galaxias, Big Bang, estrellas), Materiales y Estados de la
  Materia (propiedades, cambios de estado, curvas de calentamiento), y
  Mezclas, Agua y Suelo (sustancias puras/mezclas, métodos de separación,
  dureza del agua, suelos, contaminación). El temario NB2 Ciencias es el
  más denso del documento combinado; ningún objetivo queda fuera.
- **Estudios Sociales** (3 módulos, `content/epja/estudiosSocialesNivel2.js`,
  también primera aparición en EPJA): Colonia e Independencia (pueblos
  originarios, organización colonial, proceso de independencia), Chile:
  Siglo XIX y XX (ciclo del salitre, crisis de 1929, voto femenino,
  Reforma Agraria, Nacionalización del cobre), y Geografía de Chile
  (posición relativa/absoluta, organización político-administrativa,
  espacios físico-naturales, riesgos naturales, distribución de la
  población). **El contenido del quiebre democrático de 1973 y el retorno
  a la democracia en 1990** (parte del mismo eje temático que agrupa
  salitre/crisis de 1929/voto femenino en el temario de NB2, dentro del
  módulo "Chile: Siglo XIX y XX") sigue, deliberadamente, el mismo criterio
  ya establecido para ese período en `historia.js`
  (`SIGLOXX_DEMOCRATIZACION_BANK`, 6° básico): solo hechos cronológicos
  indiscutibles (fechas y sucesos verificables), sin ningún juicio de
  valor, causa, consecuencia o interpretación multiperspectiva — no se
  volvió a plantear la pregunta al usuario porque el criterio ya estaba
  resuelto y documentado para este mismo período histórico.
- Contextos de vida adulta en las 4 asignaturas, mismo criterio que
  Nivel 1. Bancos revisados por tamaño ANTES del fuzz-testing (lección ya
  reforzada varias veces en el proyecto): se detectó y corrigió durante la
  autoría —no después— que `DATOS_EPJA_N2`/`PROMEDIO_EPJA_N2_BANK`
  (Matemática) solo tenían 3+4=7 combinaciones posibles para `rounds:8`;
  ampliados a 6+6=12 antes de dar el módulo por terminado.
- Verificado: los 18 generadores pasan fuzz de 300 iteraciones cada uno
  (sin `undefined`, sin opciones duplicadas, `correctValue` siempre
  presente en las opciones, sin apóstrofes en `speakText`, `recurso`
  siempre presente) y simulación de 200 sesiones completas cada uno sin
  ningún repetido. `MC_KEYS.length === Object.keys(MC_GAMES).length === 352`
  (334 previos + 18 nuevos, sin claves huérfanas). Probado visualmente en
  el navegador: navegación completa `etapaMap` → `epjaMap` (Nivel 2 Básica
  ya desbloqueado) → `epjaSubjectMap` (4 asignaturas, con su conteo de
  estrellas correcto: 0/12, 0/18, 0/15, 0/9) → mapa de módulos de las 4
  asignaturas (sin solapamiento de nodos en ninguno de los 4 mapas, de 3 a
  6 nodos cada uno) → una partida jugada en "Seres Vivos y Ecosistemas"
  (Ciencias, incluyendo el modal de Recurso) y en "Chile: Siglo XIX y XX"
  (Estudios Sociales, overlay de Carboncito con el `explain` correcto tras
  una respuesta incorrecta) → el gráfico de barras de "Datos y Promedio"
  (Matemática) renderizando alturas proporcionales correctamente. Probado
  también en 375px (mobile): mismo layout de una columna, sin errores de
  consola en ningún caso.

**Nivel 3 Básica — ✅ completo (2026-08-01), 19 módulos, 4 asignaturas
(Lenguaje y Comunicación, Matemática, Ciencias Naturales, Estudios
Sociales):** continuación directa del mismo pedido ("procede"), mismo
patrón de investigación que Nivel 2. Se confirmó que existe un "Temario
Tercer Nivel de Educación Básica" 2026 (2do semestre) equivalente al de
Nivel 2, en `epja.mineduc.cl/wp-content/uploads/sites/43/2026/06/
Temario-nivel-3-de-basica-2026_2do-semestre.pdf` — mismo Decreto Supremo
N°257 de 2009 que Nivel 2 (confirma que Nivel 3 tampoco migró todavía a
las nuevas Bases EPJA 2024), con los 4 subsectores en un solo PDF con
texto real extraíble vía `pdftotext -layout` (mismo mecanismo ya usado
para Nivel 1/2).
- **Lenguaje y Comunicación** (4 módulos, `content/epja/lenguajeNivel3.js`):
  Comprensión de Lectura, Vocabulario en Contexto, Tipos de Texto y
  Comunicación (emisor/receptor), y Hechos y Opiniones — mismo eje que
  Nivel 2 (comprensión de textos literarios/no literarios, inferencia,
  vocabulario en contexto, hechos vs. opiniones), pero el temario de NB3
  **no pide** identificar elementos estructurales de una noticia (epígrafe/
  título/bajada/cuerpo, sí presente en NB2) — el módulo de tipos de texto
  aquí es más simple que su equivalente de Nivel 2 a propósito, sin forzar
  un sub-eje que el temario no exige. Ningún objetivo de NB3 Lenguaje queda
  fuera del motor de opción múltiple (no incluye producción escrita).
- **Matemática** (6 módulos, `content/epja/matematicaNivel3.js`): Números
  Enteros (interpretación en contexto -temperatura, profundidad, haber/
  deber-, orden, operatoria), Potencias y Notación Científica, Razones,
  Porcentajes y Escala (razón, proporcionalidad directa/inversa,
  porcentaje, escala de mapas/planos, problemas de decimales), Pitágoras y
  Circunferencia (teorema y su recíproco, elementos de la circunferencia),
  Ángulos y Triángulos (ángulos entre paralelas cortadas por transversal,
  suma de ángulos interiores/exteriores), y Estadística y Tendencia
  Central (gráfico de barras, media, moda, mediana). Cubre los 18
  objetivos de NB3 Matemática sin dejar ninguno fuera.
- **Ciencias Naturales** (6 módulos, `content/epja/cienciasNivel3.js`, el
  subsector más denso del temario con 24 objetivos): Modelo Cinético y
  Materia, Átomos y Reacciones Químicas (Dalton, Lavoisier, velocidad de
  reacción, exotérmica/endotérmica), Energía y Transformaciones (formas,
  ley de conservación, dispositivos cotidianos), Origen de la Vida y
  Genética (evolución, fósiles, ADN/genoma, reproducción asexual/sexual,
  la célula y los gametos), **Reproducción y Sexualidad Responsable**
  (estructura/función de los sistemas reproductores, concepción,
  desarrollo embrionario, lactancia, métodos de control de la natalidad,
  paternidad/maternidad responsable, factores biológicos/psicológicos/
  sociales/valóricos de la sexualidad humana — mismo tono clínico/factual
  ya establecido en `ciencias.js` para `genSexualidadReproduccion7Round`
  -7° básico-, sin detalle gráfico ni juicio de valor, siempre remitiendo a
  un profesional de la salud ante cualquier duda; al ser EPJA educación
  para personas MAYORES DE 18 AÑOS, este módulo trata los métodos de
  control de la natalidad con más detalle factual que su equivalente
  escolar, ya que el propio temario oficial de Nivel 3 lo exige
  explícitamente para población adulta), y Sistema Inmune y Enfermedades
  (barreras del organismo, origen de enfermedades, vida saludable,
  patógenos y prevención). Cubre los 24 objetivos de NB3 Ciencias sin
  dejar ninguno fuera.
- **Estudios Sociales** (3 módulos, `content/epja/estudiosSocialesNivel3.js`):
  Historia y Economía Mundial del Siglo XX (guerras mundiales, Guerra
  Fría, interconectividad global, comercio mundial e inserción de Chile,
  problemas globales, conceptos de oferta/demanda/mercado), El Trabajo en
  Chile (industrialización, terciarización, inserción de las mujeres,
  impacto tecnológico, empleo formal/informal), y Democracia, Derechos
  Humanos y Estado (dimensiones de los DD.HH., la Constitución y tratados,
  sistemas democráticos vs. dictatoriales/totalitarios, mecanismos de
  elección, soberanía, poderes del Estado). **A diferencia de Nivel 2**
  (cuyo eje de historia de Chile sí exigía tratar el quiebre democrático de
  1973 y el retorno a la democracia en 1990, con el mismo criterio de solo
  hechos cronológicos ya usado en `historia.js`), el objetivo de NB3 sobre
  sistemas democráticos vs. dictatoriales/totalitarios es puramente
  conceptual y comparativo (definiciones generales, sin pedir ubicar
  temporalmente un período específico de la historia de Chile) — no se
  activó esa misma política de contenido sensible porque el propio temario
  no pide ese análisis histórico puntual en este nivel. Cubre los 16
  objetivos de NB3 Estudios Sociales sin dejar ninguno fuera.
- Contextos de vida adulta en las 4 asignaturas, mismo criterio que Nivel
  1/2. Bug de bank-size encontrado por el fuzz-testing (no detectado
  proactivamente esta vez, a diferencia de otros bancos de este mismo PR
  que sí se revisaron por tamaño antes de darlos por terminados):
  `TRABAJO_CHILE_N3_BANK` (Estudios Sociales) tenía exactamente 7 ítems
  para `rounds:8` — 200/200 sesiones simuladas con repetición garantizada.
  Ampliado a 10 ítems (margen de 2) con contenido real dentro del mismo
  bloque temático ya citado.
- Verificado: los 19 generadores pasan fuzz de 300 iteraciones cada uno
  (sin `undefined`, sin opciones duplicadas fuera de las ramas binarias/
  ternarias intencionales -hechos/opiniones, sí/no de Pitágoras recíproco,
  flota/se hunde, gráfico de barras con 3 categorías-, `correctValue`
  siempre presente en las opciones, sin apóstrofes en `speakText`,
  `recurso` siempre presente) y simulación de 200 sesiones completas cada
  uno sin ningún repetido (tras el fix de `TRABAJO_CHILE_N3_BANK`).
  `MC_KEYS.length === Object.keys(MC_GAMES).length === 371` (352 previos +
  19 nuevos, sin claves huérfanas). Probado visualmente en el navegador:
  navegación completa `etapaMap` → `epjaMap` (Nivel 3 Básica ya
  desbloqueado) → `epjaSubjectMap` (4 asignaturas, con su conteo de
  estrellas correcto: 0/12, 0/18, 0/18, 0/9) → mapa de módulos de las 4
  asignaturas (sin solapamiento de nodos ni etiquetas truncadas en ninguno
  de los 4 mapas, de 3 a 6 nodos cada uno) → una partida jugada en "El
  Trabajo en Chile" (Estudios Sociales, overlay de Carboncito con el
  `explain` correcto tras una respuesta incorrecta, y el modal de Recurso
  abriendo con el texto real), una ronda en "Estadística y Tendencia
  Central" (Matemática, gráfico de barras renderizando alturas
  proporcionales correctamente, avance correcto tras responder bien), y
  una ronda en "Reproducción y Sexualidad Responsable" (Ciencias,
  confirmando visualmente el tono clínico/factual). Probado también en
  375px (mobile), sin errores de consola en ningún caso.

**Nivel 1 Media — ✅ completo (2026-08-01), 25 módulos, 5 asignaturas
(Lenguaje y Comunicación, Matemática, Ciencias Naturales, Estudios
Sociales, Inglés):** continuación directa del mismo pedido ("procede") tras
completar Nivel 3 Básica. Nivel 1 Media es el primer nivel de EPJA
construido con 5 subsectores en vez de 4 — agrega **Idioma Extranjero
Inglés**, primera vez que EPJA incluye esta asignatura (Nivel 1/2/3 Básica
no la tienen porque el temario de Básica no la lista). Fuente real: "Temario
Primer Nivel de Educación Media — Proceso de exámenes de Validación de
Estudios Adultos (mayores de 18 años)", **Decreto Supremo N°257 de 2009**
(epja.mineduc.cl/wp-content/uploads/sites/43/2026/02/
Temario-nivel-1-de-media-2026_1er-semestre-vf.pdf, extraído vía WebFetch +
`pdftotext -layout`, mismo mecanismo ya usado para Nivel 2/3 Básica) —
confirma que Educación Media EPJA sigue con el decreto anterior, igual que
Nivel 2/3 Básica, y que la transición a las nuevas Bases EPJA 2024 sigue sin
alcanzar Media.
- **Lenguaje y Comunicación** (4 módulos, `content/epja/lenguajeMedia1.js`):
  Comprensión de Lectura (información explícita, inferencia de sentido
  global, aspectos físicos Y psicológicos de personajes — un nivel de
  exigencia mayor que Básica), Vocabulario en Contexto (sentido de palabra/
  expresión, sinónimos), Textos Expositivos y Discurso (estructura
  introducción/desarrollo/conclusión, formas del discurso -descripción/
  definición/caracterización-, función de recursos no verbales), y Hechos,
  Opiniones y Argumentación (distinguir, fundamentar con información del
  texto, fundamentar el tipo de mundo literario -realista/fantástico-,
  ángulo nuevo que ningún nivel de Básica había cubierto). Cubre el eje
  completo del temario (no incluye producción escrita).
- **Matemática** (8 módulos, `content/epja/matematicaMedia1.js`, el más denso
  de EPJA hasta ahora): Números Enteros y Racionales, Potencias e
  Irracionales (potencias de exponente entero, propiedades de multiplicación/
  división de igual base, aproximación de irracionales entre enteros
  consecutivos), Proporcionalidad y Porcentajes (razón, directa/inversa/
  porcentual), Álgebra (traducir lenguaje algebraico, reducir términos
  semejantes, productos notables), Funciones y Ecuaciones (lineal vs. afín,
  ecuaciones de primer grado, evaluar una función), Geometría: Ángulos y
  Semejanza (clasificar ángulos, posición de rectas, escala),
  Transformaciones y Medición (traslación/reflexión/rotación, perímetro/
  área/volumen), y Estadística y Probabilidad (media/moda/mediana,
  probabilidad de Laplace). A diferencia de Nivel 2/3 Básica (mezcla de
  bancos estáticos y generadores dinámicos), este archivo prioriza
  **generación dinámica** en casi todos los módulos (valores al azar
  calculados en cada ronda, siguiendo la convención ya establecida del
  proyecto de preferir contenido dinámico sobre bancos estáticos) — solo los
  conceptos puramente clasificatorios (proporcionalidad directa/inversa,
  transformaciones isométricas, Teorema de Thales) usan un banco curado de
  escenarios. Cubre el eje completo del temario.
- **Ciencias Naturales** (6 módulos, `content/epja/cienciasMedia1.js`): La
  Célula y su Metabolismo, Sistemas de Nutrición y Salud (biológicas);
  Movimiento, Ondas y Óptica, Energía, Trabajo y Calor (físicas); y
  Disoluciones y Reacciones Químicas (agrupa concentración/ácido-base/redox/
  velocidad de reacción/combustión en un solo módulo, ya que el temario los
  presenta como un bloque temático relacionado); más Ecosistemas y
  Biodiversidad (biológicas). Cubre las 3 áreas completas del temario
  (Biológicas, Físicas, Químicas).
- **Estudios Sociales** (4 módulos, `content/epja/estudiosSocialesMedia1.js`):
  Colonia e Independencia, Chile en el Siglo XIX (consolidación territorial:
  Guerra del Pacífico, Araucanía, Antártica, transición económica del
  salitre a la crisis de 1929), Chile en el Siglo XX: Hacia la Democracia, y
  Ciudadanía, Derechos y Participación. El módulo del Siglo XX incluye el
  objetivo del temario "Explica el proceso de quiebre de la democracia... la
  transición a la democracia" — un texto más detallado que el de Nivel 2
  Básica (que solo pedía "ubicar temporalmente" el período). Se aplicó el
  MISMO criterio ya establecido en `historia.js`
  (`SIGLOXX_DEMOCRATIZACION_BANK`, 6° básico) y en
  `estudiosSocialesNivel2.js`: solo hechos cronológicos indiscutibles y
  transformaciones ampliamente documentadas de forma neutral (cambio del
  modelo económico, fecha del golpe de 1973, del plebiscito de 1988, del
  retorno a un gobierno electo en 1990), sin ningún juicio de valor, causa,
  consecuencia ni interpretación multiperspectiva — no fue necesario
  replantear esta política al usuario, ya estaba resuelta y documentada
  para este mismo período histórico en sesiones anteriores.
- **Inglés** (3 módulos, `content/epja/inglesMedia1.js`, **primera vez que
  EPJA incluye esta asignatura**): Gramática en Contexto (los elementos
  morfosintácticos que lista el temario -verbo "to be", there is/are,
  comparativos/superlativos, imperativos, wh-questions, adverbios de
  frecuencia, preposiciones de lugar, cuantificadores how much/how many-,
  siempre dentro de una oración completa, nunca como regla aislada),
  Vocabulario y Textos Funcionales (vocabulario de los textos tipo que lista
  el temario: manuales, catálogos, herramientas, recetas, folletos —
  contextos de trabajo/procesos productivos en vez de escolares), y
  Comprensión de Lectura (las 3 habilidades del temario: identificar,
  inferir/interpretar, reflexionar, con textos instructivos/narrativos/
  descriptivos). Mismo mecanismo ya usado desde 5° básico en
  `content/ingles.js`: `speakLang:'en'` en cada ronda para que `speak()`
  busque una voz en inglés; `recurso` siempre en español (explicación
  pedagógica, no el contenido del ítem en sí).
- **Bugs de bank-size encontrados por la simulación de no-repetición (no
  proactivamente esta vez):** `textosExpositivosEpjaM1` (Lenguaje),
  `celulaMetabolismoEpjaM1` y `sistemasNutricionEpjaM1` (Ciencias), y
  `movimientoOndasOpticaEpjaM1` (Ciencias) tenían exactamente 7 ítems para
  `rounds:8` — 200/200 sesiones simuladas con repetición garantizada en los
  4. Corregidos ampliando cada banco con contenido real dentro del mismo eje
  ya citado (nunca inventando un objetivo nuevo) hasta llegar a 9 ítems cada
  uno (margen de 1). **Lección técnica reforzada durante la verificación:**
  tras editar los archivos de contenido tras el primer fuzz-test, una
  segunda corrida del mismo test en la misma pestaña del navegador siguió
  reportando el bug ya corregido — causa: el registro de módulos ES cachea
  cada especificador de import por URL exacta dentro de la misma página,
  así que reimportar `mcEngine.js` con un query string nuevo (`?v=...`)
  crea un módulo nuevo para `mcEngine.js` en sí, pero sus imports internos
  de los archivos de contenido (sin query string) siguen resolviendo al
  registro ya cacheado de una carga anterior. Se resolvió con una recarga
  completa de la página (`navigate` de nuevo a la misma URL) antes de
  repetir la verificación — lección para sesiones futuras: si se edita un
  archivo de contenido a mitad de una sesión de fuzz-testing en el
  navegador, recargar la página completa antes de re-verificar, no solo
  reimportar con un query string distinto.
- **Corrección de contenido menor encontrada de paso:** el subtítulo de la
  tarjeta "Educación para Adultos" en `etapaMap` (`render.js`) decía
  literalmente "EPJA · Nivel 1 Básica disponible", un texto que quedó
  desactualizado desde que se agregaron Nivel 2 y 3 Básica en sesiones
  anteriores sin nunca haberlo actualizado. Corregido a "EPJA · Básica y 1°
  Medio disponibles".
- Verificado: los 25 generadores nuevos pasan fuzz de 300 iteraciones cada
  uno (sin `THROW`, sin `undefined`, sin opciones duplicadas, `correctValue`
  siempre presente en las opciones, sin apóstrofes en `speakText`, `recurso`
  y `explain` siempre presentes) y simulación de 200 sesiones completas cada
  uno sin ningún repetido (tras el fix de los 4 bancos). `MC_KEYS.length ===
  Object.keys(MC_GAMES).length === 396` (371 previos + 25 nuevos, sin claves
  huérfanas). Probado visualmente en el navegador: navegación completa
  `etapaMap` → `epjaMap` (Nivel 1 Media ya desbloqueado) → `epjaSubjectMap`
  (5 asignaturas, con su conteo de estrellas correcto: 0/12, 0/24, 0/18,
  0/12, 0/9) → mapa de módulos de las 5 asignaturas (sin solapamiento de
  nodos, ancho de etiqueta siempre ≤170px en los 5 mapas, de 3 a 8 nodos
  cada uno) → una partida jugada en "Números Enteros y Racionales"
  (Matemática, resolvió correctamente "-15 − (3) + 6 = -12", modal de
  Recurso abriendo con el texto real, avance correcto y subida de nivel tras
  responder bien) y una ronda en "Gramática en Contexto" (Inglés,
  `speakLang:'en'` confirmado). Probado también en 375px (mobile), sin
  errores de consola en ningún caso.

**Nivel 2 Media — ✅ completo (2026-08-01), 24 módulos, 5 asignaturas
(Lenguaje y Comunicación, Matemática, Ciencias Naturales, Estudios Sociales,
Inglés):** pedido implícito ("continua") de seguir el plan ya documentado en
esta misma sección tras completar Nivel 1 Media — con esto **EPJA queda
100% completo, los 5 niveles construidos**. Fuente real: "Temario Segundo
Nivel de Educación Media", Decreto Supremo N°257 de 2009
(epja.mineduc.cl/wp-content/uploads/sites/43/2026/02/
Temario-nivel-2-de-media-2026_1er-y-2do-semestre-vf.pdf, encontrado vía
WebSearch, extraído con `curl` + `pdftotext -layout`, mismo mecanismo ya
usado en toda la etapa) — mismo decreto que Nivel 1 Media, confirmando que
Educación Media EPJA completa sigue sin migrar a las nuevas Bases EPJA 2024.
- **Lenguaje y Comunicación** (4 módulos, `content/epja/lenguajeMedia2.js`):
  Comprensión de Lectura (información explícita, inferencia de sentido
  global e información, tipo de texto, aspectos físicos y psicológicos de
  personajes), Vocabulario en Contexto (sentido/significado de palabra o
  expresión según contexto, sinónimos), Texto Argumentativo (estructura
  tesis/argumentos/contraargumentos/conclusión, función de cada componente —
  ángulo enteramente nuevo que ningún nivel EPJA anterior había cubierto), y
  Hechos, Opiniones y Comunicación (distinguir hechos de opiniones, función
  de recursos verbales/no verbales, relacionar el tema con la realidad
  contemporánea). Ningún objetivo del eje queda fuera del motor de opción
  múltiple.
- **Educación Matemática** (6 módulos, `content/epja/matematicaMedia2.js`,
  el eje más avanzado de todo EPJA hasta ahora): Raíces Cuadradas (raíz
  cuadrada como proceso inverso de la potencia de exponente 2, propiedad de
  la raíz de un producto, problemas de modelamiento), Funciones Exponencial
  y Logarítmica (evaluar, clasificar), Función Cuadrática y Ecuaciones
  (resolver una ecuación de segundo grado construida a partir de dos raíces
  enteras elegidas al azar —garantiza que siempre factorice limpio, sin
  soluciones irracionales ambiguas—, evaluar una función cuadrática),
  Trigonometría (razones seno/coseno/tangente sobre ternas pitagóricas
  reales para que los catetos/hipotenusa den siempre valores enteros,
  problema de altura inaccesible), Estadística: Tablas y Muestras
  (interpretar una tabla de frecuencia con datos agrupados en intervalos,
  caracterizar una población a partir de una muestra representativa), y
  Probabilidad (condicional, suma de mutuamente excluyentes, producto de
  independientes — las 3 fracciones siempre simplificadas con un `gcd()`
  local, mismo patrón ya usado en `matematicaMedia1.js`). Mismo criterio que
  Nivel 1 Media: generadores mayormente dinámicos con valores elegidos a
  propósito (cuadrados perfectos, ternas pitagóricas, raíces enteras) para
  que el resultado sea siempre exacto y sin ambigüedad por redondeo. Cubre
  el eje completo del temario.
- **Ciencias Naturales** (7 módulos, `content/epja/cienciasMedia2.js`, un
  módulo más que Nivel 1 Media dado que el temario de NM2 es más denso):
  Homeostasis y Sistemas del Cuerpo, Sistema Inmune y Genética (Biológicas:
  sistemas nervioso/endocrino/renal y su rol en la homeostasis, sistema
  inmunológico, información genética y reproducción celular — cromosoma,
  gen, ADN, mitosis, meiosis); Fluidos y Presión, Electricidad y Magnetismo
  (Físicas: presión/presión hidrostática/empuje/presión atmosférica;
  carga/campo/corriente/potencial/resistencia/circuitos y sus componentes
  —conductores, aisladores, fusibles, conexión a tierra, interruptores—;
  imanes/campo/inducción); y Evolución y Modelos Atómicos, Enlaces Químicos
  y Radiactividad, Química Orgánica y Polímeros (Químicas: teorías de
  evolución de las especies y modelos atómicos —el temario oficial agrupa
  ambos bajo el mismo encabezado "Ciencias Químicas", agrupación preservada
  tal como aparece en el documento fuente—, tipos de enlaces químicos,
  fenómenos radiactivos y tabla periódica, moléculas orgánicas/grupos
  funcionales/polímeros sintéticos y naturales). Ningún eje del temario
  queda fuera.
- **Estudios Sociales** (4 módulos, `content/epja/estudiosSocialesMedia2.js`):
  Siglo XX: Guerra y Bipolaridad (Segunda Guerra Mundial, sistema bipolar y
  Guerra Fría, descolonización, la ONU, caída de los socialismos reales y
  sistema unipolar), Globalización y Economía Mundial (interconectividad
  tecnológica, rol de medios/transporte, internacionalización de las
  economías, tratados de libre comercio, conceptos básicos de economía,
  características del empleo global, comparación de sistemas económicos:
  esclavitud/economía feudal/socialismo/capitalismo de mercado), Problemas
  Globales Contemporáneos (pobreza y hambre, deterioro medioambiental,
  pandemias), y Población y Territorio (volumen/distribución poblacional,
  migraciones, envejecimiento, asentamientos urbanos/rurales en Chile,
  éxodo rural, problemas de expansión de ciudades latinoamericanas, relación
  entre medio natural y actividades productivas). **A diferencia de Nivel 1
  Media** (historia de Chile, que sí aplicó la política de contenido
  sensible ya establecida para el período 1973-1990), el eje de NM2 es
  historia UNIVERSAL y economía global del siglo XX/XXI — no fue necesario
  aplicar esa política aquí porque el temario no pide analizar ese período
  específico de la historia de Chile, sino procesos y conceptos de historia
  mundial. Cubre el eje completo del temario.
- **Idioma Extranjero Inglés** (3 módulos, `content/epja/inglesMedia2.js`):
  Gramática en Contexto (presente perfecto, voz pasiva, verbos modales,
  conectores avanzados como however/therefore/although — más avanzado que
  el temario de Nivel 1 Media), Vocabulario y Textos Técnicos (adjetivos
  técnicos —useful/valuable/wireless/feasible/time consuming/capable—,
  vocabulario de textos de seguridad laboral e instrumentos), y Comprensión
  de Lectura (las mismas 3 habilidades del temario —identificar, inferir e
  interpretar, reflexionar— aplicadas a textos más complejos que NM1: una
  noticia sobre nueva fábrica, un aviso de seguridad eléctrica, un reporte
  de energías renovables). Mismo mecanismo `speakLang:'en'` + `recurso` en
  español ya usado desde 5° básico.
- **Lección aplicada proactivamente esta vez (no encontrada por el
  fuzz-test, sino evitada desde la autoría):** todos los 24 bancos se
  escribieron desde el principio con 9-12 ítems para `rounds:8-10` (margen
  de al menos 1-2), en vez del patrón de escribir exactamente `rounds`
  ítems y descubrir el bug de repetición recién en la simulación — la
  lección ya reforzada varias veces a lo largo de todo EPJA. Único ajuste
  necesario: `comprensionInglesEpjaM2` se escribió inicialmente con
  exactamente 8 ítems para `rounds:8` (sin margen) — detectado por revisión
  propia antes de fuzz-testear, no por el test, y corregido a 10 ítems
  agregando 2 casos reales (una enfermera cuidadosa, un programa de
  reciclaje) antes de dar el módulo por terminado.
- Verificado: los 24 generadores pasan fuzz de 300 iteraciones cada uno (sin
  `THROW`, sin `undefined`, sin opciones duplicadas, `correctValue` siempre
  presente en las opciones, sin apóstrofes en `speakText`, `recurso` y
  `explain` siempre presentes) y simulación de 200 sesiones completas cada
  uno sin ningún repetido — ningún banco necesitó ampliación posterior, a
  diferencia de todos los niveles EPJA anteriores. `MC_KEYS.length ===
  Object.keys(MC_GAMES).length === 420` (396 previos + 24 nuevos, sin claves
  huérfanas). Probado visualmente en el navegador: navegación completa
  `etapaMap` (subtítulo actualizado a "EPJA · Todos los niveles disponibles")
  → `epjaMap` (Nivel 2 Media ya desbloqueado, los 5 niveles abiertos) →
  `epjaSubjectMap` (5 asignaturas, con su conteo de estrellas correcto:
  0/12, 0/18, 0/21, 0/12, 0/9) → mapa de módulos de las 5 asignaturas (sin
  solapamiento de nodos, ancho de etiqueta siempre ≤170px, de 3 a 7 nodos
  cada uno — el módulo de Ciencias con 7 nodos, uno más que el resto de
  EPJA, no presentó problemas de layout) → una partida jugada en "Raíces
  Cuadradas" (Matemática, resolvió correctamente raíz de 25 × raíz de 9 =
  15, avance correcto de 1/8 a 2/8, modal de Recurso abriendo con el texto
  real) y una ronda en "Gramática en Contexto" (Inglés, oración con hueco
  "She ___ finished the safety training this week." y speakLang:'en'
  confirmado). Sin errores de consola en ningún caso.

**Con esto, EPJA queda 100% completo: los 5 niveles (Nivel 1/2/3 Básica,
Nivel 1/2 Media) están construidos y jugables.** Próximo paso posible:
Educación Media regular (no EPJA) sigue sin construir — requiere que el
usuario confirme primero la lista real de asignaturas (probablemente
distinta a Básica: Física/Química/Biología separadas, Filosofía, etc.) y el
decreto curricular vigente, ver sección "### Educación Media" más abajo.

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
   separadas, Filosofía, etc. — pedir la lista real antes de asumir).
   EPJA (currículum propio, organizado por niveles que agrupan varios
   años en uno) ya está 100% completo — ver "### EPJA" arriba.
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
  - **Segundo intento (también revertido, tras feedback directo del
    usuario con capturas de pantalla):** se quitó la altura fija de
    `.node` y el `min-height` de `.node-label`, dejando
    `-webkit-line-clamp:2` como único límite (un TOPE máximo). Esto
    eliminaba el solapamiento (13 de 14 datasets limpios), pero el usuario
    señaló —con capturas reales— que varios títulos quedaban CORTADOS con
    "…" a mitad de palabra ("Gases Arterial…" en vez de "Gases Arteriales
    y..."): pidió explícitamente **no truncar texto**, solo evitar la
    deformación. `line-clamp` por definición trunca, así que no cumplía
    ese requisito aunque resolviera el solapamiento.
  - **Fix definitivo (sin truncar nada):** se midió con un elemento de
    prueba (mismos estilos que `.node-label`, esperando `document.fonts.
    ready`) el largo real de los **320 títulos únicos de módulo de toda la
    app** a distintos anchos — a 170px máximo, ninguno supera 2 líneas
    (antes, a 128px, "Líquidos Biológicos: Transudado vs Exudado"
    necesitaba 3). Se subió `.node-label` de 128px a 170px de ancho máximo
    y se quitó `-webkit-line-clamp` por completo (el título siempre se ve
    entero, nunca se corta). **Bug adicional encontrado al verificar en
    vivo** (no solo por cálculo): pese al `max-width:170px`, la etiqueta
    renderizaba a solo ~80px de ancho real — un comportamiento de flexbox
    donde un hijo flex sin `width` explícito calcula su "fit-content"
    contra el ancho del CONTENEDOR (`.node`, 92px) en vez de su propio
    contenido, dejándola atrapada muy por debajo de su `max-width` y
    forzando líneas de más otra vez. Se probó `flex-shrink:0` y
    `align-self` en vivo (sin efecto) hasta encontrar que `width:
    max-content` sí lo resuelve — la etiqueta ahora usa su ancho natural
    de contenido (compacta si el título es corto) topado en 170px (si es
    largo), igual que el `max-width` siempre debió comportarse.
    `.node{height:150px}` fijo (74 círculo + 6 gap + 40 label de 2 líneas
    + 6 gap + 13 estrellas, con margen) — esta vez el peor caso real de la
    app son 2 líneas SIEMPRE (nunca 3), así que una altura fija ya no
    corre el riesgo de inflar nodos de más como en el primer intento. De
    los 86 datasets de mapa de la app, solo 6 tenían un espaciado vertical
    insuficiente para 150px (Lenguaje 3°, Matemática 5°-6°, Ciencias 2°, y
    2 núcleos de Parvularia) — se les subió el campo `height` en
    `js/gradeContent.js` (480→510, 760→840 ×2, 480→490, 480→490, 420→450),
    el único cambio que sí tocó archivos de contenido, y solo el número,
    nunca las coordenadas `%` de cada nodo.
  - **Verificación final, la más exhaustiva de las tres rondas:** no solo
    cálculo geométrico — se navegó y renderizó (`render()` real) las 86
    pantallas de mapa de toda la app (77 combinaciones año×asignatura + 8
    núcleos de Parvularia + Química Diagnóstica + el mapa de años) y se
    midió con `getBoundingClientRect()` cada nodo: **0 solapamientos, 0
    títulos truncados, ancho de etiqueta siempre ≤170px, en las 86**.
    Probado también visualmente en 320px/375px (los anchos de celular más
    angostos) confirmando 0 colisiones horizontales entre columnas del
    zigzag incluso en el caso más extremo.
  - **Lección para fixes de CSS futuros que afecten un componente
    reutilizado en muchos datasets/pantallas (reforzada tras 3 rondas de
    intentos en el mismo bug):** (1) verificar SIEMPRE contra una muestra
    representativa de TODOS los usos del componente, no solo el caso
    puntual reportado — un fix puede arreglar el caso visible y romper
    silenciosamente otros que antes funcionaban bien; (2) si el pedido del
    usuario dice explícitamente "no cortar texto", cualquier solución
    basada en truncamiento (`line-clamp`, `text-overflow:ellipsis`) está
    descartada de entrada, sin importar cuán bien resuelva el resto del
    problema; (3) medir con elementos de prueba en el navegador ANTES de
    asumir un ancho/alto — un cálculo geométrico de escritorio (`Δy% ×
    height`) puede ser correcto y aun así esconder un bug de layout real
    (el flex item atrapado en el ancho del contenedor) que solo aparece
    verificando el DOM renderizado de verdad, no solo las coordenadas.
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

Verificado en el navegador tras el fix definitivo (tercera y última ronda,
sin truncar texto): se navegó y renderizó con `render()` real cada una de
las **86 pantallas de mapa de toda la app** (las 77 combinaciones
año×asignatura de Educación Básica, los 8 núcleos de Parvularia, Química
Diagnóstica, y el mapa de años) y se midió cada nodo con
`getBoundingClientRect()` — **0 solapamientos, 0 títulos truncados, ancho de
etiqueta siempre ≤170px, en las 86 pantallas**, sin errores de consola.
Probado visualmente en 320px/375px/1440px. Solo 6 de esos 86 datasets
necesitaron subir su campo `height` en `js/gradeContent.js` (nunca las
coordenadas `%`); el resto del fix es CSS puro en `styles.css`. `#app` mide
1200px a 1440px de viewport (antes 980px, auditoría previa de esta misma
sesión).

**Bug real de seguimiento, reportado por el usuario con captura de pantalla
(2026-08-09): el nodo 1 tapaba el título de la pantalla.** En "Lenguaje
Verbal" (núcleo NT), el círculo del nodo 1 quedaba literalmente encima de la
"a" del título "Lenguaje Verbal" — no era una deformación de nodo (lo que
cubrió la auditoría de arriba) sino el nodo desbordándose HACIA ARRIBA del
`.map-wrap`, sobre el título de la pantalla. Causa raíz: `.node` mide 150px
de alto fijo (la altura fija introducida en la auditoría de arriba) y se
centra verticalmente con `transform:translate(-50%,-50%)` sobre su
`top:X%` — necesita ≥75px de espacio libre arriba de su punto de anclaje
para no desbordar por encima de `.map-wrap`, pero `.map-wrap` solo tenía
`margin-top:6px`. El primer nodo de casi todos los mapas de la app está
posicionado muy cerca del borde superior (coordenadas `y` altas, ~90-96, a
propósito, para que quede pegado al título) — así que esto **no era un
problema puntual de un núcleo**: se midió con `getBoundingClientRect()` en
un muestreo de 97 pantallas de mapa de toda la app (los 8 núcleos NT,
Educación Básica 1°/3°/6°/8° en las 9 asignaturas, los 5 niveles de EPJA,
Educación Media 1°/2°, Plan General/Diferenciado de 3°-4° medio, y los 2
submódulos de Estudio para Pruebas) y el solapamiento real iba de ~17px
hasta 34.4px (el peor caso: "Ciencias" 6° básico) — el mismo bug en
prácticamente cualquier mapa de módulos de la app, solo que la mayoría de
las veces pasaba desapercibido porque el título ocupa 2 líneas y el
solapamiento cae sobre espacio en blanco en vez de sobre una letra visible
(el caso de "Lenguaje Verbal"/"Ciencias"/"Historia", títulos de 1 sola
línea, es donde se nota). **Fix:** se subió `.map-wrap{margin-top}` de 6px
a 56px — cubre el peor caso medido (34.4px) con ~15px de margen de sobra,
sin tocar ninguna coordenada `%` ni el campo `height` de ningún dataset
(mismo criterio que la auditoría de arriba: ajuste mínimo y quirúrgico, no
un rediseño del sistema de mapa). Verificado tras el cambio: se repitió la
misma medición programática en las mismas 97 pantallas — **0 solapamientos
en las 97**, el peor caso ahora tiene ~15.6px de espacio libre en vez de
-34.4px de superposición. Probado visualmente en "Lenguaje Verbal" (NT,
375px): el título "Lenguaje Verbal" se lee completo, con espacio de sobra
antes del nodo 1.

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
- **Acento de color en `.option-btn.panel` (2026-07-27, pedido explícito del usuario):**
  al comparar visualmente un módulo de "grilla de letras/palabras cortas" (`.option-btn`
  base: Baloo 2, peso 800, centrado, ej. Vocales) contra uno de "panel de oraciones
  largas" (`.option-btn.panel`: Quicksand, peso liviano, izquierda, ej. Buena
  Convivencia II o Química Diagnóstica/Microbiología Clínica), el usuario notó que
  ambos estilos —aunque intencionales según el largo del texto, ver el comentario
  extenso ya existente sobre `.option-btn.panel` en `styles.css`— se sentían como dos
  apps distintas en vez de una sola con dos layouts. Se descartó acercar peso/tamaño
  tipográfico entre ambos (arriesgaría reintroducir el "grito visual" que la auditoría
  de 2026-07-26 corrigió a propósito para los casos clínicos de Estudio para Pruebas);
  en su lugar se agregó un borde de acento de 6px a la izquierda en `.option-btn.panel`
  usando `var(--primary)` (el mismo teal que ya usa el resto de la app: progreso,
  botón Escuchar, mascota), con variantes `.correct`/`.wrong` que cambian ese acento a
  verde/rojo igual que el resto del sistema de feedback. Sube además el peso de 600 a
  700 (Quicksand sigue siendo mucho más liviano que los 800 de Baloo 2 de la grilla,
  no reintroduce el problema original). Verificado visualmente en 3 contextos: Vocales
  (grilla, sin cambios), Buena Convivencia II (panel, currículo infantil) y
  Staphylococcus (panel, Estudio para Pruebas) — en los tres el `.option-btn` base
  queda intacto y el panel se ve con más "pertenencia" a la identidad visual de la
  app sin volver a competir con la pregunta.
- **`.option-grid` de CSS Grid a Flexbox: última fila huérfana sin centrar
  (2026-07-27, encontrado en una captura real de Vocales):** `.option-grid` usaba
  `display:grid` con columnas fijas (`repeat(2,1fr)` por defecto, `repeat(3,1fr)` a
  ≥1280px vía `.option-grid:not(.panels)`). Cuando el banco de un módulo entrega un
  número de opciones que no es múltiplo exacto del número de columnas (ej. Vocales
  con 5 alternativas O/U/A/E/I a 3 columnas: 3 en la fila 1, 2 en la fila 2), CSS Grid
  deja la última fila incompleta pegada a la izquierda en vez de centrada — un hueco
  visible a la derecha, visto literalmente en la captura que el usuario compartió.
  Se confirmó primero (vía `grep` en `js/`) que ningún código depende de la posición
  de columna específica de un botón — `mcEngine.js` solo usa un switch binario
  (`r.cols === 2 ? 'option-grid panels' : 'option-grid'`) para elegir entre grilla
  multi-columna y panel de una columna, nunca un número de columna exacto — así que
  convertir el mecanismo interno era seguro. Se cambió `.option-grid` de
  `display:grid` a `display:flex; flex-wrap:wrap; justify-content:center` con
  `flex-basis`/`max-width` por botón (`calc(50% - 6px)` por defecto, `calc(33.333% -
  8px)` a ≥1280px vía `.option-grid:not(.panels) .option-btn`, `100%` para
  `.option-grid.panels .option-btn`) — matemáticamente equivalente al ancho de
  columna que ya daba `grid-template-columns`, pero con `justify-content:center`
  centrando cualquier fila incompleta en vez de dejarla a la izquierda. Verificado en
  el navegador: Vocales a 1400px (fila huérfana de 2 opciones ahora centrada bajo la
  fila de 3, con los 5 botones midiendo exactamente 378.65625px de ancho cada uno) y
  a 375px/mobile (grilla base de 2 columnas, la 5ª opción centrada sola en su propia
  fila); un módulo `.panels` (Buena Convivencia II) sin cambios visuales — sigue en
  una sola columna a ancho completo con su acento de color intacto; y un módulo de 4
  opciones exactas (Contar, 1° básico) sin cambios de layout. Sin errores de consola
  en ninguno de los 4 casos probados.
- **Auditoría "Química Diagnóstica como referencia visual" + eliminación de
  `<br>` de maquetación (2026-07-27, pedido explícito del usuario):** el
  usuario pidió confirmar que el stack sigue siendo 100% vanilla (confirmado:
  sin framework, sin build step, sin cambios necesarios ahí) y homologar el
  resto de la app contra el sistema visual ya usado en Química Diagnóstica
  (tipografías, tamaños, sombras, radios, colores, variantes de botón/
  tarjeta — sin crear ninguno nuevo), además de eliminar cualquier `<br>`
  usado para maquetación visual en vez de HTML semántico/CSS. Se auditaron
  las 998 líneas de `styles.css` completas: todos los componentes ya usan
  las variables compartidas (`--radius-lg/md/sm`, `--shadow`/`--shadow-sm`,
  `--font-display`/`--font-body`, la paleta de `:root`) — las sesiones
  anteriores (acento de color en `.option-btn.panel`, flexbox de
  `.option-grid`, tamaño de `.node-label`) ya habían resuelto la
  homologación real, así que no se encontró ningún color/sombra/radio/
  tipografía nueva que revertir. Sí se encontraron 2 hallazgos reales:
  - **`--font-script: 'Playwrite CL', cursive;`** en `:root` era una variable
    CSS muerta — nunca se lee en ningún archivo (`traza.js` define
    `TYPO_STYLES` con la familia `'"Playwrite ES", cursive'` escrita directo,
    sin usar esta variable) y sobrevivía desde antes de que el proyecto
    cambiara de "Playwrite CL" a "Playwrite ES" (ver la sección de
    tipografías de trazado más arriba) — index.html ya ni siquiera carga
    "Playwrite CL" desde Google Fonts. Eliminada por ser dead code que podía
    confundir a una sesión futura sobre qué fuente de script usa la app.
  - **7 usos reales de `<br>` de maquetación** (nunca de significado): 6 en
    `js/content/matematica.js` (comparaciones de longitud en Medición 2°/4°/
    5° básico, la comparación de bolsas en Datos y Probabilidades 5°, la
    tabla x/y de Patrones y Ecuaciones 6°, y el Grupo A/Grupo B de Datos y
    Probabilidades 6°) y 1 en `js/content/parvularia/pensamientoMatematico.js`
    (comparación de longitud en "Medir", núcleo Pensamiento Matemático NT) —
    todos juntaban 2-3 oraciones/datos independientes dentro de un solo
    `<p>` con `<br>` entre ellos. Se separó cada uno en su propio `<p>` con
    la misma clase ya usada (`.prompt-hint`/`.prompt-sentence`/
    `.prompt-count`, sin crear ninguna clase nueva) — el mismo patrón de
    múltiples `<p>` consecutivos que ya usa el resto del archivo para casos
    como descripción+pregunta (ej. `genDatos5Round`, línea con
    `'<p class="prompt-sentence">'+item.escenario+'</p><p class="prompt-hint">...'`),
    así que no hizo falta CSS nuevo ni wrapper adicional. Verificado: los 6
    generadores de `matematica.js` y el de `pensamientoMatematico.js` pasan
    fuzz de 300 iteraciones cada uno (sin `undefined`, sin `<br` remanente),
    probado visualmente en el navegador inyectando una ronda de comparación
    de longitud real en `.prompt-card` (3 líneas separadas, espaciado
    correcto sin superponerse ni dejar huecos raros), y sin errores de
    consola en Home ni en el módulo probado.
- **Merge automático de PRs (pedido explícito del usuario, 2026-07-27):** a diferencia
  del resto de repos donde se espera confirmación explícita antes de mergear, en
  **este** repositorio el usuario pidió que cada PR se mergee inmediatamente después
  de crearlo, sin esperar una confirmación aparte — sigue aplicando el resto del flujo
  ya establecido (branch nueva → commit → push → PR vía API de GitHub → **mergear** →
  borrar la rama remota → `git checkout main && git pull && git branch -d <branch>`).
  Esto no cambia la necesidad de hacer buen testing/fuzzing antes de abrir el PR —
  el merge automático hace que esa verificación previa importe todavía más.
- **Bug real de `cols:1` (alternativas "deformes" en grilla angosta,
  2026-07-27, reportado por el usuario con una captura de "Funciones del
  Idioma VIII"):** `mcEngine.js` (`drawMCRound()`) solo trata `cols === 2`
  como "una sola columna a ancho completo" (`gridClass = r.cols === 2 ?
  'option-grid panels' : 'option-grid'`, ya documentado como nomenclatura
  contraintuitiva en la auditoría del 2026-07-27 más arriba) — **cualquier
  otro valor, incluido `cols:1`, cae en la grilla multi-columna normal**
  (2 o 3 columnas según el ancho de viewport). Quien escribió `cols:1`
  en varios generadores asumió (razonablemente, por el nombre) que
  significaba "una columna", pero el código lo trata igual que `cols:4`
  (la grilla de opciones cortas). Combinado con alternativas de oración
  completa (`panel:true` o `kind:'word'`), esto forzaba textos largos
  dentro de celdas angostas de grilla — el "deforme" real que mostró la
  captura del usuario (3 columnas con textos cortados/envueltos en vez
  del panel de una sola columna esperado). Encontrados y corregidos los
  **9 casos reales en toda la app** (verificado con `grep -rn "cols:1,"
  js/` antes y después del fix, confirmando que era la lista completa):
  `genSolucionesTecnologicas7Round` y `genAnalisisSoluciones8Round`
  (tecnologia.js), `genVocabularioAvanzado7Round` y
  `genFuncionesIdioma8Round` (ingles.js — coincide con los mismos 2
  generadores de Inglés donde se había agregado `recurso` esta sesión;
  el bug ya existía desde su construcción original, no fue introducido al
  agregar `recurso`), `genOrtografia8Round` (lenguaje.js),
  `genBienestarVida7Round`/`genResolucionConflictos7Round`/
  `genBienestar8Round`/`genParticipacionDemocratica8Round`
  (orientacion.js) — todos cambiados de `cols:1` a `cols:2` (manteniendo
  `panel:true` donde ya estaba; los 2 de `ingles.js` cambiaron además
  `kind:'word'` por `panel:true`, ya que sus alternativas son oraciones
  completas en inglés, el mismo criterio de "oración larga → panel" que
  usa el resto de la app). Se verificó que **ningún otro valor de `cols`**
  existe en toda la app aparte de `2` y `4` (`grep -o "cols:\d" js/` sobre
  los ~300 módulos), así que estos 9 eran el 100% de los casos rotos —
  no queda ningún otro `cols` con un número ambiguo. Verificado: los 9
  generadores pasan fuzz de 200 iteraciones cada uno (cols siempre 2,
  panel siempre presente, sin `undefined`, sin opciones duplicadas) y
  prueba visual en el navegador en escritorio (1280px) y mobile (375px)
  para "Funciones del Idioma VIII" (Inglés 8°) y "Análisis de Soluciones
  Tecnológicas" (Tecnología 8°) — ambas ahora se ven como un panel de una
  sola columna con acento de color, igual que Estudio para Pruebas, sin
  errores de consola. Lección para generadores futuros: `cols` es
  efectivamente un booleano disfrazado de número (`2` = panel de una
  columna, cualquier otro valor = grilla) — usar siempre `cols:2` para
  alternativas de oración completa, nunca `cols:1` pensando que significa
  "una columna".
- **Alternativas en MAYÚSCULAS SOSTENIDAS en toda la app, no solo Estudio
  para Pruebas (2026-07-27, pedido explícito del usuario):** tras el fix
  de `cols:1`, el usuario pidió auditar por qué las alternativas seguían
  viéndose "poco armoniosas" — la respuesta fue que la conversión de
  MAYÚSCULAS a oración normal (2026-07-26) solo se había aplicado a
  Química Diagnóstica; el resto de la app (1°-8° básico, las 9
  asignaturas) seguía con el patrón de autoría original en MAYÚSCULAS.
  Un conteo real (no estimado) mostró **~1.870 alternativas en MAYÚSCULAS
  de 3+ palabras** repartidas en 10 archivos (historia.js 635, ciencias.js
  455, lenguaje.js 246, ingles.js 152, edfisica.js 115, artes.js 94,
  musica.js 71, tecnologia.js 38, orientacion.js 36, matematica.js 27) —
  Parvularia y Microbiología Clínica ya estaban en 0, no necesitaron nada.
  El usuario eligió abordarlo **por asignatura, de mayor a menor
  impacto**, cada archivo en su propio commit/PR, empezando por
  `historia.js` (el más grande).
  - **Metodología (no manual ítem por ítem, dado el volumen):** se escribió
    un script de PowerShell (`fix_caps_historia.ps1`, en el scratchpad, no
    versionado) que (1) escanea todas las cadenas entre comillas simples
    del archivo, (2) identifica las que están 100% en mayúsculas
    sostenidas, (3) las convierte a minúscula con la primera letra en
    mayúscula, y (4) restaura mediante un diccionario curado (~150
    entradas: países, ciudades, ríos, personas, nombres de eventos/
    tratados/batallas históricas) los nombres propios que deben mantener
    su mayúscula donde sea que aparezcan en la oración, no solo al
    principio. Los gentilicios/nombres de civilizaciones usados como
    sustantivo común (mapuche, inca, azteca, maya) se dejaron en minúscula
    a propósito, siguiendo la convención real del español (a diferencia
    del inglés, que sí capitaliza gentilicios). El script se probó primero
    sobre una copia de respaldo antes de aplicarlo al archivo real.
  - **3 bugs reales encontrados y corregidos tras revisar el diff**, todos
    por interacción entre reemplazos del diccionario, no por el diseño en
    sí: (1) un BOM UTF-8 (`EF BB BF`) quedó al inicio del archivo por el
    method `Set-Content -Encoding UTF8` de PowerShell — eliminado a nivel
    de bytes; (2) dos apóstrofos sin escapar en `'Bernardo O'Higgins'`
    (el reemplazo del diccionario insertó un apóstrofo recto sin escapar
    dentro de un string ya delimitado por comillas simples, rompiendo la
    sintaxis JS) — corregido a `'Bernardo O\'Higgins'`; (3) un caso de
    sobrescritura entre entradas del diccionario de distinto largo
    (`'camino inca'` se reemplazó primero por `'Camino Inca'`, pero una
    entrada más corta `'inca'→'inca'` (minúscula, para el gentilicio)
    procesada después volvió a bajar la "I" de "Inca" dentro de ese string
    ya reemplazado) — encontrado con `grep` dirigido y corregido a mano;
    más 5 nombres propios puntuales que el diccionario no cubría
    (`Sudamérica`, `Patagonia`, `América Central`, `Montes Alpes`,
    `Montañas Rocosas`) — corregidos con `Edit` directo tras revisar el
    diff completo línea por línea.
  - **Los 34 `.toLowerCase()` que forzaban minúscula sobre `item.correcta`/
    `item.zona`/`item.funcion`** (necesarios cuando esos campos estaban en
    MAYÚSCULAS, para que el `explain` leyera natural) se corrigieron
    quitando `.toLowerCase()` — mismo bug ya documentado para Química
    Diagnóstica. Los usos de `.toLowerCase()` sobre `item.label` se
    dejaron intactos a propósito: ese campo se usa para insertar un
    sustantivo común a mitad de oración (p. ej. "esa descripción
    corresponde a una playa"), donde SÍ corresponde mantenerlo en
    minúscula aunque el botón lo muestre con mayúscula inicial — no es el
    mismo patrón que `correcta` (que se cita entre `<b>` como la
    respuesta, y por eso conserva su mayúscula propia).
  - Verificado: los 37 generadores de `historia.js` pasan fuzz de 200
    iteraciones cada uno (sin `undefined`, sin opciones duplicadas,
    `correctValue` siempre presente, sin apóstrofes en `speakText`, **sin
    ninguna cadena de 4+ letras en mayúscula sostenida remanente** — grep
    dedicado sobre el archivo completo confirmó 0 residuos, solo 2 falsos
    positivos que son emoji). Probado visualmente en el navegador en
    mobile (375px): "Estado Moderno y Mercantilismo" (8°, estilo panel),
    "Civilizaciones Americanas" (4°, estilo grilla de palabras) y
    "Calendario" (1°, grilla de meses) — las tres se ven en oración/nombre
    propio normal en vez de mayúsculas sostenidas, y una ronda jugada
    completa (respuesta incorrecta en Calendario) confirmó que el texto
    del `explain` ("Después de Diciembre viene Enero.") lee con
    puntuación y mayúsculas correctas. Sin errores de consola.
  - Próximo paso (mismo pedido, orden ya acordado) tras `historia.js`:
    `ciencias.js` (455 alternativas), luego `lenguaje.js`, `ingles.js`,
    `edfisica.js`, `artes.js`, `musica.js`, `tecnologia.js`,
    `orientacion.js`, `matematica.js` — cada uno en su propio commit/PR,
    con la misma metodología (script + revisión manual del diff + fuzz +
    prueba visual) ya validada aquí. **Actualización 2026-07-31: este
    plan quedó en pausa** — antes de seguir con `ciencias.js`, el usuario
    revisó el resultado de `historia.js` y reportó un problema distinto
    (ver bullet siguiente, "Unificación del formato de alternativas").
    **Retomado el mismo día, tras resolver ese bloqueo:** ver
    "`ciencias.js` en oración normal" más abajo — 574 alternativas
    convertidas, próximo archivo en la fila: `lenguaje.js`.
- **Unificación del formato de alternativas a una sola columna
  (2026-07-31, pedido explícito del usuario con capturas de pantalla):**
  tras revisar `historia.js` ya en oración normal, el usuario notó que el
  tipo de letra quedó bien, pero el **formato/diseño** de dónde aparece
  cada alternativa seguía "no uniforme" — comparó dos capturas del mismo
  1° básico: "Calendario" (grilla de 2-3 columnas: 3 botones en una fila y
  un cuarto solo, centrado, en la fila siguiente) vs. "Símbolos de Chile"
  (una sola columna, ancho completo, con el borde de acento a la
  izquierda) — pidiendo que TODA la app se vea como el segundo caso.
  - **Causa:** `mcEngine.js` (`drawMCRound()`) todavía decidía el layout
    por generador: `gridClass` dependía de `r.cols===2` (grilla
    multi-columna vs. panel de una columna) y `optClass` dependía de
    `r.panel`/`r.kind==='word'` (tres estilos de botón distintos:
    `option-btn` base -Baloo 2, 20-30px, centrado-, `option-btn.wordopt`
    -15-18px, centrado- y `option-btn.panel` -Quicksand, 15-19px,
    izquierda, con acento de color-). Con ~300 módulos repartidos entre
    estos 3 estilos según el largo típico de su contenido, la app se
    sentía inconsistente al pasar de un módulo a otro, incluso dentro del
    mismo curso.
  - **Decisión (confirmada explícitamente por el usuario vía
    `AskUserQuestion`, incluyendo una segunda confirmación tras verle
    mostrar el efecto real en Vocales):** eliminar por completo el modo
    grilla multi-columna y el estilo `wordopt` — **`gridClass` y
    `optClass` ahora son fijos** (`'option-grid panels'` /
    `'option-btn panel'`), sin importar qué `cols`/`kind`/`panel` traiga
    el objeto que retorna cada `genXxxRound()`. Esos campos se dejan tal
    cual en el código de cada generador (no se tocó ni un archivo de
    `content/`) porque ya no tienen ningún efecto en el layout — solo
    quedan como metadata histórica. Un solo cambio de 2 líneas en
    `mcEngine.js` resuelve el problema en los ~300 módulos de la app de
    una vez, sin necesidad de tocar generador por generador.
  - **Trade-off advertido y aceptado explícitamente:** esto also implica
    que respuestas de una sola letra o palabra (Vocales, días de la
    semana, colores) pasan de verse grandes/negrita/centradas (20-30px)
    a verse más chicas/alineadas a la izquierda (15-19px), igual que una
    alternativa de oración larga — medido en el navegador: un botón de
    335px de ancho con una sola vocal en 15px a la izquierda, con mucho
    espacio vacío a la derecha. Se le presentó este trade-off al usuario
    explícitamente (con las medidas reales, no solo la descripción) antes
    de aplicarlo — priorizó la uniformidad de formato sobre el tamaño de
    letra de las respuestas cortas.
  - Verificado: `gridClass`/`optClass` fijos confirmados por inspección
    del DOM (`getBoundingClientRect()`) en escritorio (1280px) y mobile
    (375px) en 6 módulos de distintos años/asignaturas/etapas (Calendario
    1° básico, Vocales 1° básico, Plantas 3° básico, Contar 1° básico,
    Patrones NT/Parvularia, Casos Clínicos: Función Renal de Química
    Diagnóstica — este último ya usaba `panel:true` antes, así que sirve
    de control de que no cambió nada ahí). Las 4 alternativas de cada
    módulo probado renderizan con el mismo ancho (335px en mobile),
    apiladas en una sola columna. Se probó también el flujo de responder
    (clase `correct`/`wrong` se sigue aplicando bien sobre `option-btn
    panel`, ya que `answerMC()` solo usa `classList.add()`, no depende
    del estilo base). Sin errores de consola en ningún módulo probado.
    No se pudo tomar captura de pantalla en esta sesión (el panel del
    navegador no estaba disponible), así que la verificación fue 100%
    vía inspección del DOM en vez de comparación visual directa — si se
    quiere una confirmación visual, conviene pedirla en la próxima
    sesión con captura de pantalla real.
- **`ciencias.js` en oración normal (2026-07-31/08-01, continuación del
  rollout de MAYÚSCULAS SOSTENIDAS, segundo archivo tras `historia.js`):**
  mismo pedido, mismo criterio ("procede" para continuar tras resolver el
  bloqueo de formato de alternativas). A diferencia de `historia.js`
  (predominan nombres propios/lugares), el diccionario de excepciones de
  `ciencias.js` fue mucho más chico: solo 7 nombres de científicos
  (Robert Hooke, Isaac Newton, Charles Darwin, Gregor Mendel, Anton van
  Leeuwenhoek — con "van" en minúscula, convención neerlandesa real—,
  Louis Pasteur, Alexander Fleming) y 3 valores de `nombre`/`fuente` del
  banco de Sistema Solar (`'EL SOL'`→`'El Sol'`, `'LA TIERRA'`→`'La
  Tierra'`, `'LA LUNA'`→`'La Luna'`, como nombres propios de cuerpos
  celestes) que necesitaban un valor exacto de reemplazo en vez del
  genérico "minúscula + primera letra mayúscula". El resto del banco
  (~564 cadenas) usa ese genérico sin excepciones — no hay apellidos ni
  topónimos chilenos en este archivo como sí los hay en historia.js.
  - **Mismo guion de PowerShell que `historia.js`, con dos mejoras
    deliberadas para evitar el bug de solapamiento de diccionario ya
    documentado ahí:** en vez de un diccionario de sustitución por
    substring (razón del bug de "Camino Inca"/"inca" en `historia.js`),
    este guion usa un diccionario de **coincidencia de cadena completa**
    (la cadena entre comillas debe ser EXACTAMENTE `'EL SOL'`, no
    contenerlo) — así "El Sol" nunca se pisa con otra entrada aunque
    aparezca como substring de una oración más larga en otro lugar del
    archivo. Los 3 acrónimos reales del archivo (ADN, ITS, LED, que
    aparecen incrustados dentro de oraciones más largas entre paréntesis
    o como sigla) se restauran aparte, con un regex de límite de palabra
    (`\bADN\b`) después de la conversión genérica a minúscula.
  - **Un caso real de "Tierra" con doble sentido, resuelto a mano (no por
    diccionario):** la palabra "tierra" aparece en el archivo tanto como
    sustantivo común (suelo/terreno — "un cultivo que crece bajo la
    tierra", "rodeado de tierra por todos lados" — correctamente en
    minúscula) como nombre propio del planeta ("el interior de la
    Tierra", "que la Tierra no tiene continentes", en el banco de placas
    tectónicas de 6° básico) — un diccionario de substring ciego habría
    forzado un solo criterio para ambos casos y roto uno de los dos. Se
    dejó el genérico (minúscula) para todos los casos y se corrigieron a
    mano, después de revisar el diff completo, los 2 únicos casos donde
    "tierra" se refiere al planeta.
  - **Bug real encontrado por el fuzz test tras la primera pasada del
    guion, no por revisión manual:** `genSistemaSolar3Round` tenía
    `explain: 'Esa descripción corresponde a <b>'+item.nombre.toLowerCase()+'</b>.'`
    — antes de la conversión esto era inofensivo (`'EL SOL'.toLowerCase()`
    daba "el sol", ya en minúscula sin nada que preservar), pero con
    `item.nombre` ya convertido a `'El Sol'`/`'La Tierra'`/`'La Luna'`
    (nombres propios), el mismo `.toLowerCase()` volvía a bajar la "S"/"T"/
    "L" interna, mostrando "el sol" en vez de "El Sol" en el texto leído
    tras responder. Se corrigió quitando `.toLowerCase()` en esa única
    línea (los otros 2 valores posibles del mismo campo, "Un cometa"/"Un
    planeta con anillos", se leen igual de bien sin forzar minúscula, ya
    que quedan como sustantivo capitalizado tras "corresponde a", mismo
    criterio que ya se usa para `item.correcta` en el patrón "La respuesta
    correcta es: X"). Detectado con un fuzz de 200 iteraciones dirigido
    específicamente a ese generador, buscando `<b>(el sol|la tierra|la
    luna)</b>` en el `explain` — 0 casos tras la corrección.
  - **Se aplicó el mismo criterio ya establecido para `.toLowerCase()`
    sobre `item.correcta`** (quitarlo solo cuando el patrón es
    literalmente "La respuesta correcta es: X." o "La respuesta correcta
    es &lt;b&gt;X&lt;/b&gt;." — 30 ocurrencias en 27 generadores distintos)
    y se dejó intacto en los demás usos mid-oración (p. ej. "esto es un
    ejemplo de &lt;b&gt;conducción&lt;/b&gt;", "transforma la energía en
    &lt;b&gt;luz y calor&lt;/b&gt;"), donde SÍ corresponde mostrar el
    valor en minúscula por ir incrustado como complemento de una oración
    ya empezada — mismo criterio de "¿es la respuesta citada como
    entidad, o el complemento de una oración?" ya usado en `historia.js`.
  - **Bug de contenido pre-existente, no relacionado con MAYÚSCULAS,
    encontrado de paso al construir el diccionario:** un ítem de
    `SISTEMAS_CUERPO_8_BANK` tenía la cadena
    `'AYUDAN A ABSORBER ciertas VITAMINAS Y PROTEGEN ÓRGANOS DEL CUERPO'`
    — una mezcla real de mayúsculas y minúsculas ya rota desde antes de
    esta sesión (por eso el detector de "ALL-CAPS puro" del guion la
    saltó sin tocarla: tiene la palabra "ciertas" en minúscula). Corregida
    a mano a `'Ayudan a absorber ciertas vitaminas y protegen órganos del
    cuerpo'`.
  - **Nota de alcance, dejada fuera a propósito de este PR:** se encontró
    de paso que 4 generadores (`genVertebrados2Round`,
    `genClima2Round`/`genAlimentacion3Round`/`genSistemaSolar3Round`) usan
    el placeholder literal `"un(a)"` sin resolver en su `explain` — el
    mismo bug ya documentado y corregido en `lenguaje.js`/`matematica.js`
    durante la auditoría de 6° básico, pero nunca tocado en
    `ciencias.js`. No se corrigió en este PR por ser un bug de gramática
    no relacionado con MAYÚSCULAS/formato (fuera del alcance de esta
    tarea puntual) — queda pendiente para una sesión futura.
  - Verificado: los 43 generadores de `ciencias.js` pasan fuzz de 300
    iteraciones cada uno (sin `THROW`, sin `undefined`, sin opciones
    duplicadas, `correctValue` siempre presente en las opciones, sin
    apóstrofes en `speakText`, `recurso` sin `undefined`) — 0 hallazgos.
    Grep dedicado confirmó 0 cadenas de 4+ letras en mayúscula sostenida
    remanentes (fuera de ADN/ITS/LED, ya restaurados a propósito).
    `MC_KEYS.length === Object.keys(MC_GAMES).length === 324` (regresión
    de wiring intacta). Probado visualmente en el navegador en mobile
    (375px): módulo "La Luz" (3° básico) con las alternativas "Fuente
    natural"/"Fuente artificial" y luego "Verdadero"/"Falso" en oración
    normal, una ronda completa jugada (respuesta correcta avanza de 1/8 a
    2/8), botón Recurso abre el modal sin errores de consola. Próximo
    paso del mismo pedido: `lenguaje.js` (246 alternativas).
- **`lenguaje.js` en oración normal (2026-08-01, tercer archivo del
  rollout tras `historia.js` y `ciencias.js`):** mismo pedido, mismo
  criterio ("procede"). El conteo real fue de 702 cadenas únicas en
  MAYÚSCULAS (más que las ~246 estimadas originalmente) — este archivo
  mezcla vocabulario suelto (bancos de Vocales/Sílabas/Alfabético),
  conjugaciones verbales, oraciones de ejemplo completas, fragmentos de
  morfemas (prefijos/sufijos) y las respuestas de opción múltiple
  habituales, así que el diccionario de excepciones fue mínimo: solo 2
  nombres propios embebidos a mitad de una cadena más larga (`'A MARTA'`→
  `'A Marta'`, `'A SOFÍA'`→`'A Sofía'`, en `REFERENTE_BANK`, un ejercicio
  de a qué se refiere un pronombre).
  - **Bug real de regex encontrado y corregido ANTES de aplicar el script
    al archivo real (afecta la metodología para los archivos que faltan):**
    el patrón `'([^'\r\n]+)'` (usado también en `historia.js`/`ciencias.js`)
    falla silenciosamente cuando el archivo contiene cadenas vacías `''`
    (aquí: `before:''` en varias entradas de `COMBO_WORDS`, el banco de
    combinaciones silábicas que/qui/gue/gui/etc.). Con `+` (mínimo 1
    carácter), el regex no encuentra contenido entre las dos comillas de
    `''`, falla ese intento de match, y en el reintento en la posición
    siguiente termina emparejando la comilla de cierre de `''` con la
    comilla de APERTURA de la siguiente cadena real como si fueran un par
    válido — capturando texto espurio (código JS entre medio, nunca
    contenido real) y salteándose la conversión de la cadena real
    siguiente. El síntoma visible: dentro de un mismo array
    (`COMBO_WORDS`), algunas entradas con `before:''` quedaron sin
    convertir (`combo:'QUE'`) mientras las entradas con `before` no vacío
    sí se convirtieron bien (`combo:'Gue'`) — inconsistencia detectada
    revisando el diff antes de tocar el archivo real, nunca llegó a
    aplicarse. **Corregido cambiando `+` por `*`** (permite capturar
    cadena vacía como su propio match atómico, sin arrastrar el
    desalineamiento a la cadena siguiente) — con eso, las 12 entradas de
    `COMBO_WORDS` convirtieron parejo. Se revisó `historia.js` (2 cadenas
    `''` ya mergeado, PR #50) y `ciencias.js` (0 cadenas `''`) por el
    mismo riesgo: `ciencias.js` nunca estuvo expuesto (no tiene cadenas
    vacías), y las 2 de `historia.js` están aisladas dentro de una función
    de renderizado de calendario sin contenido ALL-CAPS cerca — un grep
    dirigido no encontró fragmentos de código filtrados como texto en el
    archivo ya mergeado, así que se dejó intacto en vez de reabrir un PR
    ya verificado con fuzz-testing exhaustivo. **Lección para los archivos
    que faltan** (`ingles.js`, `edfisica.js`, `artes.js`, `musica.js`,
    `tecnologia.js`, `orientacion.js`, `matematica.js`): usar siempre `*`
    en vez de `+` en el patrón del script, y hacer un `grep -c "''"` sobre
    el archivo ANTES de correr el script para saber si este riesgo aplica.
  - **Bug real de mayúscula-para-énfasis embebida a mitad de oración,
    encontrado por revisión manual del diff (no por el script):**
    `genAlfabetico3Round` construía `'...aparece '+(askFirst?'PRIMERO':'AL
    FINAL')+' en el orden alfabético?'` — un patrón nuevo que no había
    aparecido en `historia.js`/`ciencias.js`: usar MAYÚSCULAS ahí no era
    "la respuesta citada como entidad" sino énfasis visual a mitad de
    oración (equivalente a negrita en texto plano). Tras la conversión
    genérica esto se leía "aparece Primero en el orden alfabético" (con
    mayúscula que parece nombre propio) — se corrigió a mano bajándolo a
    minúscula (`'primero'`/`'al final'`), coincidiendo con el
    `speakText` de la misma función que YA usaba minúscula
    (`askFirst?'primero':'al final'`) — la inconsistencia entre
    `promptHTML` y `speakText` ya existía desde antes de esta sesión
    (usaban mayúscula/minúscula distintas para el mismo dato) y quedó
    resuelta de paso al unificar ambas a minúscula.
  - **Bug estructural real, encontrado por el fuzz test (no por revisión
    manual del diff):** `GENERO_ARTICULO` (helper que resuelve el
    artículo "un"/"una" correcto para el `explain` de
    `genGenerosLiterarios3Round`) usaba claves de objeto SIN comillas
    (`{ POEMA:'un', CUENTO:'un', ... }`) — el script de conversión solo
    toca cadenas ENTRE COMILLAS, así que estas claves (identificadores JS
    válidos, no strings) quedaron en MAYÚSCULAS mientras `item.label`
    (los valores reales del banco `GENEROS_BANK`, sí entre comillas) se
    convirtieron a `'Poema'`, `'Cuento'`, etc. — rompiendo el lookup
    `GENERO_ARTICULO[item.label]` (`GENERO_ARTICULO['Poema']` es
    `undefined` cuando la clave real es `POEMA`). Corregido a mano
    actualizando las 7 claves para que calcen con la nueva capitalización
    (`{ Poema:'un', Cuento:'un', Fábula:'una', ... }`). **Dos bugs
    estructurales más de la misma familia** (comparación entre un campo
    ya convertido y un array/valor que se le compara), encontrados
    también por el fuzz test, no por inspección: `genGramatica2Round` y
    `genGramatica3Round` construían sus alternativas con
    `.map(function(w){ return w.toUpperCase(); })` sobre los valores de
    sustantivo/adjetivo/artículo — antes de esta sesión esto era una
    operación inofensiva (el dato ya venía en MAYÚSCULAS, forzarlo de
    nuevo no cambiaba nada), pero al convertir el dato fuente a oración
    normal, ese `.toUpperCase()` seguía forzando las ALTERNATIVAS a
    MAYÚSCULAS mientras `correctValue` se dejaba en su nueva forma
    normal — ningún valor de las opciones volvía a calzar con
    `correctValue`, y el motor no tenía ninguna respuesta marcable como
    correcta. Corregido eliminando el `.map(...toUpperCase())` en ambos
    generadores (ya no hace falta: el dato de origen ya viene bien
    capitalizado). **Lección reforzada para los archivos que faltan:**
    grepear `\.toUpperCase\(\)` en el archivo ANTES de dar por terminada
    la conversión — cualquier transformación de mayúscula/minúscula que
    dependía de que el dato YA estuviera en un caso conocido puede
    romperse silenciosamente al cambiar ese caso, y el fuzz test
    (`correctValue not in options`) es la única red que atrapa este tipo
    de bug de forma confiable.
  - Igual que en los archivos anteriores, se aplicó el mismo criterio de
    `.toLowerCase()` sobre el patrón "La respuesta correcta es: X" (y sus
    variantes "La idea principal es:", "El conflicto principal es:",
    "Este recurso se llama:", "Esto es:", "La postura del autor es:" — 19
    ocurrencias en total) — se quitó el `.toLowerCase()` en esos casos, y
    se dejó intacto en los ~20 usos restantes donde el valor va incrustado
    a mitad de oración como complemento (p. ej. "el sufijo '-dad'
    indica..."). A diferencia de `ciencias.js`, no se encontró ningún
    placeholder `"un(a)"` sin resolver en este archivo — ya lo tenía
    resuelto vía `GENERO_ARTICULO`, el mismo mecanismo que causó el bug de
    la clave sin comillas descrito arriba.
  - Verificado: los 36 generadores de `lenguaje.js` pasan fuzz de 300
    iteraciones cada uno (sin `THROW`, sin `undefined`, sin opciones
    duplicadas, `correctValue` siempre presente en las opciones —
    incluyendo verificación específica post-fix de que
    `genGramatica2Round`/`genGramatica3Round` ya no producen ese error,
    sin apóstrofes en `speakText`) — 0 hallazgos tras las correcciones.
    Grep dedicado confirmó 0 cadenas de 2+ letras en mayúscula sostenida
    remanentes. `MC_KEYS.length === Object.keys(MC_GAMES).length === 324`
    (regresión de wiring intacta). Probado visualmente en el navegador
    (recargando la página para descartar módulos ES cacheados en memoria,
    algo que no hace falta en una carga fresca pero sí al editar el
    archivo y seguir navegando en la misma sesión del SPA): módulo
    "Gramática" (2° básico) con alternativas "Contento"/"Contenta"/
    "Contentos"/"Contentas" en oración normal, una ronda jugada completa
    (respuesta incorrecta muestra el overlay de Carboncito con el texto
    "'Los niños' concuerda con Contentos en género y número." — capitalización
    correcta), sin errores de consola. Próximo paso del mismo pedido:
    `ingles.js` (152 alternativas).
- **`ingles.js` en oración normal (2026-08-01, cuarto archivo del rollout tras
  `historia.js`/`ciencias.js`/`lenguaje.js`):** mismo pedido, mismo criterio
  ("procede"). Este archivo resultó ser el más simple de los cuatro: una
  revisión previa con `grep` confirmó que no tiene ninguno de los 3 patrones
  de bug ya documentados en archivos anteriores (sin cadenas vacías `''`,
  sin claves de objeto ALL-CAPS sin comillas, sin `.toUpperCase()`/
  `.toLowerCase()` en ningún lado), así que no hizo falta ningún diccionario
  de excepciones ni fix estructural posterior al correr el script — el
  único ajuste fue un fix manual puntual (ver abajo).
  - **Alcance particular de este archivo:** a diferencia del resto de la
    app, la mayoría de las cadenas ALL-CAPS convertidas aquí son
    **contenido en inglés** (vocabulario, oraciones de ejemplo, respuestas
    de comprensión lectora), no español — pero el mismo criterio de
    armonía visual aplica igual: "DOG"/"YOU MUST DO THIS" en mayúscula
    sostenida se ve igual de "gritado" en inglés que en español. Se revisó
    explícitamente el pronombre "I" (que en inglés siempre va en mayúscula,
    sin importar su posición en la oración): los 9 casos del archivo
    (`I NEED HELP`, `I AM GOING TO...`, etc.) resultaron estar todos al
    inicio de su propia cadena, así que la conversión genérica de
    "primera letra mayúscula" ya los deja bien capitalizados sin necesitar
    una excepción — no hay ningún caso de "I" a mitad de oración en este
    archivo. Los días de la semana en inglés (`MONDAY`→`Monday`, etc.)
    tampoco necesitaron diccionario: al ser nombres propios de una sola
    palabra, la forma de oración coincide exactamente con la forma de
    nombre propio.
  - **Único fix manual real, encontrado por revisión del diff (no por el
    fuzz test):** el script bajó `'ANCIENT EGYPT'` a `'Ancient egypt'`
    (la conversión genérica solo capitaliza la primera letra de la cadena
    completa, no cada palabra) — "Egypt" es un nombre propio (país) y debe
    mantener su mayúscula sin importar su posición. Corregido a mano a
    `'Ancient Egypt'`. Se revisó el resto del archivo buscando el mismo
    patrón (nombre propio de 2+ palabras dentro de una respuesta corta) y
    no se encontró ningún otro caso — los demás nombres propios del
    archivo (Sofia, Mia, Anna, Tom, Sara, Ben, Leo, Marco, Elena, Maria)
    solo aparecen dentro de los `text:` narrativos, que nunca estuvieron en
    ALL-CAPS y por lo tanto el script nunca los tocó.
  - Verificado: los 8 generadores pasan fuzz de 300 iteraciones cada uno
    (sin `THROW`, sin `undefined`, sin opciones duplicadas, `correctValue`
    siempre presente, sin apóstrofes en `speakText` — ya evitados a
    propósito desde la construcción original del archivo). Grep dedicado
    confirmó 0 cadenas de 2+ letras en mayúscula sostenida remanentes.
    `MC_KEYS.length === Object.keys(MC_GAMES).length === 324` (regresión de
    wiring intacta). Probado visualmente en el navegador (recarga completa
    para evitar el caché de módulos ES ya documentado): módulo "Vocabulario
    Básico" (Inglés 5° básico) con alternativas "Book"/"Baby"/"Fish"/
    "Green" en oración normal, una ronda jugada completa (respuesta
    correcta), overlay de Carboncito mostrando "Se dice Book en inglés."
    con capitalización correcta, sin errores de consola. Próximo paso del
    mismo pedido: `edfisica.js` (115 alternativas).
- **`edfisica.js` en oración normal (2026-08-01, quinto archivo del rollout tras
  `historia.js`/`ciencias.js`/`lenguaje.js`/`ingles.js`):** mismo pedido, mismo
  criterio ("procede"). El conteo real fue de 203 cadenas ALL-CAPS convertidas
  (más que la estimación original de 115) repartidas en 8 bancos: `MOVIMIENTOS_ITEMS`
  (label/tipo, NT-1° básico), `COMPONENTES_FISICOS_BANK` y `INTENSIDAD_ACTIVIDAD_BANK`/
  `INTENSIDAD_ACTIVIDAD6_BANK` (4°-6° básico), `ESTRATEGIA_DEPORTIVA_BANK` (7°),
  `SISTEMAS_JUEGO_8_BANK`/`ENTRENAMIENTO_8_BANK` (8°), y el literal `'VERDADERO'`/
  `'FALSO'` reutilizado como opciones en prácticamente todos los módulos verdadero/
  falso del archivo (1°-6° básico). Sin diccionario de excepciones: el pre-escaneo
  (`grep -c "''"`, `\{\s*[A-Z]+\s*:`, ternarios ALL-CAPS mid-oración) no encontró
  ningún nombre propio de 2+ palabras ni ninguno de los 3 bugs estructurales ya
  documentados — todo el contenido ALL-CAPS de este archivo son frases descriptivas
  de táctica deportiva/categorías de movimiento, sin países/personas/lugares
  embebidos.
  - **Caso interesante resuelto automáticamente por ser función pura de la cadena:**
    los valores `'BAJA'`/`'MODERADA'`/`'ALTA'` (intensidad) y `'LOCOMOCIÓN'`/
    `'MANIPULACIÓN'`/`'ESTABILIDAD'` (tipo de movimiento) aparecen dos veces cada
    uno en el código — una vez dentro del banco de contenido (`item.intensidad`/
    `item.tipo`) y otra vez en un array literal usado para calcular las 2-3
    alternativas restantes (`const todos = ['BAJA','MODERADA','ALTA']`,
    `shuffle(['LOCOMOCIÓN','MANIPULACIÓN','ESTABILIDAD'])`). Como la conversión del
    script es una función pura del contenido exacto de la cadena (mismo texto →
    mismo resultado, sin importar dónde aparezca), ambas copias de cada valor se
    convirtieron de forma idéntica y consistente sin necesitar ningún manejo
    especial — `correctValue` (del banco) y las opciones (del array literal) siguen
    calzando exactamente después de la conversión. Se verificó explícitamente con
    el fuzz test que ningún generador de intensidad/tipo de movimiento quedó con
    `correctValue not in options`. El literal `'INTENSIDAD '` (usado para construir
    la etiqueta visible `label:'INTENSIDAD '+i`) también es una cadena ALL-CAPS
    independiente que el script detectó y convirtió a `'Intensidad '` — el
    resultado final (`'Intensidad Baja'`, `'Intensidad Alta'`) es exactamente el
    formato deseado, sin ningún ajuste manual.
  - **3 usos de `.toLowerCase()` corregidos** (de los 7 totales en el archivo) por
    calzar con el patrón ya establecido "la respuesta citada como entidad" (2 con
    la variante "Esto es un ejemplo de: X" en `genEstrategiasTacticas7Round`/
    `genSistemasJuego8Round`, 1 con "La respuesta correcta es: X" en
    `genEntrenamiento8Round`) — se quitó `.toLowerCase()` en los 3, ya que
    `item.correcta` ahora viene en oración normal y forzarlo a minúscula rompería
    la mayúscula inicial de la respuesta citada. Los otros 4 usos (`genMovimientoRound`,
    `genCondicionFisica4Round`, `genVidaPostura5Round`, `genVidaPostura6Round`) son
    complementos mid-oración genuinos ("es un movimiento de `<b>`+tipo+`</b>`", "tiene
    una intensidad `<b>`+intensidad+`</b>`") y se dejaron intactos, mismo criterio ya
    usado en archivos anteriores.
  - Verificado: los 17 generadores pasan fuzz de 300 iteraciones cada uno (sin
    `THROW`, sin `undefined`, sin opciones duplicadas, `correctValue` siempre
    presente en las opciones — incluyendo verificación específica de que los
    generadores con `todos`/intensidad no quedaron rotos tras la conversión, sin
    apóstrofes en `speakText`). Grep dedicado confirmó 0 cadenas de 2+ letras en
    mayúscula sostenida remanentes. `MC_KEYS.length === Object.keys(MC_GAMES).length
    === 324` (regresión de wiring intacta). Probado visualmente en el navegador:
    módulo "Cuerpo en Movimiento" (1° básico) con alternativas "Manipulación"/
    "Estabilidad"/"Locomoción" en oración normal, una ronda jugada completa
    (respuesta incorrecta muestra el overlay de Carboncito con "Saltar es un
    movimiento de locomoción." — capitalización correcta, mid-oración en
    minúscula), sin errores de consola. Próximo paso del mismo pedido:
    `artes.js` (94 alternativas).
- **`artes.js` en oración normal (2026-08-01, sexto archivo del rollout tras
  `historia.js`/`ciencias.js`/`lenguaje.js`/`ingles.js`/`edfisica.js`):** mismo
  pedido, mismo criterio ("procede"). Sin diccionario de excepciones: el
  pre-escaneo (`grep -c "''"`, claves de objeto ALL-CAPS sin comillas,
  ternarios ALL-CAPS mid-oración) no encontró ninguno de los 3 patrones de bug
  ya documentados, y el contenido ALL-CAPS del archivo (nombres de color,
  tipos de línea/textura, categorías de material, respuestas de museografía)
  no tiene ningún nombre propio de 2+ palabras.
  - **Bug nuevo, no documentado en archivos anteriores, encontrado ANTES de
    correr el script (por inspección, no por el fuzz test):** `colorSwatchSVG(name)`
    y `lineTypeSVG(tipo)` (`js/svg.js`) son helpers **compartidos entre
    archivos** (usados también por `content/parvularia/lenguajesArtisticos.js`,
    que no forma parte de este rollout) y dependían de una comparación de
    cadena EXACTA contra valores ALL-CAPS: `COLOR_HEX[name]` (un objeto con
    claves `ROJO`/`AZUL`/etc.) y una cadena de `if(tipo === 'VERTICAL')`/
    `'HORIZONTAL'`/etc. Como `artes.js` pasa sus propios valores de banco
    (`item.label`/`item.color`/`item.a`/`item.b`, todos convertidos a
    `'Rojo'`/`'Azul'`) directo a estos helpers para dibujar el círculo de
    color o la línea, convertir el contenido de `artes.js` sin tocar
    `svg.js` habría roto el lookup silenciosamente: `COLOR_HEX['Rojo']` es
    `undefined` (la clave real es `ROJO`), y el swatch habría caído al color
    de respaldo (`#12A594`, un teal) en vez del color real — mostrando un
    círculo verde-azulado para CUALQUIER color, sin ningún error de consola
    que lo delatara. Ninguno de los 5 archivos anteriores de este rollout
    llama a estos dos helpers, así que este bug no se había manifestado
    todavía. **Fix (en `svg.js`, no en `artes.js`):** se normalizó la entrada
    con `.toUpperCase()` antes de la comparación/lookup en ambas funciones
    (`const key = String(name||'').toUpperCase();` en `colorSwatchSVG`,
    `tipo = String(tipo||'').toUpperCase();` al inicio de `lineTypeSVG`) —
    así ambos helpers funcionan sin importar si quien los llama pasa
    ALL-CAPS (`lenguajesArtisticos.js`, todavía sin convertir) o sentence
    case (`artes.js`, ya convertido), sin necesidad de tocar ningún otro
    archivo ni esperar a que Parvularia se convierta. **Lección para los
    archivos que faltan:** antes de correr el script de conversión, grepear
    qué helpers de `svg.js`/otros módulos compartidos reciben directamente
    un valor de banco ALL-CAPS como parámetro (no solo para mostrarlo, sino
    para indexar una tabla o compararlo con un literal) — `shapeSVG` no tuvo
    este problema porque sus ids (`'circulo'`, `'cuadrado'`) ya eran
    minúsculas desde el inicio, nunca ALL-CAPS.
  - Los 6 usos de `.toLowerCase()` que "citan la respuesta como entidad"
    (patrón "La respuesta correcta es: X" ×5, "Esto describe: X" ×1) se
    corrigieron quitando `.toLowerCase()`; los 14 usos restantes (embebidos
    mid-oración: "esa es una línea recta", "el rojo es un color primario",
    "esta obra usa una gama cálida", etc.) se dejaron intactos, mismo
    criterio que todos los archivos anteriores.
  - Verificado: los 11 generadores pasan fuzz de 300 iteraciones cada uno
    (sin `THROW`, sin `undefined`, sin opciones duplicadas, `correctValue`
    siempre presente en las opciones, sin apóstrofes en `speakText`). Grep
    dedicado confirmó 0 cadenas de 2+ letras en mayúscula sostenida
    remanentes. `MC_KEYS.length === Object.keys(MC_GAMES).length === 324`
    (regresión de wiring intacta). Probado visualmente en el navegador tras
    el fix de `svg.js`: módulo "Colores" (1° básico) con el círculo rojo y
    azul renderizando el color REAL (no el color de respaldo), alternativas
    "Naranjo"/"Rosado"/"Verde"/"Morado" en oración normal, una ronda jugada
    completa (mezcla correcta de rojo+azul=morado, y de rojo+blanco=rosado,
    con el círculo blanco con borde también renderizando bien); módulo
    "Líneas y Colores" (2° básico) con una ronda de color (respuesta
    incorrecta mostró el overlay "El amarillo es un color primario." con
    capitalización correcta) y una ronda de tipo de línea (el SVG de línea
    quebrada renderizó correctamente en teal, con alternativas "Vertical"/
    "Horizontal"/"Quebrada" en oración normal) — confirmando que el fix de
    `svg.js` funciona en ambos helpers. Sin errores de consola en ningún
    caso. Próximo paso del mismo pedido: `musica.js` (71 alternativas).
- **`musica.js` en oración normal (2026-08-01, séptimo archivo del rollout tras
  `historia.js`/`ciencias.js`/`lenguaje.js`/`ingles.js`/`edfisica.js`/`artes.js`):**
  mismo pedido, mismo criterio ("procede"). El pre-escaneo no encontró ninguno
  de los 5 patrones de bug ya documentados (sin cadenas vacías `''`, sin claves
  ALL-CAPS sin comillas, sin `toUpperCase`/ternarios ALL-CAPS mid-oración, sin
  llamadas a helpers compartidos con un valor de banco como argumento — las 3
  llamadas a `maracasSVG()`/`djembeSVG()`/`baldeSVG()` en este archivo solo
  reciben un tamaño numérico fijo, nunca el `label` del banco). Sin diccionario
  de excepciones por nombre propio (no hay personas/países en el contenido).
  - **Bug nuevo, no visto en los 6 archivos anteriores: contenido con "códigos
    de letra" (A-A-A, A-B-A, A-B-C...) que deben mantenerse en mayúscula
    completa, no solo la primera letra.** `FORMA_MUSICAL_BANK` (3° básico)
    describe la forma de una canción con literales como
    `'A-A-A (SE REPITE LA MISMA SECCIÓN)'` — el patrón de letras (A, B, C)
    representa las secciones de la canción tal como se muestran arriba en
    pantalla (`item.patron.join(' - ')` dibuja "A - A - A" en grande), y debe
    permanecer en mayúscula en TODAS sus apariciones, no solo la primera letra
    del string completo. La regla genérica de conversión ("minúscula + primera
    letra mayúscula del string completo") habría producido `'A-a-a (se repite
    la misma sección)'` — la segunda y tercera "A" quedarían minúsculas,
    rompiendo el código visual. Se resolvió con un diccionario de 7 excepciones
    de coincidencia EXACTA (las 6 `forma` de `FORMA_MUSICAL_BANK` + el
    distractor literal `'FORMA A-B-A'` en `genTexturaMusical5Round`) que
    preservan el código de letras intacto y solo convierten la descripción
    entre paréntesis a oración normal (`'A-A-A (se repite la misma sección)'`).
    Ningún otro archivo del rollout hasta ahora tenía este patrón de contenido
    (letras usadas como símbolos/códigos en vez de como parte de una palabra).
  - **Bug real de metodología encontrado y corregido en el script mismo, no en
    el contenido — afecta a los archivos que faltan:** las primeras dos
    corridas del script de conversión no aplicaron NINGÚN cambio genérico (solo
    las excepciones del diccionario "pegaban"), porque `-match`/`-notmatch` de
    PowerShell son **case-insensitive por defecto**, lo que hace que
    `'AGUDO' -match '\p{Ll}'` devuelva `$true` incorrectamente (la categoría
    Unicode "minúscula" deja de discriminar por case bajo un match
    case-insensitive) — el chequeo "¿tiene mayúsculas Y no tiene minúsculas?"
    fallaba para toda cadena ALL-CAPS, dejándola sin convertir. corregido
    cambiando a `-cmatch`/`-cnotmatch` (case-sensitive) en ambos chequeos.
    Además, tras corregir eso, dos entradas del diccionario de excepciones
    (las que contienen la palabra con tilde "SECCIÓN", singular) seguían sin
    aplicarse — causa raíz distinta: el archivo `.ps1` no tenía BOM UTF-8, así
    que `powershell.exe` (Windows PowerShell 5.1) interpretó los bytes UTF-8 de
    "Ó" (`C3 93`) como dos caracteres ANSI/cp1252 corruptos al parsear el
    *script* (no el archivo `.js` de destino, que sí se lee con
    `-Encoding UTF8` explícito) — el string literal de la clave del diccionario
    quedó con contenido distinto al extraído del archivo real, y `ContainsKey`
    fallaba silenciosamente. Se confirmó comparando bytes: "SECCIONES" (plural,
    sin tilde) coincidía bien, pero "SECCIÓN" (singular, con tilde) no — la
    prueba de que el problema era específicamente el tilde mal decodificado
    dentro del script, no un problema con el archivo de destino. Corregido
    re-guardando el `.ps1` con BOM UTF-8 explícito
    (`New-Object System.Text.UTF8Encoding($true)`) antes de ejecutarlo.
    **Lección para `tecnologia.js`/`orientacion.js`/`matematica.js`:** (1)
    usar siempre `-cmatch`/`-cnotmatch`, nunca `-match`/`-notmatch`, al
    verificar categorías Unicode de mayúscula/minúscula en PowerShell; (2) si
    el script de conversión (`.ps1`) contiene algún carácter acentuado escrito
    directamente (en el diccionario de excepciones u otro literal), guardarlo
    con BOM UTF-8 antes de ejecutarlo — de lo contrario Windows PowerShell 5.1
    puede parsear mal esos literales sin lanzar ningún error, fallando en
    silencio exactamente igual que el bug de `-match` case-insensitive. Ambos
    bugs se detectaron por revisión manual del diff (la primera corrida dejó
    91 líneas sin convertir; tras el fix de `-cmatch` quedaban solo 2 líneas
    con el diccionario sin aplicar) — ninguno lo habría revelado el fuzz test,
    ya que un banco 100% en MAYÚSCULAS sigue siendo estructuralmente válido
    (opciones únicas, `correctValue` presente, etc.); solo la revisión visual
    del diff lo expuso.
  - Los 7 usos de `.toLowerCase()` que citan la respuesta como entidad ("La
    respuesta correcta es: X" ×2, "Ese término musical es: X", "Esto es un
    ejemplo de: X", "Esta estructura se llama: X", "Esto se llama: X" ×2) se
    corrigieron quitando `.toLowerCase()`; los 7 restantes (embebidos
    mid-oración: "corresponde al X", "es un sonido X", "es un instrumento X",
    "corresponde a la forma X", "es escuchar X", "es una X" -categoría
    binaria-, "es un diseño melódico X" -categoría de 3 vías-) se dejaron
    intactos, mismo criterio de todo el rollout.
  - Verificado: los 10 generadores pasan fuzz de 300 iteraciones cada uno (sin
    `THROW`, sin `undefined`, sin opciones duplicadas, `correctValue` siempre
    presente, sin apóstrofes en `speakText`). Grep dedicado confirmó 0 cadenas
    de 2+ letras en mayúscula sostenida remanentes (fuera de los códigos
    A-A-A/A-B-A/etc., preservados a propósito). `MC_KEYS.length ===
    Object.keys(MC_GAMES).length === 324` (regresión de wiring intacta).
    Probado visualmente en el navegador: módulo "Instrumentos" (1° básico) con
    alternativas "No convencional"/"Convencional" en oración normal, una ronda
    jugada completa (respuesta incorrecta mostró el overlay "Una lata vacía es
    un instrumento no convencional." con capitalización correcta); módulo
    "Lenguaje Musical" (3° básico) con una ronda de forma musical mostrando
    "A - A - A" en grande y las alternativas "A-B-C (tres secciones
    distintas)"/"A-A-B (dos veces lo mismo y luego algo nuevo)"/"A-B-B (algo
    nuevo que se repite)" — el código de letras intacto en mayúscula y la
    descripción en oración normal, confirmando que el fix del diccionario de
    excepciones funciona. Sin errores de consola en ningún caso. Próximo paso
    del mismo pedido: `tecnologia.js` (38 alternativas).
- **`tecnologia.js` en oración normal (2026-08-01, octavo archivo del rollout tras
  `historia.js`/`ciencias.js`/`lenguaje.js`/`ingles.js`/`edfisica.js`/`artes.js`/
  `musica.js`):** mismo pedido, mismo criterio ("procede"). El conteo real fue de
  solo 50 cadenas ALL-CAPS (menos que la estimación original de 38... en realidad
  más, ya que la estimación subestimaba `ANALISIS_SOLUCIONES_8_BANK`), repartidas
  en 3 lugares: `HERRAMIENTAS_TEC`/`MATERIALES_TEC` (1° básico, 10 labels de
  herramienta/material) y `ANALISIS_SOLUCIONES_8_BANK` (8° básico, 10 ítems ×
  4 = 40 strings de correcta/opts). El resto de los bancos del archivo
  (`TEC_DIGITAL_BANK` 2°-6°, `IMPACTO_TECNOLOGICO_7_BANK`) ya estaban en oración
  normal desde su construcción original — no necesitaron ningún cambio.
  - **Archivo chico, sin script de PowerShell:** dado el volumen reducido (50
    cadenas en 2 bancos), se convirtió a mano vía `Edit` en vez de escribir un
    script de conversión — evitando por completo el riesgo de los bugs de
    metodología de PowerShell ya documentados (case-insensitividad de
    `-match`/BOM de `.ps1`), ya que no se necesitó ningún script para un
    volumen tan acotado. El pre-escaneo (`grep` de cadenas vacías, claves
    ALL-CAPS sin comillas, `toUpperCase`, ternarios ALL-CAPS, llamadas a
    helpers de `svg.js`) confirmó que ninguno de los patrones de bug ya
    documentados aplica a este archivo: 0 cadenas vacías, 0 claves de objeto
    ALL-CAPS, 0 `toUpperCase()`, 0 ternarios de énfasis, y 0 llamadas a
    helpers compartidos (`svg.js`) desde este archivo.
  - Los 2 usos de `.toLowerCase()` en `genHerramientasTecRound` (`'Esa
    herramienta es <b>'+item.label.toLowerCase()+'</b>.'` / `'Ese material es
    <b>'+item.label.toLowerCase()+'</b>.'`) se dejaron intactos — mismo
    criterio que "Ese timbre corresponde al X" en `musica.js` (mid-sentence,
    nombrando el ítem específico dentro de una oración ya empezada, no una
    cita tipo "La respuesta correcta es"). Los 2 usos en
    `genSolucionesTecnologicas7Round`/`genAnalisisSoluciones8Round`
    (`'La respuesta correcta es: '+item.correcta.toLowerCase()+'.'`) sí se
    corrigieron quitando `.toLowerCase()`, mismo patrón literal ya establecido
    en los 7 archivos anteriores.
  - Verificado: los 8 generadores pasan fuzz de 300 iteraciones cada uno (sin
    `THROW`, sin `undefined`, sin opciones duplicadas, `correctValue` siempre
    presente, sin apóstrofes en `speakText`). Grep dedicado confirmó 0 cadenas
    de 2+ letras en mayúscula sostenida remanentes. `MC_KEYS.length ===
    Object.keys(MC_GAMES).length === 324` (regresión de wiring intacta).
    Probado visualmente en el navegador: módulo "Herramientas y Materiales"
    (1° básico) con alternativas "Hilo y aguja"/"Regla"/"Pegamento"/"Tijera"
    en oración normal, una ronda jugada completa (respuesta incorrecta mostró
    el overlay "Sirve para medir y trazar líneas rectas. Esa herramienta es
    regla." con capitalización correcta); módulo "Análisis de Soluciones
    Tecnológicas" (8° básico) con las 4 alternativas en oración normal. Sin
    errores de consola en ningún caso. Próximo paso del mismo pedido:
    `orientacion.js` (36 alternativas).
- **`orientacion.js` en oración normal (2026-08-01, noveno archivo del rollout tras
  `historia.js`/`ciencias.js`/`lenguaje.js`/`ingles.js`/`edfisica.js`/`artes.js`/
  `musica.js`/`tecnologia.js`):** mismo pedido, mismo criterio ("procede"). El
  contenido ALL-CAPS real estaba en 3 lugares: las 6 etiquetas de emoción
  (`EMOCIONES_ITEMS`, `EMOCIONES_LABELS_2`, `EMOCIONES_ESCENAS_2` — 1° y 2°
  básico), `PREVENCION_6_BANK` (6° básico, contenido protegido de prevención de
  tabaco/alcohol/marihuana), y **19 apariciones del literal `{label:'VERDADERO',
  value:true},{label:'FALSO', value:false}`** repetido en generadores de
  verdadero/falso a lo largo de todo el archivo (1°-8° básico) — este último ya
  se había convertido en `ciencias.js` (`'Verdadero'`/`'Falso'`) pero nunca en
  `orientacion.js`, así que se unificó aquí con `replace_all` en una sola edición.
  Archivo convertido a mano vía `Edit` (sin script de PowerShell), mismo criterio
  de tamaño que `tecnologia.js`.
  - **Contenido protegido, tocado con cuidado:** `PREVENCION_6_BANK` es el banco
    de prevención de drogas de 6° básico, documentado como contenido sensible ya
    revisado y confirmado con el usuario en sesiones anteriores. Se convirtió
    **solo el case** de `correcta`/`opts` (10 ítems), preservando el texto, los
    hechos y el tono preventivo/factual exactamente igual — verificado
    comparando cada string original contra su versión convertida antes de
    aplicar el cambio, y probado visualmente en el navegador para confirmar que
    ninguna palabra cambió, solo mayúscula/minúscula.
  - **Clasificación de los 17 usos de `.toLowerCase()` del archivo:** 14
    removidos (9 del patrón `'Lo mejor es "'+item.correcta.toLowerCase()+'"'`,
    4 del patrón `'Lo mejor es: '+item.correcta.toLowerCase()+'.'` en los
    generadores de 7°-8° básico, y 1 de `'La respuesta correcta es: '+item.
    correcta.toLowerCase()+'.'` en `genPrevencion6Round`) — todos citan la
    respuesta como entidad, mismo criterio que el resto del rollout. 3 se
    dejaron intactos por ser embeds mid-oración que nombran el ítem específico
    dentro de una oración ya empezada (mismo criterio que "Ese timbre
    corresponde al X" de `musica.js`): `'Ante esa situación, lo más común es
    sentir <b>'+item.emocion.toLowerCase()+'</b>.'`, `'Esta cara muestra <b>'+
    item.label.toLowerCase()+'</b>: '+item.desc.toLowerCase()`, y `'Esa
    descripción corresponde a la <b>'+item.label.toLowerCase()+'</b>.'`
    (`genEmocionesRound`, 1° básico).
  - Verificado: los 34 generadores pasan fuzz de 300 iteraciones cada uno (sin
    `THROW`, sin `undefined`, sin opciones duplicadas, `correctValue` siempre
    presente, sin apóstrofes en `speakText`). Grep dedicado confirmó 0 cadenas
    de 2+ letras en mayúscula sostenida remanentes. `MC_KEYS.length ===
    Object.keys(MC_GAMES).length === 324` (regresión de wiring intacta).
    Probado visualmente en el navegador: módulo "Mis Emociones" (1° básico) con
    alternativas "Cariño"/"Alegría"/"Sorpresa"/"Rabia" en oración normal, una
    ronda jugada completa (respuesta incorrecta mostró el overlay "Esta cara
    muestra cariño: sientes esto cuando quieres mucho a alguien." con
    capitalización correcta); módulo "Prevención VI" (6° básico, contenido
    protegido) con las 4 alternativas en oración normal y el texto/hechos
    intactos. Sin errores de consola en ningún caso. Próximo paso del mismo
    pedido: `matematica.js` (27 alternativas) — último archivo del rollout.
- **`matematica.js` en oración normal (2026-08-01, décimo y ÚLTIMO archivo del
  rollout, tras `historia.js`/`ciencias.js`/`lenguaje.js`/`ingles.js`/
  `edfisica.js`/`artes.js`/`musica.js`/`tecnologia.js`/`orientacion.js`):**
  mismo pedido, mismo criterio ("procede"). Con esto el rollout de armonía
  visual de alternativas queda **completo en las 10 asignaturas de la app**.
  El conteo real fue de ~252 cadenas ALL-CAPS (mucho más que la estimación
  original de 27, subestimada igual que `musica.js`/`lenguaje.js` en su
  momento), repartidas en decenas de bancos a lo largo de 1°-8° básico —
  convertido a mano vía `Edit` en vez de script de PowerShell, dado el
  volumen manejable y para evitar por completo el riesgo de los bugs de
  metodología ya documentados.
  - **El archivo más complejo del rollout por sus dependencias internas.**
    A diferencia de los archivos anteriores (donde cada alternativa era
    independiente), `matematica.js` reutiliza el mismo valor ALL-CAPS en
    varios lugares dentro de una misma función: como valor de banco, como
    entrada de un array `todos`/distractor usado con `.filter()`, y como
    `label`/`value` de la opción mostrada — los tres deben convertirse
    *consistentemente* dentro del generador, o la comparación `item.tipo===
    '...'`/el `.filter()` se rompe silenciosamente. Se resolvió generador
    por generador, verificando cada conjunto cerrado de categorías (p. ej.
    `['TRASLACIÓN','REFLEXIÓN','ROTACIÓN']`) y actualizando el banco, el
    array de distractores y las comparaciones `===`/ternarios en el mismo
    paso.
  - **Bug real de shared-helper por case-sensitividad, igual a
    `colorSwatchSVG`/`lineTypeSVG` de `artes.js`:** `anguloSVG(tipo, size)`
    (`js/svg.js`) comparaba `tipo==='RECTO'`/`'AGUDO'` con `===` exacto.
    `ANGULOS_POOL = ['RECTO','AGUDO','OBTUSO']` (usado en Geometría III/IV,
    3°-4° básico) se pasa directo como `tipo` a `anguloSVG()` — de haberse
    convertido el pool a `['Recto','Agudo','Obtuso']` sin tocar el helper,
    **todo ángulo se habría dibujado como obtuso (el valor de respaldo)**,
    sin ningún error de consola que lo delatara (mismo patrón silencioso que
    el bug de `colorSwatchSVG`). Corregido normalizando el `tipo` a
    mayúscula al inicio de `anguloSVG()` (`tipo = String(tipo||'').
    toUpperCase();`), para que funcione sin importar el case que reciba.
    Verificado en el navegador vía `anguloSVG('Recto',100)` extrayendo las
    coordenadas del SVG resultante: ángulo de 90° exacto (antes del fix
    habría dado 130°, el ángulo obtuso de respaldo).
  - **Bug real de bare ALL-CAPS object key** (bug class #1, ya documentado en
    archivos anteriores): `const gradosMap = {RECTO:90, AGUDO:45,
    OBTUSO:130};` en `genGeometria4Round` — nunca tocado por el regex de
    cadenas entre comillas (son identificadores de clave, no strings).
    Corregido a `{Recto:90, Agudo:45, Obtuso:130}`, consistente con el nuevo
    `ANGULOS_POOL`.
  - **Distinción clave aplicada en todo el archivo: cuándo convertir SOLO el
    `label` de una opción vs. cuándo convertir el valor de origen completo.**
    Cuando `label` y `value` ya eran distintos en el código original (p. ej.
    `{label:'PROPORCIÓN DIRECTA', value:'DIRECTA'}`, `{label:'NÚMERO PRIMO',
    value:'PRIMO'}`, `{label:'TABLA DE FRECUENCIAS', value:'TABLA'}`), el
    `value` es un token interno que nunca se muestra al niño — se dejó
    intacto y solo se convirtió el `label` visible. Cuando `label===value`
    (la misma variable se usa para ambos, p. ej. `{label:t, value:t}` con
    `t` viniendo de un array de categorías), se convirtió el **banco de
    origen completo** (la constante, el array `todos` de distractores, y
    cualquier comparación `===`/ternario que dependa de ese valor) para que
    la opción mostrada y el token interno seguido de coincidir. Aplicó a:
    `TRANSFORMACIONES_BANK`/`todos` (5° básico), `PROBABILIDAD_CUALITATIVA_
    BANK`/`todos`, `TESELADO_TRANSFORMACIONES_BANK`/`todos`,
    `TRIANGULO_LADOS_BANK_GEN` (con su propio distractor array y ternario de
    `explain`), `ANGULO_GRADOS_BANK`/`todos`, `TRANSFORMACION_8_BANK`
    (6°-8° básico), y `FRACCIÓN PROPIA`/`FRACCIÓN IMPROPIA` en
    `genFracciones5Round` (encontrado en una segunda pasada de verificación:
    el `label` se mostraba directo en ALL-CAPS sin ningún `.toLowerCase()`
    en ningún lado, a diferencia de la mayoría de los casos similares del
    archivo).
  - **"Unidades" de medida ALL-CAPS bajadas a minúscula (no a oración),
    siguiendo la convención ya establecida en el resto del archivo** (cm, m,
    kg ya aparecían en minúscula en otros bancos): `' UNIDADES CUADRADAS'`→
    `' unidades cuadradas'`, `' CUBOS'`→`' cubos'` (sufijos concatenados tras
    un número, no oraciones), las opciones de dígitos `'1 DÍGITO'`/
    `'2 DÍGITOS'`→`'1 dígito'`/`'2 dígitos'`, y `CONVERSION_LONGITUD_BANK`
    (`de`/`a`: `'KM'/'M'/'CM'/'MM'`→`'km'/'m'/'cm'/'mm'`, abreviaturas de
    unidad SI, no texto en mayúscula sostenida).
  - **Ternarios de énfasis ALL-CAPS mid-oración (bug class #3), cosméticos
    en su mayoría porque ya se consumían vía `.toLowerCase()` en el punto de
    uso, mostrando su fuente ya en minúscula por consistencia:** `vista===
    'frente'?'DE FRENTE':...`→`'de frente'` (siempre lowercased antes de
    mostrarse, sin efecto funcional); `(askMax?'MÁS':'MENOS')`,
    `(preguntaMax?'MÁS ALTO':'MÁS BAJO')` en `genDatos4Round`/`genDatos5Round`/
    `genDatos6Round` — estos SÍ se insertaban directo en el HTML sin pasar
    por `.toLowerCase()`, así que si tenían efecto visual real y se
    corrigieron a minúscula.
  - **Clasificación de los 2 únicos `.toLowerCase()` removidos de 36
    totales:** ambos coinciden exactamente con el patrón "La respuesta
    correcta es: X" ya establecido en todo el rollout —
    `genExperimentosAleatorios` (dentro de `genDatos4Round`) y el banco
    `enganosos` de `genEstadisticaCombinatoria8Round`. Los 34 restantes son
    embeds mid-oración o clasificaciones de categoría ("Esto es una X",
    "Esta figura es un X", "Es un ángulo X") y se dejaron intactos, mismo
    criterio del resto del rollout.
  - Verificado: los 60 generadores del archivo pasan fuzz de 300 iteraciones
    cada uno (sin `THROW`, sin `undefined`, sin opciones duplicadas,
    `correctValue` siempre presente, sin apóstrofes en `speakText`). Grep
    dedicado confirmó que las únicas cadenas ALL-CAPS remanentes son tokens
    internos nunca mostrados en pantalla (verificado caso por caso: `kind`/
    `cifraPos`/`tipo` de variables usadas solo vía `.toLowerCase()`, y
    `value` de opciones donde `label` ya está en oración normal). `MC_KEYS.
    length === Object.keys(MC_GAMES).length === 324` (regresión de wiring
    intacta). Probado visualmente en el navegador: módulo "Formas" (1°
    básico) con alternativas "Círculo"/"Rombo"/"Óvalo"/"Cuadrado"; módulo
    "Geometría III" (3° básico) con el módulo de ángulos mostrando "Obtuso"/
    "Recto"/"Agudo" en oración normal y el SVG del ángulo recto renderizando
    exactamente 90° (confirmando que el fix de `anguloSVG` funciona); módulo
    "Triángulos y Teselados" (6° básico) con una ronda de transformación
    ("Rotación"/"Traslación"/"Reflexión") y una ronda de clasificación de
    triángulo por lados ("Isósceles"/"Equilátero"/"Escaleno"), ambas en
    oración normal, avanzando correctamente tras responder. Sin errores de
    consola en ningún caso.

**Con esto, el rollout completo de MAYÚSCULAS→oración normal queda terminado
en las 10 asignaturas de la app** (historia, ciencias, lenguaje, inglés,
educación física, artes, música, tecnología, orientación, matemática) —
iniciado el 2026-07-26 con `historia.js` y completado el 2026-08-01 con
`matematica.js`. Cualquier archivo nuevo de contenido que se agregue de aquí
en adelante (Educación Media, EPJA, o expansión de Estudio para Pruebas)
debe escribirse directamente en oración normal desde el principio — este
rollout no necesita repetirse si el patrón se sigue por defecto en contenido
nuevo.
