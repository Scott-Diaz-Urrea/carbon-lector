export const GRADES = [
  { id:1, label:'1° Básico', open:true },
  { id:2, label:'2° Básico', open:true },
  { id:3, label:'3° Básico', open:true },
  { id:4, label:'4° Básico', open:true },
  { id:5, label:'5° Básico', open:true },
  { id:6, label:'6° Básico', open:true },
  { id:7, label:'7° Básico', open:true },
  { id:8, label:'8° Básico', open:true },
];
export const GRADE_POS = [
  {x:22,y:92},{x:68,y:80},{x:24,y:68},{x:70,y:56},{x:24,y:44},{x:70,y:32},{x:24,y:20},{x:70,y:8}
];

/* Educación Media (Decreto 614/2013 para 1°-2° medio, mismo decreto que
   7°-8° básico — 3°-4° medio usa un decreto distinto, con un Plan de
   Formación General + Plan Diferenciado, y todavía no está construido).
   Igual que Básica, se organiza año→asignatura con las mismas 10
   asignaturas — pero usa su propio estado/navegación (`currentMedioGrade`,
   `MEDIO_SUBJECT_DEFS`) en vez de reutilizar `GRADES`/`SUBJECT_DEFS`, para
   no mezclar los años 1-2 de Media con los años 1-8 de Básica bajo la misma
   clave numérica. Solo 1° medio tiene contenido jugable por ahora. */
export const MEDIO_GRADES = [
  { id:1, label:'1° Medio', open:true },
  { id:2, label:'2° Medio', open:false },
];
export const MEDIO_GRADE_POS = [
  {x:30,y:70},{x:70,y:30}
];

/* Educación Parvularia (Decreto 481/2017) no se organiza por "año" como Básica,
   sino por nivel: Sala Cuna (0-2), Nivel Medio (2-4), Nivel de Transición (4-6).
   Solo NT tiene módulos jugables — Sala Cuna y Nivel Medio son edades donde un
   juego de opción múltiple en pantalla no es desarrollo-apropiado, así que no se
   muestran como opción (ni siquiera bloqueadas): "Educación Parvularia" entra
   directo a NT en vez de pasar por una pantalla de selección de nivel. */
export const PARVULARIA_NIVELES = [
  { id:'nt', label:'Transición', open:true },
];

/* EPJA (Educación de Personas Jóvenes y Adultas) tampoco se organiza por año
   individual, sino por NIVELES que agrupan varios años en un solo examen de
   Validación de Estudios (Decreto Supremo N°10 de 2022, epja.mineduc.cl):
   Nivel 1 Básica = 1°-4° básico, Nivel 2 Básica = 5°-6°, Nivel 3 Básica =
   7°-8°, Nivel 1 Media = 1°-2° medio, Nivel 2 Media = 3°-4° medio. Los 5
   niveles ya tienen contenido jugable (ver content/epja/*Nivel1.js,
   *Nivel2.js, *Nivel3.js, *Media1.js, *Media2.js) — EPJA queda completo. */
export const EPJA_NIVELES = [
  { id:'n1basica', label:'Nivel 1 Básica', sub:'Equivale a 1° - 4° básico', open:true },
  { id:'n2basica', label:'Nivel 2 Básica', sub:'Equivale a 5° - 6° básico', open:true },
  { id:'n3basica', label:'Nivel 3 Básica', sub:'Equivale a 7° - 8° básico', open:true },
  { id:'n1media', label:'Nivel 1 Media', sub:'Equivale a 1° - 2° medio', open:true },
  { id:'n2media', label:'Nivel 2 Media', sub:'Equivale a 3° - 4° medio', open:true },
];
