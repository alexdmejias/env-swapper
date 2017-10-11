function saveOptions () {
    var field = document.getElementById('textarea');

    chrome.storage.sync.set({
        envs: field.value
    });
}

function loadOptions () {
    var field = document.getElementById('textarea');

    chrome.storage.sync.get({
        envs: ''
    }, function (items) {
        field.value = items.envs;
    });
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save-options').addEventListener('click', saveOptions);
