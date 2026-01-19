/*********************************************************
 * GLOBAL STATE
 *********************************************************/
let certImages = [];
let currentLang = localStorage.getItem("selectedLang") || "ar";
let langData = {};

/*********************************************************
 * DOM ELEMENTS
 *********************************************************/
const dom = {
  loading: document.getElementById("loadingScreen"),
  collage: document.getElementById("collage"),
  certSection: document.getElementById("certSection"),
  gallerySection: document.getElementById("gallerySection"),
  certToggle: document.getElementById("certToggle"),
  galleryToggle: document.getElementById("galleryToggle"),
};

/*********************************************************
 * LANGUAGE LOADING
 *********************************************************/
async function loadLanguage(lang) {
  try {
    const res = await fetch(`lang/${lang}.json`);
    langData = await res.json();

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    applyI18n();
  } catch (err) {
    console.error("Language load error:", err);
  }
}

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;

    const keys = key.split(".");
    let text = langData;
    for (let k of keys) {
      if (text && k in text) text = text[k];
      else text = null;
    }
    if (text !== null && text !== undefined) el.textContent = text;
  });
}

/*********************************************************
 * PARTICLES
 *********************************************************/
function createParticles() {
  const container = document.getElementById("particles");
  if (!container) return;

  container.innerHTML = "";
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 20 + "s";
    particle.style.animationDuration = 15 + Math.random() * 10 + "s";
    container.appendChild(particle);
  }
}

/*********************************************************
 * CERTIFICATES COLLAGE
 *********************************************************/
function buildCollage() {
  if (!dom.collage) return;

  dom.collage.innerHTML = "";

  const rect = dom.collage.getBoundingClientRect();
  const maxW = rect.width - 120;
  const maxH = rect.height - 160;

  certImages = [];
  for (let i = 1; i <= 50; i++) {
    certImages.push({
      thumb: `images-small/cert${i}.webp`,
      x: Math.random() * maxW,
      y: Math.random() * maxH,
      rotate: (Math.random() - 0.5) * 20,
    });
  }

  certImages.forEach((img) => {
    const cert = document.createElement("div");
    cert.className = "cert";
    cert.style.left = img.x + "px";
    cert.style.top = img.y + "px";
    cert.style.transform = `rotate(${img.rotate}deg)`;
    cert.innerHTML = `<img src="${img.thumb}" loading="lazy">`;
    dom.collage.appendChild(cert);
  });
}

/*********************************************************
 * SECTION TOGGLE
 *********************************************************/
dom.certToggle?.addEventListener("click", () => {
  dom.certSection.classList.add("active");
  dom.gallerySection.classList.remove("active");
  dom.certToggle.classList.add("active");
  dom.galleryToggle.classList.remove("active");
  buildCollage();
});

dom.galleryToggle?.addEventListener("click", () => {
  dom.gallerySection.classList.add("active");
  dom.certSection.classList.remove("active");
  dom.galleryToggle.classList.add("active");
  dom.certToggle.classList.remove("active");
});

/*********************************************************
 * INIT
 *********************************************************/
window.addEventListener("load", async () => {
  await loadLanguage(currentLang);
  createParticles();
  buildCollage();

  // Hide loading screen
  setTimeout(() => {
    dom.loading?.classList.add("hidden");
  }, 1500);
});

// Optional: rebuild collage on resize
window.addEventListener("resize", () => {
  buildCollage();
});
