import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, GlobeIcon, PaperclipIcon, XCircleIcon, VentingIcon, FileIcon, BrainCircuitIcon } from './icons';

declare const pdfjsLib: any;

interface ChatInputProps {
  onSendMessage: (message: string, image?: { mimeType: string, data: string }, file?: { name: string, content: string }) => void;
  isLoading: boolean;
  isWebSearchEnabled: boolean;
  onWebSearchToggle: () => void;
  isUltimateModelEnabled: boolean;
  onUltimateModelToggle: () => void;
  isVentingModeEnabled: boolean;
  onVentingModeToggle: () => void;
  t: (key: string) => string;
}

const fileToBase64 = (file: File): Promise<{ mimeType: string, data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [header, data] = result.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || file.type;
      if (data) {
        resolve({ mimeType, data });
      } else {
        reject(new Error('Failed to read file as base64.'));
      }
    };
    reader.onerror = error => reject(error);
  });
};


export const ChatInput: React.FC<ChatInputProps> = ({ 
    onSendMessage, 
    isLoading, 
    isWebSearchEnabled, onWebSearchToggle, 
    isUltimateModelEnabled, onUltimateModelToggle,
    isVentingModeEnabled, onVentingModeToggle,
    t 
}) => {
  const [input, setInput] = useState('');
  const [image, setImage] = useState<{ file: File, preview: string, data: { mimeType: string, data: string } } | null>(null);
  const [fileAttachment, setFileAttachment] = useState<{ name: string; content: string } | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [processingFileName, setProcessingFileName] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };
  
  useEffect(adjustTextareaHeight, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || image || fileAttachment) && !isLoading && !isProcessingFile) {
      onSendMessage(input, image?.data, fileAttachment);
      setInput('');
      setImage(null);
      setFileAttachment(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
      return;
    }

    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;
    
    // Auto-pairing for brackets and quotes
    const pairs: { [key: string]: string } = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' };
    const openingChars = Object.keys(pairs);
    const closingChars = Object.values(pairs);

    if (openingChars.includes(e.key)) {
        e.preventDefault();
        const openingChar = e.key;
        const closingChar = pairs[openingChar as keyof typeof pairs];

        let newText;
        let newSelectionStart = selectionStart + 1;
        let newSelectionEnd = newSelectionStart;
        
        // If text is selected, wrap it
        if (selectionStart !== selectionEnd) {
            const selectedText = value.substring(selectionStart, selectionEnd);
            newText = `${value.substring(0, selectionStart)}${openingChar}${selectedText}${closingChar}${value.substring(selectionEnd)}`;
            newSelectionEnd = selectionStart + 1 + selectedText.length;
        } else { // If no text is selected, insert pair and place cursor in between
            newText = `${value.substring(0, selectionStart)}${openingChar}${closingChar}${value.substring(selectionStart)}`;
        }

        setInput(newText);

        // Await state update to set selection
        requestAnimationFrame(() => {
            textarea.selectionStart = newSelectionStart;
            textarea.selectionEnd = newSelectionEnd;
        });
        return;
    }

    // Auto-delete pair on backspace
    if (e.key === 'Backspace' && selectionStart === selectionEnd && selectionStart > 0) {
        const charBefore = value[selectionStart - 1];
        const charAfter = value[selectionStart];

        if (pairs[charBefore as keyof typeof pairs] === charAfter) {
            e.preventDefault();
            const newText = value.substring(0, selectionStart - 1) + value.substring(selectionStart + 1);
            setInput(newText);

            requestAnimationFrame(() => {
                textarea.selectionStart = selectionStart - 1;
                textarea.selectionEnd = selectionStart - 1;
            });
            return;
        }
    }

    // Skip over closing character
    if (closingChars.includes(e.key) && selectionStart === selectionEnd) {
        const charAfter = value[selectionStart];
        if (e.key === charAfter) {
            e.preventDefault();
            textarea.selectionStart = selectionStart + 1;
            textarea.selectionEnd = selectionStart + 1;
            return;
        }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const isSupportedImage = allowedImageTypes.includes(file.type);
    const isPdf = file.type === 'application/pdf';

    if (!isSupportedImage && !isPdf) {
      alert(t('errors.unsupportedFile'));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setIsProcessingFile(true);
    setProcessingFileName(file.name);
    setImage(null);
    setFileAttachment(null);

    try {
      if (isSupportedImage) {
        const preview = URL.createObjectURL(file);
        const data = await fileToBase64(file);
        setImage({ file, preview, data });
      } else if (isPdf) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            if (!event.target?.result) {
              throw new Error('File reading failed.');
            }
            const typedarray = new Uint8Array(event.target.result as ArrayBuffer);
            const pdf = await pdfjsLib.getDocument(typedarray).promise;
            let textContent = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const text = await page.getTextContent();
              textContent += text.items.map((s: any) => s.str).join(' ') + '\n';
            }
            setFileAttachment({ name: file.name, content: textContent });
          } catch (pdfError) {
            console.error('Error parsing PDF:', pdfError);
            alert(t('errors.pdfParsing'));
          } finally {
            setIsProcessingFile(false);
            setProcessingFileName(null);
          }
        };
        reader.onerror = () => {
          alert(t('errors.fileProcessing'));
          setIsProcessingFile(false);
          setProcessingFileName(null);
        };
        reader.readAsArrayBuffer(file);

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return; // Return to prevent resetting state prematurely
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert(t('errors.fileProcessing'));
    }

    // This will run for images, unsupported files, and general errors
    setIsProcessingFile(false);
    setProcessingFileName(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = () => {
    setImage(null);
    setFileAttachment(null);
  };
  
  const hasAttachment = image || fileAttachment;

  return (
    <div className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6 bg-white dark:bg-[#131314]">
      <div className="max-w-4xl mx-auto">
        {hasAttachment && (
          <div className="mb-2 p-2 bg-[#f0f4f9] dark:bg-[#1e1f20] rounded-lg relative w-fit">
            {image && <img src={image.preview} alt="Image preview" className="max-h-24 max-w-xs rounded-md object-contain" />}
            {fileAttachment && (
                <div className="flex items-center gap-2 p-2">
                    <FileIcon className="w-6 h-6 flex-shrink-0" />
                    <span className="text-sm truncate" title={fileAttachment.name}>{fileAttachment.name}</span>
                </div>
            )}
            <button 
              onClick={removeAttachment}
              className="absolute -top-2 -end-2 bg-gray-600 text-white rounded-full p-0.5 hover:bg-gray-800"
              aria-label={t('chatInput.removeImage')}
            >
              <XCircleIcon className="w-5 h-5" />
            </button>
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-end bg-[#f0f4f9] dark:bg-[#1e1f20] rounded-2xl"
        >
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp, image/gif, application/pdf"
            className="hidden"
          />
          <div className="absolute start-3 bottom-3 flex items-center gap-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label={t('chatInput.attachImage')}
                disabled={isLoading || isProcessingFile || !!hasAttachment}
              >
                <PaperclipIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={onVentingModeToggle}
                className={`p-2 rounded-full group transition-colors ${
                  isVentingModeEnabled 
                    ? 'bg-pink-500 text-white' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title={t('chatInput.toggleVentingMode')}
                disabled={isLoading || isProcessingFile}
              >
                <VentingIcon className="w-5 h-5" />
              </button>
               <button
                type="button"
                onClick={onUltimateModelToggle}
                className={`p-2 rounded-full transition-colors ${
                  isUltimateModelEnabled 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-label={t('chatInput.toggleUltimateModel')}
                title={t('chatInput.toggleUltimateModel')}
                disabled={isLoading || isProcessingFile}
              >
                <BrainCircuitIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={onWebSearchToggle}
                className={`p-2 rounded-full transition-colors ${
                  isWebSearchEnabled 
                    ? 'bg-blue-500 text-white' 
                    // @ts-ignore
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-label={t('chatInput.toggleWebSearch')}
                disabled={isLoading || isProcessingFile}
              >
                <GlobeIcon className="w-5 h-5" />
              </button>
          </div>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('chatInput.placeholder')}
            className={`w-full bg-transparent py-4 ps-48 resize-none focus:outline-none max-h-48 transition-all ${isProcessingFile ? 'pe-72' : 'pe-16'}`}
            rows={1}
            disabled={isLoading || isProcessingFile}
          />
          {isProcessingFile && processingFileName && (
            <div className="absolute end-16 bottom-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 pointer-events-none">
              <div className="w-5 h-5 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="truncate max-w-[12rem]">{`${t('chatInput.processing')} ${processingFileName}`}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading || isProcessingFile || (!input.trim() && !hasAttachment)}
            className="absolute end-3 bottom-3 p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed enabled:bg-gray-800 enabled:dark:bg-gray-200 enabled:text-white enabled:dark:text-black"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
        <p className="text-xs text-center text-gray-400 mt-2">
          {isVentingModeEnabled && <span className="font-semibold text-pink-500 dark:text-pink-400">{t('chatInput.ventingModeOn')}{' '}</span>}
          {isUltimateModelEnabled && <span className="font-semibold text-purple-500 dark:text-purple-400">{t('chatInput.ultimateModelOn')}{' '}</span>}
          {isWebSearchEnabled && <span className="font-semibold text-blue-500 dark:text-blue-400">{t('chatInput.webSearchOn')}{' '}</span>}
          {t('chatInput.disclaimer')}
        </p>
      </div>
    </div>
  );
};