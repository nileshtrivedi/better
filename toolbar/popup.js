let currentURL = document.getElementById("currentURL");

chrome.tabs.query(
  {
    active: true,
    currentWindow: true,
  },
  function (tabs) {
    var tabURL = tabs[0].url;
    currentURL.textContent = tabURL;
  }
);

let betterForm = document.getElementById("betterForm");
let betterName = document.getElementById("betterName");
let betterURL = document.getElementById("betterURL");
let betterDescription = document.getElementById("betterDescription");

function encodeQueryData(data) {
  const ret = [];
  for (let d in data)
    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  return ret.join("&");
}

var submitSuggestion = function () {
  const data = {
    title: `Suggestion: ${currentURL.textContent}`,
    body: `${betterURL.value}\n${betterName.value}\n${betterDescription.value}`,
  };
  const queryString = encodeQueryData(data);
  let suggestionUrl = `https://github.com/nileshtrivedi/better/issues/new?${queryString}`;
  chrome.tabs.create({ url: suggestionUrl });
};

betterForm.addEventListener("submit", function (e) {
  e.preventDefault();
  submitSuggestion();
});
