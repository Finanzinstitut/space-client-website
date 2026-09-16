/*
 * Die Demo.
 *
 * Alles, was hier passiert, passiert im Browser. Es gibt keinen Server dahinter
 * und keine Datei, die geladen wird - der Sinn der Sache ist zu zeigen, wie der
 * Launcher aussieht und sich anfuehlt, ohne dass jemand erst etwas installiert.
 *
 * Wo ein Knopf im Launcher etwas tut, das hier nicht geht, sagt er das statt zu
 * schweigen. Ein Knopf, der auf einen Klick nichts macht, ist von einem kaputten
 * nicht zu unterscheiden, und in einer Demo ist das doppelt unguenstig: dann
 * sieht die Sache aus wie ein Nachbau, der nicht fertig wurde.
 */

const $ = (id) => document.getElementById(id);

// ---------------------------------------------------------------- Daten

const INSTANCES = [
  { name: "Space Client 26.2", mc: "26.2", loader: "Fabric", ram: 6144, path: "D:\\Space Client\\instances\\main", running: true },
  { name: "DonutSMP Profil", mc: "26.2", loader: "Fabric", ram: 4096, path: "D:\\Space Client\\instances\\donut" },
  { name: "Vanilla 1.21.4", mc: "1.21.4", loader: "Vanilla", ram: 2048, path: "D:\\Space Client\\instances\\vanilla" },
];

const MODS = [
  { title: "Sodium", desc: "Ersetzt Minecrafts Renderer und bringt auf den meisten Rechnern ein Vielfaches an Bildern.", tags: ["26.2", "Fabric", "41M"] },
  { title: "Iris Shaders", desc: "Shader-Packs unter Fabric, zusammen mit Sodium.", tags: ["26.2", "Fabric", "18M"] },
  { title: "Mod Menu", desc: "Eine Liste aller geladenen Mods und ihrer Einstellungen, im Spiel.", tags: ["26.2", "Fabric", "31M"] },
  { title: "Lithium", desc: "Räumt im Serverteil auf, ohne am Spielverhalten etwas zu ändern.", tags: ["26.2", "Fabric", "26M"] },
];

const BACKUPS = [
  { title: "Meine Welt", desc: "Gesichert vor 2 Stunden · 46 MB" },
  { title: "Kreativ", desc: "Gesichert gestern · 12 MB" },
];

const CATEGORIES = ["Alle", "adventure", "decoration", "economy", "equipment", "library",
  "magic", "optimization", "social", "storage", "technology", "utility"];

const BUNDLES = {
  umbaria: {
    title: "Download Custom PVP Ressourcenpack",
    text: "Lädt ein Ressourcenpack herunter und legt es in die ausgewählte Instanz.",
    warning: "Das ist ein Ressourcenpack — es muss im Spiel unter Optionen → Ressourcenpakete noch aktiviert werden.",
    credits: "Credits: real_Umbaria",
    items: ["Vanilla PvP v5"],
  },
  finanzinstitut: {
    title: "Finanzinstitut's best creations",
    text: "When you're pressing install you're installing all mods created by Finanzinstitut.",
    warning: "",
    credits: "Credits: Finanzinstitut",
    items: ["Low Health Warning", "No Soundcap", "PvP Item Highlighter"],
  },
  doktorsam: {
    title: "DoktorSam's PvP textures",
    text: "Lädt alle Ressourcenpacks von DoktorSam herunter und legt sie in die ausgewählte Instanz.",
    warning: "Das sind Ressourcenpacks — sie müssen im Spiel unter Optionen → Ressourcenpakete noch aktiviert werden.",
    credits: "Credits: DoktorSam",
    items: ["Mace PvP Perfected", "Low Food", "No Wind Charge Particles", "Better Wind Charge Particles"],
    blocked: "Currently not available",
  },
};

// ---------------------------------------------------------------- Hinweis

let toastTimer = null;

function toast(text) {
  const box = $("demo-toast");
  box.textContent = text;
  box.classList.add("shown");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => box.classList.remove("shown"), 2600);
}

// ---------------------------------------------------------------- Aufbau

