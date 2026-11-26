import PurchaseTotal from "../components/PurchaseTotal.jsx";
import ExcelDownload from "../components/ExcelDownload.jsx";

const ModulePage = ({
  dark,
  selectedCustomer,
  module,
  calendarAttendance,
  getAttendanceRecords,
  goBack,
  bg,
  card,
  muted,
}) => {
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
            <PurchaseTotal customer={selectedCustomer} calendarAttendance={calendarAttendance} />
            <ExcelDownload customers={[selectedCustomer]} getAttendanceRecords={getAttendanceRecords} calendarAttendance={calendarAttendance} filename={`DairyFlow-customer-${selectedCustomer.id}.xlsx`} />

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

export default ModulePage;
