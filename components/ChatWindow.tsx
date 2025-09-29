import React, { useEffect, useRef, useState } from 'react';
import { type Message } from '../types';
import { HatiLogo, MenuIcon, UserIcon, SparklesIcon, CopyIcon, CheckIcon, FileIcon } from './icons';

// Configure marked to use highlight.js for syntax highlighting
// @ts-ignore
if (window.marked && window.hljs) {
  // @ts-ignore
  window.marked.setOptions({
    breaks: true,
    highlight: function(code: string, lang: string) {
      // @ts-ignore
      const language = window.hljs.getLanguage(lang) ? lang : 'plaintext';
      // @ts-ignore
      return window.hljs.highlight(code, { language }).value;
    },
  });
}

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  onSuggestionClick: (prompt: string) => void;
  userAvatar: string | null;
  t: (key: string) => string;
}

const StreamingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1.5">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '400ms'}}></div>
    </div>
);

const ThinkingIndicator: React.FC = () => (
    <div className="flex items-start gap-4 w-full max-w-4xl mx-auto">
      <div className="flex-shrink-0">
        <HatiLogo className="w-8 h-8 animate-pulse" />
      </div>
      <div className="flex-1">
        <div className="font-bold text-gray-700 dark:text-gray-300">HatiGPT</div>
      </div>
    </div>
);

const ChatMessage: React.FC<{ message: Message; userAvatar: string | null; t: (key: string) => string; isStreaming: boolean; }> = ({ message, userAvatar, t, isStreaming }) => {
  // FIX: Corrected the typo in the type from HTMLDivDivElement to HTMLDivElement.
  const contentRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (message.role === 'model' && contentRef.current && !message.isError) {
        // @ts-ignore
        contentRef.current.innerHTML = marked.parse(message.content);
    }
  }, [message.content, message.role, message.isError]);

  const handleCopy = () => {
    if (!message.content || message.isError) return;
    navigator.clipboard.writeText(message.content).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };
  
  const displayedContent = message.isError ? t(message.content) : message.content;

  return (
    <div className={`flex items-start gap-4 w-full max-w-4xl mx-auto ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div className="flex-shrink-0">
        {message.role === 'model' ? (
          <HatiLogo className="w-8 h-8" />
        ) : (
          userAvatar ? (
            <img src={userAvatar} alt="User Avatar" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <UserIcon className="w-8 h-8 p-1 bg-gray-200 dark:bg-gray-600 rounded-full" />
          )
        )}
      </div>
      <div className={`flex-1 group ${message.role === 'user' ? 'text-end' : ''}`}>
        <div className="font-bold text-gray-700 dark:text-gray-300 mb-1">{message.role === 'user' ? t('chatWindow.you') : 'HatiGPT'}</div>
        
        {message.role === 'user' && message.image && (
            <div className={`mb-2 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <img 
                    src={`data:${message.image.mimeType};base64,${message.image.data}`} 
                    alt="User upload" 
                    className="max-w-xs max-h-48 rounded-lg object-contain"
                />
            </div>
        )}
        {message.role === 'user' && message.file && (
             <div className={`mb-2 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 p-2 rounded-lg max-w-xs">
                    <FileIcon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm truncate" title={message.file.name}>{message.file.name}</span>
                </div>
            </div>
        )}

        <div className={`prose prose-sm dark:prose-invert max-w-none text-start ${message.isError ? 'text-red-500' : ''}`} ref={contentRef}>
            {message.role === 'user' || message.isError ? displayedContent : null}
        </div>
        {isStreaming && (
            <div className="text-start mt-2">
                <StreamingIndicator />
            </div>
        )}
         {message.role === 'model' && message.content && !message.isError && !isStreaming && (
            <div className="text-start mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label={isCopied ? t('chatWindow.copied') : t('chatWindow.copy')}
                >
                    {isCopied ? (
                        <CheckIcon className="w-4 h-4 text-green-500" />
                    ) : (
                        <CopyIcon className="w-4 h-4" />
                    )}
                </button>
            </div>
        )}
        {message.role === 'model' && message.sources && message.sources.length > 0 && (
            <div className="mt-4 text-start border-t border-gray-200 dark:border-gray-700 pt-3">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{t('chatWindow.sources')}</h3>
                <ol className="space-y-2 text-sm">
                    {message.sources.map((source, index) =>
                      source.web?.uri ? (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-gray-400 dark:text-gray-500 w-4 text-center">{index + 1}.</span>
                           <img 
                            src={`https://www.google.com/s2/favicons?domain=${new URL(source.web.uri).hostname}&sz=16`}
                            alt="favicon"
                            className="w-4 h-4 object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                          <a
                            href={source.web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 dark:text-blue-400 hover:underline truncate focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                            title={source.web.title}
                          >
                            {source.web.title || new URL(source.web.uri).hostname}
                          </a>
                        </li>
                      ) : null
                    )}
                </ol>
            </div>
        )}
      </div>
    </div>
  );
};


export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, isSidebarOpen, toggleSidebar, onSuggestionClick, userAvatar, t }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const threshold = 100;
      const atBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + threshold;
      isAtBottomRef.current = atBottom;
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isAtBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);
  
  const WelcomeScreen = () => (
      <div className="flex flex-col items-start justify-between h-full max-w-4xl mx-auto py-8">
          <div>
              <h1 className="text-4xl sm:text-5xl font-medium">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500">{t('chatWindow.greeting1')}</span>
              </h1>
              <h2 className="mt-2 text-4xl sm:text-5xl font-medium text-gray-400 dark:text-gray-500">{t('chatWindow.greeting2')}</h2>
          </div>
          <div className="w-full">
              <div>
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">{t('chatWindow.suggestionsTitle')}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 w-full">
                       {[t('chatWindow.suggestion1'), t('chatWindow.suggestion2'), t('chatWindow.suggestion3'), t('chatWindow.suggestion4')].map(prompt => (
                          <button
                              key={prompt}
                              onClick={() => onSuggestionClick(prompt)}
                              disabled={isLoading}
                              className="p-3 sm:p-4 bg-[#f0f4f9] dark:bg-[#1e1f20] rounded-lg sm:rounded-xl min-h-24 relative flex items-start hover:bg-[#dde3ea] dark:hover:bg-[#2f3031] cursor-pointer text-start disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              <p className="text-xs sm:text-sm">{prompt}</p>
                              <SparklesIcon className="w-6 h-6 absolute bottom-2 end-2 p-1 bg-white dark:bg-black rounded-full" />
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      </div>
  );

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 relative">
      <div className="absolute top-4 start-4 z-10">
        <button onClick={toggleSidebar} className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${isSidebarOpen ? 'md:hidden' : ''}`}>
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>

      {messages.length === 0 && !isLoading ? <WelcomeScreen /> : (
        <div className="space-y-8 pt-8 md:pt-0">
          {messages.map((msg, index) => (
            <ChatMessage 
                key={index} 
                message={msg} 
                userAvatar={userAvatar} 
                t={t} 
                isStreaming={isLoading && msg.role === 'model' && index === messages.length - 1}
            />
          ))}
          {isLoading && (messages.length === 0 || messages[messages.length-1]?.role === 'user') && (
            <ThinkingIndicator />
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};