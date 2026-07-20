import { LENGUAJE_MODULES, LENGUAJE_POS, LENGUAJE_MODULES_G2, LENGUAJE_POS_G2 } from './content/lenguaje.js';
import { MATE_MODULES, MATE_POS, MATE_MODULES_G2, MATE_POS_G2 } from './content/matematica.js';
import { CIENCIAS_MODULES, CIENCIAS_POS } from './content/ciencias.js';
import { HISTORIA_MODULES, HISTORIA_POS } from './content/historia.js';
import { ARTES_MODULES, ARTES_POS } from './content/artes.js';
import { MUSICA_MODULES, MUSICA_POS } from './content/musica.js';
import { EDFISICA_MODULES, EDFISICA_POS } from './content/edfisica.js';
import { ORIENTACION_MODULES, ORIENTACION_POS } from './content/orientacion.js';
import { TECNOLOGIA_MODULES, TECNOLOGIA_POS } from './content/tecnologia.js';
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
};
export const MATE_BY_GRADE = {
  1: { modules: MATE_MODULES, pos: MATE_POS, height: 360 },
  2: { modules: MATE_MODULES_G2, pos: MATE_POS_G2, height: 360 },
};
export const CIENCIAS_BY_GRADE = {
  1: { modules: CIENCIAS_MODULES, pos: CIENCIAS_POS, height: 420 },
};
export const HISTORIA_BY_GRADE = {
  1: { modules: HISTORIA_MODULES, pos: HISTORIA_POS, height: 420 },
};
export const ARTES_BY_GRADE = {
  1: { modules: ARTES_MODULES, pos: ARTES_POS, height: 340 },
};
export const MUSICA_BY_GRADE = {
  1: { modules: MUSICA_MODULES, pos: MUSICA_POS, height: 280 },
};
export const EDFISICA_BY_GRADE = {
  1: { modules: EDFISICA_MODULES, pos: EDFISICA_POS, height: 340 },
};
export const ORIENTACION_BY_GRADE = {
  1: { modules: ORIENTACION_MODULES, pos: ORIENTACION_POS, height: 340 },
};
export const TECNOLOGIA_BY_GRADE = {
  1: { modules: TECNOLOGIA_MODULES, pos: TECNOLOGIA_POS, height: 200 },
};

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
];

/* ---------------- Educación Parvularia (por nivel, no por año) ---------------- */
export const PENSAMIENTO_MATEMATICO_BY_NIVEL = {
  nt: { modules: PENSAMIENTO_MATEMATICO_MODULES, pos: PENSAMIENTO_MATEMATICO_POS, height: 700 },
};
export const LENGUAJE_VERBAL_BY_NIVEL = {
  nt: { modules: LENGUAJE_VERBAL_MODULES, pos: LENGUAJE_VERBAL_POS, height: 480 },
};
export const LENGUAJES_ARTISTICOS_BY_NIVEL = {
  nt: { modules: LENGUAJES_ARTISTICOS_MODULES, pos: LENGUAJES_ARTISTICOS_POS, height: 260 },
};
export const IDENTIDAD_AUTONOMIA_BY_NIVEL = {
  nt: { modules: IDENTIDAD_AUTONOMIA_MODULES, pos: IDENTIDAD_AUTONOMIA_POS, height: 340 },
};
export const CONVIVENCIA_CIUDADANIA_BY_NIVEL = {
  nt: { modules: CONVIVENCIA_CIUDADANIA_MODULES, pos: CONVIVENCIA_CIUDADANIA_POS, height: 340 },
};
export const CORPORALIDAD_MOVIMIENTO_BY_NIVEL = {
  nt: { modules: CORPORALIDAD_MOVIMIENTO_MODULES, pos: CORPORALIDAD_MOVIMIENTO_POS, height: 280 },
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
