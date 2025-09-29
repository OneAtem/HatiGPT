export interface GroundingChunk {
  // fix: The 'web' property from the Gemini API can be optional. Making it optional here to match the library's type definition.
  web?: {
    // fix: `uri` is optional in the Gemini API response.
    uri?: string;
    // fix: `title` is also optional in the Gemini API response, which fixes the type error.
    title?: string;
  };
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  image?: {
    mimeType: string;
    data: string; // base64 encoded string
  };
  file?: {
    name: string;
    content: string; // extracted text
  };
  sources?: GroundingChunk[];
  isError?: boolean;
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  messages: Message[];
}

export interface User {
  name: string;
  email: string;
  avatar: string;
}
