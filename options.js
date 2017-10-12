var saveButton;
var field;
var errorContainerElem;
var fieldValue = '';

function saveOptions () {
    chrome.storage.sync.set({
        envs: field.value
    });

    errorContainerElem.textContent = 'Saved!';
    setTimeout(function () {
        errorContainerElem.textContent = '';
    }, 2500);
}

function init () {
    saveButton = document.getElementById('save-options');
    field = document.getElementById('textarea');
    errorContainerElem = document.getElementById('error');

    saveButton.addEventListener('click', saveOptions);
    field.addEventListener('input', toggleError);

    chrome.storage.sync.get({
        envs: fieldValue
    }, function (items) {
        field.value = items.envs;
        fieldValue = items.envs;
    });
}

function toggleError () {
    try {
        (jsonlint.parse(field.value) || field.value === '');
    } catch (e) {
        errorContainerElem.textContent = e;
        saveButton.disabled = true;
        errorContainerElem.classList.add('active');
        return e;
    }
    errorContainerElem.textContent = '';
    saveButton.disabled = false;
    errorContainerElem.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', init);
