import React, { useEffect, useState } from "react";
import { API } from "../Services/Api";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import themes from "../Utils/themes";
import {
  FiArrowLeft,
  FiEdit,
  FiSave,
  FiX,
  FiUserPlus,
  FiTrash2,
  FiLogOut,
} from "react-icons/fi";

const GroupInfoPage = () => {
  const theme = themes.zynk;
  const { groupId } = useParams();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.user);

  const [group, setGroup] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  const [loading, setLoading] = useState(true);

  // ================= FETCH GROUP =================
  const fetchGroup = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/api/chats/${groupId}`);
      const data = res.data?.data;

      if (!data) throw new Error("Invalid group data");

      const mapped = {
        ...data,
        name: data.chatName || "Unnamed Group",
        members: data.users || [],
        admin: data.groupAdmin || null,
        description: data.groupDescription || "",
      };

      setGroup(mapped);
      setName(mapped.name);
      setDescription(mapped.description);
    } catch (err) {
      console.error("FETCH GROUP ERROR:", err);
      setGroup({ members: [] });
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE GROUP =================
  const handleUpdate = async () => {
    try {
      setLoading(true);

      await API.patch("/api/chats/group/rename", {
        chatId: groupId,
        chatName: name,
      });

      setEditMode(false);
      fetchGroup();
    } catch (err) {
      console.error("UPDATE ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= ADD MEMBER =================
  const handleAddMember = async () => {
    if (!memberEmail.trim()) return;

    try {
      setLoading(true);

      const res = await API.get(`/api/users/search?query=${memberEmail}`);

      const user = res.data?.message?.[0];

      if (!user?._id) {
        alert("User not found");
        return;
      }

      await API.patch("/api/chats/group/add-member", {
        chatId: groupId,
        userId: user._id,
      });

      setMemberEmail("");
      fetchGroup();
    } catch (err) {
      console.error("ADD MEMBER ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  // ================= REMOVE MEMBER =================
  const handleRemoveMember = async (id) => {
    try {
      await API.patch("/api/chats/group/remove-member", {
        chatId: groupId,
        userId: id,
      });
      fetchGroup();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= LEAVE GROUP =================
  const handleLeave = async () => {
    try {
      await API.patch("/api/chats/group/leave", {
        chatId: groupId,
      });
      navigate("/chat");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (groupId) fetchGroup();
  }, [groupId]);

  useEffect(() => {
    if (!group || !currentUser?.id) return;

    const adminCheck =
      group.admin?._id?.toString() === currentUser.id?.toString();

    setIsAdmin(adminCheck);
  }, [group, currentUser]);

  // ================= LOADING =================
  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className={`${theme.pageGradient} min-h-screen p-6`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          title="Go Back"
          className="mb-5 text-white/80 hover:text-white transition text-xl"
        >
          <FiArrowLeft />
        </button>

        {/* ================= GROUP CARD ================= */}
        <motion.div
          whileHover={{ rotateX: 2, rotateY: -2, scale: 1.01 }}
          className="p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl"
        >
          {editMode ? (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mb-3 p-3 rounded-xl bg-black/30 text-white"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/30 text-white"
              />

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleUpdate}
                  title="Save"
                  className="p-3 bg-green-500 rounded-xl hover:scale-105"
                >
                  <FiSave />
                </button>

                <button
                  onClick={() => setEditMode(false)}
                  title="Cancel"
                  className="p-3 bg-gray-500 rounded-xl"
                >
                  <FiX />
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  👥 {group?.name}
                </h1>

                <p className="text-slate-300 text-sm">
                  {group?.members?.length || 0} Members • Admin:{" "}
                  {group?.admin?.name || "N/A"}
                </p>

               
                {group?.description && (
                  <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-slate-400 mb-1">Group Bio</p>
                    <p className="text-sm text-white leading-relaxed">
                      {group.description}
                    </p>
                  </div>
                )}
              </div>

              {isAdmin && (
                <button
                  onClick={() => setEditMode(true)}
                  title="Edit Group"
                  className="p-3 bg-indigo-500/20 rounded-xl hover:bg-indigo-500/40"
                >
                  <FiEdit />
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* ================= ADMIN ================= */}
        {isAdmin && (
          <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur border">
            <h2 className="text-white mb-3">Admin Controls</h2>

            <div className="flex gap-2">
              <input
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="Enter email"
                className="flex-1 p-2 rounded bg-black/30 text-white"
              />

              <button
                onClick={handleAddMember}
                title="Add Member"
                className="p-3 bg-indigo-500 rounded-xl hover:scale-105"
              >
                <FiUserPlus />
              </button>
            </div>
          </div>
        )}

        {/* ================= MEMBERS ================= */}
        <div className="mt-6 space-y-3">
          {group?.members?.map((m, i) => (
            <motion.div
              key={m._id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex justify-between items-center p-4 rounded-2xl bg-white/10 backdrop-blur border"
            >
              <div className="flex gap-3 items-center">
                <img
                  src={
                    m.avatar?.url ||
                    `https://ui-avatars.com/api/?name=${m.name}`
                  }
                  className="w-11 h-11 rounded-full border"
                />

                <div>
                  <p className="text-white font-medium">
                    {m.name}
                    {group?.admin?._id === m._id && " 👑"}
                  </p>
                  <p className="text-xs text-slate-400">{m.email}</p>
                </div>
              </div>

              {isAdmin && m._id !== group?.admin?._id && (
                <button
                  onClick={() => handleRemoveMember(m._id)}
                  title="Remove Member"
                  className="p-2 bg-red-500/20 rounded hover:bg-red-500/40"
                >
                  <FiTrash2 />
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* ================= LEAVE ================= */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLeave}
          title="Leave Group"
          className="w-full mt-8 py-3 bg-red-500 rounded-2xl text-white flex justify-center items-center gap-2"
        >
          <FiLogOut />
          Leave
        </motion.button>
      </motion.div>
    </div>
  );
};

export default GroupInfoPage;




