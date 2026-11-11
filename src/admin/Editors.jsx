import { useEffect, useRef, useState } from 'react';
import { api } from './api';
import { FieldGroup } from './Fields';
import { validateFields } from './schemas';
import Icon from '../components/Icon';

export function Modal({ title, onClose, children, footer }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    d.showModal();
    const first = d.querySelector('input:not([type=hidden]), textarea, select');
    first?.focus();
  }, []);
  return (
    <dialog
      ref={ref}
      className="a-modal"
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="a-modal-title"
    >
      <div className="a-modal__box">
        <header className="a-modal__head">
          <h2 id="a-modal-title">{title}</h2>
          <button type="button" className="a-icon-btn" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        </header>
        <div className="a-modal__body">{children}</div>
        {footer && <footer className="a-modal__foot">{footer}</footer>}
      </div>
    </dialog>
  );
}

export function PageHeader({ title, description, children }) {
  return (
    <header className="a-page-head">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="a-page-head__actions">{children}</div>}
    </header>
  );
}

/** Add / edit / reorder / delete items of an array section. Every action saves immediately. */
export function ListEditor({ section, schema, data, onSaved, toast }) {
  const [editing, setEditing] = useState(null); // { index | null, value }
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const persist = async (next, message) => {
    setBusy(true);
    try {
      const res = await api.put(`/api/content/${section}`, { data: next });
      onSaved(section, res.data);
      toast(message);
      return true;
    } catch (err) {
      toast(err.message, 'error');
      return false;
    } finally {
      setBusy(false);
    }
  };

  const openNew = () => { setErrors({}); setEditing({ index: null, value: structuredClone(schema.blank) }); };
  const openEdit = (i) => { setErrors({}); setEditing({ index: i, value: structuredClone(data[i]) }); };

  const apply = async (e) => {
    e.preventDefault();
    const errs = validateFields(schema.fields, editing.value);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const next = [...data];
    if (editing.index === null) next.push(editing.value);
    else next[editing.index] = editing.value;
    if (await persist(next, editing.index === null ? `New ${schema.itemName} added.` : 'Changes saved.')) setEditing(null);
  };

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= data.length) return;
    const next = [...data];
    [next[i], next[j]] = [next[j], next[i]];
    persist(next, 'Order updated.');
  };

  const remove = (i) => {
    if (!window.confirm(`Delete “${schema.label(data[i]) || 'this item'}”? This cannot be undone.`)) return;
    persist(data.filter((_, k) => k !== i), `${schema.itemName[0].toUpperCase()}${schema.itemName.slice(1)} deleted.`);
  };

  const duplicate = (i) => {
    const copy = structuredClone(data[i]);
    const key = schema.fields[0].name;
    copy[key] = `${copy[key]} (copy)`;
    persist([...data.slice(0, i + 1), copy, ...data.slice(i + 1)], 'Item duplicated.');
  };

  return (
    <>
      <PageHeader title={schema.title} description={schema.description}>
        <button type="button" className="btn btn--gold btn--sm" onClick={openNew} disabled={busy}>
          + Add {schema.itemName}
        </button>
      </PageHeader>

      {data.length === 0 ? (
        <div className="a-empty">
          <p>No {schema.itemName}s yet.</p>
          <button type="button" className="btn btn--outline btn--sm" onClick={openNew}>Add the first one</button>
        </div>
      ) : (
        <ol className="a-list" aria-busy={busy}>
          {data.map((item, i) => (
            <li key={i} className="a-list__item">
              <span className="a-list__num">{i + 1}</span>
              <button type="button" className="a-list__main" onClick={() => openEdit(i)}>
                <strong>{schema.label(item) || <em>Untitled</em>}</strong>
                {schema.sub && <small>{schema.sub(item)}</small>}
              </button>
              <div className="a-list__actions">
                <button type="button" className="a-icon-btn" onClick={() => move(i, -1)} disabled={busy || i === 0} aria-label="Move up">
                  <Icon name="up" size={18} />
                </button>
                <button type="button" className="a-icon-btn a-rot" onClick={() => move(i, 1)} disabled={busy || i === data.length - 1} aria-label="Move down">
                  <Icon name="up" size={18} />
                </button>
                <button type="button" className="a-text-btn" onClick={() => duplicate(i)} disabled={busy}>Duplicate</button>
                <button type="button" className="a-text-btn" onClick={() => openEdit(i)}>Edit</button>
                <button type="button" className="a-text-btn a-danger" onClick={() => remove(i)} disabled={busy}>Delete</button>
              </div>
            </li>
          ))}
        </ol>
      )}

      {editing && (
        <Modal
          title={editing.index === null ? `Add ${schema.itemName}` : `Edit ${schema.itemName}`}
          onClose={() => setEditing(null)}
          footer={
            <>
              <button type="button" className="btn btn--outline btn--sm" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" form="a-item-form" className="btn btn--gold btn--sm" disabled={busy}>
                {busy ? 'Saving…' : 'Save'}
              </button>
            </>
          }
        >
          <form id="a-item-form" onSubmit={apply} noValidate>
            <FieldGroup
              idPrefix={section}
              fields={schema.fields}
              value={editing.value}
              errors={errors}
              onChange={(value) => setEditing((ed) => ({ ...ed, value }))}
            />
          </form>
        </Modal>
      )}
    </>
  );
}

/** Edits an object section (or an array mapped to a form) with an explicit Save button. */
export function ObjectEditor({ section, schema, data, onSaved, toast, setDirty }) {
  // Only this editor's fields are tracked, so several editors can safely share one section (e.g. "texts").
  const pick = (obj) => Object.fromEntries(schema.fields.map((f) => [f.name, obj?.[f.name]]));
  const toForm = schema.toForm || pick;
  const fromForm = schema.fromForm || ((f) => ({ ...data, ...f }));
  const [form, setForm] = useState(() => structuredClone(toForm(data)));
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const dirty = JSON.stringify(form) !== JSON.stringify(toForm(data));
  const dirtyKey = `${section}:${schema.title}`;

  useEffect(() => {
    setDirty(dirtyKey, dirty);
    return () => setDirty(dirtyKey, false);
  }, [dirty, dirtyKey, setDirty]);

  const save = async (e) => {
    e.preventDefault();
    const errs = validateFields(schema.fields, form);
    setErrors(errs);
    if (Object.keys(errs).length) return toast('Please fix the highlighted fields.', 'error');
    setBusy(true);
    try {
      const res = await api.put(`/api/content/${section}`, { data: fromForm(form) });
      onSaved(section, res.data);
      setForm(structuredClone(toForm(res.data)));
      toast(`${schema.title} saved.`);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="a-card" onSubmit={save} noValidate>
      <header className="a-card__head">
        <h2>{schema.title}</h2>
        {dirty && <span className="a-pill a-pill--warn">Unsaved changes</span>}
      </header>
      <FieldGroup idPrefix={section} fields={schema.fields} value={form} errors={errors} onChange={setForm} />
      <footer className="a-card__foot">
        <button type="button" className="btn btn--outline btn--sm" disabled={!dirty || busy} onClick={() => { setForm(structuredClone(toForm(data))); setErrors({}); }}>
          Discard
        </button>
        <button type="submit" className="btn btn--gold btn--sm" disabled={!dirty || busy}>
          {busy ? 'Saving…' : 'Save changes'}
        </button>
      </footer>
    </form>
  );
}
