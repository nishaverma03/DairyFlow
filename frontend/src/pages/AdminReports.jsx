import ExcelDownload from "../components/ExcelDownload.jsx";

const AdminReports = ({
  setPage,
  customers,
  calendarAttendance,
  getAttendanceRecords,
  totalMilk,
  totalAmount,
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

    <h1 className="text-3xl font-bold">Dairy Reports</h1>

    <p className={`mt-2 ${muted}`}>
      Overall summary of DairyFlow records.
    </p>

    <ExcelDownload customers={customers} getAttendanceRecords={getAttendanceRecords} calendarAttendance={calendarAttendance} filename="DairyFlow-customers.xlsx" />

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

export default AdminReports;
