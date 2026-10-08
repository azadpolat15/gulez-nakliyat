/* =========================================================
   İŞLETME BİLGİLERİ — sadece burayı düzenlemeniz yeterli
   ========================================================= */
const CONFIG = {
  firmaAdi: "Gülez Nakliyat",
  // Ülke kodu ile, boşluksuz ve başında + olmadan (ör. 905321234567)
  telefon: "905513439813",
  telefonGorunen: "0551 343 98 13",
  whatsappMesaj: "Merhaba, nakliyat hizmeti için fiyat teklifi almak istiyorum.",
  googleLink: "https://share.google/kYZqgHKlVkTwMAR6f",
  adres: "Gülezler İşhanı, Çenedağ, Denizciler Cd., Derince/Kocaeli",
  calismaSaatleri: "7/24 açık",
  googlePuan: "4,9",
  googleYorumSayisi: 21,
};

/* ========================================================= */

const root = document.documentElement;
root.classList.add("js");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const waLink = (text) => `https://wa.me/${CONFIG.telefon}?text=${encodeURIComponent(text)}`;

/* ---------- Kamyon çizimi (tek yerden, firma adıyla) ---------- */
function truckSVG(name) {
  const label = name.toLocaleUpperCase("tr-TR");
  const fit = label.length > 12 ? ' textLength="128" lengthAdjust="spacingAndGlyphs"' : "";
  const wheel = (cx) => `
    <g class="wheel">
      <circle cx="${cx}" cy="92" r="15" fill="#1b2433"/>
      <circle cx="${cx}" cy="92" r="8" fill="#cdd6e3"/>
      <path d="M${cx} 86v12M${cx - 6} 92h12" stroke="#1b2433" stroke-width="2.4" stroke-linecap="round"/>
    </g>`;
  return `
  <svg class="truck-svg" viewBox="0 0 230 112" role="img" aria-label="${name} kamyonu">
    <rect x="6" y="8" width="146" height="74" rx="8" fill="#fff" stroke="#0a2342" stroke-width="3"/>
    <rect x="7.5" y="62" width="143" height="9" fill="#f5a524"/>
    <text x="79" y="44" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="16" fill="#0a2342"${fit}>${label}</text>
    <path d="M152 28h42c4 0 7 2 9 5l19 25c1.5 2 2 4 2 6v18h-72z" fill="#12407a" stroke="#0a2342" stroke-width="3" stroke-linejoin="round"/>
    <path d="M162 36h30l15 20h-45z" fill="#cfe3fb"/>
    <rect x="212" y="66" width="10" height="6" rx="2" fill="#ffd27a"/>
    <rect x="4" y="80" width="222" height="9" rx="4.5" fill="#0a2342"/>
    ${wheel(42)}${wheel(84)}${wheel(186)}
  </svg>`;
}

/* ---------- İşletme bilgilerini sayfaya bağla ---------- */
function bindConfig() {
  document.title = document.title.replace("Gülez Nakliyat", CONFIG.firmaAdi);
  document.querySelectorAll("[data-firma]").forEach((el) => (el.textContent = CONFIG.firmaAdi));
  document.querySelectorAll("[data-tel]").forEach((el) => (el.href = `tel:+${CONFIG.telefon}`));
  document.querySelectorAll("[data-tel-text]").forEach((el) => (el.textContent = CONFIG.telefonGorunen));
  document.querySelectorAll("[data-wa]").forEach((el) => {
    el.href = waLink(CONFIG.whatsappMesaj);
    el.target = "_blank";
    el.rel = "noopener";
  });
  document.querySelectorAll("[data-google]").forEach((el) => (el.href = CONFIG.googleLink));
  if (CONFIG.adres) document.querySelectorAll("[data-adres]").forEach((el) => (el.textContent = CONFIG.adres));
  document.querySelectorAll("[data-saat]").forEach((el) => (el.textContent = CONFIG.calismaSaatleri));
  document.querySelectorAll("[data-puan]").forEach((el) => (el.textContent = CONFIG.googlePuan));
  document.querySelectorAll("[data-yorum]").forEach((el) => (el.textContent = CONFIG.googleYorumSayisi));
  document.querySelectorAll("[data-truck]").forEach((el) => (el.innerHTML = truckSVG(CONFIG.firmaAdi)));
  document.getElementById("yil").textContent = new Date().getFullYear();
}

/* ---------- Scroll'a bağlı animasyonlar ---------- */
const header = document.querySelector(".header");
const bar = document.querySelector(".progress span");
const hero = document.querySelector(".hero");
const journey = document.querySelector(".journey");
const steps = [...document.querySelectorAll(".step")];
const houseB = document.querySelector(".house-b");
const parallax = [...document.querySelectorAll("[data-speed]")];
const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav a[href^='#']:not(.btn)")];

