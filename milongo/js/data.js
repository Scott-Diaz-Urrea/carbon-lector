// Datos fijos: tipos de registro, vacunas, comandos de entrenamiento y guías por edad.
// Son guías generales; no reemplazan al veterinario.
import { ageMonths } from './util.js';

export const EVENT_TYPES = {
  agua: { icon: '💧', label: 'Cambio de agua', short: 'Agua' },
  comida: { icon: '🍖', label: 'Comida', short: 'Comida' },
  paseo: { icon: '🚶', label: 'Paseo', short: 'Paseo' },
  pipi: { icon: '💦', label: 'Pipí', short: 'Pipí' },
  popo: { icon: '💩', label: 'Popó', short: 'Popó' },
  sueno: { icon: '😴', label: 'Sueño', short: 'Sueño' },
  bano: { icon: '🛁', label: 'Baño (higiene)', short: 'Baño' },
  cepillado: { icon: '🦷', label: 'Cepillado de dientes', short: 'Dientes' },
  unas: { icon: '✂️', label: 'Corte de uñas', short: 'Uñas' },
  juego: { icon: '🎾', label: 'Juego', short: 'Juego' },
  entreno: { icon: '🎓', label: 'Entrenamiento', short: 'Entreno' },
  medicina: { icon: '💊', label: 'Medicina', short: 'Medicina' },
  otro: { icon: '📝', label: 'Otro', short: 'Otro' },
};
// Botones de registro con un solo toque (paseo y sueño tienen cronómetro aparte).
export const QUICK = ['agua', 'comida', 'pipi', 'popo', 'bano', 'cepillado', 'unas', 'juego', 'medicina', 'otro'];

export const VACCINE_NAMES = ['Séxtuple / Óctuple', 'Antirrábica', 'Tos de las perreras (Bordetella)', 'Leptospirosis', 'Coronavirus', 'Giardia'];
export const VACCINE_PLAN = [
  ['6–8 semanas', 'Primera dosis múltiple (séxtuple / óctuple)'],
  ['10–12 semanas', 'Refuerzo de la múltiple'],
  ['14–16 semanas', 'Último refuerzo de la múltiple + antirrábica'],
  ['Cada año', 'Refuerzo anual de la múltiple y de la antirrábica'],
];
export const BRACHY = /pug|carlino|bulldog|boxer|boston|shih|pekin|pequin|chow/i;

