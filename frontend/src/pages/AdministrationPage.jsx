const AdministrationPage = ({
  setPage,
  customers,
  totalMilk,
  totalAmount,
  totalPresent,
  totalAbsent,
  bg,
  card,
  muted,
}) => (
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

export default AdministrationPage;
