import { useState } from 'react';
import { useContent, useTexts } from '../content/ContentContext';
import { SectionHeading } from './ui';
import Icon, { WhatsAppIcon } from './Icon';
import { telLink, mailLink, whatsappLink } from '../utils/links';

const INITIAL = { name: '', phone: '', email: '', service: '', budget: '', message: '', website: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v, t, opts) {
  const e = {};
  if (v.name.trim().length < 2) e.name = t('errName');
  if (!/^(91)?[6-9]\d{9}$/.test(v.phone.replace(/\D/g, ''))) e.phone = t('errPhone');
  if (opts.showEmail && ((opts.requireEmail && !v.email.trim()) || (v.email && !EMAIL_RE.test(v.email.trim())))) e.email = t('errEmail');
  if (!v.service) e.service = t('errService');
  if (v.message.trim().length < 10) e.message = t('errMessage');
  return e;
}

function buildMessage(v, header, t) {
  return [
    `*${header}*`,
    `${t('fieldName')}: ${v.name.trim()}`,
    `${t('fieldPhone')}: ${v.phone.trim()}`,
    v.email && `${t('fieldEmail')}: ${v.email.trim()}`,
    `${t('fieldService')}: ${v.service}`,
    v.budget && `${t('fieldBudget')}: ${v.budget}`,
    `${t('fieldMessage')}: ${v.message.trim()}`,
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

function InfoItem({ icon, label, children }) {
  return (
    <li>
      {icon}
      <div>
        <small>{label}</small>
        {children}
      </div>
    </li>
  );
}

export default function Contact() {
  const { company: COMPANY, services, budgets, texts } = useContent();
  const t = useTexts();
  const opts = {
    showEmail: texts.showEmailField !== false,
    showBudget: texts.showBudgetField !== false && budgets.length > 0,
    requireEmail: texts.showEmailField !== false && !!texts.requireEmail,
  };

  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sent, setSent] = useState(false);

  const onChange = (e) => {
    const next = { ...values, [e.target.name]: e.target.value };
    setValues(next);
    if (touched[e.target.name]) setErrors(validate(next, t, opts));
  };
  const onBlur = (e) => {
    setTouched((s) => ({ ...s, [e.target.name]: true }));
    setErrors(validate(values, t, opts));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = validate(values, t, opts);
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
    window.open(whatsappLink(COMPANY, buildMessage(values, t('whatsappHeader'), t)), '_blank', 'noopener');
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
  const mapUrl = /^https?:\/\//.test(COMPANY.mapUrl || '') ? COMPANY.mapUrl : '';

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
            <InfoItem icon={<span className="icon-badge"><Icon name="call" /></span>} label={t('labelCall')}>
              <a href={tel}>{COMPANY.phoneDisplay}</a>
            </InfoItem>
            <InfoItem icon={<span className="icon-badge icon-badge--wa"><WhatsAppIcon /></span>} label={t('labelWhatsApp')}>
              <a href={whatsappLink(COMPANY)} target="_blank" rel="noopener noreferrer">{COMPANY.phoneDisplay}</a>
            </InfoItem>
            {COMPANY.email && (
              <InfoItem icon={<span className="icon-badge"><Icon name="mail" /></span>} label={t('labelEmail')}>
                <a href={mailLink(COMPANY)}>{COMPANY.email}</a>
              </InfoItem>
            )}
            {COMPANY.hours && (
              <InfoItem icon={<span className="icon-badge"><Icon name="clock" /></span>} label={t('labelHours')}>
                <span>{COMPANY.hours}</span>
              </InfoItem>
            )}
            {(COMPANY.location || mapUrl) && (
              <InfoItem icon={<span className="icon-badge"><Icon name="pin" /></span>} label={t('labelLocation')}>
                {COMPANY.location && <span>{COMPANY.location}</span>}
                {mapUrl && (
                  <a className="contact__map" href={mapUrl} target="_blank" rel="noopener noreferrer">
                    {t('directionsText')} →
                  </a>
                )}
              </InfoItem>
            )}
          </ul>

          {(texts.enquiryTitle || texts.enquiryText) && (
            <div className="enquiry-box reveal">
              {texts.enquiryTitle && <h3>{t('enquiryTitle')}</h3>}
              {texts.enquiryText && <p>{t('enquiryText')}</p>}
            </div>
          )}
        </div>

        <div className="contact__form-wrap reveal">
          {sent ? (
            <div className="form-success" role="status">
              <span className="icon-badge"><Icon name="check" /></span>
              <h3>{t('successTitle')}</h3>
              <p>{t('successText')}</p>
              <div className="form-success__actions">
                <a className="btn btn--gold" href={tel}><Icon name="call" size={18} /> {t('formAltCall')}</a>
                <button type="button" className="btn btn--outline" onClick={() => setSent(false)}>
                  {t('successButton')}
                </button>
              </div>
            </div>
          ) : (
            <form className="form" onSubmit={onSubmit} noValidate aria-label={t('formTitle')}>
              <h3 className="form__title">{t('formTitle')}</h3>
              {texts.formRequiredNote && <p className="form__sub">{t('formRequiredNote')}</p>}

              {/* Honeypot: hidden from people, bots fill it in. */}
              <input type="text" name="website" value={values.website} onChange={onChange} className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              <div className="form__row">
                <Field id="name" label={t('fieldName')} required error={err('name')}>
                  <input type="text" autoComplete="name" placeholder={t('fieldNamePlaceholder')} {...props('name')} />
                </Field>
                <Field id="phone" label={t('fieldPhone')} required error={err('phone')}>
                  <input type="tel" inputMode="tel" autoComplete="tel" placeholder={t('fieldPhonePlaceholder')} {...props('phone')} />
                </Field>
              </div>

              {opts.showEmail && (
                <Field id="email" label={t('fieldEmail')} required={opts.requireEmail} error={err('email')}>
                  <input type="email" autoComplete="email" placeholder={t('fieldEmailPlaceholder')} {...props('email')} />
                </Field>
              )}

              <div className={opts.showBudget ? 'form__row' : undefined}>
                <Field id="service" label={t('fieldService')} required error={err('service')}>
                  <select {...props('service')}>
                    <option value="">{t('fieldServicePlaceholder')}</option>
                    {services.map((s, i) => <option key={`${s.title}-${i}`}>{s.title}</option>)}
                    {texts.fieldServiceOther && <option>{t('fieldServiceOther')}</option>}
                  </select>
                </Field>
                {opts.showBudget && (
                  <Field id="budget" label={t('fieldBudget')} error={err('budget')}>
                    <select {...props('budget')}>
                      <option value="">{t('fieldBudgetPlaceholder')}</option>
                      {budgets.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </Field>
                )}
              </div>

              <Field id="message" label={t('fieldMessage')} required error={err('message')}>
                <textarea rows="4" placeholder={t('fieldMessagePlaceholder')} {...props('message')} />
              </Field>

              <button type="submit" className="btn btn--gold btn--block">
                <WhatsAppIcon size={18} /> {t('formButton')}
              </button>
              {(texts.formAltText || texts.formAltCall) && (
                <p className="form__alt">
                  {t('formAltText')} <a href={tel}>{t('formAltCall')}</a>
                  {COMPANY.email && texts.formAltEmail && <> · <a href={mailLink(COMPANY, t('formTitle'))}>{t('formAltEmail')}</a></>}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
