/*
 * Language switch.
 *
 * English is what the page ships as, so the markup itself is English and the
 * dictionary only holds German. That keeps the page readable for a visitor
 * whose browser blocks scripts, and means a missing key falls back to real
 * text rather than to an empty element.
 */
(function () {
  var DE = {
    nav_modules: "Module", nav_launcher: "Launcher", nav_music: "Musik",
    nav_cosmetics: "Cosmetics", nav_download: "Herunterladen",

    hero_h1a: "Ein Client, der",
    hero_h1b: "aus dem Weg geht.",
    hero_lede: "Space Client bringt 24 HUD-Module, einen Launcher mit mehreren Konten und Cosmetics über Cosmetica zusammen. Quelloffen und kostenlos.",
    hero_dl: "Launcher herunterladen",
    hero_source: "Quellcode ansehen",

    con_title: "Live-Konsole — cozy-and-pvp 26.2",
    con_state: "läuft",

    eb_ingame: "Im Spiel",
    mod_h2: "24 Module, einzeln schaltbar",
    mod_lede: "Rechte Umschalttaste öffnet das Menü. Jedes Modul lässt sich einzeln einschalten, einstellen und im HUD frei platzieren.",
    cat_combat: "Kampf & Eingabe",
    cat_visual: "Sicht & Werkzeuge",

    m0: "FPS", m1: "CPS", m2: "Ping", m3: "TPS", m4: "Uhr", m5: "Koordinaten",
    m6: "Kompass", m7: "Tempo", m8: "Sitzung", m9: "Strecke",
    m10: "Arbeitsspeicher", m11: "Serverinfo",
    m12: "Tastenanzeige", m13: "Hitboxen", m14: "Trefferfarbe",
    m15: "Fadenkreuz-Info", m16: "Eingaberate", m17: "Mausweg",
    m18: "Zoom", m19: "Chunk-Grenzen", m20: "Wehende Capes",
    m21: "Blickachse sperren", m22: "Koordinaten kopieren", m23: "Now Playing",

    eb_desktop: "Auf dem Desktop",
    lau_h2: "Der Launcher",
    lau_lede: "Instanzen anlegen, Mods finden, Konten wechseln — ohne den Browser zu öffnen.",
    l1: "<b>Mehrere Konten</b> über Microsoft-Anmeldung, Wechsel ohne Neustart.",
    l2: "<b>Modrinth eingebaut</b> — suchen, installieren, Abhängigkeiten kommen mit.",
    l3: "<b>Modpacks importieren</b> aus <code>.mrpack</code>-Dateien.",
    l4: "<b>Jede Java-Version</b> und jeder Mod-Loader, pro Instanz einstellbar.",
    l5: "<b>Live-Konsole</b> für jede laufende Instanz, direkt aus der Liste.",
    l6: "<b>Cosmetica vorinstallieren</b> beim Anlegen einer Instanz, ein Haken genügt.",
    shot_inst: "Instanzen", shot_acc: "Konto", shot_set: "Einstellungen",
    shot_run: "Läuft (1)", shot_new: "+ Neue Instanz",

    eb_music: "Musik",
    np_h2: "Now Playing",
    np_lede: "Space Client liest den Titel aus deiner Spotify- oder Amazon-Music-App und zeigt ihn im HUD an, mit Steuerung, solange der Chat offen ist.",
    np1: "<b>Im HUD</b> — Titel, Künstler und aus welcher App er kommt.",
    np2: "<b>Über deinem Namen</b> — andere Space-Client-Spieler sehen über deinem Namensschild, was du hörst. Standardmäßig aus.",
    np3: "<b>Lyrics über deinem Namen</b> — die aktuelle Zeile statt des Titels, für alle, die es einschalten.",
    np_warn: "Songtexte sind urheberrechtlich geschützt, und ob du sie anzeigen darfst, hängt vom Lied und von deinem Land ab. Die Einstellung ist standardmäßig aus, die Nutzung liegt in deiner Verantwortung.",

    eb_looks: "Aussehen",
    cos_h2: "Cosmetics über Cosmetica",
    cos_lede_a: "Capes, Flügel, Bandanas und Hörner kommen von",
    cos_lede_b: ", erreichbar direkt aus dem Space-Client-Menü. Sie hängen an deinem Cosmetica-Konto und begleiten dich auf jeden Server.",
    cos_note: "Cosmetica ist ein eigenständiges Projekt unter der Apache-2.0-Lizenz von Isaiah Meek und Mekal Covic. Space Client zeigt seine Inhalte an und beansprucht sie nicht als eigene.",

    eb_start: "Loslegen",
    dl_h2: "Herunterladen",
    dl_lau_p: "Windows-Installer. Holt Minecraft, Fabric und den Client-Mod selbst.",
    dl_win: "Für Windows",
    dl_fp1: "Neueste Version auf GitHub Releases",
    dl_mod: "Nur der Mod",
    dl_mod_p: "Für alle, die schon einen Launcher haben. In den <code>mods</code>-Ordner legen.",
    dl_jar: "JAR herunterladen",
    dl_fp2: "Braucht Fabric Loader und Fabric API für 26.2",
    rq_loader: "Loader", rq_java_v: "25 oder neuer",
    rq_acc: "Konto", rq_acc_v: "Microsoft, Java Edition gekauft",

    foot_note: "Kein offizielles Minecraft-Produkt. Nicht von Mojang oder Microsoft genehmigt oder mit ihnen verbunden."
  };

  // The console is prose too, so it belongs with the rest of the wording
  // rather than hardcoded in the markup - that is exactly how it ended up
  // reading German on an English page.
  var CONSOLE = {
    en: [
      "[Launcher] Preparing instance cozy-and-pvp",
      "[Launcher] Fabric Loader 0.19.3 for 26.2",
      "[Launcher] 14 mods checked, all up to date",
      "[Launcher] Signed in as Finanzinstitut",
      "[Client]   Space Client v0.1.0 loaded",
      "[Client]   24 modules ready — Right Shift opens the menu",
      "[Client]   Cosmetica found, cosmetics active",
      "[Launcher] Game started"
    ],
    de: [
      "[Launcher] Instanz cozy-and-pvp wird vorbereitet",
      "[Launcher] Fabric Loader 0.19.3 fuer 26.2",
      "[Launcher] 14 Mods geprueft, alle aktuell",
      "[Launcher] Angemeldet als Finanzinstitut",
      "[Client]   Space Client v0.1.0 geladen",
      "[Client]   24 Module bereit — Rechte Umschalttaste oeffnet das Menue",
      "[Client]   Cosmetica gefunden, Cosmetics aktiv",
      "[Launcher] Spiel gestartet"
    ]
  };

  var out = document.getElementById("console-out");
  var typingRun = 0;

  function playConsole(lang) {
    if (!out) return;
    var lines = CONSOLE[lang] || CONSOLE.en;

    // Each run gets a ticket. A run whose ticket is stale stops writing, so
    // switching language mid-type cannot leave two typers fighting over the
    // same element.
    var run = ++typingRun;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      out.textContent = lines.join("\n");
      return;
    }

    var line = 0, chr = 0;
    out.textContent = "";

    function step() {
      if (run !== typingRun || line >= lines.length) return;
      out.textContent = lines.slice(0, line).join("\n")
        + (line ? "\n" : "")
        + lines[line].slice(0, chr);
      chr++;
      if (chr > lines[line].length) { line++; chr = 0; setTimeout(step, 260); }
      else setTimeout(step, 12);
    }
    setTimeout(step, 400);
  }

  var buttons = document.querySelectorAll(".lang-btn");

  // The English original is kept per element, so switching back needs no
  // second dictionary and cannot drift out of step with the markup.
  document.querySelectorAll("[data-i18n], [data-i18n-html]").forEach(function (el) {
    el.dataset.en = el.innerHTML;
  });

  function apply(lang) {
    document.querySelectorAll("[data-i18n], [data-i18n-html]").forEach(function (el) {
      var key = el.dataset.i18n || el.dataset.i18nHtml;
      if (lang === "de" && DE[key]) el.innerHTML = DE[key];
      else el.innerHTML = el.dataset.en;
    });
    document.documentElement.lang = lang;
    playConsole(lang);
    buttons.forEach(function (b) {
      b.classList.toggle("is-on", b.dataset.lang === lang);
    });
    try { localStorage.setItem("sc-lang", lang); } catch (e) {}
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () { apply(b.dataset.lang); });
  });

  // A returning visitor keeps their choice; a new one gets English, as shipped.
  var saved = null;
  try { saved = localStorage.getItem("sc-lang"); } catch (e) {}
  apply(saved === "de" ? "de" : "en");
})();
