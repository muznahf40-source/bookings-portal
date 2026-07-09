import { useState, useEffect } from 'react';
import { Check, Mail, MessageCircle, Plus, Trash2, Pencil, Sparkles, Copy, CheckCircle2, LogOut } from 'lucide-react';
import { supabase } from './supabaseClient';

const STYLE = `
.mbt-app {
  --bone: #F6F1E9;
  --paper: #FCFAF6;
  --ink: #241F1B;
  --ink-soft: #57503F;
  --rose: #A85D5D;
  --rose-soft: #E9D8D3;
  --sage: #6E7A57;
  --sage-soft: #DCE2CE;
  --line: #DED4C4;
  font-family: 'Inter', -apple-system, sans-serif;
  background: var(--bone);
  color: var(--ink);
  min-height: 100vh;
  padding: 28px 20px 60px;
  box-sizing: border-box;
}
.mbt-app * { box-sizing: border-box; }
.mbt-wrap { max-width: 720px; margin: 0 auto; }

.mbt-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--rose);
  font-weight: 500;
}
.mbt-title {
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-weight: 500;
  font-size: 34px;
  line-height: 1.1;
  margin: 4px 0 2px;
  color: var(--ink);
}
.mbt-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--ink-soft);
  margin-bottom: 22px;
}
.mbt-header-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.mbt-signout {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: none;
  border: 1px solid var(--line);
  color: var(--ink-soft);
  padding: 8px 12px;
  border-radius: 3px;
  cursor: pointer;
  white-space: nowrap;
  margin-top: 2px;
}
.mbt-signout:hover { border-color: var(--rose); color: var(--rose); }

.mbt-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 22px;
  border-bottom: 1px solid var(--line);
  padding-bottom: 0;
}
.mbt-tab {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: none;
  border: none;
  padding: 10px 4px 12px;
  cursor: pointer;
  color: var(--ink-soft);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color 0.15s ease;
}
.mbt-tab.active { color: var(--ink); border-bottom-color: var(--rose); }
.mbt-tab:hover { color: var(--ink); }

.mbt-addbtn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: var(--ink);
  color: var(--paper);
  border: none;
  padding: 10px 16px;
  border-radius: 3px;
  cursor: pointer;
  transition: transform 0.1s ease, background 0.15s ease;
}
.mbt-addbtn:hover { background: var(--rose); }
.mbt-addbtn:active { transform: scale(0.97); }

.mbt-empty {
  font-family: 'Newsreader', serif;
  font-style: italic;
  color: var(--ink-soft);
  font-size: 16px;
  padding: 40px 10px;
  text-align: center;
  border: 1px dashed var(--line);
  border-radius: 4px;
}

.mbt-form {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 5px;
  padding: 18px;
  margin-bottom: 20px;
}
.mbt-form-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-soft);
  margin-bottom: 12px;
}
.mbt-field-row { display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
.mbt-field { flex: 1; min-width: 140px; display: flex; flex-direction: column; gap: 4px; }
.mbt-field label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-soft);
}
.mbt-field input, .mbt-field textarea, .mbt-field select {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  padding: 8px 10px;
  border: 1px solid var(--line);
  border-radius: 3px;
  background: var(--bone);
  color: var(--ink);
  outline: none;
}
.mbt-field input:focus, .mbt-field textarea:focus, .mbt-field select:focus {
  border-color: var(--rose);
}
.mbt-form-actions { display: flex; gap: 8px; margin-top: 6px; }
.mbt-btn-primary {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: var(--rose);
  color: var(--paper);
  border: none;
  padding: 9px 16px;
  border-radius: 3px;
  cursor: pointer;
}
.mbt-btn-primary:hover { opacity: 0.9; }
.mbt-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.mbt-btn-ghost {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: none;
  color: var(--ink-soft);
  border: 1px solid var(--line);
  padding: 9px 16px;
  border-radius: 3px;
  cursor: pointer;
}
.mbt-btn-ghost:hover { border-color: var(--ink-soft); color: var(--ink); }

.mbt-card {
  position: relative;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 5px;
  padding: 16px 18px;
  margin-bottom: 12px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
  overflow: hidden;
  transition: border-color 0.15s ease;
}
.mbt-card.done { border-color: var(--sage); background: #FBFBF8; }

.mbt-check {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1.5px solid var(--ink-soft);
  background: var(--paper);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  transition: all 0.15s ease;
}
.mbt-check.done { background: var(--sage); border-color: var(--sage); }
.mbt-check.readonly { cursor: default; }
.mbt-check:hover { border-color: var(--rose); }

.mbt-card-body { flex: 1; min-width: 0; }
.mbt-index {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--rose);
  margin-bottom: 2px;
}
.mbt-name {
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 4px;
}
.mbt-card.done .mbt-name { color: var(--ink-soft); }
.mbt-meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--ink-soft);
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}
.mbt-notes {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: var(--ink-soft);
  margin-bottom: 8px;
  line-height: 1.4;
}
.mbt-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.mbt-iconbtn {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: none;
  border: 1px solid var(--line);
  color: var(--ink-soft);
  padding: 5px 9px;
  border-radius: 3px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s ease;
}
.mbt-iconbtn:hover { border-color: var(--rose); color: var(--rose); }
.mbt-iconbtn.copied { border-color: var(--sage); color: var(--sage); }

.mbt-stamp {
  position: absolute;
  top: 12px;
  right: 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--sage);
  border: 1.5px solid var(--sage);
  border-radius: 3px;
  padding: 3px 8px;
  transform: rotate(-6deg);
  animation: mbt-stamp-in 0.28s cubic-bezier(.34,1.56,.64,1);
}
@keyframes mbt-stamp-in {
  from { transform: rotate(-6deg) scale(0.4); opacity: 0; }
  to { transform: rotate(-6deg) scale(1); opacity: 1; }
}

.mbt-ideas-grid { display: flex; flex-direction: column; gap: 12px; }
.mbt-idea-card {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 5px;
  padding: 16px 18px;
}
.mbt-idea-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.mbt-idea-title {
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 7px;
}
.mbt-idea-desc {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: var(--ink-soft);
  margin-top: 6px;
  line-height: 1.5;
  white-space: pre-wrap;
}
.mbt-tag {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: var(--rose-soft);
  color: var(--rose);
  padding: 3px 8px;
  border-radius: 3px;
  margin-top: 8px;
}
.mbt-trash {
  background: none;
  border: none;
  color: var(--ink-soft);
  cursor: pointer;
  padding: 2px;
  flex-shrink: 0;
}
.mbt-trash:hover { color: var(--rose); }

.mbt-loading, .mbt-error {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--ink-soft);
  text-align: center;
  padding: 60px 0;
}
.mbt-error { color: var(--rose); }

/* Auth screen */
.mbt-auth-wrap { max-width: 380px; margin: 80px auto 0; }
.mbt-auth-card {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 28px 26px;
}
.mbt-auth-toggle { display: flex; gap: 4px; margin-bottom: 18px; border-bottom: 1px solid var(--line); }
.mbt-auth-tab {
  flex: 1;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: none;
  border: none;
  padding: 8px 0 10px;
  cursor: pointer;
  color: var(--ink-soft);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}
.mbt-auth-tab.active { color: var(--ink); border-bottom-color: var(--rose); }
.mbt-auth-msg {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  padding: 10px 12px;
  border-radius: 4px;
  margin-bottom: 12px;
  line-height: 1.4;
}
.mbt-auth-msg.error { background: var(--rose-soft); color: var(--rose); }
.mbt-auth-msg.success { background: var(--sage-soft); color: var(--sage); }
`;

