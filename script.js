const dropdowns = document.querySelectorAll(".dropdown-container"),
  inputLanguageDropdown = document.querySelector("#input-language"),
  outputLanguageDropdown = document.querySelector("#output-language");

function populateDropdown(dropdown, options) {
  dropdown.querySelector("ul").innerHTML = "";
  options.forEach((option) => {
    const li = document.createElement("li");
    li.innerHTML = `${option.name} (${option.native})`;
    li.dataset.value = option.code;
    li.classList.add("option");
    dropdown.querySelector("ul").appendChild(li);
  });
}

populateDropdown(inputLanguageDropdown, languages);
populateDropdown(outputLanguageDropdown, languages);

dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", () => {
    dropdown.classList.toggle("active");
  });

  dropdown.querySelectorAll(".option").forEach((item) => {
    item.addEventListener("click", () => {
      dropdown.querySelectorAll(".option").forEach((opt) =>
        opt.classList.remove("active")
      );
      item.classList.add("active");
      const selected = dropdown.querySelector(".selected");
      selected.innerHTML = item.innerHTML;
      selected.dataset.value = item.dataset.value;
      translate();
    });
  });
});

document.addEventListener("click", (e) => {
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(e.target)) dropdown.classList.remove("active");
  });
});

const swapBtn = document.querySelector(".swap-position"),
  inputLanguage = inputLanguageDropdown.querySelector(".selected"),
  outputLanguage = outputLanguageDropdown.querySelector(".selected"),
  inputTextElem = document.querySelector("#input-text"),
  outputTextElem = document.querySelector("#output-text");

swapBtn.addEventListener("click", () => {
  const temp = inputLanguage.innerHTML;
  inputLanguage.innerHTML = outputLanguage.innerHTML;
  outputLanguage.innerHTML = temp;

  const tempValue = inputLanguage.dataset.value;
  inputLanguage.dataset.value = outputLanguage.dataset.value;
  outputLanguage.dataset.value = tempValue;

  const tempText = inputTextElem.value;
  inputTextElem.value = outputTextElem.value;
  outputTextElem.value = tempText;

  translate();
});

function translate() {
  const inputText = inputTextElem.value;
  const inputLang = inputLanguageDropdown.querySelector(".selected").dataset.value;
  const outputLang = outputLanguageDropdown.querySelector(".selected").dataset.value;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLang}&tl=${outputLang}&dt=t&q=${encodeURI(inputText)}`;

  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      outputTextElem.value = json[0].map((item) => item[0]).join("");
    })
    .catch((err) => console.log(err));
}

const inputChars = document.querySelector("#input-chars");

inputTextElem.addEventListener("input", () => {
  if (inputTextElem.value.length > 5000) {
    inputTextElem.value = inputTextElem.value.slice(0, 5000);
  }
  inputChars.innerHTML = inputTextElem.value.length;
  translate();
});

const darkModeCheckbox = document.getElementById("dark-mode-btn");
darkModeCheckbox.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});
