# LEO 🐾

Una app web educativa gratuita para niños, con **Carboncito** el pug como compañero
de aventuras. Enseña las asignaturas del colegio siguiendo la misma trayectoria del
sistema escolar chileno: por etapa, año y materia — todo alineado a objetivos de
aprendizaje oficiales de Mineduc.

## Jugar

👉 **[Ábrelo aquí](https://scott-diaz-urrea.github.io/carbon-lector/)**

## Qué incluye hasta ahora

- **1° Básico** — completo, las 9 asignaturas aplicables: Lenguaje, Matemática,
  Ciencias Naturales, Historia/Geografía/Cs. Sociales, Artes Visuales, Música,
  Educación Física y Salud, Orientación, y Tecnología (31 módulos en total)
- **2° Básico** — Lenguaje (Combinaciones, Secuencia) y Matemática (Salta y Cuenta,
  Multiplicar) — en construcción
- Sistema de recompensas: XP, niveles, rachas, insignias y confeti
- Voz en español integrada, contenido generado dinámicamente para que cada partida
  se sienta distinta

## Cómo funciona técnicamente

HTML, CSS y JavaScript plano, sin dependencias que compilar — el JS vive en módulos ES
nativos (`js/`) organizados por asignatura, cargados directo por el navegador vía
`<script type="module">`. Se despliega directo con GitHub Pages, sin build step.

Para el contexto técnico completo (arquitectura de archivos, qué falta, cómo agregar
contenido nuevo), ver [`CLAUDE.md`](./CLAUDE.md).

## Actualizar el sitio

Cualquier cambio en la rama `main` se refleja automáticamente en el sitio publicado
(GitHub Pages), usualmente en 1-2 minutos. Como el JS ahora está en módulos ES, probar
localmente requiere servir la carpeta con un servidor HTTP (los módulos no cargan vía
`file://` por restricciones CORS del navegador) — no basta con abrir `index.html` directo
con doble clic.
