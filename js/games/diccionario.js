/* =========================================================
   Diccionario Español / English Dictionary — herramienta de
   consulta (no es un juego: sin rondas, estrellas ni XP).
   Accesible desde la pantalla de etapas (etapaMap), pensada
   como apoyo transversal a todas las etapas escolares.

   Contenido 100% curado dentro de la app (sin API externa):
   una API de diccionario no garantiza contenido apto para
   niños, requeriría conexión permanente y rompería la regla
   de "cero dependencias" del proyecto. El banco es vocabulario
   escolar de uso frecuente, con definiciones simples en
   español de Chile y ejemplos cortos.

   La voz reutiliza speak() de js/audio.js: español por defecto
   para el Diccionario Español, y speak(texto, 'en') para el
   English Dictionary (mismo mecanismo speakLang que usa
   content/ingles.js desde 5° básico).

   El botón 🔊 usa onclick="diccSpeak(i)" con un índice sobre la
   lista visible (module state), en vez de incrustar el texto en
   el atributo onclick — así ninguna definición puede romper el
   HTML por comillas (la misma restricción documentada de
   speakText en mcEngine.js, resuelta aquí por diseño).
   ========================================================= */
import { speak } from '../audio.js';

const DICC_ES = [
  { p:'Abeja', t:'sustantivo', d:'Insecto volador de rayas amarillas y negras que fabrica miel y ayuda a las flores a reproducirse.', e:'La abeja vuela de flor en flor.' },
  { p:'Abrazo', t:'sustantivo', d:'Gesto de cariño que consiste en rodear a alguien con los brazos.', e:'Le dio un abrazo a su abuela al llegar.' },
  { p:'Agua', t:'sustantivo', d:'Líquido transparente y sin sabor que beben los seres vivos y cubre gran parte de la Tierra.', e:'Toma agua durante todo el día.' },
  { p:'Alegría', t:'sustantivo', d:'Emoción que sentimos cuando algo nos gusta o nos hace felices.', e:'Saltó de alegría con la noticia.' },
  { p:'Amable', t:'adjetivo', d:'Que trata a los demás con cariño y respeto.', e:'El vecino fue muy amable con nosotros.' },
  { p:'Amistad', t:'sustantivo', d:'Cariño y confianza entre personas que se quieren y se acompañan.', e:'Su amistad comenzó en el colegio.' },
  { p:'Aprender', t:'verbo', d:'Adquirir conocimientos o habilidades nuevas.', e:'Me gusta aprender cosas nuevas cada día.' },
  { p:'Árbol', t:'sustantivo', d:'Planta grande con tronco de madera, ramas y hojas.', e:'El árbol del patio da mucha sombra.' },
  { p:'Arcoíris', t:'sustantivo', d:'Arco de colores que aparece en el cielo cuando el sol ilumina la lluvia.', e:'Después de la lluvia salió un arcoíris.' },
  { p:'Ayudar', t:'verbo', d:'Hacer algo por otra persona para que le resulte más fácil.', e:'Voy a ayudar a mi hermana con su tarea.' },
  { p:'Barco', t:'sustantivo', d:'Vehículo que flota y sirve para viajar o transportar cosas por el agua.', e:'El barco cruzó el canal muy temprano.' },
  { p:'Biblioteca', t:'sustantivo', d:'Lugar donde se guardan y prestan libros para leer y estudiar.', e:'Pedí dos cuentos en la biblioteca.' },
  { p:'Bondad', t:'sustantivo', d:'Cualidad de las personas que hacen el bien y tratan bien a los demás.', e:'Su bondad se nota en cómo cuida a sus amigos.' },
  { p:'Bosque', t:'sustantivo', d:'Lugar con muchos árboles, plantas y animales.', e:'Caminamos por el bosque de araucarias.' },
  { p:'Brújula', t:'sustantivo', d:'Instrumento con una aguja que siempre apunta al norte y sirve para orientarse.', e:'Con la brújula encontramos el camino.' },
  { p:'Buscar', t:'verbo', d:'Intentar encontrar algo o a alguien.', e:'Vamos a buscar el libro en la estantería.' },
  { p:'Cariño', t:'sustantivo', d:'Sentimiento de amor y ternura hacia alguien.', e:'Trata a su mascota con mucho cariño.' },
  { p:'Casa', t:'sustantivo', d:'Lugar donde vive una persona o una familia.', e:'Mi casa queda cerca de la plaza.' },
  { p:'Ciencia', t:'sustantivo', d:'Conjunto de conocimientos que explican cómo funciona el mundo, obtenidos observando y experimentando.', e:'La ciencia estudia desde las estrellas hasta las células.' },
  { p:'Cocinar', t:'verbo', d:'Preparar alimentos para comerlos.', e:'Aprendimos a cocinar pan amasado.' },
  { p:'Compartir', t:'verbo', d:'Dar parte de lo que uno tiene a otras personas.', e:'Me gusta compartir mi colación.' },
  { p:'Cordillera', t:'sustantivo', d:'Conjunto de montañas unidas entre sí. En Chile, la más conocida es la cordillera de los Andes.', e:'La cordillera se ve nevada en invierno.' },
  { p:'Cuaderno', t:'sustantivo', d:'Conjunto de hojas de papel unidas donde se escribe o dibuja.', e:'Anoté la tarea en mi cuaderno.' },
  { p:'Curioso', t:'adjetivo', d:'Que tiene ganas de conocer, descubrir o entender cosas nuevas.', e:'Es un niño curioso: todo lo pregunta.' },
  { p:'Descubrir', t:'verbo', d:'Encontrar o conocer algo que no se conocía.', e:'Al mover la piedra descubrimos un caracol.' },
  { p:'Dibujar', t:'verbo', d:'Representar algo con líneas y formas sobre un papel u otra superficie.', e:'Voy a dibujar a mi familia.' },
  { p:'Diccionario', t:'sustantivo', d:'Libro o herramienta donde se explica qué significan las palabras, ordenadas alfabéticamente.', e:'Busqué la palabra en el diccionario.' },
  { p:'Dormir', t:'verbo', d:'Descansar con los ojos cerrados, sin estar despierto.', e:'Hay que dormir bien antes del colegio.' },
  { p:'Educación', t:'sustantivo', d:'Proceso de aprender y enseñar conocimientos, habilidades y valores.', e:'La educación abre muchas puertas.' },
  { p:'Ejemplo', t:'sustantivo', d:'Caso o hecho que sirve para explicar o ilustrar algo.', e:'La profesora dio un ejemplo en la pizarra.' },
  { p:'Energía', t:'sustantivo', d:'Capacidad para moverse, trabajar o producir cambios. La luz y el calor son formas de energía.', e:'El sol nos entrega energía todos los días.' },
  { p:'Equipo', t:'sustantivo', d:'Grupo de personas que trabajan o juegan juntas por un objetivo común.', e:'Nuestro equipo ganó el campeonato.' },
  { p:'Escuela', t:'sustantivo', d:'Lugar donde los niños y niñas van a aprender con sus profesores.', e:'La escuela queda a dos cuadras.' },
  { p:'Esfuerzo', t:'sustantivo', d:'Energía y empeño que se pone para lograr algo, aunque cueste.', e:'Con esfuerzo terminó todo el trabajo.' },
  { p:'Estrella', t:'sustantivo', d:'Cuerpo del espacio que brilla con luz propia. El Sol es una estrella.', e:'Anoche vimos una estrella muy brillante.' },
  { p:'Estudiar', t:'verbo', d:'Dedicar tiempo a aprender o comprender algo.', e:'Hoy voy a estudiar para la prueba.' },
  { p:'Familia', t:'sustantivo', d:'Grupo de personas unidas por parentesco o cariño que se cuidan entre sí.', e:'Mi familia almuerza junta los domingos.' },
  { p:'Felicidad', t:'sustantivo', d:'Estado de ánimo de quien se siente pleno y contento.', e:'La felicidad se nota en su sonrisa.' },
  { p:'Flor', t:'sustantivo', d:'Parte colorida de muchas plantas, de donde nacen los frutos y las semillas.', e:'El copihue es la flor nacional de Chile.' },
  { p:'Fruta', t:'sustantivo', d:'Alimento que dan algunas plantas, generalmente dulce, como la manzana o la frutilla.', e:'De colación traje fruta picada.' },
  { p:'Fuego', t:'sustantivo', d:'Luz y calor que se producen cuando algo se quema.', e:'El fuego de la chimenea calienta la casa.' },
  { p:'Galaxia', t:'sustantivo', d:'Conjunto enorme de estrellas, planetas, gas y polvo. La nuestra se llama Vía Láctea.', e:'Nuestra galaxia tiene millones de estrellas.' },
  { p:'Generoso', t:'adjetivo', d:'Que comparte lo que tiene y ayuda sin esperar algo a cambio.', e:'Fue generoso y repartió sus dulces.' },
  { p:'Gigante', t:'adjetivo', d:'Mucho más grande de lo normal.', e:'Ese árbol es gigante comparado con los demás.' },
  { p:'Gracias', t:'expresión', d:'Palabra que se usa para agradecer algo a alguien.', e:'Muchas gracias por tu ayuda.' },
  { p:'Hermano', t:'sustantivo', d:'Persona que tiene los mismos padres que otra.', e:'Mi hermano menor aprendió a andar en bicicleta.' },
  { p:'Historia', t:'sustantivo', d:'Relato de hechos; también, la ciencia que estudia el pasado de la humanidad.', e:'En historia aprendimos sobre los pueblos originarios.' },
  { p:'Hogar', t:'sustantivo', d:'Casa o lugar donde una persona vive y se siente segura y querida.', e:'No hay nada como volver al hogar.' },
  { p:'Honesto', t:'adjetivo', d:'Que dice la verdad y actúa de forma justa y correcta.', e:'Fue honesto y devolvió lo que encontró.' },
  { p:'Huerto', t:'sustantivo', d:'Terreno pequeño donde se cultivan verduras, frutas o hierbas.', e:'En el huerto del colegio plantamos lechugas.' },
  { p:'Idea', t:'sustantivo', d:'Pensamiento que aparece en la mente sobre algo.', e:'Se me ocurrió una idea para el proyecto.' },
  { p:'Idioma', t:'sustantivo', d:'Lengua que habla un pueblo o país, como el español o el inglés.', e:'En Chile el idioma más hablado es el español.' },
  { p:'Imaginar', t:'verbo', d:'Formar ideas o imágenes en la mente de cosas que no están presentes.', e:'Me gusta imaginar mundos de fantasía.' },
  { p:'Insecto', t:'sustantivo', d:'Animal pequeño de seis patas, como la hormiga o la abeja.', e:'El insecto caminaba por la hoja.' },
  { p:'Invierno', t:'sustantivo', d:'Estación más fría del año, entre el otoño y la primavera.', e:'En invierno llueve mucho en el sur.' },
  { p:'Isla', t:'sustantivo', d:'Porción de tierra rodeada de agua por todas partes.', e:'Chiloé es una isla grande de Chile.' },
  { p:'Jardín', t:'sustantivo', d:'Terreno donde se cultivan plantas y flores para adornar.', e:'El jardín está lleno de flores en primavera.' },
  { p:'Juego', t:'sustantivo', d:'Actividad que se hace para divertirse, muchas veces con reglas.', e:'Mi juego favorito es la escondida.' },
  { p:'Justo', t:'adjetivo', d:'Que actúa dando a cada uno lo que corresponde, sin favorecer a nadie.', e:'El árbitro fue justo con los dos equipos.' },
  { p:'Lápiz', t:'sustantivo', d:'Instrumento alargado que sirve para escribir o dibujar.', e:'Saqué punta a mi lápiz.' },
  { p:'Leer', t:'verbo', d:'Mirar y comprender lo que está escrito.', e:'Antes de dormir me gusta leer un cuento.' },
  { p:'Lechuza', t:'sustantivo', d:'Ave nocturna de ojos grandes que caza de noche.', e:'La lechuza vuela sin hacer ruido.' },
  { p:'Libertad', t:'sustantivo', d:'Posibilidad de decidir y actuar por uno mismo, respetando a los demás.', e:'Los pájaros vuelan en libertad.' },
  { p:'Libro', t:'sustantivo', d:'Conjunto de hojas escritas, unidas y con tapas, que cuenta historias o entrega conocimientos.', e:'Terminé el libro en una semana.' },
  { p:'Luna', t:'sustantivo', d:'Cuerpo del espacio que gira alrededor de la Tierra y brilla de noche reflejando la luz del sol.', e:'La luna llena iluminaba el patio.' },
  { p:'Mapa', t:'sustantivo', d:'Dibujo que representa un territorio, como un país o una ciudad, visto desde arriba.', e:'Ubicamos Chile en el mapa.' },
  { p:'Mar', t:'sustantivo', d:'Gran masa de agua salada que cubre parte de la Tierra.', e:'En verano vamos a la playa a ver el mar.' },
  { p:'Mariposa', t:'sustantivo', d:'Insecto de alas grandes y colores llamativos que antes fue oruga.', e:'Una mariposa se posó en la flor.' },
  { p:'Medir', t:'verbo', d:'Averiguar el tamaño, la cantidad o la duración de algo.', e:'Vamos a medir el largo de la mesa.' },
  { p:'Montaña', t:'sustantivo', d:'Elevación natural y grande del terreno.', e:'Subimos la montaña en dos horas.' },
  { p:'Música', t:'sustantivo', d:'Arte de combinar sonidos de forma agradable o expresiva.', e:'La música de esa canción me alegra.' },
  { p:'Naturaleza', t:'sustantivo', d:'Todo lo que existe sin que lo haya hecho el ser humano: plantas, animales, ríos, montañas.', e:'Debemos cuidar la naturaleza.' },
  { p:'Nube', t:'sustantivo', d:'Conjunto de gotitas de agua que flota en el cielo.', e:'Esa nube parece un conejo.' },
  { p:'Número', t:'sustantivo', d:'Símbolo que sirve para contar, medir y ordenar.', e:'El número siete es mi favorito.' },
  { p:'Océano', t:'sustantivo', d:'Extensión enorme de agua salada, más grande que un mar. Chile mira al océano Pacífico.', e:'El océano Pacífico es el más grande del mundo.' },
  { p:'Orgullo', t:'sustantivo', d:'Satisfacción que se siente por un logro propio o de alguien querido.', e:'Sintió orgullo al terminar su proyecto.' },
  { p:'Otoño', t:'sustantivo', d:'Estación del año en que las hojas de muchos árboles cambian de color y caen.', e:'En otoño el parque se llena de hojas secas.' },
  { p:'Paciencia', t:'sustantivo', d:'Capacidad de esperar o perseverar con calma, sin enojarse.', e:'Armar el rompecabezas requiere paciencia.' },
  { p:'Paisaje', t:'sustantivo', d:'Extensión de terreno que se ve desde un lugar, con sus elementos naturales o construidos.', e:'El paisaje del lago era precioso.' },
  { p:'Palabra', t:'sustantivo', d:'Sonido o conjunto de letras que expresa una idea.', e:'Aprendí una palabra nueva hoy.' },
  { p:'Pan', t:'sustantivo', d:'Alimento hecho con harina, agua y levadura, horneado. En Chile es típica la marraqueta.', e:'Compramos pan fresco en la tarde.' },
  { p:'Planeta', t:'sustantivo', d:'Cuerpo del espacio que gira alrededor de una estrella. La Tierra es un planeta.', e:'Marte es conocido como el planeta rojo.' },
  { p:'Planta', t:'sustantivo', d:'Ser vivo que generalmente crece fijo en la tierra y fabrica su alimento con la luz del sol.', e:'Riego mi planta dos veces por semana.' },
  { p:'Pregunta', t:'sustantivo', d:'Frase con la que se pide información sobre algo.', e:'Hice una pregunta en clases y la profesora la respondió.' },
  { p:'Primavera', t:'sustantivo', d:'Estación del año en que florecen las plantas, entre el invierno y el verano.', e:'En primavera el jardín se llena de flores.' },
  { p:'Profesor', t:'sustantivo', d:'Persona que enseña a otras en un colegio, universidad u otro lugar.', e:'El profesor explicó la materia con ejemplos.' },
  { p:'Pug', t:'sustantivo', d:'Raza de perro pequeño, de cara arrugada, hocico corto y carácter cariñoso. ¡Como Carboncito!', e:'El pug corrió feliz a saludar.' },
  { p:'Respeto', t:'sustantivo', d:'Consideración y buen trato hacia las personas, los seres vivos y las cosas.', e:'Tratamos con respeto a todos los compañeros.' },
  { p:'Río', t:'sustantivo', d:'Corriente natural de agua dulce que fluye hacia el mar, un lago u otro río.', e:'El río Biobío es uno de los más anchos de Chile.' },
  { p:'Risa', t:'sustantivo', d:'Sonido y gesto que hacemos cuando algo nos parece divertido.', e:'Su chiste nos sacó una risa a todos.' },
  { p:'Saludable', t:'adjetivo', d:'Que hace bien a la salud.', e:'La fruta es una colación saludable.' },
  { p:'Semilla', t:'sustantivo', d:'Parte de una planta de la que puede nacer una planta nueva.', e:'Plantamos una semilla de zapallo.' },
  { p:'Sol', t:'sustantivo', d:'Estrella que da luz y calor a la Tierra.', e:'El sol sale por el este cada mañana.' },
  { p:'Sonrisa', t:'sustantivo', d:'Gesto alegre que se hace curvando los labios, sin llegar a reír.', e:'Me recibió con una gran sonrisa.' },
  { p:'Soñar', t:'verbo', d:'Imaginar historias mientras dormimos; también, desear algo con ilusión.', e:'Sueña con ser astrónoma.' },
  { p:'Tiempo', t:'sustantivo', d:'Duración de las cosas; también se usa para hablar del clima.', e:'Nos quedó poco tiempo para terminar.' },
  { p:'Tierra', t:'sustantivo', d:'Planeta donde vivimos; también, el suelo donde crecen las plantas.', e:'La Tierra gira alrededor del Sol.' },
  { p:'Trabajo', t:'sustantivo', d:'Actividad que se realiza con esfuerzo para lograr o producir algo.', e:'El trabajo en equipo salió muy bien.' },
  { p:'Tren', t:'sustantivo', d:'Medio de transporte formado por vagones que avanzan sobre rieles.', e:'El tren llegó puntual a la estación.' },
  { p:'Universo', t:'sustantivo', d:'Todo lo que existe: los planetas, las estrellas, las galaxias y el espacio.', e:'El universo es inmenso y sigue expandiéndose.' },
  { p:'Útil', t:'adjetivo', d:'Que sirve para algo o ayuda a lograr un fin.', e:'Esa mochila es muy útil para el colegio.' },
  { p:'Valiente', t:'adjetivo', d:'Que enfrenta el miedo o las dificultades con decisión.', e:'Fue valiente y contó la verdad.' },
  { p:'Ventana', t:'sustantivo', d:'Abertura en una pared, con vidrio, que deja entrar luz y aire.', e:'Desde la ventana se ve la cordillera.' },
  { p:'Verano', t:'sustantivo', d:'Estación más calurosa del año, entre la primavera y el otoño.', e:'En verano vamos a la piscina.' },
  { p:'Verdad', t:'sustantivo', d:'Lo que corresponde a la realidad de los hechos.', e:'Decir la verdad genera confianza.' },
  { p:'Viajar', t:'verbo', d:'Trasladarse de un lugar a otro, generalmente lejano.', e:'Queremos viajar al norte en las vacaciones.' },
  { p:'Volcán', t:'sustantivo', d:'Montaña con una abertura por donde puede salir lava, ceniza y gases desde el interior de la Tierra.', e:'El volcán Villarrica está en el sur de Chile.' },
  { p:'Zanahoria', t:'sustantivo', d:'Verdura alargada de color naranjo que crece bajo la tierra.', e:'La ensalada lleva zanahoria rallada.' },
  { p:'Zorro', t:'sustantivo', d:'Animal salvaje parecido a un perro, de hocico puntiagudo y cola larga. El zorro culpeo vive en Chile.', e:'El zorro se escondió entre los arbustos.' },
];

