// document.body.style.border = "15px solid red";

/* TODO
 - Pop-up should be dismissable
 - Once dismissed, popup should not be shown. Use cookies or localStorage for this
 - List of alternatives should be loaded from a user-specified external source. Can be modified via extension options.
 - Pop-up should be formatted to look better
*/

BETTER_ALTERNATIVES = [
  [ /https?:\/\/(www.)?google.com\/chrome/ , "A better alternative is <a href='https://mozilla.com' target='_blank'>Mozilla</a>."]
]

function findBetter(url) {
    var match = BETTER_ALTERNATIVES.find(pattern => url.match(pattern[0]));
    if(match)
        return match[1];
    else return null;
}

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
