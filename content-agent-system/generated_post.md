```markdown
## ¿Layouts que te limitan? CSS Grid al rescate 🚀

CSS Grid resuelve el problema de crear layouts complejos y bidimensionales que antes requerían trucos con floats o JavaScript. Piensa en dashboards, grids de imágenes, o incluso la estructura general de un sitio web: ahí es donde Grid brilla.

**La API en Acción:**

*   `display: grid;`:  Convierte un elemento en un grid container.  Es el punto de partida.
    ```css
    .container { display: grid; }
    ```
*   `grid-template-columns`: Define las columnas del grid.  Para 3 columnas responsive, usa `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));`.  `auto-fit` crea tantas columnas como quepan, cada una de al menos 300px, y compartiendo el espacio restante (`1fr`). 🤯
    ```css
    .container { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
    ```
*   `grid-template-rows`: Define las filas del grid. Controla la altura de cada fila.
    ```css
    .container { grid-template-rows: 100px 200px; }
    ```
*   `grid-column` y `grid-row`: Posiciona elementos en la grilla. `grid-column: 1 / 3` ocupa desde la línea 1 hasta la 3.
    ```css
    .item { grid-column: 1 / 3; }
    ```
*   `gap`: Espacio entre las celdas. Añade espacio entre elementos para una mejor legibilidad.
    ```css
    .container { gap: 10px; }
    ```

**Ejemplo Completo: Layout con Header, Sidebar y Main (y por qué funciona)**

Este layout es un clásico.  `grid-template-areas` te permite *visualizar* la estructura en el CSS.

```html
<div class="grid-container">
  <header class="header">Header</header>
  <aside class="sidebar">Sidebar</aside>
  <main class="main">Main Content</main>
  <footer class="footer">Footer</footer>
</div>
```

```css
.grid-container {
  display: grid;
  grid-template-columns: 200px 1fr; /* Sidebar de 200px y el resto para el contenido principal */
  grid-template-rows: auto 1fr auto; /* Header y footer con altura automática, el resto para el main */
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  min-height: 100vh; /* Asegura que el grid ocupe al menos toda la altura de la pantalla */
}

.header { grid-area: header; background-color: #eee; }
.sidebar { grid-area: sidebar; background-color: #ddd; }
.main { grid-area: main; background-color: #ccc; }
.footer { grid-area: footer; background-color: #eee; }
```

**¿Por qué estos valores?**

*   `grid-template-columns: 200px 1fr;`:  La sidebar tiene un ancho fijo de 200px. El `1fr` hace que el `main` ocupe todo el espacio restante. Si usáramos `auto` en lugar de `1fr`, el `main` solo ocuparía el ancho de su contenido.
*   `grid-template-rows: auto 1fr auto;`:  `auto` en el header/footer significa que su altura se ajusta al contenido.  El `1fr` del `main` lo expande para llenar el espacio vertical restante, creando un "sticky footer".

**Matiz Senior 🧠:**

*   `fr` (fractional unit) distribuye el espacio flexiblemente. ¡Ideal para layouts fluidos!
*   **`grid-template-areas`**: Define áreas con nombres descriptivos. Cambia el layout con solo modificar esta propiedad:
    ```css
    .container {
      grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
    }
    ```
*   Grid para layouts bidimensionales, Flexbox para unidimensionales. Usa la herramienta correcta.  ¿Ejemplo real?  Un calendario (Grid) vs. una barra de navegación (Flexbox).
*   **Accesibilidad y SEO:** El orden visual **debe** coincidir con el orden del DOM para una navegación accesible y un buen SEO.  Si no, usa `tabindex`... **¡con extrema precaución!**  Es una muleta, no una solución.  Replantéate la estructura del HTML antes de usar `tabindex`. Un lector de pantalla leerá el contenido en el orden del DOM, no en el orden visual impuesto por Grid.  Un mal uso afecta la experiencia del usuario y el ranking en buscadores. ¿Alternativas?  Prioriza el orden lógico del contenido en el HTML.

CSS Grid te da el control total sobre tus layouts. ¡Experimenta y descubre su potencial!

**Errores Comunes:**

*   **No entender `fr`:** Pensar que `fr` es una unidad absoluta.  Es *relativa* al espacio disponible.
*   **Abusar de `grid-template-areas`:**  Puede ser confuso en layouts muy complejos. A veces, `grid-column`/`grid-row` son más claros.
*   **Ignorar la accesibilidad:**  Un layout visualmente impresionante pero inaccesible es un fracaso.
```