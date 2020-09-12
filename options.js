let DEFAULT_LIST_URL =
  "https://cdn.jsdelivr.net/gh/nileshtrivedi/better/defaultlist.json";
let addSourceButton = document.getElementById("addSourceButton");
let submit = document.getElementById("betterSourceSubmit");
let betterSourceInputContainer = document.getElementById(
  "betterSourceInputContainer"
);

function storePrefs(sourceUrls) {
  sourceUrls = sourceUrls.filter((url) => url != "");
  let prefs = {
    betterSourceUrls: JSON.stringify(sourceUrls),
  };
  chrome.storage.sync.set(prefs, function () {
    console.log("Saved", prefs);
  });
}

function addUrlInput(value) {
  let newInput = document.createElement("input");
  newInput.setAttribute("name", "url[]");
  newInput.setAttribute("type", "url");
  newInput.setAttribute("placeholder", "https://source.com/list.json");
  if (value) {
    newInput.setAttribute("value", value);
  }
  betterSourceInputContainer.appendChild(newInput);
}

addSourceButton.addEventListener("click", function (e) {
  e.preventDefault();
  addUrlInput(null);
});

submit.addEventListener("click", function () {
  let $sourceUrls = document.querySelectorAll("[name='url[]']");
  let sourceUrls = Array.from($sourceUrls).map((elem) => elem.value);
  storePrefs(sourceUrls);

  chrome.runtime.sendMessage({ type: "reloadList" }, (response) => {
    if (response) {
      console.log("BETTER_ALTERNATIVES list is reloaded");
    }
  });
});

chrome.storage.sync.get(["betterSourceUrls"], (result) => {
  // populate input fields from stored sources or show default source
  let betterSourceUrls = [];
  if (result && result.betterSourceUrls) {
    betterSourceUrls = JSON.parse(result.betterSourceUrls);
  }
  if (betterSourceUrls.length === 0) {
    betterSourceUrls = [DEFAULT_LIST_URL];
  }

  betterSourceUrls.map((sourceUrl) => {
    addUrlInput(sourceUrl);
  });
});
