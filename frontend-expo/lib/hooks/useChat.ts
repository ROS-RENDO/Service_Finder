import { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "@/lib/contexts/AuthContext";

export interface ChatConversation {
  id: string;
  otherUser: {
    id: string;
    name: string;
    role: string;
    avatar: string | null;
  } | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

interface UseConversationsResult {
  conversations: ChatConversation[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseMessagesResult {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  sendMessage: (params: {
    content: string;
    conversationId?: string;
    recipientId?: string;
  }) => Promise<{ success: boolean; conversationId?: string; error?: string }>;
  refetch: (conversationId: string) => Promise<void>;
}

export function useConversations(): UseConversationsResult {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/conversations`,
        { credentials: "include" },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to load conversations");
      }
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch (err: any) {
      setError(err.message || "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return { conversations, loading, error, refetch: fetchConversations };
}

export function useMessages(conversationId?: string): UseMessagesResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/conversations/${id}/messages`,
        { credentials: "include" },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to load messages");
      }
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err: any) {
      setError(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    }
  }, [conversationId, fetchMessages]);

  const sendMessage = useCallback(
    async ({
      content,
      conversationId: convoId,
      recipientId,
    }: {
      content: string;
      conversationId?: string;
      recipientId?: string;
    }) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/conversations/messages`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content,
              conversationId: convoId,
              recipientId,
            }),
          },
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return {
            success: false,
            error: data.error || "Failed to send message",
          };
        }

        const newMessage: ChatMessage = data.message;
        setMessages((prev) => [...prev, newMessage]);

        return { success: true, conversationId: data.conversationId };
      } catch (err: any) {
        return {
          success: false,
          error: err.message || "Failed to send message",
        };
      }
    },
    [],
  );

  return {
    messages,
    loading,
    error,
    sendMessage,
    refetch: fetchMessages,
  };
}

