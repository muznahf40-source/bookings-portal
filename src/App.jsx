import { useState, useEffect } from 'react';
import { Check, Mail, MessageCircle, Plus, Trash2, Pencil, Sparkles, Copy, CheckCircle2, LogOut, CalendarPlus, Tag, Image as ImageIcon, Link2, ChevronDown, ChevronUp } from 'lucide-react';
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

/* Price list */
.mbt-price-list { display: flex; flex-direction: column; gap: 1px; background: var(--line); border-radius: 5px; overflow: hidden; border: 1px solid var(--line); }
.mbt-price-row { background: var(--paper); padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.mbt-price-service { font-family: 'Newsreader', serif; font-style: italic; font-size: 16px; }
.mbt-price-desc { font-family: 'Inter', sans-serif; font-size: 12px; color: var(--ink-soft); margin-top: 2px; }
.mbt-price-amount { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 500; color: var(--rose); white-space: nowrap; }
.mbt-price-row-admin { display: flex; align-items: center; gap: 10px; }

/* Public inquiry form */
.mbt-inquiry-wrap { max-width: 560px; margin: 60px auto; }
.mbt-inquiry-sub {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: var(--ink-soft);
  text-align: center;
  max-width: 380px;
  margin: 6px auto 24px;
  line-height: 1.5;
}
.mbt-inquiry-card { padding: 30px 28px; }
.mbt-inquiry-section {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--rose);
  border-bottom: 1px solid var(--line);
  padding-bottom: 8px;
  margin: 22px 0 14px;
}
.mbt-inquiry-section:first-of-type { margin-top: 0; }

/* Inspiration panel */
.mbt-inspiration-panel {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--line);
  width: 100%;
}
.mbt-inspiration-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}
.mbt-inspiration-item { position: relative; }
.mbt-inspiration-thumb {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid var(--line);
  display: block;
}
.mbt-inspiration-link {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 140px;
  height: 72px;
  padding: 8px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: var(--bone);
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--ink-soft);
  text-decoration: none;
  overflow: hidden;
}
.mbt-inspiration-link span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mbt-inspiration-remove {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--rose);
  color: var(--paper);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mbt-inspiration-add { display: flex; gap: 8px; flex-wrap: wrap; }
.mbt-inspiration-add input {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  padding: 7px 9px;
  border: 1px solid var(--line);
  border-radius: 3px;
  background: var(--bone);
  color: var(--ink);
  outline: none;
  flex: 1;
  min-width: 160px;
}
.mbt-inspiration-add input:focus { border-color: var(--rose); }

/* Inquiry form: add-ons, photo uploads, pricing toggle */
.mbt-addon-grid { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
.mbt-addon-check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: var(--ink);
  cursor: pointer;
}
.mbt-addon-check input { width: 15px; height: 15px; accent-color: var(--rose); cursor: pointer; }
.mbt-addon-none {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--ink-soft);
  margin-top: 6px;
  font-style: italic;
}
.mbt-inquiry-pricing-toggle { margin: 16px 0; }
.mbt-photo-preview {
  width: 100%;
  max-width: 220px;
  border-radius: 4px;
  border: 1px solid var(--line);
  margin-top: 8px;
  display: block;
}
.mbt-photo-preview-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.mbt-photo-preview-small {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid var(--line);
}

