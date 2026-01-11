import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Conversation, workers } from "@/data/mockData";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

const ConversationItem = ({ conversation, isActive, onClick }: ConversationItemProps) => {
  const worker = workers.find((w) => w.id === conversation.workerId);

  if (!worker) return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left hover:bg-accent",
        isActive && "bg-accent"
      )}
    >
      <div className="relative flex-shrink-0">
        <img
          src={worker.avatar}
          alt={worker.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        {worker.isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-success" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-medium text-foreground truncate">{worker.name}</h4>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {formatDistanceToNow(conversation.lastMessageTime, { addSuffix: false })}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-sm text-muted-foreground truncate">
            {conversation.lastMessage}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="flex-shrink-0 h-5 min-w-[20px] px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;
