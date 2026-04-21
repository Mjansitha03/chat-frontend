import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyResetToken, resetPassword } from "../Redux/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import themes from "../Utils/themes";

const ResetPasswordPage = () => {
  const { id, token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(null); 
  const [success, setSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  // ================= VERIFY TOKEN =================
  useEffect(() => {
    const checkToken = async () => {
      const res = await dispatch(verifyResetToken({ id, token }));

      if (verifyResetToken.fulfilled.match(res)) {
        setValid(true);
        setTimeLeft(res.payload.expiresInSeconds);
      } else {
        setValid(false); 
      }
    };

    checkToken();
  }, [dispatch, id, token]);

  // ================= TIMER =================
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft > 0]);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (timeLeft === 0) return;

    const res = await dispatch(resetPassword({ id, token, password }));

    if (resetPassword.fulfilled.match(res)) {
      setSuccess("Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  // ================= FORMAT TIME =================
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // ================= UI STATES =================

  if (valid === null) {
    return (
      <div className="text-center mt-20 text-white text-lg">
        Validating reset link...
      </div>
    );
  }

  // Invalid / Expired link (backend failed)
  if (valid === false) {
    return (
      <div
        className={`${themes.zynk.pageGradient} min-h-screen flex items-center justify-center`}
      >
        <div className={`${themes.zynk.card} p-8 rounded-xl w-full max-w-md text-center`}>
          <h2 className="text-2xl text-red-400 mb-4">Invalid or Expired Link</h2>
          <p className="text-gray-300 mb-4">
            This password reset link is no longer valid.
          </p>

          <button
            onClick={() => navigate("/forgot-password")}
            className={`${themes.zynk.buttonPrimary}`}
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div
      className={`${themes.zynk.pageGradient} min-h-screen flex items-center justify-center`}
    >
      <div className={`${themes.zynk.card} p-8 rounded-xl w-full max-w-md`}>
        <h2 className="text-2xl text-white mb-4">Reset Password</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${themes.zynk.input}`}
            required
          />

          {/*TIMER */}
          {timeLeft > 0 ? (
            <p className="text-yellow-400 mt-2">
              ⏳ Link expires in: {formatTime(timeLeft)}
            </p>
          ) : (
            <p className="text-red-500 mt-2">
              Link expired. Please request a new one.
            </p>
          )}

          <button
            disabled={timeLeft === 0}
            className={`${themes.zynk.buttonPrimary} w-full mt-4 ${
              timeLeft === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {success && <p className="text-green-400 mt-3">{success}</p>}
        {error && <p className="text-red-400 mt-3">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPasswordPage;



