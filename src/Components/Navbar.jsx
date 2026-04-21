import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/authSlice";
import { useNavigate } from "react-router-dom";
import { API } from "../Services/Api";
import themes from "../Utils/themes";
import { motion } from "framer-motion";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading } = useSelector((state) => state.auth);
  const theme = themes.zynk;

  const handleLogout = async () => {
    await API.post("/api/auth/logout");
    dispatch(logout());
    navigate("/login");
  };

  if (loading) return null;

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`${theme.navBg} px-4 py-3 flex items-center justify-between backdrop-blur-xl border-b border-slate-800`}
    >
      {/* LEFT */}
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => navigate("/")}
      >
        <motion.div
          whileHover={{ rotateX: 12, rotateY: 12, scale: 1.08 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-green-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50"
        >
          Z
        </motion.div>

        <motion.h1
          whileHover={{ x: 3 }}
          className={`text-lg font-semibold tracking-wide ${theme.textPrimary}`}
        >
          Zynk Chat
        </motion.h1>
      </div>

      {/* RIGHT */}
      {user && (
        <div className="flex items-center gap-4">
          {/*PROFILE CLICKABLE AREA */}
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
              {user.isOnline && (
                <>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 animate-ping"></span>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-slate-900"></span>
                </>
              )}
            </motion.div>

            <div className="hidden sm:flex flex-col">
              <span className={`${theme.textPrimary} text-sm font-medium`}>
                {user.name}
              </span>
              <span className={`${theme.textMuted} text-xs`}>
                {user.isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          {/* OPTIONAL PROFILE BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/profile")}
            className={`${theme.buttonOutline}`}
          >
            Profile
          </motion.button>

          {/* LOGOUT */}
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 15px rgba(99,102,241,0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className={`${theme.buttonOutline} backdrop-blur-md`}
          >
            Logout
          </motion.button>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;