function formatDatePretty(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// ---------- Auth screen ----------
function AuthScreen() {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  async function submit() {
    setError(null);
    setMessage(null);
    if (!email.trim() || !password) {
      setError('Enter both an email and a password.');
      return;
    }
    setBusy(true);
    if (mode === 'signin') {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) setError(err.message);
    } else {
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) setError(err.message);
      else setMessage('Account created. If email confirmation is on, check your inbox — otherwise you can sign in now.');
    }
    setBusy(false);
  }

  return (
    <div className="mbt-app">
      <style>{STYLE}</style>
      <div className="mbt-auth-wrap">
        <div className="mbt-eyebrow" style={{ textAlign: 'center' }}>Model Bookings</div>
        <div className="mbt-title" style={{ textAlign: 'center', marginBottom: 20 }}>Sign in</div>
        <div className="mbt-auth-card">
          <div className="mbt-auth-toggle">
            <button className={`mbt-auth-tab ${mode === 'signin' ? 'active' : ''}`} onClick={() => { setMode('signin'); setError(null); setMessage(null); }}>Sign in</button>
            <button className={`mbt-auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => { setMode('signup'); setError(null); setMessage(null); }}>Create account</button>
          </div>
          {error && <div className="mbt-auth-msg error">{error}</div>}
          {message && <div className="mbt-auth-msg success">{message}</div>}
          <div className="mbt-field-row">
            <div className="mbt-field" style={{ width: '100%' }}>
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
          </div>
          <div className="mbt-field-row">
            <div className="mbt-field" style={{ width: '100%' }}>
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={(e) => e.key === 'Enter' && submit()} />
            </div>
          </div>
          <button className="mbt-btn-primary" style={{ width: '100%' }} disabled={busy} onClick={submit}>
            {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
          {mode === 'signup' && (
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'var(--ink-soft)', marginTop: 12, lineHeight: 1.4 }}>
              Clients: sign up using the exact email your makeup artist has on file for your appointment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Client (read-only) view ----------
function ClientView({ email, onSignOut }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    (async () => {
      const { data: bData, error: bErr } = await supabase.from('bookings').select('*').order('date', { ascending: true });
      const { data: iData, error: iErr } = await supabase.from('content_ideas').select('*').order('created_at', { ascending: true });
      if (bErr || iErr) setError((bErr || iErr).message);
      else {
        setBookings(bData || []);
        setIdeas(iData || []);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="mbt-app">
      <style>{STYLE}</style>
      <div className="mbt-wrap">
        <div className="mbt-header-row">
          <div>
            <div className="mbt-eyebrow">Your Appointment</div>
            <div className="mbt-title">Hi there</div>
            <div className="mbt-sub">Signed in as {email}</div>
          </div>
          <button className="mbt-signout" onClick={onSignOut}><LogOut size={12} /> Sign out</button>
        </div>

        {loading ? (
          <div className="mbt-loading">Loading…</div>
        ) : error ? (
          <div className="mbt-error">Couldn't load your info: {error}</div>
        ) : bookings.length === 0 ? (
          <div className="mbt-empty">No booking found under this email yet — check with your makeup artist that the email matches.</div>
        ) : (
          <>
            {bookings.map((b, idx) => (
              <div key={b.id} className={`mbt-card ${b.done ? 'done' : ''}`}>
                {b.done && <div className="mbt-stamp">Wrapped</div>}
                <div className={`mbt-check readonly ${b.done ? 'done' : ''}`}>
                  {b.done && <Check size={14} color="#FCFAF6" strokeWidth={3} />}
                </div>
                <div className="mbt-card-body">
                  <div className="mbt-index">N°{String(idx + 1).padStart(2, '0')}</div>
                  <div className="mbt-name">{b.name}</div>
                  <div className="mbt-meta">
                    {b.date && <span>{formatDatePretty(b.date)}</span>}
                    {b.time && <span>{b.time}</span>}
                    {b.service && <span>{b.service}</span>}
                  </div>
                  {b.notes && <div className="mbt-notes">{b.notes}</div>}
                </div>
              </div>
            ))}

            {ideas.length > 0 && (
              <>
                <div className="mbt-form-title" style={{ marginTop: 24, marginBottom: 10 }}>Content ideas for your shoot</div>
                <div className="mbt-ideas-grid">
                  {ideas.map((i) => (
                    <div key={i.id} className="mbt-idea-card">
                      <div className="mbt-idea-title"><Sparkles size={15} color="#A85D5D" />{i.title}</div>
                      {i.description && <div className="mbt-idea-desc">{i.description}</div>}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ---------- Admin (full) view ----------
const emptyBookingForm = { name: '', email: '', phone: '', date: '', time: '', service: '', notes: '' };
const emptyIdeaForm = { title: '', description: '', bookingId: '' };

function AdminView({ onSignOut }) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [tab, setTab] = useState('bookings');

  const [bookings, setBookings] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [bookingForm, setBookingForm] = useState(emptyBookingForm);
  const [copiedId, setCopiedId] = useState(null);

  const [ideas, setIdeas] = useState([]);
  const [showIdeaForm, setShowIdeaForm] = useState(false);
  const [ideaForm, setIdeaForm] = useState(emptyIdeaForm);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    setLoadError(null);
    const [bRes, iRes] = await Promise.all([
      supabase.from('bookings').select('*').order('date', { ascending: true }),
      supabase.from('content_ideas').select('*').order('created_at', { ascending: true }),
    ]);
    if (bRes.error || iRes.error) {
      setLoadError((bRes.error || iRes.error).message);
    } else {
      setBookings(bRes.data.map(rowToBooking));
      setIdeas(iRes.data.map(rowToIdea));
    }
    setLoading(false);
  }

  function rowToBooking(r) {
    return { id: r.id, name: r.name, email: r.email || '', phone: r.phone || '', date: r.date || '', time: r.time || '', service: r.service || '', notes: r.notes || '', done: r.done };
  }
  function rowToIdea(r) {
    return { id: r.id, title: r.title, description: r.description || '', bookingId: r.booking_id || '' };
  }

  function openNewBookingForm() {
    setBookingForm(emptyBookingForm);
    setEditingBookingId(null);
    setShowBookingForm(true);
  }

  function openEditBookingForm(b) {
    setBookingForm({ name: b.name, email: b.email, phone: b.phone, date: b.date, time: b.time, service: b.service, notes: b.notes });
    setEditingBookingId(b.id);
    setShowBookingForm(true);
  }

  async function saveBookingForm() {
    if (!bookingForm.name.trim()) return;
    const payload = { ...bookingForm };
    if (editingBookingId) {
      const { error } = await supabase.from('bookings').update(payload).eq('id', editingBookingId);
      if (!error) setBookings(bookings.map((b) => (b.id === editingBookingId ? { ...b, ...bookingForm } : b)));
    } else {
      const { data, error } = await supabase.from('bookings').insert(payload).select().single();
      if (!error) setBookings([...bookings, rowToBooking(data)]);
    }
    setShowBookingForm(false);
    setBookingForm(emptyBookingForm);
    setEditingBookingId(null);
  }

  async function toggleDone(b) {
    const nextDone = !b.done;
    setBookings(bookings.map((x) => (x.id === b.id ? { ...x, done: nextDone } : x)));
    await supabase.from('bookings').update({ done: nextDone }).eq('id', b.id);
  }

  async function deleteBooking(id) {
    setBookings(bookings.filter((b) => b.id !== id));
    await supabase.from('bookings').delete().eq('id', id);
  }

  function reminderMessage(b) {
    const when = b.date ? formatDatePretty(b.date) : '[date]';
    const time = b.time ? ` at ${b.time}` : '';
    const svc = b.service ? ` for ${b.service}` : '';
    return `Hi ${b.name}! Just a reminder about your makeup appointment on ${when}${time}${svc}. Let me know if anything changes — see you soon!`;
  }

  async function copyReminder(b) {
    const msg = reminderMessage(b);
    try {
      await navigator.clipboard.writeText(msg);
      setCopiedId(b.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch (e) {
      console.error('Clipboard failed', e);
    }
  }

  function openIdeaForm() {
    setIdeaForm(emptyIdeaForm);
    setShowIdeaForm(true);
  }

  async function saveIdeaForm() {
    if (!ideaForm.title.trim()) return;
    const linkedBooking = bookings.find((b) => b.id === ideaForm.bookingId);
    const payload = {
      title: ideaForm.title,
      description: ideaForm.description,
      booking_id: ideaForm.bookingId || null,
      linked_booking: linkedBooking ? linkedBooking.name : null,
    };
    const { data, error } = await supabase.from('content_ideas').insert(payload).select().single();
    if (!error) setIdeas([...ideas, rowToIdea(data)]);
    setShowIdeaForm(false);
    setIdeaForm(emptyIdeaForm);
  }

  async function deleteIdea(id) {
    setIdeas(ideas.filter((i) => i.id !== id));
    await supabase.from('content_ideas').delete().eq('id', id);
  }

  const sortedBookings = [...bookings].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return (a.date + a.time).localeCompare(b.date + b.time);
  });

  const monthLabel = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="mbt-app">
      <style>{STYLE}</style>
      <div className="mbt-wrap">
        <div className="mbt-header-row">
          <div>
            <div className="mbt-eyebrow">Call Sheet — {monthLabel}</div>
            <div className="mbt-title">Model Bookings</div>
            <div className="mbt-sub">{bookings.filter((b) => !b.done).length} upcoming · {bookings.filter((b) => b.done).length} wrapped</div>
          </div>
          <button className="mbt-signout" onClick={onSignOut}><LogOut size={12} /> Sign out</button>
        </div>

        <div className="mbt-tabs">
          <button className={`mbt-tab ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>Bookings</button>
          <button className={`mbt-tab ${tab === 'ideas' ? 'active' : ''}`} onClick={() => setTab('ideas')}>Content Ideas</button>
        </div>

        {loading ? (
          <div className="mbt-loading">Loading your bookings…</div>
        ) : loadError ? (
          <div className="mbt-error">Couldn't load data: {loadError}. Make sure your email has been added to the "admins" table in Supabase.</div>
        ) : tab === 'bookings' ? (
          <div>
            {!showBookingForm && (
              <button className="mbt-addbtn" onClick={openNewBookingForm} style={{ marginBottom: 18 }}>
                <Plus size={14} /> Add booking
              </button>
            )}

            {showBookingForm && (
              <div className="mbt-form">
                <div className="mbt-form-title">{editingBookingId ? 'Edit booking' : 'New booking'}</div>
                <div className="mbt-field-row">
                  <div className="mbt-field">
                    <label>Model name</label>
                    <input value={bookingForm.name} onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })} placeholder="e.g. Sofia Reyes" />
                  </div>
                  <div className="mbt-field">
                    <label>Service / look</label>
                    <input value={bookingForm.service} onChange={(e) => setBookingForm({ ...bookingForm, service: e.target.value })} placeholder="e.g. Soft glam" />
                  </div>
                </div>
                <div className="mbt-field-row">
                  <div className="mbt-field">
                    <label>Date</label>
                    <input type="date" value={bookingForm.date} onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })} />
                  </div>
                  <div className="mbt-field">
                    <label>Time</label>
                    <input type="time" value={bookingForm.time} onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })} />
                  </div>
                </div>
                <div className="mbt-field-row">
                  <div className="mbt-field">
                    <label>Email (client uses this to log in)</label>
                    <input value={bookingForm.email} onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })} placeholder="client@example.com" />
                  </div>
                  <div className="mbt-field">
                    <label>Phone</label>
                    <input value={bookingForm.phone} onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })} placeholder="optional" />
                  </div>
                </div>
                <div className="mbt-field-row">
                  <div className="mbt-field">
                    <label>Notes</label>
                    <textarea rows={2} value={bookingForm.notes} onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })} placeholder="content plan, location, anything to remember" />
                  </div>
                </div>
                <div className="mbt-form-actions">
                  <button className="mbt-btn-primary" onClick={saveBookingForm}>Save</button>
                  <button className="mbt-btn-ghost" onClick={() => { setShowBookingForm(false); setEditingBookingId(null); }}>Cancel</button>
                </div>
              </div>
            )}

            {sortedBookings.length === 0 ? (
              <div className="mbt-empty">No bookings yet this month — add your first model above.</div>
            ) : (
              sortedBookings.map((b, idx) => (
                <div key={b.id} className={`mbt-card ${b.done ? 'done' : ''}`}>
                  {b.done && <div className="mbt-stamp">Wrapped</div>}
                  <div className={`mbt-check ${b.done ? 'done' : ''}`} onClick={() => toggleDone(b)}>
                    {b.done && <Check size={14} color="#FCFAF6" strokeWidth={3} />}
                  </div>
                  <div className="mbt-card-body">
                    <div className="mbt-index">N°{String(idx + 1).padStart(2, '0')}</div>
                    <div className="mbt-name">{b.name}</div>
                    <div className="mbt-meta">
                      {b.date && <span>{formatDatePretty(b.date)}</span>}
                      {b.time && <span>{b.time}</span>}
                      {b.service && <span>{b.service}</span>}
                    </div>
                    {b.notes && <div className="mbt-notes">{b.notes}</div>}
                    <div className="mbt-actions">
                      <button className={`mbt-iconbtn ${copiedId === b.id ? 'copied' : ''}`} onClick={() => copyReminder(b)}>
                        {copiedId === b.id ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                        {copiedId === b.id ? 'Copied' : 'Copy reminder'}
                      </button>
                      {b.email && (
                        <a className="mbt-iconbtn" href={`mailto:${b.email}?subject=${encodeURIComponent('Appointment reminder')}&body=${encodeURIComponent(reminderMessage(b))}`}>
                          <Mail size={12} /> Email
                        </a>
                      )}
                      {b.phone && (
                        <a className="mbt-iconbtn" href={`sms:${b.phone}?body=${encodeURIComponent(reminderMessage(b))}`}>
                          <MessageCircle size={12} /> Text
                        </a>
                      )}
                      <button className="mbt-iconbtn" onClick={() => openEditBookingForm(b)}>
                        <Pencil size={12} /> Edit
                      </button>
                      <button className="mbt-iconbtn" onClick={() => deleteBooking(b.id)}>
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div>
            {!showIdeaForm && (
              <button className="mbt-addbtn" onClick={openIdeaForm} style={{ marginBottom: 18 }}>
                <Plus size={14} /> Add idea
              </button>
            )}

            {showIdeaForm && (
              <div className="mbt-form">
                <div className="mbt-form-title">New content idea</div>
                <div className="mbt-field-row">
                  <div className="mbt-field">
                    <label>Title</label>
                    <input value={ideaForm.title} onChange={(e) => setIdeaForm({ ...ideaForm, title: e.target.value })} placeholder="e.g. Before/after transition with Sofia" />
                  </div>
                </div>
                <div className="mbt-field-row">
                  <div className="mbt-field">
                    <label>Details</label>
                    <textarea rows={3} value={ideaForm.description} onChange={(e) => setIdeaForm({ ...ideaForm, description: e.target.value })} placeholder="hook, angle, sound, format" />
                  </div>
                </div>
                <div className="mbt-field-row">
                  <div className="mbt-field">
                    <label>Linked model (optional — lets that client see this idea)</label>
                    <select value={ideaForm.bookingId} onChange={(e) => setIdeaForm({ ...ideaForm, bookingId: e.target.value })}>
                      <option value="">None</option>
                      {bookings.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mbt-form-actions">
                  <button className="mbt-btn-primary" onClick={saveIdeaForm}>Save</button>
                  <button className="mbt-btn-ghost" onClick={() => setShowIdeaForm(false)}>Cancel</button>
                </div>
              </div>
            )}

            {ideas.length === 0 ? (
              <div className="mbt-empty">No content ideas saved yet — jot down inspiration as it comes to you.</div>
            ) : (
              <div className="mbt-ideas-grid">
                {ideas.map((i) => {
                  const linked = bookings.find((b) => b.id === i.bookingId);
                  return (
                    <div key={i.id} className="mbt-idea-card">
                      <div className="mbt-idea-head">
                        <div className="mbt-idea-title"><Sparkles size={15} color="#A85D5D" />{i.title}</div>
                        <button className="mbt-trash" onClick={() => deleteIdea(i.id)}><Trash2 size={14} /></button>
                      </div>
                      {i.description && <div className="mbt-idea-desc">{i.description}</div>}
                      {linked && <div className="mbt-tag">{linked.name}</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Top-level app: auth gate + role routing ----------
export default function App() {
  const [session, setSession] = useState(undefined); // undefined = checking, null = signed out
  const [isAdmin, setIsAdmin] = useState(null); // null = checking

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setIsAdmin(null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data } = await supabase.from('admins').select('email').eq('email', session.user.email).maybeSingle();
      setIsAdmin(!!data);
    })();
  }, [session]);

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (session === undefined) {
    return (
      <div className="mbt-app">
        <style>{STYLE}</style>
        <div className="mbt-loading">Loading…</div>
      </div>
    );
  }

  if (!session) return <AuthScreen />;

  if (isAdmin === null) {
    return (
      <div className="mbt-app">
        <style>{STYLE}</style>
        <div className="mbt-loading">Checking your account…</div>
      </div>
    );
  }

  return isAdmin ? <AdminView onSignOut={signOut} /> : <ClientView email={session.user.email} onSignOut={signOut} />;
}
