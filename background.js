var DEFAULT_LIST_URL = 'https://cdn.jsdelivr.net/gh/nileshtrivedi/better/defaultlist.json'
var BETTER_ALTERNATIVES = [];

chrome.runtime.onInstalled.addListener(function() {
  console.log('onInstalled....');
  onStartup();
});

// fetch and save data when chrome restarted
chrome.runtime.onStartup.addListener(() => {
  console.log('onStartup....');
  onStartup();
});


function onStartup(){
    chrome.storage.sync.get(['betterSourceURL'], function(result) {
        console.log('Value currently is ' + (result.betterSourceURL || DEFAULT_LIST_URL));

        fetch((result.betterSourceURL || DEFAULT_LIST_URL))
        .then(response => response.json())
        .then(data => {
            console.log("Got data: ", data);
            BETTER_ALTERNATIVES = data;
            chrome.storage.local.set({betterSourceData: data}, function() {
              console.log('Set betterSource = ' + data);
            })
        });
    });
}

function getMatch(url){
  var match = BETTER_ALTERNATIVES.find(pattern => url.match(new RegExp(pattern[0])));
  if(match)
      return match[1];
  else return null;
}

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  switch (msg.type) {
      case 'getMatch':
          response(getMatch(msg.url));
          break;
      case 'reloadList':
          onStartup();
          break;
      default:
          response('unknown request');
          break;
  }
});