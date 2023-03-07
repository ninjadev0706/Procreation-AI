import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
// import { Icon } from '@iconify/react';

export interface ChatContentTypes {
  Human: string;
  AI: string;
}

export interface MoodChatContentTypes extends ChatContentTypes {
  Color?: string;
}

interface ChatBoxTypes {
  clearFunc: () => void;
  getAnswerFunc: () => void;
  setInputValue: Dispatch<SetStateAction<string>>;
  chatContent: MoodChatContentTypes[];
  isLoading: boolean;
  inputValue: string;
  chatBoxRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
  isRememberChat: boolean;
  isShowHint: string;
  setIsShowHint: Dispatch<SetStateAction<string>>;
  isShowHistory?: boolean;
  setIsShowHistory?: Dispatch<SetStateAction<boolean>>;
  showSelectLanguages?: boolean;
  setShowSelectLanguages?: Dispatch<SetStateAction<boolean>>;
  selectedLanguages?: string[];
  setSelectedLanguages?: Dispatch<SetStateAction<string[]>>;
  isSelectLanguages?: boolean;
  moodColor?: string;
  title: string;
}

export const ChatGPT = ({
  clearFunc,
  getAnswerFunc,
  setInputValue,
  chatContent,
  isLoading,
  inputValue,
  chatBoxRef,
  inputRef,
  isRememberChat,
  isShowHint,
  setIsShowHint,
  title,
}: ChatBoxTypes) => {
  const overview = 'I am prepared to speak with you. Fire away!';

  const handleKeyDown = (event: React.KeyboardEvent) => {
    setIsShowHint('');
    if (event.key === 'Enter') {
      getAnswerFunc();
    }
  };

  const arrowAnimation = (
    <Player
      autoplay
      loop
      src="https://assets9.lottiefiles.com/packages/lf20_uxud7cot.json"
      style={{ height: '50px', width: '50px' }}
    />
  );

  return (
    <div
      className="max-w-auto text-md relative w-full self-center lg:max-w-xl"
      id="chatBox"
    >
      <div className="flex h-6 items-center justify-between rounded-t-md bg-slate-800 px-4">
        <div className="justify-self-start text-sm text-slate-300">{title}</div>
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-3.5 cursor-pointer rounded-full bg-green-600" />

          <div className="h-3.5 w-3.5 cursor-pointer rounded-full bg-yellow-600" />
          <div
            className="group flex h-3.5 w-3.5 cursor-pointer items-center justify-center rounded-full bg-rose-600 transition-all hover:w-12"
            onClick={() => clearFunc()}
          >
            <div className="text-xs opacity-0 transition-all group-hover:opacity-100">
              reset
            </div>
          </div>
        </div>
      </div>
      <div
        className={`relative flex h-[450px] flex-col gap-3 overflow-auto bg-[#00000080] p-5 text-sm text-slate-300`}
        ref={chatBoxRef}
      >
        {isRememberChat ? (
          chatContent.length > 0 ? (
            chatContent.map((chat, index) => (
              <div className="flex flex-col gap-2" key={index}>
                <div className="w-max max-w-[250px] self-end rounded-md bg-purple-600 p-2 sm:max-w-sm md:max-w-md lg:max-w-xs">
                  {chat.Human}
                </div>
                <div className="w-max max-w-[250px] rounded-md bg-slate-600 p-2 sm:max-w-sm md:max-w-md lg:max-w-xs">
                  {isLoading && chatContent.length - 1 === index ? (
                    <Player
                      autoplay
                      loop
                      src="https://assets1.lottiefiles.com/packages/lf20_fyye8szy.json"
                      style={{
                        height: '50px',
                        width: '50px',
                        marginBottom: '-15px',
                        marginTop: '-15px',
                      }}
                    />
                  ) : (
                    chat.AI
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <Player
                autoplay
                loop
                src="https://assets7.lottiefiles.com/packages/lf20_pmgmuthj.json"
                style={{ height: '250px', width: '250px' }}
              />
              <div>{overview}</div>
            </div>
          )
        ) : isLoading ? (
          <Player
            autoplay
            loop
            src="https://assets1.lottiefiles.com/packages/lf20_fyye8szy.json"
            style={{ height: '50px', width: '50px' }}
          />
        ) : chatContent.length > 0 ? (
          <>
            <div className="text-center text-base">
              {chatContent[chatContent.length - 1].Human}
            </div>
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <Player
              autoplay
              loop
              src="https://assets7.lottiefiles.com/packages/lf20_pmgmuthj.json"
              style={{ height: '250px', width: '250px' }}
            />
            <div>{overview}</div>
          </div>
        )}
      </div>
      {isShowHint === 'input' && (
        <div className="absolute bottom-10 left-0">{arrowAnimation}</div>
      )}
      <div className="flex w-full overflow-hidden rounded-b-md bg-slate-800">
        <input
          className="w-full rounded-b-md border-none bg-slate-800 py-2 px-4 outline-none"
          placeholder="Ask me anything..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
          disabled={isLoading}
          ref={inputRef}
          autoFocus
        />
        {/* <TransparencyButton isIcon iconName='material-symbols:send' action={() => getAnswerFunc()} /> */}
      </div>
    </div>
  );
};
