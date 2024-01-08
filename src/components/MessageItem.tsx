// @ts-ignore
import markdownItClass from '@toycode/markdown-it-class';
// @ts-ignore
import markdownIt from 'markdown-it';
// @ts-ignore
import markdownItLinkAttributes from 'markdown-it-link-attributes';
// @ts-ignore
import markdownItSanitizer from 'markdown-it-sanitizer';
// @ts-ignore
import markdownItSup from 'markdown-it-sup';
import { FC } from 'react';
import { ChatAILogo } from 'src/components/ChatAILogo.tsx';
import { useChatState } from 'src/providers/ChatSettingsProvider.tsx';
import { Message } from 'src/types/conversation.ts';

export const MessageItem: FC<{ message: Message }> = ({ message }) => {
  const [{ userId }] = useChatState();

  const isAI = message.user_id !== userId;

  const sanitizedHTML = markdownIt({ break: true })
    .use(markdownItClass, {
      img: ['rcw-message-img'],
    })
    .use(markdownItSup)
    .use(markdownItSanitizer)
    .use(markdownItLinkAttributes, { attrs: { target: '_blank', rel: 'noopener' } })
    .render(message.content);

  if (!userId) return null;

  return (
    <div
      className={`message-container items-start flex w-10/12 mb-3 ${
        isAI ? 'justify-start mr-auto' : 'justify-end flex-row-reverse ml-auto'
      }`}
    >
      {isAI && <ChatAILogo />}
      <div
        className={`bg-white bg-opacity-10 px-2 rounded-xl ${
          isAI ? 'mr-auto rounded-tl-none ml-4' : 'ml-auto mr-4 rounded-br-none'
        }`}
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      ></div>
    </div>
  );
};
