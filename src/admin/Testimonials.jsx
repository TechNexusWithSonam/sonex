import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api } from './api';
import { Modal, PageHeader } from './Editors';
import Icon from '../components/Icon';
import { Avatar, Stars } from '../components/Testimonials';

const BLANK = { name: '', designation: '', company: '', rating: 5, review: '', active: true, image: '' };
const PHOTO_SIZE = 320; // px, square — shown at up to 64px, so this is sharp on retina screens

/** Center-crops the picked file to a square, scales it down and returns a compact data: URL. */
async function resizePhoto(file) {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file (JPG, PNG or WebP).');
  if (file.size > 15 * 1024 * 1024) throw new Error('That image is over 15 MB. Please choose a smaller one.');
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error('Could not read this image. Try a JPG or PNG.'));
      i.src = url;
    });
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const out = Math.min(PHOTO_SIZE, side);
    const canvas = Object.assign(document.createElement('canvas'), { width: out, height: out });
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; // transparent PNGs get a white background instead of black
    ctx.fillRect(0, 0, out, out);
    ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, out, out);
    let data = canvas.toDataURL('image/webp', 0.85);
    if (!data.startsWith('data:image/webp')) data = canvas.toDataURL('image/jpeg', 0.86); // older Safari
    return data;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function PhotoInput({ value, name, onChange, toast }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    try {
      onChange(await resizePhoto(file));
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="a-photo">
      <Avatar name={name} image={value} size={72} />
      <div className="a-photo__actions">
        <input ref={ref} type="file" accept="image/*" hidden onChange={pick} />
        <button type="button" className="btn btn--outline btn--sm" onClick={() => ref.current.click()} disabled={busy}>
          {busy ? 'Processing…' : value ? 'Change photo' : 'Upload photo'}
        </button>
        {value && <button type="button" className="a-text-btn a-danger" onClick={() => onChange('')}>Remove</button>}
        <small className="a-hint">Optional. Cropped to a square automatically. Without a photo, initials are shown.</small>
      </div>
    </div>
  );
}

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="a-stars" role="radiogroup" aria-label="Rating" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className={n <= shown ? 'is-on' : ''}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); onChange(Math.min(5, value + 1)); }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); onChange(Math.max(1, value - 1)); }
          }}
          tabIndex={value === n ? 0 : -1}
        >
          ★
        </button>
      ))}
      <span className="a-stars__label">{value} / 5</span>
    </div>
  );
}

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Customer name is required.';
  if (v.review.trim().length < 10) e.review = 'Write at least 10 characters.';
  if (!(v.rating >= 1 && v.rating <= 5)) e.rating = 'Choose a rating.';
  return e;
}

function TestimonialForm({ editing, setEditing, errors, toast }) {
  const v = editing.value;
  const set = (k) => (val) => setEditing((ed) => ({ ...ed, value: { ...ed.value, [k]: val } }));
  const field = (k, label, props = {}) => (
    <div className={`a-field ${errors[k] ? 'has-error' : ''}`}>
      <label htmlFor={`t-${k}`}>{label} {props.required && <span className="a-req">*</span>}</label>
      {props.textarea ? (
        <textarea id={`t-${k}`} rows={5} maxLength={1500} value={v[k]} onChange={(e) => set(k)(e.target.value)} aria-invalid={errors[k] ? true : undefined} />
      ) : (
        <input id={`t-${k}`} type="text" maxLength={100} value={v[k]} placeholder={props.placeholder} onChange={(e) => set(k)(e.target.value)} aria-invalid={errors[k] ? true : undefined} />
      )}
      {props.hint && <small className="a-hint">{props.hint}</small>}
      {errors[k] && <small className="a-error" role="alert">{errors[k]}</small>}
    </div>
  );
  return (
    <div className="a-fields">
      <div className="a-field a-field--full">
        <label>Profile photo</label>
        <PhotoInput value={v.image} name={v.name} onChange={set('image')} toast={toast} />
      </div>
      {field('name', 'Customer name', { required: true })}
      {field('designation', 'Designation', { placeholder: 'e.g. Owner, Founder, Manager' })}
      {field('company', 'Company', { placeholder: 'e.g. Kumar Medicals' })}
      <div className={`a-field ${errors.rating ? 'has-error' : ''}`}>
        <label>Rating <span className="a-req">*</span></label>
        <StarPicker value={v.rating} onChange={set('rating')} />
      </div>
      {field('review', 'Review', { required: true, textarea: true, hint: `${v.review.length} / 1500 characters. 2–4 sentences read best.` })}
      <label className="a-check" htmlFor="t-active">
        <input type="checkbox" id="t-active" checked={v.active} onChange={(e) => set('active')(e.target.checked)} />
        <span>Active — show this testimonial on the website</span>
      </label>
    </div>
  );
}

