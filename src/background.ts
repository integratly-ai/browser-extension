import generateId from 'src/utils/generateId';

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    const uniqueId = generateId();
    chrome.storage.sync.set({ userId: uniqueId }, () => {
      console.log('Unique ID set for the user:', uniqueId);
    });
  }

  const scripts = chrome.runtime.getManifest().content_scripts;

  if (!scripts) return;

  for (const cs of scripts) {
    for (const tab of await chrome.tabs.query({ url: cs.matches })) {
      if (tab.url?.match(/(chrome|chrome-extension):\/\//gi)) {
        continue;
      }
      chrome.scripting.executeScript({
        files: cs.js!,
        target: { tabId: tab.id!, allFrames: cs.all_frames },
        injectImmediately: cs.run_at === 'document_start',
        // world: cs.world, // uncomment if you use it in manifest.json in Chrome 111+
      });
    }
  }
});

// chrome.tabs.onActivated.addListener(function (activeInfo) {
//   chrome.tabs.sendMessage(activeInfo.tabId, { type: 'startParse' });
// });
