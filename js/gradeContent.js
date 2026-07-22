import { LENGUAJE_MODULES, LENGUAJE_POS, LENGUAJE_MODULES_G2, LENGUAJE_POS_G2, LENGUAJE_MODULES_G3, LENGUAJE_POS_G3, LENGUAJE_MODULES_G4, LENGUAJE_POS_G4, LENGUAJE_MODULES_G5, LENGUAJE_POS_G5, LENGUAJE_MODULES_G6, LENGUAJE_POS_G6, LENGUAJE_MODULES_G7, LENGUAJE_POS_G7 } from './content/lenguaje.js';
import { MATE_MODULES, MATE_POS, MATE_MODULES_G2, MATE_POS_G2, MATE_MODULES_G3, MATE_POS_G3, MATE_MODULES_G4, MATE_POS_G4, MATE_MODULES_G5, MATE_POS_G5, MATE_MODULES_G6, MATE_POS_G6, MATE_MODULES_G7, MATE_POS_G7 } from './content/matematica.js';
import { CIENCIAS_MODULES, CIENCIAS_POS, CIENCIAS_MODULES_G2, CIENCIAS_POS_G2, CIENCIAS_MODULES_G3, CIENCIAS_POS_G3, CIENCIAS_MODULES_G4, CIENCIAS_POS_G4, CIENCIAS_MODULES_G5, CIENCIAS_POS_G5, CIENCIAS_MODULES_G6, CIENCIAS_POS_G6, CIENCIAS_MODULES_G7, CIENCIAS_POS_G7 } from './content/ciencias.js';
import { HISTORIA_MODULES, HISTORIA_POS, HISTORIA_MODULES_G2, HISTORIA_POS_G2, HISTORIA_MODULES_G3, HISTORIA_POS_G3, HISTORIA_MODULES_G4, HISTORIA_POS_G4, HISTORIA_MODULES_G5, HISTORIA_POS_G5, HISTORIA_MODULES_G6, HISTORIA_POS_G6, HISTORIA_MODULES_G7, HISTORIA_POS_G7 } from './content/historia.js';
import { ARTES_MODULES, ARTES_POS, ARTES_MODULES_G2, ARTES_POS_G2, ARTES_MODULES_G3, ARTES_POS_G3, ARTES_MODULES_G4, ARTES_POS_G4, ARTES_MODULES_G5, ARTES_POS_G5, ARTES_MODULES_G6, ARTES_POS_G6, ARTES_MODULES_G7, ARTES_POS_G7 } from './content/artes.js';
import { MUSICA_MODULES, MUSICA_POS, MUSICA_MODULES_G2, MUSICA_POS_G2, MUSICA_MODULES_G3, MUSICA_POS_G3, MUSICA_MODULES_G4, MUSICA_POS_G4, MUSICA_MODULES_G5, MUSICA_POS_G5, MUSICA_MODULES_G6, MUSICA_POS_G6, MUSICA_MODULES_G7, MUSICA_POS_G7 } from './content/musica.js';
import { EDFISICA_MODULES, EDFISICA_POS, EDFISICA_MODULES_G2, EDFISICA_POS_G2, EDFISICA_MODULES_G3, EDFISICA_POS_G3, EDFISICA_MODULES_G4, EDFISICA_POS_G4, EDFISICA_MODULES_G5, EDFISICA_POS_G5, EDFISICA_MODULES_G6, EDFISICA_POS_G6, EDFISICA_MODULES_G7, EDFISICA_POS_G7 } from './content/edfisica.js';
import { ORIENTACION_MODULES, ORIENTACION_POS, ORIENTACION_MODULES_G2, ORIENTACION_POS_G2, ORIENTACION_MODULES_G3, ORIENTACION_POS_G3, ORIENTACION_MODULES_G4, ORIENTACION_POS_G4, ORIENTACION_MODULES_G5, ORIENTACION_POS_G5, ORIENTACION_MODULES_G6, ORIENTACION_POS_G6, ORIENTACION_MODULES_G7, ORIENTACION_POS_G7 } from './content/orientacion.js';
import { TECNOLOGIA_MODULES, TECNOLOGIA_POS, TECNOLOGIA_MODULES_G2, TECNOLOGIA_POS_G2, TECNOLOGIA_MODULES_G3, TECNOLOGIA_POS_G3, TECNOLOGIA_MODULES_G4, TECNOLOGIA_POS_G4, TECNOLOGIA_MODULES_G5, TECNOLOGIA_POS_G5, TECNOLOGIA_MODULES_G6, TECNOLOGIA_POS_G6, TECNOLOGIA_MODULES_G7, TECNOLOGIA_POS_G7 } from './content/tecnologia.js';
import { INGLES_MODULES_G5, INGLES_POS_G5, INGLES_MODULES_G6, INGLES_POS_G6, INGLES_MODULES_G7, INGLES_POS_G7 } from './content/ingles.js';
import { PENSAMIENTO_MATEMATICO_MODULES, PENSAMIENTO_MATEMATICO_POS } from './content/parvularia/pensamientoMatematico.js';
import { LENGUAJE_VERBAL_MODULES, LENGUAJE_VERBAL_POS } from './content/parvularia/lenguajeVerbal.js';
import { LENGUAJES_ARTISTICOS_MODULES, LENGUAJES_ARTISTICOS_POS } from './content/parvularia/lenguajesArtisticos.js';
import { IDENTIDAD_AUTONOMIA_MODULES, IDENTIDAD_AUTONOMIA_POS } from './content/parvularia/identidadAutonomia.js';
import { CONVIVENCIA_CIUDADANIA_MODULES, CONVIVENCIA_CIUDADANIA_POS } from './content/parvularia/convivenciaCiudadania.js';
import { CORPORALIDAD_MOVIMIENTO_MODULES, CORPORALIDAD_MOVIMIENTO_POS } from './content/parvularia/corporalidadMovimiento.js';
import { EXPLORACION_ENTORNO_NATURAL_MODULES, EXPLORACION_ENTORNO_NATURAL_POS } from './content/parvularia/exploracionEntornoNatural.js';
import { COMPRENSION_ENTORNO_SOCIOCULTURAL_MODULES, COMPRENSION_ENTORNO_SOCIOCULTURAL_POS } from './content/parvularia/comprensionEntornoSociocultural.js';

