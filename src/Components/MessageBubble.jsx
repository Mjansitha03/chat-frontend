import React from "react";
import themes from "../Utils/themes";
import { FiFile, FiImage, FiVideo, FiMusic } from "react-icons/fi";

const MessageBubble = ({ message, isOwn, onSelect, isSelected, selectionMode, onClick }) => {
  const theme = themes.zynk;

  if (!message) return null;

  const {
    content,
    fileUrl,
    messageType,
    fileName,
    createdAt,
    seenBy = [],
    isDeleted,
  } = message;

  const isSeen = seenBy.length > 1;

  const getFileIcon = () => {
    switch (messageType) {
      case "image":
        return <FiImage />;
      case "video":
        return <FiVideo />;
      case "audio":
        return <FiMusic />;
      default:
        return <FiFile />;
    }
  };

  return (
    <div
      onClick={() => {
        if (selectionMode) {
          onSelect && onSelect(message);
        } else {
          onClick && onClick(message);
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault(); 
        onSelect && onSelect(message); 
      }}
      className={`flex w-full ${
        isOwn ? "justify-end" : "justify-start"
      } animate-messageIn`}
    >
      <div
        className={`
          relative max-w-[75%] rounded-2xl break-words
          backdrop-blur-lg border border-white/5
          shadow-lg transition-all duration-300
          hover:scale-[1.02]

          ${isSelected ? "ring-2 ring-red-500 scale-[1.02]" : ""}

          ${
            isOwn
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-sm shadow-indigo-500/30"
              : "bg-slate-800/80 text-slate-200 rounded-bl-sm shadow-black/30"
          }
        `}
      >
        <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl" />

        {/* ================= TEXT ================= */}
        {isDeleted ? (
          <p className="text-sm italic text-gray-400 px-4 py-2">
            This message was deleted
          </p>
        ) : (
          content && (
            <p className="text-sm mb-1 leading-relaxed relative z-10  px-4 py-2">
              {content}
            </p>
          )
        )}

        {/* ================= IMAGE ================= */}
        {messageType === "image" && fileUrl && !isDeleted && (
          <div className="mt-2 overflow-hidden rounded-xl relative group  px-2 py-0.5">
            <img
              src={fileUrl}
              alt="image"
              className="max-h-60 w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
          </div>
        )}

        {/* ================= VIDEO ================= */}
        {messageType === "video" && fileUrl && !isDeleted && (
          <div className="mt-2 rounded-xl overflow-hidden px-2 py-0.5">
            <video controls className="max-h-60 w-full rounded-xl">
              <source src={fileUrl} />
            </video>
          </div>
        )}

        {/* ================= AUDIO ================= */}
        {messageType === "audio" && fileUrl && !isDeleted && (
          <div className="mt-2 px-2 py-0.5">
            <audio controls className="w-full">
              <source src={fileUrl} />
            </audio>
          </div>
        )}

        {/* ================= FILE ================= */}
        {messageType === "file" && fileUrl && !isDeleted && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 mt-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 transition group"
          >
            {/* ICON */}
            <div className="text-xl text-indigo-400">{getFileIcon()}</div>

            {/* INFO */}
            <div className="flex-1">
              <p className="text-sm font-medium truncate">
                {fileName || "File"}
              </p>
              <p className="text-xs text-slate-400">Click to open</p>
            </div>

            <span className="text-xs text-indigo-400 group-hover:underline">
              Open
            </span>
          </a>
        )}

        {/* ================= TIME + SEEN ================= */}
        <div className="flex justify-end items-center gap-2 mt-2 relative z-10">
          <span className={`${theme.messageTime}`}>
            {new Date(createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {isOwn && (
            <span
              className={`text-xs transition ${
                isSeen ? "text-blue-400" : "text-gray-400"
              }`}
            >
              {isSeen ? "✔✔" : "✔"}
            </span>
          )}
        </div>
      </div>

      {/* ================= ANIMATION ================= */}
      <style>{`
        @keyframes messageIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-messageIn {
          animation: messageIn 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default MessageBubble;



  