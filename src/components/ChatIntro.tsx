import Logo from 'src/assets/images/AIX-logo.svg?react';

export const ChatIntro = () => {
  return (
    <div className="text-center mb-6">
      <Logo className="inline-block" />
      <p className=" mb-2 text-xl">AI Agent</p>
      <p className="text-sm">I’m here to help you</p>
    </div>
  );
};
