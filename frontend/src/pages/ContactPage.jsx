import { useState } from "react";
import { Phone } from "lucide-react";

export default function ContactPage({ customers, goHome, bg, card, muted }) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const buyers = customers.filter(({ name, phone }) =>
    name.toLowerCase().includes(query) || String(phone).includes(query)
  );

  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 ${bg}`}>
      <button onClick={goHome} className="mb-6 text-green-500 font-semibold">
        ← Back to Home
      </button>
      <h1 className="text-3xl font-bold">Buyer Contacts</h1>
      <label className="block mt-6 mb-2 font-medium" htmlFor="buyer-search">
        Search by name or phone number
      </label>
      <input id="buyer-search" type="search" value={search}
        onChange={event => setSearch(event.target.value)}
        className={`w-full rounded-xl border px-4 py-3 ${card}`} />
      {buyers.length ? (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {buyers.map(({ id, name, phone }) => (
            <li key={id} className={`rounded-xl border px-4 py-3 ${card}`}>
              <h2 className="font-semibold break-words">{name}</h2>
              <a href={`tel:${phone}`} aria-label={`Call ${name} at ${phone}`}
                className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4">
                <Phone size={16} aria-hidden="true" />{phone}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p role="status" className={`mt-5 ${muted}`}>
          {customers.length ? "No buyers match your search." : "Your buyer list is empty."}
        </p>
      )}
    </div>
  );
}
