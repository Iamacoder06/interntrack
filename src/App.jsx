import { useMemo, useState } from 'react'
import { useApplications } from './hooks_useApplications'
import './App.css'

const iconPaths = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  briefcase: <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.8 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.8-1l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.8-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.8 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></>,
  moon: <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>,
  arrow: <><path d="M7 17 17 7M7 7h10v10"/></>,
}
function Icon({ name, size = 18 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg> }
const statuses = ['Applied', 'Interview', 'Offer', 'Rejected']
const initialForm = { company: '', title: '', location: '', type: 'Internship', date: new Date().toISOString().slice(0, 10), status: 'Applied', url: '', interviewDate: '', notes: '' }
const initials = (name) => name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
const colors = ['blue', 'violet', 'orange', 'green', 'pink']

function App() {
  const [applications, setApplications] = useApplications()
  const [dark, setDark] = useState(() => localStorage.getItem('interntrack-theme') === 'dark')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')
  const [type, setType] = useState('All types')
  const [location, setLocation] = useState('All locations')
  const [sort, setSort] = useState('Newest first')
  const [modal, setModal] = useState(null)
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')
  const stats = statuses.map((name) => ({ name, count: applications.filter((app) => app.status === name).length }))
  const filtered = useMemo(() => applications.filter((app) => {
    const searchMatch = `${app.company} ${app.title} ${app.location}`.toLowerCase().includes(query.toLowerCase())
    return searchMatch && (status === 'All statuses' || app.status === status) && (type === 'All types' || app.type === type) && (location === 'All locations' || app.location === location)
  }).sort((a, b) => sort === 'Newest first' ? b.date.localeCompare(a.date) : sort === 'Oldest first' ? a.date.localeCompare(b.date) : sort === 'Company A–Z' ? a.company.localeCompare(b.company) : b.company.localeCompare(a.company)), [applications, query, status, type, location, sort])
  const locations = [...new Set(applications.map((app) => app.location).filter(Boolean))]
  const showNotice = (message) => { setNotice(message); window.setTimeout(() => setNotice(''), 2600) }
  function openCreate() { setForm(initialForm); setErrors({}); setModal({ kind: 'form' }) }
  function openEdit(app) { setForm({ ...initialForm, ...app }); setErrors({}); setModal({ kind: 'form', id: app.id }) }
  function save(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!form.company.trim()) nextErrors.company = 'Enter a company name.'
    if (!form.title.trim()) nextErrors.title = 'Enter a job title.'
    if (!form.date) nextErrors.date = 'Choose an application date.'
    if (!form.status) nextErrors.status = 'Choose a status.'
    if (form.url && !/^https?:\/\//i.test(form.url)) nextErrors.url = 'Use a full URL starting with https://.'
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return }
    if (modal.id) setApplications((items) => items.map((item) => item.id === modal.id ? { ...form, id: modal.id } : item))
    else setApplications((items) => [{ ...form, id: crypto.randomUUID() }, ...items])
    setModal(null); showNotice(modal.id ? 'Application updated' : 'Application added')
  }
  function remove(app) {
    if (window.confirm(`Delete the ${app.company} application? This can’t be undone.`)) {
      setApplications((items) => items.filter((item) => item.id !== app.id))
      setModal(null); showNotice('Application deleted')
    }
  }
  function toggleTheme() { const next = !dark; setDark(next); localStorage.setItem('interntrack-theme', next ? 'dark' : 'light') }
  function clearFilters() { setQuery(''); setStatus('All statuses'); setType('All types'); setLocation('All locations') }

  return <div className={dark ? 'app-shell dark' : 'app-shell'}>
    <aside className="sidebar">
      <a className="brand" href="#dashboard" onClick={() => setActiveNav('Dashboard')}><span className="brand-mark"><span/></span><span>intern<span className="brand-strong">track</span></span></a>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">
        {[['Dashboard', 'grid'], ['Applications', 'briefcase'], ['Settings', 'settings']].map(([name, icon]) => <button key={name} className={`nav-item ${activeNav === name ? 'selected' : ''}`} onClick={() => setActiveNav(name)}><Icon name={icon}/>{name}{name === 'Applications' && <span className="nav-count">{applications.length}</span>}</button>)}
      </nav>
      <div className="sidebar-bottom"><div className="upgrade-card"><div className="upgrade-orb">✦</div><strong>Your next step starts here.</strong><p>Keep every opportunity moving forward.</p><button onClick={openCreate}>Add application <Icon name="arrow" size={14}/></button></div><div className="profile"><div className="avatar">JD</div><div><strong>Jamie Davis</strong><span>Student workspace</span></div><button aria-label="Account options" className="more-button">···</button></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>{activeNav}</strong></div><div className="top-actions"><span className="today-label">Friday, October 10</span><button className="icon-button" onClick={toggleTheme} aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}><Icon name={dark ? 'sun' : 'moon'}/></button><div className="top-avatar">JD</div></div></header>
      {activeNav === 'Settings' ? <section className="settings-page"><div className="eyebrow">PREFERENCES</div><h1>Settings</h1><p className="page-subtitle">Make InternTrack feel like yours.</p><div className="settings-card"><div><strong>Appearance</strong><p>Choose the theme that works best for you.</p></div><button className="secondary-button" onClick={toggleTheme}><Icon name={dark ? 'sun' : 'moon'}/>{dark ? 'Light mode' : 'Dark mode'}</button></div><div className="settings-card"><div><strong>Demo applications</strong><p>Clear all applications from this browser.</p></div><button className="danger-button" onClick={() => { if (window.confirm('Delete all applications?')) { setApplications([]); showNotice('All applications deleted') } }}>Clear applications</button></div></section> : <>
        <section className="welcome-row"><div><div className="eyebrow">YOUR CAREER, IN MOTION <span>✦</span></div><h1>{activeNav === 'Applications' ? 'Applications' : 'Good morning, Jamie'}<span className="wave">{activeNav === 'Dashboard' ? '✳' : ''}</span></h1><p className="page-subtitle">{activeNav === 'Applications' ? 'Every opportunity, all in one place.' : 'Here’s what’s happening with your applications.'}</p></div><button className="primary-button" onClick={openCreate}><Icon name="plus"/> Add application</button></section>
        {activeNav === 'Dashboard' && <><section className="stat-grid" aria-label="Application statistics"><article className="stat-card total-stat"><div className="stat-top"><span>Total applications</span><span className="stat-icon"><Icon name="briefcase" size={16}/></span></div><div className="stat-number">{applications.length}</div><div className="stat-foot">Opportunities on your radar</div></article>{stats.map((item) => <article className="stat-card" key={item.name}><div className="stat-top"><span>{item.name}</span><span className={`status-dot ${item.name.toLowerCase()}`}/></div><div className="stat-number">{item.count.toString().padStart(2, '0')}</div><div className="stat-foot">{item.name === 'Interview' ? 'You’re making progress' : item.name === 'Offer' ? 'Time to celebrate' : item.name === 'Rejected' ? 'On to the next one' : 'Applications in progress'}</div></article>)}</section><section className="insight-banner"><div className="insight-icon">✦</div><div><strong>Small steps add up.</strong><span>You’ve got <b>{applications.filter((item) => item.status === 'Interview' || item.status === 'Offer').length} active opportunities</b> moving forward. Keep it up!</span></div><div className="banner-decoration">✳</div></section></>}
        <section className="applications-section"><div className="section-heading"><div><h2>{activeNav === 'Applications' ? 'All applications' : 'Recent applications'} <span className="result-count">{applications.length}</span></h2><p>A little progress every day goes a long way.</p></div><button className="text-button" onClick={() => setActiveNav('Applications')}>View all <Icon name="arrow" size={15}/></button></div>
          <div className="toolbar"><label className="search-box"><Icon name="search" size={17}/><input placeholder="Search company, role, location..." value={query} onChange={(event) => setQuery(event.target.value)}/><kbd>⌘ K</kbd></label><div className="filter-controls"><select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select><select aria-label="Filter by job type" value={type} onChange={(event) => setType(event.target.value)}><option>All types</option>{['Internship', 'Full-time', 'Part-time'].map((item) => <option key={item}>{item}</option>)}</select><select aria-label="Filter by location" value={location} onChange={(event) => setLocation(event.target.value)}><option>All locations</option>{locations.map((item) => <option key={item}>{item}</option>)}</select></div><select className="sort-select" aria-label="Sort applications" value={sort} onChange={(event) => setSort(event.target.value)}><option>Newest first</option><option>Oldest first</option><option>Company A–Z</option><option>Company Z–A</option></select></div>
          <div className="application-list">{filtered.length ? filtered.map((app, index) => <article className="application-row" key={app.id}><button className={`company-logo ${colors[index % colors.length]}`} onClick={() => setModal({ kind: 'details', app })} aria-label={`View ${app.company} details`}>{initials(app.company)}</button><button className="company-info" onClick={() => setModal({ kind: 'details', app })}><strong>{app.company}</strong><span>{app.title}</span></button><div className="location-cell"><span>{app.location || 'Location not set'}</span><small>{app.type || 'Type not set'}</small></div><div className="date-cell"><span>{new Date(`${app.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span><small>Applied</small></div><span className={`status-pill ${app.status.toLowerCase()}`}><i/>{app.status}</span><div className="row-actions"><button aria-label={`View ${app.company}`} onClick={() => setModal({ kind: 'details', app })}>View</button><button aria-label={`Edit ${app.company}`} onClick={() => openEdit(app)}>Edit</button><button aria-label={`Delete ${app.company}`} onClick={() => remove(app)}>···</button></div></article>) : <div className="empty-state"><div className="empty-icon">⌕</div><strong>{applications.length ? 'No applications match your current filters.' : 'Your next opportunity starts here.'}</strong><p>{applications.length ? 'Try adjusting your search or filters.' : 'Keep all your applications organized in one place.'}</p>{applications.length ? <button className="secondary-button" onClick={clearFilters}>Clear filters</button> : <button className="primary-button" onClick={openCreate}><Icon name="plus"/> Add your first application</button>}</div>}</div>
          {filtered.length > 0 && <div className="list-footer"><span>Showing <strong>{filtered.length}</strong> of <strong>{applications.length}</strong> applications</span><span>Made for the journey <b>✦</b></span></div>}
        </section>
      </>}
    </main>
    {notice && <div className="toast" role="status">✓ &nbsp;{notice}</div>}
    {modal && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null) }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">{modal.kind === 'form' ? <><div className="modal-heading"><div><div className="eyebrow">APPLICATION TRACKER</div><h2 id="modal-title">{modal.id ? 'Edit application' : 'Add an application'}</h2><p>Capture the details and keep your momentum going.</p></div><button className="close-button" onClick={() => setModal(null)} aria-label="Close">×</button></div><form onSubmit={save} noValidate><div className="form-grid"><Field label="Company name *" name="company" value={form.company} error={errors.company} onChange={setForm}/><Field label="Job title *" name="title" value={form.title} error={errors.title} onChange={setForm}/><Field label="Location" name="location" value={form.location} placeholder="e.g. New York, NY" onChange={setForm}/><label className="field"><span>Job type</span><select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>{['Internship', 'Full-time', 'Part-time'].map((item) => <option key={item}>{item}</option>)}</select></label><Field label="Application date *" name="date" type="date" value={form.date} error={errors.date} onChange={setForm}/><label className="field"><span>Status *</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label><Field label="Application URL" name="url" value={form.url} error={errors.url} placeholder="https://" onChange={setForm}/><Field label="Interview date" name="interviewDate" type="date" value={form.interviewDate} onChange={setForm}/><label className="field full-field"><span>Notes</span><textarea rows="3" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Anything you’d like to remember..."/></label></div><div className="modal-footer"><button type="button" className="secondary-button" onClick={() => setModal(null)}>Cancel</button><button type="submit" className="primary-button">{modal.id ? 'Save changes' : 'Add application'}</button></div></form></> : <><div className="modal-heading"><div><div className="eyebrow">APPLICATION DETAILS</div><h2 id="modal-title">{modal.app.company}</h2><p>{modal.app.title}</p></div><button className="close-button" onClick={() => setModal(null)} aria-label="Close">×</button></div><div className="detail-grid"><Detail label="Status"><span className={`status-pill ${modal.app.status.toLowerCase()}`}><i/>{modal.app.status}</span></Detail><Detail label="Job type">{modal.app.type || '—'}</Detail><Detail label="Location">{modal.app.location || '—'}</Detail><Detail label="Application date">{modal.app.date || '—'}</Detail><Detail label="Interview date">{modal.app.interviewDate || '—'}</Detail><Detail label="Application URL">{modal.app.url ? <a href={safeUrl(modal.app.url)} target="_blank" rel="noreferrer">Open application <Icon name="arrow" size={13}/></a> : '—'}</Detail><Detail label="Notes" wide>{modal.app.notes || 'No notes yet.'}</Detail></div><div className="modal-footer"><button className="danger-button" onClick={() => remove(modal.app)}>Delete</button><div><button className="secondary-button" onClick={() => setModal(null)}>Close</button><button className="primary-button" onClick={() => openEdit(modal.app)}>Edit application</button></div></div></>}</section></div>}
  </div>
}
function Field({ label, name, value, error, onChange, ...props }) { return <label className="field"><span>{label}</span><input {...props} value={value} onChange={(event) => onChange((current) => ({ ...current, [name]: event.target.value }))} aria-invalid={Boolean(error)}/>{error && <small className="field-error">{error}</small>}</label> }
function Detail({ label, children, wide }) { return <div className={`detail-item ${wide ? 'full-field' : ''}`}><span>{label}</span><strong>{children}</strong></div> }
function safeUrl(url) { try { const parsed = new URL(url); return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : undefined } catch { return undefined } }

export default App
