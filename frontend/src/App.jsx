
import React, { useState, useEffect } from "react";

/* =========================
   SAMPLE DATA
========================= */

const TODAY_MILK_RATE = 60;

const sampleCustomers = [
  { id: 1, name: "Vishesh", phone: "9876543210", milk: 1.5, rate: 50 },
  { id: 2, name: "Amit Singh", phone: "9876543211", milk: 2, rate: 52 },
  { id: 3, name: "Priya Devi", phone: "9876543212", milk: 1, rate: 50 },
  { id: 4, name: "Sunita Kumari", phone: "9876543213", milk: 0.5, rate: 48 },
  { id: 5, name: "Rakesh Yadav", phone: "9876543214", milk: 2, rate: 50 },
  { id: 6, name: "Anjali Kumari", phone: "9876543215", milk: 1.5, rate: 52 },
  { id: 7, name: "Pankaj Kumar", phone: "9876543216", milk: 1, rate: 50 },
  { id: 8, name: "Neha Singh", phone: "9876543217", milk: 0.5, rate: 48 },
  { id: 9, name: "Sanjay Kumar", phone: "9876543218", milk: 2, rate: 52 },
  { id: 10, name: "Meena Devi", phone: "9876543219", milk: 1, rate: 50 },
  { id: 11, name: "Vikas Singh", phone: "9876543220", milk: 1.5, rate: 50 },
  { id: 12, name: "Kiran Kumari", phone: "9876543221", milk: 0.5, rate: 48 },
  { id: 13, name: "Deepak Yadav", phone: "9876543222", milk: 2, rate: 52 },
  { id: 14, name: "Pooja Devi", phone: "9876543223", milk: 1, rate: 50 },
  { id: 15, name: "Arun Kumar", phone: "9876543224", milk: 1.5, rate: 50 },
];

const attendanceRecords = [
  ["Present", "Present", "Absent", "Present", "Present"],
  ["Present", "Absent", "Present", "Present", "Present"],
  ["Present", "Present", "Present", "Absent", "Present"],
  ["Absent", "Present", "Present", "Present", "Present"],
  ["Present", "Present", "Absent", "Present", "Present"],
  ["Present", "Present", "Present", "Present", "Absent"],
  ["Present", "Absent", "Present", "Present", "Present"],
  ["Present", "Present", "Absent", "Present", "Present"],
  ["Present", "Present", "Present", "Absent", "Present"],
  ["Absent", "Present", "Present", "Present", "Present"],
  ["Present", "Present", "Absent", "Present", "Present"],
  ["Present", "Absent", "Present", "Present", "Present"],
  ["Present", "Present", "Present", "Present", "Absent"],
  ["Present", "Present", "Absent", "Present", "Present"],
  ["Present", "Absent", "Present", "Present", "Present"],
];

