import { PageHeader } from './Editors';
import { StatusPill, fmtDate } from './Enquiries';

export default function Dashboard({ content, enquiries, go, user }) {
  const weekAgo = Date.now() - 7 * 864e5;
  const stats = [
    { label: 'New enquiries', value: enquiries.filter((e) => e.status === 'new').length, page: 'enquiries', highlight: true },
    { label: 'Enquiries this week', value: enquiries.filter((e) => new Date(e.createdAt).getTime() > weekAgo).length, page: 'enquiries' },
    { label: 'Total enquiries', value: enquiries.length, page: 'enquiries' },
    { label: 'Services', value: content.services.length, page: 'services' },
    { label: 'Projects', value: content.projects.length, page: 'projects' },
    { label: 'Packages', value: content.plans.length, page: 'pricing' },
  ];
  const pct = content.company.launchDiscount;

  return (
    <>
      <PageHeader title={`Welcome back, ${user.username}`} description="Here’s what’s happening on your website." />

      {user.isDefault && (
        <div className="a-alert" role="alert">
          <strong>You are using the default admin password.</strong> Change it now in{' '}
          <button type="button" className="a-link" onClick={() => go('settings')}>Settings</button> to keep your panel secure.
        </div>
      )}

      <div className="a-stats">
        {stats.map((s) => (
          <button key={s.label} type="button" className={`a-stat ${s.highlight ? 'a-stat--gold' : ''}`} onClick={() => go(s.page)}>
            <span className="a-stat__value">{s.value}</span>
            <span className="a-stat__label">{s.label}</span>
          </button>
        ))}
      </div>

      <div className="a-grid-2">
        <section className="a-card">
          <header className="a-card__head">
            <h2>Latest enquiries</h2>
            <button type="button" className="a-link" onClick={() => go('enquiries')}>View all</button>
          </header>
          {enquiries.length === 0 ? (
            <p className="a-muted">No enquiries yet.</p>
          ) : (
            <ul className="a-mini-list">
              {enquiries.slice(0, 6).map((e) => (
                <li key={e.id}>
                  <div>
                    <strong>{e.name}</strong>
                    <small>{e.service || 'General'} · {fmtDate(e.createdAt)}</small>
                  </div>
                  <StatusPill status={e.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="a-card">
          <header className="a-card__head">
            <h2>Launch offer</h2>
            <span className={`a-pill ${pct > 0 ? 'a-pill--done' : ''}`}>{pct > 0 ? 'Active' : 'Off'}</span>
          </header>
          <p className="a-big">{pct > 0 ? `${pct}% off` : 'No discount'}</p>
          <p className="a-muted">Shown in the hero, pricing cards and call-to-action banner. Set it to 0 to switch it off.</p>
          <button type="button" className="btn btn--outline btn--sm" onClick={() => go('company')}>Change offer</button>

          <hr className="a-hr" />
          <h3 className="a-h3">Quick edits</h3>
          <div className="a-quick">
            <button type="button" onClick={() => go('home')}>Home & About text</button>
            <button type="button" onClick={() => go('services')}>Services</button>
            <button type="button" onClick={() => go('projects')}>Projects</button>
            <button type="button" onClick={() => go('pricing')}>Pricing</button>
          </div>
        </section>
      </div>
    </>
  );
}
