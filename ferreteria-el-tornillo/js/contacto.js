/**
 * Ferretería El Tornillo - Lógica de Interacción y Validación
 * Archivo: js/contacto.js
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Elementos del DOM
  const contactForm = document.getElementById('contactForm');
  const nombreInput = document.getElementById('nombreInput');
  const mensajeInput = document.getElementById('mensajeInput');
  const formNotice = document.getElementById('formNotice');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // 2. Control del Menú Móvil
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // 3. Resaltado de Enlace Activo según la Sección Visible
  const sections = document.querySelectorAll('section[id]');
  const handleScroll = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleScroll);

  // 4. Limpieza del estado de error al escribir en el campo de nombre
  nombreInput.addEventListener('input', () => {
    if (nombreInput.value.trim().length >= 2) {
      nombreInput.classList.remove('input-error');
      // Si la alerta visible era de error, la ocultamos progresivamente
      if (formNotice.classList.contains('alert-error')) {
        formNotice.style.display = 'none';
      }
    }
  });

  // 5. Función auxiliar para escapar texto de usuario (prevención básica XSS)
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // 6. Manejo del Envío y Validación del Formulario
  contactForm.addEventListener('submit', (event) => {
    // Evitar envío por defecto (sitio estático sin backend)
    event.preventDefault();

    const nombreValor = nombreInput.value.trim();

    // Criterio de validación: El nombre debe tener al menos 2 caracteres
    if (nombreValor.length < 2) {
      // Estado de error / advertencia
      nombreInput.classList.add('input-error');
      nombreInput.focus();

      formNotice.className = 'alert-box alert-error';
      formNotice.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span><strong>Por favor, ingresa tu nombre:</strong> Debe tener al menos 2 caracteres para procesar tu solicitud.</span>
      `;
      formNotice.style.display = 'flex';

      // Asegurar que el usuario vea la alerta
      formNotice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    // Si la validación es exitosa:
    nombreInput.classList.remove('input-error');

    formNotice.className = 'alert-box alert-success';
    formNotice.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>¡Gracias por contactarnos, <strong>${escapeHTML(nombreValor)}</strong>! Hemos recibido tu mensaje y nos comunicaremos contigo pronto.</span>
    `;
    formNotice.style.display = 'flex';

    // Limpiar campos del formulario
    contactForm.reset();

    // Mantener la alerta visible y hacer scroll suave hacia ella
    formNotice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
