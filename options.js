let input = document.getElementById('betterSourceText');
let submit = document.getElementById('betterSourceSubmit');

submit.addEventListener('click', function() {
    chrome.storage.sync.set({betterSource: input.value}, function() {
    console.log('Set betterSource = ' + input.value);
    })
});
