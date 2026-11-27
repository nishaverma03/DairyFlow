
import { useEffect, useState } from "react";
import { apiRequest } from "../api/dairyApi.js";

const getToday = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const AdminAttendance = ({
  dark,
  setPage,
  customers,
  bg,
  card,
  muted,
}) => {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [entries, setEntries] = useState({});
  const [loading, setLoading] = useState(false);
  const [savingCustomer, setSavingCustomer] = useState(null);
  const [error, setError] = useState("");

  // Load attendance records for selected month and date
  useEffect(() => {
    let cancelled = false;

    const loadAttendance = async () => {
      if (!selectedDate) return;

      setLoading(true);
      setError("");

      try {
        const [year, month] = selectedDate.split("-");

        const results = await Promise.all(
          customers.map(async (customer) => {
            const records = await apiRequest(
              `/api/customers/${customer.id}/attendance/${year}/${Number(month)}`
            );

            const record = records.find(
              (item) => item.day === selectedDate
            );

            return {
              customerId: customer.id,
              status: record?.status || "",
              milk:
                record?.status === "Present"
                  ? String(record.milk)
                  : String(customer.milk || 1),
              rate: Number(record?.rate ?? customer.rate ?? 0),
            };
          })
        );

        if (cancelled) return;

        const nextEntries = {};

        results.forEach((item) => {
          nextEntries[item.customerId] = {
            status: item.status,
            milk: item.milk,
            rate: item.rate,
          };
        });

        setEntries(nextEntries);
      } catch (err) {
        if (!cancelled) {
          console.error("Attendance loading failed:", err);
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
  }, [selectedDate, customers]);

  // Change milk quantity for one customer
  const updateMilkQuantity = (customerId, value) => {
    setEntries((current) => ({
      ...current,
      [customerId]: {
        ...current[customerId],
        milk: value,
      },
    }));
  };

  // Change attendance status
  const updateStatus = (customerId, status) => {
    setEntries((current) => ({
      ...current,
      [customerId]: {
        ...current[customerId],
        status,
      },
    }));
  };

  // Save attendance and daily milk quantity
  const saveEntry = async (customer) => {
    const entry = entries[customer.id];

    if (!entry) return;

    if (
      entry.status !== "Present" &&
      entry.status !== "Absent"
    ) {
      alert("Please select Present or Absent.");
      return;
    }

    const quantity = Number(entry.milk);

    if (
      entry.status === "Present" &&
      (!Number.isFinite(quantity) || quantity <= 0)
    ) {
      alert("Please enter a valid milk quantity.");
      return;
    }

    try {
      setSavingCustomer(customer.id);
      setError("");

      const result = await apiRequest(
        `/api/customers/${customer.id}/attendance/${selectedDate}`,
        {
          method: "PUT",
          body: JSON.stringify({
            status: entry.status,
            milk:
              entry.status === "Present"
                ? quantity
                : null,
          }),
        }
      );

      setEntries((current) => ({
        ...current,
        [customer.id]: {
          status: result.status,
          milk: String(result.milk),
          rate: Number(result.rate),
        },
      }));

      alert(`${customer.name}'s daily milk entry saved!`);
    } catch (err) {
      console.error("Failed to save attendance:", err);
      alert(err.message || "Unable to save daily milk entry.");
    } finally {
      setSavingCustomer(null);
    }
  };

  const presentCount = Object.values(entries).filter(
    (entry) => entry.status === "Present"
  ).length;

  const absentCount = Object.values(entries).filter(
    (entry) => entry.status === "Absent"
  ).length;

  const totalMilk = Object.values(entries).reduce(
    (sum, entry) =>
      sum +
      (entry.status === "Present"
        ? Number(entry.milk || 0)
        : 0),
    0
  );

  const totalAmount = Object.values(entries).reduce(
    (sum, entry) =>
      sum +
      (entry.status === "Present"
        ? Number(entry.milk || 0) * Number(entry.rate || 0)
        : 0),
    0
  );

  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 ${bg}`}>
      <button
        onClick={() => setPage("Administration")}
        className="text-green-500 font-semibold mb-6"
      >
        ← Back to Administration
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Daily Milk Management
          </h1>

          <p className={`mt-2 ${muted}`}>
            Manage attendance and customize each customer's
            daily milk quantity.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Select delivery date
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded-xl px-4 py-3 text-gray-800"
          />
        </div>
      </div>

      {/* Daily summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
        <div className={`rounded-2xl p-5 border ${card}`}>
          <p className={muted}>Present</p>
          <h2 className="text-3xl font-bold text-green-500 mt-2">
            {presentCount}
          </h2>
        </div>

        <div className={`rounded-2xl p-5 border ${card}`}>
          <p className={muted}>Absent</p>
          <h2 className="text-3xl font-bold text-red-500 mt-2">
            {absentCount}
          </h2>
        </div>

        <div className={`rounded-2xl p-5 border ${card}`}>
          <p className={muted}>Total Milk</p>
          <h2 className="text-3xl font-bold mt-2">
            {totalMilk.toFixed(3)} L
          </h2>
        </div>

        <div className={`rounded-2xl p-5 border ${card}`}>
          <p className={muted}>Total Amount</p>
          <h2 className="text-3xl font-bold text-green-500 mt-2">
            ₹{totalAmount.toFixed(2)}
          </h2>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 rounded-xl bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {/* Customer records */}
      <div className={`mt-8 rounded-2xl border overflow-hidden ${card}`}>
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">
            Customer Milk Entries
          </h2>

          <p className={`text-sm mt-1 ${muted}`}>
            Regular quantity is used as the default. Change it
            for this date whenever required.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            Loading daily milk records...
          </div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center">
            No customers found.
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {customers.map((customer) => {
              const entry = entries[customer.id] || {
                status: "",
                milk: String(customer.milk || 1),
                rate: Number(customer.rate || 0),
              };

              const quantity = Number(entry.milk || 0);

              const amount =
                entry.status === "Present"
                  ? quantity * entry.rate
                  : 0;

              return (
                <div
                  key={customer.id}
                  className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center"
                >
                  {/* Customer */}
                  <div className="lg:col-span-3">
                    <h3 className="font-bold text-lg">
                      {customer.name}
                    </h3>

                    <p className={`text-sm mt-1 ${muted}`}>
                      {customer.phone}
                    </p>

                    <p className={`text-xs mt-1 ${muted}`}>
                      Regular: {customer.milk} L
                    </p>
                  </div>

                  {/* Attendance */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold mb-2">
                      Attendance
                    </label>

                    <select
                      value={entry.status}
                      onChange={(e) =>
                        updateStatus(customer.id, e.target.value)
                      }
                      className="w-full border rounded-lg px-3 py-2 text-gray-800"
                    >
                      <option value="">Not marked</option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold mb-2">
                      Milk (Litres)
                    </label>

                    <input
                      type="number"
                      min="0.001"
                      max="999999.999"
                      step="0.001"
                      value={entry.milk}
                      disabled={entry.status === "Absent"}
                      onChange={(e) =>
                        updateMilkQuantity(
                          customer.id,
                          e.target.value
                        )
                      }
                      className="w-full border rounded-lg px-3 py-2 text-gray-800 disabled:bg-gray-200"
                    />
                  </div>

                  {/* Rate */}
                  <div className="lg:col-span-1">
                    <p className="text-sm font-semibold">Rate</p>
                    <p className="mt-2">
                      ₹{Number(entry.rate).toFixed(2)}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="lg:col-span-2">
                    <p className="text-sm font-semibold">Amount</p>
                    <p className="mt-2 font-bold text-green-500">
                      ₹{amount.toFixed(2)}
                    </p>
                  </div>

                  {/* Save */}
                  <div className="lg:col-span-2">
                    <button
                      onClick={() => saveEntry(customer)}
                      disabled={
                        savingCustomer === customer.id ||
                        !entry.status
                      }
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg px-4 py-3"
                    >
                      {savingCustomer === customer.id
                        ? "Saving..."
                        : "Save Entry"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className={`mt-5 text-sm ${muted}`}>
        Note: Changes apply only to the selected date.
        The customer's regular milk quantity remains unchanged.
      </p>
    </div>
  );
};

export default AdminAttendance;