function buildInstances() {
  const host = $("demo-instances");
  INSTANCES.forEach((inst) => {
    const card = document.createElement("div");
    card.className = "instance-card" + (inst.running ? " game-running" : "");
    card.innerHTML = `
      <div class="instance-main">
        <div class="instance-orb"></div>
        <div>
          <div class="instance-name"></div>
          <div class="instance-meta">
            <span class="tag"></span><span class="tag"></span><span class="tag"></span>
          </div>
          <div class="instance-path"></div>
        </div>
      </div>
      <div class="instance-actions"></div>`;

    // textContent, nicht innerHTML: der Unterschied kostet hier nichts und
    // spart die Frage, ob ein Name jemals von woanders kommen koennte.
    card.querySelector(".instance-name").textContent = inst.name;
    const tags = card.querySelectorAll(".tag");
    tags[0].textContent = inst.mc;
    tags[1].textContent = inst.loader;
    tags[2].textContent = inst.ram + " MB";
    card.querySelector(".instance-path").textContent = inst.path;

    const actions = card.querySelector(".instance-actions");
    [["Spielen", "btn primary small"], ["Mod aktualisieren", "btn secondary small"],
     ["Löschen", "btn danger small"]].forEach(([label, cls]) => {
      const b = document.createElement("button");
      b.className = cls;
      b.textContent = label;
      b.addEventListener("click", () => toast("Das macht der echte Launcher — hier nicht."));
      actions.appendChild(b);
    });

    host.appendChild(card);
  });
}

function buildMods() {
  const host = $("demo-mods");
  host.replaceChildren();
  MODS.forEach((mod) => {
    const card = document.createElement("div");
    card.className = "mod-card";
    card.innerHTML = `
      <div class="mod-icon"></div>
      <div class="mod-body">
        <div class="mod-title"></div>
        <div class="mod-desc"></div>
        <div class="mod-meta"></div>
      </div>
      <div class="mod-actions"></div>`;
    card.querySelector(".mod-title").textContent = mod.title;
    card.querySelector(".mod-desc").textContent = mod.desc;
    const meta = card.querySelector(".mod-meta");
    mod.tags.forEach((t) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = t;
      meta.appendChild(tag);
    });
    const install = document.createElement("button");
    install.className = "btn primary small";
    install.textContent = "Installieren";
    install.addEventListener("click", () => toast("Installiert wird nur im echten Launcher."));
    card.querySelector(".mod-actions").appendChild(install);
    host.appendChild(card);
  });
}

function buildBackups() {
  const host = $("demo-backups");
  BACKUPS.forEach((entry) => {
    const card = document.createElement("div");
    card.className = "mod-card";
    card.innerHTML = `<div class="mod-body"><div class="mod-title"></div><div class="mod-desc"></div></div>`;
    card.querySelector(".mod-title").textContent = entry.title;
    card.querySelector(".mod-desc").textContent = entry.desc;
    host.appendChild(card);
  });
}

function buildChips() {
  const host = $("demo-chips");
  CATEGORIES.forEach((name, index) => {
    const chip = document.createElement("button");
    chip.className = "chip" + (index === 0 ? " active" : "");
    chip.textContent = name;
    chip.addEventListener("click", () => {
      host.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
    });
    host.appendChild(chip);
  });
}

// ---------------------------------------------------------------- Navigation

function moveNavMark() {
  const nav = document.querySelector(".sidebar nav");
  const active = nav?.querySelector(".nav-item.active");
  if (!nav || !active) return;
  const top = active.offsetTop + (active.offsetHeight - 16) / 2;
  nav.style.setProperty("--nav-mark", top + "px");
  nav.style.setProperty("--nav-mark-shown", "1");
}

function showView(name) {
  document.querySelectorAll(".nav-item").forEach((b) =>
    b.classList.toggle("active", b.dataset.view === name));
  document.querySelectorAll(".view").forEach((v) =>
    v.classList.toggle("active", v.id === "view-" + name));
  moveNavMark();

  // Dieselbe gestaffelte Ankunft wie im Launcher, damit ein Ansichtswechsel
  // sich hier so anfuehlt wie dort.
  const target = $("view-" + name);
  const items = target.querySelectorAll(".instance-card, .mod-card, .account-row, .set-row");
  items.forEach((el, i) => {
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = `demo-in 320ms cubic-bezier(0.16,1,0.3,1) ${Math.min(i, 10) * 35}ms both`;
  });
}

