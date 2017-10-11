function processOptions (input) {
    var lines = input.split('\n');
    var envs = [];
    var lastEnvAdded;
    var nameNext = true;
    for (var i = 0; i < lines.length; i++) {
        var currLine = lines[i];
        if (nameNext) {
            envs.push({
                name: currLine,
                needle: lines[i + 1],
                urls: []
            });
            i += 1;
            nameNext = false;
        } else if (currLine !== '') {
            var values = currLine.split('::');
            var name = values[0];
            var url = values[0];

            if (values.length === 2) {
                url = values[1];
            }

            envs[envs.length - 1].urls.push({
                name: name,
                url: url
            });
        } else {
            nameNext = true;
        }
    }

    return envs;
}

function getEnvUrl (currentUrl, needle, newEnv) {
    var needlePos = currentUrl.indexOf(needle);
    return newEnv + '/' + currentUrl.slice(needlePos);
}

function createInterface (parentElem, envs, currentUrl) {
    var divElem = document.createElement('div');
    divElem.classList.add('project');
    var title = document.createElement('p');
    if (envs.length ) {
        envs.forEach((currEnv) => {
            title.textContent = currEnv.name;
            divElem.appendChild(title);
            currEnv.urls.forEach((curr) => {
                var linkElem = document.createElement('div');
                linkElem.classList.add('url');
                var newUrl = getEnvUrl(currentUrl, currEnv.needle, curr.url);
                linkElem.textContent = curr.name;
                linkElem.addEventListener('click', function(e) {
                    click(e, newUrl);
                });
                divElem.appendChild(linkElem);
            });
        });
    } else {
        title.textContent = 'No Environments Found';
        divElem.appendChild(title);
    }
    parentElem.appendChild(divElem);
}

function click(e, url) {
    chrome.tabs.create({"url": url});
    window.close();
}

document.addEventListener('DOMContentLoaded', function () {
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
                        createInterface(document.getElementsByTagName('body')[0], currentEnvs, url);
                    }
                }
            }
        })
    });
});
