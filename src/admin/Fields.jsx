import { useEffect, useState } from 'react';

/** Textarea that edits an array of strings, one per line. Keeps the raw text while typing. */
function LinesInput({ id, value, onChange, ...rest }) {
  const [text, setText] = useState((value || []).join('\n'));
  useEffect(() => {
    const parsed = text.split('\n').map((s) => s.trim()).filter(Boolean);
    if (JSON.stringify(parsed) !== JSON.stringify(value || [])) setText((value || []).join('\n'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <textarea
      id={id}
      rows={Math.min(10, Math.max(3, (value || []).length + 1))}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean));
      }}
      {...rest}
    />
  );
}

export function Field({ field, value, onChange, error, idPrefix = 'f' }) {
  const id = `${idPrefix}-${field.name}`;
  const describedBy = [field.hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(' ') || undefined;
  const common = { id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy };

  let input;
  switch (field.type) {
    case 'textarea':
      input = <textarea rows={4} value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...common} />;
      break;
    case 'number':
      input = (
        <input
          type="number"
          inputMode="numeric"
          min={field.min}
          max={field.max}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          {...common}
        />
      );
      break;
    case 'select':
      input = (
        <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...common}>
          {field.options.map((o) => {
            const opt = typeof o === 'string' ? { value: o, label: o } : o;
            return <option key={opt.value} value={opt.value}>{opt.label}</option>;
          })}
        </select>
      );
      break;
    case 'checkbox':
      return (
        <label className="a-check" htmlFor={id}>
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} id={id} />
          <span>{field.label}</span>
        </label>
      );
    case 'lines':
      input = <LinesInput value={value} onChange={onChange} {...common} />;
      break;
    case 'colors': {
      const [a = '#d4a845', b = '#3b2a0a'] = value || [];
      input = (
        <div className="a-colors">
          <input type="color" aria-label="Light colour" value={a} onChange={(e) => onChange([e.target.value, b])} />
          <input type="color" aria-label="Dark colour" value={b} onChange={(e) => onChange([a, e.target.value])} />
          <span className="a-colors__preview" style={{ background: `radial-gradient(circle at 80% 10%, ${a}, ${b} 75%)` }} />
        </div>
      );
      break;
    }
    default:
      input = <input type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...common} />;
  }

  return (
    <div className={`a-field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>
        {field.label} {field.required && <span className="a-req">*</span>}
      </label>
      {input}
      {field.hint && <small id={`${id}-hint`} className="a-hint">{field.hint}</small>}
      {error && <small id={`${id}-err`} className="a-error" role="alert">{error}</small>}
    </div>
  );
}

export function FieldGroup({ fields, value, onChange, errors = {}, idPrefix }) {
  return (
    <div className="a-fields">
      {fields.map((f) => (
        <Field
          key={f.name}
          field={f}
          idPrefix={idPrefix}
          value={value[f.name]}
          error={errors[f.name]}
          onChange={(v) => onChange({ ...value, [f.name]: v })}
        />
      ))}
    </div>
  );
}