/* Public homepage */
.mbt-home-wrap { max-width: 720px; margin: 0 auto; padding: 20px 4px 40px; }
.mbt-home-hero { text-align: center; padding: 40px 0 30px; }
.mbt-home-title { font-size: 44px; margin: 6px 0 8px; }
.mbt-home-cta {
  display: inline-block;
  text-decoration: none;
  padding: 12px 28px;
  width: auto;
}
.mbt-home-section { margin: 36px 0; }
.mbt-home-about {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  line-height: 1.7;
  color: var(--ink);
  max-width: 560px;
  margin: 14px auto 0;
  text-align: center;
  white-space: pre-wrap;
}
.mbt-portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
  margin-top: 16px;
}
.mbt-portfolio-item {
  display: block;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 5px;
  border: 1px solid var(--line);
}
.mbt-portfolio-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.2s ease; }
.mbt-portfolio-item:hover img { transform: scale(1.05); }
.mbt-home-footer {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--line);
}
.mbt-home-footer a {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-soft);
  text-decoration: none;
}
.mbt-home-footer a:hover { color: var(--rose); }
`;

function gcalLink(b) {
  if (!b.date) return null;
  const start = new Date(`${b.date}T${b.time || '12:00'}:00`);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const fmt = (d) =>
    d.getFullYear().toString().padStart(4, '0') +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0') +
    'T' +
    String(d.getHours()).padStart(2, '0') +
    String(d.getMinutes()).padStart(2, '0') +
    '00';
  const dates = `${fmt(start)}/${fmt(end)}`;
  const text = encodeURIComponent(`${b.name}${b.service ? ' — ' + b.service : ''}`);
  const details = encodeURIComponent(b.notes || '');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}`;
}

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
        <div className="mbt-eyebrow" style={{ textAlign: 'center' }}>Booking Portal</div>
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
  const [prices, setPrices] = useState([]);
  const [inspiration, setInspiration] = useState([]);

  useEffect(() => {
    (async () => {
      const { data: bData, error: bErr } = await supabase.from('bookings').select('*').order('date', { ascending: true });
      const { data: iData, error: iErr } = await supabase.from('content_ideas').select('*').order('created_at', { ascending: true });
      const { data: pData } = await supabase.from('price_list').select('*').order('sort_order', { ascending: true });
      const { data: sData } = await supabase.from('booking_inspiration').select('*').order('sort_order', { ascending: true });
      if (bErr || iErr) setError((bErr || iErr).message);
      else {
        setBookings(bData || []);
        setIdeas(iData || []);
        setPrices(pData || []);
        setInspiration(sData || []);
      }
      setLoading(false);
    })();
  }, []);

  function isImageUrl(url) {
    return /\.(jpg|jpeg|png|gif|webp|avif)(\?.*)?$/i.test(url);
  }

  return (
    <div className="mbt-app">
      <style>{STYLE}</style>
      <div className="mbt-wrap">
        <div className="mbt-header-row">
          <div>
            <div className="mbt-eyebrow">Booking Portal</div>
            <div className="mbt-title">Muses by Muz</div>
            <div className="mbt-sub">Signed in as {email}</div>
          </div>
          <button className="mbt-signout" onClick={onSignOut}><LogOut size={12} /> Sign out</button>
        </div>

        {loading ? (
          <div className="mbt-loading">Loading…</div>
        ) : error ? (
          <div className="mbt-error">Couldn't load your info: {error}</div>
        ) : (
          <>
            {bookings.length === 0 ? (
              <div className="mbt-empty">No booking found under this email yet — check with your makeup artist that the email matches.</div>
            ) : (
              <>
                <div className="mbt-form-title" style={{ marginBottom: 10 }}>Your Appointment</div>
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
                      {inspiration.filter((s) => s.booking_id === b.id).length > 0 && (
                        <div className="mbt-inspiration-panel" style={{ borderTop: 'none', paddingTop: 0, marginTop: 8 }}>
                          <div className="mbt-inspiration-grid">
                            {inspiration.filter((s) => s.booking_id === b.id).map((s) => (
                              <div key={s.id} className="mbt-inspiration-item">
                                {isImageUrl(s.url) ? (
                                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                                    <img src={s.url} alt={s.caption || 'inspiration'} className="mbt-inspiration-thumb" />
                                  </a>
                                ) : (
                                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="mbt-inspiration-link">
                                    <Link2 size={14} />
                                    <span>{s.caption || s.url.replace(/^https?:\/\//, '').split('/')[0]}</span>
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}

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

            {prices.length > 0 && (
              <>
                <div className="mbt-form-title" style={{ marginTop: 24, marginBottom: 10 }}>Pricing</div>
                <div className="mbt-price-list">
                  {prices.map((p) => (
                    <div key={p.id} className="mbt-price-row">
                      <div>
                        <div className="mbt-price-service">{p.service}</div>
                        {p.description && <div className="mbt-price-desc">{p.description}</div>}
                      </div>
                      {p.price != null && <div className="mbt-price-amount">${Number(p.price).toFixed(0)}</div>}
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
const emptyPriceForm = { service: '', price: '', description: '' };

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

  const [prices, setPrices] = useState([]);
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [priceForm, setPriceForm] = useState(emptyPriceForm);

  const [inquiries, setInquiries] = useState([]);

  const [inspiration, setInspiration] = useState([]); // flat list, all bookings
  const [expandedInspirationId, setExpandedInspirationId] = useState(null);
  const [inspirationDraft, setInspirationDraft] = useState({ url: '', caption: '' });

  const [aboutDraft, setAboutDraft] = useState('');
  const [aboutSaved, setAboutSaved] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadWebsiteContent() {
    const [{ data: aboutData }, { data: pData }] = await Promise.all([
      supabase.from('site_content').select('*').eq('id', 'about').maybeSingle(),
      supabase.from('portfolio_images').select('*').order('sort_order', { ascending: true }),
    ]);
    setAboutDraft(aboutData ? aboutData.content : '');
    setPortfolio(pData || []);
  }

  useEffect(() => {
    loadWebsiteContent();
  }, []);

  async function saveAbout() {
    await supabase.from('site_content').upsert({ id: 'about', content: aboutDraft, updated_at: new Date().toISOString() });
    setAboutSaved(true);
    setTimeout(() => setAboutSaved(false), 1800);
  }

  async function handlePortfolioUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingPortfolio(true);
    for (const file of files) {
      try {
        const ext = file.name.split('.').pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage.from('portfolio-uploads').upload(path, file);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('portfolio-uploads').getPublicUrl(path);
        const { data: row, error: insErr } = await supabase
          .from('portfolio_images')
          .insert({ url: data.publicUrl, sort_order: portfolio.length })
          .select()
          .single();
        if (!insErr) setPortfolio((prev) => [...prev, row]);
      } catch (err) {
        console.error('Portfolio upload failed', err);
      }
    }
    setUploadingPortfolio(false);
    e.target.value = '';
  }

  async function deletePortfolioImage(id) {
    setPortfolio(portfolio.filter((p) => p.id !== id));
    await supabase.from('portfolio_images').delete().eq('id', id);
  }

  async function loadAll() {
    setLoading(true);
    setLoadError(null);
    const [bRes, iRes, pRes, qRes, sRes] = await Promise.all([
      supabase.from('bookings').select('*').order('date', { ascending: true }),
      supabase.from('content_ideas').select('*').order('created_at', { ascending: true }),
      supabase.from('price_list').select('*').order('sort_order', { ascending: true }),
      supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
      supabase.from('booking_inspiration').select('*').order('sort_order', { ascending: true }),
    ]);
    if (bRes.error || iRes.error || pRes.error || qRes.error || sRes.error) {
      setLoadError((bRes.error || iRes.error || pRes.error || qRes.error || sRes.error).message);
    } else {
      setBookings(bRes.data.map(rowToBooking));
      setIdeas(iRes.data.map(rowToIdea));
      setPrices(pRes.data.map(rowToPrice));
      setInquiries(qRes.data.map(rowToInquiry));
      setInspiration(sRes.data.map(rowToInspiration));
    }
    setLoading(false);
  }

  function rowToInspiration(r) {
    return { id: r.id, bookingId: r.booking_id, url: r.url, caption: r.caption || '' };
  }

  async function addInspiration(bookingId) {
    if (!inspirationDraft.url.trim()) return;
    const count = inspiration.filter((s) => s.bookingId === bookingId).length;
    const { data, error } = await supabase
      .from('booking_inspiration')
      .insert({ booking_id: bookingId, url: inspirationDraft.url, caption: inspirationDraft.caption, sort_order: count })
      .select()
      .single();
    if (!error) setInspiration([...inspiration, rowToInspiration(data)]);
    setInspirationDraft({ url: '', caption: '' });
  }

  async function deleteInspiration(id) {
    setInspiration(inspiration.filter((s) => s.id !== id));
    await supabase.from('booking_inspiration').delete().eq('id', id);
  }

  function isImageUrl(url) {
    return /\.(jpg|jpeg|png|gif|webp|avif)(\?.*)?$/i.test(url);
  }

  function rowToInquiry(r) {
    return {
      id: r.id,
      name: r.name,
      email: r.email || '',
      phone: r.phone || '',
      eventType: r.event_type || '',
      preferredDate: r.preferred_date || '',
      readyByTime: r.ready_by_time || '',
      location: r.location || '',
      glamLocation: r.glam_location || '',
      clientAddress: r.client_address || '',
      guestCount: r.guest_count,
      service: r.service || '',
      hairService: r.hair_service || '',
      addons: r.addons || [],
      budget: r.budget || '',
      howHeard: r.how_heard || '',
      socialHandle: r.social_handle || '',
      bareFacePhotoUrl: r.bare_face_photo_url || '',
      inspirationUrls: r.inspiration_urls || [],
      allergies: r.allergies || '',
      message: r.message || '',
      status: r.status || 'new',
    };
  }

  async function setInquiryStatus(id, status) {
    setInquiries(inquiries.map((q) => (q.id === id ? { ...q, status } : q)));
    await supabase.from('inquiries').update({ status }).eq('id', id);
  }

  async function deleteInquiry(id) {
    setInquiries(inquiries.filter((q) => q.id !== id));
    await supabase.from('inquiries').delete().eq('id', id);
  }

  function useInquiryForBooking(q) {
    const extraDetails = [
      q.eventType && `Event: ${q.eventType}`,
      q.readyByTime && `Ready by: ${q.readyByTime}`,
      q.glamLocation && `Glam location: ${q.glamLocation}${q.clientAddress ? ` (${q.clientAddress})` : ''}`,
      q.location && `Location: ${q.location}`,
      q.guestCount != null && `Guests: ${q.guestCount}`,
      q.hairService && `Hair: ${q.hairService}`,
      q.addons && q.addons.length > 0 && `Add-ons: ${q.addons.join(', ')}`,
      q.budget && `Budget: ${q.budget}`,
      q.socialHandle && `Social: ${q.socialHandle}`,
      q.allergies && `Allergies/sensitivities: ${q.allergies}`,
    ].filter(Boolean).join(' · ');
    const notes = [extraDetails, q.message].filter(Boolean).join('\n');
    setBookingForm({
      name: q.name,
      email: q.email,
      phone: q.phone,
      date: q.preferredDate,
      time: q.readyByTime,
      service: q.service,
      notes,
    });
    setEditingBookingId(null);
    setTab('bookings');
    setShowBookingForm(true);
  }

  function rowToBooking(r) {
    return { id: r.id, name: r.name, email: r.email || '', phone: r.phone || '', date: r.date || '', time: r.time || '', service: r.service || '', notes: r.notes || '', done: r.done };
  }
  function rowToIdea(r) {
    return { id: r.id, title: r.title, description: r.description || '', bookingId: r.booking_id || '' };
  }
  function rowToPrice(r) {
    return { id: r.id, service: r.service, price: r.price, description: r.description || '', sortOrder: r.sort_order || 0 };
  }

  function openNewPriceForm() {
    setPriceForm(emptyPriceForm);
    setEditingPriceId(null);
    setShowPriceForm(true);
  }

  function openEditPriceForm(p) {
    setPriceForm({ service: p.service, price: p.price != null ? String(p.price) : '', description: p.description });
    setEditingPriceId(p.id);
    setShowPriceForm(true);
  }

  async function savePriceForm() {
    if (!priceForm.service.trim()) return;
    const payload = {
      service: priceForm.service,
      price: priceForm.price === '' ? null : Number(priceForm.price),
      description: priceForm.description,
    };
    if (editingPriceId) {
      const { error } = await supabase.from('price_list').update(payload).eq('id', editingPriceId);
      if (!error) setPrices(prices.map((p) => (p.id === editingPriceId ? { ...p, ...payload } : p)));
    } else {
      const { data, error } = await supabase.from('price_list').insert({ ...payload, sort_order: prices.length }).select().single();
      if (!error) setPrices([...prices, rowToPrice(data)]);
    }
    setShowPriceForm(false);
    setPriceForm(emptyPriceForm);
    setEditingPriceId(null);
  }

  async function deletePrice(id) {
    setPrices(prices.filter((p) => p.id !== id));
    await supabase.from('price_list').delete().eq('id', id);
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

  return (
    <div className="mbt-app">
      <style>{STYLE}</style>
      <div className="mbt-wrap">
        <div className="mbt-header-row">
          <div>
            <div className="mbt-eyebrow">Booking Portal</div>
            <div className="mbt-title">Muses by Muz</div>
            <div className="mbt-sub">{bookings.filter((b) => !b.done).length} upcoming · {bookings.filter((b) => b.done).length} wrapped</div>
          </div>
          <button className="mbt-signout" onClick={onSignOut}><LogOut size={12} /> Sign out</button>
        </div>

        <div className="mbt-tabs">
          <button className={`mbt-tab ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>Bookings</button>
          <button className={`mbt-tab ${tab === 'inquiries' ? 'active' : ''}`} onClick={() => setTab('inquiries')}>
            Inquiries{inquiries.filter((q) => q.status === 'new').length > 0 ? ` (${inquiries.filter((q) => q.status === 'new').length})` : ''}
          </button>
          <button className={`mbt-tab ${tab === 'ideas' ? 'active' : ''}`} onClick={() => setTab('ideas')}>Content Ideas</button>
          <button className={`mbt-tab ${tab === 'pricing' ? 'active' : ''}`} onClick={() => setTab('pricing')}>Pricing</button>
          <button className={`mbt-tab ${tab === 'website' ? 'active' : ''}`} onClick={() => setTab('website')}>Website</button>
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
                      {b.date && (
                        <a className="mbt-iconbtn" href={gcalLink(b)} target="_blank" rel="noopener noreferrer">
                          <CalendarPlus size={12} /> Add to Calendar
                        </a>
                      )}
                      <button className="mbt-iconbtn" onClick={() => openEditBookingForm(b)}>
                        <Pencil size={12} /> Edit
                      </button>
                      <button className="mbt-iconbtn" onClick={() => deleteBooking(b.id)}>
                        <Trash2 size={12} /> Remove
                      </button>
                      <button
                        className="mbt-iconbtn"
                        onClick={() => setExpandedInspirationId(expandedInspirationId === b.id ? null : b.id)}
                      >
                        <ImageIcon size={12} /> Inspiration
                        {inspiration.filter((s) => s.bookingId === b.id).length > 0 ? ` (${inspiration.filter((s) => s.bookingId === b.id).length})` : ''}
                        {expandedInspirationId === b.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                    </div>

                    {expandedInspirationId === b.id && (
                      <div className="mbt-inspiration-panel">
                        {inspiration.filter((s) => s.bookingId === b.id).length > 0 && (
                          <div className="mbt-inspiration-grid">
                            {inspiration.filter((s) => s.bookingId === b.id).map((s) => (
                              <div key={s.id} className="mbt-inspiration-item">
                                {isImageUrl(s.url) ? (
                                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                                    <img src={s.url} alt={s.caption || 'inspiration'} className="mbt-inspiration-thumb" />
                                  </a>
                                ) : (
                                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="mbt-inspiration-link">
                                    <Link2 size={14} />
                                    <span>{s.caption || s.url.replace(/^https?:\/\//, '').split('/')[0]}</span>
                                  </a>
                                )}
                                <button className="mbt-inspiration-remove" onClick={() => deleteInspiration(s.id)}>
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mbt-inspiration-add">
                          <input
                            placeholder="Paste an image or link URL (Pinterest, Instagram, etc.)"
                            value={inspirationDraft.url}
                            onChange={(e) => setInspirationDraft({ ...inspirationDraft, url: e.target.value })}
                          />
                          <input
                            placeholder="Caption (optional)"
                            value={inspirationDraft.caption}
                            onChange={(e) => setInspirationDraft({ ...inspirationDraft, caption: e.target.value })}
                          />
                          <button className="mbt-btn-primary" onClick={() => addInspiration(b.id)}>Add</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : tab === 'inquiries' ? (
          <div>
            {inquiries.length === 0 ? (
              <div className="mbt-empty">No inquiries yet — once your bio link form is live, submissions will show up here.</div>
            ) : (
              inquiries.map((q) => (
                <div key={q.id} className="mbt-card">
                  <div className="mbt-card-body">
                    <div className="mbt-index">{q.status === 'new' ? 'NEW' : q.status.toUpperCase()}</div>
                    <div className="mbt-name">{q.name}</div>
                    <div className="mbt-meta">
                      {q.eventType && <span>{q.eventType}</span>}
                      {q.preferredDate && <span>{formatDatePretty(q.preferredDate)}</span>}
                      {q.readyByTime && <span>Ready by {q.readyByTime}</span>}
                      {q.service && <span>{q.service}</span>}
                      {q.hairService && <span>{q.hairService}</span>}
                      {q.guestCount != null && <span>{q.guestCount} {q.guestCount === 1 ? 'person' : 'people'}</span>}
                      {q.budget && <span>Budget: {q.budget}</span>}
                    </div>
                    <div className="mbt-meta">
                      {q.glamLocation && <span>{q.glamLocation}{q.clientAddress ? ` — ${q.clientAddress}` : ''}</span>}
                      {q.location && <span>{q.location}</span>}
                    </div>
                    {q.addons && q.addons.length > 0 && (
                      <div className="mbt-meta">
                        <span>Add-ons: {q.addons.join(', ')}</span>
                      </div>
                    )}
                    <div className="mbt-meta">
                      {q.email && <span>{q.email}</span>}
                      {q.phone && <span>{q.phone}</span>}
                      {q.socialHandle && <span>{q.socialHandle}</span>}
                      {q.howHeard && <span>via {q.howHeard}</span>}
                    </div>
                    {q.allergies && <div className="mbt-notes"><strong>Allergies/sensitivities:</strong> {q.allergies}</div>}
                    {q.message && <div className="mbt-notes">{q.message}</div>}
                    {(q.bareFacePhotoUrl || (q.inspirationUrls && q.inspirationUrls.length > 0)) && (
                      <div className="mbt-inspiration-panel" style={{ borderTop: 'none', paddingTop: 0 }}>
                        <div className="mbt-inspiration-grid">
                          {q.bareFacePhotoUrl && (
                            <a href={q.bareFacePhotoUrl} target="_blank" rel="noopener noreferrer">
                              <img src={q.bareFacePhotoUrl} alt="bare face" className="mbt-inspiration-thumb" />
                            </a>
                          )}
                          {(q.inspirationUrls || []).map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                              <img src={url} alt={`inspiration ${i + 1}`} className="mbt-inspiration-thumb" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mbt-actions">
                      <button className="mbt-iconbtn" onClick={() => useInquiryForBooking(q)}>
                        <Plus size={12} /> Use for new booking
                      </button>
                      {q.email && (
                        <a className="mbt-iconbtn" href={`mailto:${q.email}?subject=${encodeURIComponent('Re: your booking inquiry')}`}>
                          <Mail size={12} /> Reply
                        </a>
                      )}
                      {q.status !== 'contacted' && (
                        <button className="mbt-iconbtn" onClick={() => setInquiryStatus(q.id, 'contacted')}>
                          <CheckCircle2 size={12} /> Mark contacted
                        </button>
                      )}
                      <button className="mbt-iconbtn" onClick={() => deleteInquiry(q.id)}>
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : tab === 'ideas' ? (
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
        ) : tab === 'pricing' ? (
          <div>
            {!showPriceForm && (
              <button className="mbt-addbtn" onClick={openNewPriceForm} style={{ marginBottom: 18 }}>
                <Plus size={14} /> Add price
              </button>
            )}

            {showPriceForm && (
              <div className="mbt-form">
                <div className="mbt-form-title">{editingPriceId ? 'Edit price' : 'New price'}</div>
                <div className="mbt-field-row">
                  <div className="mbt-field">
                    <label>Service</label>
                    <input value={priceForm.service} onChange={(e) => setPriceForm({ ...priceForm, service: e.target.value })} placeholder="e.g. Soft Glam" />
                  </div>
                  <div className="mbt-field">
                    <label>Price ($)</label>
                    <input type="number" value={priceForm.price} onChange={(e) => setPriceForm({ ...priceForm, price: e.target.value })} placeholder="150" />
                  </div>
                </div>
                <div className="mbt-field-row">
                  <div className="mbt-field">
                    <label>Description (optional)</label>
                    <input value={priceForm.description} onChange={(e) => setPriceForm({ ...priceForm, description: e.target.value })} placeholder="what's included" />
                  </div>
                </div>
                <div className="mbt-form-actions">
                  <button className="mbt-btn-primary" onClick={savePriceForm}>Save</button>
                  <button className="mbt-btn-ghost" onClick={() => { setShowPriceForm(false); setEditingPriceId(null); }}>Cancel</button>
                </div>
              </div>
            )}

            {prices.length === 0 ? (
              <div className="mbt-empty">No prices added yet — this list is what clients will see when they log in.</div>
            ) : (
              <div className="mbt-price-list">
                {prices.map((p) => (
                  <div key={p.id} className="mbt-price-row">
                    <div>
                      <div className="mbt-price-service">{p.service}</div>
                      {p.description && <div className="mbt-price-desc">{p.description}</div>}
                    </div>
                    <div className="mbt-price-row-admin">
                      {p.price != null && <div className="mbt-price-amount">${Number(p.price).toFixed(0)}</div>}
                      <button className="mbt-trash" onClick={() => openEditPriceForm(p)}><Pencil size={14} /></button>
                      <button className="mbt-trash" onClick={() => deletePrice(p.id)}><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mbt-form-title" style={{ marginBottom: 10 }}>About Me (shown on your public homepage)</div>
            <div className="mbt-form">
              <textarea
                rows={6}
                style={{ width: '100%', fontFamily: 'Inter, sans-serif', fontSize: 14, padding: 10, border: '1px solid var(--line)', borderRadius: 3, background: 'var(--bone)', color: 'var(--ink)' }}
                value={aboutDraft}
                onChange={(e) => setAboutDraft(e.target.value)}
                placeholder="Tell potential clients a bit about yourself, your style, and your experience..."
              />
              <div className="mbt-form-actions" style={{ marginTop: 10 }}>
                <button className="mbt-btn-primary" onClick={saveAbout}>{aboutSaved ? 'Saved!' : 'Save About Me'}</button>
              </div>
            </div>

            <div className="mbt-form-title" style={{ margin: '24px 0 10px' }}>Portfolio Photos (shown on your public homepage)</div>
            <div className="mbt-form">
              <input type="file" accept="image/*" multiple onChange={handlePortfolioUpload} disabled={uploadingPortfolio} />
              {uploadingPortfolio && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--ink-soft)', marginTop: 8 }}>Uploading…</div>}
            </div>

            {portfolio.length === 0 ? (
              <div className="mbt-empty">No portfolio photos yet — add some above to show off your work.</div>
            ) : (
              <div className="mbt-portfolio-grid" style={{ marginTop: 14 }}>
                {portfolio.map((p) => (
                  <div key={p.id} className="mbt-portfolio-item" style={{ position: 'relative' }}>
                    <img src={p.url} alt={p.caption || 'portfolio'} />
                    <button className="mbt-inspiration-remove" onClick={() => deletePortfolioImage(p.id)}><Trash2 size={11} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Public inquiry form (no login needed — for the bio link) ----------
const emptyInquiryForm = {
  name: '',
  email: '',
  phone: '',
  eventType: '',
  preferredDate: '',
  readyByTime: '',
  glamLocation: '',
  clientAddress: '',
  guestCount: '',
  service: '',
  hairService: '',
  addons: [],
  budget: '',
  howHeard: '',
  socialHandle: '',
  allergies: '',
  message: '',
};

const ADDON_OPTIONS = [
  'Lashes',
  'Body Glow (collarbones + shoulders)',
  'Early Morning Appointment (before 7am)',
  'Second Look',
  'Touch Up',
  'On-Site Travel',
];

async function uploadInquiryFile(file) {
  const ext = file.name.split('.').pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('inquiry-uploads').upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from('inquiry-uploads').getPublicUrl(path);
  return data.publicUrl;
}

function InquiryForm() {
  const [form, setForm] = useState(emptyInquiryForm);
  const [bareFacePhoto, setBareFacePhoto] = useState(null);
  const [bareFacePreview, setBareFacePreview] = useState(null);
  const [inspirationFiles, setInspirationFiles] = useState([]);
  const [inspirationPreviews, setInspirationPreviews] = useState([]);
  const [prices, setPrices] = useState([]);
  const [showPricing, setShowPricing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.from('price_list').select('*').order('sort_order', { ascending: true }).then(({ data }) => {
      if (data) setPrices(data);
    });
  }, []);

  function toggleAddon(label) {
    setForm((f) => ({
      ...f,
      addons: f.addons.includes(label) ? f.addons.filter((a) => a !== label) : [...f.addons, label],
    }));
  }

  function handleBareFaceChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setBareFacePhoto(file);
    setBareFacePreview(URL.createObjectURL(file));
  }

  function handleInspirationChange(e) {
    const files = Array.from(e.target.files || []);
    setInspirationFiles(files);
    setInspirationPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  async function submit() {
    setError(null);
    if (!form.name.trim() || !form.email.trim()) {
      setError('Please fill in at least your name and email.');
      return;
    }
    setBusy(true);

    let bareFaceUrl = null;
    let inspirationUrls = [];
    try {
      if (bareFacePhoto) bareFaceUrl = await uploadInquiryFile(bareFacePhoto);
      if (inspirationFiles.length) {
        inspirationUrls = await Promise.all(inspirationFiles.map(uploadInquiryFile));
      }
    } catch (uploadErr) {
      setBusy(false);
      setError(`Photo upload failed: ${uploadErr.message}`);
      return;
    }

    const { error: dbError } = await supabase.from('inquiries').insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      event_type: form.eventType,
      preferred_date: form.preferredDate || null,
      ready_by_time: form.readyByTime,
      glam_location: form.glamLocation,
      client_address: form.glamLocation === 'Muznah comes to me' ? form.clientAddress : null,
      guest_count: form.guestCount ? Number(form.guestCount) : null,
      service: form.service,
      hair_service: form.hairService,
      addons: form.addons,
      budget: form.budget,
      how_heard: form.howHeard,
      social_handle: form.socialHandle,
      bare_face_photo_url: bareFaceUrl,
      inspiration_urls: inspirationUrls,
      allergies: form.allergies,
      message: form.message,
    });

    const web3formsKey = import.meta.env.VITE_WEB3FORMS_KEY;
    if (web3formsKey) {
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: web3formsKey,
            subject: `New booking inquiry from ${form.name}`,
            from_name: 'Muses by Muz — Booking Portal',
            name: form.name,
            email: form.email,
            phone: form.phone,
            event_type: form.eventType,
            preferred_date: form.preferredDate,
            ready_by_time: form.readyByTime,
            glam_location: form.glamLocation,
            client_address: form.clientAddress,
            guest_count: form.guestCount,
            service: form.service,
            hair_service: form.hairService,
            addons: form.addons.join(', '),
            budget: form.budget,
            how_heard: form.howHeard,
            social_handle: form.socialHandle,
            allergies: form.allergies,
            bare_face_photo: bareFaceUrl || 'none uploaded',
            inspiration_photos: inspirationUrls.join(', ') || 'none uploaded',
            message: form.message,
          }),
        });
      } catch (e) {
        console.error('Email alert failed', e);
      }
    }

    setBusy(false);
    if (dbError) setError(dbError.message);
    else setDone(true);
  }

  if (done) {
    return (
      <div className="mbt-app">
        <style>{STYLE}</style>
        <div className="mbt-auth-wrap">
          <div className="mbt-eyebrow" style={{ textAlign: 'center' }}>Booking Portal</div>
          <div className="mbt-title" style={{ textAlign: 'center', marginBottom: 20 }}>Muses by Muz</div>
          <div className="mbt-auth-card" style={{ textAlign: 'center' }}>
            <Sparkles size={20} color="#A85D5D" style={{ marginBottom: 10 }} />
            <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 18, marginBottom: 6 }}>Thank you!</div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'var(--ink-soft)' }}>
              Your inquiry has been sent. I'll be in touch soon to confirm details.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mbt-app">
      <style>{STYLE}</style>
      <div className="mbt-inquiry-wrap">
        <div className="mbt-eyebrow" style={{ textAlign: 'center' }}>Booking Portal</div>
        <div className="mbt-title" style={{ textAlign: 'center' }}>Muses by Muz</div>
        <div className="mbt-inquiry-sub">Tell me a bit about your event and I'll follow up with availability and pricing.</div>

        <div className="mbt-auth-card mbt-inquiry-card">
          {error && <div className="mbt-auth-msg error">{error}</div>}

          <div className="mbt-inquiry-section">About You</div>
          <div className="mbt-field-row">
            <div className="mbt-field">
              <label>Your name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
            </div>
            <div className="mbt-field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </div>
          </div>
          <div className="mbt-field-row">
            <div className="mbt-field">
              <label>Phone (optional)</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="optional" />
            </div>
            <div className="mbt-field">
              <label>Instagram / TikTok (optional)</label>
              <input value={form.socialHandle} onChange={(e) => setForm({ ...form, socialHandle: e.target.value })} placeholder="@yourhandle" />
            </div>
          </div>

          <div className="mbt-inquiry-section">Your Event</div>
          <div className="mbt-field-row">
            <div className="mbt-field">
              <label>Event type</label>
              <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })}>
                <option value="">Select one</option>
                <option>Wedding</option>
                <option>Photoshoot</option>
                <option>Quinceañera</option>
                <option>Prom / Formal</option>
                <option>Birthday</option>
                <option>Editorial / Brand</option>
                <option>Other</option>
              </select>
            </div>
            <div className="mbt-field">
              <label>Event date</label>
              <input type="date" value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} />
            </div>
          </div>
          <div className="mbt-field-row">
            <div className="mbt-field">
              <label>Time you need to be ready by</label>
              <input type="time" value={form.readyByTime} onChange={(e) => setForm({ ...form, readyByTime: e.target.value })} />
            </div>
            <div className="mbt-field">
              <label># of people needing glam</label>
              <input type="number" min="1" value={form.guestCount} onChange={(e) => setForm({ ...form, guestCount: e.target.value })} placeholder="1" />
            </div>
          </div>
          <div className="mbt-field-row">
            <div className="mbt-field" style={{ width: '100%' }}>
              <label>Where should the glam happen?</label>
              <select value={form.glamLocation} onChange={(e) => setForm({ ...form, glamLocation: e.target.value })}>
                <option value="">Select one</option>
                <option>I'll come to the studio</option>
                <option>Muznah comes to me</option>
              </select>
            </div>
          </div>
          {form.glamLocation === 'Muznah comes to me' && (
            <div className="mbt-field-row">
              <div className="mbt-field" style={{ width: '100%' }}>
                <label>Address where I should come to you</label>
                <input value={form.clientAddress} onChange={(e) => setForm({ ...form, clientAddress: e.target.value })} placeholder="Where should I come to?" />
              </div>
            </div>
          )}

          <div className="mbt-inquiry-section">Services</div>
          <div className="mbt-field-row">
            <div className="mbt-field">
              <label>Makeup service requested</label>
              <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
                <option value="">Select one</option>
                <option>Soft Glam</option>
                <option>Heavy Beat</option>
                <option>Bridal Trial</option>
                <option>Bridal Day-Of</option>
                <option>Makeup Lesson</option>
              </select>
            </div>
            <div className="mbt-field">
              <label>Hair service</label>
              <select value={form.hairService} onChange={(e) => setForm({ ...form, hairService: e.target.value })}>
                <option value="">Select one</option>
                <option>Hollywood Curls</option>
                <option>Bouncy Blowout</option>
                <option>Slick Back Bun</option>
                <option>No hair needed</option>
              </select>
            </div>
          </div>
          <div className="mbt-field-row">
            <div className="mbt-field" style={{ width: '100%' }}>
              <label>Add-ons (optional)</label>
              <div className="mbt-addon-grid">
                {ADDON_OPTIONS.map((opt) => (
                  <label key={opt} className="mbt-addon-check">
                    <input type="checkbox" checked={form.addons.includes(opt)} onChange={() => toggleAddon(opt)} />
                    {opt}
                  </label>
                ))}
              </div>
              {form.addons.length === 0 && (
                <div className="mbt-addon-none">No add-ons required</div>
              )}
            </div>
          </div>
          <div className="mbt-field-row">
            <div className="mbt-field" style={{ width: '100%' }}>
              <label>Budget range (optional)</label>
              <input value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="e.g. $200–300" />
            </div>
          </div>

          {prices.length > 0 && (
            <div className="mbt-inquiry-pricing-toggle">
              <button type="button" className="mbt-btn-ghost" onClick={() => setShowPricing(!showPricing)} style={{ width: '100%' }}>
                {showPricing ? 'Hide' : 'View'} Pricing
              </button>
              {showPricing && (
                <div className="mbt-price-list" style={{ marginTop: 10 }}>
                  {prices.map((p) => (
                    <div key={p.id} className="mbt-price-row">
                      <div>
                        <div className="mbt-price-service">{p.service}</div>
                        {p.description && <div className="mbt-price-desc">{p.description}</div>}
                      </div>
                      {p.price != null && <div className="mbt-price-amount">${Number(p.price).toFixed(0)}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mbt-inquiry-section">Photos</div>
          <div className="mbt-field-row">
            <div className="mbt-field" style={{ width: '100%' }}>
              <label>Please upload a clear, well-lit photo of your bare face (no makeup, natural daylight if possible)</label>
              <input type="file" accept="image/*" onChange={handleBareFaceChange} />
              {bareFacePreview && <img src={bareFacePreview} alt="bare face preview" className="mbt-photo-preview" />}
            </div>
          </div>
          <div className="mbt-field-row">
            <div className="mbt-field" style={{ width: '100%' }}>
              <label>Inspiration photos (optional)</label>
              <input type="file" accept="image/*" multiple onChange={handleInspirationChange} />
              {inspirationPreviews.length > 0 && (
                <div className="mbt-photo-preview-grid">
                  {inspirationPreviews.map((src, i) => (
                    <img key={i} src={src} alt={`inspiration ${i + 1}`} className="mbt-photo-preview-small" />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mbt-inquiry-section">Anything Else</div>
          <div className="mbt-field-row">
            <div className="mbt-field" style={{ width: '100%' }}>
              <label>Any allergies or sensitive skin we should know about?</label>
              <textarea rows={2} value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} placeholder="optional, but helpful to know" />
            </div>
          </div>
          <div className="mbt-field-row">
            <div className="mbt-field">
              <label>How'd you hear about me?</label>
              <select value={form.howHeard} onChange={(e) => setForm({ ...form, howHeard: e.target.value })}>
                <option value="">Select one</option>
                <option>Instagram</option>
                <option>TikTok</option>
                <option>Referral / word of mouth</option>
                <option>Google search</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="mbt-field-row">
            <div className="mbt-field" style={{ width: '100%' }}>
              <label>Tell me more about your vision</label>
              <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="timing, anything else I should know" />
            </div>
          </div>

          <button className="mbt-btn-primary" style={{ width: '100%' }} disabled={busy} onClick={submit}>
            {busy ? 'Sending…' : 'Send Inquiry'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Public homepage (About + Portfolio + booking link) ----------
function HomePage() {
  const [about, setAbout] = useState('');
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: aboutData }, { data: pData }] = await Promise.all([
        supabase.from('site_content').select('*').eq('id', 'about').maybeSingle(),
        supabase.from('portfolio_images').select('*').order('sort_order', { ascending: true }),
      ]);
      setAbout(aboutData ? aboutData.content : '');
      setPortfolio(pData || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="mbt-app">
      <style>{STYLE}</style>
      <div className="mbt-home-wrap">
        <div className="mbt-home-hero">
          <div className="mbt-eyebrow" style={{ textAlign: 'center' }}>Houston, TX</div>
          <div className="mbt-title mbt-home-title">Muses by Muz</div>
          <div className="mbt-inquiry-sub" style={{ margin: '6px auto 22px' }}>
            Makeup & hair artistry for weddings, editorial shoots, and every occasion in between.
          </div>
          <a className="mbt-btn-primary mbt-home-cta" href="/?inquire=1">Book Now</a>
        </div>

        {!loading && about && (
          <div className="mbt-home-section">
            <div className="mbt-inquiry-section" style={{ textAlign: 'center' }}>About Me</div>
            <div className="mbt-home-about">{about}</div>
          </div>
        )}

        {!loading && portfolio.length > 0 && (
          <div className="mbt-home-section">
            <div className="mbt-inquiry-section" style={{ textAlign: 'center' }}>Portfolio</div>
            <div className="mbt-portfolio-grid">
              {portfolio.map((p) => (
                <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className="mbt-portfolio-item">
                  <img src={p.url} alt={p.caption || 'portfolio'} />
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mbt-home-footer">
          <a href="/?portal=1">Client &amp; Admin Portal</a>
        </div>
      </div>
    </div>
  );
}

// ---------- Top-level app: auth gate + role routing ----------
export default function App() {
  const params = new URLSearchParams(window.location.search);
  const isInquiryPage = params.get('inquire') === '1';
  const isPortalPage = params.get('portal') === '1';
  if (isInquiryPage) return <InquiryForm />;
  if (!isPortalPage) return <HomePage />;

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
