import TurndownService from 'turndown';

(() => {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'startParse') {
      const htmlContent = document.documentElement.innerHTML;
      const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
      const pureHtml = htmlContent.replace(scriptRegex, '');
      const currentUrl = window.location.href;
      const turndownService = new TurndownService();
      const markdown = turndownService.turndown(pureHtml);

      chrome.runtime.sendMessage({
        type: 'innerHTML',
        content: markdown,
        currentUrl,
      });
    }
  });
})();
