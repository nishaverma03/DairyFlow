const AdminAttendance = ({
  dark,
  setPage,
  customers,
  getAttendanceRecords,
  totalPresent,
  totalAbsent,
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

export default AdminAttendance;
