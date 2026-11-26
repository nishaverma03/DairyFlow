import PurchaseTotal from "../components/PurchaseTotal.jsx";

const CustomerProfile = ({
  selectedCustomer,
  calendarAttendance,
  openModule,
  goBack,
  bg,
  card,
  muted,
}) => (
  <div className={`max-w-5xl mx-auto px-4 py-8 ${bg}`}>
    <button
      onClick={goBack}
      className="text-green-500 font-semibold mb-6"
    >
      ← Back to Home
    </button>

    <div className={`rounded-2xl border p-6 md:p-8 shadow-sm ${card}`}>
      <div className="flex flex-wrap items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-2xl font-bold">
          {selectedCustomer.name.charAt(0)}
        </div>

        <div className="flex-1 min-w-[180px]">
          <h1 className="text-3xl font-bold">
            {selectedCustomer.name}
          </h1>

          <p className={muted}>
            {selectedCustomer.phone}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">
        <div className="p-4 rounded-xl bg-green-100 text-green-900">
          <p className="text-sm">Today's Milk</p>
          <h2 className="text-2xl font-bold">
            {selectedCustomer.milk} L
          </h2>
        </div>

        <div className="p-4 rounded-xl bg-blue-100 text-blue-900">
          <p className="text-sm">Rate</p>
          <h2 className="text-2xl font-bold">
            ₹{selectedCustomer.rate}/L
          </h2>
        </div>

        <div className="p-4 rounded-xl bg-orange-100 text-orange-900">
          <p className="text-sm">Today's Amount</p>
          <h2 className="text-2xl font-bold">
            ₹{(selectedCustomer.milk * selectedCustomer.rate).toFixed(2)}
          </h2>
        </div>
      </div>
    </div>

    <PurchaseTotal customer={selectedCustomer} calendarAttendance={calendarAttendance} />

    <h2 className="text-2xl font-bold mt-8 mb-5">
      Management Modules
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {["Milk Collection", "Attendance", "Payments", "Reports"].map(
        (name, index) => (
          <button
            key={name}
            onClick={() => openModule(name)}
            className={`p-6 rounded-2xl border shadow-sm hover:shadow-md transition text-left ${card}`}
          >
            <div className="text-3xl mb-3">
              {["🥛", "📅", "💰", "📊"][index]}
            </div>

            <h3 className="text-xl font-bold">{name}</h3>

            <p className={`mt-2 ${muted}`}>
              Open {name} details →
            </p>
          </button>
        )
      )}
    </div>
  </div>
);

export default CustomerProfile;
