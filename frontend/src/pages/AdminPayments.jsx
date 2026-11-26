const AdminPayments = ({
  dark,
  setPage,
  customers,
  totalAmount,
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

export default AdminPayments;
