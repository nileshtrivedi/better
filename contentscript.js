// document.body.style.border = "15px solid red";

/*

IN PROGRESS:

- List of alternatives should be loaded from a user-specified external source. Can be modified via options.html/options.js

TODO
 - Pop-up should be formatted to look better.
 - Pop-up should be dismissable (per URL / per domain).
 - Once dismissed, popup should not be shown on the same url/domain. Use cookies or localStorage for this.
 - Since we're replacing innerHTML, we should protect against XSS attacks.
 - Fix and test the options UI
 - Test and fix for Chrome, Brave & Firefox

*/
const fillTemplate = function(templateString, templateVars){
    return new Function("return `"+templateString +"`;").call(templateVars);
}

const altTemplate = "\
<a href='${this.url}' \
   style='display: block; border: 2px solid #222222; border-radius: 4px; margin-top: 12px; color:#222222; padding: 8px;'> \
  <p style='margin: 0; font-size: 14px; font-weight: bold;'>${this.name} &rarr;</p> \
  <p style='margin: 0; font-size: 12px;'>${this.desc}</p> \
</a>"

function createNonRecommendedAlts(alternatives) {
    let nonRecommendedAlts = document.createElement("div");
    nonRecommendedAlts.setAttribute("style", "text-align: left;");
    nonRecommendedAlts.innerHTML = "<p style='font-size: 12px; text-align: center; margin-bottom: 4px;'>MORE ALTERNATIVES</p>";
    alternatives.map(alternative => {
      nonRecommendedAlts.innerHTML += fillTemplate(altTemplate, alternative);
    })
    return nonRecommendedAlts;
}

function createRecommendedAlt(alternative) {
    let recommendedAlt = document.crateElement("div");

    let betterBrandText = document.createElement("h1");
    betterBrandText.innerHTML = "Better";
    betterBrandText.setAttribute("style", "font-size: 32px; color: #222222; font-weight: bold; margin: 12px;");

    let alternativeText = document.createElement("p");
    alternativeText.innerHTML = recommendedAlternative.desc;
    alternativeText.setAttribute("style", "font-size: 20px; color: #222222; font-weight: bold; margin-top: 24px;");

    let alternativeCTA = document.createElement("a");
    alternativeCTA.innerHTML = recommendedAlternative.name + " &rarr;";
    alternativeCTA.setAttribute("href", recommendedAlternative.url);
    alternativeCTA.setAttribute("style", "display: inline-block; padding: 12px 24px; background-color: #222222; color: #ffffff; border-radius: 4px;");

    recommendedAlt.appendChild(betterBrandText);
    recommendedAlt.appendChild(alternativeText);
    recommendedAlt.appendChild(alternativeCTA);
    return recommendedAlt;
}

function showBetter(alternatives) {
    if(!alternatives) return;

    let betterdiv = document.createElement("div");
    betterdiv.setAttribute("style",
                           "background-color: #ffcc49; position: fixed; bottom: 10px; right: 10px; width: 300px; \
                            box-shadow: 0px 10px 30px #222222; padding: 12px; text-align: center; font-size: 20px;")

    betterdiv.appendChild(createRecommendedAlt(alternatives[0]));

    if(alternatives.length > 1) {
      betterdiv.appendChild(createNonRecommendedAlts(alternatives.slice(1)));
    }

    let dismissButton = document.createElement("button");
    dismissButton.innerHTML = "&cross; Dismiss suggestion for this URL";
    dismissButton.setAttribute("style", "display: block; font-size: 14px; margin: 16px auto;");
    betterdiv.appendChild(dismissButton);
    document.body.appendChild(betterdiv);
}

chrome.runtime.sendMessage({type: 'getMatch', url: document.location.href}, (response) => {
    if (response) {
        showBetter(response);
    }
});