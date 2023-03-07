import React, { useEffect, useState, useRef } from 'react';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { NextSeo } from 'next-seo';
import type { NextPageWithLayout } from '@/types';
import { useLayout } from '@/lib/hooks/use-layout';
import { LAYOUT_OPTIONS } from '@/lib/constants';
import Image from '@/components/ui/image';
import Avatar from '@/components/ui/avatar';
import Profile from '@/components/profile/profile';
import RetroProfile from '@/components/profile/retro-profile';
// static data
import { authorData } from '@/data/static/author';
import RootLayout from '@/layouts/_root-layout';
import { ChatGPT } from '@/components/chatgpt/ChatGPT';

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export interface ChatContentTypes {
  Human: string;
  AI: string;
}

const AuthorProfilePage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = () => {
  const { layout } = useLayout();

  const defaultPromot = process.env.DEFAULT_CHAT_PROMPT;

  const [inputValue, setInputValue] = useState<string>('');
  const [prompt, setPrompt] = useState<string>(defaultPromot as string);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatContent, setChatContent] = useState<ChatContentTypes[]>([]);
  const [isShowHint, setIsShowHint] = useState<string>('');

  const chatBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleGetAnswer = async () => {
    if (inputValue === '') {
      setIsShowHint('input');
    } else if (inputValue === '/reset') {
      handleClearHistory();
    } else if (inputValue) {
      try {
        setIsLoading(true);
        setInputValue('');
        setChatContent([...chatContent, { Human: inputValue, AI: '...' }]);
        const res = await fetch(`/api/openai/openai-chat`, {
          body: JSON.stringify(prompt + `Human:${inputValue}\nAI:`),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });
        const data = await res.json();
        setPrompt(prompt + `Human:${inputValue}\nAI:${data}\n`);
        setChatContent([...chatContent, { Human: inputValue, AI: data }]);
        localStorage.setItem(
          'chatContent',
          JSON.stringify([...chatContent, { Human: inputValue, AI: data }])
        );
        localStorage.setItem(
          'rememberPrompt',
          prompt + `Human:${inputValue}\nAI:${data}\n`
        );
        setIsLoading(false);
      } catch {
        handleGetAnswer();
      }
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem('chatContent');
    localStorage.removeItem('rememberPrompt');
    setChatContent([]);
    setInputValue('');
    setPrompt(defaultPromot as string);
    setIsLoading(false);
    setIsShowHint('');
    if (inputRef) {
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    const rememberChatContent = localStorage.getItem('chatContent');
    const rememberPrompt = localStorage.getItem('rememberPrompt');
    if (rememberPrompt && rememberPrompt.length > 0) {
      setPrompt(rememberPrompt);
    }
    if (rememberChatContent && rememberChatContent.length > 0) {
      setChatContent(JSON.parse(rememberChatContent));
    }
  }, []);

  return (
    <div className="flex flex-col justify-around gap-4 lg:flex-row">
      <ChatGPT
        clearFunc={handleClearHistory}
        getAnswerFunc={handleGetAnswer}
        setInputValue={setInputValue}
        chatContent={chatContent}
        isLoading={isLoading}
        inputValue={inputValue}
        chatBoxRef={chatBoxRef}
        inputRef={inputRef}
        isShowHint={isShowHint}
        setIsShowHint={setIsShowHint}
        isRememberChat
        title="Real time chat"
      />
      <div className="max-w-auto text-sm text-slate-300  lg:max-w-md">
        <div className={`text-xl`}>Prompt</div>
        <div
          className={`mt-1 flex flex-col rounded-xl bg-[#3a0e1f73] p-3 px-5`}
        >
          <div>
            The following is a conversation with an AI assistant. The assistant
            is helpful, creative, clever, and very friendly.
          </div>
          <br />
          <div>
            <span className="font-bold">Human:</span> Hello, We are Procreation
            AI.
          </div>
          <div>
            <span className="font-bold">AI:</span> Hello, Nice to meet you, What
            can I do for you?
          </div>
          <div>
            <span className="font-bold">Human:</span> Do you remember my name?
          </div>
          <div>
            <span className="font-bold">AI:</span>
          </div>
        </div>
        <div className={`mt-5 text-xl`}>Response</div>
        <div className={`mt-1 rounded-xl bg-[#0e3a0f73] p-3 px-5`}>
          Yes, of course I remember! Your are Procreation AI. Is there anything
          else I can do for you?
        </div>
        <div className={`mt-5 text-xl`}>Keyword</div>
        <div className={`mt-1 rounded-xl bg-[#3a2c0e73] p-3 px-5`}>
          <span className="font-bold">/reset</span>: Reset all chats between AI
          bots.
        </div>
      </div>
    </div>
  );
};

AuthorProfilePage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default AuthorProfilePage;
