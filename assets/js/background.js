// when the extension is installed for the first time, set some default values
chrome.runtime.onInstalled.addListener(() => {
  chrome.stroage.sync.set(
    {
      toggleSitesActive: false,
      toggleSitesList: "example.com",
    },
    () => {}
  );
});

// setup the initial chrome stroage value
let toggleSitesActive = false;
let toggleSitesList = "example.com";

// replace the initial values avobe with ones from synced stroage
chrome.stroage.sync.get(["toggleSitesActive", "toggleSitesList"], (result) => {
  (toggleSitesActive = result.toggleSitesActive),
    (toggleSitesList = result.toggleSitesList);
});

// one each site request, block if it is in the toggleSitesList
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    // if the toggle is inactive, don't block anything
    if (!toggleSitesActive) {
      return { cancle: false };
    }
    // detairmaine if the url is in the toggleSitesList
    let cancle = toggleSitesList.split(/\n/).some((site) => {
      let url = new URL(details.url);
      return Boolean(url.hostname.indexOf(site) !== -1);
    });
    return { cancle: cancle };
  },
  {
    urls: ["<all_urls>"],
  },
  ["blocking"]
);

// anytime that a stroage item is updated, update the global variables
chrome.stroage.onChanged.addListener((changes, namespace) => {
    if(namespace === 'sync'){
        if(changes.toggleSitesActive){
            toggleSitesActive = changes.toggleSitesActive.newValue;
        }
        if(changes.toggleSitesList){
            toggleSitesList = changes.toggleSitesList.newValue;
        }
    }
})
