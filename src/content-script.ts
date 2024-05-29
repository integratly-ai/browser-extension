import TurndownService from 'turndown';

(() => {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'startParse') {
      console.log('startParse fired');
      const htmlContent = document.documentElement.outerHTML; // Get the full HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      // Remove undesired tags
      const tagsToRemove = ['style', 'svg', 'img', 'script'];
      tagsToRemove.forEach((tag) => {
        const elements = doc.getElementsByTagName(tag);
        while (elements[0]) {
          elements[0].parentNode?.removeChild(elements[0]);
        }
      });

      // Replace <a> tags with their text content
      const anchorElements = Array.from(doc.getElementsByTagName('a'));
      anchorElements.forEach((element) => {
        const textNode = doc.createTextNode(element?.textContent || '');
        element.parentNode?.replaceChild(textNode, element);
      });

      // Get the cleaned HTML
      const pureHtml = doc.body.innerHTML;
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