const DICC_EN = [
  { w:'Apple', tr:'manzana', e:'The apple is red and sweet.' },
  { w:'Art', tr:'arte', e:'We paint in art class.' },
  { w:'Backpack', tr:'mochila', e:'My backpack is full of books.' },
  { w:'Beach', tr:'playa', e:'We play on the beach in summer.' },
  { w:'Big', tr:'grande', e:'The elephant is a big animal.' },
  { w:'Bird', tr:'pájaro', e:'The bird sings in the morning.' },
  { w:'Black', tr:'negro', e:'Carboncito is a black pug.' },
  { w:'Blue', tr:'azul', e:'The sky is blue today.' },
  { w:'Book', tr:'libro', e:'This book has many pictures.' },
  { w:'Bread', tr:'pan', e:'We eat bread at breakfast.' },
  { w:'Brother', tr:'hermano', e:'My brother plays the guitar.' },
  { w:'Cat', tr:'gato', e:'The cat sleeps on the sofa.' },
  { w:'Chair', tr:'silla', e:'Please sit on the chair.' },
  { w:'Cloud', tr:'nube', e:'That cloud looks like a rabbit.' },
  { w:'Cold', tr:'frío', e:'The water is very cold.' },
  { w:'Cow', tr:'vaca', e:'The cow gives us milk.' },
  { w:'Dance', tr:'bailar', e:'They dance at the party.' },
  { w:'Dictionary', tr:'diccionario', e:'I look up new words in the dictionary.' },
  { w:'Dog', tr:'perro', e:'The dog runs in the park.' },
  { w:'Door', tr:'puerta', e:'Please close the door.' },
  { w:'Drink', tr:'beber', e:'I drink water every day.' },
  { w:'Eat', tr:'comer', e:'We eat lunch at school.' },
  { w:'Family', tr:'familia', e:'My family is very big.' },
  { w:'Fast', tr:'rápido', e:'The train is very fast.' },
  { w:'Father', tr:'padre', e:'My father cooks on Sundays.' },
  { w:'Fish', tr:'pez', e:'The fish swims in the river.' },
  { w:'Flower', tr:'flor', e:'This flower smells wonderful.' },
  { w:'Friend', tr:'amigo', e:'My best friend lives next door.' },
  { w:'Goodbye', tr:'adiós', e:'We say goodbye after class.' },
  { w:'Green', tr:'verde', e:'The leaves are green in spring.' },
  { w:'Happy', tr:'feliz', e:'I am happy to see you.' },
  { w:'Hello', tr:'hola', e:'Hello! How are you today?' },
  { w:'History', tr:'historia', e:'We study history at school.' },
  { w:'Horse', tr:'caballo', e:'The horse runs across the field.' },
  { w:'Hot', tr:'caliente', e:'The soup is too hot.' },
  { w:'House', tr:'casa', e:'My house has a small garden.' },
  { w:'Jump', tr:'saltar', e:'The children jump with the rope.' },
  { w:'Language', tr:'idioma', e:'English is a useful language.' },
  { w:'Love', tr:'amor', e:'Love makes people kind.' },
  { w:'Milk', tr:'leche', e:'I drink milk at breakfast.' },
  { w:'Moon', tr:'luna', e:'The moon shines at night.' },
  { w:'Morning', tr:'mañana', e:'I wake up early in the morning.' },
  { w:'Mother', tr:'madre', e:'My mother works at a hospital.' },
  { w:'Mountain', tr:'montaña', e:'The mountain is covered with snow.' },
  { w:'Music', tr:'música', e:'We listen to music together.' },
  { w:'Night', tr:'noche', e:'The stars come out at night.' },
  { w:'Notebook', tr:'cuaderno', e:'I write notes in my notebook.' },
  { w:'Number', tr:'número', e:'Seven is my favorite number.' },
  { w:'Peace', tr:'paz', e:'We work together in peace.' },
  { w:'Pencil', tr:'lápiz', e:'I draw with a pencil.' },
  { w:'Play', tr:'jugar', e:'The children play in the yard.' },
  { w:'Please', tr:'por favor', e:'Can you help me, please?' },
  { w:'Rain', tr:'lluvia', e:'The rain falls on the roof.' },
  { w:'Read', tr:'leer', e:'I read a story every night.' },
  { w:'Red', tr:'rojo', e:'The fire truck is red.' },
  { w:'River', tr:'río', e:'The river flows to the sea.' },
  { w:'Run', tr:'correr', e:'We run in the park.' },
  { w:'Sad', tr:'triste', e:'She is sad because it is raining.' },
  { w:'School', tr:'escuela', e:'Our school has a big library.' },
  { w:'Science', tr:'ciencia', e:'Science explains how things work.' },
  { w:'Sea', tr:'mar', e:'The sea is calm today.' },
  { w:'Sing', tr:'cantar', e:'The birds sing in the trees.' },
  { w:'Sister', tr:'hermana', e:'My sister loves to paint.' },
  { w:'Sleep', tr:'dormir', e:'Babies sleep many hours.' },
  { w:'Slow', tr:'lento', e:'The turtle is slow but steady.' },
  { w:'Small', tr:'pequeño', e:'The mouse is a small animal.' },
  { w:'Snow', tr:'nieve', e:'The snow covers the mountains.' },
  { w:'Speak', tr:'hablar', e:'We speak English in class.' },
  { w:'Star', tr:'estrella', e:'A star shines far away.' },
  { w:'Student', tr:'estudiante', e:'Every student has a notebook.' },
  { w:'Sun', tr:'sol', e:'The sun rises in the east.' },
  { w:'Swim', tr:'nadar', e:'We swim in the pool in summer.' },
  { w:'Table', tr:'mesa', e:'The books are on the table.' },
  { w:'Teacher', tr:'profesor', e:'The teacher explains the lesson.' },
  { w:'Thanks', tr:'gracias', e:'Thanks for your help!' },
  { w:'Tree', tr:'árbol', e:'The tree gives us shade.' },
  { w:'Walk', tr:'caminar', e:'We walk to school together.' },
  { w:'Water', tr:'agua', e:'Plants need water to grow.' },
  { w:'White', tr:'blanco', e:'The clouds are white.' },
  { w:'Wind', tr:'viento', e:'The wind moves the leaves.' },
  { w:'Window', tr:'ventana', e:'Open the window, please.' },
  { w:'Word', tr:'palabra', e:'I learned a new word today.' },
  { w:'Write', tr:'escribir', e:'I write a letter to my friend.' },
  { w:'Yellow', tr:'amarillo', e:'The sunflower is yellow.' },
];

