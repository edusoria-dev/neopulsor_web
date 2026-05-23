<?php
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  echo json_encode([
    "ok" => false,
    "mensaje" => "Método no permitido."
  ]);
  exit;
}

function limpiar($dato) {
  return htmlspecialchars(trim($dato), ENT_QUOTES, "UTF-8");
}

$nombre = limpiar($_POST["nombre"] ?? "");
$email = limpiar($_POST["email"] ?? "");
$telefono = limpiar($_POST["telefono"] ?? "");
$tipo_proyecto = limpiar($_POST["tipo_proyecto"] ?? "");
$fecha = limpiar($_POST["fecha"] ?? "");
$ubicacion = limpiar($_POST["ubicacion"] ?? "");
$presupuesto = limpiar($_POST["presupuesto"] ?? "");
$mensaje = limpiar($_POST["mensaje"] ?? "");
$acepta_privacidad = $_POST["acepta_privacidad"] ?? "";

if (!$nombre || !$email || !$tipo_proyecto || !$mensaje || !$acepta_privacidad) {
  echo json_encode([
    "ok" => false,
    "mensaje" => "Por favor, completa los campos obligatorios."
  ]);
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  echo json_encode([
    "ok" => false,
    "mensaje" => "El correo electrónico no es válido."
  ]);
  exit;
}

$destinatarios = "neopulsor@gmail.com, edusoria.filmmaker@gmail.com";
$asunto = "SOLICITUD WEB - NEOPULSOR";

$contenido = "
Has recibido una nueva solicitud desde la web de NeoPulsor:

Nombre: $nombre
Email: $email
Teléfono: $telefono

Tipo de proyecto: $tipo_proyecto
Fecha aproximada: $fecha
Ubicación: $ubicacion

Presupuesto aproximado: $presupuesto

Mensaje:
$mensaje
";

$cabeceras = "From: NeoPulsor Web <no-reply@neopulsor.com>\r\n";
$cabeceras .= "Reply-To: $email\r\n";
$cabeceras .= "Content-Type: text/plain; charset=UTF-8\r\n";

$enviado = mail($destinatarios, $asunto, $contenido, $cabeceras);

$asunto_cliente = "Solicitud servicios audiovisuales | NeoPulsor";

$contenido_cliente = "
Hola $nombre,

Hemos recibido correctamente tu solicitud. Nuestro equipo te responderá lo antes posible.

Este es el resumen de lo que nos has enviado:

Nombre: $nombre
Email: $email
Teléfono: $telefono

Tipo de proyecto: $tipo_proyecto
Fecha aproximada: $fecha
Ubicación: $ubicacion
Presupuesto aproximado: $presupuesto

Mensaje:
$mensaje

Gracias por contactar con NeoPulsor.

Un saludo,
NeoPulsor
www.neopulsor.com
neopulsor@gmail.com
";

$cabeceras_cliente = "From: NeoPulsor <no-reply@neopulsor.com>\r\n";
$cabeceras_cliente .= "Reply-To: neopulsor@gmail.com\r\n";
$cabeceras_cliente .= "Content-Type: text/plain; charset=UTF-8\r\n";

mail($email, $asunto_cliente, $contenido_cliente, $cabeceras_cliente);

if ($enviado) {
  echo json_encode([
    "ok" => true,
    "mensaje" => "Formulario enviado correctamente."
  ]);
} else {
  echo json_encode([
    "ok" => false,
    "mensaje" => "No se ha podido enviar el formulario. Inténtalo más tarde."
  ]);
}
?>