import Logo from 'src/assets/images/AIX-logo.svg?react';

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-[#FB1FFF] to-[#8247FF] text-white flex items-center p-2">
      <div className="flex items-center">
        <Logo />
        <span className="font-semibold ml-2">AI Agent</span>
      </div>
    </header>
  );
};