/* =========================
   MAIN APP
========================= */

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("dairyflowLoggedIn") === "true"
  );

  const [dark, setDark] = useState(
    localStorage.getItem("dairyflow_theme") === "dark"
  );

  const [page, setPage] = useState("Home");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [module, setModule] = useState("");
  const [search, setSearch] = useState("");
  const [todayMilkRate, setTodayMilkRate] = useState(() => {
    const savedRate = Number(localStorage.getItem("dairyflow_todayMilkRate"));
    return Number.isFinite(savedRate) && savedRate >= 0
      && localStorage.getItem("dairyflow_todayMilkRate") !== null
      ? savedRate
      : TODAY_MILK_RATE;
  });
  const [isEditingMilkRate, setIsEditingMilkRate] = useState(false);
  const [milkRateInput, setMilkRateInput] = useState(() => {
    const savedRate = localStorage.getItem("dairyflow_todayMilkRate");
    return savedRate !== null ? savedRate : String(TODAY_MILK_RATE);
  });
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem("dairyflow_customers");
      return saved ? JSON.parse(saved) : sampleCustomers;
    } catch {
      return sampleCustomers;
    }
  });
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerMilk, setNewCustomerMilk] = useState("1");

  const [calendarMonth, setCalendarMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const [calendarAttendance, setCalendarAttendance] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("dairyflow_calendarAttendance") || "{}"
      );
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("dairyflow_customers", JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem("dairyflow_todayMilkRate", String(todayMilkRate));
  }, [todayMilkRate]);

  const saveTodayMilkRate = (event) => {
    event.preventDefault();
    const nextRate = Number(milkRateInput);
    if (!Number.isFinite(nextRate) || nextRate < 0 || milkRateInput.trim() === "") {
      alert("Please enter a valid non-negative milk price.");
      return;
    }
    setTodayMilkRate(nextRate);
    setMilkRateInput(String(nextRate));
    setIsEditingMilkRate(false);
  };

  const addCustomer = (event) => {
    event.preventDefault();
    const name = newCustomerName.trim();
    const phone = newCustomerPhone.trim();

    if (!name || !phone) {
      alert("Please enter the customer name and phone number.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    if (customers.some((customer) => customer.phone === phone)) {
      alert("A customer with this phone number already exists.");
      return;
    }

    const milk = Number(newCustomerMilk);
    const rate = todayMilkRate;
    if (!Number.isFinite(milk) || milk <= 0) {
      alert("Please enter a valid milk quantity greater than 0.");
      return;
    }

    const nextId = Math.max(0, ...customers.map((customer) => customer.id)) + 1;
    setCustomers((current) => [
      ...current,
      { id: nextId, name, phone, milk, rate },
    ]);
    setNewCustomerName("");
    setNewCustomerPhone("");
    setNewCustomerMilk("1");
  };

  const removeCustomer = (customerId) => {
    const customer = customers.find((item) => item.id === customerId);
    if (!customer) return;
    if (!window.confirm(`Remove ${customer.name} from Milk Receivers?`)) return;

    setCustomers((current) => current.filter((item) => item.id !== customerId));
    setCalendarAttendance((current) => {
      const next = { ...current };
      delete next[customerId];
      return next;
    });
    if (selectedCustomer?.id === customerId) {
      setSelectedCustomer(null);
      setPage("Home");
      setModule("");
    }
  };

  const getAttendanceRecords = (customerId) => {
    const originalIndex = sampleCustomers.findIndex(
      (customer) => customer.id === customerId
    );
    return originalIndex >= 0
      ? attendanceRecords[originalIndex]
      : ["Absent", "Absent", "Absent", "Absent", "Absent"];
  };

  useEffect(() => {
    localStorage.setItem(
      "dairyflow_calendarAttendance",
      JSON.stringify(calendarAttendance)
    );
  }, [calendarAttendance]);

  const openCalendar = (customer) => {
    setSelectedCustomer(customer);
    setCalendarMonth(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );
    setPage("ReceiverCalendar");
    setModule("");
  };

  const dateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const togglePresent = (customerId, date) => {
    const key = dateKey(date);

    setCalendarAttendance((old) => {
      const next = { ...old };

      const currentStatus = next[customerId]?.[key];

      // Cycle: Unmarked -> Present -> Absent -> Unmarked
      next[customerId] = { ...(next[customerId] || {}) };

      if (!currentStatus) {
        next[customerId][key] = "Present";
      } else if (currentStatus === "Present") {
        next[customerId][key] = "Absent";
      } else {
        delete next[customerId][key];
      }

      // Keep the customer entry tidy when every date is unmarked.
      if (Object.keys(next[customerId]).length === 0) {
        delete next[customerId];
      }

      return next;
    });
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* SETTINGS STATES */

  const [managerName, setManagerName] = useState(
    localStorage.getItem("dairyflow_managerName") || "Dairy Manager"
  );

  const [managerEmail, setManagerEmail] = useState(
    localStorage.getItem("dairyflow_managerEmail") || ""
  );

  const [milkNotifications, setMilkNotifications] = useState(true);
  const [attendanceNotifications, setAttendanceNotifications] = useState(true);
  const [paymentNotifications, setPaymentNotifications] = useState(true);

  const [defaultUnit, setDefaultUnit] = useState("Litres (L)");
  const [currency, setCurrency] = useState("INR (₹)");

  const [profileSaved, setProfileSaved] = useState(false);

  /* SAVE THEME */

  useEffect(() => {
    localStorage.setItem("dairyflow_theme", dark ? "dark" : "light");
  }, [dark]);

  /* SAVE LOGIN */

  useEffect(() => {
    localStorage.setItem("dairyflowLoggedIn", loggedIn);
  }, [loggedIn]);

  /* NAVIGATION */

  const goHome = () => {
    setPage("Home");
    setSelectedCustomer(null);
    setModule("");
  };

  const openCustomer = (customer) => {
    setSelectedCustomer(customer);
    setPage("CustomerProfile");
    setModule("");
  };

  const openModule = (name) => {
    setModule(name);
    setPage("Module");
  };

  const goBack = () => {
    if (page === "Module") {
      setPage("CustomerProfile");
      setModule("");
    } else if (page === "CustomerProfile") {
      goHome();
    } else {
      goHome();
    }
  };

  const logout = () => {
    setLoggedIn(false);
    setPage("Home");
    setSelectedCustomer(null);
    setModule("");
    localStorage.removeItem("dairyflowLoggedIn");
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone.includes(search)
  );

  const totalMilk = customers.reduce(
    (sum, customer) => sum + customer.milk,
    0
  );

  const totalAmount = customers.reduce(
    (sum, customer) => sum + customer.milk * customer.rate,
    0
  );

  const totalPresent = attendanceRecords.flat().filter(
    (status) => status === "Present"
  ).length;

  const totalAbsent = attendanceRecords.flat().filter(
    (status) => status === "Absent"
  ).length;

  /* THEME */

  const bg = dark
    ? "bg-gray-950 text-gray-100"
    : "bg-green-50 text-gray-900";

  const card = dark
    ? "bg-gray-900 border-gray-700 text-gray-100"
    : "bg-white border-green-100 text-gray-900";

  const muted = dark ? "text-gray-400" : "text-gray-600";

  const button = dark
    ? "bg-gray-800 hover:bg-gray-700 text-white"
    : "bg-green-100 hover:bg-green-200 text-green-800";

  /* =========================
     LOGIN
  ========================= */

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-emerald-200 px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-green-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-green-600 text-white rounded-2xl flex items-center justify-center text-3xl mb-4">
              🥛
            </div>

            <h1 className="text-3xl font-bold text-green-800">
              DairyFlow
            </h1>

            <p className="text-gray-500 mt-2">
              Smart dairy management made simple.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();

              if (!email.trim() || !password.trim()) {
                alert("Please enter email and password.");
                return;
              }

              setLoggedIn(true);
              setPage("Home");
            }}
          >
            <label className="block font-semibold text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-5 outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
            />

            <label className="block font-semibold text-gray-700 mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-14 outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-gray-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              className="w-full mt-7 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            © 2026 DairyFlow
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     NAVBAR
  ========================= */

  const Navbar = () => (
    <nav
      className={`border-b ${
        dark
          ? "bg-gray-900 border-gray-700"
          : "bg-white border-green-100"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <button
          onClick={goHome}
          className="flex items-center gap-3"
        >
          <div className="bg-green-600 text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl">
            🥛
          </div>

          <span className="text-xl font-bold text-green-600">
            DairyFlow
          </span>
        </button>

        <div className="grid grid-cols-2 sm:flex sm:items-center sm:flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={goHome}
            className={`w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap rounded-lg ${button}`}
          >
            Home
          </button>

          <button
            onClick={() => setPage("Administration")}
            className={`w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap rounded-lg ${
              page === "Administration"
                ? "bg-green-600 text-white"
                : button
            }`}
          >
            Administration
          </button>

          <button
            onClick={() => setPage("Contact")}
            className={`w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap rounded-lg ${button}`}
          >
            Contact
          </button>

          <button
            onClick={() => setPage("Settings")}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap rounded-lg bg-green-100 hover:bg-green-200 text-green-800"
          >
            Settings
          </button>

          <button
            onClick={logout}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap rounded-lg bg-red-500 hover:bg-red-600 text-white"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );

  /* =========================
     FOOTER
  ========================= */

  const Footer = () => (
    <footer className="bg-green-950 text-white text-center py-9 px-4 mt-auto">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold">DairyFlow 🥛</h2>

        <h3 className="mt-5 font-semibold text-green-100">About DairyFlow</h3>
        <p className="text-green-200 mt-2 text-sm sm:text-base">
          A simpler way to manage your dairy business. DairyFlow brings customer
          details, daily milk records, milk prices and payments together, helping
          keep everyday work clear and organised.
        </p>

        <p className="text-green-100 text-sm mt-6">
          Made by <span className="font-semibold text-white">Amitash, Abhishek and Nisha</span>.
        </p>

        <p className="text-green-300 text-xs sm:text-sm mt-3">
          © 2026 DairyFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );

  /* =========================
     HOME
  ========================= */

  const Home = () => (
    <div className={`max-w-7xl mx-auto px-4 py-8 ${bg}`}>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          Dashboard
        </h1>

        <p className={`mt-2 ${muted}`}>
          Manage your dairy customers and daily records.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className={`rounded-2xl p-6 border shadow-sm ${card}`}>
          <p className={muted}>Total Milk Today</p>
          <h2 className="text-3xl font-bold text-green-500 mt-2">
            {totalMilk.toFixed(1)} L
          </h2>
        </div>

        <div className={`rounded-2xl p-6 border shadow-sm ${card}`}>
          <p className={muted}>Total Milk Receivers</p>
          <h2 className="text-3xl font-bold text-blue-500 mt-2">
            {customers.length}
          </h2>
        </div>

        {/* QUICK ACTIONS: PEOPLE */}
        <div className={`rounded-2xl p-6 border shadow-sm ${card}`}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-extrabold uppercase tracking-widest text-green-700">
              PEOPLE
            </p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-2xl" aria-hidden="true">👥</span>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-green-800">
            People
          </h2>
          <p className={`mt-1 text-sm leading-relaxed ${muted}`}>
            Add or remove people who get milk.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPage("AdminReceivers")}
              title="Add a person"
              aria-label="Add a person"
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-3xl font-bold leading-none text-white shadow-sm transition hover:scale-105 hover:bg-green-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <span aria-hidden="true">+</span>
            </button>
            <button
              type="button"
              onClick={() => setPage("AdminReceivers")}
              title="Remove a person"
              aria-label="Remove a person"
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-3xl font-bold leading-none text-red-700 transition hover:scale-105 hover:border-red-300 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            >
              <span aria-hidden="true">−</span>
            </button>
          </div>
        </div>

        {/* UPDATED MILK PRICE CARD */}

        <div className={`rounded-2xl p-6 border shadow-sm ${card}`}>
          <p className={muted}>Today's Milk Price (1 L)</p>
          {isEditingMilkRate ? (
            <form onSubmit={saveTodayMilkRate} className="mt-3 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={milkRateInput}
                  onChange={(event) => setMilkRateInput(event.target.value)}
                  aria-label="Today's milk price per litre"
                  className="w-28 px-3 py-2 rounded-lg border border-orange-200 bg-white text-gray-900"
                  autoFocus
                  required
                />
                <span className="font-semibold">/L</span>
              </div>
              <button type="submit" className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold">
                Save Price
              </button>
              <button
                type="button"
                onClick={() => { setMilkRateInput(String(todayMilkRate)); setIsEditingMilkRate(false); }}
                className={`px-3 py-2 rounded-lg text-sm font-semibold ${button}`}
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-bold text-orange-500">
                ₹{todayMilkRate.toFixed(2).replace(/\.00$/, "")}/L
              </h2>
              <button
                type="button"
                onClick={() => { setMilkRateInput(String(todayMilkRate)); setIsEditingMilkRate(true); }}
                className="px-3 py-2 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-800 text-sm font-semibold"
              >
                ✏️ Edit Price
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">
          Milk Receivers
        </h2>

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          autoComplete="off"
          placeholder="Search by name or phone..."
          className={`w-full sm:max-w-sm px-4 py-3 rounded-xl border outline-none ${
            dark
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-green-200 text-gray-800"
          }`}
        />
      </div>

      {/* RECEIVER CARDS WITH CALENDAR OUTSIDE PROFILE */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className={`p-5 rounded-2xl border shadow-sm hover:shadow-lg transition ${card}`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => openCustomer(customer)}
                className="flex items-center gap-3 flex-1 min-w-0 text-left"
              >
                <div className="w-12 h-12 shrink-0 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-lg">
                  {customer.name.charAt(0)}
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-lg truncate">
                    {customer.name}
                  </h3>

                  <p className={`text-sm ${muted}`}>
                    {customer.phone}
                  </p>
                </div>
              </button>

              <button
                onClick={() => openCalendar(customer)}
                title={`Open attendance calendar for ${customer.name}`}
                aria-label={`Open attendance calendar for ${customer.name}`}
                className="shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-green-100 hover:bg-green-200 text-green-800 border border-green-200 transition"
              >
                <span className="text-xl">📅</span>
                <span className="text-[9px] font-bold">Calendar</span>
              </button>
            </div>

            <div className="mt-5 flex justify-between items-center">
              <div>
                <p className={`text-sm ${muted}`}>
                  Today's Milk
                </p>

                <p className="text-xl font-bold text-green-500">
                  {customer.milk} L
                </p>
              </div>

              <div className="text-right">
                <p className={`text-sm ${muted}`}>
                  Amount
                </p>

                <p className="text-xl font-bold">
                  ₹{(customer.milk * customer.rate).toFixed(2)}
                </p>
              </div>
            </div>

            <button
              onClick={() => openCustomer(customer)}
              className="text-green-500 font-semibold mt-4 hover:text-green-700"
            >
              View Profile →
            </button>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <p className={`text-center py-10 ${muted}`}>
          No Milk Receiver found.
        </p>
      )}
    </div>
  );

  /* =========================
     ADMINISTRATION
  ========================= */

  const AdministrationPage = () => (
    <div className={`max-w-7xl mx-auto px-4 py-8 ${bg}`}>
      <h1 className="text-3xl md:text-4xl font-bold">Administration</h1>

      <p className={`mt-2 ${muted}`}>
        Manage and monitor your dairy operations.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
        <div className={`rounded-2xl border shadow-sm p-6 ${card}`}>
          <p className={muted}>Total Receivers</p>
          <h2 className="text-3xl font-bold text-blue-500 mt-2">
            {customers.length}
          </h2>
        </div>

        <div className={`rounded-2xl border shadow-sm p-6 ${card}`}>
          <p className={muted}>Total Milk</p>
          <h2 className="text-3xl font-bold text-green-500 mt-2">
            {totalMilk.toFixed(1)} L
          </h2>
        </div>

        <div className={`rounded-2xl border shadow-sm p-6 ${card}`}>
          <p className={muted}>Estimated Payments</p>
          <h2 className="text-3xl font-bold text-orange-500 mt-2">
            ₹{totalAmount.toFixed(2)}
          </h2>
        </div>

        <div className={`rounded-2xl border shadow-sm p-6 ${card}`}>
          <p className={muted}>Attendance Entries</p>
          <h2 className="text-3xl font-bold text-purple-500 mt-2">
            {totalPresent + totalAbsent}
          </h2>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-5">
        Administrative Sections
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <button
          onClick={() => setPage("AdminReceivers")}
          className={`text-left rounded-2xl p-6 border shadow-sm hover:shadow-lg transition ${card}`}
        >
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-xl font-bold">Receiver Management</h3>
          <p className={`mt-2 ${muted}`}>
            View receiver details and contact information.
          </p>
          <p className="text-green-500 font-semibold mt-4">
            Open Management →
          </p>
        </button>

        <button
          onClick={() => setPage("AdminAttendance")}
          className={`text-left rounded-2xl p-6 border shadow-sm hover:shadow-lg transition ${card}`}
        >
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-xl font-bold">Attendance Management</h3>
          <p className={`mt-2 ${muted}`}>
            Review Present and Absent records.
          </p>
          <p className="text-green-500 font-semibold mt-4">
            View Attendance →
          </p>
        </button>

        <button
          onClick={() => setPage("AdminPayments")}
          className={`text-left rounded-2xl p-6 border shadow-sm hover:shadow-lg transition ${card}`}
        >
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-xl font-bold">Payment Management</h3>
          <p className={`mt-2 ${muted}`}>
            Review estimated milk payments.
          </p>
          <p className="text-green-500 font-semibold mt-4">
            View Payments →
          </p>
        </button>

        <button
          onClick={() => setPage("AdminReports")}
          className={`text-left rounded-2xl p-6 border shadow-sm hover:shadow-lg transition ${card}`}
        >
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-bold">Reports</h3>
          <p className={`mt-2 ${muted}`}>
            View dairy summary and overall records.
          </p>
          <p className="text-green-500 font-semibold mt-4">
            View Reports →
          </p>
        </button>
      </div>
    </div>
  );

  /* =========================
     ADMIN RECEIVERS
  ========================= */

  const AdminReceivers = () => (
    <div className={`max-w-7xl mx-auto px-4 py-8 ${bg}`}>
      <button
        onClick={() => setPage("Administration")}
        className="text-green-500 font-semibold mb-6"
      >
        ← Back to Administration
      </button>

      <h1 className="text-3xl font-bold">People</h1>

      <p className={`mt-2 ${muted}`}>
        Add someone new to your milk receiver list or remove a person who no longer receives milk.
      </p>

      <form
        onSubmit={addCustomer}
        className={`mt-6 rounded-2xl border p-5 md:p-6 ${card}`}
      >
        <h2 className="text-xl font-bold mb-4">＋ Add a Person</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Customer Name</label>
            <input
              value={newCustomerName}
              onChange={(event) => setNewCustomerName(event.target.value)}
              placeholder="Enter customer name"
              autoComplete="name"
              className="w-full px-4 py-3 rounded-xl border border-green-200 bg-white text-gray-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Phone Number</label>
            <input
              value={newCustomerPhone}
              onChange={(event) => setNewCustomerPhone(event.target.value.replace(/\\D/g, ""))}
              placeholder="10-digit phone number"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              pattern="[0-9]{10}"
              className="w-full px-4 py-3 rounded-xl border border-green-200 bg-white text-gray-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Daily Milk (L)</label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={newCustomerMilk}
              onChange={(event) => setNewCustomerMilk(event.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-green-200 bg-white text-gray-900"
              required
            />
          </div>
        </div>

        <div className={`mt-5 rounded-xl border p-4 ${
          dark ? "border-green-900 bg-gray-800" : "border-green-100 bg-green-50"
        }`}>
          <p className="text-sm font-semibold text-green-700">Today's milk price (automatic)</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-2xl font-bold text-green-700">
                ₹{todayMilkRate.toFixed(2).replace(/\\.00$/, "")} <span className="text-sm font-semibold">per litre</span>
              </p>
              <p className={`mt-1 text-sm ${muted}`}>
                This price is taken from the Home page. No need to enter it again.
              </p>
            </div>
            <div className="rounded-lg bg-white px-4 py-3 text-right shadow-sm">
              <p className="text-xs text-gray-500">Estimated amount</p>
              <p className="text-xl font-bold text-gray-900">
                ₹{((Number(newCustomerMilk) > 0 ? Number(newCustomerMilk) : 0) * todayMilkRate).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="mt-5 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold"
        >
          + Add Person
        </button>
      </form>

      <div className="mt-8 mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold">− Remove a Person</h2>
        <p className={`text-sm ${muted}`}>Your list updates as soon as you add or remove someone.</p>
      </div>

      <div className={`rounded-2xl border overflow-hidden ${card}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={dark ? "bg-gray-800" : "bg-green-100"}>
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Milk</th>
                <th className="p-4">Rate (₹/L)</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="p-4">{customer.id}</td>
                  <td className="p-4 font-semibold">{customer.name}</td>
                  <td className="p-4">{customer.phone}</td>
                  <td className="p-4">{customer.milk} L</td>
                  <td className="p-4">₹{customer.rate}</td>
                  <td className="p-4 font-semibold">
                    ₹{(customer.milk * customer.rate).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => removeCustomer(customer.id)}
                      className="px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-semibold"
                    >
                      − Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* =========================
     ADMIN ATTENDANCE
  ========================= */

  const AdminAttendance = () => (
    <div className={`max-w-7xl mx-auto px-4 py-8 ${bg}`}>
      <button
        onClick={() => setPage("Administration")}
        className="text-green-500 font-semibold mb-6"
      >
        ← Back to Administration
      </button>

      <h1 className="text-3xl font-bold">Attendance Management</h1>

      <p className={`mt-2 ${muted}`}>
        Overall attendance summary for the sample records.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">
        <div className={`rounded-2xl p-6 border ${card}`}>
          <p className={muted}>Total Entries</p>
          <h2 className="text-3xl font-bold mt-2">
            {totalPresent + totalAbsent}
          </h2>
        </div>

        <div className={`rounded-2xl p-6 border ${card}`}>
          <p className={muted}>Present</p>
          <h2 className="text-3xl font-bold text-green-500 mt-2">
            {totalPresent}
          </h2>
        </div>

        <div className={`rounded-2xl p-6 border ${card}`}>
          <p className={muted}>Absent</p>
          <h2 className="text-3xl font-bold text-red-500 mt-2">
            {totalAbsent}
          </h2>
        </div>
      </div>

      <div className={`mt-8 rounded-2xl border overflow-hidden ${card}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={dark ? "bg-gray-800" : "bg-green-100"}>
              <tr>
                <th className="p-4">Receiver</th>
                <th className="p-4">Day 1</th>
                <th className="p-4">Day 2</th>
                <th className="p-4">Day 3</th>
                <th className="p-4">Day 4</th>
                <th className="p-4">Day 5</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer, index) => (
                <tr
                  key={customer.id}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="p-4 font-semibold">{customer.name}</td>

                  {getAttendanceRecords(customer.id).map((status, day) => (
                    <td key={day} className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          status === "Present"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* =========================
     ADMIN PAYMENTS
  ========================= */

  const AdminPayments = () => (
    <div className={`max-w-7xl mx-auto px-4 py-8 ${bg}`}>
      <button
        onClick={() => setPage("Administration")}
        className="text-green-500 font-semibold mb-6"
      >
        ← Back to Administration
      </button>

      <h1 className="text-3xl font-bold">Payment Management</h1>

      <p className={`mt-2 ${muted}`}>
        Estimated milk payments for all receivers.
      </p>

      <div className={`mt-8 rounded-2xl border p-6 ${card}`}>
        <p className={muted}>Total Estimated Amount</p>

        <h2 className="text-4xl font-bold text-orange-500 mt-2">
          ₹{totalAmount.toFixed(2)}
        </h2>

        <p className={`mt-2 ${muted}`}>
          Calculated from sample milk quantities and rates.
        </p>
      </div>

      <div className={`mt-8 rounded-2xl border overflow-hidden ${card}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={dark ? "bg-gray-800" : "bg-green-100"}>
              <tr>
                <th className="p-4">Receiver</th>
                <th className="p-4">Milk</th>
                <th className="p-4">Rate (₹/L)</th>
                <th className="p-4">Estimated Amount</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="p-4 font-semibold">{customer.name}</td>
                  <td className="p-4">{customer.milk} L</td>
                  <td className="p-4">₹{customer.rate}/L</td>
                  <td className="p-4 font-bold text-orange-500">
                    ₹{(customer.milk * customer.rate).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* =========================
     ADMIN REPORTS
  ========================= */

  const AdminReports = () => (
    <div className={`max-w-7xl mx-auto px-4 py-8 ${bg}`}>
      <button
        onClick={() => setPage("Administration")}
        className="text-green-500 font-semibold mb-6"
      >
        ← Back to Administration
      </button>

      <h1 className="text-3xl font-bold">Dairy Reports</h1>

      <p className={`mt-2 ${muted}`}>
        Overall summary of DairyFlow records.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
        <div className={`rounded-2xl border p-6 ${card}`}>
          <p className={muted}>Receivers</p>
          <h2 className="text-3xl font-bold text-blue-500 mt-2">
            {customers.length}
          </h2>
        </div>

        <div className={`rounded-2xl border p-6 ${card}`}>
          <p className={muted}>Milk</p>
          <h2 className="text-3xl font-bold text-green-500 mt-2">
            {totalMilk.toFixed(1)} L
          </h2>
        </div>

        <div className={`rounded-2xl border p-6 ${card}`}>
          <p className={muted}>Amount</p>
          <h2 className="text-3xl font-bold text-orange-500 mt-2">
            ₹{totalAmount.toFixed(2)}
          </h2>
        </div>

        <div className={`rounded-2xl border p-6 ${card}`}>
          <p className={muted}>Present</p>
          <h2 className="text-3xl font-bold text-green-500 mt-2">
            {totalPresent}
          </h2>
        </div>
      </div>

      <div className={`rounded-2xl border p-6 mt-8 ${card}`}>
        <h2 className="text-xl font-bold">Attendance Overview</h2>

        <div className="flex flex-wrap gap-4 mt-5">
          <span className="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-semibold">
            Present: {totalPresent}
          </span>

          <span className="px-4 py-2 rounded-xl bg-red-100 text-red-700 font-semibold">
            Absent: {totalAbsent}
          </span>
        </div>
      </div>
    </div>
  );

  /* =========================
     CUSTOMER PROFILE
  ========================= */

  const CustomerProfile = () => (
    <div className={`max-w-5xl mx-auto px-4 py-8 ${bg}`}>
      <button
        onClick={goBack}
        className="text-green-500 font-semibold mb-6"
      >
        ← Back to Home
      </button>

      <div className={`rounded-2xl border p-6 md:p-8 shadow-sm ${card}`}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-2xl font-bold">
            {selectedCustomer.name.charAt(0)}
          </div>

          <div className="flex-1 min-w-[180px]">
            <h1 className="text-3xl font-bold">
              {selectedCustomer.name}
            </h1>

            <p className={muted}>
              {selectedCustomer.phone}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">
          <div className="p-4 rounded-xl bg-green-100 text-green-900">
            <p className="text-sm">Today's Milk</p>
            <h2 className="text-2xl font-bold">
              {selectedCustomer.milk} L
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-blue-100 text-blue-900">
            <p className="text-sm">Rate</p>
            <h2 className="text-2xl font-bold">
              ₹{selectedCustomer.rate}/L
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-orange-100 text-orange-900">
            <p className="text-sm">Today's Amount</p>
            <h2 className="text-2xl font-bold">
              ₹{(selectedCustomer.milk * selectedCustomer.rate).toFixed(2)}
            </h2>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-5">
        Management Modules
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {["Milk Collection", "Attendance", "Payments", "Reports"].map(
          (name, index) => (
            <button
              key={name}
              onClick={() => openModule(name)}
              className={`p-6 rounded-2xl border shadow-sm hover:shadow-md transition text-left ${card}`}
            >
              <div className="text-3xl mb-3">
                {["🥛", "📅", "💰", "📊"][index]}
              </div>

              <h3 className="text-xl font-bold">{name}</h3>

              <p className={`mt-2 ${muted}`}>
                Open {name} details →
              </p>
            </button>
          )
        )}
      </div>
    </div>
  );

  /* =========================
     RECEIVER ATTENDANCE CALENDAR
  ========================= */

  const ReceiverCalendar = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const receiverRecords = calendarAttendance[selectedCustomer.id] || {};

    let presentCount = 0;
    let absentCount = 0;
    let unmarkedCount = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const key = dateKey(d);

      if (receiverRecords[key] === "Present") presentCount++;
      else if (receiverRecords[key] === "Absent") absentCount++;
      else unmarkedCount++;
    }

    const cells = [];

    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) cells.push(day);
    while (cells.length % 7 !== 0) cells.push(null);

    return (
      <div className={`w-full max-w-5xl mx-auto px-3 sm:px-4 py-5 sm:py-8 ${bg}`}>
        <button
          onClick={() => setPage("Home")}
          className="text-green-500 font-semibold mb-6"
        >
          ← Back to Milk Receivers
        </button>

        <div className={`rounded-2xl border p-5 md:p-8 ${card}`}>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {selectedCustomer.name}
              </h1>

              <p className={muted}>Attendance Calendar</p>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 items-center w-full lg:w-auto">
              <button
                onClick={() =>
                  setCalendarMonth(new Date(year, month - 1, 1))
                }
                className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap ${button}`}
              >
                ← Previous
              </button>

              <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 min-w-0">
                <select
                  value={month}
                  onChange={(event) =>
                    setCalendarMonth(new Date(year, Number(event.target.value), 1))
                  }
                  className="min-w-0 w-full sm:w-auto px-2 sm:px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm font-semibold"
                  aria-label="Select calendar month"
                >
                  {Array.from({ length: 12 }, (_, monthIndex) => (
                    <option key={monthIndex} value={monthIndex}>
                      {new Date(2000, monthIndex, 1).toLocaleString("en-IN", { month: "long" })}
                    </option>
                  ))}
                </select>

                <select
                  value={year}
                  onChange={(e) =>
                    setCalendarMonth(
                      new Date(Number(e.target.value), month, 1)
                    )
                  }
                  className="min-w-0 w-full sm:w-auto px-2 sm:px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm font-semibold"
                  aria-label="Select calendar year"
                >
                  {Array.from({ length: 101 }, (_, i) => 2000 + i).map(
                    (yearOption) => (
                      <option key={yearOption} value={yearOption}>
                        {yearOption}
                      </option>
                    )
                  )}
                </select>
              </div>

              <button
                onClick={() =>
                  setCalendarMonth(new Date(year, month + 1, 1))
                }
                className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap ${button}`}
              >
                Next →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
            <div className="rounded-xl bg-green-100 text-green-800 p-4">
              <p>Present</p>
              <h3 className="text-2xl font-bold">{presentCount}</h3>
            </div>

            <div className="rounded-xl bg-red-100 text-red-800 p-4">
              <p>Absent</p>
              <h3 className="text-2xl font-bold">{absentCount}</h3>
            </div>

            <div className="rounded-xl bg-gray-100 text-gray-700 p-4">
              <p>Not marked / Future</p>
              <h3 className="text-2xl font-bold">{unmarkedCount}</h3>
            </div>
          </div>

          <section
            aria-label={`${calendarMonth.toLocaleString("en-IN", { month: "long" })} ${year} attendance calendar`}
            className="mt-6 rounded-2xl border border-gray-200 bg-white p-2 sm:p-4 shadow-sm"
          >
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
              {[
                ["Sun", "S"], ["Mon", "M"], ["Tue", "T"], ["Wed", "W"],
                ["Thu", "T"], ["Fri", "F"], ["Sat", "S"]
              ].map(([fullDay, shortDay]) => (
                <div
                  key={fullDay}
                  className="py-2 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-500"
                  title={fullDay}
                >
                  <span className="sm:hidden">{shortDay}</span>
                  <span className="hidden sm:inline">{fullDay}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {cells.map((day, index) => {
                if (!day) {
                  return (
                    <div
                      key={`blank-${index}`}
                      aria-hidden="true"
                      className="min-h-[62px] sm:min-h-[92px] rounded-lg sm:rounded-xl border border-transparent bg-gray-50"
                    />
                  );
                }

                const d = new Date(year, month, day);
                const key = dateKey(d);
                const attendanceStatus = receiverRecords[key] || "Unmarked";
                const isPresent = attendanceStatus === "Present";
                const isAbsent = attendanceStatus === "Absent";
                const isFuture = d > today;
                const status = isPresent ? "P" : isAbsent ? "A" : "";

                const isToday =
                  d.getFullYear() === today.getFullYear() &&
                  d.getMonth() === today.getMonth() &&
                  d.getDate() === today.getDate();

                const tileStyle = isPresent
                  ? "border-green-300 bg-green-50 text-green-800"
                  : isAbsent
                  ? "border-red-200 bg-red-50 text-red-700"
                  : isFuture
                  ? "border-gray-100 bg-gray-50 text-gray-400"
                  : "border-gray-200 bg-white text-gray-700";

                return (
                  <button
                    key={key}
                    type="button"
                    disabled={isFuture}
                    onClick={() => togglePresent(selectedCustomer.id, d)}
                    title={
                      isFuture
                        ? "Future date"
                        : isPresent
                        ? "Present — click to mark Absent"
                        : isAbsent
                        ? "Absent — click to clear"
                        : "Unmarked — click to mark Present"
                    }
                    aria-label={`${day} ${calendarMonth.toLocaleString("en-IN", { month: "long" })}: ${
                      isPresent ? "Present" : isAbsent ? "Absent" : "Unmarked"
                    }`}
                    className={`min-w-0 min-h-[62px] sm:min-h-[92px] rounded-lg sm:rounded-xl border p-1.5 sm:p-2 flex flex-col items-center justify-center gap-1 sm:gap-2 transition-all ${tileStyle} ${
                      isToday ? "ring-2 ring-inset ring-blue-500" : ""
                    } ${
                      isFuture
                        ? "cursor-not-allowed"
                        : "cursor-pointer hover:border-green-400 hover:shadow-sm active:scale-[0.98]"
                    }`}
                  >
                    <span className={`text-xs sm:text-sm font-semibold ${
                      isToday ? "text-blue-700" : ""
                    }`}>
                      {day}
                    </span>

                    {status ? (
                      <span className={`min-w-5 h-5 sm:min-w-7 sm:h-7 px-1.5 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-extrabold ${
                        isPresent
                          ? "bg-green-600 text-white"
                          : "bg-red-500 text-white"
                      }`}>
                        {status}
                      </span>
                    ) : (
                      <span className="h-5 sm:h-7" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="flex flex-wrap gap-3 mt-6 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-green-500 inline-block" />
              P
            </span>

            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-red-100 border border-red-200 inline-block" />
              A
            </span>

            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-gray-100 border border-gray-200 inline-block" />
              Unmarked
            </span>
          </div>

          <p className={`mt-4 text-sm ${muted}`}>
            Click a date to cycle through grey (unmarked), green (P), and red (A).
            Click again after A to clear it. Future dates cannot be marked.
          </p>
        </div>
      </div>
    );
  };

  /* =========================
     MODULE PAGE
  ========================= */

  const ModulePage = () => {
    const records = getAttendanceRecords(selectedCustomer.id);

    return (
      <div className={`max-w-5xl mx-auto px-4 py-8 ${bg}`}>
        <button
          onClick={goBack}
          className="text-green-500 font-semibold mb-6"
        >
          ← Back to Profile
        </button>

        <div className={`rounded-2xl border p-6 md:p-8 shadow-sm ${card}`}>
          <h1 className="text-3xl font-bold">{module}</h1>

          <p className={`mt-2 ${muted}`}>
            {selectedCustomer.name} • {selectedCustomer.phone}
          </p>

          {module === "Milk Collection" && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Today's Milk Collection
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className={dark ? "bg-gray-800" : "bg-green-100"}>
                    <tr>
                      <th className="p-3">Milk</th>
                      <th className="p-3">Rate</th>
                      <th className="p-3">Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td className="p-3">{selectedCustomer.milk} L</td>
                      <td className="p-3">₹{selectedCustomer.rate}/L</td>
                      <td className="p-3 font-bold">
                        ₹{(selectedCustomer.milk * selectedCustomer.rate).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {module === "Attendance" && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Attendance Records
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className={dark ? "bg-gray-800" : "bg-green-100"}>
                    <tr>
                      <th className="p-3">Day</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {records.map((status, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-200 dark:border-gray-700"
                      >
                        <td className="p-3">Day {i + 1}</td>

                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              status === "Present"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {module === "Payments" && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Payment Summary
              </h2>

              <div className="p-5 bg-green-100 text-green-900 rounded-xl">
                <p>Total Milk</p>

                <h2 className="text-2xl font-bold mt-2">
                  {selectedCustomer.milk} L
                </h2>

                <p className="mt-4">Rate per litre</p>

                <h2 className="text-xl font-bold">
                  ₹{selectedCustomer.rate}
                </h2>

                <p className="mt-4">Total Amount</p>

                <h2 className="text-3xl font-bold">
                  ₹{(selectedCustomer.milk * selectedCustomer.rate).toFixed(2)}
                </h2>
              </div>
            </div>
          )}

          {module === "Reports" && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Receiver Report
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-blue-100 text-blue-900 rounded-xl">
                  <p>Today's Milk</p>

                  <h2 className="text-2xl font-bold mt-2">
                    {selectedCustomer.milk} L
                  </h2>
                </div>

                <div className="p-5 bg-orange-100 text-orange-900 rounded-xl">
                  <p>Today's Amount</p>

                  <h2 className="text-2xl font-bold mt-2">
                    ₹{(selectedCustomer.milk * selectedCustomer.rate).toFixed(2)}
                  </h2>
                </div>
              </div>

              <h3 className="text-lg font-bold mt-6">
                Attendance Summary
              </h3>

              <div className="flex flex-wrap gap-4 mt-4">
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl">
                  Present: {records.filter((r) => r === "Present").length}
                </span>

                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-xl">
                  Absent: {records.filter((r) => r === "Absent").length}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  /* =========================
     MENU
  ========================= */

  const MenuPage = () => (
    <div className={`max-w-6xl mx-auto px-4 py-8 ${bg}`}>
      <h1 className="text-3xl font-bold">DairyFlow Menu</h1>

      <p className={`mt-2 ${muted}`}>
        Access your dairy management modules.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {[
          { name: "Milk Collection", icon: "🥛" },
          { name: "Attendance", icon: "📅" },
          { name: "Payments", icon: "💰" },
          { name: "Reports", icon: "📊" },
        ].map((item) => (
          <button
            key={item.name}
            onClick={() => {
              setSelectedCustomer(customers[0]);
              setModule(item.name);
              setPage("Module");
            }}
            className={`p-6 border rounded-2xl text-left shadow-sm hover:shadow-lg transition ${card}`}
          >
            <span className="text-4xl">{item.icon}</span>

            <h2 className="text-xl font-bold mt-4">{item.name}</h2>

            <p className={`mt-2 ${muted}`}>
              View and manage {item.name.toLowerCase()}.
            </p>
          </button>
        ))}
      </div>
    </div>
  );

  /* =========================
     SETTINGS
  ========================= */

  const SettingsPage = () => (
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

  /* =========================
     CONTACT
  ========================= */

  const ContactPage = () => (
    <div className={`max-w-4xl mx-auto px-4 py-8 ${bg}`}>
      <button
        onClick={goHome}
        className="mb-6 text-green-500 font-semibold"
      >
        ← Back to Home
      </button>

      <div className={`rounded-2xl border shadow-sm p-6 md:p-8 ${card}`}>
        <h1 className="text-3xl font-bold">Contact Us</h1>

        <p className={`mt-3 ${muted}`}>
          Connect with DairyFlow through our contact channels.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
          <a
            href="mailto:contact@dairyflow.com"
            className={`p-5 rounded-xl border ${card} hover:shadow-md transition`}
          >
            <h2 className="font-bold text-lg">📧 Email</h2>
            <p className="text-green-500 mt-2">contact@dairyflow.com</p>
          </a>

          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noreferrer"
            className={`p-5 rounded-xl border ${card} hover:shadow-md transition`}
          >
            <h2 className="font-bold text-lg">💼 LinkedIn</h2>
            <p className="text-green-500 mt-2">Visit LinkedIn</p>
          </a>

          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className={`p-5 rounded-xl border ${card} hover:shadow-md transition`}
          >
            <h2 className="font-bold text-lg">𝕏 X / Twitter</h2>
            <p className="text-green-500 mt-2">Visit X</p>
          </a>

          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noreferrer"
            className={`p-5 rounded-xl border ${card} hover:shadow-md transition`}
          >
            <h2 className="font-bold text-lg">📸 Instagram</h2>
            <p className="text-green-500 mt-2">Visit Instagram</p>
          </a>
        </div>
      </div>
    </div>
  );

  /* =========================
     APP DISPLAY
  ========================= */

  return (
    <div className={`w-full min-w-0 min-h-screen overflow-x-hidden flex flex-col transition-colors duration-300 ${bg}`}>
      {Navbar()}

      <main className="w-full min-w-0 flex-1">
        {page === "Home" && Home()}

        {page === "Administration" && AdministrationPage()}

        {page === "AdminReceivers" && AdminReceivers()}

        {page === "AdminAttendance" && AdminAttendance()}

        {page === "AdminPayments" && AdminPayments()}

        {page === "AdminReports" && AdminReports()}

        {page === "Menu" && MenuPage()}

        {page === "Settings" && SettingsPage()}

        {page === "Contact" && ContactPage()}

        {page === "CustomerProfile" && selectedCustomer && (
          CustomerProfile()
        )}

        {page === "ReceiverCalendar" && selectedCustomer && (
          ReceiverCalendar()
        )}

        {page === "Module" && selectedCustomer && (
          ModulePage()
        )}
      </main>

      {Footer()}
    </div>
  );
}
