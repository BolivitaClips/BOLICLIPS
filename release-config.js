// ============================================================================
// CONFIGURACION DE PUBLICACION - BOLIVITA CLIPS
// ============================================================================
// 1. Sube `BolivitaClips_Windows.zip` a GitHub Releases.
// 2. Pega el enlace directo de descarga en la constante `DOWNLOAD_URL` abajo.
// 3. `RELEASE_SHA256`, `RELEASE_SIZE` y `RELEASE_DATE` se actualizan
//    automaticamente cada vez que ejecutas `python scripts/empacar_release.py`.
// ============================================================================

const DOWNLOAD_URL = "https://github.com/BolivitaClips/BOLICLIPS/releases/latest/download/BolivitaClips_Windows.zip";

window.BOLIVITA_RELEASE = {
  DOWNLOAD_URL,
  RELEASE_FILENAME: "BolivitaClips_Windows.zip",
  RELEASE_VERSION: "v1.0.0",
  RELEASE_SHA256: "B6C97210B08617521F78CE5D2FADCBE036962E014F5E3CE86C2E3515A357408E",
  RELEASE_SIZE: "0.46 MB",
  RELEASE_DATE: "2026-11-19",
  CONTACT_EMAIL: "[TU_CORREO_DE_CONTACTO]",
};
