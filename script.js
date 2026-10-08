/* =========================================================
   İŞLETME BİLGİLERİ — sadece burayı düzenlemeniz yeterli
   ========================================================= */
const CONFIG = {
  firmaAdi: "Gülez Nakliyat",
  // Ülke kodu ile, boşluksuz ve başında + olmadan
  telefon: "905513439813",
  telefonGorunen: "0551 343 98 13",
  whatsappMesaj: "Merhaba, nakliyat hizmeti için fiyat teklifi almak istiyorum.",
  googleLink: "https://share.google/kYZqgHKlVkTwMAR6f",
  adres: "Gülezler İşhanı, Çenedağ, Denizciler Cd., Derince/Kocaeli",
  googlePuan: "4,9",
  googleYorumSayisi: 21,
};

/* ========================================================= */

const root = document.documentElement;
root.classList.add("js");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const waLink = (text) => `https://wa.me/${CONFIG.telefon}?text=${encodeURIComponent(text)}`;
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

/* ---------- Tekrarlanabilir rastgele sayı (sahne her açılışta aynı görünsün) ---------- */
function rng(seed) {
  let s = seed % 2147483647 || 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/* ---------- Çizimler ---------- */
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
    <rect x="6" y="8" width="146" height="74" rx="8" fill="#fff" stroke="#0b1f3a" stroke-width="3"/>
    <rect x="7.5" y="62" width="143" height="9" fill="#f6a623"/>
    <text x="79" y="44" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="800" font-size="16" fill="#0b1f3a"${fit}>${label}</text>
    <path d="M152 28h42c4 0 7 2 9 5l19 25c1.5 2 2 4 2 6v18h-72z" fill="#1c5aa6" stroke="#0b1f3a" stroke-width="3" stroke-linejoin="round"/>
    <path d="M162 36h30l15 20h-45z" fill="#cfe3fb"/>
    <rect x="212" y="66" width="10" height="6" rx="2" fill="#ffd27a"/>
    <rect x="4" y="80" width="222" height="9" rx="4.5" fill="#0b1f3a"/>
    ${wheel(42)}${wheel(84)}${wheel(186)}
  </svg>`;
}

// Rastgele bina silüeti (isteğe bağlı yanan pencerelerle)
function citySVG({ w = 1440, h = 260, seed = 1, color, win = null, minH = 0.25, maxH = 0.85, extra = "" }) {
  const r = rng(seed);
  let x = 0, blds = "", wins = "";
  while (x < w) {
    const bw = 34 + r() * 80;
    const bh = h * (minH + r() * (maxH - minH));
    const top = h - bh;
    blds += `<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${(bw + 0.6).toFixed(1)}" height="${bh.toFixed(1)}"/>`;
    if (r() < 0.18) blds += `<rect x="${(x + bw / 2 - 1.5).toFixed(1)}" y="${(top - 18).toFixed(1)}" width="3" height="18"/>`;
    if (win) {
      for (let wy = top + 10; wy < h - 14; wy += 16) {
        for (let wx = x + 7; wx < x + bw - 10; wx += 13) {
          if (r() < 0.3) {
            const tw = r() < 0.12 ? ` class="tw" style="animation-delay:-${(r() * 6).toFixed(1)}s"` : "";
            wins += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="6" height="8" rx="1"${tw}/>`;
          }
        }
      }
    }
    x += bw + (r() < 0.25 ? 4 + r() * 16 : 0);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMax slice"><g fill="${color}">${blds}</g>${extra}${win ? `<g fill="${win}">${wins}</g>` : ""}</svg>`;
}

// Derince limanı vinci
function crane(x, base, h, c) {
  const t = base - h;
  return `<g stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round">
    <path d="M${x} ${base}L${x + 8} ${t}M${x + 34} ${base}L${x + 26} ${t}M${x + 4} ${(base + t) / 2}H${x + 30}M${x + 8} ${t}H${x + 26}"/>
    <path d="M${x - 70} ${t - 8}H${x + 120}M${x + 17} ${t - 44}L${x - 70} ${t - 8}M${x + 17} ${t - 44}L${x + 120} ${t - 8}M${x + 17} ${t - 44}V${t}"/>
    <path d="M${x - 40} ${t - 8}V${t + 26}" stroke-width="2"/>
  </g>`;
}

function treesSVG({ w = 1440, h = 200, seed = 5, color, lamps = false }) {
  const r = rng(seed);
  let out = "";
  for (let i = 0; i < 46; i++) {
    const x = r() * w, rad = 12 + r() * 22, base = h - 6;
    out += `<rect x="${(x - 2).toFixed(1)}" y="${(base - rad * 1.6).toFixed(1)}" width="4" height="${(rad * 1.6).toFixed(1)}"/>`;
    out += r() < 0.35
      ? `<ellipse cx="${x.toFixed(1)}" cy="${(base - rad * 2).toFixed(1)}" rx="${(rad * 0.55).toFixed(1)}" ry="${(rad * 1.4).toFixed(1)}"/>`
      : `<circle cx="${x.toFixed(1)}" cy="${(base - rad * 1.7).toFixed(1)}" r="${rad.toFixed(1)}"/>`;
  }
  if (lamps) {
    for (let x = 80; x < w; x += 240) {
      out += `<rect x="${x}" y="${h - 120}" width="5" height="114"/><path d="M${x + 2} ${h - 118}q0-10 22-10h6v6h-6q-16 0-16 6z"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMax slice"><rect y="${h - 8}" width="${w}" height="8" fill="${color}"/><g fill="${color}">${out}</g></svg>`;
}

const svgURL = (s) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;

function buildScenes() {
  // Hero: dağlar, karşı kıyı + liman vinçleri, körfez, yakın tepeler
  $(".l-mountains").innerHTML = `<svg viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice">
    <path fill="#b9d3ee" d="M0 150L140 92L260 128L420 44L560 118L700 72L860 140L1010 52L1160 118L1300 78L1440 118V320H0Z"/>
    <path fill="#94b8de" d="M0 205L180 142L330 190L480 122L640 192L780 150L940 200L1100 132L1260 192L1440 150V320H0Z"/></svg>`;

  const cityColor = "#5d8cc2";
  const cranes = crane(980, 260, 120, cityColor) + crane(1160, 260, 150, cityColor) + crane(1320, 260, 110, cityColor);
  $(".l-city").innerHTML = citySVG({ seed: 11, color: cityColor, minH: 0.15, maxH: 0.62, extra: cranes });

  const r = rng(9);
  let waves = "";
  for (let i = 0; i < 70; i++) {
    const x = r() * 1500, y = 14 + r() * 200, l = 16 + r() * 50;
    waves += `<path d="M${x.toFixed(0)} ${y.toFixed(0)}h${l.toFixed(0)}"/>`;
  }
  $(".l-water").insertAdjacentHTML("afterbegin", `<svg viewBox="0 0 1440 240" preserveAspectRatio="none">
    <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4b90d2"/><stop offset="1" stop-color="#1d528f"/></linearGradient></defs>
    <rect width="1440" height="240" fill="url(#wg)"/>
    <g class="waves" stroke="#fff" stroke-opacity=".35" stroke-width="2.5" stroke-linecap="round">${waves}</g></svg>`);
  $(".ship").innerHTML = `<svg viewBox="0 0 160 50"><rect x="120" y="2" width="22" height="28" fill="#fff"/><rect x="124" y="7" width="14" height="5" fill="#1d528f"/>
    <rect x="18" y="16" width="24" height="14" fill="#e4572e"/><rect x="44" y="16" width="24" height="14" fill="#f6a623"/><rect x="70" y="16" width="24" height="14" fill="#2f9e74"/><rect x="96" y="16" width="22" height="14" fill="#f4f4f4"/>
    <rect x="44" y="4" width="24" height="12" fill="#2f74c8"/><rect x="70" y="4" width="24" height="12" fill="#e4572e"/>
    <path d="M0 30H160L146 48H12Z" fill="#0b1f3a"/></svg>`;

  $(".l-hills").innerHTML = `<svg viewBox="0 0 1440 200" preserveAspectRatio="xMidYMax slice">
    <path fill="#17477a" d="M0 78C240 34 420 44 640 72S1040 104 1240 64S1400 46 1440 54V200H0Z"/></svg>`;
  $(".l-hills").insertAdjacentHTML("beforeend", treesSVG({ seed: 5, color: "#123a66", w: 1440, h: 200 }).replace("<svg ", '<svg style="position:absolute;inset:0;width:100%;height:100%" '));

  // Yatay süreç arka planı
  $(".hs-far").style.backgroundImage = svgURL(citySVG({ seed: 31, color: "#ffffff", minH: 0.25, maxH: 0.9 }));
  $(".hs-mid").style.backgroundImage = svgURL(treesSVG({ seed: 44, color: "#0d1a2c", w: 1200, h: 160, lamps: true }));

  // Gece şehri (pencereler yanar)
  $(".night-city.back").innerHTML = citySVG({ seed: 22, color: "#18275a", minH: 0.35, maxH: 0.95 });
  $(".night-city.front").innerHTML = citySVG({ seed: 21, color: "#070f26", win: "#ffd27a", minH: 0.3, maxH: 0.95, h: 220 });

  // Yıldızlar
  const sr = rng(77);
  const stars = [];
  for (let i = 0; i < 140; i++) {
    const a = (0.35 + sr() * 0.65).toFixed(2);
    stars.push(`${(sr() * 100).toFixed(2)}vw ${(sr() * 70).toFixed(2)}vh 0 ${sr() < 0.15 ? 1 : 0}px rgba(255,255,255,${a})`);
  }
  $(".stars").style.boxShadow = stars.join(",");
}

/* ---------- İşletme bilgilerini bağla ---------- */
function bindConfig() {
  $$("[data-firma]").forEach((el) => (el.textContent = CONFIG.firmaAdi));
  $$("[data-tel]").forEach((el) => (el.href = `tel:+${CONFIG.telefon}`));
  $$("[data-tel-text]").forEach((el) => (el.textContent = CONFIG.telefonGorunen));
  $$("[data-wa]").forEach((el) => {
    el.href = waLink(CONFIG.whatsappMesaj);
    el.target = "_blank";
    el.rel = "noopener";
  });
  $$("[data-google]").forEach((el) => (el.href = CONFIG.googleLink));
  $$("[data-adres]").forEach((el) => (el.textContent = CONFIG.adres));
  $$("[data-puan]").forEach((el) => (el.textContent = CONFIG.googlePuan));
  $$("[data-yorum]").forEach((el) => (el.textContent = CONFIG.googleYorumSayisi));
  $$("[data-truck]").forEach((el) => (el.innerHTML = truckSVG(CONFIG.firmaAdi)));
  $("#yil").textContent = new Date().getFullYear();
}

/* ---------- Gökyüzü: gündüz → gün batımı → gece ---------- */
const SKY = [
  [0, "#2c6fc4", "#bfe0fb"],
  [0.3, "#3471bd", "#f3dcb4"],
  [0.5, "#3d4b97", "#f4a36f"],
  [0.68, "#232a63", "#8a4f7d"],
  [0.82, "#0a1230", "#1d2a5a"],
  [1, "#050a1e", "#14214a"],
];
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`;
};
function paintSky(p) {
  let i = 0;
  while (i < SKY.length - 2 && p > SKY[i + 1][0]) i++;
  const [p0, t0, b0] = SKY[i], [p1, t1, b1] = SKY[i + 1];
  const t = clamp((p - p0) / (p1 - p0), 0, 1);
  sky.style.background = `linear-gradient(180deg, ${mix(t0, t1, t)}, ${mix(b0, b1, t)})`;
  sky.style.setProperty("--sun-y", `${(12 + p * 110).toFixed(1)}%`);
  sky.style.setProperty("--sun-o", clamp(1.3 - p * 1.9, 0, 1).toFixed(2));
  sky.style.setProperty("--moon-o", clamp((p - 0.66) * 5, 0, 1).toFixed(2));
  sky.style.setProperty("--moon-y", `${(34 - clamp((p - 0.66) * 70, 0, 22)).toFixed(1)}%`);
  sky.style.setProperty("--stars", clamp((p - 0.62) * 4, 0, 1).toFixed(2));
}

/* ---------- Parallax motoru ---------- */
const sky = $(".sky");
const header = $(".header");
const bar = $(".topbar span");
const hero = $(".hero");
const heroCopy = $(".hero-copy");
const heroLayers = $$(".hero .layer");
const heroTruck = $(".hero-truck");
const heroCopy2 = $(".hero-copy2");
const scrollCue = $(".scroll-cue");
const hs = $(".hs");
const hsTrack = $(".hs-track");
const hsPanels = $$(".hs-panel");
const hsFar = $(".hs-far");
const hsMid = $(".hs-mid");
const hsDash = $(".hs-dash");
const hsBar = $(".hs-progress span");
const bandLines = $$(".band-line");
const band = $(".band");
const navLinks = $$(".nav a");
const sections = $$("main section[id]");
let speedEls = [];

const state = { y: window.scrollY, mx: 0, my: 0, tmx: 0, tmy: 0, dirty: true, hsDist: 0, docMax: 1, narrow: false, panelCenters: [] };

function measure() {
  state.narrow = window.innerWidth < 1000;
  speedEls = $$("[data-speed]")
    .filter((el) => !(state.narrow && el.hasAttribute("data-dsk")))
    .map((el) => ({ el, parent: el.closest("section"), s: parseFloat(el.dataset.speed) }));
  $$("[data-dsk]").forEach((el) => state.narrow && (el.style.translate = ""));

  if (!reduceMotion) {
    hsTrack.style.transform = "none";
    const dist = Math.max(0, hsTrack.scrollWidth - window.innerWidth);
    state.hsDist = dist;
    hs.style.height = `${dist + window.innerHeight}px`;
    state.panelCenters = hsPanels.map((p) => p.offsetLeft + p.offsetWidth / 2);
  }
  state.docMax = Math.max(1, root.scrollHeight - window.innerHeight);
  state.dirty = true;
}

function render() {
  const { y } = state;
  const vh = window.innerHeight, vw = window.innerWidth;
  const p = clamp(y / state.docMax, 0, 1);

  bar.style.transform = `scaleX(${p})`;
  header.classList.toggle("scrolled", y > 30);
  root.style.setProperty("--wheel", `${(y * 0.9).toFixed(1)}deg`);
  paintSky(p);
  if (reduceMotion) return;

  // Hero: sahne sabit kalır, kaydırdıkça "içeri doğru" ilerlenir.
  // Yakın katmanlar büyüyüp hızla aşağı akar, uzaktakiler neredeyse yerinde kalır.
  const heroRange = Math.max(1, hero.offsetHeight - vh);
  if (y < hero.offsetHeight + 100) {
    const hp = clamp(y / heroRange, 0, 1);
    heroLayers.forEach((l) => {
      const z = parseFloat(l.dataset.z);
      const tx = -state.mx * z * 30;
      const ty = -state.my * z * 10;
      l.style.translate = `${tx.toFixed(1)}px ${(hp * z * vh * 0.6 + ty).toFixed(1)}px`;
      l.style.scale = (1 + hp * z * 0.45).toFixed(4);
    });
    heroCopy.style.translate = `${(state.mx * 10).toFixed(1)}px ${(-hp * vh * 0.45).toFixed(1)}px`;
    heroCopy.style.opacity = clamp(1 - hp * 2.6, 0, 1).toFixed(3);
    heroCopy.style.visibility = hp > 0.4 ? "hidden" : "";
    const c2 = clamp((hp - 0.38) * 3.2, 0, 1);
    heroCopy2.style.opacity = c2.toFixed(3);
    heroCopy2.style.translate = `0 ${((1 - c2) * 60).toFixed(1)}px`;
    scrollCue.style.opacity = clamp(1 - hp * 8, 0, 1).toFixed(3);
    heroTruck.style.translate = `${(hp * vw * 1.05).toFixed(1)}px 0`;
  }

  // Yatay süreç: dikey scroll → yatay hareket, arka plan katmanları daha yavaş
  const hr = hs.getBoundingClientRect();
  if (hr.bottom > 0 && hr.top < vh && state.hsDist > 0) {
    const hp = clamp(-hr.top / state.hsDist, 0, 1);
    const x = hp * state.hsDist;
    hsTrack.style.transform = `translate3d(${(-x).toFixed(1)}px,0,0)`;
    hsFar.style.backgroundPositionX = `${(-x * 0.18).toFixed(1)}px`;
    hsMid.style.backgroundPositionX = `${(-x * 0.55).toFixed(1)}px`;
    hsDash.style.backgroundPositionX = `${(-x * 1.25).toFixed(1)}px`;
    hsBar.style.transform = `scaleX(${hp.toFixed(4)})`;
    state.panelCenters.forEach((c, i) => {
      const d = Math.min(1, Math.abs(c - x - vw / 2) / (vw * 0.6));
      const panel = hsPanels[i];
      if (panel.classList.contains("step")) {
        panel.style.transform = `scale(${(1 - d * 0.1).toFixed(3)}) rotate(${((c - x - vw / 2) / vw * -3).toFixed(2)}deg)`;
        panel.style.opacity = (1 - d * 0.55).toFixed(3);
      }
    });
  }

  // Büyük yazı bandı: satırlar zıt yönlere kayar
  const br = band.getBoundingClientRect();
  if (br.bottom > 0 && br.top < vh) {
    const t = (br.top + br.height / 2 - vh / 2) / vh;
    bandLines.forEach((l) => (l.style.translate = `${(t * parseFloat(l.dataset.dir) * 22).toFixed(2)}vw 0`));
  }

  // Genel parallax öğeleri (kutular, kartlar, gece şehri)
  speedEls.forEach(({ el, parent, s }) => {
    const r = parent.getBoundingClientRect();
    if (r.bottom < -300 || r.top > vh + 300) return;
    const off = r.top + r.height / 2 - vh / 2;
    el.style.translate = `0 ${(off * s).toFixed(1)}px`;
  });

  // Menüde aktif bölüm
  let current = "";
  sections.forEach((s) => s.getBoundingClientRect().top <= vh * 0.4 && (current = s.id));
  navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
}

function loop() {
  const dx = state.tmx - state.mx, dy = state.tmy - state.my;
  if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
    state.mx += dx * 0.06;
    state.my += dy * 0.06;
    state.dirty = true;
  }
  if (state.dirty) {
    state.dirty = false;
    render();
  }
  requestAnimationFrame(loop);
}

/* ---------- Görünür olunca beliren öğeler ---------- */
function initReveal() {
  const items = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) return items.forEach((el) => el.classList.add("in"));
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );
  items.forEach((el) => io.observe(el));
}

/* ---------- Teklif formu → WhatsApp ---------- */
function initQuoteForm() {
  const form = $("#teklifForm");
  const error = form.querySelector(".form-error");
  const required = ["ad", "nereden", "nereye"].map((id) => form.elements[id]);
  required.forEach((i) => i.addEventListener("input", () => i.classList.remove("invalid")));
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
    ];
    if (f.not.value.trim()) lines.push(`*Not:* ${f.not.value.trim()}`);
    window.open(waLink(lines.join("\n")), "_blank", "noopener");
  });
}

/* ---------- Başlat ---------- */
bindConfig();
buildScenes();
initReveal();
initQuoteForm();
measure();
loop();

window.addEventListener("scroll", () => { state.y = window.scrollY; state.dirty = true; }, { passive: true });
window.addEventListener("resize", measure);
window.addEventListener("load", measure);
if (finePointer && !reduceMotion) {
  window.addEventListener("pointermove", (e) => {
    state.tmx = (e.clientX / window.innerWidth - 0.5) * 2;
    state.tmy = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
}
