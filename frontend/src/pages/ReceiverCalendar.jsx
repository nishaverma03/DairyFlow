
import { useEffect, useState } from "react";
import { apiRequest } from "../api/dairyApi.js";

const ReceiverCalendar = ({
  setPage,
  selectedCustomer,
  calendarMonth,
  setCalendarMonth,
  dateKey,
  bg,
  card,
  muted,
  button,
}) => {
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [records, setRecords] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [status, setStatus] = useState("Present");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load attendance from backend
  useEffect(() => {
    let cancelled = false;

    const loadAttendance = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await apiRequest(
          `/api/customers/${selectedCustomer.id}/attendance/${year}/${month + 1}`
        );

        const attendanceList = Array.isArray(data)
          ? data
          : data.records || [];

        const nextRecords = {};

        attendanceList.forEach((record) => {
          const day = String(record.day).padStart(2, "0");

          const key = `${year}-${String(month + 1).padStart(2, "0")}-${day}`;

          nextRecords[key] = {
            status: record.status,
            milk: Number(record.milk ?? 0),
            rate: record.rate,
          };
        });

        if (!cancelled) {
          setRecords(nextRecords);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load attendance.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAttendance();

    return () => {
      cancelled = true;
    };
  }, [selectedCustomer.id, year, month]);

  const receiverRecords = records;

  // Attendance counts
  let presentCount = 0;
  let absentCount = 0;
  let unmarkedCount = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const key = dateKey(new Date(year, month, day));
    const record = receiverRecords[key];

    if (record?.status === "Present") {
      presentCount++;
    } else if (record?.status === "Absent") {
      absentCount++;
    } else {
      unmarkedCount++;
    }
  }

  // Calendar cells
  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  // Open attendance editor
  const openEditor = (date) => {
    const key = dateKey(date);
    const existing = receiverRecords[key];

    setSelectedDate(date);
    setStatus(existing?.status || "Present");

    setQuantity(
      String(
        existing?.status === "Present" && existing.milk > 0
          ? existing.milk
          : selectedCustomer.milk ?? 1
      )
    );

    setError("");
  };

  // Save attendance
  const saveAttendance = async () => {
    if (!selectedDate) return;

    if (
      status === "Present" &&
      (!quantity ||
        !Number.isFinite(Number(quantity)) ||
        Number(quantity) <= 0)
    ) {
      setError("Please enter a valid milk quantity greater than zero.");
      return;
    }

    const key = dateKey(selectedDate);

    setSaving(true);
    setError("");

    try {
      const result = await apiRequest(
        `/api/customers/${selectedCustomer.id}/attendance/${key}`,
        {
          method: "PUT",
          body: JSON.stringify({
            status,
            milk: status === "Present" ? Number(quantity) : null,
          }),
        }
      );

      setRecords((previous) => ({
        ...previous,
        [key]: {
          status: result.status || status,
          milk:
            result.milk ??
            (status === "Present" ? Number(quantity) : 0),
          rate: result.rate ?? selectedCustomer.rate,
        },
      }));

      setSelectedDate(null);
    } catch (err) {
      setError(err.message || "Unable to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`w-full max-w-5xl mx-auto px-3 sm:px-4 py-5 sm:py-8 ${bg}`}>

      {/* Back Button */}
      <button
        onClick={() => setPage("Home")}
        className="text-green-600 font-semibold mb-6"
      >
        ← Back to Milk Receivers
      </button>

      <div className={`rounded-2xl border p-5 md:p-8 ${card}`}>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">

          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {selectedCustomer.name}
            </h1>

            <p className={muted}>Attendance Calendar</p>

            <p className={`text-sm mt-1 ${muted}`}>
              Regular milk quantity: {selectedCustomer.milk} L
            </p>
          </div>

          {/* Month and Year Selection */}
          <div className="grid grid-cols-2 sm:flex gap-2 items-center">

            <button
              onClick={() =>
                setCalendarMonth(new Date(year, month - 1, 1))
              }
              className={`px-3 py-2 rounded-lg text-sm ${button}`}
            >
              ← Previous
            </button>

            <select
              value={month}
              onChange={(e) =>
                setCalendarMonth(
                  new Date(year, Number(e.target.value), 1)
                )
              }
              className="px-3 py-2 rounded-lg border bg-white text-gray-900 text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(2000, i, 1).toLocaleString("en-IN", {
                    month: "long",
                  })}
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
              className="px-3 py-2 rounded-lg border bg-white text-gray-900 text-sm"
            >
              {Array.from({ length: 101 }, (_, i) => 2000 + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <button
              onClick={() =>
                setCalendarMonth(new Date(year, month + 1, 1))
              }
              className={`px-3 py-2 rounded-lg text-sm ${button}`}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Attendance Summary */}
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
            <p>Not Marked</p>
            <h3 className="text-2xl font-bold">{unmarkedCount}</h3>
          </div>

        </div>

        {loading && (
          <p className="text-center text-gray-500 my-4">
            Loading attendance...
          </p>
        )}

        {error && !selectedDate && (
          <p className="text-red-600 bg-red-50 rounded-lg p-3 mb-4">
            {error}
          </p>
        )}

        {/* Calendar */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-2 sm:p-4 shadow-sm">

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day) => (
                <div
                  key={day}
                  className="py-2 text-center text-[10px] sm:text-xs font-bold uppercase text-gray-500"
                >
                  {day}
                </div>
              )
            )}
          </div>

          {/* Calendar Dates */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">

            {cells.map((day, index) => {
              if (!day) {
                return (
                  <div
                    key={`blank-${index}`}
                    className="min-h-[65px] sm:min-h-[95px] rounded-lg bg-gray-50"
                  />
                );
              }

              const date = new Date(year, month, day);
              const key = dateKey(date);
              const record = receiverRecords[key];

              const isPresent = record?.status === "Present";
              const isAbsent = record?.status === "Absent";
              const isFuture = date > today;

              const isToday =
                date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate();

              // Calendar Colors
              const tileStyle = isPresent
                ? "border-green-500 bg-green-500 text-white"
                : isAbsent
                ? "border-red-500 bg-red-500 text-white"
                : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50";

              return (
                <button
                  key={key}
                  type="button"
                  disabled={isFuture || loading}
                  onClick={() => openEditor(date)}
                  title={
                    isFuture
                      ? "Future date"
                      : "Click to edit attendance"
                  }
                  className={`
                    min-w-0 min-h-[65px] sm:min-h-[95px]
                    rounded-lg sm:rounded-xl border p-1.5 sm:p-2
                    flex flex-col items-center justify-center gap-1
                    transition-all
                    ${tileStyle}
                    ${isToday ? "ring-2 ring-inset ring-blue-500" : ""}
                    ${
                      isFuture
                        ? "cursor-not-allowed opacity-70"
                        : "cursor-pointer hover:shadow-md hover:border-blue-400"
                    }
                  `}
                >

                  <span className="text-xs sm:text-sm font-semibold">
                    {day}
                  </span>

                  {isPresent && (
                    <>
                      <span className="w-6 h-6 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-bold">
                        P
                      </span>

                      <span className="text-[10px] font-bold">
                        {record.milk} L
                      </span>
                    </>
                  )}

                  {isAbsent && (
                    <span className="w-6 h-6 rounded-full bg-red-700 text-white flex items-center justify-center text-xs font-bold">
                      A
                    </span>
                  )}

                  {!isPresent && !isAbsent && (
                    <span className="h-6" />
                  )}

                </button>
              );
            })}

          </div>
        </section>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 text-sm">

          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-white border border-gray-300 inline-block" />
            Not Marked
          </span>

          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-green-500 inline-block" />
            Present
          </span>

          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-red-500 inline-block" />
            Absent
          </span>

        </div>

        <p className={`mt-4 text-sm ${muted}`}>
          Click a date to edit its attendance. Milk quantity can be
          customized only for the selected date.
        </p>

      </div>

      {/* Attendance Editor Popup */}
      {selectedDate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !saving) {
              setSelectedDate(null);
              setError("");
            }
          }}
        >

          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="attendance-editor-title"
          >

            {/* Popup Header */}
            <div className="flex justify-between items-start gap-3">

              <div>
                <h2
                  id="attendance-editor-title"
                  className="text-xl font-bold text-gray-900"
                >
                  Edit Attendance
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedCustomer.name}
                </p>

                <p className="text-sm font-semibold text-gray-700">
                  {selectedDate.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedDate(null);
                  setError("");
                }}
                disabled={saving}
                className="text-gray-500 hover:text-red-600 text-2xl leading-none"
                aria-label="Close editor"
              >
                ×
              </button>

            </div>

            {/* Present / Absent Selection */}
            <div className="mt-6">

              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Select Attendance
              </label>

              <div className="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() => setStatus("Present")}
                  className={`py-3 rounded-xl border-2 font-bold transition ${
                    status === "Present"
                      ? "bg-green-100 border-green-500 text-green-800"
                      : "bg-white border-gray-200 text-gray-600"
                  }`}
                >
                  ✓ Present
                </button>

                <button
                  type="button"
                  onClick={() => setStatus("Absent")}
                  className={`py-3 rounded-xl border-2 font-bold transition ${
                    status === "Absent"
                      ? "bg-red-100 border-red-500 text-red-800"
                      : "bg-white border-gray-200 text-gray-600"
                  }`}
                >
                  ✕ Absent
                </button>

              </div>
            </div>

            {/* Milk Quantity */}
            {status === "Present" && (
              <div className="mt-5">

                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Milk Quantity (Litres)
                </label>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter milk quantity"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <p className="text-xs text-gray-500 mt-2">
                  Regular quantity: {selectedCustomer.milk} L.
                  Changing this value will not change the customer's
                  regular quantity or other dates.
                </p>

              </div>
            )}

            {/* Absent Information */}
            {status === "Absent" && (
              <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                This customer will be marked absent. Milk quantity
                for this date will be saved as 0 L.
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {/* Save / Cancel */}
            <div className="flex gap-3 mt-6">

              <button
                type="button"
                onClick={saveAttendance}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedDate(null);
                  setError("");
                }}
                disabled={saving}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100"
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ReceiverCalendar;
