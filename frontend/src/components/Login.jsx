
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Droplets,
  Eye,
  EyeOff,
  ArrowRight,
  Milk,
  Leaf,
} from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    alert("Login functionality will be connected soon!");
  };

  return (
    <div className="min-h-screen bg-[#f7f8f2] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl min-h-[650px] bg-white rounded-[28px] shadow-xl overflow-hidden grid md:grid-cols-2">

        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden md:flex flex-col justify-between bg-[#123d2b] text-white p-12 relative overflow-hidden"
        >
          <div className="absolute w-80 h-80 bg-green-400/10 rounded-full -top-20 -right-20" />
          <div className="absolute w-96 h-96 bg-green-400/10 rounded-full -bottom-40 -left-20" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-white/10 p-3 rounded-xl">
              <Droplets size={28} className="text-green-300" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              DairyFlow<span className="text-green-300">.</span>
            </span>
          </div>

          <div className="relative z-10">
            <div className="bg-white/10 border border-white/10 rounded-2xl p-5 w-fit mb-8">
              <Milk size={42} className="text-green-300" />
            </div>

            <h1 className="text-5xl font-bold leading-tight">
              Your Dairy.
              <br />
              Your People.
              <br />
              <span className="text-green-300">One Flow.</span>
            </h1>

            <p className="text-green-100/70 mt-6 leading-7 max-w-sm">
              Manage your daily milk collection, customer attendance
              and dairy operations — all in one simple place.
            </p>

            <div className="flex items-center gap-3 mt-10">
              <div className="flex -space-x-2">
                {["A", "R", "S"].map((letter) => (
                  <div key={letter} className="w-9 h-9 rounded-full bg-green-200 text-green-950 flex items-center justify-center text-sm font-bold border-2 border-[#123d2b]">
                    {letter}
                  </div>
                ))}
              </div>
              <span className="text-sm text-green-100/70">
                Smarter dairy management starts here.
              </span>
            </div>
          </div>

          <p className="relative z-10 text-xs text-green-100/40">
            © 2026 DairyFlow. All rights reserved.
          </p>
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex flex-col justify-center px-7 py-12 sm:px-14 lg:px-16"
        >
          <div className="md:hidden flex items-center gap-2 mb-12">
            <Droplets size={27} className="text-green-700" />
            <span className="text-2xl font-bold text-green-950">
              DairyFlow.
            </span>
          </div>

          <div className="mb-9">
            <span className="text-sm font-semibold text-green-700">
              WELCOME BACK
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3">
              Sign in
            </h2>
            <p className="text-gray-500 mt-3">
              Enter your details to access your DairyFlow account.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl border border-gray-200 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-700"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="accent-green-700" />
                Remember me
              </label>
              <a href="#" className="font-semibold text-green-700 hover:text-green-900">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-[#174b34] hover:bg-[#103a27] text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              Sign in
              <ArrowRight size={19} />
            </button>
          </form>

          <div className="flex items-center gap-2 justify-center mt-10 text-xs text-gray-400">
            <Leaf size={15} className="text-green-600" />
            Simple. Smart. Reliable dairy management.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
