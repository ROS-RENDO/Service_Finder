"use client"
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ChatBubble from "@/components/messages/ChatBubble";
import ConversationItem from "@/components/messages/ConversationItem";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  conversations,
  messages,
  workers,
  currentUserId,
  Message,
} from "@/data/mockData";
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

const Messages = () => {
  const searchParams = useSearchParams();
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messagesList =
    activeConversationId && messages[activeConversationId]
      ? messages[activeConversationId]
      : [];

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );
  const activeWorker = activeConversation
    ? workers.find((w) => w.id === activeConversation.workerId)
    : null;

  useEffect(() => {
    const conversationParam = searchParams.get("conversation");
    const newWorkerParam = searchParams.get("new");

    if (conversationParam) {
      setActiveConversationId(conversationParam);
      setShowMobileChat(true);
    } else if (newWorkerParam) {
      const existingConv = conversations.find(
        (c) => c.workerId === newWorkerParam
      );
      if (existingConv) {
        setActiveConversationId(existingConv.id);
      } else {
        setActiveConversationId("new-" + newWorkerParam);
      }
      setShowMobileChat(true);
    } else if (conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
    }
  }, [searchParams]);


  const handleSend = () => {
    if (!newMessage.trim()) return;

    const timestamp = new Date();
    const newMsg: Message = {
      id: `m-${timestamp.getTime()}`,
      senderId: currentUserId,
      text: newMessage,
      timestamp: timestamp,
      isRead: false,
    };

    if (activeConversationId) {
      // eslint-disable-next-line react-hooks/immutability
      messages[activeConversationId] = [...messagesList, newMsg];
    }
    setNewMessage("");

    // Simulate response
    setTimeout(() => {
      const responseMsg: Message = {
        id: `m-${timestamp.getTime() + 1}`,
        senderId: activeWorker?.id || "1",
        text: "Thanks for your message! I'll get back to you shortly.",
        timestamp: new Date(),
        isRead: false,
      };
      if (activeConversationId) {
        messages[activeConversationId] = [
          ...messages[activeConversationId],
          responseMsg,
        ];
      }
    }, 1500);
  };

  const getNewWorker = () => {
    const newWorkerId = searchParams.get("new");
    if (newWorkerId) {
      return workers.find((w) => w.id === newWorkerId);
    }
    return null;
  };

  const displayWorker = activeWorker || getNewWorker();

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-6">
        <div className="rounded-2xl border border-border bg-card shadow-soft-sm overflow-hidden h-[calc(100vh-8rem)]">
          <div className="flex h-full">
            {/* Conversations List */}
            <div
              className={`w-full md:w-80 lg:w-96 border-r border-border flex flex-col ${
                showMobileChat ? "hidden md:flex" : "flex"
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
                        setShowMobileChat(true);
                      }}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>No conversations yet</p>
                    <Link
                      href="/"
                      className="text-primary text-sm hover:underline mt-2 inline-block"
                    >
                      Browse services
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div
              className={`flex-1 flex flex-col ${
                showMobileChat ? "flex" : "hidden md:flex"
              }`}
            >
              {displayWorker ? (
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
                      <Image
                        width={200}
                        height={200}
                        src={displayWorker.avatar}
                        alt={displayWorker.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      {displayWorker.isOnline && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-success" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-foreground truncate">
                        {displayWorker.name}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {displayWorker.isOnline ? "Online" : "Offline"}
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
                    {messagesList.length > 0 ? (
                      messagesList.map((msg) => (
                        <ChatBubble key={msg.id} message={msg} />
                      ))
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <p className="text-sm">
                          Start a conversation with {displayWorker.name}
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
                        disabled={!newMessage.trim()}
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