// ---------------------------------------------------------------- Pakete

let openBundle = null;

function openBundleModal(id) {
  const bundle = BUNDLES[id];
  if (!bundle) return;
  openBundle = id;

  $("bundle-title").textContent = bundle.title;
  $("bundle-text").textContent = bundle.text;
  $("bundle-credits").textContent = bundle.credits;

  const warning = $("bundle-warning");
  warning.textContent = bundle.warning || "";
  warning.classList.toggle("hidden", !bundle.warning);

  const status = $("bundle-status");
  status.textContent = bundle.blocked || "";
  status.className = "status-line" + (bundle.blocked ? " warn" : "");

  const locked = Boolean(bundle.blocked);
  $("bundle-instance-field").classList.toggle("hidden", locked);
  $("btn-bundle-install").disabled = locked;

  const select = $("bundle-instance");
  select.replaceChildren();
  INSTANCES.forEach((inst) => {
    const opt = document.createElement("option");
    opt.textContent = `${inst.name} — ${inst.mc} (${inst.loader})`;
    select.appendChild(opt);
  });

  const list = $("bundle-list");
  list.replaceChildren();
  bundle.items.forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name;
    list.appendChild(li);
  });

  $("bundle-backdrop").classList.remove("hidden");
}

function closeBundleModal() {
  $("bundle-backdrop").classList.add("hidden");
  openBundle = null;
}

/*
 * Das Ergebnis wird gespielt, nicht erfunden.
 *
 * Gezeigt wird genau das, was der Launcher auf einer 26.2-Fabric-Instanz
 * ausgeben wuerde - gruen fuer installiert. Was hier nicht passiert, ist das
 * Herunterladen; der Satz darunter sagt das auch, damit niemand nachsieht, wo
 * die Dateien geblieben sind.
 */
function playInstall() {
  const bundle = BUNDLES[openBundle];
  if (!bundle || bundle.blocked) return;

  const list = $("bundle-list");
  const rows = [...list.children];
  $("btn-bundle-install").disabled = true;
  $("bundle-status").textContent = "Installiere …";
  $("bundle-status").className = "status-line";

  rows.forEach((row, i) => {
    setTimeout(() => {
      row.className = "bundle-installed";
      if (i === rows.length - 1) {
        $("bundle-status").textContent =
          "In der Demo wird nichts heruntergeladen — im Launcher liegen die Dateien jetzt in der Instanz.";
        $("bundle-status").className = "status-line done";
        $("btn-bundle-install").disabled = false;
      }
    }, 420 * (i + 1));
  });
}

// ---------------------------------------------------------------- Start

function start() {
  buildInstances();
  buildMods();
  buildBackups();
  buildChips();
  moveNavMark();
  window.addEventListener("load", moveNavMark);

  document.querySelectorAll(".nav-item").forEach((b) =>
    b.addEventListener("click", () => showView(b.dataset.view)));

  document.querySelectorAll(".nav-extra").forEach((b) =>
    b.addEventListener("click", () => openBundleModal(b.dataset.bundle)));

  $("btn-bundle-cancel").addEventListener("click", closeBundleModal);
  $("btn-bundle-install").addEventListener("click", playInstall);
  $("bundle-backdrop").addEventListener("click", (e) => {
    if (e.target === $("bundle-backdrop")) closeBundleModal();
  });

  // Die Gruppen, die im Launcher genau eine Wahl haben.
  document.querySelectorAll(".tab-row, .type-row").forEach((group) => {
    group.querySelectorAll("button").forEach((b) =>
      b.addEventListener("click", () => {
        group.querySelectorAll("button").forEach((o) => o.classList.remove("active"));
        b.classList.add("active");
      }));
  });

  const ram = $("demo-ram");
  ram.addEventListener("input", () => {
    $("demo-ram-value").textContent = ram.value + " MB";
  });

  $("demo-search-btn").addEventListener("click", () => toast("Gesucht wird im echten Launcher."));

  document.querySelectorAll("[data-toast]").forEach((el) =>
    el.addEventListener("click", () => toast(el.dataset.toast)));
}

start();
