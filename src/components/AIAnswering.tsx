import { ChatAILogo } from 'src/components/ChatAILogo.tsx';

export const AIAnswering = () => {
  return (
    <div id="ai-typing" className="items-start flex justify-start items-center">
      <ChatAILogo />
      <div className="ml-4 -mb-1">
        <div className="bouncing-loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
