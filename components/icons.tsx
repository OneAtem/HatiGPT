import React from 'react';

export const HatiLogo: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`relative ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#89f7fe' }} />
          <stop offset="100%" style={{ stopColor: '#66a6ff' }} />
        </linearGradient>
        <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#a8c0ff' }} />
          <stop offset="100%" style={{ stopColor: '#3f2b96' }} />
        </linearGradient>
      </defs>
      <path d="M50 0 L61.8 38.2 L100 38.2 L69.1 61.8 L80.9 100 L50 76.4 L19.1 100 L30.9 61.8 L0 38.2 L38.2 38.2 Z" fill="url(#g1)" />
    </svg>
  </div>
);


export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

export const MessageSquareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 19.5V7.5A2.25 2.25 0 015.25 5.25h5.25m5.811 1.593l4.896-4.896m-4.896 4.896l-4.896-4.896m4.896 4.896V2.25" />
  </svg>
);


export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L21 3m0 0l-6.75 18L10.5 13.5 4.5 10.5z" />
  </svg>
);

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.423-1.423L13.102 18l1.188-.648a2.25 2.25 0 011.423-1.423L16.25 15l.648 1.188a2.25 2.25 0 011.423 1.423L19.398 18l-1.188.648a2.25 2.25 0 01-1.423 1.423z"/>
    </svg>
);

export const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6.75" />
  </svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

export const GlobeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-2.485 0-4.5 4.03-4.5 9s2.015 9 4.5 9 4.5-4.03 4.5-9-2.015-9-4.5-9z" />
    </svg>
);

export const PaperclipIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" />
    </svg>
);

export const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const LanguageIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
    </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

export const VentingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a2.25 2.25 0 01-3.182 0l-3.72-3.72h-1.063c-1.136 0-1.98-.967-1.98-2.193v-4.286c0-.97.616-1.813 1.5-2.097M16.5 9.75c0 .621-.504 1.125-1.125 1.125H8.625c-.621 0-1.125-.504-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h6.75c.621 0 1.125.504 1.125 1.125v1.5z" />
        <path fill="currentColor" d="M12 12.215l-.725-.66c-1.78-1.63-2.9-2.78-2.9-4.23 0-1.22.98-2.2 2.2-2.2.68 0 1.35.31 1.78.8.43-.49 1.1-.8 1.78-.8 1.22 0 2.2.98 2.2 2.2 0 1.45-1.12 2.6-2.9 4.23l-.725.66z" />
    </svg>
);


export const FileIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

export const BrainCircuitIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9h7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12h-1.5m1.5 0h1.5m-1.5 0V9.75M12 12v2.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.25c-3.14 0-6-1.46-6-3.25S8.86 10.75 12 10.75s6 1.46 6 3.25-2.86 3.25-6 3.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 16.5c-1.32.91-2.97.91-4.5 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
);

export const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
        <g fill="none">
            <path fill="#4285F4" d="M21.545 11.92c0-.826-.073-1.627-.218-2.418H11.999v4.473h5.377c-.233 1.537-.94 2.864-2.205 3.777l3.53 2.724c2.045-1.883 3.218-4.8 3.218-8.155z"/>
            <path fill="#34A853" d="M11.999 21.999c2.704 0 5.163-.895 6.886-2.422l-3.53-2.724c-.895.605-2.03 1.005-3.356 1.005-2.585 0-4.773-1.758-5.555-4.105H2.75v2.814c1.37 2.895 4.354 4.832 7.25 4.832z"/>
            <path fill="#FBBC04" d="M6.444 13.164c-.267-.81-.42-1.664-.42-2.56s.153-1.75.42-2.56V5.226H2.75c-.682 1.343-1.086 2.857-1.086 4.474s.404 3.13 1.086 4.474l3.694-2.814z"/>
            <path fill="#EA4335" d="M11.999 6.268c1.468 0 2.788.504 3.83 1.422l3.121-3.12C17.158 2.19 14.7 1 12 1c-4.06 0-7.824 2.21-9.245 5.126l3.694 2.814c.782-2.347 2.972-4.105 5.555-4.105z"/>
        </g>
    </svg>
);

export const SignOutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);

export const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.008 1.11-1.223.55-.215 1.154-.112 1.63.292l.156.129a1.5 1.5 0 001.212.505h.094c.654 0 1.258.333 1.614.868l.058.093a1.5 1.5 0 00.936.634.67.67 0 01.12.018h.082c.621 0 1.18.356 1.472.91l.05.09a1.5 1.5 0 00.72 1.014l.092.054c.545.317.9.882.9 1.491v.14c0 .54-.257 1.05-.688 1.39l-.09.07a1.5 1.5 0 00.32 2.533l.054.093a1.5 1.5 0 01-.23 2.072l-.094.085c-.47.43-1.083.62-1.696.48l-.12-.03a1.5 1.5 0 00-1.352.73l-.054.093a1.5 1.5 0 01-1.022.72l-.12.022a1.5 1.5 0 00-.884.23l-.094.065c-.46.318-.997.49-1.55.49h-.18c-.552 0-1.09-.172-1.55-.49l-.094-.065a1.5 1.5 0 00-.884-.23l-.12-.022a1.5 1.5 0 01-1.022-.72l-.054-.093a1.5 1.5 0 00-1.352-.73l-.12.03c-.613.14-1.226-.05-1.696-.48l-.094-.085a1.5 1.5 0 01-.23-2.072l.054-.093a1.5 1.5 0 00.32-2.533l-.09-.07a1.5 1.5 0 01-.688-1.39v-.14c0-.61.355-1.174.9-1.491l.092-.054a1.5 1.5 0 00.72-1.014l.05-.09c.292-.553.85-.91 1.472-.91h.082a.67.67 0 01.12-.018 1.5 1.5 0 00.936-.634l.058-.093c.356-.535.96-.868 1.614-.868h.094a1.5 1.5 0 001.212-.505l.156-.13zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
  </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);
