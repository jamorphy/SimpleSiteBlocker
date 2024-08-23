let sites = [];
let isBlocking = false;

document.addEventListener('DOMContentLoaded', function() {
  loadSites();
  document.getElementById('addSite').addEventListener('click', addSite);
  document.getElementById('toggleBlocking').addEventListener('click', toggleBlocking);
});

function loadSites() {
  chrome.storage.sync.get(['sites', 'isBlocking'], function(result) {
    sites = result.sites || [];
    isBlocking = result.isBlocking || false;
    updateSiteList();
    updateToggleButton();
  });
}

function addSite() {
  const siteInput = document.getElementById('siteInput');
  const site = siteInput.value.trim();
  if (site && !sites.includes(site)) {
    sites.push(site);
    siteInput.value = '';
    updateSiteList();
    saveSites();
  }
}

function removeSite(site) {
  sites = sites.filter(s => s !== site);
  updateSiteList();
  saveSites();
}

function updateSiteList() {
  const siteList = document.getElementById('siteList');
  siteList.innerHTML = '';
  sites.forEach(site => {
    const li = document.createElement('li');
    li.textContent = site;
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => removeSite(site));
    li.appendChild(removeButton);
    siteList.appendChild(li);
  });
}

function toggleBlocking() {
  isBlocking = !isBlocking;
  updateToggleButton();
  chrome.storage.sync.set({isBlocking: isBlocking});
  chrome.runtime.sendMessage({action: "updateBlocking", isBlocking: isBlocking});
}

function updateToggleButton() {
  const toggleButton = document.getElementById('toggleBlocking');
  toggleButton.textContent = isBlocking ? 'Disable Blocking' : 'Enable Blocking';
}

function saveSites() {
  chrome.storage.sync.set({sites: sites});
  chrome.runtime.sendMessage({action: "updateSites", sites: sites});
}