export default function Testimonials({ toast }) {
  const [items, setItems] = useState(null);
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null); // { id | null, value, original }
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try { setItems(await api.get('/api/testimonials/manage')); } catch (err) { if (err.status !== 401) toast(err.message, 'error'); setItems((i) => i || []); }
  }, [toast]);
  useEffect(() => { load(); }, [load]);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (items || []).filter(
      (i) => (filter === 'all' || (filter === 'active') === i.active) &&
        (!term || [i.name, i.designation, i.company, i.review].some((s) => s?.toLowerCase().includes(term)))
    );
  }, [items, filter, q]);

  const counts = useMemo(() => {
    const all = items || [];
    return { all: all.length, active: all.filter((i) => i.active).length, inactive: all.filter((i) => !i.active).length };
  }, [items]);

  const run = async (fn, okMessage) => {
    setBusy(true);
    try {
      await fn();
      if (okMessage) toast(okMessage);
      return true;
    } catch (err) {
      toast(err.message, 'error');
      return false;
    } finally {
      setBusy(false);
    }
  };

  const replace = (item) => setItems((all) => all.map((x) => (x.id === item.id ? item : x)));

  const openNew = () => { setErrors({}); setEditing({ id: null, value: { ...BLANK } }); };
  const openEdit = (item) => {
    const value = { name: item.name, designation: item.designation, company: item.company, rating: item.rating, review: item.review, active: item.active, image: item.image };
    setErrors({});
    setEditing({ id: item.id, value, original: value });
  };

  const save = async (e) => {
    e.preventDefault();
    const v = editing.value;
    const errs = validate(v);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const body = { name: v.name, designation: v.designation, company: v.company, rating: v.rating, review: v.review, active: v.active };
    // Only send the photo when it changed: '' removes it, a data: URL replaces it.
    if (editing.id === null) { if (v.image) body.image = v.image; }
    else if (v.image !== editing.original.image) body.image = v.image || null;

    const ok = await run(async () => {
      if (editing.id === null) {
        const created = await api.post('/api/testimonials', body);
        setItems((all) => [...all, created]);
      } else {
        replace(await api.put(`/api/testimonials/${editing.id}`, body));
      }
    }, editing.id === null ? 'Testimonial added.' : 'Changes saved.');
    if (ok) setEditing(null);
  };

  const toggle = (item) =>
    run(async () => replace(await api.patch(`/api/testimonials/${item.id}`, { active: !item.active })),
      item.active ? `“${item.name}” hidden from the website.` : `“${item.name}” is now live on the website.`);

  const remove = (item) => {
    if (!window.confirm(`Delete the testimonial from ${item.name}? This cannot be undone.`)) return;
    run(async () => {
      await api.del(`/api/testimonials/${item.id}`);
      setItems((all) => all.filter((x) => x.id !== item.id));
    }, 'Testimonial deleted.');
  };

  const move = (index, dir) => {
    const next = [...items];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setItems(next);
    run(async () => setItems(await api.put('/api/testimonials/order', { ids: next.map((i) => i.id) })), 'Order updated.')
      .then((ok) => !ok && load());
  };

  const canReorder = filter === 'all' && !q.trim();
  const dirty = editing && editing.id !== null && JSON.stringify(editing.value) !== JSON.stringify(editing.original);
  const close = () => { if ((!dirty && !(editing.id === null && editing.value.review)) || window.confirm('Discard your changes?')) setEditing(null); };

  return (
    <>
      <PageHeader title="Testimonials" description="Customer reviews shown on the website. Only active testimonials are visible to visitors; the section hides itself when none are active.">
        <button type="button" className="btn btn--gold btn--sm" onClick={openNew} disabled={busy || !items}>+ Add testimonial</button>
      </PageHeader>

      {items === null ? (
        <div className="a-empty"><p>Loading…</p></div>
      ) : (
        <>
          <div className="a-toolbar">
            <div className="a-tabs" role="group" aria-label="Filter by status">
              {[['all', 'All'], ['active', 'Active'], ['inactive', 'Inactive']].map(([k, label]) => (
                <button key={k} type="button" className={filter === k ? 'is-active' : ''} aria-pressed={filter === k} onClick={() => setFilter(k)}>
                  {label} <span>{counts[k]}</span>
                </button>
              ))}
            </div>
            <input className="a-search" type="search" placeholder="Search name, company, review…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search testimonials" />
          </div>

          {list.length === 0 ? (
            <div className="a-empty">
              <p>{items.length ? 'No testimonials match this filter.' : 'No testimonials yet. Add your first customer review.'}</p>
              {!items.length && <button type="button" className="btn btn--outline btn--sm" onClick={openNew}>Add the first one</button>}
            </div>
          ) : (
            <>
              {!canReorder && <p className="a-muted a-note">Clear the filter and search to change the display order.</p>}
              <ol className="a-tlist" aria-busy={busy}>
                {list.map((item) => {
                  const index = items.indexOf(item);
                  return (
                    <li key={item.id} className={`a-titem ${item.active ? '' : 'is-off'}`}>
                      <button type="button" className="a-titem__main" onClick={() => openEdit(item)}>
                        <Avatar name={item.name} image={item.image} size={52} />
                        <span className="a-titem__text">
                          <span className="a-titem__top">
                            <strong>{item.name}</strong>
                            <Stars rating={item.rating} size={14} />
                          </span>
                          {(item.designation || item.company) && <small>{[item.designation, item.company].filter(Boolean).join(', ')}</small>}
                          <span className="a-titem__review">“{item.review}”</span>
                        </span>
                      </button>
                      <div className="a-titem__actions">
                        <label className="a-switch" title={item.active ? 'Visible on the website' : 'Hidden from the website'}>
                          <input type="checkbox" checked={item.active} onChange={() => toggle(item)} disabled={busy} aria-label={`Show ${item.name}'s testimonial on the website`} />
                          <span aria-hidden="true" />
                          <em>{item.active ? 'Active' : 'Inactive'}</em>
                        </label>
                        {canReorder && (
                          <>
                            <button type="button" className="a-icon-btn" onClick={() => move(index, -1)} disabled={busy || index === 0} aria-label="Move up"><Icon name="up" size={18} /></button>
                            <button type="button" className="a-icon-btn a-rot" onClick={() => move(index, 1)} disabled={busy || index === items.length - 1} aria-label="Move down"><Icon name="up" size={18} /></button>
                          </>
                        )}
                        <button type="button" className="a-text-btn" onClick={() => openEdit(item)}>Edit</button>
                        <button type="button" className="a-text-btn a-danger" onClick={() => remove(item)} disabled={busy}>Delete</button>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </>
          )}
        </>
      )}

      {editing && (
        <Modal
          title={editing.id === null ? 'Add testimonial' : 'Edit testimonial'}
          onClose={close}
          footer={
            <>
              <button type="button" className="btn btn--outline btn--sm" onClick={close}>Cancel</button>
              <button type="submit" form="a-testimonial-form" className="btn btn--gold btn--sm" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
            </>
          }
        >
          <form id="a-testimonial-form" onSubmit={save} noValidate>
            <TestimonialForm editing={editing} setEditing={setEditing} errors={errors} toast={toast} />
          </form>
        </Modal>
      )}
    </>
  );
}
