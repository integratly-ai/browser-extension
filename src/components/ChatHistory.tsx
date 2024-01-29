import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { AIAnswering } from 'src/components/AIAnswering.tsx';
import { ChatIntro } from 'src/components/ChatIntro.tsx';
import { MessageItem } from 'src/components/MessageItem.tsx';
import chatConfig from 'src/configs/chat.config.ts';
import { useChatState } from 'src/providers/ChatSettingsProvider.tsx';
import { History, Message, NewMessage } from 'src/types/conversation.ts';

export const ChatHistory = () => {
  const [{ userId, answering }] = useChatState();

  const [history, setHistory] = useState<Message[]>([]);

  const lastMessageId = useRef<number>(0);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.scrollTop = container.current.scrollHeight;
  }, [history, answering]);

  useEffect(() => {
    getChatHistory();
  }, [userId]);

  const getChatHistory = async () => {
    if (!userId) return;

    const { apiUrl } = chatConfig;
    const resp = await axios.post<History>(`${apiUrl}/conversation_history`, { user_id: userId });

    const conversation = resp.data.conversation;

    if (conversation.length === 0) {
      setHistory([]);
      return;
    }

    const parts = conversation[conversation.length - 1].msg_id.split('-');
    lastMessageId.current = parseInt(parts[parts.length - 1]);

    setHistory(conversation);

    waitForNewMessage();
  };

  const waitForNewMessage = () => {
    const { apiUrl } = chatConfig;

    try {
      axios
        .get<NewMessage>(`${apiUrl}/wait_for_new_message/${userId}/${lastMessageId.current}`)
        .then((resp) => {
          if (resp.data.status === 'ok') {
            const message = resp.data.message;
            console.log('Integratly: listenForMessages message === >', message);
            const idParts = message.msg_id.split('-');
            const newMessageId = parseInt(idParts[idParts.length - 1]);

            console.log('Received new message id:', newMessageId);

            if (newMessageId > lastMessageId.current) {
              lastMessageId.current = newMessageId;
              setHistory((prevState) => [...prevState, message]);
              setTimeout(() => waitForNewMessage(), 200);
            }
          } else {
            console.log('Integratly: No new messages');
            setTimeout(() => waitForNewMessage(), 2000);
          }
        })
        .catch((e) => {
          console.log('Error restart waitForNewMessage in 2 sec');
          console.error(e);
          setTimeout(() => waitForNewMessage(), 2000);
        });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 p-2 overflow-auto" ref={container}>
      <ChatIntro />
      {history.map((message) => (
        <MessageItem key={message.msg_id} message={message} />
      ))}
      {answering && <AIAnswering />}
    </div>
  );
};
