/**
 * TOMMY WHOLESALE RENTAL — Formulario de contacto -> Google Sheet + aviso por correo
 * =============================================================================
 * Este codigo recibe los envios del formulario de la pagina web, los guarda
 * como filas en una Google Sheet Y te manda un correo con cada solicitud.
 *
 * -----------------------------------------------------------------------------
 * LO UNICO QUE TIENES QUE EDITAR:  la linea  AVISAR_A  aqui abajo.
 * Pon el correo (o varios separados por coma) donde quieres recibir los avisos.
 * Si lo dejas vacio, no se manda correo y solo se guarda en la hoja.
 * -----------------------------------------------------------------------------
 *
 * COMO INSTALARLO (una sola vez):
 *
 * 1) Crea una Google Sheet nueva (sheets.new). No hace falta escribir los
 *    encabezados: el script los crea solo la primera vez.
 *
 * 2) En esa hoja: menu  Extensiones -> Apps Script.
 *
 * 3) Borra lo que haya y pega TODO este archivo. Guarda (icono de diskette).
 *
 * 4) Arriba a la derecha: boton  Implementar (Deploy) -> Nueva implementacion.
 *      - Tipo:  Aplicacion web (Web app)
 *      - Descripcion:  Formulario Tommy
 *      - Ejecutar como:  Yo (tu cuenta)
 *      - Quien tiene acceso:  Cualquier persona (Anyone)
 *    Da clic en  Implementar  y autoriza los permisos que pida.
 *
 * 5) Copia la  "URL de la aplicacion web"  que te da (termina en /exec)
 *    y pasamela para ponerla en la pagina.
 *
 * SI YA LO TENIAS INSTALADO Y SOLO ESTAS ACTUALIZANDO ESTE CODIGO:
 *    Implementar -> Administrar implementaciones -> (lapiz de editar) ->
 *    Version: Nueva version -> Implementar.
 *    Asi la URL NO cambia y no hay que tocar la pagina.
 * =============================================================================
 */

// >>>>>>>>>>>>>>>>  EDITA ESTA LINEA  <<<<<<<<<<<<<<<<
var AVISAR_A = 'patriciarm.tommywholesale@gmail.com';   // varios: 'uno@x.com, dos@x.com'
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

var ENCABEZADOS = ['Date', 'Name', 'Phone', 'Email',
                   'Event Date', 'Event Type', 'Message'];


function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    var fila = [
      new Date(),            // Fecha de recepcion
      p.name || '',          // Nombre
      p.phone || '',         // Telefono
      p.email || '',         // Email
      p.eventDate || '',     // Fecha del evento
      p.eventType || '',     // Tipo de evento
      p.message || ''        // Mensaje
    ];

    guardarEnHoja_(fila);
    avisarPorCorreo_(fila);

    return respuesta_({ result: 'success' });

  } catch (err) {
    // Si algo falla, queda registrado en Apps Script -> Ejecuciones
    console.error(err);
    return respuesta_({ result: 'error', error: String(err) });
  }
}


/** Escribe la fila en la primera hoja, creando los encabezados si faltan. */
function guardarEnHoja_(fila) {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  if (hoja.getLastRow() === 0) {
    hoja.appendRow(ENCABEZADOS);
    hoja.getRange(1, 1, 1, ENCABEZADOS.length).setFontWeight('bold');
    hoja.setFrozenRows(1);
  }
  hoja.appendRow(fila);
}


/** Manda el aviso por correo. Si falla, NO se pierde la fila de la hoja. */
function avisarPorCorreo_(fila) {
  if (!AVISAR_A) return;

  try {
    var nombre = fila[1] || '(sin nombre)';
    var cuerpo =
        'Nueva solicitud de cotizacion desde la pagina web:\n\n' +
        'Nombre:            ' + (fila[1] || '-') + '\n' +
        'Telefono:          ' + (fila[2] || '-') + '\n' +
        'Email:             ' + (fila[3] || '-') + '\n' +
        'Fecha del evento:  ' + (fila[4] || '-') + '\n' +
        'Tipo de evento:    ' + (fila[5] || '-') + '\n\n' +
        'Mensaje:\n' + (fila[6] || '-') + '\n\n' +
        '---\n' +
        'Recibido: ' + fila[0] + '\n' +
        'Hoja: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl();

    var opciones = { name: 'Tommy Wholesale Rental' };
    if (fila[3]) opciones.replyTo = fila[3];   // responder va directo al cliente

    MailApp.sendEmail(AVISAR_A,
                      'Nueva cotizacion — ' + nombre,
                      cuerpo,
                      opciones);
  } catch (err) {
    console.error('No se pudo enviar el aviso por correo: ' + err);
  }
}


function respuesta_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}


/** Permite abrir la URL en el navegador para comprobar que esta activa. */
function doGet() {
  return ContentService
    .createTextOutput('Tommy Wholesale Rental form endpoint is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}


/**
 * PRUEBA SIN USAR LA PAGINA.
 * Selecciona  probar  en el menu de funciones y dale  Ejecutar.
 * Debe aparecer una fila de prueba en la hoja (y llegarte el correo).
 */
function probar() {
  doPost({ parameter: {
    name: 'Prueba desde Apps Script',
    phone: '617-000-0000',
    email: 'prueba@ejemplo.com',
    eventDate: '2026-12-31',
    eventType: 'Wedding',
    message: 'Esto es una prueba, se puede borrar.'
  }});
}