export const SKILLS = [
  { id: 'sentado', icon: '🪑', name: 'Sentado', nivel: 'Básico', steps: ['Sostén un premio frente a su nariz.', 'Súbelo despacio sobre su cabeza: al seguirlo se sienta.', 'En cuanto el trasero toque el suelo, di "sentado" y dale el premio.'], tip: 'Repite 5 veces por sesión y luego di la palabra antes del gesto.' },
  { id: 'ven', icon: '📣', name: 'Ven (llamado)', nivel: 'Básico', steps: ['Parte en un lugar sin distracciones, a 2 pasos de distancia.', 'Di su nombre + "ven" con voz alegre y retrocede.', 'Cuando llegue, celebra y dale un premio rico.'], tip: 'Nunca lo llames para retarlo: tiene que ser siempre algo bueno.' },
  { id: 'echado', icon: '🛌', name: 'Echado', nivel: 'Básico', steps: ['Parte con el perrito sentado.', 'Baja el premio desde su nariz hasta el suelo, entre las patas.', 'Cuando se estire, di "echado" y premia.'], tip: 'Si se para, vuelve al paso anterior sin retar.' },
  { id: 'quieto', icon: '✋', name: 'Quieto / Espera', nivel: 'Intermedio', steps: ['Pídele "sentado" y muestra la palma abierta diciendo "quieto".', 'Cuenta 1 segundo, premia, y suéltalo con "ya".', 'Sube el tiempo de a poco: 2, 5, 10 segundos.'], tip: 'Aumenta primero el tiempo, después la distancia, después las distracciones.' },
  { id: 'pata', icon: '🐾', name: 'Pata', nivel: 'Básico', steps: ['Con el perrito sentado, toca suavemente su pata.', 'Cuando la levante, di "pata" y premia.', 'Después pídelo sin tocar.'], tip: 'Es un truco ideal para partir: casi todos lo aprenden rápido.' },
  { id: 'dejar', icon: '🚫', name: 'Dejar / Suelta', nivel: 'Intermedio', steps: ['Ten un premio en la mano cerrada y deja que la huela.', 'Cuando se aleje o deje de insistir, di "bien" y dale un premio de la otra mano.', 'Luego practica con un objeto en el suelo.'], tip: 'Sirve para evitar que se coma cosas peligrosas en la calle.' },
  { id: 'cama', icon: '🛏️', name: 'A tu cama', nivel: 'Intermedio', steps: ['Lleva un premio hasta su cama y deja que lo siga.', 'Cuando tenga las patas sobre la cama, di "a tu cama" y premia.', 'Pídele después que se eche y espere ahí.'], tip: 'Es un buen lugar de calma para cuando llegan visitas.' },
  { id: 'correa', icon: '🦮', name: 'Caminar sin tirar', nivel: 'Avanzado', steps: ['Parte en casa, con la correa suelta y premios a la altura de tu pierna.', 'Cada vez que la correa está floja, di "bien" y premia.', 'Si tira, detente. Avanza solo cuando vuelva a tu lado.'], tip: 'Con perros braquicéfalos (pug, bulldog) usa arnés en vez de collar.' },
  { id: 'mirarme', icon: '👀', name: 'Mírame', nivel: 'Básico', steps: ['Muestra un premio, llévalo a tu cara y di "mírame".', 'Cuando te mire a los ojos, premia.', 'Alarga de a poco el tiempo de contacto visual.'], tip: 'Es la base para controlarlo cuando hay distracciones.' },
  { id: 'esperar', icon: '🥣', name: 'Esperar para comer', nivel: 'Intermedio', steps: ['Sostén el plato y pídele "sentado".', 'Bájalo despacio: si se levanta, súbelo de nuevo.', 'Cuando espere, di "ya" y déjalo comer.'], tip: 'Enseña autocontrol y tranquilidad a la hora de comer.' },
  { id: 'afuera', icon: '🌳', name: 'Hacer sus necesidades afuera', nivel: 'Básico', steps: ['Sácalo después de comer, de dormir y de jugar.', 'Ve siempre al mismo lugar y espera en silencio.', 'Apenas termine, celebra y dale un premio ahí mismo.'], tip: 'Nunca lo retes por un accidente: limpia con un producto sin olor a amoníaco.' },
  { id: 'vuelta', icon: '🔄', name: 'Vuelta', nivel: 'Intermedio', steps: ['Guía su nariz con un premio en círculo.', 'Cuando complete la vuelta, di "vuelta" y premia.', 'Reduce el movimiento de la mano hasta que sea solo una señal.'], tip: 'Practica en ambas direcciones.' },
];
export const SKILL_LEVELS = ['Nuevo', 'Aprendiendo', 'Casi listo', 'Dominado'];
export const TRAIN_TIPS = [
  'Sesiones cortas: 5 a 10 minutos, 2 o 3 veces al día.',
  'Premia en el momento exacto; un segundo de atraso confunde.',
  'Termina siempre con algo que le salga bien.',
  'Premios pequeños (del tamaño de una lenteja) para no pasarse de comida.',
  'Nunca castigues: si no resulta, vuelve un paso atrás.',
];

// Guías según edad y peso. Devuelve textos listos para mostrar.
export function guideFor(dog, kg) {
  const m = ageMonths(dog.birth);
  const adult = m == null || m >= 12;
  const senior = m != null && m >= 84;
  const g = {};
  g.sleep = m == null ? '12–14 h al día' : m < 4 ? '18–20 h al día' : m < 12 ? '14–18 h al día' : senior ? '12–16 h al día' : '12–14 h al día';
  g.meals = m == null ? 2 : m < 4 ? 4 : m < 6 ? 3 : m < 12 ? 3 : 2;
  g.toilet = m == null ? 'entre 3 y 5 veces al día' : m < 3 ? 'cada 1 a 2 horas' : m < 6 ? 'cada 3 a 4 horas' : 'entre 3 y 5 veces al día';
  g.walk = m != null && m < 6 ? 'unos ' + Math.max(5, m * 5) + ' min, hasta 2 veces al día' : BRACHY.test(dog.breed || '') ? '20–40 min al día, evitando el calor' : '30–60 min al día';
  if (kg) {
    const [a, b] = m == null ? [20, 30] : m < 6 ? [40, 60] : m < 12 ? [30, 40] : senior ? [18, 25] : [20, 30];
    g.food = Math.round(kg * a) + '–' + Math.round(kg * b) + ' g de croquetas al día';
    g.water = Math.round(kg * 50) + '–' + Math.round(kg * 60) + ' ml al día';
  }
  g.brachy = BRACHY.test(dog.breed || '');
  return g;
}
export function nextParasite(kind, dateKey, ageM, addMonthsKey) {
  if (kind === 'externa') return addMonthsKey(dateKey, 1);
  return addMonthsKey(dateKey, ageM != null && ageM < 6 ? 1 : 3);
}
