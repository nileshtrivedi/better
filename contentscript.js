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

function showBetter(alternative) {
    if(!alternative) return;
    let betterdiv = document.createElement("div");
    betterdiv.style.backgroundColor = "#ffcc49";
    betterdiv.style.color = "red";
    betterdiv.style.position = "fixed";
    betterdiv.style.bottom = "10px";
    betterdiv.style.right = "10px";
    betterdiv.style.width = "300px";
    betterdiv.style.boxShadow = "0px 10px 30px #222222";
    betterdiv.style.padding = "12px";
    betterdiv.style.height = "200px";
    betterdiv.style.textAlign = "center";
    betterdiv.style.fontSize = "20px";

    let betterBrandText = document.createElement("h1");
    betterBrandText.innerHTML = "Better"
    betterBrandText.setAttribute("style", "font-size: 32px; color: #222222; font-weight: bold; margin: 12px;")

    let alternativeText = document.createElement("p");
    alternativeText.innerHTML = alternative
    alternativeText.setAttribute("style", "font-size: 20px; color: #222222; font-weight: bold; margin-top: 24px;")

    let alternativeCTA = document.createElement("a")
    alternativeCTA.innerHTML = "Check it out &rarr;"
    alternativeCTA.setAttribute("style", "display: inline-block; padding: 12px 24px; background-color: #222222; color: #ffffff; border-radius: 4px;")

    let dismissButton = document.createElement("button")
    dismissButton.innerHTML = "&cross; Dismiss suggestion for this URL"
    dismissButton.setAttribute("style", "display: block; font-size: 14px; margin: 16px auto;")

    betterdiv.appendChild(betterBrandText);
    betterdiv.appendChild(alternativeText);
    betterdiv.appendChild(alternativeCTA);
    betterdiv.appendChild(dismissButton);
    document.body.appendChild(betterdiv);
}

chrome.runtime.sendMessage({type: 'getMatch', url: document.location.href}, (response) => {
    if (response) {
        showBetter(response);
    }
});