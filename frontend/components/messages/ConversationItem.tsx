import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import type { ChatConversation } from "@/lib/hooks/useChat";

interface ConversationItemProps {
  conversation: ChatConversation;
  isActive: boolean;
  onClick: () => void;
}

const ConversationItem = ({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) => {
  const other = conversation.otherUser;

  if (!other) return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left hover:bg-accent",
        isActive && "bg-accent"
      )}
    >
      <div className="relative shrink-0">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
          {other.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={other.avatar}
              alt={other.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            (other.name || "?")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-medium text-foreground truncate">
            {other.name}
          </h4>
          {conversation.lastMessageTime && (
            <span className="text-xs text-muted-foreground shrink-0">
              {formatDistanceToNow(new Date(conversation.lastMessageTime), {
                addSuffix: false,
              })}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-sm text-muted-foreground truncate">
            {conversation.lastMessage}
          </p>
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;
