// document.body.style.border = "15px solid red";

/*

TODO
 - Fix and test the options UI
 - Test and fix for Chrome, Brave & Firefox

*/
function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

const fillTemplate = function(templateString, templateVars){
    let safeTemplateVars = Object.assign({}, ...Object.keys(templateVars).map(k => ({[k]: escapeHtml(templateVars[k])})));
    return new Function("return `"+templateString +"`;").call(safeTemplateVars);
}

const altTemplate =
  "\
<a href='${this.url}' target='_blank'> \
  <p style='margin: 0; font-size: 14px; font-weight: bold;'>${this.name} &rarr;</p> \
  <p style='margin: 0; font-size: 12px;'>${this.desc}</p> \
</a>";

const CONTAINER_PADDING = "12px";

const CONTAINER_STYLES = `
    .better-ext-container * {
        all: unset;
    }

    .better-ext-container h1,  .better-ext-container p, .better-ext-container div {
        display:block;
    }

    .better-ext-container {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",  Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 20px; 
        line-height:1;
        background-color: #ffcc49; 
        position: fixed; 
        bottom: 10px; 
        right: 10px; 
        width: 300px; 
        box-shadow: 0px 10px 30px #222222; 
        padding: ${CONTAINER_PADDING}; 
        text-align: center; 
        z-index: 20000;
    }

    .better-ext-container .better-ext-alt-container {
        margin-left: -${CONTAINER_PADDING};
        margin-right: -${CONTAINER_PADDING};
        padding: 0 ${CONTAINER_PADDING};
        margin-top: 4px;
        max-height: 300px;
        overflow: scroll;
        background-color: #FEEBC8;
    }

    .better-ext-alt-container>a{
        display: block; 
        border: 2px solid #222222; 
        border-radius: 4px; 
        margin-top: ${CONTAINER_PADDING}; 
        color:#222222; 
        padding: 8px;
    }

    .better-ext-alt-container>a:last-child {
        margin-bottom: ${CONTAINER_PADDING};
    }
`;

function addPagePopupStyles() {
  let styleTag = document.createElement("style");
  styleTag.innerHTML = CONTAINER_STYLES;
  document.head.append(styleTag);
}

function createNonRecommendedAlts(alternatives) {
  let nonRecommendedAlts = document.createElement("div");
  nonRecommendedAlts.setAttribute("style", "text-align: left;");
  let alternativesHeading = document.createElement("p");
  alternativesHeading.setAttribute("style", "font-size: 12px; text-align: center; margin: 4px 0;");
  alternativesHeading.innerText = "MORE ALTERNATIVES";
  nonRecommendedAlts.appendChild(alternativesHeading);
  let scrollableAltContainer = document.createElement("div");
  scrollableAltContainer.classList.add("better-ext-alt-container");
  alternatives.map((alternative) => {
    scrollableAltContainer.innerHTML += fillTemplate(altTemplate, alternative);
  });
  nonRecommendedAlts.appendChild(scrollableAltContainer);
  return nonRecommendedAlts;
}

function createRecommendedAlt(recommendedAlternative) {
    let recommendedAlt = document.createElement("div");

    let betterBrandText = document.createElement("h1");
    betterBrandText.textContent = "Better";
    betterBrandText.setAttribute("style", "font-size: 32px; color: #222222; font-weight: bold; margin: 12px;");

    let alternativeText = document.createElement("p");
    alternativeText.textContent = recommendedAlternative.desc;
    alternativeText.setAttribute(
      "style",
      "font-size: 20px; color: #222222; font-weight: bold; margin: 20px 0; line-height:1;"
    );

    let alternativeCTA = document.createElement("a");
    alternativeCTA.textContent = recommendedAlternative.name;
    alternativeCTA.innerHTML += " &rarr;";
    alternativeCTA.setAttribute("href", escapeHtml(recommendedAlternative.url));
    alternativeCTA.setAttribute("target", "_blank");
    alternativeCTA.setAttribute("style", "display: inline-block; padding: 12px 24px; background-color: #222222; color: #ffffff; border-radius: 4px;");

    recommendedAlt.appendChild(betterBrandText);
    recommendedAlt.appendChild(alternativeText);
    recommendedAlt.appendChild(alternativeCTA);
    return recommendedAlt;
}

function showBetter(match) {
    if(!match || !match.alternatives) return;
    addPagePopupStyles();
    let alternatives = match.alternatives;
    let betterdiv = document.createElement("div");
    betterdiv.classList.add("better-ext-container");
    betterdiv.appendChild(createRecommendedAlt(alternatives[0]));

    if(alternatives.length > 1) {
      betterdiv.appendChild(createNonRecommendedAlts(alternatives.slice(1)));
    }

    let dismissButton = document.createElement("button");
    dismissButton.innerHTML = "&cross; Do not show suggestion for this URL";
    dismissButton.setAttribute("style", "display: block; font-size: 14px; margin: 16px auto; cursor:pointer;");
    dismissButton.addEventListener("click", () => {
        document.body.removeChild(betterdiv);
        dismissPermanently(match);
    })
    betterdiv.appendChild(dismissButton);

    let closeButton = document.createElement("button");
    closeButton.innerText = "❌";
    closeButton.setAttribute("style", "position: absolute; top: -10px; right: -10px; cursor:pointer; background-color: white; border-radius: 15px; border: thin solid #aaa;");
    closeButton.addEventListener("click", () => {
        document.body.removeChild(betterdiv);
    })
    betterdiv.appendChild(closeButton);

    document.body.appendChild(betterdiv);
}

function dismissPermanently(match) {
    let key = `dismiss@${match.urlPattern}`
    chrome.storage.local.set({
        [key]: true,
    });
}

function ifNotDissmissed(match, callback) {
    let key = `dismiss@${match.urlPattern}`
    chrome.storage.local.get(key, (item) => {
        if (item && item[key]) {
            return;
        } else {
          callback(match);
        }
    })
}

chrome.runtime.sendMessage({type: 'getMatch', url: document.location.href}, (response) => {
    if (response) {
        ifNotDissmissed(response, showBetter);
    }
});