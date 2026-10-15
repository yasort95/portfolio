document.addEventListener("DOMContentLoaded", () => {
  // Elementos de la interfaz
  const menuBtn = document.getElementById("menu-btn");
  const closeMenuBtn = document.getElementById("close-menu-btn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const langSelect = document.getElementById("lang-select");

  // ================= Control del Menú Hamburguesa =================
  const openMenu = () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  };

  const closeMenu = () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  };

  menuBtn.addEventListener("click", openMenu);
  closeMenuBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  // Cerrar menú al hacer clic en un enlace del sidebar
  document.querySelectorAll(".sidebar-links a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // ================= Sistema de Traducción (i18n) =================
  let currentTranslations = {};

  // Traducciones de respaldo (para que funcione tanto en servidor web como abriendo index.html localmente)
  const fallbackTranslations = {
    es: {
      page_title: "Portafolio - Yasueth Gilberto Ortega Ortega",
      name: "Yasueth Gilberto Ortega Ortega",
      title: "Desarrollador de software",
      nav: {
        about: "Sobre mí",
        contact: "Contacto",
        skills: "Habilidades",
        portfolio: "Portafolio",
        download_cv: "Descargar CV"
      },
      cards: {
        portfolio: "Portafolio",
        profile_photo: "Foto de perfil",
        studies: "Estudios"
      },
      sections: {
        about_me: "Sobre mí",
        contact: "Contacto",
        skills: "Habilidades",
        portfolio: "Portafolio",
        detailed_skills: "Skills",
        learning: "Aprendiendo",
        education: "Estudios"
      },
      about_text: "¡Hola! Soy un apasionado desarrollador de software enfocado en crear soluciones web interactivas, accesibles y de alto impacto.",
      skills_summary: "Especializado en desarrollo frontend y backend, integración de APIs y buenas prácticas de desarrollo.",
      projects: {
        project1_title: "QR Studio Pro",
        project1_desc: "Generador de Códigos QR Profesional",
        project2_title: "Simulador de Matrices PRO",
        project2_desc: "Visualización y cálculo de matrices"
      },
      skills_categories: {
        languages: "Lenguajes de programación",
        languages_desc: "JavaScript, TypeScript, Python, HTML5, CSS3",
        frameworks: "Frameworks y librerías",
        frameworks_desc: "React, Node.js, Express, TailwindCSS",
        tools: "Software y Herramientas",
        tools_desc: "Git, GitHub, VS Code, Figma, Docker",
        learning_desc: "Next.js, GraphQL, Inteligencia Artificial aplicada",
        education_desc: "Ingeniería de Software / Certificaciones de Desarrollo Web"
      }
    },
    en: {
      page_title: "Portfolio - Yasueth Gilberto Ortega Ortega",
      name: "Yasueth Gilberto Ortega Ortega",
      title: "Software Developer",
      nav: {
        about: "About me",
        contact: "Contact",
        skills: "Skills",
        portfolio: "Portfolio",
        download_cv: "Download CV"
      },
      cards: {
        portfolio: "Portfolio",
        profile_photo: "Profile picture",
        studies: "Education"
      },
      sections: {
        about_me: "About me",
        contact: "Contact",
        skills: "Skills",
        portfolio: "Portfolio",
        detailed_skills: "Skills",
        learning: "Learning",
        education: "Education"
      },
      about_text: "Hello! I am a passionate software developer focused on creating interactive, accessible, and high-performance web solutions.",
      skills_summary: "Specialized in frontend and backend development, API integration, and clean code principles.",
      projects: {
        project1_title: "QR Studio Pro",
        project1_desc: "Professional QR Code Generator",
        project2_title: "Matrix Simulator PRO",
        project2_desc: "Matrix visualization and calculation tool"
      },
      skills_categories: {
        languages: "Programming languages",
        languages_desc: "JavaScript, TypeScript, Python, HTML5, CSS3",
        frameworks: "Frameworks and libraries",
        frameworks_desc: "React, Node.js, Express, TailwindCSS",
        tools: "Software & Tools",
        tools_desc: "Git, GitHub, VS Code, Figma, Docker",
        learning_desc: "Next.js, GraphQL, Applied Artificial Intelligence",
        education_desc: "Software Engineering / Web Development Certifications"
      }
    }
  };

  // Función para obtener claves anidadas tipo "nav.about"
  const getNestedTranslation = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  // Mapa para controlar intervalos de máquina de escribir activos y evitar solapamientos
  const activeTypewriters = new WeakMap();

  // Efecto máquina de escribir de izquierda a derecha
  const typeText = (el, text, speed = 28) => {
    if (!el) return;
    if (activeTypewriters.has(el)) {
      clearInterval(activeTypewriters.get(el));
    }

    el.textContent = "";
    el.classList.add("typewriter-active");
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        el.textContent += text.charAt(index);
        index++;
      } else {
        clearInterval(interval);
        activeTypewriters.delete(el);
      }
    }, speed);

    activeTypewriters.set(el, interval);
  };

  // Aplicar traducciones a elementos con atributo data-i18n
  const applyTranslations = (translations) => {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const translation = getNestedTranslation(translations, key);
      if (translation) {
        if (el.classList.contains("sub-title")) {
          typeText(el, translation, 45);
        } else {
          el.textContent = translation;
        }
      }
    });
  };

  // Cargar archivo JSON según idioma (con fallback local)
  const loadLanguage = async (lang) => {
    try {
      const response = await fetch(`locales/${lang}.json`);
      if (!response.ok) throw new Error(`Error cargando locales/${lang}.json`);
      currentTranslations = await response.json();
    } catch (error) {
      if (fallbackTranslations[lang]) {
        currentTranslations = fallbackTranslations[lang];
      }
    }

    if (currentTranslations && Object.keys(currentTranslations).length > 0) {
      applyTranslations(currentTranslations);
      document.documentElement.lang = lang;
      try {
        localStorage.setItem("portfolio_lang", lang);
      } catch (e) {
        // No hacer nada si localStorage está bloqueado
      }
    }
  };

  // ================= Animaciones de Aparición al Hacer Scroll =================
  const initScrollAnimations = () => {
    // Textos y títulos que se despliegan de izquierda a derecha
    const writeElements = document.querySelectorAll(
      ".section-label, .detail-label-green, .detail-title-blue, .gradient-banner p"
    );
    writeElements.forEach((el) => el.classList.add("reveal-write"));

    // Bloques y tarjetas que aparecen progresivamente
    const groups = [
      { selector: ".chevron-card", stagger: 120 },
      { selector: ".gradient-banner", stagger: 0 },
      { selector: ".circle-btn", stagger: 100 },
      { selector: ".ribbon-card", stagger: 150 },
      { selector: ".detail-item", stagger: 80 }
    ];

    groups.forEach(({ selector, stagger }) => {
      document.querySelectorAll(selector).forEach((el, idx) => {
        el.classList.add("reveal-item");
        if (stagger > 0) {
          el.style.animationDelay = `${idx * stagger}ms`;
        }
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    document
      .querySelectorAll(".reveal-write, .reveal-item")
      .forEach((el) => observer.observe(el));
  };

  // ================= Fondo Animado Interactivo (Canvas) =================
  const initBackgroundCanvas = () => {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const mouse = { x: null, y: null, radius: 130 };
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener("mouseout", () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Colores oficiales del portafolio
    const palette = ["#8fe537", "#8054d8", "#1c62f2", "#46bd54"];
    const particleCount = Math.min(60, Math.floor((width * height) / 18000));

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.65,
      vy: (Math.random() - 0.5) * 0.65,
      size: Math.random() * 2.2 + 1,
      color: palette[Math.floor(Math.random() * palette.length)]
    }));

    // Orbes de luz ambiental suave en el fondo
    const orbs = [
      { x: width * 0.2, y: height * 0.3, r: 220, vx: 0.25, vy: 0.18, color: "rgba(128, 84, 216, 0.12)" },
      { x: width * 0.8, y: height * 0.7, r: 260, vx: -0.2, vy: -0.22, color: "rgba(143, 229, 55, 0.08)" },
      { x: width * 0.5, y: height * 0.5, r: 200, vx: 0.18, vy: -0.15, color: "rgba(28, 98, 242, 0.09)" }
    ];

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Dibujar orbes ambientales
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < 0 || orb.x > width) orb.vx *= -1;
        if (orb.y < 0 || orb.y > height) orb.vy *= -1;

        const grad = ctx.createRadialGradient(orb.x, orb.y, 10, orb.x, orb.y, orb.r);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, "rgba(18, 0, 37, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Actualizar y dibujar partículas
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Interacción suave con el cursor
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius && dist > 0) {
            p.x += (dx / dist) * 0.8;
            p.y += (dy / dist) * 0.8;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Conectar partículas cercanas con líneas sutiles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 125) {
            const alpha = (1 - dist / 125) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(143, 229, 55, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
  };

  // Idioma guardado o por defecto 'es'
  let savedLang = "es";
  try {
    savedLang = localStorage.getItem("portfolio_lang") || "es";
  } catch (e) {
    savedLang = "es";
  }

  initBackgroundCanvas();
  initScrollAnimations();

  langSelect.value = savedLang;
  loadLanguage(savedLang);

  // Escuchar cambio en el select de idioma
  langSelect.addEventListener("change", (e) => {
    loadLanguage(e.target.value);
  });
});