import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import themes from "../Utils/themes";
import {
  FiMessageCircle,
  FiZap,
  FiUsers,
  FiArrowRight,
  FiUserPlus,
} from "react-icons/fi";

const IndexPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const theme = themes.zynk;

  useEffect(() => {
    if (user) navigate("/chat");
  }, [user, navigate]);

  return (
    <div className={`${theme.pageGradient} min-h-screen relative overflow-hidden`}>
     
      <div className="absolute w-[600px] h-[600px] bg-indigo-500/20 blur-[140px] -top-40 -left-40 animate-pulse" />
      <div className="absolute w-[500px] h-[500px] bg-green-500/20 blur-[140px] -bottom-40 -right-40 animate-pulse" />

      {/* ================= HERO ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <div className="text-center lg:text-left space-y-5 animate-fadeInUp">
          {/* LOGO */}
          <div className="flex justify-center lg:justify-start items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-green-500 flex items-center justify-center text-white text-xl font-bold shadow-lg hover:scale-110 transition">
              Z
            </div>
            <h1 className={`text-2xl font-bold ${theme.textPrimary}`}>
              Zynk Chat
            </h1>
          </div>

          {/* TEXT */}
          <h2 className={`text-5xl font-extrabold leading-tight ${theme.textPrimary}`}>
            Feel the Future of
            <span className="block bg-gradient-to-r from-indigo-400 to-green-400 bg-clip-text text-transparent animate-gradient">
              Messaging 🚀
            </span>
          </h2>

          <p className={`${theme.textSecondary} text-lg max-w-lg mx-auto lg:mx-0`}>
            Fast. Smooth. Beautiful. Chat like never before with real-time magic.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={() => navigate("/login")}
              className={`${theme.buttonPrimary} flex items-center gap-2 justify-center hover:scale-110 active:scale-95`}
            >
              Start Chatting <FiArrowRight />
            </button>

            <button
              onClick={() => navigate("/register")}
              className={`${theme.buttonOutline} flex items-center gap-2 justify-center hover:scale-110 active:scale-95`}
            >
              Create Account <FiUserPlus />
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex justify-center items-center animate-fadeIn">
          <div className="absolute w-[280px] h-[180px] bg-slate-800/40 backdrop-blur-xl border border-slate-700 rounded-2xl rotate-6 shadow-2xl animate-floatSlow" />
          <div className="absolute w-[280px] h-[180px] bg-slate-800/40 backdrop-blur-xl border border-slate-700 rounded-2xl -rotate-6 shadow-2xl animate-floatSlow delay-200" />

          <img
            src="https://cdn.phototourl.com/free/2026-04-11-73054153-0fa5-4497-968c-5a183d55a6ef.png"
            alt="3D Chat"
            className="relative z-10 w-[260px] sm:w-[340px] lg:w-[420px]
            drop-shadow-[0_40px_100px_rgba(0,0,0,0.9)]
            animate-float"
          />
        </div>
      </div>

      {/* ================= FEATURES ================= */}
      <div className="relative z-10 px-4 mt-5">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <FiMessageCircle />,
              title: "Smooth Chat",
              desc: "No lag. Just flow.",
            },
            {
              icon: <FiZap />,
              title: "Blazing Fast",
              desc: "Instant delivery.",
            },
            {
              icon: <FiUsers />,
              title: "Live Presence",
              desc: "See who's online.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-slate-900/60 backdrop-blur-xl border border-slate-700 p-6 rounded-2xl text-center hover:scale-110 hover:shadow-2xl transition animate-fadeInUp"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <div className="text-3xl text-indigo-400 mb-3 flex justify-center">
                {item.icon}
              </div>

              <h3 className={`${theme.textPrimary} font-semibold text-lg`}>
                {item.title}
              </h3>

              <p className={`${theme.textMuted} text-sm`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ANIMATIONS ================= */}
      <style>
        {`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(6deg); }
          50% { transform: translateY(-15px) rotate(6deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes gradient {
          0% { background-position: 0% }
          100% { background-position: 100% }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-floatSlow {
          animation: floatSlow 6s ease-in-out infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease forwards;
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
        `}
      </style>
    </div>
  );
};

export default IndexPage;



