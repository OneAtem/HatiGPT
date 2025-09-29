import React, { useState, useRef, useEffect } from 'react';
import { type ChatHistoryItem, type User } from '../types';
import { PlusIcon, MessageSquareIcon, UserIcon, LanguageIcon, TrashIcon, GoogleIcon, SignOutIcon, SettingsIcon, ChevronDownIcon } from './icons';
import { type Language } from '../hooks/useLocalization';

interface SidebarProps {
  isOpen: boolean;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onClearChat: (id: string) => void;
  chatHistory: ChatHistoryItem[];
  activeChatId: string | null;
  onClose: () => void;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  userAvatar: string | null;
  onAvatarChange: (avatarDataUrl: string) => void;
  t: (key: string) => string;
  language: Language;
  changeLanguage: (lang: Language) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onNewChat,
  onSelectChat,
  onClearChat,
  chatHistory,
  activeChatId,
  onClose,
  user,
  onSignIn,
  onSignOut,
  userAvatar,
  onAvatarChange,
  t,
  language,
  changeLanguage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAvatarClick = () => {
    if (!user) { // Only allow changing avatar when not signed in
        fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAvatarChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleLanguage = () => {
    changeLanguage(language === 'en' ? 'fa' : 'en');
  };

  const handleClearClick = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (window.confirm(t('sidebar.clearConfirm'))) {
      onClearChat(chatId);
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 bg-black/40 z-10 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      <nav
        className={`bg-[#f0f4f9] dark:bg-[#1e1f20] flex flex-col transition-all duration-300 h-full
          fixed md:relative z-20
          ${isOpen ? 'w-[280px] p-4' : 'w-0 p-0 overflow-hidden'}
          md:w-64
          ${isOpen ? 'md:p-4' : 'md:w-0 md:p-0'}
        `}
      >
        <div className="flex-1 overflow-y-auto">
          <button
            onClick={onNewChat}
            className="flex items-center gap-3 bg-[#dde3ea] dark:bg-[#2f3031] text-sm font-medium rounded-full px-4 py-2 w-full hover:bg-[#d0d7de] dark:hover:bg-[#3d3e3f] transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>{t('sidebar.newChat')}</span>
          </button>

          <div className="mt-8">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 uppercase">{t('sidebar.recent')}</h2>
            <ul className="mt-2 space-y-1">
              {chatHistory.map(chat => (
                <li key={chat.id} className="relative group">
                  <button
                    onClick={() => onSelectChat(chat.id)}
                    className={`w-full text-start text-sm flex items-center gap-3 ps-3 pe-10 py-2 rounded-full transition-colors ${
                      activeChatId === chat.id
                        ? 'bg-[#c4ddff] dark:bg-[#283548] text-gray-800 dark:text-gray-100'
                        : 'hover:bg-[#dde3ea] dark:hover:bg-[#2f3031]'
                    }`}
                  >
                    <MessageSquareIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate flex-1">{chat.title}</span>
                  </button>
                   <button
                    onClick={(e) => handleClearClick(e, chat.id)}
                    className="absolute end-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title={t('sidebar.clearChat')}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 border-t border-gray-300 dark:border-gray-600 pt-4 space-y-2">
           <button 
            onClick={toggleLanguage}
            className="w-full flex items-center gap-3 px-2 py-1 rounded-full hover:bg-[#dde3ea] dark:hover:bg-[#2f3031] cursor-pointer"
            title={t('sidebar.language')}
          >
             <LanguageIcon className="w-8 h-8 p-1.5 bg-gray-300 dark:bg-gray-500 rounded-full"/>
             <span className="text-sm font-medium">{language === 'en' ? 'فارسی' : 'English'}</span>
          </button>
          
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(prev => !prev)}
                className="w-full flex items-center gap-3 px-2 py-1 rounded-full hover:bg-[#dde3ea] dark:hover:bg-[#2f3031] cursor-pointer"
                aria-haspopup="true"
                aria-expanded={isUserMenuOpen}
              >
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                <span className="text-sm font-medium truncate flex-1 text-start">{user.name}</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute bottom-full mb-2 w-full bg-[#e8eef3] dark:bg-[#2f3031] rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-1 z-10">
                  <ul className="space-y-1">
                    <li>
                      <button
                        onClick={() => { alert('Account settings not implemented yet.'); setIsUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-[#dde3ea] dark:hover:bg-[#3d3e3f]"
                      >
                        <SettingsIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        <span>{t('sidebar.accountSettings')}</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => { onSignOut(); setIsUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-[#dde3ea] dark:hover:bg-[#3d3e3f]"
                      >
                        <SignOutIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        <span>{t('sidebar.signOut')}</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <button 
                onClick={handleAvatarClick}
                className="w-full flex items-center gap-3 px-2 py-1 rounded-full hover:bg-[#dde3ea] dark:hover:bg-[#2f3031] cursor-pointer"
                title={t('sidebar.changeAvatar')}
              >
                {userAvatar ? (
                  <img src={userAvatar} alt="User Avatar" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <UserIcon className="w-8 h-8 p-1 bg-gray-300 dark:bg-gray-500 rounded-full"/>
                )}
                <span className="text-sm font-medium">{t('sidebar.user')}</span>
              </button>
               <button 
                onClick={onSignIn}
                className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-2 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={t('sidebar.signInWithGoogle')}
              >
                <GoogleIcon className="w-5 h-5" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('sidebar.signInWithGoogle')}</span>
              </button>
            </>
          )}

        </div>
      </nav>
    </>
  );
};
