/*
 * Space Client — Rangverwaltung.
 *
 * Schreibt badges.json im Mod-Repository über GitHub. Es gibt keinen Server
 * dazwischen: diese Seite ist eine statische Datei, und alles, was sie tut,
 * tut sie mit dem Token des Menschen, der sie geöffnet hat.
 *
 * Deshalb liegt die ganze Sicherheit bei GitHub, und das ist Absicht. Eine
 * Seite, die selbst entscheidet, wer hinein darf, müsste dafür ein Geheimnis
 * kennen - und ein Geheimnis in einer Datei, die jeder herunterladen kann, ist
 * keins. Ohne gültigen Token lehnt GitHub jeden Schreibversuch ab; mit einem
 * gültigen ist es dasselbe, als hätte man die Datei von Hand bearbeitet.
 *
 * Der Token wird nur an api.github.com geschickt. Dass er nirgendwo anders
 * hingehen kann, steht nicht in diesem Kommentar, sondern in der
 * Content-Security-Policy der HTML-Datei - eine Zusage, die der Browser
 * durchsetzt und nicht ich.
 */

const OWNER = "Finanzinstitut";
const REPO = "Space-Client-Mod";
const PATH = "src/main/resources/assets/spaceclient/badges.json";
const BRANCH = "main";

const RANKS = ["owner", "dev", "vip", "standard"];
const RANK_LABEL = { owner: "Owner", dev: "Dev", vip: "VIP", standard: "Standard" };

const STORE_KEY = "sc-badges-token";

/** Was gerade auf dem Bildschirm steht. */
let entries = [];

/** Der Stand der Datei, gegen den wir schreiben. Ohne ihn kein Speichern. */
let sha = null;

let token = "";

const $ = (id) => document.getElementById(id);

// ---------------------------------------------------------------- Zugang

function loadStoredToken() {
  try {
    return localStorage.getItem(STORE_KEY) || "";
  } catch (e) {
    // Privater Modus oder blockierte Site-Daten: dann eben jedes Mal eintippen.
    return "";
  }
}

function storeToken(value, remember) {
  try {
    if (remember && value) localStorage.setItem(STORE_KEY, value);
    else localStorage.removeItem(STORE_KEY);
  } catch (e) {
    // Nicht speichern zu können ist kein Fehler, der die Seite aufhält.
  }
}

function signOut() {
  token = "";
  storeToken("", false);
  $("token").value = "";
  $("editor").classList.add("hidden");
  $("gate").classList.remove("hidden");
  $("signout").classList.add("hidden");
  note("");
}

// ---------------------------------------------------------------- GitHub

async function api(path, options) {
  const response = await fetch("https://api.github.com" + path, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "Bearer " + token,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options && options.headers),
    },
  });

  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json();
      detail = body && body.message ? body.message : "";
    } catch (e) {
      // Antwort ohne JSON - der Status allein muss reichen
    }
    const error = new Error(detail || ("HTTP " + response.status));
    error.status = response.status;
    throw error;
  }
  return response.json();
}

/*
 * Base64 mit Umlauten.
 *
 * btoa arbeitet byteweise und wirft bei allem über U+00FF. Ein Minecraft-Name
 * kann das nicht enthalten, der Kommentarblock in der Datei aber schon - und
 * eine Datei, die sich nach dem ersten Speichern nicht mehr lesen lässt, wäre
 * ein teurer Weg, das herauszufinden.
 */
function toBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(encoded) {
  const binary = atob(encoded.replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function load() {
  status("Lade …");
  // Ein wechselnder Parameter, damit keine Zwischenschicht eine alte Fassung
  // ausliefert - dieselbe Vorsichtsmassnahme, die der Client selbst trifft.
  const file = await api(
    `/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${BRANCH}&t=${Date.now()}`
  );

  sha = file.sha;
  const parsed = JSON.parse(fromBase64(file.content));
  entries = Array.isArray(parsed.badges) ? parsed.badges : [];
  keptComment = parsed._comment || null;

  render();
  status("Geladen.");
}

/** Der Erklärblock der Datei. Wird unverändert zurückgeschrieben. */
let keptComment = null;

async function save() {
  const payload = {};
  if (keptComment) payload._comment = keptComment;
  payload.badges = entries;

  const body = JSON.stringify(payload, null, 2) + "\n";

  status("Speichere …");
  try {
    const result = await api(`/repos/${OWNER}/${REPO}/contents/${PATH}`, {
      method: "PUT",
      body: JSON.stringify({
        message: "Ränge aktualisiert",
        content: toBase64(body),
        sha,
        branch: BRANCH,
      }),
    });
    sha = result.content.sha;
    status("Gespeichert. Im Spiel in spätestens 30 Sekunden.", "good");
  } catch (error) {
    if (error.status === 409) {
      // Die Datei hat sich geändert, seit wir sie gelesen haben. Blind
      // drüberschreiben würde die andere Änderung still verschlucken.
      status("Die Datei wurde zwischenzeitlich geändert. Bitte neu laden.", "bad");
      return;
    }
    status(readableError(error), "bad");
  }
}

function readableError(error) {
  if (error.status === 401) return "Token ungültig oder abgelaufen.";
  if (error.status === 403) return "Token darf diese Datei nicht schreiben — fehlt „Contents: Read and write“?";
  if (error.status === 404) return "Repository oder Datei nicht erreichbar — ist das Repo im Token ausgewählt?";
  return error.message || "Unbekannter Fehler.";
}

// ---------------------------------------------------------------- Namen

/*
 * Name zu UUID.
 *
 * Die Datei selbst sagt, warum: einen Namen kann jeder ändern, eine UUID
 * niemand. Klappt der Abruf nicht - Mojang antwortet nicht, oder der Browser
 * lässt die Anfrage nicht zu - wird der Eintrag trotzdem angelegt, dann eben
 * nur mit dem Namen. Das ist die bequeme Form, nicht die sichere, und die
 * Seite sagt das auch.
 */
async function lookupUuid(name) {
  try {
    const response = await fetch(
      "https://api.mojang.com/users/profiles/minecraft/" + encodeURIComponent(name)
    );
    if (!response.ok) return null;
    const profile = await response.json();
    if (!profile || !profile.id) return null;
    return profile.id.replace(
      /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
      "$1-$2-$3-$4-$5"
    );
  } catch (e) {
    return null;
  }
}

// ---------------------------------------------------------------- Anzeige

function render() {
  const host = $("rows");
  host.replaceChildren();

  entries.forEach((entry, index) => {
    const row = document.createElement("div");
    row.className = "row-item";

    const who = document.createElement("div");
    who.className = "who";

    const name = document.createElement("div");
    name.className = "name";
    // textContent, nicht innerHTML: hier steht, was jemand einmal eingetippt
    // hat, und das wird angezeigt, nicht ausgeführt.
    name.textContent = entry.name || "(ohne Namen)";
    who.appendChild(name);

    const id = document.createElement("div");
    id.className = "uuid";
    id.textContent = entry.uuid || "nur über den Namen erkannt";
    if (!entry.uuid) id.classList.add("weak");
    who.appendChild(id);

    const rank = document.createElement("select");
    rank.className = "rank";
    for (const value of RANKS) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = RANK_LABEL[value];
      if ((entry.rank || "standard") === value) option.selected = true;
      rank.appendChild(option);
    }
    rank.addEventListener("change", () => {
      entries[index].rank = rank.value;
      status("Nicht gespeichert.");
    });

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "btn ghost small";
    remove.textContent = "Entfernen";
    remove.addEventListener("click", () => {
      entries.splice(index, 1);
      render();
      status("Nicht gespeichert.");
    });

    row.append(who, rank, remove);
    host.appendChild(row);
  });

  $("count").textContent = entries.length === 1 ? "1 Eintrag" : entries.length + " Einträge";
  $("empty").classList.toggle("hidden", entries.length > 0);
}

function status(text, kind) {
  const el = $("status");
  el.textContent = text || "";
  el.className = "status" + (kind ? " " + kind : "");
}

function note(text, kind) {
  const el = $("gate-note");
  el.textContent = text || "";
  el.className = "note" + (kind ? " " + kind : "");
}

// ---------------------------------------------------------------- Ablauf

async function connect() {
  token = $("token").value.trim();
  if (!token) {
    note("Bitte einen Token eintragen.", "bad");
    return;
  }

  note("Prüfe …");
  try {
    await load();
  } catch (error) {
    token = "";
    note(readableError(error), "bad");
    return;
  }

  storeToken($("token").value.trim(), $("remember").checked);
  $("gate").classList.add("hidden");
  $("editor").classList.remove("hidden");
  $("signout").classList.remove("hidden");
  note("");
}

async function addEntry() {
  const name = $("new-name").value.trim();
  if (!name) return;

  const rank = $("new-rank").value;

  const already = entries.findIndex(
    (e) => (e.name || "").toLowerCase() === name.toLowerCase()
  );
  if (already >= 0) {
    entries[already].rank = rank;
    render();
    status("Stand schon auf der Liste — Rang geändert.");
    $("new-name").value = "";
    return;
  }

  status("Suche die UUID …");
  const uuid = await lookupUuid(name);

  const entry = { name };
  if (uuid) entry.uuid = uuid;
  entry.rank = rank;
  entries.push(entry);

  render();
  $("new-name").value = "";
  status(
    uuid
      ? "Hinzugefügt. Noch nicht gespeichert."
      : "Hinzugefügt, aber ohne UUID — wird über den Namen erkannt. Noch nicht gespeichert."
  );
}

function start() {
  $("connect").addEventListener("click", connect);
  $("signout").addEventListener("click", signOut);
  $("add").addEventListener("click", addEntry);
  $("save").addEventListener("click", save);
  $("reload").addEventListener("click", () => {
    load().catch((error) => status(readableError(error), "bad"));
  });

  $("token").addEventListener("keydown", (event) => {
    if (event.key === "Enter") connect();
  });
  $("new-name").addEventListener("keydown", (event) => {
    if (event.key === "Enter") addEntry();
  });

  const stored = loadStoredToken();
  if (stored) {
    $("token").value = stored;
    connect();
  }
}

start();
