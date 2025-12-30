// --- Elements ---
const inputText = document.querySelector("#input-text");
const outputText = document.querySelector("#output-text");
const inputChars = document.querySelector("#input-chars");
const inputLangSelect = document.querySelector("#input-language .selected");
const outputLangSelect = document.querySelector("#output-language .selected");
const dropdowns = document.querySelectorAll(".dropdown-container");
const swapBtn = document.querySelector(".swap-position");
const darkModeCheckbox = document.getElementById("dark-mode-btn");
const speakInputBtn = document.getElementById("speak-input");
const speakOutputBtn = document.getElementById("speak-output");

// --- Populate dropdowns ---
function populateDropdown(dropdown, options) {
  const menu = dropdown.querySelector("ul");
  menu.innerHTML = "";
  options.forEach(opt => {
    const li = document.createElement("li");
    li.textContent = `${opt.name} (${opt.native})`;
    li.dataset.value = opt.code;
    li.classList.add("option");
    menu.appendChild(li);

    // Select language when clicked
    li.addEventListener("click", () => {
      menu.querySelectorAll(".option").forEach(o => o.classList.remove("active"));
      li.classList.add("active");
      dropdown.querySelector(".selected").textContent = li.textContent;
      dropdown.querySelector(".selected").dataset.value = li.dataset.value;
      translate();
    });
  });
}

populateDropdown(document.querySelector("#input-language"), languages);
populateDropdown(document.querySelector("#output-language"), languages);

// --- Dropdown toggle ---
dropdowns.forEach(drop => {
  drop.addEventListener("click", () => drop.classList.toggle("active"));
});
document.addEventListener("click", e => {
  dropdowns.forEach(drop => { if (!drop.contains(e.target)) drop.classList.remove("active"); });
});

// --- Swap languages and texts ---
swapBtn.addEventListener("click", () => {
  [inputLangSelect.textContent, outputLangSelect.textContent] = [outputLangSelect.textContent, inputLangSelect.textContent];
  [inputLangSelect.dataset.value, outputLangSelect.dataset.value] = [outputLangSelect.dataset.value, inputLangSelect.dataset.value];
  [inputText.value, outputText.value] = [outputText.value, inputText.value];
  translate();
});

// --- Translate function using Google Translate API ---
function translate() {
  const text = inputText.value;
  if (!text) { outputText.value = ""; return; }

  const sl = inputLangSelect.dataset.value;
  const tl = outputLangSelect.dataset.value;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => { outputText.value = data[0].map(i => i[0]).join(""); })
    .catch(err => console.error(err));
}

// --- Input character limit and live translate ---
inputText.addEventListener("input", () => {
  if (inputText.value.length > 5000) inputText.value = inputText.value.slice(0, 5000);
  inputChars.textContent = inputText.value.length;
  translate();
});

// --- Dark mode toggle ---
darkModeCheckbox.addEventListener("change", () => document.body.classList.toggle("dark"));

// --- Speech function ---
function speak(text, lang) {
  if (!text) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  speechSynthesis.speak(utter);
}

// --- Speak buttons ---
speakInputBtn.addEventListener("click", () => {
  const lang = inputLangSelect.dataset.value === "auto" ? "en" : inputLangSelect.dataset.value;
  speak(inputText.value, lang);
});
speakOutputBtn.addEventListener("click", () => speak(outputText.value, outputLangSelect.dataset.value));
