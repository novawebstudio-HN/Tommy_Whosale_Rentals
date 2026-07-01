# Tommy Wholesale Rental — Catálogo Web

Sitio web público para mostrar a los clientes las decoraciones de renta de **Tommy Wholesale Rental**.
Diseño en los colores de la marca: **negro, blanco y rojo**.

## 🌐 Ver el sitio

Una vez publicado con GitHub Pages, el sitio estará disponible en:

```
https://3duard000.github.io/tommy/
```

## 🚀 Cómo publicarlo (GitHub Pages)

Solo se hace **una vez**:

1. Fusiona (merge) esta rama a `main`.
2. Ve a la pestaña **Settings → Pages** del repositorio en GitHub.
3. En **Build and deployment → Source**, elige **Deploy from a branch**.
4. En **Branch**, selecciona `main` y la carpeta `/ (root)`, y da clic en **Save**.
5. Espera 1–2 minutos: el sitio quedará publicado en la URL de arriba.

> Después de esto, cada cambio que subas a `main` se publica solo.

## 🖼️ Cómo agregar o quitar fotos

Las fotos viven en carpetas por categoría (por ejemplo `Chairs/`, `Candelabras/`, etc.).

1. Agrega o borra imágenes (`.png`, `.jpg`) dentro de la carpeta de la categoría.
2. Vuelve a generar el catálogo ejecutando:

   ```bash
   python3 build_catalog.py
   ```

   Esto actualiza `assets/catalog.json`, que es lo que la página lee para mostrar todo.
3. Sube los cambios (commit + push a `main`). El sitio se actualiza automáticamente.

## 📂 Estructura

```
index.html            → la página web (galería + lightbox)
assets/catalog.json   → lista de categorías e imágenes (autogenerado)
build_catalog.py      → script que regenera catalog.json
Other/logo.jpg        → logo de la marca
<Categoría>/*.png     → fotos de cada categoría
```

## 📞 Contacto

- 617-504-5321
- 508-718-7498
