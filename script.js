const opties = document.querySelectorAll(".diner-optie");
const resultaat = document.getElementById("resultaat");
const resultaatTitel = document.getElementById("resultaat-titel");
const resultaatTekst = document.getElementById("resultaat-tekst");
const resultaatAfbeelding = document.getElementById("resultaat-afbeelding");

const afbeeldingA = "ja.jpeg";
const afbeeldingB = "nee.jpeg";

function speelAfbeeldingAnimatie(isGoedeKeuze) {
  resultaatAfbeelding.classList.remove("animate-good", "animate-bad");
  void resultaatAfbeelding.offsetWidth;
  resultaatAfbeelding.classList.add(isGoedeKeuze ? "animate-good" : "animate-bad");
}

function scrollNaarResultaatOpMobiel() {
  if (!window.matchMedia("(max-width: 768px)").matches) {
    return;
  }

  resultaat.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
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