let diccLang = 'es';
let diccVisible = [];

export function renderDiccionarioScreen(lang){
  diccLang = lang;
  const title = lang === 'es' ? '📖 Diccionario Español' : '🔤 English Dictionary';
  const sub = lang === 'es'
    ? 'Vocabulario escolar con definiciones simples. Toca 🔊 para escuchar cada palabra.'
    : 'Palabras en inglés con su traducción y un ejemplo. Toca 🔊 para escuchar la pronunciación.';
  const ph = lang === 'es' ? 'Busca una palabra…' : 'Search a word…';
  return '<div class="screen">'+
    '<p class="section-title">'+title+'</p>'+
    '<p class="section-sub">'+sub+'</p>'+
    '<input id="dicc-search" class="dicc-search" type="text" placeholder="'+ph+'" autocomplete="off" aria-label="'+ph+'">'+
    '<div id="dicc-list" class="dicc-list"></div>'+
  '</div>';
}

function normaliza(s){
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}

function buildList(filtro){
  const base = diccLang === 'es' ? DICC_ES : DICC_EN;
  const f = normaliza(filtro || '');
  diccVisible = base.filter(function(entry){
    if(!f) return true;
    const clave = diccLang === 'es' ? entry.p : (entry.w + ' ' + entry.tr);
    return normaliza(clave).indexOf(f) !== -1;
  });
  let html = '';
  let lastLetter = '';
  diccVisible.forEach(function(entry, i){
    const word = diccLang === 'es' ? entry.p : entry.w;
    const letter = normaliza(word).charAt(0).toUpperCase();
    if(!f && letter !== lastLetter){
      html += '<div class="dicc-letter">'+letter+'</div>';
      lastLetter = letter;
    }
    if(diccLang === 'es'){
      html += '<div class="dicc-entry">'+
        '<div class="dicc-head"><span class="dicc-word">'+entry.p+'</span><span class="dicc-tipo">'+entry.t+'</span>'+
        '<button class="dicc-listen" onclick="diccSpeak('+i+')" aria-label="Escuchar">🔊</button></div>'+
        '<p class="dicc-def">'+entry.d+'</p>'+
        '<p class="dicc-ej">“'+entry.e+'”</p>'+
      '</div>';
    } else {
      html += '<div class="dicc-entry">'+
        '<div class="dicc-head"><span class="dicc-word">'+entry.w+'</span><span class="dicc-tipo">'+entry.tr+'</span>'+
        '<button class="dicc-listen" onclick="diccSpeak('+i+')" aria-label="Listen">🔊</button></div>'+
        '<p class="dicc-ej">“'+entry.e+'”</p>'+
      '</div>';
    }
  });
  if(!diccVisible.length){
    html = '<p class="dicc-empty">'+(diccLang === 'es' ? 'No encontramos esa palabra 🐾' : 'No results 🐾')+'</p>';
  }
  document.getElementById('dicc-list').innerHTML = html;
}

export function initDiccionario(){
  const input = document.getElementById('dicc-search');
  input.addEventListener('input', function(){ buildList(input.value); });
  buildList('');
}

export function diccSpeak(i){
  const entry = diccVisible[i];
  if(!entry) return;
  if(diccLang === 'es') speak(entry.p + '. ' + entry.d);
  else speak(entry.w + '. ' + entry.e, 'en');
}
