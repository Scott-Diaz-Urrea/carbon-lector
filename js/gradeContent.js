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

/* Núcleos de aprendizaje de Educación Parvularia. Solo Pensamiento Matemático
   (núcleo del ámbito Interacción y Comprensión del Entorno) tiene contenido
   jugable por ahora — el resto queda documentado pero bloqueado, mismo patrón
   que las asignaturas de Básica sin construir. Para agregar un núcleo nuevo:
   crear su <NOMBRE>_MODULES/_POS (en content/parvularia/<nombre>.js), su
   <NOMBRE>_BY_NIVEL, su render<Nombre>Map() en render.js, el `else if` en
   render(), y agregar `byNivel`+`screen` a su entrada aquí. */
export const NUCLEO_DEFS = [
  { icon:'🗣️', label:'Lenguaje Verbal', screen:null, byNivel:null },
  { icon:'🎭', label:'Lenguajes Artísticos', screen:null, byNivel:null },
  { icon:'💛', label:'Identidad y Autonomía', screen:null, byNivel:null },
  { icon:'🤝', label:'Convivencia y Ciudadanía', screen:null, byNivel:null },
  { icon:'🤸', label:'Corporalidad y Movimiento', screen:null, byNivel:null },
  { icon:'🌱', label:'Exploración del Entorno Natural', screen:null, byNivel:null },
  { icon:'🏘️', label:'Comprensión del Entorno Sociocultural', screen:null, byNivel:null },
  { icon:'🔢', label:'Pensamiento Matemático', screen:'pensamientoMatematicoMap', byNivel: PENSAMIENTO_MATEMATICO_BY_NIVEL },
];
