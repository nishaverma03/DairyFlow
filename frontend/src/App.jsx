import { useState, useEffect } from "react";
import { TODAY_MILK_RATE, sampleCustomers, attendanceRecords } from "./data/dairy.js";
import { ALLOWED_USERS } from "./auth/allowedUsers.js";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import Home from "./pages/Home.jsx";
import AdministrationPage from "./pages/AdministrationPage.jsx";
import AdminReceivers from "./pages/AdminReceivers.jsx";
import AdminAttendance from "./pages/AdminAttendance.jsx";
import AdminPayments from "./pages/AdminPayments.jsx";
import AdminReports from "./pages/AdminReports.jsx";
import CustomerProfile from "./pages/CustomerProfile.jsx";
import ReceiverCalendar from "./pages/ReceiverCalendar.jsx";
import ModulePage from "./pages/ModulePage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

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
    localStorage.removeItem("dairyflow_currentUser");
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

  const reportAttendance = customers.flatMap(customer => getAttendanceRecords(customer.id));
  const totalPresent = reportAttendance.filter(
    (status) => status === "Present"
  ).length;

  const totalAbsent = reportAttendance.filter(
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


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page, loggedIn]);

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-emerald-200 px-4 py-10">
        <div className="df-login w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-green-100">
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

              const normalizedEmail = email.trim().toLowerCase();
              const matchedUser = ALLOWED_USERS.find(
                (user) =>
                  user.email.toLowerCase() === normalizedEmail &&
                  user.password === password
              );

              if (!matchedUser) {
                alert("Invalid email or password. Please use an authorized DairyFlow account.");
                return;
              }

              // Only an email/password pair listed in ALLOWED_USERS can sign in.
              localStorage.setItem("dairyflow_currentUser", matchedUser.email);
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



  return (
    <div className={`df-shell w-full min-w-0 min-h-screen overflow-x-hidden flex flex-col transition-colors duration-300 ${bg}`}>
      {<Navbar
          dark={dark}
          page={page}
          setPage={setPage}
          goHome={goHome}
          logout={logout}
          button={button}
        />}

      <main key={page} className="df-screen w-full min-w-0 flex-1">
        {page === "Home" && <Home
            dark={dark}
            setPage={setPage}
            search={search}
            setSearch={setSearch}
            todayMilkRate={todayMilkRate}
            isEditingMilkRate={isEditingMilkRate}
            setIsEditingMilkRate={setIsEditingMilkRate}
            milkRateInput={milkRateInput}
            setMilkRateInput={setMilkRateInput}
            customers={customers}
            saveTodayMilkRate={saveTodayMilkRate}
            openCalendar={openCalendar}
            openCustomer={openCustomer}
            filteredCustomers={filteredCustomers}
            totalMilk={totalMilk}
            bg={bg}
            card={card}
            muted={muted}
            button={button}
          />}

        {page === "Administration" && <AdministrationPage
            setPage={setPage}
            customers={customers}
            totalMilk={totalMilk}
            totalAmount={totalAmount}
            totalPresent={totalPresent}
            totalAbsent={totalAbsent}
            bg={bg}
            card={card}
            muted={muted}
          />}

        {page === "AdminReceivers" && <AdminReceivers
            dark={dark}
            setPage={setPage}
            todayMilkRate={todayMilkRate}
            customers={customers}
            newCustomerName={newCustomerName}
            setNewCustomerName={setNewCustomerName}
            newCustomerPhone={newCustomerPhone}
            setNewCustomerPhone={setNewCustomerPhone}
            newCustomerMilk={newCustomerMilk}
            setNewCustomerMilk={setNewCustomerMilk}
            addCustomer={addCustomer}
            removeCustomer={removeCustomer}
            bg={bg}
            card={card}
            muted={muted}
          />}

        {page === "AdminAttendance" && <AdminAttendance
            dark={dark}
            setPage={setPage}
            customers={customers}
            getAttendanceRecords={getAttendanceRecords}
            totalPresent={totalPresent}
            totalAbsent={totalAbsent}
            bg={bg}
            card={card}
            muted={muted}
          />}

        {page === "AdminPayments" && <AdminPayments
            dark={dark}
            setPage={setPage}
            customers={customers}
            totalAmount={totalAmount}
            bg={bg}
            card={card}
            muted={muted}
          />}

        {page === "AdminReports" && <AdminReports
            calendarAttendance={calendarAttendance}
            getAttendanceRecords={getAttendanceRecords}
            setPage={setPage}
            customers={customers}
            totalMilk={totalMilk}
            totalAmount={totalAmount}
            totalPresent={totalPresent}
            totalAbsent={totalAbsent}
            bg={bg}
            card={card}
            muted={muted}
          />}

        {page === "Menu" && <MenuPage
            setPage={setPage}
            setSelectedCustomer={setSelectedCustomer}
            setModule={setModule}
            customers={customers}
            bg={bg}
            card={card}
            muted={muted}
          />}

        {page === "Settings" && <SettingsPage
            dark={dark}
            setDark={setDark}
            managerName={managerName}
            setManagerName={setManagerName}
            managerEmail={managerEmail}
            setManagerEmail={setManagerEmail}
            milkNotifications={milkNotifications}
            setMilkNotifications={setMilkNotifications}
            attendanceNotifications={attendanceNotifications}
            setAttendanceNotifications={setAttendanceNotifications}
            paymentNotifications={paymentNotifications}
            setPaymentNotifications={setPaymentNotifications}
            defaultUnit={defaultUnit}
            setDefaultUnit={setDefaultUnit}
            currency={currency}
            setCurrency={setCurrency}
            profileSaved={profileSaved}
            setProfileSaved={setProfileSaved}
            goHome={goHome}
            logout={logout}
            bg={bg}
            card={card}
            muted={muted}
          />}

        {page === "Contact" && <ContactPage customers={customers}
            goHome={goHome}
            bg={bg}
            card={card}
            muted={muted}
          />}

        {page === "CustomerProfile" && selectedCustomer && (
          <CustomerProfile
            calendarAttendance={calendarAttendance}
            selectedCustomer={selectedCustomer}
            openModule={openModule}
            goBack={goBack}
            bg={bg}
            card={card}
            muted={muted}
          />
        )}

        {page === "ReceiverCalendar" && selectedCustomer && (
          <ReceiverCalendar
            setPage={setPage}
            selectedCustomer={selectedCustomer}
            calendarMonth={calendarMonth}
            setCalendarMonth={setCalendarMonth}
            calendarAttendance={calendarAttendance}
            dateKey={dateKey}
            togglePresent={togglePresent}
            bg={bg}
            card={card}
            muted={muted}
            button={button}
          />
        )}

        {page === "Module" && selectedCustomer && (
          <ModulePage
            calendarAttendance={calendarAttendance}
            dark={dark}
            selectedCustomer={selectedCustomer}
            module={module}
            getAttendanceRecords={getAttendanceRecords}
            goBack={goBack}
            bg={bg}
            card={card}
            muted={muted}
          />
        )}
      </main>

      {<Footer
        />}
    </div>
  );
}
