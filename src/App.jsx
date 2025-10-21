import { useEffect, useMemo, useState } from "react";
import "./App.css";

const STORAGE_KEY = "contacts-v1";

const FALLBACK_CONTACTS = [
  { id: 1, name: "Ahmed Hamido", phone: "(646) 715-9775", email: "enm7781@gmail.com" },
  { id: 2, name: "Sophia Martinez", phone: "(917) 284-6120", email: "sophiamnyc@gmail.com" },
  { id: 3, name: "Liam Johnson", phone: "(347) 602-1943", email: "liamjny@gmail.com" },
  { id: 4, name: "Ava Chen", phone: "(929) 331-7854", email: "avachenbk@gmail.com" },
  { id: 5, name: "Noah Patel", phone: "(212) 997-4830", email: "noahpatelny@gmail.com" },
  { id: 6, name: "Isabella Rivera", phone: "(718) 940-2257", email: "isabellanyc@gmail.com" },
  { id: 7, name: "Ethan Kim", phone: "(646) 812-4389", email: "ethankny@gmail.com" },
  { id: 8, name: "Maya Thompson", phone: "(929) 458-6732", email: "mayathompsonny@gmail.com" },
  { id: 9, name: "Daniel Rossi", phone: "(917) 526-9981", email: "danielrossiny@gmail.com" },
  { id: 10, name: "Olivia Brown", phone: "(718) 247-5564", email: "oliviabny@gmail.com" },
];

function Highlight({ text, query }) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, i) =>
    regex.test(part) ? <span key={i} style={{ color: "#7dfc98" }}>{part}</span> : part
  );
}

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState({});

  
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setContacts(JSON.parse(saved));
    else setContacts(FALLBACK_CONTACTS);
  }, []);

 
  useEffect(() => {
    if (contacts.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return contacts.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q)
    );
  }, [contacts, query]);

  
  useEffect(() => {
    if (page > 0 && page >= filtered.length) setPage(0);
  }, [filtered.length, page]);

  const current = filtered[page] || null;
  const nextPage = () => setPage((p) => Math.min(p + 1, filtered.length - 1));
  const prevPage = () => setPage((p) => Math.max(p - 1, 0));

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (form.email && !form.email.includes("@")) e.email = "Invalid email";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    setErrors(e2);
    if (Object.keys(e2).length) return;

    const newContact = {
      id: Date.now(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
    };
    setContacts([newContact, ...contacts]);
    setForm({ name: "", phone: "", email: "" });
    setPage(0);
  };

  return (
    <main className="page">
      {}
      <section className="search" aria-labelledby="search-heading">
        <h2 id="search-heading">Search Contacts</h2>
        <div className="search__controls">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="search"
            placeholder="Search by name or phone"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
          />
        </div>
        <p className="search__results">
          Showing {filtered.length} {filtered.length === 1 ? "result" : "results"}
        </p>
      </section>

      {}
      <section className="contacts" aria-labelledby="contacts-heading">
        <h2 id="contacts-heading">Contacts</h2>
        {current && (
          <ul className="contacts__grid" aria-live="polite">
            <li className="contact-card">
              <h3 className="contact-card__name">
                <Highlight text={current.name} query={query} />
              </h3>
              <p className="contact-card__phone">
                <Highlight text={current.phone} query={query} />
              </p>
              <p className="contact-card__email">{current.email}</p>
            </li>
          </ul>
        )}
        <nav className="pager" aria-label="Contact pagination">
          <button className="btn" onClick={prevPage} disabled={page === 0}>
            ◀ Prev
          </button>
          <span>
            {filtered.length ? `Contact ${page + 1} of ${filtered.length}` : "No results"}
          </span>
          <button className="btn" onClick={nextPage} disabled={page >= filtered.length - 1}>
            Next ▶
          </button>
        </nav>
      </section>

      {/* Add a Contact (now in a card) */}
      <section className="form" aria-labelledby="form-heading">
        <h2 id="form-heading">Add a Contact</h2>

        <div className="form-card">
          <form className="form__body" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Name *</label>
              <input
                id="name"
                name="name"
                placeholder="e.g., Jane Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                aria-invalid={!!errors.name}
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="field">
              <label htmlFor="phone">Phone *</label>
              <input
                id="phone"
                name="phone"
                inputMode="tel"
                placeholder="(555) 555-5555"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g., jane.doe@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                aria-invalid={!!errors.email}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form__actions">
              <button className="btn" type="submit">Add Contact</button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