export const LENGUAJE_BY_GRADE = {
  1: { modules: LENGUAJE_MODULES, pos: LENGUAJE_POS, height: 420 },
  2: { modules: LENGUAJE_MODULES_G2, pos: LENGUAJE_POS_G2, height: 360 },
  3: { modules: LENGUAJE_MODULES_G3, pos: LENGUAJE_POS_G3, height: 480 },
  4: { modules: LENGUAJE_MODULES_G4, pos: LENGUAJE_POS_G4, height: 360 },
  5: { modules: LENGUAJE_MODULES_G5, pos: LENGUAJE_POS_G5, height: 440 },
  6: { modules: LENGUAJE_MODULES_G6, pos: LENGUAJE_POS_G6, height: 440 },
  7: { modules: LENGUAJE_MODULES_G7, pos: LENGUAJE_POS_G7, height: 440 },
};
export const MATE_BY_GRADE = {
  1: { modules: MATE_MODULES, pos: MATE_POS, height: 360 },
  2: { modules: MATE_MODULES_G2, pos: MATE_POS_G2, height: 360 },
  3: { modules: MATE_MODULES_G3, pos: MATE_POS_G3, height: 700 },
  4: { modules: MATE_MODULES_G4, pos: MATE_POS_G4, height: 700 },
  5: { modules: MATE_MODULES_G5, pos: MATE_POS_G5, height: 760 },
  6: { modules: MATE_MODULES_G6, pos: MATE_POS_G6, height: 760 },
  7: { modules: MATE_MODULES_G7, pos: MATE_POS_G7, height: 760 },
};
export const CIENCIAS_BY_GRADE = {
  1: { modules: CIENCIAS_MODULES, pos: CIENCIAS_POS, height: 420 },
  2: { modules: CIENCIAS_MODULES_G2, pos: CIENCIAS_POS_G2, height: 480 },
  3: { modules: CIENCIAS_MODULES_G3, pos: CIENCIAS_POS_G3, height: 560 },
  4: { modules: CIENCIAS_MODULES_G4, pos: CIENCIAS_POS_G4, height: 420 },
  5: { modules: CIENCIAS_MODULES_G5, pos: CIENCIAS_POS_G5, height: 420 },
  6: { modules: CIENCIAS_MODULES_G6, pos: CIENCIAS_POS_G6, height: 560 },
  7: { modules: CIENCIAS_MODULES_G7, pos: CIENCIAS_POS_G7, height: 480 },
};
export const HISTORIA_BY_GRADE = {
  1: { modules: HISTORIA_MODULES, pos: HISTORIA_POS, height: 420 },
  2: { modules: HISTORIA_MODULES_G2, pos: HISTORIA_POS_G2, height: 360 },
  3: { modules: HISTORIA_MODULES_G3, pos: HISTORIA_POS_G3, height: 340 },
  4: { modules: HISTORIA_MODULES_G4, pos: HISTORIA_POS_G4, height: 340 },
  5: { modules: HISTORIA_MODULES_G5, pos: HISTORIA_POS_G5, height: 340 },
  6: { modules: HISTORIA_MODULES_G6, pos: HISTORIA_POS_G6, height: 560 },
  7: { modules: HISTORIA_MODULES_G7, pos: HISTORIA_POS_G7, height: 560 },
};
export const ARTES_BY_GRADE = {
  1: { modules: ARTES_MODULES, pos: ARTES_POS, height: 340 },
  2: { modules: ARTES_MODULES_G2, pos: ARTES_POS_G2, height: 260 },
  3: { modules: ARTES_MODULES_G3, pos: ARTES_POS_G3, height: 260 },
  4: { modules: ARTES_MODULES_G4, pos: ARTES_POS_G4, height: 200 },
  5: { modules: ARTES_MODULES_G5, pos: ARTES_POS_G5, height: 200 },
  6: { modules: ARTES_MODULES_G6, pos: ARTES_POS_G6, height: 200 },
  7: { modules: ARTES_MODULES_G7, pos: ARTES_POS_G7, height: 200 },
};
export const MUSICA_BY_GRADE = {
  1: { modules: MUSICA_MODULES, pos: MUSICA_POS, height: 280 },
  2: { modules: MUSICA_MODULES_G2, pos: MUSICA_POS_G2, height: 260 },
  3: { modules: MUSICA_MODULES_G3, pos: MUSICA_POS_G3, height: 260 },
  4: { modules: MUSICA_MODULES_G4, pos: MUSICA_POS_G4, height: 200 },
  5: { modules: MUSICA_MODULES_G5, pos: MUSICA_POS_G5, height: 200 },
  6: { modules: MUSICA_MODULES_G6, pos: MUSICA_POS_G6, height: 200 },
  7: { modules: MUSICA_MODULES_G7, pos: MUSICA_POS_G7, height: 200 },
};
export const EDFISICA_BY_GRADE = {
  1: { modules: EDFISICA_MODULES, pos: EDFISICA_POS, height: 340 },
  2: { modules: EDFISICA_MODULES_G2, pos: EDFISICA_POS_G2, height: 340 },
  3: { modules: EDFISICA_MODULES_G3, pos: EDFISICA_POS_G3, height: 260 },
  4: { modules: EDFISICA_MODULES_G4, pos: EDFISICA_POS_G4, height: 260 },
  5: { modules: EDFISICA_MODULES_G5, pos: EDFISICA_POS_G5, height: 260 },
  6: { modules: EDFISICA_MODULES_G6, pos: EDFISICA_POS_G6, height: 260 },
  7: { modules: EDFISICA_MODULES_G7, pos: EDFISICA_POS_G7, height: 200 },
};
export const ORIENTACION_BY_GRADE = {
  1: { modules: ORIENTACION_MODULES, pos: ORIENTACION_POS, height: 340 },
  2: { modules: ORIENTACION_MODULES_G2, pos: ORIENTACION_POS_G2, height: 360 },
  3: { modules: ORIENTACION_MODULES_G3, pos: ORIENTACION_POS_G3, height: 360 },
  4: { modules: ORIENTACION_MODULES_G4, pos: ORIENTACION_POS_G4, height: 360 },
  5: { modules: ORIENTACION_MODULES_G5, pos: ORIENTACION_POS_G5, height: 440 },
  6: { modules: ORIENTACION_MODULES_G6, pos: ORIENTACION_POS_G6, height: 440 },
  7: { modules: ORIENTACION_MODULES_G7, pos: ORIENTACION_POS_G7, height: 440 },
};
export const TECNOLOGIA_BY_GRADE = {
  1: { modules: TECNOLOGIA_MODULES, pos: TECNOLOGIA_POS, height: 200 },
  2: { modules: TECNOLOGIA_MODULES_G2, pos: TECNOLOGIA_POS_G2, height: 200 },
  3: { modules: TECNOLOGIA_MODULES_G3, pos: TECNOLOGIA_POS_G3, height: 200 },
  4: { modules: TECNOLOGIA_MODULES_G4, pos: TECNOLOGIA_POS_G4, height: 200 },
  5: { modules: TECNOLOGIA_MODULES_G5, pos: TECNOLOGIA_POS_G5, height: 200 },
  6: { modules: TECNOLOGIA_MODULES_G6, pos: TECNOLOGIA_POS_G6, height: 200 },
  7: { modules: TECNOLOGIA_MODULES_G7, pos: TECNOLOGIA_POS_G7, height: 200 },
};
export const INGLES_BY_GRADE = {
  5: { modules: INGLES_MODULES_G5, pos: INGLES_POS_G5, height: 260 },
  6: { modules: INGLES_MODULES_G6, pos: INGLES_POS_G6, height: 260 },
  7: { modules: INGLES_MODULES_G7, pos: INGLES_POS_G7, height: 260 },
};