let lastStep = -1;
function setStep(idx) {
  if (idx === lastStep) return;
  lastStep = idx;
  steps.forEach((s, i) => {
    s.classList.toggle("active", i === idx);
    s.classList.toggle("done", i < idx);
  });
  for (let i = 0; i < 4; i++) journey.classList.toggle("s" + i, i <= idx);
  houseB.classList.toggle("lit", idx === 3);
}

let ticking = false;
function update() {
  ticking = false;
  const y = window.scrollY;
  const vh = window.innerHeight;
  const max = root.scrollHeight - vh;

  bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  header.classList.toggle("scrolled", y > 24);
  root.style.setProperty("--wheel", `${(y * 0.9).toFixed(1)}deg`);

  if (reduceMotion) return;

  // Hero: kamyon sağa doğru ilerler, arka plan parallax
  const hp = clamp(y / hero.offsetHeight, 0, 1);
  hero.style.setProperty("--hp", hp.toFixed(3));
  if (y < hero.offsetHeight * 1.2) {
    parallax.forEach((el) => {
      el.style.transform = `translate3d(0, ${(y * parseFloat(el.dataset.speed)).toFixed(1)}px, 0)`;
    });
  }

  // Süreç bölümü: scroll ilerledikçe adımlar ve kamyon ilerler
  const rect = journey.getBoundingClientRect();
  const total = journey.offsetHeight - vh;
  const p = clamp(-rect.top / total, 0, 1);
  journey.style.setProperty("--p", p.toFixed(4));
  journey.style.setProperty("--truck", clamp((p - 0.45) / 0.33, 0, 1).toFixed(4));
  setStep(Math.min(3, Math.floor(p * 4)));

  // Menüde aktif bölüm
  let current = "";
  sections.forEach((s) => {
    if (s.getBoundingClientRect().top <= vh * 0.4) current = s.id;
  });
  navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
}

function onScroll() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
}

/* ---------- Görünür olunca beliren öğeler ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  items.forEach((el) => io.observe(el));
}

/* ---------- Sayaçlar ---------- */
function initCounters() {
  const els = document.querySelectorAll("[data-count]");
  const run = (el) => {
    const target = +el.dataset.count;
    if (reduceMotion) return (el.textContent = target.toLocaleString("tr-TR"));
    const start = performance.now();
    const dur = 1800;
    const tick = (t) => {
      const k = Math.min(1, (t - start) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))).toLocaleString("tr-TR");
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          run(e.target);
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.6 }
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- Mobil menü ---------- */
function initMenu() {
  const btn = document.querySelector(".menu-btn");
  const setOpen = (open) => {
    document.body.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
  };
  btn.addEventListener("click", () => setOpen(!document.body.classList.contains("menu-open")));
  document.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
}

/* ---------- Teklif formu → WhatsApp mesajı ---------- */
function initQuoteForm() {
  const form = document.getElementById("teklifForm");
  const error = form.querySelector(".form-error");
  const required = ["ad", "nereden", "nereye"].map((id) => form.elements[id]);

  required.forEach((input) => input.addEventListener("input", () => input.classList.remove("invalid")));

  // Geçmiş tarih seçilemesin
  form.elements.tarih.min = new Date().toISOString().split("T")[0];

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const empty = required.filter((i) => !i.value.trim());
    required.forEach((i) => i.classList.toggle("invalid", !i.value.trim()));
    error.hidden = empty.length === 0;
    if (empty.length) return empty[0].focus();

    const f = form.elements;
    const tarih = f.tarih.value
      ? new Date(f.tarih.value + "T12:00").toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", weekday: "long" })
      : "Henüz belli değil";

    const lines = [
      "Merhaba, nakliyat için fiyat teklifi almak istiyorum.",
      "",
      `*Ad Soyad:* ${f.ad.value.trim()}`,
      `*Nereden:* ${f.nereden.value.trim()}`,
      `*Nereye:* ${f.nereye.value.trim()}`,
      `*Tarih:* ${tarih}`,
      `*Ev tipi:* ${f.tip.value}`,
      `*Asansör:* ${f.asansor.value}`,
    ];
    if (f.not.value.trim()) lines.push(`*Not:* ${f.not.value.trim()}`);

    window.open(waLink(lines.join("\n")), "_blank", "noopener");
  });
}

/* ---------- Başlat ---------- */
bindConfig();
initReveal();
initCounters();
initMenu();
initQuoteForm();

if (reduceMotion) setStep(3);
update();
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
