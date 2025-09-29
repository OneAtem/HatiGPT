import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { generateChatResponseStream, handleApiError, generateTitle } from './services/geminiService';
import { type Message, type ChatHistoryItem, type GroundingChunk, type User } from './types';
import { useLocalization } from './hooks/useLocalization';

const App: React.FC = () => {
  const { language, changeLanguage, t } = useLocalization();
  
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('hati-gpt-user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const getHistoryKey = (currentUser: User | null) => 
    currentUser ? `hati-gpt-chat-history-${currentUser.email}` : 'hati-gpt-chat-history';

  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>(() => {
    try {
      const savedUser = localStorage.getItem('hati-gpt-user');
      const currentUser = savedUser ? JSON.parse(savedUser) : null;
      const savedHistory = localStorage.getItem(getHistoryKey(currentUser));
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error("Failed to parse chat history from localStorage", error);
      return [];
    }
  });

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => window.innerWidth > 768);
  const [isWebSearchEnabled, setIsWebSearchEnabled] = useState<boolean>(false);
  const [isUltimateModelEnabled, setIsUltimateModelEnabled] = useState<boolean>(false);
  const [isVentingModeEnabled, setIsVentingModeEnabled] = useState<boolean>(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(() => localStorage.getItem('hati-gpt-user-avatar'));

  useEffect(() => {
    if (user) {
      localStorage.setItem('hati-gpt-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hati-gpt-user');
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(getHistoryKey(user), JSON.stringify(chatHistory));
    } catch (error) {
      console.error("Failed to save chat history to localStorage", error);
    }
  }, [chatHistory, user]);

  useEffect(() => {
    if (userAvatar) {
      localStorage.setItem('hati-gpt-user-avatar', userAvatar);
    } else {
      localStorage.removeItem('hati-gpt-user-avatar');
    }
  }, [userAvatar]);

  const handleNewChat = () => {
    setActiveChatId(null);
    setCurrentMessages([]);
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(getHistoryKey(user));
      const newHistory = savedHistory ? JSON.parse(savedHistory) : [];
      setChatHistory(newHistory);
      handleNewChat();
    } catch (error) {
      console.error("Failed to load chat history for user", error);
      setChatHistory([]);
    }
  }, [user]);


  const handleAvatarChange = (avatarDataUrl: string) => {
    if (!user) { // Only allow changing local avatar when not logged in
      setUserAvatar(avatarDataUrl);
    }
  };
  
  const handleSignIn = () => {
    const mockUserAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGcgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzQyODVGNCIgZD0iTTIxLjU0NSAxMS45MmMwLS44MjYtLjA3My0xLjYyNy0uMjE4LTIuNDE4SDExLjk5OXY0LjQ3M2g1LjM3N2MtLjIzMyAxLjUzNy0uOTQgMi44NjQtMi4yMDUgMy43NzdsMy41MyA二LjcyNGMyLjA0NS0xLjg4MyAzLjIxOC00LjggMy4yMTgtOC4xNTV6Ii8+PHBhdGggZmlsbD0iIzM0QTY3RCIgZD0iTTExLjk5OSAyMS45OTljMi43MDQgMCA1LjE2My0uODk1IDYuODg2LTIuNDIybC0zLjUzLTIuNzI0Yy0uODk1LjYwNS0yLjAzIDEuMDA1LTMuMzU2IDEuMDA1LTIuNTg1IDAtNC43NzMtMS43NTgtNS41NTUtNC4xMDVIMi43NXYyLjgxNGMyLjI1IDEuODEgNS4xODUgMy4xMjYgOS4yNDQgMy4xMjZ6Ii8+PHBhdGggZmlsbD0iI0ZCQkMwNCIgZD0iTTYuNDQ0IDEzLjE2NGMtLjI2Ny0uODEtLjQyLTEuNjY0LS40Mi0yLjU2czLjE1My0xLjc1LjQyLTIuNTZWMi4yMjZIMi43NWMtLjY4MiAxLjM0My0xLjA4NiAyLjg1Ny0xLjA4NiA0LjQ3NCAwIDEuNjE2LjQuMy4xMyAxLjA4NiA0LjQ3NHoiLz48cGF0aCBmaWxsPSIjRUE0MzM1IiBkPSJNMTEuOTk5IDYuMjY4YzEuNDY4IDAgMi43ODguNCAzLjgzIDEuNDIybDMuMTIxLTMuMTE5QzE3LjE1OCAyLjE5IDE0LjcgMS4wMDEgMTEuOTk5IDEuMDAxYy00LjA2IDAtNy44MjQgMi4yMS05LjI0NSAzLjEyNWwzLjY5NCAyLjgxNGMuNzgyLTIuMzQ3IDIuOTcyLTQuMTA0IDUuNTU1LTQuMTA0eiIvPjwvZz48L3N2Zz4=';

    const mockUser: User = {
        name: 'Sana',
        email: 'sana.hatigpt@example.com',
        avatar: mockUserAvatar,
    };
    setUser(mockUser);
  };

  const handleSignOut = () => {
    setUser(null);
  };

  const displayAvatar = user?.avatar || userAvatar;

  const handleSendMessage = async (prompt: string, image?: { mimeType: string, data: string }, file?: { name: string, content: string }) => {
    if ((!prompt.trim() && !image && !file) || isLoading) return;

    setIsLoading(true);
    
    // Format a detailed prompt for the API, but keep the original prompt for the UI
    let apiPrompt = prompt;
    if (file) {
        apiPrompt = `I have uploaded a file named "${file.name}". Its content is provided below. Please analyze it and then respond to my following request.\n\n--- FILE CONTENT ---\n${file.content}\n--- END FILE CONTENT ---\n\nMy request is: "${prompt}"`;
    }

    const userMessage: Message = { role: 'user', content: prompt, image, file };
    const originalMessages = [...currentMessages];

    // Add user message to start the "thinking" state
    setCurrentMessages(prev => [...prev, userMessage]);

    try {
      // Prepare message history for the API call, using the detailed `apiPrompt`
      const userMessageForApi: Message = { role: 'user', content: apiPrompt, image }; // file content is now in the prompt
      const messagesForApi = [...originalMessages, userMessageForApi];
      
      const stream = await generateChatResponseStream(messagesForApi, isWebSearchEnabled, language, isUltimateModelEnabled, isVentingModeEnabled);
      
      let modelResponse = '';
      const sourceMap = new Map<string, GroundingChunk>();
      let sources: GroundingChunk[] = [];
      let isFirstChunk = true;
      
      for await (const chunk of stream) {
        if (isFirstChunk) {
            // First chunk arrived, add model message placeholder to start "streaming"
            setCurrentMessages(prev => [...prev, { role: 'model', content: '' }]);
            isFirstChunk = false;
        }

        modelResponse += chunk.text;

        const newSources = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        newSources.forEach(source => {
            if (source.web?.uri && !sourceMap.has(source.web.uri)) {
                sourceMap.set(source.web.uri, source);
            }
        });
        sources = Array.from(sourceMap.values());

        setCurrentMessages(prev => {
          const newMessages = [...prev];
          const lastMessageIndex = newMessages.length - 1;
          if (lastMessageIndex >= 0 && newMessages[lastMessageIndex].role === 'model') {
            newMessages[lastMessageIndex] = { 
              role: 'model', 
              content: modelResponse,
              sources: sources.length > 0 ? sources : undefined
            };
          }
          return newMessages;
        });
      }
      
      const finalModelMessage: Message = { role: 'model', content: modelResponse, sources: sources.length > 0 ? sources : undefined };
      const finalMessages: Message[] = [...originalMessages, userMessage, finalModelMessage];

      if (!activeChatId) {
        const newChatId = Date.now().toString();
        const tempTitle = (prompt || file?.name || "New Chat").substring(0, 40) + ((prompt || file?.name || "New Chat").length > 40 ? '...' : '');
        const newChatItem: ChatHistoryItem = {
          id: newChatId,
          title: tempTitle,
          messages: finalMessages,
        };

        setChatHistory(prev => [newChatItem, ...prev]);
        setActiveChatId(newChatId);

        // Generate title in the background without awaiting it
        (async () => {
          try {
            const newTitle = await generateTitle(finalMessages, language);
            setChatHistory(prev =>
              prev.map(chat =>
                chat.id === newChatId ? { ...chat, title: newTitle } : chat
              )
            );
          } catch (error) {
            console.error("Failed to generate and update chat title:", error);
          }
        })();
        
      } else {
        setChatHistory(prev =>
          prev.map(chat =>
            chat.id === activeChatId ? { ...chat, messages: finalMessages } : chat
          )
        );
      }
    } catch (error) {
      const errorMessageKey = handleApiError(error);
      const errorMessage: Message = { role: 'model', content: errorMessageKey, isError: true };
       setCurrentMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        // If we are streaming and get an error, replace the partial message
        if (lastMessage?.role === 'model') {
          newMessages[newMessages.length - 1] = errorMessage;
        } else {
          // If we were in "thinking" phase, just add the error message
          newMessages.push(errorMessage);
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectChat = (chatId: string) => {
    const selectedChat = chatHistory.find(chat => chat.id === chatId);
    if (selectedChat) {
      setActiveChatId(selectedChat.id);
      setCurrentMessages(selectedChat.messages);
    }
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleClearChat = (chatId: string) => {
    const chatIndex = chatHistory.findIndex(chat => chat.id === chatId);
    if (chatIndex > -1) {
        const newChatHistory = [...chatHistory];
        newChatHistory[chatIndex] = { ...newChatHistory[chatIndex], messages: [] };
        setChatHistory(newChatHistory);
    }

    if (activeChatId === chatId) {
      setCurrentMessages([]);
    }
  };

  const handleWebSearchToggle = () => {
    const newWebSearchState = !isWebSearchEnabled;
    setIsWebSearchEnabled(newWebSearchState);
    if (newWebSearchState) {
      setIsUltimateModelEnabled(false);
      setIsVentingModeEnabled(false);
    }
  };

  const handleUltimateModelToggle = () => {
    const newUltimateModelState = !isUltimateModelEnabled;
    setIsUltimateModelEnabled(newUltimateModelState);
    if (newUltimateModelState) {
      setIsWebSearchEnabled(false);
      setIsVentingModeEnabled(false);
    }
  };

  const handleVentingModeToggle = () => {
    const newVentingModeState = !isVentingModeEnabled;
    setIsVentingModeEnabled(newVentingModeState);
    if (newVentingModeState) {
        setIsWebSearchEnabled(false);
        setIsUltimateModelEnabled(false);
    }
  };

  return (
    <div className="flex h-screen w-screen font-sans text-gray-800 dark:text-gray-200 bg-white dark:bg-[#131314] overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onClearChat={handleClearChat}
        chatHistory={chatHistory}
        activeChatId={activeChatId}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        userAvatar={displayAvatar}
        onAvatarChange={handleAvatarChange}
        t={t}
        language={language}
        changeLanguage={changeLanguage}
      />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <ChatWindow 
          messages={currentMessages}
          isLoading={isLoading}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          onSuggestionClick={handleSendMessage}
          userAvatar={displayAvatar}
          t={t}
        />
        <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
            isWebSearchEnabled={isWebSearchEnabled}
            onWebSearchToggle={handleWebSearchToggle}
            isUltimateModelEnabled={isUltimateModelEnabled}
            onUltimateModelToggle={handleUltimateModelToggle}
            isVentingModeEnabled={isVentingModeEnabled}
            onVentingModeToggle={handleVentingModeToggle}
            t={t}
        />
      </main>
    </div>
  );
};

export default App;