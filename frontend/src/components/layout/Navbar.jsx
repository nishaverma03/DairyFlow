import { House, LayoutGrid, LogOut, Milk, Phone, Settings } from "lucide-react";

const destinations = [
  { page: "Home", label: "Home", Icon: House },
  { page: "Administration", label: "Admin", Icon: LayoutGrid },
  { page: "Contact", label: "Contact", Icon: Phone },
  { page: "Settings", label: "Settings", Icon: Settings },
];

export default function Navbar({ dark, page, setPage, goHome, logout }) {
  const active = page.startsWith("Admin") ? "Administration"
    : ["CustomerProfile", "ReceiverCalendar", "Module", "Menu"].includes(page) ? "Home" : page;

  return (
    <header className="df-header" data-dark={dark}>
      <div className="df-header-inner">
        <button className="df-brand" onClick={goHome} aria-label="DairyFlow home">
          <span><Milk size={23} aria-hidden="true" /></span>DairyFlow
        </button>
        <nav className="df-nav" aria-label="Main navigation">
          {destinations.map(({ page: target, label, Icon }) => (
            <button key={target} aria-current={active === target ? "location" : undefined}
              onClick={target === "Home" ? goHome : () => setPage(target)}>
              <Icon size={20} aria-hidden="true" />{label}
            </button>
          ))}
        </nav>
        <button className="df-signout" onClick={logout}><LogOut size={18} aria-hidden="true" />Sign out</button>
      </div>
    </header>
  );
}
