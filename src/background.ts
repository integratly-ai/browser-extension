import generateId from 'src/utils/generateId';

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    const uniqueId = generateId();
    chrome.storage.sync.set({ userId: uniqueId }, () => {
      console.log('Unique ID set for the user:', uniqueId);
    });
  }
});
