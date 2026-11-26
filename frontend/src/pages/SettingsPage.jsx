const SettingsPage = ({
  dark,
  setDark,
  managerName,
  setManagerName,
  managerEmail,
  setManagerEmail,
  milkNotifications,
  setMilkNotifications,
  attendanceNotifications,
  setAttendanceNotifications,
  paymentNotifications,
  setPaymentNotifications,
  defaultUnit,
  setDefaultUnit,
  currency,
  setCurrency,
  profileSaved,
  setProfileSaved,
  goHome,
  logout,
  bg,
  card,
  muted,
}) => (
  <div className={`max-w-5xl mx-auto px-4 py-8 ${bg}`}>
    <button
      onClick={goHome}
      className="mb-6 text-green-500 font-semibold hover:text-green-700"
    >
      ← Back to Home
    </button>

    <div className={`rounded-2xl p-6 md:p-8 shadow-md border ${card}`}>
      <h1 className="text-3xl font-bold mb-2">Settings</h1>

      <p className={`mb-8 ${muted}`}>
        Customize and manage your DairyFlow application.
      </p>

      {/* APPEARANCE */}

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">🎨 Appearance</h2>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-semibold">Theme</p>

            <p className={`text-sm mt-1 ${muted}`}>
              Switch between light and dark mode.
            </p>
          </div>

          <button
            onClick={() => setDark(!dark)}
            className={`px-6 py-3 rounded-xl font-semibold ${
              dark
                ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
          >
            {dark ? "☀️ Light Theme" : "🌙 Dark Theme"}
          </button>
        </div>

        <p className="mt-3 text-sm">
          Current theme:{" "}
          <span className="font-bold text-green-500">
            {dark ? "Dark Mode" : "Light Mode"}
          </span>
        </p>
      </section>

      <hr className="my-8 border-gray-300 dark:border-gray-700" />

      {/* PROFILE */}

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">👤 Manager Profile</h2>

        <p className={`text-sm mb-5 ${muted}`}>
          Update your manager information.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-semibold mb-2">
              Manager Name
            </label>

            <input
              type="text"
              value={managerName}
              onChange={(e) => {
                setManagerName(e.target.value);
                setProfileSaved(false);
              }}
              className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-green-400 ${
                dark
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-green-200 text-gray-800"
              }`}
              placeholder="Enter manager name"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Manager Email
            </label>

            <input
              type="email"
              value={managerEmail}
              onChange={(e) => {
                setManagerEmail(e.target.value);
                setProfileSaved(false);
              }}
              className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-green-400 ${
                dark
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-green-200 text-gray-800"
              }`}
              placeholder="Enter manager email"
            />
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.setItem("dairyflow_managerName", managerName);
            localStorage.setItem("dairyflow_managerEmail", managerEmail);
            setProfileSaved(true);
          }}
          className="mt-5 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold"
        >
          Save Profile
        </button>

        {profileSaved && (
          <p className="text-green-500 font-semibold mt-3">
            ✓ Profile saved successfully!
          </p>
        )}
      </section>

      <hr className="my-8 border-gray-300 dark:border-gray-700" />

      {/* NOTIFICATIONS */}

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">🔔 Notifications</h2>

        <p className={`text-sm mb-5 ${muted}`}>
          Manage notification preferences.
        </p>

        {[
          {
            label: "Milk Collection Notifications",
            description: "Notifications about milk collection records.",
            value: milkNotifications,
            setter: setMilkNotifications,
          },
          {
            label: "Attendance Notifications",
            description: "Notifications about attendance records.",
            value: attendanceNotifications,
            setter: setAttendanceNotifications,
          },
          {
            label: "Payment Notifications",
            description: "Notifications about payment records.",
            value: paymentNotifications,
            setter: setPaymentNotifications,
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 py-4 border-b border-gray-200 dark:border-gray-700"
          >
            <div>
              <p className="font-semibold">{item.label}</p>

              <p className={`text-sm mt-1 ${muted}`}>
                {item.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => item.setter(!item.value)}
              className={`w-14 h-8 rounded-full flex items-center px-1 transition ${
                item.value ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              <span
                className={`w-6 h-6 bg-white rounded-full transition-transform ${
                  item.value ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </section>

      <hr className="my-8 border-gray-300 dark:border-gray-700" />

      {/* PREFERENCES */}

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">⚙️ Preferences</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="font-semibold block mb-2">
              Default Milk Unit
            </label>

            <select
              value={defaultUnit}
              onChange={(e) => setDefaultUnit(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                dark
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-green-200 text-gray-800"
              }`}
            >
              <option>Litres (L)</option>
              <option>Millilitres (ml)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold block mb-2">Currency</label>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                dark
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-green-200 text-gray-800"
              }`}
            >
              <option>INR (₹)</option>
              <option>USD ($)</option>
              <option>EUR (€)</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            alert(
              "Preferences selected. These are currently display preferences for the demo app."
            );
          }}
          className="mt-5 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold"
        >
          Save Preferences
        </button>
      </section>

      <hr className="my-8 border-gray-300 dark:border-gray-700" />

      {/* DATA & PRIVACY */}

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">🔒 Data & Privacy</h2>

        <div
          className={`rounded-xl p-5 border ${
            dark
              ? "border-gray-700 bg-gray-800"
              : "border-green-100 bg-green-50"
          }`}
        >
          <h3 className="font-semibold">Reset Settings</h3>

          <p className={`text-sm mt-2 ${muted}`}>
            Restore theme, profile and notification preferences to their
            default values.
          </p>

          <button
            onClick={() => {
              const confirmed = window.confirm(
                "Reset all settings to their default values?"
              );

              if (confirmed) {
                setDark(false);
                setManagerName("Dairy Manager");
                setManagerEmail("");
                setMilkNotifications(true);
                setAttendanceNotifications(true);
                setPaymentNotifications(true);
                setDefaultUnit("Litres (L)");
                setCurrency("INR (₹)");
                setProfileSaved(false);

                localStorage.removeItem("dairyflow_theme");
                localStorage.removeItem("dairyflow_managerName");
                localStorage.removeItem("dairyflow_managerEmail");

                alert("Settings have been reset.");
              }
            }}
            className="mt-4 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold"
          >
            Reset Settings
          </button>
        </div>

        <div
          className={`rounded-xl p-5 border mt-5 ${
            dark
              ? "border-gray-700 bg-gray-800"
              : "border-red-100 bg-red-50"
          }`}
        >
          <h3 className="font-semibold">Sign Out</h3>

          <p className={`text-sm mt-2 ${muted}`}>
            Sign out of your current DairyFlow session.
          </p>

          <button
            onClick={() => {
              const confirmed = window.confirm(
                "Are you sure you want to sign out?"
              );

              if (confirmed) logout();
            }}
            className="mt-4 px-5 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold"
          >
            Sign Out
          </button>
        </div>
      </section>

      <hr className="my-8 border-gray-300 dark:border-gray-700" />

      {/* ABOUT */}

      <section>
        <h2 className="text-xl font-bold mb-4">ℹ️ About DairyFlow</h2>

        <div className={`rounded-xl p-5 ${dark ? "bg-gray-800" : "bg-green-50"}`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-600 text-white flex items-center justify-center text-2xl">
              🥛
            </div>

            <div>
              <h3 className="text-xl font-bold">DairyFlow</h3>

              <p className={`text-sm ${muted}`}>Version 1.0.0</p>
            </div>
          </div>

          <p className={`mt-5 ${muted}`}>
            DairyFlow is a dairy management application designed to
            organize receiver information, milk collection, attendance,
            payment records and reports.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="px-3 py-2 rounded-lg bg-green-100 text-green-800 text-sm">
              Milk Management
            </span>

            <span className="px-3 py-2 rounded-lg bg-blue-100 text-blue-800 text-sm">
              Attendance
            </span>

            <span className="px-3 py-2 rounded-lg bg-orange-100 text-orange-800 text-sm">
              Payments
            </span>

            <span className="px-3 py-2 rounded-lg bg-purple-100 text-purple-800 text-sm">
              Reports
            </span>
          </div>
        </div>
      </section>
    </div>
  </div>
);

export default SettingsPage;
