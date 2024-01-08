import { createContext, Dispatch, useContext, useEffect, useState } from 'react';
import { FCC } from 'src/types/FCC.ts';

type ChatSettingsState = {
  userId: string | null;
  answering: boolean;
};

const ChatSettingsProviderInitCtx: ChatSettingsState = {
  userId: null,
  answering: false,
};

const ChatSettingsProviderCtx = createContext<
  [ChatSettingsState, Dispatch<React.SetStateAction<ChatSettingsState>>]
>([ChatSettingsProviderInitCtx, () => null]);

export const ChatSettingsProvider: FCC = ({ children }) => {
  const [state, setState] = useState<ChatSettingsState>(ChatSettingsProviderInitCtx);

  useEffect(() => {
    fetchUserId();
  }, []);

  const fetchUserId = async () => {
    try {
      const userId = (await new Promise((resolve, reject) => {
        chrome.storage.sync.get('userId', (data) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(data.userId);
          }
        });
      })) as string;

      console.log('Retrieved User ID:', userId);

      setState((prevState) => ({ ...prevState, userId }));
    } catch (error) {
      setState((prevState) => ({ ...prevState, userId: 'd842f1d86b5a84d91761e06700236053' }));
      console.error('Error fetching user ID:', error);
    }
  };

  return (
    <ChatSettingsProviderCtx.Provider value={[state, setState]}>
      {children}
    </ChatSettingsProviderCtx.Provider>
  );
};

export const useChatState = () => useContext(ChatSettingsProviderCtx);
