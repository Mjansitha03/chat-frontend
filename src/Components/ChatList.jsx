import React, { useState, useMemo, useEffect } from "react";
import themes from "../Utils/themes";
import { API } from "../Services/Api";
import CreateGroupModal from "./CreateGroupModal";
import { useDispatch } from "react-redux";
import { logout } from "../Redux/authSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLogOut,
  FiPlus,
  FiUsers,
  FiUser,
  FiSearch,
  FiImage,
  FiVideo,
  FiMusic,
  FiFile,
} from "react-icons/fi";

const ChatList = ({
  chats = [],
  users = [],
  user,
  selectedChat,
  onSelectChat,
  typingUsers = {},
  setChats,
  onOpenGroupInfo,
  onlineUsers = [],
}) => {
  const theme = themes.zynk;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [localUsers, setLocalUsers] = useState([]);

  const safeChats = Array.isArray(chats) ? chats : [];
  const safeUsers = Array.isArray(users) ? users : [];

  const userId = user?._id?.toString() || user?.id?.toString();

  const isMeOnline = onlineUsers.some(
    (id) => id.toString() === user?._id?.toString(),
  );

  // ================= SYNC USERS =================
  useEffect(() => {
    setLocalUsers(safeUsers);
  }, [safeUsers]);

  useEffect(() => {
    const handleUpdate = async () => {
      try {
        const res = await API.get("/api/users");
        setLocalUsers(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error(err);
      }
    };

    window.addEventListener("profileUpdated", handleUpdate);
    return () => window.removeEventListener("profileUpdated", handleUpdate);
  }, []);

  // ================= LOGOUT =================
  const handleLogout = async () => {
    await API.post("/api/auth/logout");
    dispatch(logout());
    navigate("/login");
  };

  // ================= USERS =================
  const uniqueUsers = useMemo(() => {
    const map = new Map();
    localUsers.forEach((u) => u?._id && map.set(u._id, u));
    return Array.from(map.values());
  }, [localUsers]);

  const chatMap = useMemo(() => {
    const map = new Map();

    safeChats.forEach((chat) => {
      if (!chat?.isGroupChat) {
        const other = chat.users?.find((u) => u?._id?.toString() !== userId);
        if (other?._id) map.set(other._id, chat);
      }
    });

    return map;
  }, [safeChats, userId]);

  const combinedList = useMemo(() => {
    const list = [];

    safeChats.forEach((chat) => {
      if (chat.isGroupChat) list.push({ type: "group", chat });
    });

    uniqueUsers.forEach((u) => {
      list.push({
        type: "user",
        user: u,
        chat: chatMap.get(u._id) || null,
      });
    });

    return list;
  }, [safeChats, uniqueUsers, chatMap]);

  const filtered = combinedList.filter((item) => {
    if (item.type === "group") {
      return item.chat?.chatName?.toLowerCase().includes(search.toLowerCase());
    }
    return item.user?.name?.toLowerCase().includes(search.toLowerCase());
  });

  const handleClick = async ({ user: u, chat }) => {
    if (chat?._id) return onSelectChat(chat);

    const res = await API.post("/api/chats/private", {
      targetUserId: u._id,
    });

    const newChat = res.data?.data;

    if (newChat?._id) {
      setChats((prev) =>
        prev.some((c) => c._id === newChat._id) ? prev : [newChat, ...prev],
      );

      onSelectChat(newChat);
    }
  };

  const formatLastMessage = (chat) => {
    if (!chat?.latestMessage) return "Start conversation";

    const senderId = chat.latestMessage.sender?._id?.toString();

    const isAttachment = chat.latestMessage?.fileUrl;

    const content = chat.latestMessage?.content;

    const message = (
      <span className="flex items-center gap-1">
        {isAttachment ? (
          <>
            {chat.latestMessage.messageType === "image" && (
              <>
                <FiImage /> Photo
              </>
            )}

            {chat.latestMessage.messageType === "video" && (
              <>
                <FiVideo /> Video
              </>
            )}

            {chat.latestMessage.messageType === "audio" && (
              <>
                <FiMusic /> Audio
              </>
            )}

            {chat.latestMessage.messageType === "file" && (
              <>
                <FiFile /> File
              </>
            )}
          </>
        ) : (
          content
        )}
      </span>
    );

    return senderId === userId ? <span>You: {message}</span> : message;
  };

  return (
    <div
      className={`h-full ${theme.card} p-4 flex flex-col ${theme.cardShadow}`}
    >
      {/* ================= USER BAR ================= */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center"
        >
          <div
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <img
                src={
                  user.avatar?.url ||
                  `https://ui-avatars.com/api/?name=${user.name}`
                }
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow-md"
              />

              {/* ONLINE */}
              {isMeOnline && (
                <>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 animate-ping"></span>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-slate-900"></span>
                </>
              )}
            </motion.div>

            <div>
              <p className="text-white text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-slate-400">
                {isMeOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
          >
            <FiLogOut />
          </motion.button>
        </motion.div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Chats</h2>

        <button
          onClick={() => setShowGroupModal(true)}
          className="text-indigo-400 hover:scale-110 transition"
        >
          <FiPlus size={20} />
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full p-3 pl-10 rounded-xl bg-white/5 text-white border border-white/10"
        />

        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <AnimatePresence>
          {filtered.map((item, index) => {
            const isOnline =
              item.type === "user" &&
              onlineUsers.some(
                (id) => id.toString() === item.user?._id?.toString(),
              );

            return (
              <motion.div
                key={item.type === "group" ? item.chat._id : item.user._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.02 }}
              >
                {item.type === "group" ? (
                  <div
                    onClick={() => onSelectChat(item.chat)}
                    onDoubleClick={() => onOpenGroupInfo?.(item.chat._id)}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/5"
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                      <FiUsers />
                    </div>

                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {item.chat.chatName}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {formatLastMessage(item.chat)}
                      </p>
                    </div>

                    {item.chat.unreadCount > 0 && (
                      <div className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                        {item.chat.unreadCount}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => handleClick(item)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative"
                    >
                      <img
                        src={
                          item.user.avatar?.url ||
                          `https://ui-avatars.com/api/?name=${item.user.name}`
                        }
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow-md"
                      />

                      {/* ✅ ONLINE FIX */}
                      {isOnline && (
                        <>
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 animate-ping"></span>
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-slate-900"></span>
                        </>
                      )}
                    </motion.div>

                    <div className="flex-1">
                      <p className="text-white">{item.user.name}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {formatLastMessage(item.chat)}
                      </p>
                    </div>

                    {item.chat?.unreadCount > 0 && (
                      <div className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                        {item.chat.unreadCount}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* MODAL */}
      {showGroupModal && (
        <CreateGroupModal
          onClose={() => setShowGroupModal(false)}
          onGroupCreated={() => window.location.reload()}
        />
      )}
    </div>
  );
};

export default ChatList;
