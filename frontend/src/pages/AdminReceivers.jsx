const AdminReceivers = ({
  dark,
  setPage,
  todayMilkRate,
  customers,
  newCustomerName,
  setNewCustomerName,
  newCustomerPhone,
  setNewCustomerPhone,
  newCustomerMilk,
  setNewCustomerMilk,
  addCustomer,
  removeCustomer,
  bg,
  card,
  muted,
}) => (
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

export default AdminReceivers;
