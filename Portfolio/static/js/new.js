/* =========================================================
   RAFID AL MAHMUD - PORTFOLIO JAVASCRIPT
   Interactive UI / Animation / Filtering / Validation
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* ================= ELEMENT SELECTOR ================= */

  const select = (selector, parent = document) =>
    parent.querySelector(selector);

  const selectAll = (selector, parent = document) => [
    ...parent.querySelectorAll(selector),
  ];

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ================= PRELOADER ================= */

  const preloader = select("#preloader");

  function hidePreloader() {
    if (!preloader) return;

    preloader.classList.add("loaded");
    document.body.classList.add("page-loaded");

    setTimeout(() => {
      preloader.style.display = "none";
    }, 650);
  }

  window.addEventListener("load", hidePreloader, { once: true });

  // Fallback if a remote image or font takes too long.
  setTimeout(hidePreloader, 3500);

  /* ================= TOAST NOTIFICATION ================= */

  const toast = select("#siteToast");
  const toastMessage = select("#toastMessage");
  let toastTimer;

  function showToast(message, type = "success") {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;

    const icon = select("i", toast);

    if (icon) {
      icon.className =
        type === "error"
          ? "bi bi-exclamation-circle-fill"
          : "bi bi-check-circle-fill";
    }

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  /* ================= THEME SWITCHER ================= */

  const themeToggle = select("#themeToggle");
  const root = document.documentElement;

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);

    if (themeToggle) {
      const icon = select("i", themeToggle);

      if (icon) {
        icon.className =
          theme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
      }

      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
      );
    }

    try {
      localStorage.setItem("rafid-portfolio-theme", theme);
    } catch (error) {
      // The site still works if browser storage is unavailable.
    }
  }

  let savedTheme = "dark";

  try {
    savedTheme = localStorage.getItem("rafid-portfolio-theme") || "dark";
  } catch (error) {
    savedTheme = "dark";
  }

  setTheme(savedTheme);

  themeToggle?.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "dark";
    setTheme(current === "dark" ? "light" : "dark");
    showToast("Theme updated");
  });

  /* ================= TYPING ANIMATION ================= */

  const typingElement = select("#typingText");

  const typingWords = [
    "Software Engineer",
    "Python Developer",
    "Django Developer",
    "Web Developer",
    "Problem Solver",
  ];

  let wordIndex = 0;
  let characterIndex = 0;
  let deleting = false;

  function typeEffect() {
    if (!typingElement || reducedMotion) return;

    const currentWord = typingWords[wordIndex];

    if (!deleting) {
      characterIndex++;
      typingElement.textContent = currentWord.slice(0, characterIndex);

      if (characterIndex === currentWord.length) {
        deleting = true;
        setTimeout(typeEffect, 1300);
        return;
      }
    } else {
      characterIndex--;
      typingElement.textContent = currentWord.slice(0, characterIndex);

      if (characterIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % typingWords.length;
      }
    }

    setTimeout(typeEffect, deleting ? 45 : 85);
  }

  if (typingElement && !reducedMotion) {
    typingElement.textContent = "";
    setTimeout(typeEffect, 500);
  }

  /* ================= NAVBAR SCROLL EFFECT ================= */

  const header = select("#header");
  const scrollProgress = select("#scrollProgress");
  const backToTop = select("#backToTop");

  function handleScroll() {
    const scrollTop = window.scrollY;
    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    if (header) {
      header.classList.toggle("scrolled", scrollTop > 40);
    }

    if (scrollProgress) {
      const progress =
        documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

      scrollProgress.style.width = `${progress}%`;
    }

    if (backToTop) {
      backToTop.classList.toggle("show", scrollTop > 450);
    }

    updateActiveNavigation();
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* ================= ACTIVE NAVIGATION ================= */

  const sections = selectAll("main section[id]");
  const navLinks = selectAll(".navbar-nav .nav-link");

  function updateActiveNavigation() {
    let currentSection = "";

    const scrollPosition = window.scrollY + 160;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollPosition >= top && scrollPosition < bottom) {
        currentSection = section.id;
      }
    });

    navLinks.forEach((link) => {
      const target = link.getAttribute("href");

      link.classList.toggle("active", target === `#${currentSection}`);
    });
  }

  /* ================= MOBILE NAVBAR ================= */

  const navbarCollapse = select("#mainNav");

  if (navbarCollapse && window.bootstrap) {
    const collapseInstance = bootstrap.Collapse.getOrCreateInstance(
      navbarCollapse,
      { toggle: false },
    );

    selectAll(".navbar-nav a").forEach((link) => {
      link.addEventListener("click", () => {
        if (
          window.innerWidth < 992 &&
          navbarCollapse.classList.contains("show")
        ) {
          collapseInstance.hide();
        }
      });
    });
  }

  /* ================= SMOOTH SCROLL ================= */

  selectAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = select(targetId);

      if (!target) return;

      event.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;

      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

      window.scrollTo({
        top: targetPosition,
        behavior: reducedMotion ? "instant" : "smooth",
      });

      history.replaceState(null, "", targetId);
    });
  });

  /* ================= REVEAL ANIMATION ================= */

  const revealElements = selectAll(".reveal");

  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      },
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* ================= COUNTER ANIMATION ================= */

  const counters = selectAll(".counter");

  function animateCounter(counter) {
    if (counter.dataset.animated === "true") return;

    counter.dataset.animated = "true";

    const target = Number(counter.dataset.target);

    if (!Number.isFinite(target)) return;

    if (reducedMotion) {
      counter.textContent = target;
      return;
    }

    const duration = 1400;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 4);
      const value = Math.floor(eased * target);

      counter.textContent = value;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  /* ================= SKILL BAR ANIMATION ================= */

  const skillBars = selectAll(".skill-track span");

  if ("IntersectionObserver" in window && !reducedMotion) {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const width = bar.dataset.width || "0%";

            bar.style.width = width;
            skillObserver.unobserve(bar);
          }
        });
      },
      { threshold: 0.3 },
    );

    skillBars.forEach((bar) => skillObserver.observe(bar));
  } else {
    skillBars.forEach((bar) => {
      bar.style.width = bar.dataset.width || "0%";
    });
  }

  /* ================= PROJECT FILTER ================= */

  const filterButtons = selectAll(".filter-btn");
  const projectItems = selectAll(".project-item");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      projectItems.forEach((project) => {
        const categories = (project.dataset.category || "").split(/\s+/);

        const shouldShow = filter === "all" || categories.includes(filter);

        project.classList.toggle("hide", !shouldShow);

        if (shouldShow && !reducedMotion) {
          project.animate(
            [
              { opacity: 0, transform: "translateY(12px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: 350,
              easing: "ease-out",
            },
          );
        }
      });
    });
  });

  /* ================= MODAL SYSTEM ================= */

  let activeModal = null;
  let lastFocusedElement = null;

  function openModal(modal) {
    if (!modal) return;

    lastFocusedElement = document.activeElement;
    activeModal = modal;

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const closeButton = select(".modal-close", modal);
    closeButton?.focus();
  }

  function closeModal(modal = activeModal) {
    if (!modal) return;

    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
    activeModal = null;

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  selectAll(".project-details-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const modal = select("#projectModal");
      if (!modal) return;

      const title = select("#projectModalTitle");
      const description = select("#projectModalDescription");

      if (title) {
        title.textContent = button.dataset.title || "Project Details";
      }

      if (description) {
        description.textContent =
          button.dataset.description || "Project information.";
      }

      openModal(modal);
    });
  });

  selectAll(".certificate-view[data-image]").forEach((button) => {
    button.addEventListener("click", () => {
      const modal = select("#certificateModal");
      const image = select("#certificateModalImage");
      const title = select("#certificateModalTitle");

      if (!modal || !image || !title) return;

      title.textContent = button.dataset.title || "Certificate";
      image.src = button.dataset.image || "";
      image.alt = title.textContent;

      image.onerror = () => {
        image.alt =
          "Certificate image could not be loaded. Check the image path.";
      };

      openModal(modal);
    });
  });

  selectAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      closeModal(button.closest(".custom-modal"));
    });
  });

  selectAll(".modal-close").forEach((button) => {
    button.addEventListener("click", () => {
      closeModal(button.closest(".custom-modal"));
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && activeModal) {
      closeModal(activeModal);
    }
  });

  /* ================= CONTACT FORM VALIDATION ================= */

  const contactForm = select("#contactForm");
  const formStatus = select("#formStatus");
  const submitButton = select("#contactSubmit");

  function setFormStatus(message, type) {
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
  }

  function validateField(field) {
    if (!field) return true;

    const value = field.value.trim();

    if (field.required && !value) {
      field.setCustomValidity("This field is required.");
      return false;
    }

    if (field.type === "email" && value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(value)) {
        field.setCustomValidity("Please enter a valid email address.");
        return false;
      }
    }

    if (field.name === "name" && value.length < 2) {
      field.setCustomValidity("Name must contain at least 2 characters.");
      return false;
    }

    if (field.name === "message" && value.length < 10) {
      field.setCustomValidity("Message must contain at least 10 characters.");
      return false;
    }

    field.setCustomValidity("");
    return true;
  }

  if (contactForm) {
    const formFields = selectAll(
      "input[required], textarea[required]",
      contactForm,
    );

    formFields.forEach((field) => {
      field.addEventListener("input", () => {
        validateField(field);
      });
    });

    contactForm.addEventListener("submit", (event) => {
      let valid = true;

      formFields.forEach((field) => {
        if (!validateField(field)) {
          valid = false;
        }
      });

      if (!valid || !contactForm.checkValidity()) {
        event.preventDefault();
        contactForm.reportValidity();
        setFormStatus(
          "Please check the highlighted fields and try again.",
          "error",
        );
        return;
      }

      // Allow the browser to submit the form to the Django view.
      // Django handles saving the message to the database.
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML =
          'Sending... <i class="bi bi-hourglass-split"></i>';
      }

      setFormStatus("Sending your message...", "success");
    });
  }

  /* ================= BACK TO TOP ================= */

  backToTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "instant" : "smooth",
    });
  });

  /* ================= CURRENT YEAR ================= */

  const currentYear = select("#currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* ================= IMAGE FALLBACK ================= */

  selectAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("image-load-error");
    });
  });

  /* ================= SOCIAL LINK SAFETY ================= */

  selectAll('a[target="_blank"]').forEach((link) => {
    link.setAttribute("rel", "noopener noreferrer");
  });

  /* ================= INITIAL ACCESSIBILITY STATES ================= */

  filterButtons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      button.classList.contains("active") ? "true" : "false",
    );
  });

  console.info("Rafid Portfolio JavaScript initialized successfully.");
});
