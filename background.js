let sites = [];
let isBlocking = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "updateSites") {
    sites = request.sites;
  } else if (request.action === "updateBlocking") {
    isBlocking = request.isBlocking;
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (isBlocking) {
      const url = new URL(details.url);
      if (sites.some(site => url.hostname.includes(site))) {
        return {cancel: true};
      }
    }
    return {cancel: false};
  },
  {urls: ["<all_urls>"]},
  ["blocking"]
);

chrome.storage.sync.get(['sites', 'isBlocking'], function(result) {
  sites = result.sites || [];
  isBlocking = result.isBlocking || false;
});
