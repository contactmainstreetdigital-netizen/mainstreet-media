/* Bella Pizza: concept demo by Main Street Digital (fictional restaurant).
   Real-time 3D pizza (Three.js), smooth scroll (Lenis) synced with GSAP ScrollTrigger. No photos. */
(() => {
  "use strict";
  const doc = document.documentElement;
  doc.classList.add("js");

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;
  const lowEnd =
    (navigator.hardwareConcurrency || 8) <= 4 ||
    (navigator.deviceMemory || 8) <= 3 ||
    Math.min(screen.width, screen.height) * (devicePixelRatio || 1) < 700;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const lerp = (a, b, t) => a + (b - a) * t;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  };

  /* ------------------------------------------------------------------ i18n */
  const T = {
    fr: {
      "nav.story": "Histoire", "nav.dough": "La pâte", "nav.menu": "Menu", "nav.visit": "Infos", "nav.book": "Réserver",
      "hero.sr": "Animation : une boule de pâte s'étire, reçoit la sauce tomate, la mozzarella, le basilic et l'huile d'olive, puis cuit dans le four à bois.",
      "hero.eyebrow": "Pizzeria napolitaine · Pâquis, Genève",
      "hero.sub": "Une pâte qui repose <strong>48 heures</strong>, un four à bois à <strong>450 °C</strong>, et une pizza prête en <strong>90 secondes</strong>.",
      "hero.hint": "Faites défiler pour la préparer",
      "ph1.k": "01 · L'impasto", "ph1.d": "On étire le pâton à la main, du centre vers le bord, sans rouleau, pour garder l'air dans la corniche.",
      "ph2.k": "02 · La sauce", "ph2.d": "Tomates San Marzano écrasées à la main, une pincée de sel. Rien d'autre.",
      "ph3.k": "03 · Le fromage", "ph3.d": "Mozzarella de lait de vache, déchirée au dernier moment pour qu'elle fonde sans rendre d'eau.",
      "ph4.k": "04 · La finition", "ph4.d": "Basilic frais et un filet d'huile d'olive extra vierge, avant d'entrer dans le four.",
      "ph5.k": "05 · La cuisson", "ph5.d": "Bois de hêtre, sole à 450 °C. La corniche gonfle et se tigre de noir.", "ph5.f": "90 secondes · un quart de tour toutes les 20",
      "hero.final": "La Napoli<br>des Pâquis.", "cta.menu": "Voir le menu", "cta.book": "Réserver une table",
      "story.k": "La famille Esposito",
      "story.t": "Nonna Lucia a quitté Naples avec une valise et un levain. Aux Pâquis, ses petits-enfants allument le même four chaque soir, à deux pas du lac. Une table pour les amis, une pizza pour chacun, et le temps de bien faire.",
      "story.f1": "de maturation pour chaque pâton", "story.f2": "dans le four à bois, allumé à 16 h", "story.f3": "entre la pelle et votre assiette",
      "dough.k": "La pâte", "dough.h": "Quarante-huit heures de patience.", "dough.unit": "heures",
      "s1.t": "Farine tipo 00, eau, sel, un peu de levure", "s1.d": "Hydratation à 68 %, pétrie lentement.",
      "s2.t": "Première pousse à température ambiante", "s2.d": "La pâte se détend et commence à faire des bulles.",
      "s3.t": "Maturation au froid, à 4 °C", "s3.d": "Les arômes se développent, la pâte devient digeste.",
      "s4.t": "Pâtons prêts, légers comme un nuage", "s4.d": "Façonnés à la main, 250 g chacun.",
      "dough.temp": "Température", "dough.hyd": "Hydratation", "dough.w": "Par pâton",
      "menu.k": "La carte", "menu.h": "Il menu", "menu.note": "Toutes nos pizzas existent aussi sans gluten, avec une pâte préparée séparément. Demandez-nous.",
      "book.k": "Réservation", "book.h": "À table.", "book.p": "Choisissez un jour, une heure et le nombre de convives. On garde la meilleure table près du four.",
      "book.demo": "Démo : aucune réservation n'est envoyée", "book.demoLong": "Formulaire de démonstration. Aucune donnée n'est envoyée ni enregistrée.",
      "book.s1": "Jour", "book.s2": "Heure", "book.s3": "Convives", "book.s4": "Confirmé",
      "book.q1": "Quel jour ?", "book.q2": "À quelle heure ?", "book.q3": "Combien de personnes ?",
      "book.next": "Continuer", "book.back": "← Retour", "book.name": "Nom pour la réservation", "book.confirm": "Confirmer la table",
      "book.done": "Démo : rien n'a été envoyé. Sur un vrai site, la réservation arriverait ici, avec une confirmation par e-mail.",
      "book.again": "Recommencer", "book.lunch": "Midi", "book.dinner": "Soir", "book.nameErr": "Indiquez un nom (2 lettres au moins).",
      "t.table": "Table pour", "t.day": "Jour", "t.time": "Heure", "t.name": "Au nom de", "t.no": "Comanda n°", "t.guests": (n) => `${n} ${n > 1 ? "personnes" : "personne"}`,
      "visit.k": "Nous trouver", "visit.h": "Au coin du lac.", "visit.copy": "Copier", "visit.copied": "Copié", "visit.map": "Ouvrir la carte", "visit.closed": "Fermé",
      "foot.demo": "Concept démo par", "foot.fict": "– restaurant fictif", "foot.made": "Pizza modélisée en 3D en temps réel. Aucune photo.",
      tabs: { rosse: "Pizze rosse", bianche: "Pizze bianche", antipasti: "Antipasti", dolci: "Dolci", bevande: "Bevande" },
      days: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
      locale: "fr-CH",
    },
    en: {
      "nav.story": "Story", "nav.dough": "The dough", "nav.menu": "Menu", "nav.visit": "Visit", "nav.book": "Book",
      "hero.sr": "Animation: a dough ball stretches, then gets tomato sauce, mozzarella, basil and olive oil, and bakes in the wood-fired oven.",
      "hero.eyebrow": "Neapolitan pizzeria · Pâquis, Geneva",
      "hero.sub": "Dough rested for <strong>48 hours</strong>, a wood-fired oven at <strong>450 °C</strong>, and a pizza ready in <strong>90 seconds</strong>.",
      "hero.hint": "Scroll to make one",
      "ph1.k": "01 · The impasto", "ph1.d": "Stretched by hand from the centre out, never with a rolling pin, so the crust keeps its air.",
      "ph2.k": "02 · The sauce", "ph2.d": "San Marzano tomatoes crushed by hand, a pinch of salt. Nothing else.",
      "ph3.k": "03 · The cheese", "ph3.d": "Cow's-milk mozzarella, torn at the last moment so it melts without turning watery.",
      "ph4.k": "04 · The finish", "ph4.d": "Fresh basil and a thread of extra-virgin olive oil, just before the oven.",
      "ph5.k": "05 · The bake", "ph5.d": "Beech wood, a 450 °C floor. The crust puffs up and turns leopard-spotted.", "ph5.f": "90 seconds · a quarter turn every 20",
      "hero.final": "Naples,<br>by the lake.", "cta.menu": "See the menu", "cta.book": "Book a table",
      "story.k": "The Esposito family",
      "story.t": "Nonna Lucia left Naples with one suitcase and a sourdough starter. In the Pâquis, her grandchildren light the same oven every evening, a short walk from the lake. A table for friends, a pizza each, and time to do it right.",
      "story.f1": "of rising for every dough ball", "story.f2": "in the wood-fired oven, lit at 4 pm", "story.f3": "from the peel to your plate",
      "dough.k": "The dough", "dough.h": "Forty-eight hours of patience.", "dough.unit": "hours",
      "s1.t": "Tipo 00 flour, water, salt, a little yeast", "s1.d": "68% hydration, kneaded slowly.",
      "s2.t": "First rise at room temperature", "s2.d": "The dough relaxes and starts to bubble.",
      "s3.t": "Cold maturation at 4 °C", "s3.d": "Flavour develops and the dough becomes easy to digest.",
      "s4.t": "Dough balls ready, light as a cloud", "s4.d": "Shaped by hand, 250 g each.",
      "dough.temp": "Temperature", "dough.hyd": "Hydration", "dough.w": "Per ball",
      "menu.k": "The menu", "menu.h": "Il menu", "menu.note": "Every pizza is also available gluten-free, made with a separately prepared dough. Just ask.",
      "book.k": "Reservations", "book.h": "A tavola.", "book.p": "Pick a day, a time and how many of you are coming. We'll keep the best table near the oven.",
      "book.demo": "Demo: no booking is sent", "book.demoLong": "Demo form. No data is sent or stored.",
      "book.s1": "Day", "book.s2": "Time", "book.s3": "Guests", "book.s4": "Confirmed",
      "book.q1": "Which day?", "book.q2": "What time?", "book.q3": "How many people?",
      "book.next": "Continue", "book.back": "← Back", "book.name": "Name for the booking", "book.confirm": "Confirm the table",
      "book.done": "Demo: nothing was sent. On a real site the booking would arrive here, with a confirmation by email.",
      "book.again": "Start again", "book.lunch": "Lunch", "book.dinner": "Dinner", "book.nameErr": "Enter a name (at least 2 letters).",
      "t.table": "Table for", "t.day": "Day", "t.time": "Time", "t.name": "Name", "t.no": "Comanda no.", "t.guests": (n) => `${n} ${n > 1 ? "people" : "person"}`,
      "visit.k": "Find us", "visit.h": "By the lake.", "visit.copy": "Copy", "visit.copied": "Copied", "visit.map": "Open the map", "visit.closed": "Closed",
      "foot.demo": "Concept demo by", "foot.fict": "– fictional restaurant", "foot.made": "Pizza modelled in real-time 3D. No photos.",
      tabs: { rosse: "Pizze rosse", bianche: "Pizze bianche", antipasti: "Antipasti", dolci: "Dolci", bevande: "Bevande" },
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      locale: "en-GB",
    },
  };

  const MENU = {
    rosse: [
      { id: "margherita", name: "Margherita", price: 19, art: "margherita", fr: "San Marzano, fior di latte, basilic, huile d'olive.", en: "San Marzano, fior di latte, basil, olive oil.", tag: { fr: "La nôtre depuis toujours", en: "Our house classic" } },
      { id: "marinara", name: "Marinara", price: 16, art: "marinara", fr: "San Marzano, ail, origan de Sicile, huile d'olive. Sans fromage.", en: "San Marzano, garlic, Sicilian oregano, olive oil. No cheese.", tag: { fr: "Végane", en: "Vegan" } },
      { id: "diavola", name: "Diavola", price: 23, art: "diavola", fr: "San Marzano, fior di latte, salame piquant de Calabre, piment.", en: "San Marzano, fior di latte, spicy Calabrian salami, chilli." },
      { id: "capricciosa", name: "Capricciosa", price: 25, art: "capricciosa", fr: "San Marzano, fior di latte, jambon cuit, champignons, artichauts, olives.", en: "San Marzano, fior di latte, cooked ham, mushrooms, artichokes, olives." },
    ],
    bianche: [
      { id: "quattro", name: "Quattro formaggi", price: 24, art: "quattro", fr: "Fior di latte, gorgonzola, provola fumée, parmigiano 24 mois.", en: "Fior di latte, gorgonzola, smoked provola, 24-month parmigiano." },
      { id: "mortadella", name: "Mortadella e pistacchio", price: 27, art: "mortadella", fr: "Fior di latte, mortadelle de Bologne, burrata, pistaches de Bronte.", en: "Fior di latte, Bologna mortadella, burrata, Bronte pistachios.", tag: { fr: "La plus demandée", en: "Most ordered" } },
      { id: "salsiccia", name: "Salsiccia e friarielli", price: 25, art: "salsiccia", fr: "Provola fumée, saucisse au fenouil, friarielli sautés à l'ail.", en: "Smoked provola, fennel sausage, friarielli sautéed with garlic." },
    ],
    antipasti: [
      { id: "burrata", name: "Burrata", price: 18, art: "burrata", fr: "Burrata des Pouilles, tomates cerises rôties, basilic.", en: "Burrata from Puglia, roasted cherry tomatoes, basil.", tag: { fr: "À partager", en: "To share" } },
      { id: "arancini", name: "Arancini", price: 13, art: "arancini", fr: "Trois boules de riz safrané, cœur de ragù et mozzarella.", en: "Three saffron rice balls filled with ragù and mozzarella." },
      { id: "montanara", name: "Montanara", price: 9, art: "montanara", fr: "Pâte frite, sauce tomate, parmigiano, basilic.", en: "Fried dough, tomato sauce, parmigiano, basil." },
    ],
    dolci: [
      { id: "tiramisu", name: "Tiramisù della casa", price: 11, art: "tiramisu", fr: "Mascarpone, savoiardi, espresso, cacao.", en: "Mascarpone, savoiardi, espresso, cocoa." },
      { id: "cannolo", name: "Cannolo siciliano", price: 9, art: "cannolo", fr: "Ricotta de brebis, pistache, écorces d'orange confites.", en: "Sheep's ricotta, pistachio, candied orange peel." },
    ],
    bevande: [
      { id: "chinotto", name: "Chinotto", price: 5.5, art: "chinotto", fr: "Soda italien aux agrumes amers, 27,5 cl.", en: "Italian bitter-citrus soda, 27.5 cl." },
      { id: "limonata", name: "Limonata", price: 6.5, art: "limonata", fr: "Citrons de Sorrente pressés, menthe, 30 cl.", en: "Pressed Sorrento lemons, mint, 30 cl." },
      { id: "aglianico", name: "Aglianico del Taburno", price: 9, art: "vino", fr: "Vin rouge de Campanie, le verre de 1 dl.", en: "Red wine from Campania, by the 1 dl glass." },
      { id: "espresso", name: "Espresso", price: 4.2, art: "espresso", fr: "Torréfaction napolitaine, serré.", en: "Neapolitan roast, short." },
    ],
  };

  let lang = store.get("bp-lang") === "en" ? "en" : "fr"; // French by default
  const t = (k) => T[lang][k];

  function applyLang() {
    doc.lang = lang;
    $$("[data-i18n]").forEach((el) => {
      const v = T[lang][el.dataset.i18n];
      if (typeof v === "string") el.textContent = v;
    });
    $$("[data-i18n-html]").forEach((el) => {
      const v = T[lang][el.dataset.i18nHtml];
      if (typeof v === "string") el.innerHTML = v; // trusted, static dictionary only
    });
    $("#langFr").setAttribute("aria-pressed", String(lang === "fr"));
    $("#langEn").setAttribute("aria-pressed", String(lang === "en"));
    splitStory();
    renderTabs();
    renderDishes(false);
    renderHours();
    renderDays();
    renderTimes();
    if (booking.step === 4) fillTicket();
  }

  /* ---------------------------------------------------------- smooth scroll */
  let lenis = null;
  gsap.registerPlugin(ScrollTrigger);
  if (!reduceMotion && typeof Lenis === "function") {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
  }
  gsap.ticker.lagSmoothing(0);

  function scrollToTarget(hash) {
    const el = hash === "#top" ? 0 : $(hash);
    if (el === null) return;
    if (lenis) lenis.scrollTo(el, { offset: el === 0 ? 0 : -64, duration: 1.6 });
    else if (el === 0) window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    else el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }
  $$("[data-scroll]").forEach((a) =>
    a.addEventListener("click", (e) => {
      const h = a.getAttribute("href");
      if (!h || !h.startsWith("#")) return;
      e.preventDefault();
      scrollToTarget(h);
    }),
  );

  /* ----------------------------------------------------------------- loader */
  const loader = $("#loader");
  const loaderBar = $("#loaderBar");
  const t0 = performance.now();
  let loadState = 0;
  const setLoad = (v) => {
    loadState = Math.max(loadState, v);
    loaderBar.style.setProperty("--p", loadState);
  };
  function finishLoader() {
    const wait = Math.max(0, 700 - (performance.now() - t0));
    setTimeout(() => {
      setLoad(1);
      loader.classList.add("is-done");
      $$("#heroTitle .split").forEach((s, i) => setTimeout(() => s.classList.add("is-in"), 250 + i * 120));
      setTimeout(() => loader.remove(), 1100);
    }, wait);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => setLoad(0.45));

  /* ================================================================ 3D STAGE */
  const R = 1.3;          // pizza radius
  const RIN = R * 0.8;    // start of the cornicione
  const H_TOP = 0.07;     // top surface height
  const stage = { ok: false, p: 0, target: 0, visible: true };

  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let r = Math.imul(a ^ (a >>> 15), 1 | a);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function canvasTex(size, draw, { repeat = null, srgb = true } = {}) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const g = c.getContext("2d");
    draw(g, size);
    const tex = new THREE.CanvasTexture(c);
    if (srgb) tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;
    if (repeat) {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeat, repeat);
    }
    return tex;
  }

  function speckle(g, S, rand, n, colors, rMin, rMax, area = 1) {
    for (let i = 0; i < n; i++) {
      const a = rand() * Math.PI * 2;
      const rr = Math.sqrt(rand()) * (S / 2) * area;
      const x = S / 2 + Math.cos(a) * rr, y = S / 2 + Math.sin(a) * rr;
      g.fillStyle = colors[(rand() * colors.length) | 0];
      g.beginPath();
      g.arc(x, y, rMin + rand() * (rMax - rMin), 0, Math.PI * 2);
      g.fill();
    }
  }

  function makeTextures(S) {
    const rand = rng(7);
    const doughRaw = canvasTex(S, (g) => {
      g.fillStyle = "#e6cfa6"; g.fillRect(0, 0, S, S);
      const grd = g.createRadialGradient(S / 2, S / 2, S * 0.1, S / 2, S / 2, S / 2);
      grd.addColorStop(0, "rgba(255,246,228,.35)"); grd.addColorStop(0.8, "rgba(255,246,228,0)"); grd.addColorStop(1, "rgba(200,170,120,.35)");
      g.fillStyle = grd; g.fillRect(0, 0, S, S);
      g.globalAlpha = 0.35; speckle(g, S, rand, S * 3, ["#fffaf0", "#f6e9cf"], S * 0.0015, S * 0.004);
      g.globalAlpha = 0.18; speckle(g, S, rand, S, ["#c9a67a", "#d7b98d"], S * 0.002, S * 0.007);
      g.globalAlpha = 1;
    });
    const doughBaked = canvasTex(S, (g) => {
      const grd = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
      grd.addColorStop(0, "#d9ab69"); grd.addColorStop(0.7, "#d39a52"); grd.addColorStop(0.86, "#e2ad5f"); grd.addColorStop(0.95, "#c0803a"); grd.addColorStop(1, "#8f5626");
      g.fillStyle = grd; g.fillRect(0, 0, S, S);
      g.globalAlpha = 0.25; speckle(g, S, rand, S * 2, ["#f2cc8c", "#b97a3a"], S * 0.002, S * 0.006);
      // leopard spots on the cornicione
      for (let i = 0; i < 230; i++) {
        const a = rand() * Math.PI * 2;
        const rr = (0.8 + rand() * 0.2) * (S / 2);
        const x = S / 2 + Math.cos(a) * rr, y = S / 2 + Math.sin(a) * rr;
        const rad = S * (0.004 + rand() * 0.014);
        const sp = g.createRadialGradient(x, y, 0, x, y, rad);
        sp.addColorStop(0, "rgba(30,14,6,.95)"); sp.addColorStop(0.55, "rgba(52,24,10,.75)"); sp.addColorStop(1, "rgba(120,64,24,0)");
        g.globalAlpha = 1; g.fillStyle = sp; g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill();
      }
      g.globalAlpha = 1;
    });
    const sauce = (baked) =>
      canvasTex(S, (g) => {
        g.save();
        g.beginPath();
        for (let i = 0; i <= 240; i++) {
          const a = (i / 240) * Math.PI * 2;
          const r = (S / 2) * (0.93 + 0.025 * Math.sin(a * 7 + 1) + 0.015 * Math.sin(a * 19 + 2) + 0.01 * Math.sin(a * 31));
          const x = S / 2 + Math.cos(a) * r, y = S / 2 + Math.sin(a) * r;
          i ? g.lineTo(x, y) : g.moveTo(x, y);
        }
        g.closePath(); g.clip();
        g.fillStyle = baked ? "#9a210e" : "#a9230f"; g.fillRect(0, 0, S, S);
        g.globalAlpha = 0.28; speckle(g, S, rng(baked ? 21 : 11), 520, baked ? ["#7d190b", "#c2401f", "#5e1407"] : ["#d6432a", "#97200f", "#e0553a"], S * 0.008, S * 0.03, 0.95);
        g.globalAlpha = 0.5; speckle(g, S, rng(5), 260, baked ? ["#4d1206"] : ["#8b1b0c"], S * 0.002, S * 0.006, 0.95);
        if (baked) { g.globalAlpha = 0.6; speckle(g, S, rng(99), 70, ["#3a0e05", "#5a1708"], S * 0.004, S * 0.012, 0.95); }
        g.restore();
      });
    const wood = canvasTex(S / 2, (g, s) => {
      g.fillStyle = "#6e4326"; g.fillRect(0, 0, s, s);
      const r2 = rng(3);
      for (let i = 0; i < 160; i++) {
        g.strokeStyle = r2() > 0.5 ? "rgba(30,15,6,.22)" : "rgba(150,96,52,.18)";
        g.lineWidth = 0.6 + r2() * 1.6;
        const y = r2() * s;
        g.beginPath(); g.moveTo(0, y);
        for (let x = 0; x <= s; x += s / 8) g.lineTo(x, y + Math.sin(x * 0.02 + i) * 6 * r2());
        g.stroke();
      }
    });
    const counter = canvasTex(S / 2, (g, s) => {
      g.fillStyle = "#1a1310"; g.fillRect(0, 0, s, s);
      g.globalAlpha = 0.5; speckle(g, s, rng(4), s * 6, ["#241b16", "#120d0b", "#2c211b"], 0.6, 2.2, 1.45);
      g.globalAlpha = 1;
    }, { repeat: 5 });
    const dust = canvasTex(S / 2, (g, s) => {
      const r4 = rng(8);
      for (let i = 0; i < s * 9; i++) {
        const a = r4() * Math.PI * 2, d = Math.pow(r4(), 0.7) * s * 0.5;
        g.globalAlpha = 0.5 * (1 - d / (s * 0.5));
        g.fillStyle = r4() > 0.5 ? "#f4ecdc" : "#d8ccb4";
        g.fillRect(s / 2 + Math.cos(a) * d, s / 2 + Math.sin(a) * d, 1.2, 1.2);
      }
      g.globalAlpha = 1;
    }, { srgb: true });
    const brick = canvasTex(S / 2, (g, s) => {
      g.fillStyle = "#1f120d"; g.fillRect(0, 0, s, s);
      const rows = 8, bw = s / 4, bh = s / rows, r3 = rng(12);
      for (let y = 0; y < rows; y++) for (let x = -1; x < 5; x++) {
        const ox = (y % 2) * bw * 0.5;
        const c = 52 + r3() * 30;
        g.fillStyle = `rgb(${c + 34},${c * 0.62},${c * 0.48})`;
        g.fillRect(x * bw + ox + 2, y * bh + 2, bw - 4, bh - 4);
      }
      g.globalAlpha = 0.25; speckle(g, s, r3, s * 4, ["#1c0d08", "#6b3a26"], 0.5, 1.6, 1.5); g.globalAlpha = 1;
    }, { repeat: 1 });
    const soft = canvasTex(64, (g, s) => {
      const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(0.4, "rgba(255,255,255,.5)"); r.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = r; g.fillRect(0, 0, s, s);
    }, { srgb: false });
    const shadow = canvasTex(128, (g, s) => {
      const r = g.createRadialGradient(s / 2, s / 2, s * 0.2, s / 2, s / 2, s / 2);
      r.addColorStop(0, "rgba(0,0,0,.75)"); r.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = r; g.fillRect(0, 0, s, s);
    }, { srgb: false });
    const cheese = canvasTex(256, (g, s) => {
      g.fillStyle = "#f7f0e2"; g.fillRect(0, 0, s, s);
      g.globalAlpha = 0.25; speckle(g, s, rng(31), 300, ["#efe2c6", "#fffaf2"], 2, 10, 1.4); g.globalAlpha = 1;
    });
    const cheeseBaked = canvasTex(256, (g, s) => {
      g.fillStyle = "#f0d9a6"; g.fillRect(0, 0, s, s);
      g.globalAlpha = 0.55; speckle(g, s, rng(32), 260, ["#e2b465", "#fff0d0", "#d9a352"], 4, 16, 1.4);
      g.globalAlpha = 0.7;
      for (let i = 0; i < 26; i++) { const r5 = rng(60 + i); const x = r5() * s, y = r5() * s * 0.45; const rr = 3 + r5() * 9; const gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, "rgba(120,62,20,.9)"); gr.addColorStop(1, "rgba(170,100,40,0)"); g.fillStyle = gr; g.beginPath(); g.arc(x, y, rr, 0, 6.29); g.fill(); }
      g.globalAlpha = 1;
    });
    return { doughRaw, doughBaked, sauce: sauce(false), sauceBaked: sauce(true), wood, counter, dust, brick, soft, shadow, cheese, cheeseBaked };
  }

  /* A MeshStandardMaterial whose map can cross-fade to a "baked" version, plus an optional spiral reveal. */
  function bakeable(mat, bakedMap, spiral = false) {
    const u = { uBake: { value: 0 }, uBakedMap: { value: bakedMap }, uReveal: { value: spiral ? 0 : 1 } };
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, u);
      shader.fragmentShader = shader.fragmentShader
        .replace("void main() {", "uniform float uBake;\nuniform float uReveal;\nuniform sampler2D uBakedMap;\nvoid main() {")
        .replace(
          "#include <map_fragment>",
          `#include <map_fragment>
           vec4 bakedTex = texture2D(uBakedMap, vUv);
           diffuseColor.rgb = mix(diffuseColor.rgb, bakedTex.rgb * diffuse, uBake);
           ${spiral ? `
           vec2 sp = vUv - 0.5;
           float sr = length(sp) * 2.0;
           float sa = atan(sp.y, sp.x) / 6.2831853 + 0.5;
           float turns = 5.0;
           float k = floor(sr * turns - sa + 0.5);
           float P = (k + sa) / turns;
           float edge = uReveal * 1.08;
           float rv = 1.0 - smoothstep(edge - 0.025, edge, P);
           if (uReveal >= 0.999) rv = 1.0;
           diffuseColor.a *= rv;
           if (diffuseColor.a < 0.02) discard;` : ""}`,
        );
    };
    mat.userData.u = u;
    return mat;
  }

  function doughGeometry() {
    const NT = lowEnd ? 72 : 112, NS = lowEnd ? 40 : 60;
    const Rb = 0.56;
    const prof = (s, bump) => {
      if (s <= 0.42) return [(s / 0.42) * RIN, H_TOP];
      if (s <= 0.66) { const a = ((s - 0.42) / 0.24) * Math.PI; return [RIN + ((R - RIN) * (1 - Math.cos(a))) / 2 + Math.sin(a) * 0.035, H_TOP + Math.sin(a) * bump]; }
      if (s <= 0.74) { const a = ((s - 0.66) / 0.08) * (Math.PI / 2); return [R - 0.04 * (1 - Math.cos(a)), H_TOP * (1 - Math.sin(a))]; }
      return [(1 - (s - 0.74) / 0.26) * (R - 0.04), 0];
    };
    const ball = (s) => { const ph = s * Math.PI; return [Rb * Math.sin(ph), Rb + Rb * Math.cos(ph)]; };
    const cnt = (NT + 1) * (NS + 1);
    const pB = new Float32Array(cnt * 3), pP = new Float32Array(cnt * 3), pF = new Float32Array(cnt * 3), uv = new Float32Array(cnt * 2);
    let k = 0;
    for (let j = 0; j <= NS; j++) {
      const s = j / NS;
      const [br, by] = ball(s), [pr, py] = prof(s, 0.12), [fr, fy] = prof(s, 0.175);
      for (let i = 0; i <= NT; i++) {
        const th = (i / NT) * Math.PI * 2, c = Math.cos(th), sn = Math.sin(th);
        const w = 1 + 0.018 * Math.sin(th * 3 + 0.4) + 0.01 * Math.sin(th * 7 + 1.3) + 0.006 * Math.sin(th * 13);
        const bw = 1 + 0.03 * Math.sin(th * 2 + 0.5) * Math.sin(s * Math.PI);
        pB.set([br * c * bw, by, br * sn * bw], k * 3);
        pP.set([pr * c * w, py, pr * sn * w], k * 3);
        pF.set([fr * c * w, fy, fr * sn * w], k * 3);
        uv.set([0.5 + (pr * c * w) / (2 * R * 1.04), 0.5 + (pr * sn * w) / (2 * R * 1.04)], k * 2);
        k++;
      }
    }
    const idx = [];
    for (let j = 0; j < NS; j++) for (let i = 0; i < NT; i++) {
      const a = j * (NT + 1) + i, b = a + NT + 1;
      idx.push(a, a + 1, b, b, a + 1, b + 1);
    }
    const make = (pos) => {
      const g = new THREE.BufferGeometry();
      g.setIndex(idx); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.computeVertexNormals();
      return g;
    };
    const gB = make(pB), gP = make(pP), gF = make(pF);
    // ensure outward normals (top of the flat pizza must face up)
    const ny = gP.getAttribute("normal").getY((NT + 1) * 4);
    if (ny < 0) {
      for (let q = 0; q < idx.length; q += 3) { const tmp = idx[q + 1]; idx[q + 1] = idx[q + 2]; idx[q + 2] = tmp; }
      [gB, gP, gF].forEach((g) => { g.setIndex(idx); g.computeVertexNormals(); });
    }
    const delta = (a, b) => { const out = new Float32Array(a.length); for (let q = 0; q < a.length; q++) out[q] = b[q] - a[q]; return out; };
    const nB = gB.getAttribute("normal").array, nP = gP.getAttribute("normal").array, nF = gF.getAttribute("normal").array;
    const geo = gB;
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    geo.morphAttributes.position = [new THREE.BufferAttribute(delta(pB, pP), 3), new THREE.BufferAttribute(delta(pP, pF), 3)];
    geo.morphAttributes.normal = [new THREE.BufferAttribute(delta(nB, nP), 3), new THREE.BufferAttribute(delta(nP, nF), 3)];
    geo.morphTargetsRelative = true;
    return geo;
  }

  function blobGeometry(seed) {
    const g = new THREE.SphereGeometry(1, lowEnd ? 18 : 30, lowEnd ? 12 : 20);
    const r = rng(seed), p = g.getAttribute("position");
    const f1 = 2 + r() * 2, f2 = 3 + r() * 3, ph = r() * 6;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const d = 1 + 0.13 * Math.sin(x * f1 + ph) * Math.cos(z * f2 + ph) + 0.05 * Math.sin(y * 4 + x * 3);
      p.setXYZ(i, x * d, y * d, z * d);
    }
    g.computeVertexNormals();
    return g;
  }

  function leafGeometry() {
    const s = new THREE.Shape();
    s.moveTo(0, -0.17);
    s.quadraticCurveTo(0.12, -0.06, 0.08, 0.08);
    s.quadraticCurveTo(0.04, 0.16, 0, 0.2);
    s.quadraticCurveTo(-0.04, 0.16, -0.08, 0.08);
    s.quadraticCurveTo(-0.12, -0.06, 0, -0.17);
    const g = new THREE.ShapeGeometry(s, 10);
    const p = g.getAttribute("position");
    const colors = new Float32Array(p.count * 3);
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i);
      p.setZ(i, 0.35 * x * x + 0.05 * y * y);
      const mid = 1 - Math.min(1, Math.abs(x) / 0.1);
      colors.set([0.55 + 0.35 * mid, 0.62 + 0.3 * mid, 0.5 + 0.35 * mid], i * 3);
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.rotateX(-Math.PI / 2);
    g.computeVertexNormals();
    return g;
  }

  function particleMaterial(color, size, kind) {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: kind === "ember" ? THREE.AdditiveBlending : THREE.NormalBlending,
      uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uSize: { value: size }, uPR: { value: 1 }, uColor: { value: new THREE.Color(color) } },
      vertexShader: `
        uniform float uTime; uniform float uSize; uniform float uPR;
        attribute vec4 aSeed; varying float vA;
        void main(){
          vec3 p = position;
          ${kind === "ember"
            ? `float life = fract(uTime * (0.16 + aSeed.w * 0.22) + aSeed.z);
               p.y += life * 3.0;
               p.x += sin(uTime * 1.7 + aSeed.x * 6.283) * 0.22 * life + (aSeed.y - 0.5) * life * 1.4;
               p.z += life * 1.2 * aSeed.y;
               vA = (1.0 - life) * smoothstep(0.0, 0.08, life);`
            : `float tt = uTime * (0.05 + aSeed.w * 0.06) + aSeed.z * 6.283;
               p.x += sin(tt) * 0.35; p.y += sin(tt * 0.7 + aSeed.x * 6.0) * 0.25; p.z += cos(tt * 0.9) * 0.3;
               vA = 0.35 + 0.65 * aSeed.y;`}
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * uPR * (0.45 + aSeed.y) * (5.0 / -mv.z);
        }`,
      fragmentShader: `
        uniform float uOpacity; uniform vec3 uColor; varying float vA;
        void main(){
          vec2 c = gl_PointCoord - 0.5; float d = length(c);
          float a = (1.0 - smoothstep(0.0, 0.5, d)) * vA * uOpacity;
          if (a < 0.003) discard;
          gl_FragColor = vec4(uColor * (1.0 + (1.0 - d * 2.0) * 0.6), a);
        }`,
    });
  }

  function particles(n, box, color, size, kind, seed) {
    const r = rng(seed);
    const pos = new Float32Array(n * 3), sd = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) {
      pos.set([box[0] + r() * (box[1] - box[0]), box[2] + r() * (box[3] - box[2]), box[4] + r() * (box[5] - box[4])], i * 3);
      sd.set([r(), r(), r(), r()], i * 4);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(sd, 4));
    const pts = new THREE.Points(g, particleMaterial(color, size, kind));
    pts.frustumCulled = false;
    return pts;
  }

  function fireMaterial() {
    return new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uI: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `
        uniform float uTime; uniform float uI; varying vec2 vUv;
        float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
          return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
        float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<5;i++){ v+=a*n(p); p*=2.03; a*=0.5; } return v; }
        void main(){
          vec2 uv = vUv;
          vec2 q = vec2(uv.x * 3.2, uv.y * 2.2 - uTime * 1.5);
          float f = fbm(q + fbm(q * 0.7 + uTime * 0.25));
          float side = 1.0 - smoothstep(0.0, 0.55, abs(uv.x - 0.5));
          float v = f * 1.5 * (1.0 - uv.y) - uv.y * 0.35;
          v *= mix(0.55, 1.0, side);
          v = clamp(v, 0.0, 1.0);
          vec3 col = mix(vec3(0.3, 0.02, 0.0), vec3(0.95, 0.28, 0.04), smoothstep(0.08, 0.45, v));
          col = mix(col, vec3(1.0, 0.72, 0.32), smoothstep(0.55, 0.9, v));
          float a = smoothstep(0.04, 0.32, v) * uI;
          gl_FragColor = vec4(col * a, a);
        }`,
    });
  }

  function initStage() {
    const canvas = $("#stage");
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: !lowEnd, powerPreference: "high-performance", alpha: false });
    } catch {
      return false;
    }
    if (!renderer.getContext()) return false;
    let pr = Math.min(devicePixelRatio || 1, lowEnd ? 1.25 : 1.75);
    renderer.setPixelRatio(pr);
    renderer.setClearColor(0x120c0a, 1);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x120c0a, 7, 19);
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60);
    const TX = makeTextures(lowEnd ? 512 : 1024);

    // lights
    scene.add(new THREE.HemisphereLight(0xffe2c0, 0x120a06, 0.2));
    const key = new THREE.SpotLight(0xfff0dc, 3.1, 22, 0.42, 0.85, 1.1);
    key.position.set(-1.6, 7.2, 3.2); scene.add(key); scene.add(key.target);
    const fill = new THREE.DirectionalLight(0xffe6cc, 0.28); fill.position.set(2.5, 3, 6); scene.add(fill);
    const rimL = new THREE.DirectionalLight(0xff9a50, 0.55); rimL.position.set(2.5, 2.2, -5); scene.add(rimL);
    const fire = new THREE.PointLight(0xff6a1e, 0.4, 14, 1.5); fire.position.set(-0.5, 0.9, -8.4); scene.add(fire);
    const warm = new THREE.PointLight(0xffb36b, 0, 6, 2); warm.position.set(0, 1.4, 1.2); scene.add(warm);

    // counter with flour dusting
    const counter = new THREE.Mesh(new THREE.PlaneGeometry(16, 13.4), new THREE.MeshStandardMaterial({ map: TX.counter, roughness: 0.86, metalness: 0 }));
    counter.rotation.x = -Math.PI / 2; counter.position.set(0, -0.052, -0.6); scene.add(counter);
    const dustM = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 5.2), new THREE.MeshStandardMaterial({ map: TX.dust, transparent: true, depthWrite: false, roughness: 1 }));
    dustM.rotation.x = -Math.PI / 2; dustM.position.set(0.1, -0.051, 0.2); scene.add(dustM);

    // oven
    const oven = new THREE.Group();
    const face = new THREE.Shape();
    face.moveTo(-16, -1.4); face.lineTo(16, -1.4); face.lineTo(16, 11); face.lineTo(-16, 11); face.lineTo(-16, -1.4);
    const hole = new THREE.Path();
    hole.moveTo(-1.95, -0.06); hole.lineTo(-1.95, 0.7);
    hole.absellipse(0, 0.7, 1.95, 0.95, Math.PI, 0, true);
    hole.lineTo(1.95, -0.06); hole.lineTo(-1.95, -0.06);
    face.holes.push(hole);
    TX.brick.repeat.set(0.42, 0.42);
    const brickMat = new THREE.MeshStandardMaterial({ map: TX.brick, roughness: 0.95, color: 0x6e5246 });
    const faceMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(face, { depth: 0.9, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 2, curveSegments: lowEnd ? 18 : 32 }), brickMat);
    faceMesh.position.z = -7.6; oven.add(faceMesh);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(5, 4), new THREE.MeshStandardMaterial({ color: 0x3a2419, roughness: 0.9 }));
    floor.rotation.x = -Math.PI / 2; floor.position.set(0, -0.06, -9.1); oven.add(floor);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(2.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ map: TX.brick, color: 0x5a3a2e, roughness: 1, side: THREE.BackSide }));
    dome.scale.set(1, 0.72, 0.9); dome.position.set(0, -0.06, -9.3); oven.add(dome);
    const fireMat = fireMaterial();
    const flames = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.7), fireMat);
    flames.position.set(-1.1, 0.75, -10.4); flames.rotation.y = 0.35; oven.add(flames);
    const flames2 = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.3), fireMat);
    flames2.position.set(-1.7, 0.6, -9.2); flames2.rotation.y = 1.0; oven.add(flames2);
    const glowMat = new THREE.SpriteMaterial({ map: TX.soft, color: 0xff7a2a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.3, fog: false });
    const glow = new THREE.Sprite(glowMat); glow.scale.set(7.5, 3.6, 1); glow.position.set(0, 0.8, -7.4); oven.add(glow);
    scene.add(oven);

    // the pizza, on a peel
    const peel = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ map: TX.wood, roughness: 0.7, color: 0xa88664 });
    const board = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.12, R * 1.12, 0.05, lowEnd ? 48 : 72), woodMat);
    board.position.y = -0.026; peel.add(board);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.05, 2.6), woodMat);
    handle.position.set(0, -0.026, R * 1.12 + 1.25); peel.add(handle);
    const shadowM = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6), new THREE.MeshBasicMaterial({ map: TX.shadow, transparent: true, depthWrite: false, opacity: 0.85 }));
    shadowM.rotation.x = -Math.PI / 2; shadowM.position.y = -0.05; peel.add(shadowM);
    scene.add(peel);

    const pizza = new THREE.Group();
    peel.add(pizza);
    key.target.position.set(0, 0, 0.1);
    const doughMat = bakeable(new THREE.MeshStandardMaterial({ map: TX.doughRaw, bumpMap: TX.doughRaw, bumpScale: 0.01, roughness: 0.8, metalness: 0 }), TX.doughBaked);
    const dough = new THREE.Mesh(doughGeometry(), doughMat);
    dough.morphTargetInfluences = [0, 0];
    pizza.add(dough);

    const sauceMat = bakeable(new THREE.MeshStandardMaterial({ map: TX.sauce, bumpMap: TX.sauce, bumpScale: 0.02, roughness: 0.5, metalness: 0, transparent: true }), TX.sauceBaked, true);
    const sauce = new THREE.Mesh(new THREE.CircleGeometry(RIN * 1.0, lowEnd ? 64 : 96), sauceMat);
    sauce.rotation.x = -Math.PI / 2; sauce.position.y = H_TOP + 0.004; sauce.visible = false;
    pizza.add(sauce);

    const r = rng(42);
    const cheeseMat = bakeable(new THREE.MeshStandardMaterial({ map: TX.cheese, color: 0xe4d9c6, roughness: 0.36, emissive: 0x120c06 }), TX.cheeseBaked);
    const cheeses = [];
    const spots = [[0, 0], [0.42, 0.2], [-0.38, 0.32], [0.12, -0.5], [-0.5, -0.28], [0.58, -0.36], [-0.12, 0.62], [0.5, 0.55], [-0.66, 0.05], [0.25, 0.28]];
    spots.slice(0, lowEnd ? 8 : 10).forEach(([x, z], i) => {
      const m = new THREE.Mesh(blobGeometry(100 + i), cheeseMat);
      const sx = 0.13 + r() * 0.07, sz = 0.11 + r() * 0.07;
      m.userData = { x: x + (r() - 0.5) * 0.08, z: z + (r() - 0.5) * 0.08, sx, sz, sy: 0.085, start: 0.4 + i * 0.011, fromY: 2.2 + r() * 1.4, rot: r() * 6 };
      m.visible = false;
      pizza.add(m); cheeses.push(m);
    });

    const basilMat = new THREE.MeshStandardMaterial({ color: 0x2a7a26, roughness: 0.24, metalness: 0, side: THREE.DoubleSide, vertexColors: true });
    const basilBaked = new THREE.Color(0x1a4a17), basilFresh = new THREE.Color(0x2a7a26);
    const leaves = [];
    const lg = leafGeometry();
    [[0.05, 0.12], [-0.42, -0.06], [0.38, -0.22], [-0.1, -0.52], [0.24, 0.5]].forEach(([x, z], i) => {
      const m = new THREE.Mesh(lg, basilMat);
      m.userData = { x, z, start: 0.555 + i * 0.012, rot: r() * 6.28, fromY: 2.6 + r(), spin: (r() - 0.5) * 8, s: 0.9 + r() * 0.35 };
      m.visible = false;
      pizza.add(m); leaves.push(m);
    });

    const oilMat = new THREE.MeshStandardMaterial({ color: 0xd8a52a, roughness: 0.06, metalness: 0.15, transparent: true, opacity: 0.85, emissive: 0x3a2400 });
    const oils = [];
    const oilGeo = new THREE.SphereGeometry(1, 12, 8);
    const N_OIL = lowEnd ? 12 : 18;
    for (let i = 0; i < N_OIL; i++) {
      const a = i * 2.39, rr = 0.12 + (i / N_OIL) * 0.75;
      const m = new THREE.Mesh(oilGeo, oilMat);
      m.userData = { x: Math.cos(a) * rr, z: Math.sin(a) * rr, start: 0.6 + i * (0.05 / N_OIL) };
      m.visible = false;
      pizza.add(m); oils.push(m);
    }

    // particles
    const flour = particles(lowEnd ? 90 : 180, [-3, 3, 0.1, 3, -2.2, 2.2], 0xfff6e6, lowEnd ? 4 : 5, "flour", 5);
    scene.add(flour);
    const embers = particles(lowEnd ? 90 : 200, [-2, 2, -0.1, 0.6, -8.4, -7.2], 0xff8a2a, lowEnd ? 9 : 11, "ember", 9);
    scene.add(embers);
    const steam = [];
    const steamMat = new THREE.SpriteMaterial({ map: TX.soft, color: 0xfff3e0, transparent: true, opacity: 0, depthWrite: false });
    for (let i = 0; i < (lowEnd ? 4 : 7); i++) {
      const s = new THREE.Sprite(steamMat.clone());
      s.userData = { off: i / 7, x: (r() - 0.5) * 1.6, z: (r() - 0.5) * 1.6 };
      pizza.add(s); steam.push(s);
    }

    // sizing
    let W = 1, H = 1, portrait = false, m = 1;
    function resize() {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, rect.width); H = Math.max(1, rect.height);
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      portrait = camera.aspect < 0.9;
      m = portrait ? Math.max(1, 0.98 / camera.aspect) : camera.aspect < 1.25 ? 1.15 : 1;
      if (portrait) camera.setViewOffset(W, H, 0, H * 0.1, W, H);
      else camera.clearViewOffset();
      camera.updateProjectionMatrix();
      [flour, embers].forEach((pp) => (pp.material.uniforms.uPR.value = renderer.getPixelRatio()));
    }
    resize();
    addEventListener("resize", resize, { passive: true });

    const vA = new THREE.Vector3(), vB = new THREE.Vector3(), tA = new THREE.Vector3(), tB = new THREE.Vector3();
    const camPos = new THREE.Vector3(), camTarget = new THREE.Vector3();
    const KEYS = {
      A: [new THREE.Vector3(0, 2.8, 5.2), new THREE.Vector3(0, 0.1, -0.2)],
      B: [new THREE.Vector3(0, 1.6, 4.4), new THREE.Vector3(0, 0.45, -6.2)],
      C: [new THREE.Vector3(0, 0.95, -3.0), new THREE.Vector3(0, 0.3, -8.8)],
      D: [new THREE.Vector3(0, 2.55, 3.75), new THREE.Vector3(0, 0.02, 0.3)],
    };
    const scaled = (key, mult, out, outT) => {
      outT.copy(KEYS[key][1]);
      out.copy(KEYS[key][0]).sub(outT).multiplyScalar(mult).add(outT);
    };

    let time = 0;
    function update(p, dt) {
      time += dt;
      // dough: ball -> pizza, puff while baking
      const stretch = easeInOut(seg(p, 0.065, 0.22));
      const bake = easeInOut(seg(p, 0.765, 0.86));
      dough.morphTargetInfluences[0] = stretch;
      dough.morphTargetInfluences[1] = bake;
      const breathe = 1 + Math.sin(time * 1.6) * 0.012 * (1 - stretch);
      dough.scale.set(breathe, 1 / breathe, breathe);
      doughMat.userData.u.uBake.value = bake;

      // sauce spiral
      const sp = seg(p, 0.225, 0.4);
      sauce.visible = sp > 0.001;
      sauceMat.userData.u.uReveal.value = sp;
      sauceMat.userData.u.uBake.value = bake;

      // mozzarella drops in, melts in the oven
      cheeseMat.userData.u.uBake.value = bake;
      for (const c of cheeses) {
        const d = c.userData, f = seg(p, d.start, d.start + 0.055);
        c.visible = f > 0;
        if (!c.visible) continue;
        const fall = easeOut(Math.min(1, f / 0.8));
        const land = seg(f, 0.72, 1);
        const squash = Math.sin(land * Math.PI) * 0.35;
        const melt = bake;
        c.position.set(d.x, lerp(d.fromY, H_TOP + 0.03 - melt * 0.012, fall), d.z);
        c.scale.set(d.sx * (1 + squash * 0.6 + melt * 0.75), d.sy * (1 - squash) * (1 - melt * 0.5), d.sz * (1 + squash * 0.6 + melt * 0.75));
        c.rotation.y = d.rot;
      }

      // basil
      basilMat.color.copy(basilFresh).lerp(basilBaked, bake * 0.85);
      for (const l of leaves) {
        const d = l.userData, f = seg(p, d.start, d.start + 0.05);
        l.visible = f > 0;
        if (!l.visible) continue;
        const e = easeOut(f);
        l.position.set(d.x, lerp(d.fromY, H_TOP + 0.075 - bake * 0.02, e), d.z);
        l.rotation.set((1 - e) * d.spin * 0.6, d.rot + (1 - e) * d.spin, (1 - e) * d.spin * 0.4);
        const s = d.s * (1 - bake * 0.12);
        l.scale.set(s, s, s);
      }

      // olive oil drizzle
      for (const o of oils) {
        const d = o.userData, f = seg(p, d.start, d.start + 0.03);
        o.visible = f > 0 && bake < 0.6;
        if (!o.visible) continue;
        const fallT = Math.min(1, f / 0.7), landT = seg(f, 0.7, 1);
        o.position.set(d.x, lerp(1.7, H_TOP + 0.03, fallT * fallT), d.z);
        const s = 0.035;
        o.scale.set(s * (1 + landT * 1.6), s * (1 - landT * 0.75), s * (1 + landT * 1.6));
      }
      sauceMat.roughness = lerp(0.52, 0.28, seg(p, 0.6, 0.66));
      oilMat.opacity = 0.85 * (1 - seg(p, 0.76, 0.82));

      // oven choreography
      const tIn = easeInOut(seg(p, 0.68, 0.77));
      const tOut = easeInOut(seg(p, 0.865, 0.955));
      const z = tOut > 0 ? lerp(-8.9, 0.25, tOut) : lerp(0, -8.9, tIn);
      peel.position.set(0, 0, z);
      shadowM.visible = z > -7.1;
      pizza.rotation.y = time * 0.07 + bake * Math.PI * 0.75 + p * 1.2;
      handle.visible = true;

      const heat = clamp(0.25 + seg(p, 0.6, 0.74) * 0.75 - seg(p, 0.92, 1) * 0.45);
      const flick = 0.85 + 0.15 * Math.sin(time * 13.1) * Math.sin(time * 7.3 + 1);
      fire.intensity = (0.5 + heat * 3.4) * flick;
      fireMat.uniforms.uI.value = 0.3 + heat * 0.75;
      glowMat.opacity = 0.12 + heat * 0.38;
      fireMat.uniforms.uTime.value = time;
      warm.intensity = seg(p, 0.88, 1) * 0.9;

      // particles
      flour.material.uniforms.uTime.value = time;
      flour.material.uniforms.uOpacity.value = 0.75 * (1 - seg(p, 0.2, 0.34));
      flour.visible = flour.material.uniforms.uOpacity.value > 0.01;
      embers.material.uniforms.uTime.value = time;
      embers.material.uniforms.uOpacity.value = 0.25 + heat * 0.9;

      // steam once out of the oven
      const steamOn = seg(p, 0.9, 0.97);
      for (const s of steam) {
        const d = s.userData, life = (time * 0.22 + d.off) % 1;
        s.position.set(d.x * (1 + life * 0.3), 0.25 + life * 1.6, d.z * (1 + life * 0.3));
        const sc = 0.5 + life * 1.3; s.scale.set(sc, sc, sc);
        s.material.opacity = steamOn * 0.16 * Math.sin(life * Math.PI);
        s.visible = steamOn > 0.01;
      }

      // camera path
      const orbit = -0.32 + seg(p, 0, 0.66) * 0.64;
      if (p < 0.68) {
        scaled("A", m, camPos, camTarget);
        camPos.applyAxisAngle(THREE.Object3D.DEFAULT_UP, orbit);
        camPos.y += (1 - stretch) * -0.35;
      } else if (p < 0.77) {
        scaled("A", m, vA, tA); vA.applyAxisAngle(THREE.Object3D.DEFAULT_UP, orbit);
        scaled("B", portrait ? m * 0.85 : 1, vB, tB);
        camPos.lerpVectors(vA, vB, tIn); camTarget.lerpVectors(tA, tB, tIn);
      } else if (p < 0.865) {
        const tc = easeInOut(seg(p, 0.77, 0.865));
        scaled("B", portrait ? m * 0.85 : 1, vA, tA); scaled("C", 1, vB, tB);
        camPos.lerpVectors(vA, vB, tc); camTarget.lerpVectors(tA, tB, tc);
      } else {
        scaled("C", 1, vA, tA); scaled("D", portrait ? m * 1.16 : m, vB, tB);
        camPos.lerpVectors(vA, vB, tOut); camTarget.lerpVectors(tA, tB, tOut);
        camPos.x += Math.sin(time * 0.25) * 0.08 * seg(p, 0.95, 1);
      }
      camera.position.copy(camPos);
      camera.lookAt(camTarget);
    }

    // adaptive resolution: drop pixel ratio if frames are slow
    let slow = 0, frames = 0, downgrades = 0;
    function render(dt) {
      update(stage.p, dt);
      renderer.render(scene, camera);
      frames++;
      if (dt > 0.026) slow++;
      if (frames >= 90) {
        if (slow > 45 && downgrades < 3 && pr > 0.75) {
          pr = Math.max(0.75, pr - 0.3);
          renderer.setPixelRatio(pr);
          resize();
          downgrades++;
        }
        frames = 0; slow = 0;
      }
    }
    stage.render = render;
    stage.resize = resize;
    stage.ok = true;
    return true;
  }

  /* ---------------------------------------------------------- hero overlays */
  const intro = $("#heroIntro");
  const phases = $$(".phase");
  const finalEl = $("#heroFinal");
  const railFill = $("#railFill");
  const nav = $("#nav");
  const PH = [[0.07, 0.225], [0.225, 0.4], [0.4, 0.55], [0.55, 0.68], [0.68, 0.875]];
  let lastPhase = -2, lastIntro = -1;
  function heroOverlays(p) {
    const io = 1 - seg(p, 0.012, 0.06);
    if (Math.abs(io - lastIntro) > 0.002) {
      intro.style.opacity = io.toFixed(3);
      intro.style.transform = `translate3d(0,${(-40 * (1 - io)).toFixed(1)}px,0)`;
      intro.style.visibility = io <= 0.001 ? "hidden" : "visible";
      lastIntro = io;
    }
    let ph = -1;
    PH.forEach(([a, b], i) => { if (p >= a && p < b) ph = i; });
    if (p >= 0.905) ph = 9;
    if (ph !== lastPhase) {
      phases.forEach((el, i) => el.classList.toggle("is-active", i === ph));
      finalEl.classList.toggle("is-active", ph === 9);
      lastPhase = ph;
    }
    railFill.style.transform = `scaleY(${p.toFixed(4)})`;
  }

  /* ------------------------------------------------------------- the story */
  let storyWords = [];
  function splitStory() {
    const el = $("#storyText");
    const txt = T[lang]["story.t"];
    const accent = lang === "fr" ? ["Naples", "Pâquis,"] : ["Naples", "Pâquis,"];
    el.innerHTML = "";
    storyWords = txt.split(" ").map((w) => {
      const s = document.createElement(accent.includes(w) ? "em" : "span");
      s.className = "w";
      s.textContent = w + " ";
      el.appendChild(s);
      return s;
    });
    if (reduceMotion) storyWords.forEach((w) => w.classList.add("on"));
    lastStory = -1;
  }
  let lastStory = -1;
  function storyProgress(q) {
    const n = Math.round(q * storyWords.length);
    if (n === lastStory) return;
    storyWords.forEach((w, i) => w.classList.toggle("on", i < n));
    lastStory = n;
  }

  /* ------------------------------------------------------------- the dough */
  const clockN = $("#clockN");
  const steps = $$(".step");
  const ball = $("#doughBall");
  const bubbles = $$(".bubble");
  const gTemp = $("#gTemp");
  const dough = { q: 0, target: 0, lastH: -1 };
  function doughFrame(q) {
    const h = Math.round(q * 48);
    if (h !== dough.lastH) {
      clockN.textContent = String(h).padStart(2, "0");
      const thresholds = [0, 6, 24, 47];
      steps.forEach((s, i) => s.classList.toggle("is-on", h >= thresholds[i]));
      bubbles.forEach((b, i) => b.classList.toggle("on", h >= 4 + i * 6));
      const temp = h < 6 ? 22 : h < 12 ? Math.round(lerp(22, 4, (h - 6) / 6)) : h < 44 ? 4 : Math.round(lerp(4, 18, (h - 44) / 4));
      gTemp.textContent = `${temp}°`;
      dough.lastH = h;
    }
    const e = easeOut(q);
    const s = 0.7 + 0.42 * e;
    ball.style.transform = `scale(${(s * (1 + 0.06 * e)).toFixed(4)}, ${(s * (1 + 0.1 * e)).toFixed(4)})`;
  }

  /* ------------------------------------------------------------------ menu */
  const tabsEl = $("#tabs");
  const pill = $("#tabsPill");
  const dishesEl = $("#dishes");
  let activeCat = "rosse";
  function renderTabs() {
    $$(".tab", tabsEl).forEach((b) => b.remove());
    Object.keys(MENU).forEach((cat) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "tab";
      b.role = "tab";
      b.id = `tab-${cat}`;
      b.setAttribute("aria-controls", "dishes");
      b.setAttribute("aria-selected", String(cat === activeCat));
      b.tabIndex = cat === activeCat ? 0 : -1;
      b.textContent = T[lang].tabs[cat];
      b.addEventListener("click", () => selectCat(cat, true));
      b.addEventListener("keydown", (e) => {
        const keys = Object.keys(MENU);
        const i = keys.indexOf(cat);
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          const n = keys[(i + (e.key === "ArrowRight" ? 1 : keys.length - 1)) % keys.length];
          selectCat(n, true);
          $(`#tab-${n}`).focus();
        }
      });
      tabsEl.appendChild(b);
    });
    dishesEl.setAttribute("aria-labelledby", `tab-${activeCat}`);
    requestAnimationFrame(movePill);
  }
  function movePill() {
    const b = $(`#tab-${activeCat}`);
    if (!b) return;
    pill.style.width = `${b.offsetWidth}px`;
    pill.style.transform = `translateX(${b.offsetLeft}px)`;
  }
  addEventListener("resize", movePill, { passive: true });

  const price = (v) => (Number.isInteger(v) ? `${v}.–` : v.toFixed(2));
  function renderDishes(animate) {
    const items = MENU[activeCat];
    dishesEl.innerHTML = items
      .map(
        (d) => `<article class="dish" tabindex="0" aria-label="${d.name}, CHF ${price(d.price)}">
        <div class="dish__art" aria-hidden="true">${art(d.art)}<span class="steam"><i></i><i></i><i></i></span></div>
        <div><h3 class="dish__name">${d.name}</h3><p class="dish__desc">${d[lang]}</p>${d.tag ? `<span class="dish__tag">${d.tag[lang]}</span>` : ""}</div>
        <div class="dish__price"><small>CHF</small>${price(d.price)}</div>
      </article>`,
      )
      .join("");
    $$(".dish", dishesEl).forEach((el) =>
      el.addEventListener("click", () => {
        el.classList.add("is-tapped");
        clearTimeout(el._t);
        el._t = setTimeout(() => el.classList.remove("is-tapped"), 1800);
      }),
    );
    if (animate && !reduceMotion) {
      gsap.fromTo($$(".dish", dishesEl), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.07, clearProps: "transform,opacity" });
    }
  }
  function selectCat(cat, animate) {
    if (cat === activeCat) return;
    activeCat = cat;
    $$(".tab", tabsEl).forEach((b) => {
      const on = b.id === `tab-${cat}`;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
    });
    dishesEl.setAttribute("aria-labelledby", `tab-${cat}`);
    movePill();
    if (!animate || reduceMotion) return renderDishes(false);
    gsap.to($$(".dish", dishesEl), { opacity: 0, y: -10, duration: 0.22, stagger: 0.025, ease: "power2.in", onComplete: () => renderDishes(true) });
  }

  /* Top-down illustrations, consistent with the hero's view of the pizza. */
  let artId = 0;
  function art(kind) {
    const id = `a${artId++}`;
    const r = rng([...kind].reduce((a, c) => a + c.charCodeAt(0), 0));
    const dots = (n, rad, minR, maxR, fill, extra = "") => {
      let s = "";
      for (let i = 0; i < n; i++) {
        const a = r() * Math.PI * 2, d = Math.sqrt(r()) * rad;
        s += `<circle cx="${(50 + Math.cos(a) * d).toFixed(1)}" cy="${(50 + Math.sin(a) * d).toFixed(1)}" r="${(minR + r() * (maxR - minR)).toFixed(1)}" fill="${fill}" ${extra}/>`;
      }
      return s;
    };
    const leaf = (x, y, rot, s = 1) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0-6c4 2 5 7 0 12C-5 1-4-4 0-6z" fill="#3f8a34"/><path d="M0-5v10" stroke="#2b6224" stroke-width=".6"/></g>`;
    const crust = (white) => `
      <defs><radialGradient id="${id}c" cx="50%" cy="45%" r="55%"><stop offset=".78" stop-color="${white ? "#f0e1c0" : "#c8341d"}"/><stop offset=".8" stop-color="#e9b770"/><stop offset=".92" stop-color="#d79b4f"/><stop offset="1" stop-color="#a8652c"/></radialGradient></defs>
      <circle cx="50" cy="50" r="47" fill="url(#${id}c)"/>
      ${Array.from({ length: 16 }, () => { const a = r() * 6.283, d = 40 + r() * 6; return `<circle cx="${(50 + Math.cos(a) * d).toFixed(1)}" cy="${(50 + Math.sin(a) * d).toFixed(1)}" r="${(0.8 + r() * 1.8).toFixed(1)}" fill="#2a1408" opacity=".85"/>`; }).join("")}`;
    const cheese = (n) => dots(n, 26, 4, 7.5, "#fbf3e3");
    const plate = `<circle cx="50" cy="50" r="47" fill="#efe5d2"/><circle cx="50" cy="50" r="38" fill="none" stroke="#d9cbb0" stroke-width="1.2"/>`;
    const svg = (inner) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
    switch (kind) {
      case "margherita": return svg(crust() + cheese(7) + leaf(44, 40, 20) + leaf(60, 58, -40) + leaf(38, 62, 70, 0.9));
      case "marinara": return svg(crust() + dots(10, 28, 1.6, 2.6, "#f4ead2") + dots(40, 30, 0.5, 0.9, "#4b6b2a"));
      case "diavola": return svg(crust() + cheese(5) + Array.from({ length: 8 }, () => { const a = r() * 6.283, d = r() * 26; const x = 50 + Math.cos(a) * d, y = 50 + Math.sin(a) * d; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="#8e1f14"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.6" fill="#a8301f"/>`; }).join("") + dots(6, 26, 0.8, 1.4, "#ffcf6b"));
      case "capricciosa": return svg(crust() + cheese(5) + dots(6, 25, 3.5, 5, "#e9a5a0") + dots(6, 26, 2.5, 3.5, "#c9a77f") + dots(6, 26, 2, 2.4, "#1d1612", 'stroke="#3a2c25" stroke-width="1"') + dots(4, 24, 3, 4, "#7a9a5a"));
      case "quattro": return svg(crust(true) + dots(8, 26, 4, 7, "#fdf6e6") + dots(5, 24, 3, 5, "#d8cfa7") + dots(14, 24, 0.6, 1.2, "#5c6f86") + dots(5, 24, 3, 4.5, "#e9c27a"));
      case "mortadella": return svg(crust(true) + dots(7, 25, 6, 8, "#f1b8b4", 'stroke="#e59c97" stroke-width="1"') + `<circle cx="50" cy="50" r="9" fill="#fffaf0"/>` + dots(40, 28, 0.6, 1.3, "#6ea145"));
      case "salsiccia": return svg(crust(true) + dots(7, 25, 4, 6, "#f3e3c2") + dots(10, 26, 2, 3.4, "#8a4f30") + Array.from({ length: 6 }, () => { const a = r() * 6.283, d = r() * 24; return `<path d="M${(50 + Math.cos(a) * d).toFixed(1)} ${(50 + Math.sin(a) * d).toFixed(1)}c3-3 6 0 8-2" stroke="#2f5a24" stroke-width="2.4" fill="none" stroke-linecap="round"/>`; }).join(""));
      case "burrata": return svg(plate + dots(9, 30, 3, 4.5, "#d63a22") + `<circle cx="50" cy="50" r="15" fill="#fdf8ee"/><path d="M42 46c4-4 12-4 16 0" stroke="#efe4cf" stroke-width="2" fill="none"/>` + leaf(70, 40, 40) + leaf(32, 64, -20) + dots(12, 26, 0.6, 1, "#c99a2a"));
      case "arancini": return svg(plate + [[40, 42], [60, 44], [50, 62]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="#d6913a"/><circle cx="${x - 3}" cy="${y - 3}" r="5" fill="#e9b765" opacity=".7"/>`).join("") + dots(16, 30, 0.6, 1, "#9a5a20"));
      case "montanara": return svg(plate + `<circle cx="50" cy="50" r="28" fill="#dfa255"/><circle cx="50" cy="50" r="21" fill="#c8341d"/>` + dots(18, 18, 0.8, 1.6, "#f8eed6") + leaf(52, 48, 30, 1.1));
      case "tiramisu": return svg(plate + `<rect x="31" y="31" width="38" height="38" rx="3" fill="#f3e6cc"/><rect x="33" y="33" width="34" height="34" rx="2" fill="#6b4029"/>` + dots(30, 15, 0.5, 1.1, "#3e2216"));
      case "cannolo": return svg(plate + `<g transform="rotate(-30 50 50)"><rect x="26" y="42" width="48" height="16" rx="8" fill="#d39448"/><ellipse cx="26" cy="50" rx="5" ry="8" fill="#fbf2df"/><ellipse cx="74" cy="50" rx="5" ry="8" fill="#fbf2df"/></g>` + `<circle cx="24" cy="62" r="2" fill="#7fae52"/><circle cx="76" cy="38" r="2" fill="#7fae52"/><circle cx="58" cy="44" r="1.4" fill="#e8a33a"/>`);
      case "chinotto": return svg(`<circle cx="50" cy="50" r="40" fill="#efe5d2" opacity=".18"/><circle cx="50" cy="50" r="30" fill="#3a1a0e"/><circle cx="50" cy="50" r="30" fill="none" stroke="#f3e9d7" stroke-opacity=".5" stroke-width="2"/>` + dots(12, 22, 0.8, 1.6, "#a0603a"));
      case "limonata": return svg(`<circle cx="50" cy="50" r="40" fill="#efe5d2" opacity=".18"/><circle cx="50" cy="50" r="30" fill="#f2e08a"/><circle cx="50" cy="50" r="30" fill="none" stroke="#f3e9d7" stroke-opacity=".6" stroke-width="2"/><circle cx="58" cy="44" r="11" fill="#f7d34a"/><circle cx="58" cy="44" r="9" fill="#fbe78a"/>` + leaf(40, 58, 30, 1.2));
      case "vino": return svg(`<circle cx="50" cy="50" r="40" fill="#efe5d2" opacity=".18"/><circle cx="50" cy="50" r="31" fill="none" stroke="#f3e9d7" stroke-opacity=".55" stroke-width="2"/><circle cx="50" cy="50" r="22" fill="#5a0f1c"/><circle cx="44" cy="44" r="5" fill="#7d1d2c" opacity=".7"/>`);
      case "espresso": return svg(`<circle cx="50" cy="50" r="40" fill="#efe5d2"/><circle cx="50" cy="50" r="24" fill="#fbf6ec"/><rect x="72" y="46" width="12" height="8" rx="4" fill="#fbf6ec"/><circle cx="50" cy="50" r="18" fill="#c58a4e"/><circle cx="50" cy="50" r="18" fill="none" stroke="#8a5a2e" stroke-width="2"/>` + dots(10, 12, 0.6, 1.2, "#e4b07a"));
      default: return svg(crust() + cheese(6));
    }
  }

  /* ---------------------------------------------------------------- booking */
  const booking = { step: 1, day: null, time: null, guests: 2, no: 0 };
  const form = $("#bookForm");
  const panes = $("#panes");
  function openDays() {
    const out = [];
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    while (out.length < 10) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 1) out.push(new Date(d));
    }
    return out;
  }
  function renderDays() {
    const fmtW = new Intl.DateTimeFormat(T[lang].locale, { weekday: "short" });
    const fmtD = new Intl.DateTimeFormat(T[lang].locale, { day: "numeric", month: "short" });
    $("#dayChips").innerHTML = openDays()
      .map((d) => { const iso = d.toISOString().slice(0, 10); return `<button type="button" class="chip" data-day="${iso}" aria-pressed="${booking.day === iso}"><span><small>${fmtW.format(d)}</small>${fmtD.format(d)}</span></button>`; })
      .join("");
  }
  function renderTimes() {
    const groups = [["book.lunch", ["12:00", "12:30", "13:00", "13:30"]], ["book.dinner", ["18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"]]];
    $("#timeChips").innerHTML = groups
      .map(([k, list]) => `<div class="slot-group"><p>${t(k)}</p><div class="chips chips--time" role="group" aria-label="${t(k)}">${list.map((x) => `<button type="button" class="chip" data-time="${x}" aria-pressed="${booking.time === x}">${x}</button>`).join("")}</div></div>`)
      .join("");
  }
  function setStep(n) {
    const from = $(`.pane[data-pane="${booking.step}"]`);
    const to = $(`.pane[data-pane="${n}"]`);
    const h0 = panes.offsetHeight;
    from.classList.remove("is-active");
    to.classList.add("is-active");
    const h1 = panes.offsetHeight;
    if (!reduceMotion && h0 !== h1) {
      panes.style.height = `${h0}px`;
      requestAnimationFrame(() => { panes.style.height = `${h1}px`; });
      setTimeout(() => { panes.style.height = ""; }, 550);
    }
    booking.step = n;
    $$("#bookProgress li").forEach((li, i) => {
      li.classList.toggle("is-done", i + 1 < n);
      li.classList.toggle("is-current", i + 1 === n);
    });
    const focusEl = to.querySelector("h3, .ticket");
    if (focusEl) { focusEl.tabIndex = -1; focusEl.focus({ preventScroll: true }); }
  }
  form.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (chip) {
      if (chip.dataset.day) {
        booking.day = chip.dataset.day;
        $$("#dayChips .chip").forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
        $('.pane[data-pane="1"] [data-next]').disabled = false;
      } else if (chip.dataset.time) {
        booking.time = chip.dataset.time;
        $$("#timeChips .chip").forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
        $('.pane[data-pane="2"] [data-next]').disabled = false;
      }
      return;
    }
    if (e.target.closest("[data-next]")) setStep(booking.step + 1);
    else if (e.target.closest("[data-back]")) setStep(booking.step - 1);
  });
  const guestsOut = $("#guests");
  $("#gMinus").addEventListener("click", () => { booking.guests = Math.max(1, booking.guests - 1); guestsOut.textContent = booking.guests; });
  $("#gPlus").addEventListener("click", () => { booking.guests = Math.min(12, booking.guests + 1); guestsOut.textContent = booking.guests; });
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // demo: nothing is sent anywhere
    const name = $("#bookName").value.trim();
    const err = $("#nameErr");
    if (name.replace(/[^\p{L}]/gu, "").length < 2) {
      err.textContent = t("book.nameErr");
      $("#bookName").setAttribute("aria-invalid", "true");
      $("#bookName").focus();
      return;
    }
    err.textContent = "";
    $("#bookName").removeAttribute("aria-invalid");
    booking.no = 10 + Math.floor(Math.random() * 89);
    fillTicket();
    setStep(4);
    const tk = $("#ticket");
    tk.classList.remove("is-printed");
    requestAnimationFrame(() => requestAnimationFrame(() => tk.classList.add("is-printed")));
  });
  function fillTicket() {
    const d = booking.day ? new Date(`${booking.day}T12:00:00`) : new Date();
    const fmt = new Intl.DateTimeFormat(T[lang].locale, { weekday: "long", day: "numeric", month: "long" });
    const rows = [
      [t("t.no"), String(booking.no).padStart(3, "0")],
      [t("t.table"), t("t.guests")(booking.guests)],
      [t("t.day"), fmt.format(d)],
      [t("t.time"), booking.time || "—"],
      [t("t.name"), $("#bookName").value.trim()],
    ];
    const dl = $("#ticketDl");
    dl.innerHTML = "";
    rows.forEach(([k, v]) => {
      const dt = document.createElement("dt"); dt.textContent = k;
      const dd = document.createElement("dd"); dd.textContent = v;
      dl.append(dt, dd);
    });
  }
  $("#bookAgain").addEventListener("click", () => {
    Object.assign(booking, { day: null, time: null, guests: 2 });
    guestsOut.textContent = "2";
    $("#bookName").value = "";
    renderDays(); renderTimes();
    $$("[data-next]").forEach((b) => (b.disabled = true));
    setStep(1);
  });

  /* ------------------------------------------------------------------ visit */
  function renderHours() {
    const H = { 0: "12:00 – 22:00", 1: null, 2: "11:45 – 14:00 · 18:30 – 22:30", 3: "11:45 – 14:00 · 18:30 – 22:30", 4: "11:45 – 14:00 · 18:30 – 22:30", 5: "11:45 – 14:00 · 18:30 – 23:00", 6: "12:00 – 23:00" };
    const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Zurich" })).getDay();
    const order = [2, 3, 4, 5, 6, 0, 1];
    $("#hours").innerHTML = order
      .map((d) => `<li class="${d === today ? "is-today" : ""}"><span>${T[lang].days[d]}</span><span>${H[d] || t("visit.closed")}</span></li>`)
      .join("");
  }
  $("#copyPhone").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    try {
      await navigator.clipboard.writeText("+41 22 000 00 00");
      btn.textContent = t("visit.copied");
    } catch {
      const sel = getSelection(); const range = document.createRange();
      range.selectNodeContents($("#phone")); sel.removeAllRanges(); sel.addRange(range);
    }
    setTimeout(() => (btn.textContent = t("visit.copy")), 1800);
  });

  /* --------------------------------------------- cursor, magnetic, reveals */
  if (finePointer && !reduceMotion) {
    doc.classList.add("has-cursor");
    const cur = $("#cursor"), dot = $(".cursor__dot", cur), ring = $(".cursor__ring", cur);
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    addEventListener("pointerdown", () => cur.classList.add("is-down"));
    addEventListener("pointerup", () => cur.classList.remove("is-down"));
    document.addEventListener("pointerover", (e) => cur.classList.toggle("is-hover", !!e.target.closest("a,button,.dish,.chip,[data-magnetic]")));
    gsap.ticker.add(() => {
      rx += (mx - rx) * 0.2; ry += (my - ry) * 0.2;
      dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
      ring.style.translate = `${rx}px ${ry}px`;
    });
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const b = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - (b.left + b.width / 2)) * 0.28, y: (e.clientY - (b.top + b.height / 2)) * 0.4, duration: 0.45, ease: "power3.out" });
      });
      el.addEventListener("pointerleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1,0.4)" }));
    });
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }),
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );
  $$("[data-reveal]").forEach((el) => io.observe(el));

  $("#langFr").addEventListener("click", () => { lang = "fr"; store.set("bp-lang", "fr"); applyLang(); });
  $("#langEn").addEventListener("click", () => { lang = "en"; store.set("bp-lang", "en"); applyLang(); });

  /* ------------------------------------------------------------- wiring up */
  applyLang();
  setLoad(0.6);

  let webgl = false;
  try { webgl = typeof THREE !== "undefined" && initStage(); } catch (err) { webgl = false; console.warn("3D stage unavailable", err && err.message); }
  if (!webgl) {
    doc.classList.add("no-webgl");
    const f = document.createElement("div");
    f.className = "fallback-pizza";
    f.setAttribute("aria-hidden", "true");
    f.innerHTML = art("margherita");
    $("#heroFrame").prepend(f);
    $("#stage").remove();
    $$(".phase, .rail").forEach((el) => (el.style.display = "none"));
  }

  if (reduceMotion || !webgl) {
    stage.p = stage.target = reduceMotion ? 1 : 0;
    if (webgl) { stage.render(0); addEventListener("resize", () => stage.render(0)); }
    finalEl.classList.toggle("is-active", false);
    doughFrame(1);
    storyWords.forEach((w) => w.classList.add("on"));
  } else {
    ScrollTrigger.create({ trigger: ".hero", start: "top top", end: "bottom bottom", onUpdate: (s) => (stage.target = s.progress) });
    ScrollTrigger.create({ trigger: ".dough", start: "top top", end: "bottom bottom", onUpdate: (s) => (dough.target = s.progress) });
    ScrollTrigger.create({ trigger: "#storyText", start: "top 82%", end: "bottom 50%", onUpdate: (s) => storyProgress(s.progress) });
    new IntersectionObserver((en) => en.forEach((e) => (stage.visible = e.isIntersecting))).observe($("#heroFrame"));

    let last = performance.now();
    gsap.ticker.add(() => {
      const now = performance.now();
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      // critically damped follow: buttery even when the scroll input is coarse (touch, trackpad)
      const k = 1 - Math.exp(-dt * 7.5);
      if (Math.abs(stage.target - stage.p) > 0.00002) stage.p += (stage.target - stage.p) * k;
      if (stage.visible && !document.hidden) {
        stage.render(dt);
        heroOverlays(stage.p);
      }
      if (Math.abs(dough.target - dough.q) > 0.0001) {
        dough.q += (dough.target - dough.q) * (1 - Math.exp(-dt * 9));
        doughFrame(dough.q);
      }
    });
  }
  ScrollTrigger.create({ start: () => innerHeight * 4.6, end: "max", onToggle: (s) => nav.classList.toggle("is-solid", s.isActive) });

  setLoad(0.9);
  requestAnimationFrame(() => requestAnimationFrame(finishLoader));
})();
