import React, { useEffect, useRef, useState, useMemo } from "react";
import { API } from "../Services/Api";
import { socket } from "../Services/Socket.js";
import { useSelector } from "react-redux";
import themes from "../Utils/themes";
import { motion, AnimatePresence } from "framer-motion";

import ChatList from "../Components/ChatList";
import MessageBubble from "../Components/MessageBubble";
import MessageInput from "../Components/MessageInput";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";

const ChatPage = () => {
  const theme = themes.zynk;
  const { user } = useSelector((state) => state.auth);

  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);

  const bottomRef = useRef(null);
  const selectedChatRef = useRef(null);
  const navigate = useNavigate();

  const userId = user?._id || user?.id;

  // keep latest selected chat
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  // ================= SOCKET =================
  useEffect(() => {
    if (!userId) return;

    socket.emit("setup", { _id: userId });

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users || []);
    };

    const handleTyping = ({ chatId, userName }) => {
      if (chatId !== selectedChatRef.current?._id) return;

      setTypingUsers((prev) => ({
        ...prev,
        [chatId]: userName,
      }));
    };

    const handleStopTyping = ({ chatId }) => {
      setTypingUsers((prev) => {
        const updated = { ...prev };
        delete updated[chatId];
        return updated;
      });
    };

    socket.on("get_online_users", handleOnlineUsers);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("get_online_users", handleOnlineUsers);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [userId]);

  // ================= FETCH =================
  const fetchUsers = async () => {
    try {
      const res = await API.get("/api/users");
      setUsers(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
      setUsers([]);
    }
  };

  const fetchChats = async () => {
    try {
      const res = await API.get("/api/chats");
      setChats(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
      setChats([]);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await API.get(`/api/messages/chat/${chatId}`);
      const data = res.data?.data;

      setMessages(Array.isArray(data) ? data : []);

      socket.emit("join_chat", chatId);
      markAsSeen(chatId);
    } catch {
      setMessages([]);
    }
  };

  // ================= SEND =================

  const getMessageType = (mime) => {
    if (!mime) return "file";

    if (mime.startsWith("image/")) return "image";
    if (mime.startsWith("video/")) return "video";
    if (mime.startsWith("audio/")) return "audio";

    return "file";
  };

  const handleSend = async ({ text, fileData }) => {
    if (!selectedChat?._id) return;

    try {
      let payload = {
        chatId: selectedChat._id,
        content: text?.trim() || "",
        messageType: "text",
      };

      if (fileData) {
        payload = {
          chatId: selectedChat._id,
          content: text?.trim() || " ",
          fileUrl: fileData.url,
          fileName: fileData.originalName,
          fileSize: fileData.size,
          mimeType: fileData.mimeType,
          messageType: getMessageType(fileData.mimeType),
        };
      }

      if (!fileData && !payload.content.trim()) return;

      const res = await API.post("/api/messages", payload);
      const msg = res.data?.data;
      if (!msg) return;

      setMessages((prev) => [...prev, msg]);
      socket.emit("new_message", msg);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= SEEN =================
  const markAsSeen = async (chatId) => {
    try {
      await API.patch("/api/messages/seen", { chatId });

      socket.emit("message_seen", { chatId, userId });

      setChats((prev) =>
        prev.map((c) => (c._id === chatId ? { ...c, unreadCount: 0 } : c)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ================= RECEIVE =================
  useEffect(() => {
    const handleReceive = (msg) => {
      if (!msg?.chat?._id) return;

      const chatId = msg.chat._id;

      setChats((prev) => {
        const updated = [...prev];
        const index = updated.findIndex((c) => c._id === chatId);

        if (index === -1) return prev;

        const chat = updated[index];

        const updatedChat = {
          ...chat,
          latestMessage: msg,
          unreadCount:
            selectedChatRef.current?._id === chatId
              ? 0
              : (chat.unreadCount || 0) + 1,
        };

        updated.splice(index, 1);
        updated.unshift(updatedChat);

        return updated;
      });

      if (chatId === selectedChatRef.current?._id) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === msg._id);
          return exists ? prev : [...prev, msg];
        });

        markAsSeen(chatId);
      }
    };

    socket.on("message_received", handleReceive);

    return () => {
      socket.off("message_received", handleReceive);
    };
  }, [userId, selectedChat]);

  // ================= DELETE =================

  const toggleSelectMessage = (msg) => {
    setSelectionMode(true);

    setSelectedMessages((prev) => {
      const exists = prev.find((m) => m._id === msg._id);

      if (exists) {
        const updated = prev.filter((m) => m._id !== msg._id);

        if (updated.length === 0) {
          setSelectionMode(false);
        }

        return updated;
      }

      return [...prev, msg];
    });
  };

  const handleMessageClick = (msg) => {
    if (selectionMode) {
      toggleSelectMessage(msg);
      return;
    }

    // VIEW LOGIC
    if (msg.messageType === "image") {
      window.open(msg.fileUrl, "_blank");
    }

    if (msg.messageType === "file") {
      window.open(msg.fileUrl, "_blank");
    }

    if (msg.messageType === "video") {
      window.open(msg.fileUrl, "_blank");
    }

    if (msg.messageType === "audio") {
      window.open(msg.fileUrl, "_blank");
    }
  };

  const handleDeleteMessages = async () => {
    try {
      const ids = selectedMessages
        .filter((m) => m.sender._id === userId)
        .map((m) => m._id);

      const res = await API.patch("/api/messages/delete-many", {
        messageIds: ids,
      });

      const deletedIds = res.data?.data?.deletedIds || ids;

      setMessages((prev) =>
        prev.map((m) =>
          deletedIds.includes(m._id)
            ? { ...m, isDeleted: true, content: "" }
            : m,
        ),
      );

      setSelectedMessages([]);
      setSelectionMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= INIT =================
  useEffect(() => {
    fetchChats();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedChat?._id) return;

    const chatId = selectedChat._id;

    socket.emit("leave_chat", selectedChatRef.current?._id);
    socket.emit("join_chat", chatId);

    fetchMessages(chatId);

    return () => {
      socket.emit("leave_chat", chatId);
    };
  }, [selectedChat?._id]);

  // ================= SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= DERIVED =================
  const otherUser = useMemo(() => {
    if (!selectedChat || selectedChat.isGroupChat) return null;

    return selectedChat.users?.find(
      (u) => u?._id?.toString() !== userId?.toString(),
    );
  }, [selectedChat, userId]);

  const isOtherOnline = otherUser
    ? onlineUsers.some((id) => id?.toString() === otherUser._id?.toString())
    : false;

  const avatarSrc = useMemo(() => {
    if (!selectedChat) return null;

    if (selectedChat.isGroupChat) {
      return `https://ui-avatars.com/api/?name=${selectedChat.chatName}`;
    }

    return (
      otherUser?.avatar?.url ||
      otherUser?.avatar ||
      `https://ui-avatars.com/api/?name=${otherUser?.name || "User"}`
    );
  }, [selectedChat, otherUser]);

  // ================= UI =================
  return (
    <div className={`h-screen w-screen ${theme.pageGradient}`}>
      {/* APP CONTAINER */}
      <div className="h-full w-full flex relative overflow-hidden">
        {/* LEFT SIDEBAR */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`
          ${selectedChat ? "hidden md:flex" : "flex"}
          flex-col
          w-full md:w-[300px] lg:w-[340px] xl:w-[440px]
          flex-shrink-0
          h-full
          border-r border-slate-800
          bg-slate-950/40 backdrop-blur-xl
        `}
        >
          <ChatList
            chats={chats}
            users={users}
            user={user}
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
            typingUsers={typingUsers}
            setChats={setChats}
            onOpenGroupInfo={(groupId) => navigate(`/group/${groupId}`)}
            onlineUsers={onlineUsers}
          />
        </motion.div>

        {/* RIGHT CHAT AREA */}
        <div
          className={`
    ${!selectedChat ? "hidden md:flex" : "flex"}
    flex-1 min-w-0 flex flex-col h-full
  `}
        >
          {/* HEADER */}
          <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <div className="w-full px-1 sm:px-4 py-3 flex items-center">
              {selectedChat && (
                <>
                  {/* BACK BUTTON */}
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden mr-2 text-white"
                  >
                    <FiArrowLeft size={20} />
                  </button>

                  {/* AVATAR */}
                  <div className="relative mr-3">
                    <img
                      src={avatarSrc}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    {!selectedChat.isGroupChat && (
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                          isOtherOnline ? "bg-green-500" : "bg-gray-500"
                        }`}
                      />
                    )}
                  </div>

                  {/* INFO */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-white font-semibold truncate">
                      {selectedChat.isGroupChat
                        ? selectedChat.chatName
                        : otherUser?.name}
                    </h2>

                    <p className="text-xs text-slate-400 truncate">
                      {typingUsers[selectedChat?._id]
                        ? `✍️ ${typingUsers[selectedChat._id]} typing...`
                        : isOtherOnline
                          ? "🟢 Online"
                          : "Offline"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 min-w-0 overflow-y-auto px-1 sm:px-4 py-3">
            <div className="w-full space-y-3">
              {selectedChat ? (
                messages?.length > 0 ? (
                  messages.map((msg) => (
                    <MessageBubble
                      key={msg._id}
                      message={msg}
                      isOwn={
                        msg?.sender?._id?.toString() === userId?.toString()
                      }
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-10">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl shadow-xl"
                    >
                      💬
                    </motion.div>

                    <h2 className="mt-6 text-2xl font-bold text-white">
                      No messages yet
                    </h2>

                    <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                      Start your conversation now and connect instantly with
                      others.
                    </p>

                    <div className="mt-4 space-y-1 text-xs text-slate-500">
                      <p>⚡ Send text, images & files</p>
                      <p>🟢 Real-time messaging</p>
                      <p>🔔 Instant notifications</p>
                    </div>

                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="mt-6 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm backdrop-blur-md"
                    >
                      🚀 Send your first message
                    </motion.div>
                  </div>
                )
              ) : (
                <div className="flex flex-col md:flex-row items-center justify-center h-full min-h-[60vh] text-center md:text-left gap-6 md:gap-12 px-4 sm:px-6 relative overflow-hidden">
                  {/* LEFT CONTENT */}
                  <div className="flex flex-col items-center md:items-start max-w-sm w-full z-10">
                    <motion.div
                      animate={{ rotate: [0, 8, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-3xl sm:text-4xl shadow-2xl"
                    >
                      👋
                    </motion.div>

                    <h1 className="mt-5 sm:mt-6 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                      Welcome to Zynk Chat
                    </h1>

                    <p className="text-slate-400 mt-3 text-xs sm:text-sm leading-relaxed">
                      Select a conversation or start a new one to begin chatting
                      in real-time.
                    </p>

                    <div className="mt-4 space-y-1 text-[11px] sm:text-xs text-slate-500">
                      <p>💬 Chat with friends instantly</p>
                      <p>📁 Share files & media</p>
                      <p>👥 Create group conversations</p>
                    </div>

                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="mt-5 sm:mt-6 px-3 sm:px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs sm:text-sm backdrop-blur-md"
                    >
                      👈 Choose a chat to start
                    </motion.div>
                  </div>

                  {/* RIGHT IMAGE */}
                  <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative z-10 mt-6 md:mt-0"
                  >
                    <motion.img
                      src="https://cdn.phototourl.com/free/2026-04-12-30057522-9957-4f9e-9e1d-a5f47b184e5b.png"
                      alt="welcome"
                      className="w-44 sm:w-56 md:w-72 lg:w-80 mx-auto drop-shadow-2xl"
                      animate={{ y: [0, -15, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 5,
                        ease: "easeInOut",
                      }}
                    />

                    <div className="absolute inset-0 rounded-full border border-pink-500/20 blur-xl"></div>
                  </motion.div>
                </div>
              )}
            </div>
          </div>

          {/* INPUT */}
          {selectedChat && (
            <div className="border-t border-slate-800 bg-slate-900/60 backdrop-blur-md">
              <div className="px-3 sm:px-4 py-2">
                <MessageInput
                  onSend={handleSend}
                  selectedChat={selectedChat}
                  user={user}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
