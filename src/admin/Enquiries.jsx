import { useMemo, useState } from 'react';
import { api } from './api';
import { PageHeader } from './Editors';
import Icon, { WhatsAppIcon } from '../components/Icon';
import { whatsappTo } from '../utils/links';

export const STATUS = {
  new: { label: 'New', cls: 'a-pill--new' },
  contacted: { label: 'Contacted', cls: 'a-pill--warn' },
  closed: { label: 'Closed', cls: 'a-pill--done' },
};

export const fmtDate = (iso) =>
  new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export function StatusPill({ status }) {
  const s = STATUS[status] || STATUS.new;
  return <span className={`a-pill ${s.cls}`}>{s.label}</span>;
}

function exportCsv(rows) {
  const cols = ['createdAt', 'status', 'name', 'phone', 'email', 'service', 'budget', 'message', 'notes'];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => esc(c === 'createdAt' ? fmtDate(r[c]) : r[c])).join(','))].join('\r\n');
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: `enquiries-${new Date().toISOString().slice(0, 10)}.csv` });
  a.click();
  URL.revokeObjectURL(url);
}

function Detail({ item, onChange, onDelete, toast, companyName }) {
  const [notes, setNotes] = useState(item.notes || '');
  const [busy, setBusy] = useState(false);

  const patch = async (body, msg) => {
    setBusy(true);
    try {
      onChange(await api.patch(`/api/enquiries/${item.id}`, body));
      toast(msg);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete the enquiry from ${item.name}? This cannot be undone.`)) return;
    try {
      await api.del(`/api/enquiries/${item.id}`);
      onDelete(item.id);
      toast('Enquiry deleted.');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const reply = `Hi ${item.name}, thank you for contacting ${companyName} about ${item.service || 'your project'}. `;

  return (
    <article className="a-detail">
      <header className="a-detail__head">
        <div>
          <h2>{item.name}</h2>
          <small>{fmtDate(item.createdAt)}</small>
        </div>
        <StatusPill status={item.status} />
      </header>

      <div className="a-detail__actions">
        <a className="btn btn--whatsapp btn--sm" href={whatsappTo(item.phone, reply)} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon size={16} /> WhatsApp
        </a>
        <a className="btn btn--outline btn--sm" href={`tel:${item.phone}`}><Icon name="call" size={16} /> Call</a>
        {item.email && (
          <a className="btn btn--outline btn--sm" href={`mailto:${item.email}?subject=${encodeURIComponent(`Your enquiry with ${companyName}`)}`}>
            <Icon name="mail" size={16} /> Email
          </a>
        )}
      </div>

      <dl className="a-dl">
        <div><dt>Phone</dt><dd>{item.phone}</dd></div>
        <div><dt>Email</dt><dd>{item.email || '—'}</dd></div>
        <div><dt>Service</dt><dd>{item.service || '—'}</dd></div>
        <div><dt>Budget</dt><dd>{item.budget || '—'}</dd></div>
      </dl>

      <div className="a-detail__msg">
        <h3>Message</h3>
        <p>{item.message}</p>
      </div>

      <div className="a-field">
        <label htmlFor="enq-status">Status</label>
        <select id="enq-status" value={item.status} disabled={busy} onChange={(e) => patch({ status: e.target.value }, 'Status updated.')}>
          {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <div className="a-field">
        <label htmlFor="enq-notes">Private notes</label>
        <textarea id="enq-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Follow-up details, quote sent, etc." />
      </div>
      <div className="a-detail__foot">
        <button type="button" className="a-text-btn a-danger" onClick={remove}>Delete enquiry</button>
        <button type="button" className="btn btn--gold btn--sm" disabled={busy || notes === (item.notes || '')} onClick={() => patch({ notes }, 'Notes saved.')}>
          Save notes
        </button>
      </div>
    </article>
  );
}

export default function Enquiries({ items, setItems, reload, loading, toast, companyName }) {
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(null);

  const counts = useMemo(() => {
    const c = { all: items.length, new: 0, contacted: 0, closed: 0 };
    items.forEach((i) => { c[i.status] = (c[i.status] || 0) + 1; });
    return c;
  }, [items]);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter(
      (i) =>
        (filter === 'all' || i.status === filter) &&
        (!term || [i.name, i.phone, i.email, i.service, i.message].some((v) => v?.toLowerCase().includes(term)))
    );
  }, [items, filter, q]);

  const current = items.find((i) => i.id === selected);

  return (
    <>
      <PageHeader title="Enquiries" description="Leads submitted from the website contact form.">
        <button type="button" className="btn btn--outline btn--sm" onClick={reload} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
        <button type="button" className="btn btn--gold btn--sm" onClick={() => exportCsv(list)} disabled={!list.length}>
          Export CSV
        </button>
      </PageHeader>

      <div className="a-toolbar">
        <div className="a-tabs" role="group" aria-label="Filter by status">
          {['all', 'new', 'contacted', 'closed'].map((s) => (
            <button key={s} type="button" className={filter === s ? 'is-active' : ''} aria-pressed={filter === s} onClick={() => setFilter(s)}>
              {s === 'all' ? 'All' : STATUS[s].label} <span>{counts[s] || 0}</span>
            </button>
          ))}
        </div>
        <input className="a-search" type="search" placeholder="Search name, phone, service…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search enquiries" />
      </div>

      <div className={`a-split ${current ? 'has-detail' : ''}`}>
        <div className="a-table-wrap">
          {list.length === 0 ? (
            <div className="a-empty"><p>{items.length ? 'No enquiries match this filter.' : 'No enquiries yet. They appear here when someone submits the contact form.'}</p></div>
          ) : (
            <ul className="a-enq-list">
              {list.map((i) => (
                <li key={i.id}>
                  <button type="button" className={`a-enq ${selected === i.id ? 'is-active' : ''} ${i.status === 'new' ? 'is-new' : ''}`} onClick={() => setSelected(i.id)}>
                    <span className="a-enq__top">
                      <strong>{i.name}</strong>
                      <StatusPill status={i.status} />
                    </span>
                    <span className="a-enq__meta">{i.service || 'General'} · {i.phone}</span>
                    <span className="a-enq__msg">{i.message}</span>
                    <small>{fmtDate(i.createdAt)}</small>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {current && (
          <div className="a-detail-wrap">
            <button type="button" className="a-text-btn a-back" onClick={() => setSelected(null)}>← Back to list</button>
            <Detail
              key={current.id}
              item={current}
              companyName={companyName}
              toast={toast}
              onChange={(upd) => setItems((all) => all.map((x) => (x.id === upd.id ? upd : x)))}
              onDelete={(id) => { setItems((all) => all.filter((x) => x.id !== id)); setSelected(null); }}
            />
          </div>
        )}
      </div>
    </>
  );
}
