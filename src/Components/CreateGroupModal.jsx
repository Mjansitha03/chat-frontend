import React, { useEffect, useState } from "react";
import { API } from "../Services/Api";
import themes from "../Utils/themes";
import { motion } from "framer-motion";
import { FiX, FiUsers, FiCheck, FiLoader } from "react-icons/fi";

const CreateGroupModal = ({ onClose, onGroupCreated }) => {
  const theme = themes.zynk;

  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= FETCH USERS =================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/api/users");
        setUsers(res.data?.data || []);
      } catch {
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  // ================= TOGGLE USER =================
  const toggleUser = (userId) => {
    setSelected((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  // ================= CREATE GROUP =================
  const handleCreate = async () => {
    if (!groupName.trim()) return alert("Enter group name");
    if (selected.length < 2) return alert("Select at least 2 users");

    try {
      setLoading(true);

      await API.post("/api/chats/group", {
        chatName: groupName,
        users: selected,
      });

      onGroupCreated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl">
      {/* BACKGROUND GLOW */}
      <div className="absolute w-[400px] h-[400px] bg-indigo-500/20 blur-[120px] -top-20 -left-20 animate-pulse" />
      <div className="absolute w-[350px] h-[350px] bg-purple-500/20 blur-[120px] -bottom-20 -right-20 animate-pulse" />

      {/* MODAL */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className={`relative w-full max-w-md p-6 rounded-3xl ${theme.card} ${theme.cardBorder} ${theme.cardShadow}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2 text-white">
            <FiUsers />
            <h2 className="text-xl font-semibold">Create Group</h2>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-400 transition"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* GROUP NAME */}
        <input
          type="text"
          placeholder="Enter group name..."
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className={`${theme.input} mb-4`}
        />

        {/* SELECTED COUNT */}
        {selected.length > 0 && (
          <p className="text-xs text-indigo-400 mb-2">
            {selected.length} members selected
          </p>
        )}

        {/* USER LIST */}
        <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
          {users.map((u) => {
            const isSelected = selected.includes(u._id);

            return (
              <motion.div
                key={u._id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleUser(u._id)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                  isSelected
                    ? "bg-indigo-500/20 border border-indigo-500/30"
                    : "hover:bg-white/5"
                }`}
              >
                {/* AVATAR */}
                <div className="relative">
                  <img
                    src={`https://ui-avatars.com/api/?name=${u.name}`}
                    className="w-10 h-10 rounded-full"
                    alt="avatar"
                  />

                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${
                      u?.isOnline ? "bg-green-500" : "bg-gray-500"
                    }`}
                  />
                </div>

                {/* NAME */}
                <p className="text-white flex-1 font-medium">{u.name}</p>

                {/* CHECK ICON */}
                {isSelected && <FiCheck className="text-green-400" />}
              </motion.div>
            );
          })}
        </div>

        {/* CREATE BUTTON */}
        <motion.button
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
          onClick={handleCreate}
          disabled={loading}
          className={`${theme.buttonPrimary} w-full mt-5 flex items-center justify-center gap-2`}
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <FiUsers />
              Create Group
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CreateGroupModal;



