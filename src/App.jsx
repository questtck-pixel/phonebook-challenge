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
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (!cancelled) {
            setContacts(parsed);
            setLoadError("");
          }
          return;
        }

        const res = await fetch("/data/contacts.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!cancelled) {
          setContacts(data);
          setLoadError("");
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setContacts(FALLBACK_CONTACTS);
          setLoadError(
            "Could not load contacts from the server. Showing fallback list."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (contacts.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    }
  }, [contacts]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q)
    );
  }, [contacts, query]);

  useEffect(() => {
    if (page > 0 && page >= filtered.length) {
      setPage(0);
    }
  }, [filtered.length, page]);

  const current = filtered[page] || null;

  const nextPage = () => {
    setPage((p) => Math.min(p + 1, Math.max(filtered.length - 1, 0)));
  };

  const prevPage = () => {
    setPage((p) => Math.max(p - 1, 0));
  };

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

    if (!form.email.trim()) {
      e.email = "Email is required.";
    } else if (!form.email.includes("@")) {
      e.email = "Email must contain '@'.";
    }

    return e;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const e2 = validate();
    setErrors(e2);
    if (Object.keys(e2).length) return;

    const newContact = {
      id: Date.now(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
    };

   
    setContacts((prev) => [newContact, ...prev]);

    
    setForm({ name: "", phone: "", email: "" });
    setPage(0);
  };

  return (
    <main className="page">
      <header>
        <h1>Phonebook Challenge</h1>
      </header>

      {/* Search Section */}
      <section className="search">
        <h2>Search Contacts</h2>

        <div className="search__controls">
          <label htmlFor="search">Search contacts</label>
          <input
            id="search"
            type="search"
            placeholder="Search contacts"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            aria-label="Search contacts by name or phone"
            autoComplete="off"
            enterKeyHint="search"
          />
        </div>

        <p className="search__results">
          Showing {filtered.length}{" "}
          {filtered.length === 1 ? "result" : "results"}
        </p>
      </section>

      {/* Contacts Section */}
      <section className="contacts">
        <h2>Contacts</h2>

        {loading && (
          <p className="search__results">Loading contacts…</p>
        )}

        {!loading && loadError && (
          <p className="search__results error">{loadError}</p>
        )}

        {!loading && !filtered.length && (
          <p className="search__results">No contacts found.</p>
        )}

        {!loading && filtered.length > 0 && current && (
          <>
            <ul className="contacts__grid">
              <li>
                <article className="contact-card">
                  <img
                    className="contact-card__avatar"
                    src={avatarFor(current.name, current.photo)}
                    alt={current.name}
                  />
                  <div>
                    <h3 className="contact-card__name">
                      {current.name}
                    </h3>
                    <p className="contact-card__phone">
                      {current.phone}
                    </p>
                    <p className="contact-card__email">
                      {current.email}
                    </p>
                  </div>
                </article>
              </li>
            </ul>

            <div className="pager">
              <button
                type="button"
                className="btn"
                onClick={prevPage}
                disabled={page === 0 || filtered.length === 0 || loading}
              >
                ◀ Prev
              </button>
              <span>
                {filtered.length
                  ? `Contact ${page + 1} of ${filtered.length}`
                  : "No results"}
              </span>
              <button
                type="button"
                className="btn"
                onClick={nextPage}
                disabled={
                  loading ||
                  filtered.length === 0 ||
                  page >= filtered.length - 1
                }
              >
                Next ▶
              </button>
            </div>
          </>
        )}
      </section>

      {/* Add Contact Section */}
      <section className="form">
        <h2>Add a Contact</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form__body">
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
                minLength={2}
              />
              {errors.name && (
                <p className="error">{errors.name}</p>
              )}
            </div>

            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                required
              />
              {errors.phone && (
                <p className="error">{errors.phone}</p>
              )}
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                required
              />
              {errors.email && (
                <p className="error">{errors.email}</p>
              )}
            </div>

            <button type="submit" className="btn">
              Add Contact
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
