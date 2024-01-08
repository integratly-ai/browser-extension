import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import SendIcon from 'src/assets/images/sendIcon.svg?react';
import chatConfig from 'src/configs/chat.config.ts';
import { useImmutableCallback } from 'src/hooks/useActualRef.ts';
import { useChatState } from 'src/providers/ChatSettingsProvider.tsx';

export const Footer = () => {
  const [{ userId }, setChainState] = useChatState();

  const [value, setValue] = useState('');

  const textArea = useRef<HTMLTextAreaElement>(null);
  const userIdRef = useRef(userId);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    const el = textArea.current;

    if (!el) return;

    textArea.current.addEventListener('input', inputCallback);

    textArea.current.addEventListener('keydown', keyDownCallback);
  }, [textArea]);

  const inputCallback = useImmutableCallback(() => {
    const el = textArea.current;

    if (!el) return;

    const numberOfSymbols = value.length;
    const symbolsPerRow = 35;
    el.rows = Math.min(5, Math.max(1, Math.ceil(numberOfSymbols / symbolsPerRow)));
  });

  const keyDownCallback = useImmutableCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (event.ctrlKey || event.shiftKey) {
        setValue(value + '\n');
      } else {
        event.preventDefault();
        sendUserMessage();
      }
    }
  });

  const sendUserMessage = async function () {
    const { apiUrl, userToken, scopeId } = chatConfig;

    setChainState((prevState) => ({ ...prevState, answering: true }));

    const resp = await axios.post(`${apiUrl}/handle_tasks`, {
      scope_id: scopeId,
      secret: userToken,
      user_id: userIdRef.current,
      user_message: value,
      channel: 'webchat',
      username: userIdRef.current,
      steps: [
        {
          field: 'answer',
          input_getter: 'getter_prompt',
          input_getter_kwargs: { prompt_var: 'ASSISTANT_PROMPT' },
          no_hallucinations: true,
        },
      ],
    });

    setValue('');

    const msgId = resp.data?.msgId;

    const interval = setInterval(() => {
      checkStatus(msgId).then((res) => {
        if (res.data?.msgStatus === 'ok') {
          clearInterval(interval);
          setChainState((prevState) => ({ ...prevState, answering: false }));
        } else if (res.data?.msgStatus === 'error') {
          clearInterval(interval);
          setChainState((prevState) => ({ ...prevState, answering: false }));
        }
      });
    }, 1000);
  };

  const checkStatus = (messageId: string) => {
    const { apiUrl, userToken } = chatConfig;

    return axios.post(`${apiUrl}/status`, {
      secret: userToken,
      msgId: messageId,
    });
  };

  return (
    <div className="flex items-center space-x-2 p-6 border-t border-gray-600">
      <textarea
        id="messageTextArea"
        placeholder="Message"
        className="font-normal resize-none bg-transparent placeholder-gray-400 border border-gray-600 focus:border-purple-600 focus:ring-0 rounded-xl px-3 pt-2.5 pb-1.5 flex-1"
        rows={1}
        value={value}
        ref={textArea}
        onChange={(e) => setValue(e.target.value)}
      ></textarea>
      <button
        id="send-button"
        type="submit"
        className="bg-gradient-to-r from-[#FB1FFF] to-[#8247FF] p-3 pr-3.5 rounded-xl flex-shrink-0 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
        onClick={sendUserMessage}
      >
        <SendIcon />
      </button>
    </div>
  );
};