/* Ícono de Inglés: se evitó la bandera 🇬🇧 (emoji de bandera compuesto por
   2 "regional indicator" — mismo riesgo de renderizarse como texto plano
   "GB" en varias configuraciones de Windows que ya motivó chileFlagSVG() en
   svg.js) y se usó 🔤 (abecedario), un emoji simple con buen soporte. */
export const SUBJECT_DEFS = [
  { icon:'📖', label:'Lenguaje', screen:'lenguajeMap', byGrade: LENGUAJE_BY_GRADE },
  { icon:'🔢', label:'Matemáticas', screen:'matematicasMap', byGrade: MATE_BY_GRADE },
  { icon:'🔬', label:'Ciencias', screen:'cienciasMap', byGrade: CIENCIAS_BY_GRADE },
  { icon:'🗺️', label:'Historia', screen:'historiaMap', byGrade: HISTORIA_BY_GRADE },
  { icon:'🎨', label:'Artes Visuales', screen:'artesMap', byGrade: ARTES_BY_GRADE },
  { icon:'🎵', label:'Música', screen:'musicaMap', byGrade: MUSICA_BY_GRADE },
  { icon:'⚽', label:'Ed. Física', screen:'edfisicaMap', byGrade: EDFISICA_BY_GRADE },
  { icon:'🧭', label:'Orientación', screen:'orientacionMap', byGrade: ORIENTACION_BY_GRADE },
  { icon:'⚙️', label:'Tecnología', screen:'tecnologiaMap', byGrade: TECNOLOGIA_BY_GRADE },
  { icon:'🔤', label:'Inglés', screen:'inglesMap', byGrade: INGLES_BY_GRADE },
];

