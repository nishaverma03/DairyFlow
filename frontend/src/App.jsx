
import { useState, useEffect } from "react";

const CONTACT_EMAIL = "dairyflow123@gmail.com";

const modules = [
  {
    id: "milkcollection",
    title: "Milk Collection",
    icon: "🥛",
    description: "Manage daily milk collection and producer entries.",
  },
  {
    id: "attendance",
    title: "Attendance",
    icon: "📋",
    description: "Manage attendance and daily staff records.",
  },
  {
    id: "payments",
    title: "Payments",
    icon: "💰",
    description: "Keep track of payment-related records.",
  },
  {
    id: "reports",
    title: "Reports",
    icon: "📊",
    description: "View and organize dairy management reports.",
  },
];

// Logo
function DairyLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-2xl">
        🥛
      </div>
      <span className="text-2xl font-bold text-green-700">DairyFlow</span>
    </div>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-gradient-to-br from-indigo-950 via-blue-900 to-indigo-700 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-2xl">
                🥛
              </div>
              <h2 className="text-3xl font-bold">DairyFlow</h2>
            </div>

            <p className="text-blue-200 mb-6 max-w-sm">
              Simplifying dairy management with smarter tools for milk
              collection, attendance, payments and reports.
            </p>

            {/* Language */}
            <div className="mb-8">
              <label className="block text-blue-200 mb-3">Language</label>

              <select
                className="w-full max-w-xs bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white outline-none"
                defaultValue="English"
              >
                <option className="text-black" value="English">
                  English
                </option>
                <option className="text-black" value="Hindi">
                  Hindi
                </option>
              </select>
            </div>

            {/* Social */}
            <h3 className="text-blue-200 mb-4">Social</h3>

            <div className="flex items-center gap-5 text-2xl">
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="X"
                className="hover:text-green-300 transition"
              >
                𝕏
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="hover:text-green-300 transition"
              >
                ◎
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="hover:text-green-300 transition"
              >
                f
              </a>

              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                className="hover:text-green-300 transition"
              >
                ▶
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="hover:text-green-300 transition"
              >
                in
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-blue-200 font-semibold mb-5">Product</h3>
            <div className="space-y-4">
              {modules.map((item) => (
                <a
                  key={item.id}
                  href="#"
                  className="block hover:text-green-300 transition"
                >
                  {item.title}
                </a>
              ))}
              <a href="#" className="block hover:text-green-300 transition">
                Dashboard
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-blue-200 font-semibold mb-5">Company</h3>
            <div className="space-y-4">
              <a href="#" className="block hover:text-green-300 transition">
                About Us
              </a>
              <a href="#" className="block hover:text-green-300 transition">
                Our Mission
              </a>
              <a href="#" className="block hover:text-green-300 transition">
                Careers
              </a>
              <a href="#" className="block hover:text-green-300 transition">
                News
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-blue-200 font-semibold mb-5">Resources</h3>
            <div className="space-y-4">
              <a href="#" className="block hover:text-green-300 transition">
                Help Center
              </a>
              <a href="#" className="block hover:text-green-300 transition">
                Support
              </a>
              <a href="#" className="block hover:text-green-300 transition">
                Feedback
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="block hover:text-green-300 transition"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-blue-200 font-semibold mb-5">Policies</h3>
            <div className="space-y-4">
              <a href="#" className="block hover:text-green-300 transition">
                Privacy
              </a>
              <a href="#" className="block hover:text-green-300 transition">
                Terms
              </a>
              <a href="#" className="block hover:text-green-300 transition">
                Guidelines
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/20 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-blue-200 text-sm text-center">
            © {new Date().getFullYear()} DairyFlow. All rights reserved.
          </p>

          <p className="text-blue-200 text-sm">
            Made with 🥛 for dairy management.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    () => localStorage.getItem("dairyflow_loggedIn") === "true"
  );

  const [page, setPage] = useState(() =>
    localStorage.getItem("dairyflow_loggedIn") === "true"
      ? "home"
      : "login"
  );

  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [moduleSearch, setModuleSearch] = useState("");

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("dairyflow_theme") === "dark"
  );

  // Save login status
  useEffect(() => {
    localStorage.setItem("dairyflow_loggedIn", String(loggedIn));
  }, [loggedIn]);

  // Save theme
  useEffect(() => {
    localStorage.setItem("dairyflow_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Browser navigation
  useEffect(() => {
    const handlePopState = (event) => {
      if (!loggedIn) return;

      if (event.state?.dairyflowPage) {
        setPage(event.state.dairyflowPage);
      } else {
        setPage("home");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [loggedIn]);

  // Navigation
  const navigate = (newPage) => {
    setPage(newPage);

    window.history.pushState(
      { dairyflowPage: newPage },
      "",
      window.location.href
    );
  };

  // Sign In
  const handleSignIn = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage("Please enter both email and password.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      return;
    }

    setLoggedIn(true);
    setMessage("");
    setPassword("");
    setConfirmPassword("");
    setPage("home");

    window.history.replaceState(
      { dairyflowPage: "home" },
      "",
      window.location.href
    );
  };

  // Sign Up
  const handleSignUp = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage("Sign up successful! Please sign in now.");
    setMode("signin");
    setPassword("");
    setConfirmPassword("");
  };

  // Forgot Password
  const handleForgotPassword = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    setMessage(
      "Password reset is a demo feature. Please contact " + CONTACT_EMAIL
    );
  };

  // Sign Out
  const handleSignOut = () => {
    localStorage.removeItem("dairyflow_loggedIn");

    setLoggedIn(false);
    setPage("login");
    setMode("signin");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setMessage("");

    window.history.replaceState(null, "", window.location.href);
  };

  // Theme classes
  const bg = darkMode ? "bg-gray-900" : "bg-gray-50";
  const card = darkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-100";
  const heading = darkMode ? "text-white" : "text-gray-800";
  const muted = darkMode ? "text-gray-400" : "text-gray-500";
  const navBg = darkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-100";

  // Navbar
  const Navbar = () => (
    <nav
      className={`${navBg} shadow-sm px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b`}
    >
      <DairyLogo />

      <div className="flex items-center gap-5 flex-wrap">
        <button
          onClick={() => navigate("home")}
          className={`hover:text-green-600 ${
            page === "home" ? "text-green-600 font-semibold" : heading
          }`}
        >
          Home
        </button>

        <button
          onClick={() => navigate("menu")}
          className={`hover:text-green-600 ${
            page === "menu" ? "text-green-600 font-semibold" : heading
          }`}
        >
          Menu
        </button>

        <button
          onClick={() => navigate("contact")}
          className={`hover:text-green-600 ${
            page === "contact" ? "text-green-600 font-semibold" : heading
          }`}
        >
          Contact
        </button>

        <button
          onClick={() => navigate("settings")}
          className={`hover:text-green-600 ${
            page === "settings" ? "text-green-600 font-semibold" : heading
          }`}
        >
          Settings
        </button>

        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );

  // Module Card
  const ModuleCard = ({ item }) => (
    <button
      onClick={() => navigate("module:" + item.id)}
      className={`${card} text-left p-6 rounded-2xl shadow-sm border hover:shadow-md transition w-full`}
    >
      <div className="text-4xl mb-4">{item.icon}</div>

      <h3 className={`font-semibold text-xl mb-3 ${heading}`}>
        {item.title}
      </h3>

      <p className={`${muted} text-sm mb-4`}>{item.description}</p>

      <span className="text-green-600 text-sm font-medium">
        Open module →
      </span>
    </button>
  );

  // Login / Signup / Forgot Password
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-lg p-8">
          <div className="flex justify-center mb-8">
            <DairyLogo />
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            {mode === "signin"
              ? "Sign In"
              : mode === "signup"
              ? "Create Account"
              : "Forgot Password"}
          </h1>

          <p className="text-gray-500 text-center mb-6">
            {mode === "signin"
              ? "Welcome back to DairyFlow"
              : mode === "signup"
              ? "Create your DairyFlow account"
              : "Reset your password"}
          </p>

          <form
            onSubmit={
              mode === "signin"
                ? handleSignIn
                : mode === "signup"
                ? handleSignUp
                : handleForgotPassword
            }
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setMessage("");
                }}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {mode !== "forgot" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setMessage("");
                    }}
                    placeholder="Minimum 6 characters"
                    className="w-full border border-gray-300 rounded-xl p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            )}

            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setMessage("");
                    }}
                    placeholder="Confirm your password"
                    className="w-full border border-gray-300 rounded-xl p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            )}

            {message && (
              <p className="text-sm text-center text-red-600 break-words">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition"
            >
              {mode === "signin"
                ? "Sign In"
                : mode === "signup"
                ? "Sign Up"
                : "Reset Password"}
            </button>
          </form>

          {mode === "signin" && (
            <div className="mt-5 flex justify-between text-sm">
              <button
                onClick={() => {
                  setMode("forgot");
                  setMessage("");
                }}
                className="text-green-600 hover:underline"
              >
                Forgot Password?
              </button>

              <button
                onClick={() => {
                  setMode("signup");
                  setMessage("");
                }}
                className="text-green-600 hover:underline"
              >
                Create Account
              </button>
            </div>
          )}

          {mode !== "signin" && (
            <button
              onClick={() => {
                setMode("signin");
                setMessage("");
              }}
              className="block mx-auto mt-5 text-green-600 hover:underline text-sm"
            >
              ← Back to Sign In
            </button>
          )}

          <div className="text-center text-gray-500 text-sm mt-8">
            Contact: {CONTACT_EMAIL}
          </div>
        </div>
      </div>
    );
  }

  // Home Page
  if (page === "home") {
    return (
      <div className={`min-h-screen ${bg}`}>
        <Navbar />

        <main className="max-w-6xl mx-auto p-6 md:p-10">
          <div className="mb-8">
            <h1 className={`text-3xl font-bold ${heading}`}>
              Welcome to DairyFlow 🥛
            </h1>

            <p className={`${muted} mt-2`}>
              Manage your dairy operations efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {modules
              .filter((item) =>
                ["milkcollection", "attendance", "reports"].includes(item.id)
              )
              .map((item) => (
                <ModuleCard key={item.id} item={item} />
              ))}
          </div>

          {/* Quick Access */}
          <div className={`${card} mt-8 p-6 rounded-2xl shadow-sm border`}>
            <h2 className={`text-xl font-semibold mb-3 ${heading}`}>
              Quick Access
            </h2>

            <p className={`${muted} mb-4`}>
              Explore all available dairy management modules.
            </p>

            <button
              onClick={() => navigate("menu")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
            >
              Explore Management Menu →
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Management Menu
  if (page === "menu") {
    const filteredModules = modules.filter((item) =>
      item.title.toLowerCase().includes(moduleSearch.toLowerCase())
    );

    return (
      <div className={`min-h-screen ${bg}`}>
        <Navbar />

        <main className="max-w-6xl mx-auto p-6 md:p-10">
          <div className="mb-8">
            <h1 className={`text-3xl font-bold ${heading}`}>
              Management Hub
            </h1>

            <p className={`${muted} mt-2`}>
              All your dairy management tools in one place.
            </p>
          </div>

          {/* Search */}
          <div className={`${card} border rounded-2xl p-5 shadow-sm mb-8`}>
            <label className={`block font-medium mb-3 ${heading}`}>
              🔎 Find a Module
            </label>

            <input
              type="text"
              value={moduleSearch}
              onChange={(e) => setModuleSearch(e.target.value)}
              placeholder="Search Milk Collection, Attendance..."
              className={`w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500 ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                  : "bg-white text-gray-800 border-gray-300"
              }`}
            />
          </div>

          {/* Quick Actions */}
          <h2 className={`text-xl font-semibold mb-4 ${heading}`}>
            Quick Actions
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {modules.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate("module:" + item.id)}
                className="bg-green-600 hover:bg-green-700 text-white p-5 rounded-2xl text-left transition shadow-sm"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm opacity-90 mt-2">Open now →</div>
              </button>
            ))}
          </div>

          {/* All Modules */}
          <div className="flex items-center justify-between mb-5 gap-4">
            <h2 className={`text-xl font-semibold ${heading}`}>
              All Modules
            </h2>

            <span className={`text-sm ${muted}`}>
              {filteredModules.length} modules
            </span>
          </div>

          {filteredModules.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((item) => (
                <ModuleCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className={`${card} border rounded-2xl p-8 text-center`}>
              <div className="text-4xl mb-3">🔍</div>
              <h3 className={`font-semibold ${heading}`}>No modules found</h3>
              <p className={muted}>Try searching with a different name.</p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    );
  }

  // Module Pages
  if (page.startsWith("module:")) {
    const moduleId = page.replace("module:", "");
    const currentModule = modules.find((item) => item.id === moduleId);

    return (
      <div className={`min-h-screen ${bg}`}>
        <Navbar />

        <main className="max-w-6xl mx-auto p-6 md:p-10">
          <div className={`${card} border rounded-2xl p-8 shadow-sm`}>
            <button
              onClick={() => navigate("menu")}
              className="text-green-600 hover:text-green-700 mb-6"
            >
              ← Back to Menu
            </button>

            <div className="text-5xl mb-4">{currentModule?.icon}</div>

            <h1 className={`text-3xl font-bold mb-4 ${heading}`}>
              {currentModule?.title || "Module"}
            </h1>

            <p className={muted}>{currentModule?.description}</p>

            <div className={`${card} rounded-xl p-5 mt-6 border`}>
              <p className={muted}>
                This module is ready for the next development step.
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Contact Page
  if (page === "contact") {
    return (
      <div className={`min-h-screen ${bg}`}>
        <Navbar />

        <main className="max-w-6xl mx-auto p-6 md:p-10">
          <div className={`${card} border rounded-2xl p-8 shadow-sm`}>
            <h1 className={`text-3xl font-bold mb-4 ${heading}`}>
              Help & Contact
            </h1>

            <p className={`${muted} mb-8`}>
              Connect with DairyFlow or reach us for assistance.
            </p>

            {/* Email */}
            <div className="bg-green-600 text-white rounded-2xl p-6 mb-6">
              <div className="text-3xl mb-3">📧</div>

              <h2 className="font-semibold text-lg mb-2">Email Us</h2>

              <p className="mb-3 text-green-100">
                For inquiries, support or feedback.
              </p>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline font-medium break-all"
              >
                {CONTACT_EMAIL}
              </a>
            </div>

            {/* Social Media */}
            <h2 className={`text-xl font-semibold mb-5 ${heading}`}>
              Follow DairyFlow
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${card} border rounded-2xl p-6 shadow-sm hover:shadow-md transition`}
              >
                <div className="text-4xl mb-4">💼</div>

                <h3 className={`font-semibold text-lg ${heading}`}>
                  LinkedIn
                </h3>

                <p className={`${muted} mt-2`}>
                  Connect with us professionally.
                </p>

                <span className="text-blue-600 mt-4 inline-block font-medium">
                  Visit LinkedIn →
                </span>
              </a>

              {/* X */}
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${card} border rounded-2xl p-6 shadow-sm hover:shadow-md transition`}
              >
                <div className="text-4xl mb-4">𝕏</div>

                <h3 className={`font-semibold text-lg ${heading}`}>
                  X / Twitter
                </h3>

                <p className={`${muted} mt-2`}>
                  Stay updated with our latest news.
                </p>

                <span className="text-gray-500 mt-4 inline-block font-medium">
                  Visit X →
                </span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${card} border rounded-2xl p-6 shadow-sm hover:shadow-md transition`}
              >
                <div className="text-4xl mb-4">📸</div>

                <h3 className={`font-semibold text-lg ${heading}`}>
                  Instagram
                </h3>

                <p className={`${muted} mt-2`}>
                  Explore our updates and posts.
                </p>

                <span className="text-pink-600 mt-4 inline-block font-medium">
                  Visit Instagram →
                </span>
              </a>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Settings Page
  if (page === "settings") {
    return (
      <div className={`min-h-screen ${bg}`}>
        <Navbar />

        <main className="max-w-6xl mx-auto p-6 md:p-10">
          <h1 className={`text-3xl font-bold mb-2 ${heading}`}>
            Settings ⚙️
          </h1>

          <p className={`${muted} mb-8`}>
            Customize your DairyFlow application.
          </p>

          {/* Appearance */}
          <div className={`${card} border rounded-2xl p-6 shadow-sm`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl">{darkMode ? "🌙" : "☀️"}</div>

              <div>
                <h2 className={`text-xl font-semibold ${heading}`}>
                  Appearance
                </h2>

                <p className={muted}>Choose light or dark theme.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-5">
              <div>
                <h3 className={`font-medium ${heading}`}>
                  {darkMode ? "Dark Mode" : "Light Mode"}
                </h3>

                <p className={`text-sm ${muted}`}>
                  {darkMode
                    ? "Dark theme is currently enabled."
                    : "Light theme is currently enabled."}
                </p>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-6 py-3 rounded-xl font-medium transition ${
                  darkMode
                    ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                    : "bg-gray-900 text-white hover:bg-gray-700"
                }`}
              >
                {darkMode ? "☀️ Switch to Light" : "🌙 Switch to Dark"}
              </button>
            </div>
          </div>

          {/* Application Information */}
          <div className={`${card} border rounded-2xl p-6 shadow-sm mt-6`}>
            <h2 className={`text-xl font-semibold mb-5 ${heading}`}>
              Application Information
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between gap-4">
                <span className={muted}>Application</span>
                <span className={heading}>DairyFlow</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className={muted}>Version</span>
                <span className={heading}>1.0</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className={muted}>Modules</span>
                <span className={heading}>4</span>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className={`${card} border rounded-2xl p-6 shadow-sm mt-6`}>
            <h2 className={`text-xl font-semibold mb-3 ${heading}`}>
              Support
            </h2>

            <p className={muted}>{CONTACT_EMAIL}</p>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl"
            >
              Contact Support
            </a>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return null;
}
