import React, { useState, useRef, useEffect } from "react";
import themes from "../Utils/themes";
import { socket } from "../Services/socket";
import { API } from "../Services/Api";
import { FiPaperclip, FiSend } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const MessageInput = ({ onSend, selectedChat, user }) => {
  const theme = themes.zynk;

  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef();
  const typingTimeoutRef = useRef(null);

  // FILE SELECT
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    setFiles(selectedFiles);

    const allPreviews = selectedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
      name: file.name,
    }));

    setPreviews(allPreviews);
  };

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // UPLOAD FILES
  const uploadFiles = async () => {
    if (!files.length) return [];

    const uploads = await Promise.all(
      files.map(async (file) => {
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", "chat-app/messages");

          const res = await API.post("/api/upload/single", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          console.log("UPLOAD RESPONSE:", res.data); 

          return res.data?.data;
        } catch (err) {
          console.error(
            "UPLOAD ERROR:",
            err.response?.data || err.message || err,
          ); 
          return null;
        }
      }),
    );

    return uploads.filter(Boolean);
  };

  // SEND MESSAGE
  const handleSend = async () => {
    if (!selectedChat?._id) return;

    try {
      setLoading(true);

      let uploadedFiles = [];

      if (files.length) {
        uploadedFiles = await uploadFiles();
      }

      if (uploadedFiles.length) {
        for (const file of uploadedFiles) {
          await onSend({
            text,
            fileData: file,
          });
        }
      } else {
        if (!text.trim()) return;
        await onSend({ text });
      }

      socket.emit("stop_typing", { chatId: selectedChat._id });

      setText("");
      setFiles([]);
      setPreviews([]);
      fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // TYPING
  const handleTyping = (e) => {
    const value = e.target.value;
    setText(value);

    if (!selectedChat?._id) return;

    socket.emit("typing", {
      chatId: selectedChat._id,
      userName: user?.name || "User",
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { chatId: selectedChat._id });
    }, 1200);
  };

  return (
    <div className="p-4 border-t border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      {/* IMAGE PREVIEW */}
      {previews.length > 0 && (
        <div className="mb-3 flex gap-2 flex-wrap">
          {previews.map((p, i) => (
            <div key={i} className="relative group">
              {/*REMOVE BUTTON */}
              <button
                onClick={() => handleRemoveFile(i)}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md z-10"
              >
                ✕ 
              </button>

              {/* IMAGE */}
              {p.type.startsWith("image/") && (
                <img
                  src={p.url}
                  className="w-20 h-20 object-cover rounded-lg border border-slate-700"
                />
              )}

              {/* VIDEO */}
              {p.type.startsWith("video/") && (
                <video
                  src={p.url}
                  className="w-24 h-20 rounded-lg border border-slate-700"
                  controls
                />
              )}

              {/* AUDIO */}
              {p.type.startsWith("audio/") && (
                <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 w-40">
                  <p className="text-xs text-slate-300 truncate">{p.name}</p>
                  <audio controls className="w-full mt-1">
                    <source src={p.url} />
                  </audio>
                </div>
              )}

              {/* FILE */}
              {!p.type.startsWith("image/") &&
                !p.type.startsWith("video/") &&
                !p.type.startsWith("audio/") && (
                  <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 w-40">
                    <p className="text-sm text-white truncate">{p.name}</p>
                    <p className="text-xs text-slate-400">File selected</p>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}

      {/* INPUT BAR */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900/70 border border-slate-700">
        {/* FILE BUTTON */}
        <button
          onClick={() => fileInputRef.current.click()}
          className="text-slate-300 hover:text-indigo-400 transition text-xl"
        >
          <FiPaperclip />
        </button>

        <input
          type="file"
          multiple
          ref={fileInputRef}
          hidden
          onChange={handleFileChange}
        />

        {/* TEXT INPUT */}
        <input
          value={text}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="flex-1 bg-transparent outline-none text-white"
        />

        {/* SEND BUTTON */}
        <button
          onClick={handleSend}
          disabled={loading}
          className="text-indigo-400 hover:text-indigo-300 transition text-xl disabled:opacity-50"
        >
          {loading ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : (
            <FiSend />
          )}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;



