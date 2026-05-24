document.addEventListener("DOMContentLoaded", () => {
  /* ============================= */
  /* MENÚ MÓVIL */
  /* ============================= */

  const botonMenu = document.querySelector(".cabecera__boton_menu");
  const menuPrincipal = document.querySelector(".cabecera__nav");
  const enlacesMenu = document.querySelectorAll(".cabecera__nav a");

  if (botonMenu && menuPrincipal) {
    botonMenu.addEventListener("click", () => {
      const menuAbierto = menuPrincipal.classList.toggle("activo");

      botonMenu.classList.toggle("activo");
      botonMenu.setAttribute("aria-expanded", menuAbierto);
    });

    enlacesMenu.forEach((enlace) => {
      enlace.addEventListener("click", () => {
        menuPrincipal.classList.remove("activo");
        botonMenu.classList.remove("activo");
        botonMenu.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ============================= */
  /* CONTADORES SOBRE NOSOTROS */
  /* ============================= */

  const contadores = document.querySelectorAll(".contador");
  const bloqueContadores = document.querySelector("#contador_datos");

  let contadoresActivados = false;

  function animarContador(contador) {
    const numeroFinal = Number(contador.dataset.numero);
    const duracion = 1600;
    const inicio = performance.now();

    function actualizarContador(tiempoActual) {
      const progreso = Math.min((tiempoActual - inicio) / duracion, 1);
      const valorActual = Math.floor(progreso * numeroFinal);

      contador.textContent = valorActual;

      if (progreso < 1) {
        requestAnimationFrame(actualizarContador);
      } else {
        contador.textContent = numeroFinal;
      }
    }

    requestAnimationFrame(actualizarContador);
  }

  if (bloqueContadores && contadores.length > 0) {
    const observadorContadores = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting && !contadoresActivados) {
            contadores.forEach((contador) => animarContador(contador));
            contadoresActivados = true;
          }
        });
      },
      {
        threshold: 0.35,
      },
    );

    observadorContadores.observe(bloqueContadores);
  }

  /* ============================= */
  /* FORMULARIO CONTACTO */
  /* ============================= */

  const formularioContacto = document.getElementById("formulario_contacto");
  const avisoFormulario = document.getElementById("formulario_aviso");

  if (formularioContacto && avisoFormulario) {
    formularioContacto.addEventListener("submit", async (evento) => {
      evento.preventDefault();

      avisoFormulario.textContent = "Enviando solicitud...";
      avisoFormulario.classList.remove("correcto", "error");

      const botonEnviar = formularioContacto.querySelector(
        "button[type='submit']",
      );

      if (botonEnviar) {
        botonEnviar.disabled = true;
        botonEnviar.textContent = "Enviando...";
      }

      const datosFormulario = new FormData(formularioContacto);

      try {
        const respuesta = await fetch("enviar.php", {
          method: "POST",
          body: datosFormulario,
        });

        const resultado = await respuesta.json();

        if (resultado.ok) {
          avisoFormulario.textContent =
            "Gracias. Hemos recibido tu solicitud correctamente y te hemos enviado una copia por correo.";
          avisoFormulario.classList.add("correcto");
          formularioContacto.reset();
        } else {
          avisoFormulario.textContent =
            resultado.mensaje ||
            "Ha ocurrido un error al enviar el formulario. Inténtalo de nuevo.";
          avisoFormulario.classList.add("error");
        }
      } catch (error) {
        avisoFormulario.textContent =
          "No se ha podido enviar el formulario. Inténtalo de nuevo más tarde.";
        avisoFormulario.classList.add("error");
      }

      if (botonEnviar) {
        botonEnviar.disabled = false;
        botonEnviar.textContent = "Enviar solicitud";
      }
    });
  }

  /* ============================= */
  /* AVISO DE COOKIES */
  /* ============================= */

  const avisoCookies = document.getElementById("aviso_cookies");
  const botonAceptarCookies = document.getElementById("cookies_aceptar");
  const botonRechazarCookies = document.getElementById("cookies_rechazar");
  const botonConfigurarCookies = document.getElementById("cookies_configurar");
  const botonGuardarCookies = document.getElementById("cookies_guardar");
  const botonCerrarCookies = document.getElementById("cookies_cerrar");
  const preferenciasCookies = document.getElementById("cookies_preferencias");
  const checkboxTerceros = document.getElementById("cookies_terceros");

  function cargarServiciosExternos() {
    const avisoResenasGoogle = document.getElementById("aviso_resenas_google");

    if (avisoResenasGoogle) {
      avisoResenasGoogle.style.display = "none";
    }

    if (document.querySelector("script[data-elfsight]")) {
      return;
    }

    const scriptElfsight = document.createElement("script");
    scriptElfsight.src = "https://elfsightcdn.com/platform.js";
    scriptElfsight.async = true;
    scriptElfsight.setAttribute("data-elfsight", "true");

    document.body.appendChild(scriptElfsight);
  }

  function guardarConsentimientoCookies(valor) {
    localStorage.setItem("cookies_neopulsor", valor);

    if (avisoCookies) {
      avisoCookies.classList.remove("activo");
      avisoCookies.setAttribute("aria-hidden", "true");
    }

    if (valor === "aceptadas" || valor === "personalizadas_terceros") {
      cargarServiciosExternos();
    }
  }

  if (avisoCookies) {
    const consentimientoGuardado = localStorage.getItem("cookies_neopulsor");

    if (!consentimientoGuardado) {
      setTimeout(() => {
        avisoCookies.classList.add("activo");
        avisoCookies.setAttribute("aria-hidden", "false");
      }, 800);
    }

    if (
      consentimientoGuardado === "aceptadas" ||
      consentimientoGuardado === "personalizadas_terceros"
    ) {
      cargarServiciosExternos();
    }

    botonAceptarCookies?.addEventListener("click", () => {
      guardarConsentimientoCookies("aceptadas");
    });

    botonRechazarCookies?.addEventListener("click", () => {
      guardarConsentimientoCookies("rechazadas");
    });

    botonCerrarCookies?.addEventListener("click", () => {
      guardarConsentimientoCookies("rechazadas");
    });

    botonConfigurarCookies?.addEventListener("click", () => {
      preferenciasCookies?.classList.toggle("activo");
      botonGuardarCookies?.classList.toggle("activo");
    });

    botonGuardarCookies?.addEventListener("click", () => {
      if (checkboxTerceros?.checked) {
        guardarConsentimientoCookies("personalizadas_terceros");
      } else {
        guardarConsentimientoCookies("personalizadas_solo_necesarias");
      }
    });
  }
});
