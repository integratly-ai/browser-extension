import { useEffect, useState } from 'react';

type ChatSettings = {
  userId: string | null;
};

export const useChatSettings = () => {
  const [state, setState] = useState<ChatSettings>({
    userId: null,
  });

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
      console.error('Error fetching user ID:', error);
    }
  };

  return state;
};
