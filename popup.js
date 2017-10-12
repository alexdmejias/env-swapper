var errorElem;
var envsContainerElem;

function processOptions(str) {
    var jsString = false;
    try {
        jsString = JSON.parse(str);
    } catch (e) {
        return false;
    }
    return jsString;
}

function getEnvUrl (currentUrl, needle, newEnv) {
    var needlePos = currentUrl.indexOf(needle);
    return newEnv + currentUrl.slice(needlePos);
}

function createInterface (parentElem, envs, currentUrl) {
    var divElem = document.createElement('div');
    divElem.classList.add('project');
    if (envs.length) {
        envs.forEach((currEnv) => {
            if (currEnv.name && currEnv.needle && currEnv.urls.length) {
                var title = document.createElement('p');
                title.textContent = currEnv.name;
                divElem.appendChild(title);
                currEnv.urls.forEach((curr) => {
                    var linkElem = document.createElement('div');
                    var newUrl = getEnvUrl(currentUrl, currEnv.needle, curr.url);
                    linkElem.classList.add('url');
                    linkElem.textContent = curr.name;
                    linkElem.addEventListener('click', function(e) {
                        click(e, newUrl);
                    });
                    divElem.appendChild(linkElem);
                });
            }
        });
    } else {
        setTitle('No Environments Found');
    }
    parentElem.appendChild(divElem);
}

function click(e, url) {
    chrome.tabs.create({"url": url});
    window.close();
}

function setTitle (msg) {
    errorElem.textContent = msg;
}

document.addEventListener('DOMContentLoaded', function () {
    errorElem = document.getElementsByClassName('error')[0];
    envsContainerElem = document.getElementsByClassName('environments')[0];

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        var activeTab = tabs[0];
        var url = activeTab.url;
        chrome.storage.sync.get({
            envs: ''
        }, function (items) {
            if (items.envs) {
                var envs = processOptions(items.envs);
                if (envs) {
                    var currentEnvs = envs.filter((curr) => url.indexOf(curr.needle) > 0);
                    if (currentEnvs) {
                        createInterface(envsContainerElem, currentEnvs, url);
                        showError('');
                    }
                } else {
                    setTitle('WASDWASD');
                }
            }
        })
    });
});
