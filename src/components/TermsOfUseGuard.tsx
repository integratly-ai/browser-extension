import { Icon } from '@iconify/react';
import { FC, useState } from 'react';
import { ChatIntro } from 'src/components/ChatIntro.tsx';
import { UIButton } from 'src/components/UIButton.tsx';
import { UICheckbox } from 'src/components/UICheckbox.tsx';

export const TermsOfUseGuard: FC<{ onTermsAccept: () => void }> = ({ onTermsAccept }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);

  function handleContinue() {
    if (import.meta.env.MODE === 'development') {
      onTermsAccept();
      return;
    }
    chrome.storage.local.set({ agreedToTerms: true }, onTermsAccept);
  }

  return (
    <div className="flex-1 flex flex-col p-2">
      <ChatIntro />
      <div className="bg-white bg-opacity-10 p-4 m-2 mb-6 mt-auto rounded-xl">
        <UICheckbox
          label={
            <span>
              I agree to AigentX's
              <br />
              <a
                className="text-purple-600"
                onClick={(e) => e.stopPropagation()}
                href="https://aigentx.xyz/terms-of-use"
                target="_blank"
                rel="noreferrer"
              >
                Terms of Use
              </a>{' '}
              and{' '}
              <a
                className="text-purple-600"
                onClick={(e) => e.stopPropagation()}
                href="https://aigentx.xyz/privacy-policy"
                target="_blank"
                rel="noreferrer"
              >
                Privacy Policy
              </a>
            </span>
          }
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
        />
      </div>
      <div className="px-2 pt-4 border-t border-gray-600">
        <UIButton className="w-full" onClick={handleContinue} disabled={!termsAccepted}>
          Continue <Icon className="ml-4" icon="fa6-solid:arrow-right" />
        </UIButton>
      </div>
    </div>
  );
};
