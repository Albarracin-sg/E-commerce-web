```markdown
# Manifiesto de Diseño: La Experiencia de E-commerce Vibrante

Este documento detalla los principios y especificaciones técnicas de nuestro sistema de diseño, creado para transformar una interfaz comercial en una experiencia editorial dinámica, joven y de alto impacto.

## 1. El Norte Creativo: "Electric Editorial"
Nuestra dirección creativa se define como **Electric Editorial**. Rompemos la rigidez del e-commerce tradicional (estilo cuadrícula de plantillas) para adoptar un lenguaje de revista digital de moda urbana. 

**El secreto de la ejecución:** No usamos líneas para separar; usamos la tensión entre espacios en blanco, tipografía masiva y bloques de color sólido para guiar el ojo. Los elementos deben sentirse como si estuvieran "vivos", flotando en capas de profundidad tonal.

---

## 2. Lenguaje de Color y Textura

El color no es solo decorativo; es nuestra arquitectura. Abandonamos las fronteras físicas en favor de transiciones tonales.

### Reglas de Aplicación:
*   **La Regla de "No-Línea":** Queda estrictamente prohibido el uso de bordes sólidos de 1px para delimitar secciones. La estructura se define exclusivamente mediante el cambio de fondos (ej. una sección en `surface-container-low` sobre un fondo general `surface`).
*   **Jerarquía de Superficies:** La profundidad se crea mediante el "nesting" (anidamiento). Un elemento importante se coloca en `surface-container-lowest` para que destaque sobre un `surface-container` más oscuro, creando una elevación natural.
*   **Glassmorphism & Gradients:** Para elementos flotantes (filtros, menús laterales, notificaciones), utilizamos un efecto de cristal esmerilado con `backdrop-blur` (12px-20px) sobre colores de superficie semi-transparentes.
*   **Gradientes de Firma:** Las CTAs principales no son planas. Deben usar un gradiente lineal de 135° que transicione de `primary` (#0050d4) a `primary-container` (#7b9cff) para añadir "soul" y vibración.

---

## 3. Tipografía: El Motor Visual

La tipografía es el elemento gráfico principal. No solo comunica, decora.

*   **Display & Headlines (Plus Jakarta Sans):** Nuestra voz cantante. Usamos pesos *Bold* y *ExtraBold*. En el Hero, el interletrado debe ser ligeramente negativo (-2%) para una estética más agresiva y moderna.
*   **Cuerpo y Lectura (Be Vietnam Pro):** Diseñada para la legibilidad en descripciones de producto. El peso *Regular* se reserva para el cuerpo, mientras que el *Medium* se utiliza para resaltar atributos técnicos.
*   **Jerarquía Sugerida:**
    *   **Display-lg (3.5rem):** Para mensajes de marca de gran formato que pueden solaparse ligeramente con imágenes.
    *   **Headline-md (1.75rem):** Para nombres de categorías y secciones destacadas.
    *   **Label-md (0.75rem):** Siempre en mayúsculas (All Caps) con espaciado de letras (+5%) para etiquetas de "NUEVO" o "OFFER".

---

## 4. Elevación y Profundidad Tonal

Rechazamos el diseño plano y el skeuomorfismo pesado. Buscamos una profundidad atmosférica.

*   **Shadows Ambientales:** Solo se permiten en elementos que realmente "vuelan" (modales, carritos flotantes). La sombra debe ser extra-difusa: `box-shadow: 0 20px 40px rgba(40, 43, 81, 0.08)`. El color de la sombra debe ser un tinte de `on-surface`, nunca negro puro.
*   **El "Ghost Border":** Si la accesibilidad requiere un límite (ej. inputs), usamos `outline-variant` con una opacidad del 15%. Nunca debe competir visualmente con el contenido.
*   **Capas Dinámicas:** Al hacer hover, un componente no solo cambia de color; debe "ascender" cambiando su color de superficie de `surface-container` a `surface-container-lowest`, simulando un acercamiento físico al usuario.

---

## 5. Componentes Clave

### Botones (The Power Actions)
*   **Primario:** Gradiente de `primary` a `primary-container`, esquinas `md` (0.75rem). Sin borde. Efecto de escalado suave (1.02x) en hover.
*   **Secundario:** Fondo `secondary-container`, texto en `on-secondary-container`.
*   **Acción Energética:** Para momentos de "compra inmediata", usar la paleta `tertiary` (Vibrant Pink) para romper la monotonía azul/púrpura.

### Cards de Producto (Calling-out Cards)
*   **Prohibido:** No usar líneas divisorias ni bordes.
*   **Estructura:** Imagen a sangre (full bleed) con esquinas `lg` (1rem). El texto descansa sobre un área de `surface-container-lowest`. Al hacer hover, la imagen debe escalar ligeramente (1.05x) dentro de su contenedor.

### Inputs y Selección
*   **Campos de Texto:** Fondo en `surface-container-high`. Sin borde inferior, solo un ligero radio de curvatura `sm`. El label flota sobre el campo en un tamaño `label-sm`.
*   **Chips de Selección:** Forma `full` (pill-shape). Estado activo en `secondary`, estado inactivo en `surface-container-highest`.

### Listas Editorializadas
En lugar de listas estándar, usamos bloques con espaciado generoso. La separación entre ítems se dicta por el `Spacing Scale` (mínimo 24px de gap vertical), eliminando cualquier necesidad de dividers grises.

---

## 6. Guía de "Do's & Don'ts"

### Sí (Do)
*   **Usa asimetría:** Coloca una imagen de producto ligeramente fuera del eje de la cuadrícula para generar dinamismo.
*   **Color en bloques:** Usa `surface-container-low` para crear secciones de página completas que diferencien el "Feed" del "Footer".
*   **Micro-interacciones:** Todo botón debe tener una transición suave de 200ms (ease-out).

### No (Don't)
*   **No uses bordes de 1px:** Si sientes que algo se "pierde", aumenta el contraste del color de fondo o el espaciado, no añadidas una línea.
*   **No uses sombras negras:** Las sombras deben sentirse como luz teñida por la marca.
*   **No satures de fuentes:** Mantente fiel a Plus Jakarta y Be Vietnam. La variedad viene del peso y el tamaño, no de cambiar de familia tipográfica.
*   **Evita el minimalismo extremo:** Este sistema es "Cool" y "Energético". El espacio en blanco es para resaltar la energía, no para crear un vacío clínico.

---

**Nota final para el equipo:** Este sistema no es una regla inamovible, es un ecosistema vivo. Si un diseño se siente "aburrido" o "corporativo", rompe la rejilla, aumenta el tamaño de la fuente y añade un gradiente. La intención es siempre la **vibración**.```