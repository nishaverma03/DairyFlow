const ReceiverCalendar = ({
  setPage,
  selectedCustomer,
  calendarMonth,
  setCalendarMonth,
  calendarAttendance,
  dateKey,
  togglePresent,
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

export default ReceiverCalendar;
