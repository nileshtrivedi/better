// document.body.style.border = "15px solid red";

/* 

IN PROGRESS: 

- List of alternatives should be loaded from a user-specified external source. Can be modified via options.html/options.js

TODO
 - Pop-up should be formatted to look better.
 - Pop-up should be dismissable (per URL / per domain).
 - Once dismissed, popup should not be shown on the same url/domain. Use cookies or localStorage for this.
 - Since we're replacing innerHTML, we should protect against XSS attacks.
*/

function showBetter(alternative) {
    if(!alternative) return;
    let betterdiv = document.createElement("div");
    betterdiv.style.backgroundColor = "yellow";
    betterdiv.style.color = "red";
    betterdiv.style.position = "fixed";
    betterdiv.style.bottom = "10px";
    betterdiv.style.right = "10px";
    betterdiv.style.width = "400px";
    betterdiv.style.height = "200px";
    betterdiv.style.textAlign = "center";
    betterdiv.style.fontSize = "20px";
    betterdiv.innerHTML = alternative;
    document.body.appendChild(betterdiv);
}

showBetter(findBetter(document.location.href));

chrome.runtime.sendMessage({type: 'getMatch', url: document.location.href}, (response) => {
    if (response) {
        showBetter(response);
    }
});