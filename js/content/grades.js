export const GRADES = [
  { id:1, label:'1° Básico', open:true },
  { id:2, label:'2° Básico', open:true },
  { id:3, label:'3° Básico', open:true },
  { id:4, label:'4° Básico', open:true },
  { id:5, label:'5° Básico', open:true },
  { id:6, label:'6° Básico', open:false },
  { id:7, label:'7° Básico', open:false },
  { id:8, label:'8° Básico', open:false },
];
export const GRADE_POS = [
  {x:22,y:92},{x:68,y:80},{x:24,y:68},{x:70,y:56},{x:24,y:44},{x:70,y:32},{x:24,y:20},{x:70,y:8}
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
