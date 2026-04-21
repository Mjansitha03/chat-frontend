import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../Redux/authSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import themes from "../Utils/themes";
import { FiMail, FiArrowLeft } from "react-icons/fi";

const ForgotPasswordPage = () => {
  const theme = themes.zynk;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await dispatch(forgotPassword(email));

    if (forgotPassword.fulfilled.match(res)) {
      setSuccess("Reset link sent! Check your email.");
    }
  };

  return (
    <div className={`${theme.pageGradient} min-h-screen flex items-center justify-center`}>
      <motion.div className={`${theme.card} p-8 rounded-2xl w-full max-w-md`}>
        <button onClick={() => navigate("/login")}>
          <FiArrowLeft />
        </button>

        <h2 className="text-2xl text-white mb-4">Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <FiMail className="absolute left-3 top-3" />
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${theme.input} pl-10`}
              required
            />
          </div>

          <button className={`${theme.buttonPrimary} w-full mt-4`}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {success && <p className="text-green-400 mt-3">{success}</p>}
        {error && <p className="text-red-400 mt-3">{error}</p>}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;



