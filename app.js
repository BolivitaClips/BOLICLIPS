(() => {
  const cfg = window.BOLIVITA_RELEASE || {
    DOWNLOAD_URL: "",
    RELEASE_FILENAME: "BolivitaClips_Windows.zip",
    RELEASE_VERSION: "v1.0.0",
    RELEASE_SHA256: "PENDIENTE_DE_EMPAQUETAR",
    RELEASE_SIZE: "0.00 MB",
    RELEASE_DATE: "",
    CONTACT_EMAIL: "[TU_CORREO_DE_CONTACTO]",
  };

  // 1. Hidratar metadatos de release y contacto
  const shaEl = document.getElementById("sha256-value");
  const versionEl = document.getElementById("release-version");
  const sizeEl = document.getElementById("release-size");
  const dateEl = document.getElementById("release-date");

  if (shaEl && cfg.RELEASE_SHA256) shaEl.textContent = cfg.RELEASE_SHA256;
  if (versionEl && cfg.RELEASE_VERSION) versionEl.textContent = cfg.RELEASE_VERSION;
  if (sizeEl && cfg.RELEASE_SIZE) sizeEl.textContent = cfg.RELEASE_SIZE;
  if (dateEl && cfg.RELEASE_DATE) dateEl.textContent = cfg.RELEASE_DATE;

  document.querySelectorAll("[data-contact-email]").forEach((el) => {
    el.textContent = cfg.CONTACT_EMAIL || "[TU_CORREO_DE_CONTACTO]";
  });

  // 2. Menu movil
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      const isOpen = !mobileMenu.classList.contains("hidden");
      mobileMenu.classList.toggle("hidden", isOpen);
      mobileMenuBtn.setAttribute("aria-expanded", String(!isOpen));
    });
    mobileMenu.querySelectorAll("a, button").forEach((item) => {
      item.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 3. Candado legal obligatorio para descarga
  const legalCheckbox = document.getElementById("legal-consent-checkbox");
  const downloadBtn = document.getElementById("download-btn");
  const lockNotice = document.getElementById("download-lock-notice");
  const downloadFeedback = document.getElementById("download-feedback");

  function updateDownloadState() {
    if (!legalCheckbox || !downloadBtn) return;
    const accepted = legalCheckbox.checked;
    downloadBtn.disabled = !accepted;
    downloadBtn.setAttribute("aria-disabled", String(!accepted));

    if (lockNotice) {
      if (accepted) {
        lockNotice.textContent = "Descarga habilitada. Verifica el SHA-256 tras descargar si lo deseas.";
        lockNotice.classList.remove("text-amber-300/90");
        lockNotice.classList.add("text-emerald-400");
      } else {
        lockNotice.textContent = "Marca la casilla legal superior para desbloquear la descarga.";
        lockNotice.classList.remove("text-emerald-400");
        lockNotice.classList.add("text-amber-300/90");
      }
    }
    if (!accepted && downloadFeedback) {
      downloadFeedback.classList.add("hidden");
    }
  }

  if (legalCheckbox && downloadBtn) {
    legalCheckbox.addEventListener("change", updateDownloadState);
    updateDownloadState();

    downloadBtn.addEventListener("click", () => {
      if (!legalCheckbox.checked) {
        updateDownloadState();
        return;
      }

      const url = (cfg.DOWNLOAD_URL || "").trim();
      const isPlaceholder =
        !url ||
        url.includes("TU_USUARIO") ||
        url.includes("TU_REPOSITORIO");

      if (isPlaceholder) {
        if (downloadFeedback) {
          downloadFeedback.innerHTML =
            'El enlace oficial de GitHub Releases aún está en modo plantilla. Configura <code class="px-1.5 py-0.5 rounded bg-black/40 text-[#FFD166]">DOWNLOAD_URL</code> en <code class="px-1.5 py-0.5 rounded bg-black/40 text-[#FFD166]">website/release-config.js</code> siguiendo <code class="px-1.5 py-0.5 rounded bg-black/40 text-[#FFD166]">PUBLICAR_WEB.md</code>.';
          downloadFeedback.classList.remove("hidden");
        }
        return;
      }

      if (downloadFeedback) {
        downloadFeedback.textContent = `Iniciando descarga de ${cfg.RELEASE_FILENAME || "BolivitaClips_Windows.zip"}...`;
        downloadFeedback.classList.remove("hidden");
      }

      const link = document.createElement("a");
      link.href = url;
      link.download = cfg.RELEASE_FILENAME || "BolivitaClips_Windows.zip";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  }

  // 4. Boton copiar SHA-256
  const copyShaBtn = document.getElementById("copy-sha256-btn");
  const copyShaLabel = document.getElementById("copy-sha256-label");

  async function copyTextSafe(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {
        // fallback abajo
      }
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (_) {
      ok = false;
    }
    ta.remove();
    return ok;
  }

  if (copyShaBtn && shaEl) {
    let resetTimer = null;
    copyShaBtn.addEventListener("click", async () => {
      const hashText = (shaEl.textContent || "").trim();
      if (!hashText) return;
      const copied = await copyTextSafe(hashText);
      if (copyShaLabel) {
        copyShaLabel.textContent = copied ? "¡Copiado!" : "No disponible";
      }
      copyShaBtn.classList.add("border-emerald-400/60", "text-emerald-300");
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        if (copyShaLabel) copyShaLabel.textContent = "Copiar SHA-256";
        copyShaBtn.classList.remove("border-emerald-400/60", "text-emerald-300");
      }, 2200);
    });
  }

  // 5. Acordeon FAQ
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    if (!trigger) return;
    trigger.addEventListener("click", () => {
      const isOpen = item.getAttribute("data-open") === "true";
      faqItems.forEach((other) => {
        other.setAttribute("data-open", "false");
        const otherBtn = other.querySelector(".faq-trigger");
        if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.setAttribute("data-open", "true");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  // 6. Modales legales (5 modales)
  let activeModal = null;

  function openModal(modalId) {
    const modal = document.getElementById(`modal-${modalId}`);
    if (!modal) return;
    if (activeModal && activeModal !== modal) {
      closeModal(activeModal);
    }
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    activeModal = modal;

    const closeBtn = modal.querySelector("[data-close-modal]");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (activeModal === modal) activeModal = null;
  }

  document.querySelectorAll("[data-open-modal]").forEach((trigger) => {
    trigger.addEventListener("click", (ev) => {
      ev.preventDefault();
      const target = trigger.getAttribute("data-open-modal");
      if (target) openModal(target);
    });
  });

  document.querySelectorAll(".legal-modal").forEach((modal) => {
    modal.addEventListener("click", (ev) => {
      if (ev.target === modal) closeModal(modal);
    });
    modal.querySelectorAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", () => closeModal(modal));
    });
  });

  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && activeModal) {
      closeModal(activeModal);
    }
  });
})();
