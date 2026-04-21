import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import themes from "../Utils/themes";

const NotFoundPage = () => {
  const theme = themes.zynk;
  const navigate = useNavigate();

  return (
    <div
      className={`${theme.pageGradient} min-h-screen flex items-center justify-center px-4 relative overflow-hidden`}
    >
     
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute w-[400px] h-[400px] bg-indigo-500/20 blur-[120px] -top-32 -left-32"
      />

      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-[120px] -bottom-32 -right-32"
      />

     
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${theme.card} ${theme.cardBorder} ${theme.cardShadow} p-10 rounded-3xl text-center max-w-md w-full`}
      >
        
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-7xl font-extrabold text-indigo-400 mb-4"
        >
          404
        </motion.h1>

        
        <h2 className="text-2xl font-semibold text-white mb-2">
          Page Not Found
        </h2>

        <p className={`${theme.textMuted} mb-6`}>
          The page you are looking for doesn’t exist or has been moved.
        </p>

        
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/")}
            className={theme.buttonSecondary}
          >
            Go Home
          </button>

          <button
            onClick={() => navigate("/chat")}
            className={theme.buttonPrimary}
          >
            Go to Chat
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;



