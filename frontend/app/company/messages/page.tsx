"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ChatBubble from "@/components/messages/ChatBubble";
import ConversationItem from "@/components/messages/ConversationItem";
import { Button } from "@/components/ui/button";
import {
    Send,
    ArrowLeft,
    Phone,
    Video,
    MoreVertical,
    ImageIcon,
    Paperclip,
    Smile,
    MessageCircle,
} from "lucide-react";
import { useConversations, useMessages } from "@/lib/hooks/useChat";
import { useAuthContext } from "@/lib/contexts/AuthContext";
import { toast } from "sonner";

const Messages = () => {
    const searchParams = useSearchParams();
    const { user } = useAuthContext();
    const { conversations, refetch: refetchConversations } = useConversations();

    const [activeConversationId, setActiveConversationId] = useState<
        string | null
    >(null);
    const [newMessage, setNewMessage] = useState("");
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [newChatUser, setNewChatUser] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { messages, sendMessage } = useMessages(
        activeConversationId || undefined,
    );

    const activeConversation = conversations.find(
        (c) => c.id === activeConversationId,
    );

    // Determine who we are displaying
    const displayUser = activeConversation?.otherUser || newChatUser;

    useEffect(() => {
        const fetchUserInfo = async (id: string) => {
            try {
                // Need token
                const token = localStorage.getItem('token') || '';
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    // Map to format matching conversation.otherUser
                    setNewChatUser({
                        id: data.user.id.toString(),
                        name: data.user.fullName,
                        role: data.user.role,
                        avatar: data.user.avatar
                    });
                } else {
                    toast.error("User not found");
                }
            } catch (e) {
                console.error("Failed to fetch user info", e);
                toast.error("Failed to load user info");
            }
        };

        const conversationParam = searchParams.get("conversation");
        const newParam = searchParams.get("new");

        if (conversationParam) {
            setActiveConversationId(conversationParam);
            setShowMobileChat(true);
            setNewChatUser(null);
        } else if (newParam) {
            // Check if we already have a conversation with this user
            // Note: conversation.otherUser might be null if user is deleted, check carefully
            const existing = conversations.find(c => c.otherUser?.id === newParam);

            if (existing) {
                setActiveConversationId(existing.id);
                setNewChatUser(null);
            } else {
                setActiveConversationId(null);
                // Fetch user info
                fetchUserInfo(newParam);
            }
            setShowMobileChat(true);
        } else if (conversations.length > 0 && !activeConversationId) {
            // Only default select if NO params provided
            if (!newParam) {
                setActiveConversationId(conversations[0].id);
                setNewChatUser(null);
            }
        }
    }, [searchParams, conversations]); // Intentionally omitting activeConversationId to avoid loops

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        if (!activeConversationId && !newChatUser) return;

        // recipientId is needed if starting a NEW conversation
        const recipientId = activeConversationId ? undefined : newChatUser?.id;

        const result = await sendMessage({
            content: newMessage,
            conversationId: activeConversationId || undefined,
            recipientId: recipientId,
        });

        if (result.success) {
            if (!activeConversationId && result.conversationId) {
                // New conversation created successfully
                setActiveConversationId(result.conversationId);
                setNewChatUser(null); // No longer "new"
                // Also refetch conversations list so it appears in sidebar
                refetchConversations();
            }
            setNewMessage("");
        } else {
            toast.error("Failed to send message: " + (result.error || "Unknown error"));
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <main className="container py-6">
                <div className="rounded-2xl border border-border bg-card shadow-soft-sm overflow-hidden h-[calc(100vh-8rem)]">
                    <div className="flex h-full">
                        {/* Conversations List */}
                        <div
                            className={`w-full md:w-80 lg:w-96 border-r border-border flex flex-col ${showMobileChat ? "hidden md:flex" : "flex"
                                }`}
                        >
                            <div className="p-4 border-b border-border">
                                <h1 className="font-display text-xl font-semibold text-foreground">
                                    Messages
                                </h1>
                            </div>

                            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                {conversations.length > 0 ? (
                                    conversations.map((conv) => (
                                        <ConversationItem
                                            key={conv.id}
                                            conversation={conv}
                                            isActive={activeConversationId === conv.id}
                                            onClick={() => {
                                                setActiveConversationId(conv.id);
                                                setNewChatUser(null);
                                                setShowMobileChat(true);
                                            }}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
                                        <p>No conversations yet</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div
                            className={`flex-1 flex flex-col ${showMobileChat ? "flex" : "hidden md:flex"
                                }`}
                        >
                            {displayUser ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="flex items-center gap-4 p-4 border-b border-border bg-card">
                                        <button
                                            onClick={() => setShowMobileChat(false)}
                                            className="md:hidden text-muted-foreground hover:text-foreground"
                                        >
                                            <ArrowLeft className="h-5 w-5" />
                                        </button>

                                        <div className="relative">
                                            {displayUser.avatar ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={displayUser.avatar}
                                                    alt={displayUser.name}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                                                    {displayUser.name
                                                        .split(" ")
                                                        .map((n: string) => n[0])
                                                        .join("")
                                                        .slice(0, 2)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h2 className="font-semibold text-foreground truncate">
                                                {displayUser.name}
                                            </h2>
                                            <p className="text-xs text-muted-foreground">
                                                {displayUser.role?.replace('_', ' ')}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground"
                                            >
                                                <Phone className="h-5 w-5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground"
                                            >
                                                <Video className="h-5 w-5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground"
                                            >
                                                <MoreVertical className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
                                        {messages.length > 0 ? (
                                            messages.map((msg) => (
                                                <ChatBubble
                                                    key={msg.id}
                                                    message={msg}
                                                    currentUserId={user ? String(user.id) : null}
                                                />
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-muted-foreground">
                                                <p className="text-sm">
                                                    Start a conversation with {displayUser.name}
                                                </p>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Message Input */}
                                    <div className="p-4 border-t border-border bg-card">
                                        <div className="flex items-end gap-2">
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-muted-foreground h-9 w-9"
                                                >
                                                    <Paperclip className="h-5 w-5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-muted-foreground h-9 w-9"
                                                >
                                                    <ImageIcon className="h-5 w-5" />
                                                </Button>
                                            </div>

                                            <div className="flex-1 relative">
                                                <input
                                                    type="text"
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                                    placeholder="Type a message..."
                                                    className="w-full rounded-full border border-border bg-secondary/50 py-2.5 pl-4 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                                                >
                                                    <Smile className="h-5 w-5" />
                                                </Button>
                                            </div>

                                            <Button
                                                onClick={handleSend}
                                                size="icon"
                                                className="h-10 w-10 rounded-full"
                                                disabled={!newMessage.trim() || !displayUser}
                                            >
                                                <Send className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
                                    <div>
                                        <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                        <p className="text-lg font-medium text-foreground">
                                            Select a conversation
                                        </p>
                                        <p className="text-sm mt-1">
                                            Choose a chat to start messaging
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Messages;
