const Home = ({
  dark,
  setPage,
  search,
  setSearch,
  todayMilkRate,
  isEditingMilkRate,
  setIsEditingMilkRate,
  milkRateInput,
  setMilkRateInput,
  customers,
  saveTodayMilkRate,
  openCalendar,
  openCustomer,
  filteredCustomers,
  totalMilk,
  bg,
  card,
  muted,
  button,
}) => (
  <div className={`max-w-7xl mx-auto px-4 py-8 ${bg}`}>
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold">
        Dashboard
      </h1>

      <p className={`mt-2 ${muted}`}>
        Manage your dairy customers and daily records.
      </p>
    </div>

    <div className="df-summary grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
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
          <p className="hidden">
            PEOPLE
          </p>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-2xl" aria-hidden="true">👥</span>
        </div>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
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
        type="search" aria-label="Search receivers by name or phone"
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

    <div className="df-receivers grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {filteredCustomers.map((customer) => (
        <div
          key={customer.id}
          className={`df-receiver p-5 rounded-2xl border shadow-sm hover:shadow-lg transition ${card}`}
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

          <div className="df-receiver-totals mt-5 flex justify-between items-center">
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

export default Home;
