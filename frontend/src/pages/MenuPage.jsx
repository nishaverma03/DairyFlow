const MenuPage = ({
  setPage,
  setSelectedCustomer,
  setModule,
  customers,
  bg,
  card,
  muted,
}) => (
  <div className={`max-w-6xl mx-auto px-4 py-8 ${bg}`}>
    <h1 className="text-3xl font-bold">DairyFlow Menu</h1>

    <p className={`mt-2 ${muted}`}>
      Access your dairy management modules.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
      {[
        { name: "Milk Collection", icon: "🥛" },
        { name: "Attendance", icon: "📅" },
        { name: "Payments", icon: "💰" },
        { name: "Reports", icon: "📊" },
      ].map((item) => (
        <button
          key={item.name}
          onClick={() => {
            setSelectedCustomer(customers[0]);
            setModule(item.name);
            setPage("Module");
          }}
          className={`p-6 border rounded-2xl text-left shadow-sm hover:shadow-lg transition ${card}`}
        >
          <span className="text-4xl">{item.icon}</span>

          <h2 className="text-xl font-bold mt-4">{item.name}</h2>

          <p className={`mt-2 ${muted}`}>
            View and manage {item.name.toLowerCase()}.
          </p>
        </button>
      ))}
    </div>
  </div>
);

export default MenuPage;