/* ---------------- Educación Parvularia (por nivel, no por año) ---------------- */
export const PENSAMIENTO_MATEMATICO_BY_NIVEL = {
  nt: { modules: PENSAMIENTO_MATEMATICO_MODULES, pos: PENSAMIENTO_MATEMATICO_POS, height: 700 },
};
export const LENGUAJE_VERBAL_BY_NIVEL = {
  nt: { modules: LENGUAJE_VERBAL_MODULES, pos: LENGUAJE_VERBAL_POS, height: 480 },
};
export const LENGUAJES_ARTISTICOS_BY_NIVEL = {
  nt: { modules: LENGUAJES_ARTISTICOS_MODULES, pos: LENGUAJES_ARTISTICOS_POS, height: 340 },
};
export const IDENTIDAD_AUTONOMIA_BY_NIVEL = {
  nt: { modules: IDENTIDAD_AUTONOMIA_MODULES, pos: IDENTIDAD_AUTONOMIA_POS, height: 340 },
};
export const CONVIVENCIA_CIUDADANIA_BY_NIVEL = {
  nt: { modules: CONVIVENCIA_CIUDADANIA_MODULES, pos: CONVIVENCIA_CIUDADANIA_POS, height: 340 },
};
export const CORPORALIDAD_MOVIMIENTO_BY_NIVEL = {
  nt: { modules: CORPORALIDAD_MOVIMIENTO_MODULES, pos: CORPORALIDAD_MOVIMIENTO_POS, height: 340 },
};
export const EXPLORACION_ENTORNO_NATURAL_BY_NIVEL = {
  nt: { modules: EXPLORACION_ENTORNO_NATURAL_MODULES, pos: EXPLORACION_ENTORNO_NATURAL_POS, height: 420 },
};
export const COMPRENSION_ENTORNO_SOCIOCULTURAL_BY_NIVEL = {
  nt: { modules: COMPRENSION_ENTORNO_SOCIOCULTURAL_MODULES, pos: COMPRENSION_ENTORNO_SOCIOCULTURAL_POS, height: 360 },
};

