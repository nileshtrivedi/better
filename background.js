var DEFAULT_LIST_URL =
  "https://cdn.jsdelivr.net/gh/nileshtrivedi/better/defaultlist.json";
var BETTER_ALTERNATIVES = [];

chrome.runtime.onInstalled.addListener(function () {
  console.log("onInstalled....");
  onStartup();
});

// fetch and save data when chrome restarted
chrome.runtime.onStartup.addListener(() => {
  console.log("onStartup....");
  onStartup();
});

function fetchAllLists(listUrls) {
  var promises = listUrls.map((listUrl) =>
    fetch(listUrl)
      .then((resp) => resp.json())
      .catch((e) => console.log("List errored out", e))
  );

  Promise.all(promises).then((results) => {
    BETTER_ALTERNATIVES = results;
    chrome.storage.local.set({ betterSourceData: results }, function () {
      console.log("Set betterSource");
    });
  });
}

function onStartup() {
  chrome.storage.sync.get(["betterSourceURL"], function (result) {
    var listUrl = result.betterSourceURL || DEFAULT_LIST_URL;
    // Uncomment this when testing list changes locally
    // listUrl = "/defaultlist.json";
    fetchAllLists([listUrl, "/lists/t1.json", "/lists/t2.json"]);
  });
}

function getMatch(url) {
  var matches = BETTER_ALTERNATIVES.reduce((result, sourceList) => {
    var match = sourceList.find((pattern) =>
      url.match(new RegExp(pattern.urlPattern))
    );
    if (match && match.alternatives) result.push(match);
    return result;
  }, []);

  if (matches.length) {
    var combinedMatch = {
      urlPattern: matches[0].urlPattern,
      alternatives: matches.reduce(
        (result, match) => result.concat(match.alternatives),
        []
      ),
    };
    return combinedMatch;
  }
  return null;
}

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  switch (msg.type) {
    case "getMatch":
      response(getMatch(msg.url));
      break;
    case "reloadList":
      onStartup();
      break;
    default:
      response("unknown request");
      break;
  }
});