const opties = document.querySelectorAll(".diner-optie");
const resultaat = document.getElementById("resultaat");
const resultaatTitel = document.getElementById("resultaat-titel");
const resultaatTekst = document.getElementById("resultaat-tekst");
const resultaatAfbeelding = document.getElementById("resultaat-afbeelding");

const afbeeldingA = "ja.jpeg";
const afbeeldingB = "nee.jpeg";
const debugActief = true;

function debugLog(bericht) {
  if (!debugActief) {
    return;
  }

  console.log(`[diner-debug] ${bericht}`);

  let debugBox = document.getElementById("debug-log");
  if (!debugBox) {
    debugBox = document.createElement("div");
    debugBox.id = "debug-log";
    debugBox.style.position = "fixed";
    debugBox.style.left = "10px";
    debugBox.style.right = "10px";
    debugBox.style.bottom = "10px";
    debugBox.style.maxHeight = "35vh";
    debugBox.style.overflow = "auto";
    debugBox.style.padding = "10px";
    debugBox.style.borderRadius = "10px";
    debugBox.style.background = "rgba(15, 23, 42, 0.9)";
    debugBox.style.color = "#e2e8f0";
    debugBox.style.font = "12px/1.4 monospace";
    debugBox.style.zIndex = "9999";
    document.body.appendChild(debugBox);
  }

  const regel = document.createElement("div");
  regel.textContent = `${new Date().toLocaleTimeString()} - ${bericht}`;
  debugBox.appendChild(regel);
  debugBox.scrollTop = debugBox.scrollHeight;
}

function speelAfbeeldingAnimatie(isGoedeKeuze) {
  resultaatAfbeelding.classList.remove("animate-good", "animate-bad");
  void resultaatAfbeelding.offsetWidth;
  resultaatAfbeelding.classList.add(isGoedeKeuze ? "animate-good" : "animate-bad");
}

function scrollNaarResultaatOpMobiel() {
  const isMobiel =
    window.matchMedia("(max-width: 900px)").matches ||
    window.matchMedia("(pointer: coarse)").matches;

  debugLog(`isMobiel=${isMobiel}, innerWidth=${window.innerWidth}, scrollY=${Math.round(window.scrollY)}`);

  if (!isMobiel) {
    debugLog("Stop: niet mobiel, geen auto-scroll.");
    return;
  }

  const scrollGedrag = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";

  const scrollNaarAfbeelding = () => {
    const yPos = window.scrollY + resultaatAfbeelding.getBoundingClientRect().top - 16;
    debugLog(`Scroll naar y=${Math.round(yPos)} (gedrag=${scrollGedrag})`);
    window.scrollTo({
      top: Math.max(0, yPos),
      behavior: scrollGedrag
    });
    setTimeout(() => {
      debugLog(`Na scroll: scrollY=${Math.round(window.scrollY)}`);
    }, 220);
  };

  // Scroll pas wanneer de afbeelding echt gerenderd is.
  if (resultaatAfbeelding.complete && resultaatAfbeelding.naturalHeight > 0) {
    debugLog("Afbeelding is al geladen, direct scrollen.");
    requestAnimationFrame(scrollNaarAfbeelding);
    setTimeout(scrollNaarAfbeelding, 250);
    return;
  }

  const onLoad = () => {
    debugLog("load-event ontvangen op resultaatAfbeelding.");
    scrollNaarAfbeelding();
    resultaatAfbeelding.removeEventListener("load", onLoad);
  };

  debugLog("Wachten op load-event van resultaatAfbeelding...");
  resultaatAfbeelding.addEventListener("load", onLoad);
  setTimeout(() => {
    resultaatAfbeelding.removeEventListener("load", onLoad);
    debugLog("Timeout fallback: forceer scroll.");
    scrollNaarAfbeelding();
  }, 400);
}

function toonResultaat(type, gekozenTekst) {
  resultaat.classList.remove("hidden", "good", "bad");

  if (type === "goed") {
    resultaat.classList.add("good");
    resultaatTitel.textContent = "Yeya!";
    resultaatAfbeelding.src = afbeeldingA;
    resultaatAfbeelding.alt = "Afbeelding A voor een goede keuze";
    speelAfbeeldingAnimatie(true);
    scrollNaarResultaatOpMobiel();
    return;
  }

  resultaat.classList.add("bad");
  resultaatTitel.textContent = "Failure!";
  resultaatAfbeelding.src = afbeeldingB;
  resultaatAfbeelding.alt = "Afbeelding B voor een slechte keuze";
  speelAfbeeldingAnimatie(false);
  scrollNaarResultaatOpMobiel();
}

opties.forEach((optie) => {
  optie.addEventListener("click", () => {
    opties.forEach((item) => item.classList.remove("is-selected"));
    optie.classList.add("is-selected");

    const type = optie.dataset.type;
    const gekozenTekst = optie.querySelector(".optie-title")?.textContent || "Onbekende keuze";
    toonResultaat(type, gekozenTekst);
  });
});