/* Núcleos de aprendizaje de Educación Parvularia — los 8 núcleos del nivel
   Transición (NT) ya tienen contenido jugable. Para agregar un núcleo nuevo
   en otro nivel (Sala Cuna/Medio, si algún día se decide construirlos): crear
   su <NOMBRE>_MODULES/_POS (en content/parvularia/<nombre>.js), su
   <NOMBRE>_BY_NIVEL, su render<Nombre>Map() en render.js, el `else if` en
   render(), y agregar `byNivel`+`screen` a su entrada aquí. */
export const NUCLEO_DEFS = [
  { icon:'🗣️', label:'Lenguaje Verbal', screen:'lenguajeVerbalMap', byNivel: LENGUAJE_VERBAL_BY_NIVEL },
  { icon:'🎭', label:'Lenguajes Artísticos', screen:'lenguajesArtisticosMap', byNivel: LENGUAJES_ARTISTICOS_BY_NIVEL },
  { icon:'💛', label:'Identidad y Autonomía', screen:'identidadAutonomiaMap', byNivel: IDENTIDAD_AUTONOMIA_BY_NIVEL },
  { icon:'🤝', label:'Convivencia y Ciudadanía', screen:'convivenciaCiudadaniaMap', byNivel: CONVIVENCIA_CIUDADANIA_BY_NIVEL },
  { icon:'🤸', label:'Corporalidad y Movimiento', screen:'corporalidadMovimientoMap', byNivel: CORPORALIDAD_MOVIMIENTO_BY_NIVEL },
  { icon:'🌱', label:'Exploración del Entorno Natural', screen:'exploracionEntornoNaturalMap', byNivel: EXPLORACION_ENTORNO_NATURAL_BY_NIVEL },
  { icon:'🏘️', label:'Comprensión del Entorno Sociocultural', screen:'comprensionEntornoSocioculturalMap', byNivel: COMPRENSION_ENTORNO_SOCIOCULTURAL_BY_NIVEL },
  { icon:'🔢', label:'Pensamiento Matemático', screen:'pensamientoMatematicoMap', byNivel: PENSAMIENTO_MATEMATICO_BY_NIVEL },
];
