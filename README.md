# Tommy Wholesale Rental — Catálogo Web

Sitio web público para mostrar a los clientes las decoraciones de renta de **Tommy Wholesale Rental**.
Diseño en los colores de la marca: **negro, blanco y rojo**.

## 🌐 Ver el sitio

Publicado con GitHub Pages en:

```
https://novawebstudio-hn.github.io/Tommy_Whosale_Rentals/
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

## 📨 Formulario de contacto (Google Sheet)

El formulario "Request a Quote" de la página guarda los envíos en una Google Sheet
mediante un Google Apps Script. Para activarlo:

1. Sigue los pasos que están **dentro del archivo `google-apps-script.gs`**
   (crear la hoja, pegar el código, publicar como *Web app* y copiar la URL).
2. En `index.html`, reemplaza la línea:

   ```js
   const FORM_ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_URL_HERE";
   ```

   por tu URL (la que termina en `/exec`).
3. Sube el cambio a `main`. Listo: los envíos llegarán a tu hoja.

> Mientras no se configure, el formulario muestra un aviso y pide llamar por teléfono.

## 🖼️ Nota sobre la carpeta `Other`

La carpeta `Other/` **no es una categoría**: contiene el logo y las imágenes de
portada que se muestran en la sección "Our Story". Por eso el script la ignora.

## 📂 Estructura

```
index.html             → la página web (galería + lightbox + formulario)
assets/catalog.json    → lista de categorías e imágenes (autogenerado)
build_catalog.py       → script que regenera catalog.json
google-apps-script.gs  → código del formulario -> Google Sheet (+ instrucciones)
Other/                 → logo e imágenes de portada (no es categoría)
<Categoría>/*.png      → fotos de cada categoría
```

## 📞 Contacto

- 617-504-5321
- 508-718-7498
