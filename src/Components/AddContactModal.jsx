import React, { useEffect, useState } from "react";
import { API } from "../Services/Api";
import themes from "../Utils/themes";
import { motion } from "framer-motion";
import { FiSearch, FiX, FiMessageCircle } from "react-icons/fi";

const AddContactModal = ({ onClose, onUserAdded }) => {
  const theme = themes.zynk;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= DEBOUNCE =================
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) searchUsers();
      else setResults([]);
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  // ================= SEARCH =================
  const searchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get(
        `/api/users/search?query=${encodeURIComponent(query)}`
      );
      setResults(res.data.data || []);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= START CHAT =================
  const handleStartChat = async (userId) => {
    try {
      await API.post("/api/chats/private", {
        targetUserId: userId,
      });

      onUserAdded();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className={`${theme.card} w-full max-w-md p-6 rounded-3xl border border-white/10 shadow-2xl`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-white">New Chat</h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:rotate-90 transition"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`${theme.input} pr-10`}
          />

          <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* RESULTS */}
        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
          {loading && (
            <p className="text-center text-slate-400 text-sm animate-pulse">
              Searching...
            </p>
          )}

          {!loading && query && results.length === 0 && (
            <p className="text-center text-slate-400 text-sm">
              No users found
            </p>
          )}

          {results.map((user) => (
            <motion.div
              key={user._id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleStartChat(user._id)}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/5 transition"
            >
              {/* AVATAR */}
              <div className="relative">
                <img
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${user.name}`
                  }
                  className="w-11 h-11 rounded-full object-cover"
                />

                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${
                    user.isOnline ? "bg-green-500" : "bg-gray-500"
                  }`}
                />
              </div>

              {/* INFO */}
              <div className="flex-1">
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">
                  {user.email || user.phone}
                </p>
              </div>

              {/* ACTION ICON */}
              <FiMessageCircle className="text-indigo-400 opacity-0 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>

        {/* FOOTER */}
        <p className="text-xs text-slate-500 mt-5 text-center">
          Start chatting instantly — no friend request needed
        </p>
      </motion.div>
    </div>
  );
};

export default AddContactModal;



