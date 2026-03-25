"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Send,
  Paperclip,
  Loader2,
  AlertCircle,
  MessageSquare,
  FileText,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  isAdmin: boolean;
  createdAt: string;
  userId: string;
}

interface RequestConversation {
  id: string;
  title: string;
  status: string;
  project: {
    id: string;
    name: string;
  };
  messages: Message[];
  lastMessageAt: string;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "bg-amber-500/10", text: "text-amber-400" },
  IN_PROGRESS: { bg: "bg-blue-500/10", text: "text-blue-400" },
  IN_REVIEW: { bg: "bg-purple-500/10", text: "text-purple-400" },
  COMPLETED: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  CANCELLED: { bg: "bg-white/5", text: "text-white/30" },
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState<RequestConversation[]>([]);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/requests");
      if (!res.ok) throw new Error("Failed to fetch conversations");
      const data = await res.json();

      // Map requests to conversations, include all requests (even without messages)
      const convos: RequestConversation[] = data.requests.map(
        (req: {
          id: string;
          title: string;
          status: string;
          project: { id: string; name: string };
          messages: Message[];
        }) => ({
          id: req.id,
          title: req.title,
          status: req.status,
          project: req.project,
          messages: req.messages || [],
          lastMessageAt:
            req.messages && req.messages.length > 0
              ? req.messages[0].createdAt
              : "",
        })
      );

      // Sort: conversations with messages first, then by last message time
      convos.sort((a, b) => {
        if (a.lastMessageAt && !b.lastMessageAt) return -1;
        if (!a.lastMessageAt && b.lastMessageAt) return 1;
        if (a.lastMessageAt && b.lastMessageAt) {
          return (
            new Date(b.lastMessageAt).getTime() -
            new Date(a.lastMessageAt).getTime()
          );
        }
        return 0;
      });

      setConversations(convos);

      // Auto-select first conversation
      if (convos.length > 0 && !activeConvoId) {
        setActiveConvoId(convos[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [activeConvoId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Fetch messages for active conversation
  const fetchMessages = useCallback(async (requestId: string) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/messages?requestId=${requestId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data.messages);
    } catch {
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (activeConvoId) {
      fetchMessages(activeConvoId);
    }
  }, [activeConvoId, fetchMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConvoId) return;

    setSendingMessage(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: activeConvoId,
          content: newMessage,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setNewMessage("");
      await fetchMessages(activeConvoId);
    } catch {
      // keep the message so user can retry
    } finally {
      setSendingMessage(false);
    }
  };

  const activeConvo = conversations.find((c) => c.id === activeConvoId);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] overflow-hidden border border-white/[0.06]">
        <div className="w-72 shrink-0 border-r border-white/[0.06] bg-white/[0.01]">
          <div className="border-b border-white/[0.06] p-4">
            <div className="h-5 w-24 animate-pulse bg-white/[0.04]" />
          </div>
          <div className="space-y-2 p-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse bg-white/[0.02]" />
            ))}
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Loader2 size={24} className="animate-spin text-white/20" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 border border-red-500/20 bg-red-500/5 p-5">
        <AlertCircle size={18} className="text-red-400" />
        <p className="text-[14px] text-red-400">{error}</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center border border-dashed border-white/[0.06]">
        <MessageSquare size={32} className="mb-3 text-white/10" />
        <p className="text-[14px] text-white/30">No conversations yet</p>
        <p className="mt-1 text-[12px] text-white/20">
          Create a request to start a conversation
        </p>
      </div>
    );
  }

  function formatTime(dateStr: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return `${Math.floor(diffMs / 60000)}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden border border-white/[0.06]">
      {/* Conversations list */}
      <div className="w-72 shrink-0 border-r border-white/[0.06] bg-white/[0.01] overflow-y-auto">
        <div className="border-b border-white/[0.06] p-4">
          <h3 className="text-sm font-semibold text-white">Messages</h3>
          <p className="mt-0.5 font-mono-accent text-[10px] tracking-wider text-white/25">
            {conversations.length} CONVERSATIONS
          </p>
        </div>
        <div className="space-y-0.5 p-2">
          {conversations.map((convo) => {
            const style = statusColors[convo.status] || statusColors.PENDING;
            const lastMsg =
              convo.messages.length > 0 ? convo.messages[0] : null;

            return (
              <button
                key={convo.id}
                onClick={() => setActiveConvoId(convo.id)}
                className={`flex w-full items-start gap-3 px-3 py-3 text-left transition-colors ${
                  activeConvoId === convo.id
                    ? "bg-white/[0.05]"
                    : "hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF541F]/10">
                  <FileText size={14} className="text-[#FF541F]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-white/80">
                      {convo.title}
                    </p>
                    {convo.lastMessageAt && (
                      <span className="shrink-0 text-[10px] text-white/20">
                        {formatTime(convo.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-white/30">
                    {lastMsg
                      ? lastMsg.content.slice(0, 50) +
                        (lastMsg.content.length > 50 ? "..." : "")
                      : "No messages yet"}
                  </p>
                  <span
                    className={`mt-1 inline-block px-1.5 py-0.5 font-mono-accent text-[8px] tracking-wider ${style.bg} ${style.text}`}
                  >
                    {convo.status.replace("_", " ")}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col">
        {/* Chat header */}
        {activeConvo && (
          <div className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF541F]/10">
              <FileText size={14} className="text-[#FF541F]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {activeConvo.title}
              </p>
              <p className="text-[11px] text-white/30">
                {activeConvo.project.name}
              </p>
            </div>
            <span
              className={`shrink-0 px-2 py-0.5 font-mono-accent text-[9px] tracking-wider ${
                (statusColors[activeConvo.status] || statusColors.PENDING).bg
              } ${(statusColors[activeConvo.status] || statusColors.PENDING).text}`}
            >
              {activeConvo.status.replace("_", " ")}
            </span>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {loadingMessages ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 size={24} className="animate-spin text-white/20" />
            </div>
          ) : messages.length > 0 ? (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${!msg.isAdmin ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2.5 ${
                      !msg.isAdmin
                        ? "bg-[#FF541F] text-white"
                        : "bg-white/[0.05] text-white/80"
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className={`font-mono-accent text-[10px] tracking-wider ${
                          !msg.isAdmin ? "text-white/70" : "text-white/40"
                        }`}
                      >
                        {msg.isAdmin ? "CONNECTO TEAM" : "YOU"}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p
                      className={`mt-1 text-[10px] ${
                        !msg.isAdmin ? "text-white/50" : "text-white/20"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      &middot;{" "}
                      {new Date(msg.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <MessageSquare size={24} className="mb-2 text-white/10" />
              <p className="text-[13px] text-white/25">
                No messages yet. Start the conversation.
              </p>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-white/[0.06] p-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <button
              type="button"
              className="text-white/30 transition-colors hover:text-white/60"
            >
              <Paperclip size={18} />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#FF541F]/40"
              disabled={!activeConvoId}
            />
            <button
              type="submit"
              disabled={sendingMessage || !newMessage.trim() || !activeConvoId}
              className="flex h-[42px] w-[42px] items-center justify-center bg-[#FF541F] text-white transition-colors hover:bg-[#FF541F]/90 disabled:opacity-50"
            >
              {sendingMessage ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
