import axios from 'axios';
import { useEffect } from 'react';
import { ChatHistory } from 'src/components/ChatHistory.tsx';
import { Footer } from 'src/components/Footer.tsx';
import { Header } from 'src/components/Header.tsx';
import chatConfig from 'src/configs/chat.config.ts';
import { useChatState } from 'src/providers/ChatSettingsProvider.tsx';

let initialized = false;

function App() {
  const [{ userId }] = useChatState();
  const { scopeId, apiUrl } = chatConfig;

  useEffect(() => {
    if (!userId) return;
    if (initialized) return;

    initialized = true;

    const messageListener = (message: { type: string; content: string; currentUrl: string }) => {
      console.log('Received message:', message);
      const { type, content, currentUrl } = message;
      if (type === 'innerHTML') {
        setTimeout(() => {
          axios
            .post(`${apiUrl}/load_context`, {
              user_id: userId,
              content,
              context_id: currentUrl,
              scope_id: scopeId,
            })
            .catch((error) => console.error('API request failed:', error));
        }, 5000);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    if (document.readyState === 'complete') {
      sendMessageToContentScript();
    } else {
      window.addEventListener('load', sendMessageToContentScript);
    }
  }, [userId]);

  const sendMessageToContentScript = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Check if there's an active tab
      if (tabs.length === 0) return; // No active tab found

      // Send a message to the content script in the active tab
      chrome.tabs.sendMessage(tabs[0].id as number, { type: 'startParse' });
    });
  };

  return (
    <div className="h-[600px] w-[25rem] bg-gray-800 text-white flex flex-col">
      <Header />
      <ChatHistory />
      <Footer />
    </div>
  );
}

export default App;
