import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../Redux/authSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import themes from "../Utils/themes";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const RegisterPage = () => {
  const theme = themes.zynk;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(registerUser(form));

    if (registerUser.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
    <div
      className={`${theme.pageGradient} min-h-screen flex items-center justify-center relative overflow-hidden px-4`}
    >
      {/* BACK BUTTON */}
      <motion.button
        onClick={() => navigate("/")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-6 left-6 z-10 text-white bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/10"
      >
        <FiArrowLeft />
      </motion.button>

    
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
        className="absolute w-[520px] h-[520px] bg-purple-500/20 blur-[140px] -top-40 -left-40"
      />

      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
        transition={{ duration: 16, repeat: Infinity }}
        className="absolute w-[450px] h-[450px] bg-indigo-500/20 blur-[140px] -bottom-40 -right-40"
      />

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ rotateX: 6, rotateY: -6 }}
        className={`${theme.card} w-full max-w-md p-8 rounded-3xl backdrop-blur-2xl border border-white/10 shadow-2xl relative z-10`}
      >
        {/* TITLE */}
        <h2 className="text-3xl font-bold mb-6 text-white text-center">
          Create Account 
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
         
          <div className="relative">
            <FiUser className="absolute left-3 top-3 text-slate-400" />
            <motion.input
              whileFocus={{ scale: 1.02 }}
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className={`${theme.input} pl-10`}
              required
            />
          </div>

          
          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-slate-400" />
            <motion.input
              whileFocus={{ scale: 1.02 }}
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={`${theme.input} pl-10`}
              required
            />
          </div>

         
          <div className="relative">
            <FiPhone className="absolute left-3 top-3 text-slate-400" />
            <motion.input
              whileFocus={{ scale: 1.02 }}
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className={`${theme.input} pl-10`}
            />
          </div>

       
          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-slate-400" />

            <motion.input
              whileFocus={{ scale: 1.02 }}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={`${theme.input} pl-10 pr-10`}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-white"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* BUTTON */}
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold flex justify-center ${
              loading ? "bg-gray-500 cursor-not-allowed" : theme.buttonPrimary
            }`}
          >
            {loading ? "Creating..." : "Register"}
          </motion.button>

          {/* ERROR */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-sm text-center"
            >
              {error}
            </motion.div>
          )}
        </form>

        {/* FOOTER */}
        <p className="mt-6 text-sm text-center text-slate-300">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;



