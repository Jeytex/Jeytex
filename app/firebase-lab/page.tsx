"use client";

import { useEffect, useMemo, useState } from "react";

type Entry = {
  id: string;
  name: string;
  email: string;
  project: string;
  note: string;
  createdAt: string;
};

const STORAGE_KEY = "firebase-lab-entries";

const emptyForm = {
  name: "",
  email: "",
  project: "",
  note: "",
};

export default function FirebaseLabPage() {
  const [form, setForm] = useState(emptyForm);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw));
    } catch {
      setEntries([]);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries, ready]);

  const stats = useMemo(
    () => [
      { label: "Saved entries", value: entries.length.toString() },
      { label: "Form fields", value: "4" },
      { label: "Backend target", value: "Firestore" },
    ],
    [entries.length],
  );

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedProject = form.project.trim();
    const trimmedNote = form.note.trim();

    if (!trimmedName || !trimmedEmail || !trimmedProject) return;

    const newEntry: Entry = {
      id: crypto.randomUUID(),
      name: trimmedName,
      email: trimmedEmail,
      project: trimmedProject,
      note: trimmedNote,
      createdAt: new Date().toLocaleString(),
    };

    setEntries((current) => [newEntry, ...current]);
    setForm(emptyForm);
  }

  function clearAll() {
    setEntries([]);
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-medium tracking-[0.2em] text-cyan-200 uppercase">
                Firebase lab starter
              </span>
              <div className="space-y-4">
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                  Build a clean input-driven site, then swap the mock save for Firebase.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  This route gives you a real working form, local persistence, and a clear path to Firestore CRUD. It is a safe base you can expand while learning backend logic.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {item.label}
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-white">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-[#0b1020] p-6 shadow-lg shadow-black/20">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">Learning path</p>
                  <h2 className="text-xl font-semibold">What this folder teaches</h2>
                </div>
                <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  Ready to extend
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  1. Capture form inputs with React state.
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  2. Save entries locally first so the page works immediately.
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  3. Replace the local save with Firestore addDoc / getDocs.
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  4. Add auth, edit, delete, and live updates next.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Input form</p>
                <h2 className="text-2xl font-semibold">Submit a project lead</h2>
              </div>
              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                Demo backend
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span className="text-slate-300">Name</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Sidhu"
                    className="w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60"
                  />
                </label>

                <label className="space-y-2 text-sm">
                  <span className="text-slate-300">Email</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="sidhu@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60"
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm block">
                <span className="text-slate-300">Project idea</span>
                <input
                  name="project"
                  value={form.project}
                  onChange={handleChange}
                  placeholder="Firebase-powered feedback board"
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60"
                />
              </label>

              <label className="space-y-2 text-sm block">
                <span className="text-slate-300">Note</span>
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  placeholder="Write a short description, status, or next step..."
                  rows={5}
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60"
                />
              </label>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-white px-5 py-3 font-medium text-slate-950 transition hover:scale-[1.01]"
                >
                  Save entry
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
                >
                  Clear entries
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#0b1020] p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Saved data</p>
                <h2 className="text-2xl font-semibold">Your mock database</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                {entries.length} items
              </span>
            </div>

            <div className="space-y-3">
              {entries.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-400">
                  Nothing saved yet. Submit the form to create your first entry.
                </div>
              ) : (
                entries.map((entry) => (
                  <article
                    key={entry.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {entry.project}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {entry.name} · {entry.email}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500">{entry.createdAt}</span>
                    </div>
                    {entry.note ? (
                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        {entry.note}
                      </p>
                    ) : null}
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold">Firebase swap-in point</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Replace the local save inside handleSubmit with Firestore addDoc, then fetch initial data in useEffect.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold">Good next step</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Add edit and delete actions, then wire the page to authentication so each user sees their own data.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold">Why this is useful</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              You get a real app shell now, and later the exact same UI can talk to Firebase without a redesign.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
