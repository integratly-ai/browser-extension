export type Message = {
  chat_id: string;
  content: string;
  metadata: unknown;
  msg_id: string;
  timestamp: number;
  user_id: string;
};

export type History = {
  conversation: Message[];
};

export type NewMessage = {
  message: Message;
  status: 'ok' | 'no' | string;
};
