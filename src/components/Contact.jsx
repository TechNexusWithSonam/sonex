import { useState } from 'react';
import { useContent, useTexts } from '../content/ContentContext';
import { SectionHeading } from './ui';
import Icon, { WhatsAppIcon } from './Icon';
import { telLink, mailLink, whatsappLink } from '../utils/links';

const INITIAL = { name: '', phone: '', email: '', service: '', budget: '', message: '', website: '' };

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  const digits = v.phone.replace(/\D/g, '');
  if (!/^(91)?[6-9]\d{9}$/.test(digits)) e.phone = 'Enter a valid 10-digit mobile number.';
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Enter a valid email address.';
  if (!v.service) e.service = 'Please choose a service.';
  if (v.message.trim().length < 10) e.message = 'Tell us a little more (at least 10 characters).';
  return e;
}

function buildMessage(v, companyName) {
  return [
    `*New Enquiry — ${companyName} Website*`,
    `Name: ${v.name.trim()}`,
    `Phone: ${v.phone.trim()}`,
    v.email && `Email: ${v.email.trim()}`,
    `Service: ${v.service}`,
    v.budget && `Budget: ${v.budget}`,
    `Message: ${v.message.trim()}`,
  ]
    .filter(Boolean)
    .join('\n');
}

function Field({ id, label, error, required, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>
        {label} {required && <span aria-hidden="true" className="req">*</span>}
      </label>
      {children}
      <p id={`${id}-error`} className="field__error" role={error ? 'alert' : undefined}>
        {error || ''}
      </p>
    </div>
  );
}

export default function Contact() {
  const { company: COMPANY, services, budgets } = useContent();
  const t = useTexts();
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sent, setSent] = useState(false);

  const onChange = (e) => {
    const next = { ...values, [e.target.name]: e.target.value };
    setValues(next);
    if (touched[e.target.name]) setErrors(validate(next));
  };
  const onBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
    setErrors(validate(values));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched(Object.keys(INITIAL).reduce((a, k) => ({ ...a, [k]: true }), {}));
    if (Object.keys(errs).length) {
      document.getElementById(Object.keys(errs)[0])?.focus();
      return;
    }
    // Save the lead for the admin panel (fire-and-forget), then open WhatsApp.
    // WhatsApp must open synchronously inside the click, or browsers block the new tab.
    fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
      keepalive: true,
    }).catch(() => {});
    window.open(whatsappLink(COMPANY, buildMessage(values, COMPANY.name)), '_blank', 'noopener');
    setSent(true);
    setValues(INITIAL);
    setTouched({});
  };

  const props = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange,
    onBlur,
    'aria-invalid': touched[name] && errors[name] ? true : undefined,
    'aria-describedby': `${name}-error`,
  });
  const err = (name) => (touched[name] ? errors[name] : '');
  const tel = telLink(COMPANY);

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container contact">
        <div className="contact__info">
          <SectionHeading
            id="contact-title"
            align="left"
            eyebrow={t('contactEyebrow')}
            title={t('contactTitle')}
            accent={t('contactAccent')}
            text={t('contactText')}
          />

          <ul className="contact__list reveal">
            <li>
              <span className="icon-badge"><Icon name="call" /></span>
              <div>
                <small>Call us</small>
                <a href={tel}>{COMPANY.phoneDisplay}</a>
              </div>
            </li>
            <li>
              <span className="icon-badge icon-badge--wa"><WhatsAppIcon /></span>
              <div>
                <small>WhatsApp</small>
                <a href={whatsappLink(COMPANY)} target="_blank" rel="noopener noreferrer">{COMPANY.phoneDisplay}</a>
              </div>
            </li>
            {COMPANY.email && (
              <li>
                <span className="icon-badge"><Icon name="mail" /></span>
                <div>
                  <small>Email</small>
                  <a href={mailLink(COMPANY)}>{COMPANY.email}</a>
                </div>
              </li>
            )}
            {COMPANY.hours && (
              <li>
                <span className="icon-badge"><Icon name="clock" /></span>
                <div>
                  <small>Business hours</small>
                  <span>{COMPANY.hours}</span>
                </div>
              </li>
            )}
            {COMPANY.location && (
              <li>
                <span className="icon-badge"><Icon name="pin" /></span>
                <div>
                  <small>Location</small>
                  <span>{COMPANY.location}</span>
                </div>
              </li>
            )}
          </ul>

          <div className="enquiry-box reveal">
            <h3>{t('enquiryTitle')}</h3>
            <p>{t('enquiryText')}</p>
          </div>
        </div>

        <div className="contact__form-wrap reveal">
          {sent ? (
            <div className="form-success" role="status">
              <span className="icon-badge"><Icon name="check" /></span>
              <h3>{t('successTitle')}</h3>
              <p>
                We&apos;ve received your enquiry and opened it in WhatsApp — tap <strong>Send</strong> there for the
                fastest reply. If WhatsApp did not open, call us on <a href={tel}>{COMPANY.phoneDisplay}</a>.
              </p>
              <button type="button" className="btn btn--outline" onClick={() => setSent(false)}>
                Send another enquiry
              </button>
            </div>
          ) : (
            <form className="form" onSubmit={onSubmit} noValidate aria-label="Get a free quote">
              <h3 className="form__title">{t('formTitle')}</h3>
              <p className="form__sub">
                Fields marked <span className="req">*</span> are required.
              </p>

              {/* Honeypot: hidden from people, bots fill it in. */}
              <input type="text" name="website" value={values.website} onChange={onChange} className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              <div className="form__row">
                <Field id="name" label="Full name" required error={err('name')}>
                  <input type="text" autoComplete="name" placeholder="Your name" {...props('name')} />
                </Field>
                <Field id="phone" label="Phone / WhatsApp" required error={err('phone')}>
                  <input type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" {...props('phone')} />
                </Field>
              </div>

              <Field id="email" label="Email" error={err('email')}>
                <input type="email" autoComplete="email" placeholder="you@company.com" {...props('email')} />
              </Field>

              <div className="form__row">
                <Field id="service" label="Service" required error={err('service')}>
                  <select {...props('service')}>
                    <option value="">Select a service</option>
                    {services.map((s, i) => <option key={`${s.title}-${i}`}>{s.title}</option>)}
                    <option>Other / Not sure</option>
                  </select>
                </Field>
                <Field id="budget" label="Budget" error={err('budget')}>
                  <select {...props('budget')}>
                    <option value="">Select budget</option>
                    {budgets.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </Field>
              </div>

              <Field id="message" label="Project details" required error={err('message')}>
                <textarea rows="4" placeholder="Tell us about your business and what you need…" {...props('message')} />
              </Field>

              <button type="submit" className="btn btn--gold btn--block">
                <WhatsAppIcon size={18} /> {t('formButton')}
              </button>
              <p className="form__alt">
                Prefer talking? <a href={tel}>Call Now</a>
                {COMPANY.email && <> · <a href={mailLink(COMPANY, 'Quote Request')}>Email us</a></>}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
