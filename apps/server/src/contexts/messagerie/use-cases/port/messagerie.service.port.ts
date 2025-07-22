import { Result } from '@/libs/result';
export const MESSAGING_SERVICE_PORT = Symbol('MessagingServicePort');

export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  receiver: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
  conversationId: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatarUrl: string;
  messages: Message[];
  lastMessage: Message;
  users: {
    id: string;
    name: string;
    avatarUrl: string;
  }[];
  owner: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface MessagerieServicePort {
  sendMessage(params: {
    conversationId: string;
    senderId: string;
    content: string;
    attachments?: string[];
  }): Promise<Result<Message, Error>>;
  receiveMessage(conversationId: string): Promise<Result<Message, Error>>;
  getAllMessages(conversationId: string): Promise<Result<Message[], Error>>;
  editMessage(params: {
    messageId: string;
    editorId: string;
    newContent: string;
  }): Promise<Result<Message, Error>>;
  deleteMessage(messageId: string): Promise<Result<Message, Error>>;
  createConversation(params: {
    ownerId: string;
    userIds: string[];
    name?: string;
    avatarUrl?: string;
  }): Promise<Result<Conversation, Error>>;
  getConversation(conversationId: string): Promise<Result<Conversation, Error>>;
  getAllConversations(userId: string): Promise<Result<Conversation[], Error>>;
  deleteConversation(
    conversationId: string,
    deleterId: string,
  ): Promise<Result<Conversation, Error>>;
}
