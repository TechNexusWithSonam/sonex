import { useState } from 'react';
import { api } from './api';
import { PageHeader } from './Editors';

export default function Settings({ user, setUser, toast }) {
  const [f, setF] = useState({ username: user.username, currentPassword: '', newPassword: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!f.currentPassword) return setError('Enter your current password.');
    if (f.newPassword && f.newPassword.length < 8) return setError('New password must be at least 8 characters.');
    if (f.newPassword !== f.confirm) return setError('New passwords do not match.');
    setBusy(true);
    try {
      const u = await api.put('/api/auth/credentials', { username: f.username, currentPassword: f.currentPassword, newPassword: f.newPassword });
      setUser(u);
      setF({ username: u.username, currentPassword: '', newPassword: '', confirm: '' });
      toast('Login details updated. Other devices have been logged out.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Settings" description="Change the admin username and password." />
      <form className="a-card a-narrow" onSubmit={submit} noValidate>
        <header className="a-card__head"><h2>Admin login</h2></header>
        <div className="a-fields">
          <div className="a-field">
            <label htmlFor="s-user">Username</label>
            <input id="s-user" autoComplete="username" value={f.username} onChange={set('username')} />
          </div>
          <div className="a-field">
            <label htmlFor="s-cur">Current password <span className="a-req">*</span></label>
            <input id="s-cur" type="password" autoComplete="current-password" value={f.currentPassword} onChange={set('currentPassword')} />
          </div>
          <div className="a-field">
            <label htmlFor="s-new">New password</label>
            <input id="s-new" type="password" autoComplete="new-password" value={f.newPassword} onChange={set('newPassword')} aria-describedby="s-new-hint" />
            <small id="s-new-hint" className="a-hint">At least 8 characters. Leave empty to keep the current password.</small>
          </div>
          <div className="a-field">
            <label htmlFor="s-conf">Confirm new password</label>
            <input id="s-conf" type="password" autoComplete="new-password" value={f.confirm} onChange={set('confirm')} />
          </div>
        </div>
        {error && <p className="a-error a-error--block" role="alert">{error}</p>}
        <footer className="a-card__foot">
          <button type="submit" className="btn btn--gold btn--sm" disabled={busy}>{busy ? 'Saving…' : 'Update login'}</button>
        </footer>
      </form>
    </>
  );
}
