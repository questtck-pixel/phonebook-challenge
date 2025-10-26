import { useEffect, useMemo, useState } from "react";
import "./App.css";

const STORAGE_KEY = "contacts-v1";

const avatarFor = (name, photo) =>
  photo ||
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    name
  )}&backgroundType=gradientLinear&fontWeight=700`;

const FALLBACK_CONTACTS = [
  {
    id: 1,
    name: "Ahmed Hamido",
    phone: "(646) 715-9775",
    email: "enm7781@gmail.com",
    photo: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    id: 2,
    name: "Sophia Martinez",
    phone: "(917) 284-6120",
    email: "sophiamnyc@gmail.com",
    photo: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    id: 3,
    name: "Liam Johnson",
    phone: "(347) 602-1943",
    email: "liamjny@gmail.com",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 4,
    name: "Ava Chen",
    phone: "(929) 331-7854",
    email: "avachenbk@gmail.com",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 5,
    name: "Noah Patel",
    phone: "(212) 997-4830",
    email: "noahpatelny@gmail.com",
    photo: "https://randomuser.me/api/portraits/men/29.jpg",
  },
  {
    id: 6,
    name: "Isabella Rivera",
    phone: "(718) 940-2257",
    email: "isabellanyc@gmail.com",
    photo: "https://randomuser.me/api/portraits/women/21.jpg",
  },
  {
    id: 7,
    name: "Ethan Kim",
    phone: "(646) 812-4389",
    email: "ethankny@gmail.com",
    photo: "https://randomuser.me/api/portraits/men/67.jpg",
  },
  {
    id: 8,
    name: "Maya Thompson",
    phone: "(929) 458-6732",
    email: "mayathompsonny@gmail.com",
    photo: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: 9,
    name: "Daniel Rossi",
    phone: "(917) 526-9981",
    email: "danielrossiny@gmail.com",
    photo: "https://randomuser.me/api/portraits/men/14.jpg",
  },
  {
    id: 10,
    name: "Olivia Brown",
    phone: "(718) 247-5564",
    email: "oliviabny@gmail.com",
    photo: "https://randomuser.me/api/portraits/women/24.jpg",
  },
];

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setContacts(saved ? JSON.parse(saved) : FALLBACK_CONTACTS);
  }, []);

  useEffect(() => {
    if (contacts.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    }
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
    if (form.name.trim().length < 2) {
      e.name = "Name must be at least 2 characters.";
    }

    const phonePattern = /^[0-9()\-\s]+$/;
    if (!form.phone.trim()) {
      e.phone = "Phone is required.";
    } else if (!phonePattern.test(form.phone)) {
      e.phone = "Phone must contain only numbers or valid symbols.";
    }

    if (form.email.trim() && !form.email.includes("@")) {
      e.email = "Email must contain '@'.";
    }

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
      {/* Search Section */}
      <section className="search" aria-labelledby="search-heading">
        <h2 id="search-heading">Search Contacts</h2>

        <div className="search__controls">
          <label htmlFor="search-input" className="sr-only">
            Search
          </label>

          <div className="search__wrapper">
            <div className="search__inputbox">
              <span className="search__icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <input
                id="search-input"
                type="search"
                placeholder="Search contacts"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(0);
                }}
                aria-label="Search contacts"
                autoComplete="off"
                enterKeyHint="search"
              />
            </div>
          </div>
        </div>

        <p className="search__results">
          Showing {filtered.length} {filtered.length === 1 ? "result" : "results"}
        </p>
      </section>

      {/* Contact Section */}
      <section className="contacts" aria-labelledby="contacts-heading">
        <h2 id="contacts-heading">Contacts</h2>

        {current && (
          <ul className="contacts__grid" role="list">
            <li className="contact-card" role="article">
              <img
                className="contact-card__avatar"
                src={avatarFor(current.name, current.photo)}
                alt={`Photo of ${current.name}`}
                width="64"
                height="64"
                loading="lazy"
              />
              <div>
                <h3 className="contact-card__name">{current.name}</h3>
                <p className="contact-card__phone">{current.phone}</p>
                <p className="contact-card__email">{current.email}</p>
              </div>
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

      {/* Add Contact Section */}
      <section className="form" aria-labelledby="form-heading">
        <h2 id="form-heading">Add a Contact</h2>

        <form className="form__body" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              minLength={2}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              inputMode="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form__actions">
            <button className="btn" type="submit" data-testid="btn-add">
              Add Contact
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
