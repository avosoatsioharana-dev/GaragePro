import { useEffect, useMemo, useState } from 'react'
import { Activity, CalendarDays, CarFront,
         ClipboardList, Gauge, Users, Wrench,
         Package, ReceiptText, CreditCard,
         Search, RefreshCw, Plus, Pencil,
         Trash2, X, Save, Menu,
         LayoutDashboard, CircleAlert, CheckCircle2 } from 'lucide-react'

const API = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')
const resources = [
  { key: 'clients', label: 'Clients', icon: Users, fields: [
            ['nom','Nom','text',true],
            ['prenom','Prénom','text',true],
            ['telephone','Téléphone','tel',true],
            ['email','Email','email',false],
            ['adresse','Adresse','textarea',false],
            ['date_inscription','Date d’inscription','date',true]
          ] },
  { key: 'vehicules', label: 'Véhicules', icon: CarFront, fields: [
            ['immatriculation','Immatriculation','text',true],
            ['numero_chassis','Numéro de châssis','text',false],
            ['annee_fabrication','Année de fabrication','number',false],
            ['couleur','Couleur','text',false],
            ['carburant','Carburant','text',false],
            ['kilometrage','Kilométrage','number',true],
            ['client','Client','relation:clients',true],
            ['modele','Modèle','relation:modeles',true]
          ] },
  { key: 'rendez-vous', label: 'Rendez-vous', icon: CalendarDays, fields: [
            ['date_heure','Date et heure','datetime-local',true],
            ['motif','Motif','textarea',false],
            ['statut','Statut','text',true],
            ['client','Client','relation:clients',true],
            ['vehicule','Véhicule','relation:vehicules',true]
          ] },
  { key: 'interventions', label: 'Interventions', icon: Wrench, fields: [
            ['date_debut','Début','datetime-local',true],
            ['date_fin','Fin','datetime-local',false],
            ['description','Description','textarea',false],
            ['diagnostic','Diagnostic','textarea',false],
            ['cout_main_oeuvre','Coût main-d’œuvre','number',true],
            ['statut','Statut','text',true],
            ['rendez_vous','Rendez-vous','relation:rendez-vous',false],
            ['employe','Employé','relation:employes',true],
            ['type_intervention','Type d’intervention','relation:types-intervention',true],
            ['vehicule','Véhicule','relation:vehicules',true]
          ] },
  { key: 'pieces', label: 'Pièces détachées', icon: Package, fields: [
            ['reference','Référence','text',true],
            ['nom_piece','Nom de la pièce','text',true],
            ['description','Description','textarea',false],
            ['prix_achat','Prix d’achat','number',true],
            ['prix_vente','Prix de vente','number',true],
            ['quantite_stock','Quantité en stock','number',true],
            ['seuil_alerte','Seuil d’alerte','number',true]
          ] },
  { key: 'factures', label: 'Factures', icon: ReceiptText, fields: [
            ['numero_facture','N° facture','text',true],
            ['date_facture','Date de facture','date',true],
            ['date_echeance','Date d’échéance','date',false],
            ['montant_ht','Montant HT','number',true],
            ['taux_tva','TVA (%)','number',true],
            ['montant_tva','Montant TVA','number',true],
            ['montant_ttc','Montant TTC','number',true],
            ['statut','Statut','text',true],
            ['intervention','Intervention','relation:interventions',true]
          ] },
  { key: 'paiements', label: 'Paiements', icon: CreditCard, fields: [
            ['date_paiement','Date du paiement','datetime-local',true],
            ['montant','Montant','number',true],
            ['mode_paiement','Mode de paiement','text',true],
            ['reference_paiement','Référence','text',false],
            ['statut','Statut','text',true],
            ['facture','Facture','relation:factures',true]
          ] },
  { key: 'employes', label: 'Employés', icon: Users, fields: [
            ['nom','Nom','text',true],
            ['prenom','Prénom','text',true],
            ['telephone','Téléphone','tel',false],
            ['email','Email','email',true],
            ['date_embauche','Date d’embauche','date',true],
            ['salaire','Salaire','number',true],
            ['poste','Poste','relation:postes',true]
          ] },
  { key: 'marques', label: 'Marques', icon: CarFront, fields: [
            ['nom_marque','Nom de la marque','text',true],
            ['pays_origine','Pays d’origine','text',false]
          ] },
  { key: 'modeles', label: 'Modèles', icon: CarFront, fields: [
            ['nom_modele','Nom du modèle','text',true],
            ['annee_debut','Année de début','number',false],
            ['annee_fin','Année de fin','number',false],
            ['marque','Marque','relation:marques',true]
          ] },
  { key: 'postes', label: 'Postes', icon: ClipboardList, fields: [
            ['intitule','Intitulé','text',true],
            ['description','Description','textarea',false]
          ] },
  { key: 'types-intervention', label: 'Types d’intervention', icon: Wrench, fields: [
            ['libelle','Libellé','text',true],
            ['description','Description','textarea',false],
            ['tarif_standard','Tarif standard','number',true]
          ] },
  { key: 'intervention-pieces', label: 'Pièces utilisées', icon: Package, fields: [
            ['intervention','Intervention','relation:interventions',true],
            ['piece','Pièce','relation:pieces',true],
            ['quantite','Quantité','number',true],
            ['prix_unitaire','Prix unitaire','number',true]
          ] },
  { key: 'mouvements-stock', label: 'Mouvements de stock', icon: Activity, fields: [
            ['type_mouvement','Type de mouvement','text',true],
            ['quantite','Quantité','number',true],
            ['motif','Motif','text',false],
            ['piece','Pièce','relation:pieces',true],
            ['employe','Employé','relation:employes',true]
          ] },
  { key: 'lignes-facture', label: 'Lignes de facture', icon: ReceiptText, fields: [
            ['designation','Désignation','text',true],
            ['quantite','Quantité','number',true],
            ['prix_unitaire','Prix unitaire','number',true],
            ['montant_ligne','Montant de la ligne','number',true],
            ['facture','Facture','relation:factures',true]
          ] },
]
const labels = { 
    id:'ID',
    nom:'Nom', 
    prenom:'Prénom', 
    telephone:'Téléphone', 
    email:'Email', 
    adresse:'Adresse', 
    date_inscription:'Date d’inscription', 
    immatriculation:'Immatriculation', 
    numero_chassis:'N° châssis', 
    annee_fabrication:'Année', 
    couleur:'Couleur', 
    carburant:'Carburant', 
    kilometrage:'Kilométrage', 
    client:'Client', 
    modele:'Modèle', 
    nom_marque:'Marque', 
    nom_modele:'Modèle', 
    date_heure:'Date et heure', 
    statut:'Statut', 
    motif:'Motif', 
    date_debut:'Début', 
    date_fin:'Fin', 
    description:'Description', 
    diagnostic:'Diagnostic', 
    cout_main_oeuvre:'Main-d’œuvre', 
    reference:'Référence', 
    nom_piece:'Pièce', 
    prix_achat:'Prix achat', 
    prix_vente:'Prix vente', 
    quantite_stock:'Stock', 
    seuil_alerte:'Seuil alerte', 
    numero_facture:'N° facture', 
    date_facture:'Date facture', 
    montant_ht:'Montant HT', 
    montant_tva:'Montant TVA', 
    montant_ttc:'Montant TTC', 
    montant:'Montant', 
    mode_paiement:'Mode paiement', 
    date_paiement:'Date paiement', 
    date_embauche:'Embauche', 
    salaire:'Salaire', 
    intitule:'Intitulé', 
    libelle:'Libellé', 
    tarif_standard:'Tarif standard', 
    type_mouvement:'Type mouvement', 
    quantite:'Quantité', 
    designation:'Désignation', 
    montant_ligne:'Total ligne', 
    taux_tva:'TVA', 
    date_echeance:'Échéance', 
    reference_paiement:'Référence paiement', 
    pays_origine:'Pays', 
    annee_debut:'Année début', 
    annee_fin:'Année fin', 
    poste:'Poste', 
    facture:'Facture', 
    intervention:'Intervention', 
    rendez_vous:'Rendez-vous', 
    type_intervention:'Type intervention', 
    employe:'Employé', 
    piece:'Pièce', 
    prix_unitaire:'Prix unitaire'
  }
const labelFor = key => labels[key] || key.replaceAll('_',' ').replace(/^./, x => x.toUpperCase())
const display = value => value === null || value === undefined || value === '' ? '—' : typeof value === 'object' ? JSON.stringify(value) : String(value)
const emptyFor = resource => Object.fromEntries(
      resource.fields.map(
        ([key,,type]) => [key, type === 'number' ? '0' : '']
      )
    )

export default function App() {
  const [active, setActive] = useState('clients')
  const [rows, setRows] = useState([])
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [options, setOptions] = useState({})
  const [mobileNav, setMobileNav] = useState(false)
  const current = resources.find(r => r.key === active) || resources[0]
  const Icon = current.icon

  async function fetchResource(key) {
    const response = await fetch(`${API}/${key}/`)
    if (!response.ok) throw new Error(`Erreur API ${response.status} sur /${key}/`)
    const data = await response.json()
    return Array.isArray(data) ? data : (data.results || [])
  }
  async function load() {
    setLoading(true); setError('')
    try { 
      setRows(await fetchResource(active)) 
    }
    catch (e) { 
      setRows([]); 
      setError(`Impossible de charger les données. Vérifie Django, l’URL de l’API et la connexion MySQL. (${e.message})`) 
    }
    finally { setLoading(false) }
  }
  async function loadCounts() {
    const results = await Promise.all(resources.map(async r => {
       try {
         return [r.key, (await fetchResource(r.key)).length] 
        } catch { 
          return [r.key, 0] 
        } 
      }))
    setCounts(Object.fromEntries(results))
  }
  useEffect(() => { loadCounts() }, [])
  useEffect(() => { load(); setQuery('') }, [active])
  const filtered = useMemo(() => rows.filter(
      row => JSON.stringify(row).toLowerCase().includes(query.toLowerCase())
    ), [rows, query])
  const columns = filtered.length ? Object.keys(filtered[0]).filter(k => k !== 'url').slice(0, 7) : []

  async function openCreate() {
    setEditing(null);
    setFormData(emptyFor(current)); 
    setFormError(''); 
    setNotice(''); 
    setShowForm(true)
    await loadOptions(current)
  }
  async function openEdit(row) {
    setEditing(row.id); setFormData(Object.fromEntries(current.fields.map(([key,,type]) => {
      let value = row[key] ?? ''
      if (type === 'datetime-local' && value) value = String(value).slice(0,16)
      if (type.startsWith('relation:') && value && typeof value === 'object') value = value.id ?? ''
      return [key, value]
    }))); setFormError(''); setNotice(''); setShowForm(true)
    await loadOptions(current)
  }
  async function loadOptions(resource) {
    const relations = resource.fields.filter(
      ([, , type]) => type.startsWith('relation:')).map(([, , type]) => type.split(':')[1]
    )
    const unique = [...new Set(relations)]
    const results = await Promise.all(unique.map(async key => { 
      try { 
        return [key, await fetchResource(key)] 
      } catch { 
        return [key, []] 
      } 
    }))
    setOptions(prev => ({...prev, ...Object.fromEntries(results)}))
  }
  async function save(e) {
    e.preventDefault(); setSaving(true); setFormError(''); setNotice('')
    const url = editing ? `${API}/${active}/${editing}/` : `${API}/${active}/`
    const body = {}
    for (const [key,,type] of current.fields) {
      let value = formData[key]
      if (value === '' && ['email'].includes(key)) value = null
      if (value === '' && (type.startsWith('relation:') || type === 'date' || type === 'datetime-local')) value = null
      if (type === 'number' && value !== '' && value !== null) value = Number(value)
      if (type === 'datetime-local' && value) value = new Date(value).toISOString()
      body[key] = value
    }
    try {
      const response = await fetch(url, { 
        method: editing ? 'PATCH' : 'POST', 
        headers: {'Content-Type':'application/json'}, 
        body: JSON.stringify(body) 
      })
      const data = response.status === 204 ? {} : await response.json().catch(() => ({}))
      if (!response.ok) {
        const details = Object.entries(data).map(([key,val]) => `${labelFor(key)} : ${Array.isArray(val) ? val.join(', ') : typeof val === 'object' ? JSON.stringify(val) : val}`).join(' · ')
        throw new Error(details || `Enregistrement refusé (HTTP ${response.status}).`)
      }
      setShowForm(false); 
      setNotice(editing ? 'Modification enregistrée.' : 'Enregistrement ajouté.'); 
      await load(); 
      await loadCounts()
    } catch (e) { setFormError(e.message || 'Une erreur est survenue.') }
    finally { setSaving(false) }
  }
  async function remove(row) {
    if (!window.confirm(`Supprimer cet enregistrement${row.nom ? ` (${row.prenom || ''} ${row.nom})` : ` #${row.id}`} ?`)) 
      return
    setNotice('')
    try {
      const response = await fetch(`${API}/${active}/${row.id}/`, {method:'DELETE'})
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.detail || Object.values(data).flat().join(' ') || 'Suppression refusée. Vérifie les enregistrements liés.')
      }
      setNotice('Enregistrement supprimé.'); 
      await load(); 
      await loadCounts()
    } catch (e) { 
      setError(e.message || 'Impossible de supprimer cet enregistrement.') 
    }
  }
  const metrics = [
      {key:'clients',label:'Clients',icon:Users},
      {key:'vehicules',label:'Véhicules',icon:CarFront},
      {key:'rendez-vous',label:'Rendez-vous',icon:CalendarDays},
      {key:'interventions',label:'Interventions',icon:Wrench}
    ]

  return <div className="layout">
    {mobileNav && <button className="sidebar-backdrop" aria-label="Fermer le menu" onClick={() => setMobileNav(false)} />}
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <a className="brand" href="#dashboard" onClick={e => {e.preventDefault(); setActive('clients'); setMobileNav(false)}}><span className="brand-mark"><Wrench size={22}/></span><span><strong>Garage<span className="brand-accent">Pro</span></strong><small>GESTION AUTOMOBILE</small></span></a>
      <p className="nav-caption">ESPACE DE TRAVAIL</p>
      <button className={`nav-link ${active === 'clients' ? 'active' : ''}`} onClick={() => {setActive('clients');setMobileNav(false)}}><LayoutDashboard size={18}/> Tableau de bord</button>
      <p className="nav-caption">GESTION</p>
      <nav className="nav">{resources.map(r => { const I = r.icon; return <button key={r.key} className={`nav-link ${active === r.key ? 'active' : ''}`} onClick={() => {setActive(r.key);setMobileNav(false)}}><I size={17}/><span>{r.label}</span><small>{counts[r.key] ?? '—'}</small></button> })}</nav>
      <div className="sidebar-foot"><span className="online-dot"/><span><strong>GaragePro</strong><small>Gestion du garage</small></span></div>
    </aside>
    <main className="main">
      <header className="topbar"><button className="menu-toggle" aria-label="Ouvrir le menu" onClick={() => setMobileNav(true)}><Menu size={21}/></button><div className="topbar-title"><h1>{active === 'clients' ? 'Tableau de bord' : current.label}</h1></div><div className="topbar-actions"><button className="btn btn-ghost" onClick={() => {load();loadCounts()}}><RefreshCw size={16}/> Actualiser</button><button className="btn btn-primary" onClick={openCreate}><Plus size={17}/> Ajouter</button></div></header>
      <div className="content">
        {active === 'clients' && <section className="stats" aria-label="Statistiques">{metrics.map(m => {const I=m.icon;return <button className="stat-card" key={m.key} onClick={() => setActive(m.key)}><span className="stat-label">{m.label}<I size={19}/></span><strong className="stat-value">{counts[m.key] ?? '—'}</strong><span className="stat-hint"><span className="online-dot"/> Données enregistrées</span></button>})}</section>}
        {notice && <div className="alert alert-success"><CheckCircle2 size={18}/><span>{notice}</span><button className="alert-close" onClick={() => setNotice('')}><X size={16}/></button></div>}
        {error && <div className="alert alert-error"><CircleAlert size={18}/><span>{error}</span><button className="alert-close" onClick={() => setError('')}><X size={16}/></button></div>}
        <section className="panel"><div className="panel-head"><div className="section-heading"><span className="section-icon"><Icon size={20}/></span><div><h2>{active === 'clients' ? 'Liste des clients' : `Liste — ${current.label}`}</h2></div></div><div className="panel-tools"><label className="search"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher…" aria-label="Rechercher"/></label><button className="icon-btn" onClick={load} title="Actualiser"><RefreshCw size={16}/></button></div></div>
          {loading ? <div className="empty"><RefreshCw className="spin"/><span>Chargement des données…</span></div> : filtered.length === 0 ? <div className="empty"><span className="empty-icon"><ClipboardList size={28}/></span><strong>{error ? 'Connexion à vérifier' : 'Aucun enregistrement'}</strong><span>{error ? 'Démarre le backend Django et vérifie sa configuration.' : 'Cette ressource ne contient pas encore de données.'}</span><button className="btn btn-primary" onClick={openCreate}><Plus size={16}/> Ajouter un enregistrement</button></div> : <div className="table-wrap"><table className="table"><thead><tr>{columns.map(c => <th key={c}>{labelFor(c)}</th>)}<th className="actions-col">Actions</th></tr></thead><tbody>{filtered.map((row,i) => <tr key={row.id ?? i}>{columns.map(c => <td key={c}>{display(row[c])}</td>)}<td><div className="row-actions"><button className="btn-icon edit" title="Modifier" onClick={() => openEdit(row)}><Pencil size={16}/></button><button className="btn-icon delete" title="Supprimer" onClick={() => remove(row)}><Trash2 size={16}/></button></div></td></tr>)}</tbody></table></div>}
          <div className="panel-foot"><span>{filtered.length} enregistrement(s)</span></div>
        </section>
      </div>
      
    </main>
    {showForm && <div className="modal-overlay" onMouseDown={e => {if(e.target === e.currentTarget && !saving) setShowForm(false)}}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-head"><div><span className="eyebrow">{current.label.toUpperCase()}</span><h2 id="modal-title">{editing ? 'Modifier' : 'Nouvel enregistrement'}</h2></div><button className="icon-btn close-modal" onClick={() => !saving && setShowForm(false)} aria-label="Fermer"><X size={21}/></button></div>
      <form onSubmit={save}><div className="form-grid">{current.fields.map(([key,label,type,required]) => {const isRelation=type.startsWith('relation:'); const choices=isRelation ? (options[type.split(':')[1]] || []) : [];return <label key={key} className={type === 'textarea' ? 'field-wide' : ''}>{label}{required ? ' ' : ''}{isRelation ? <select required={required} value={formData[key] ?? ''} onChange={e => setFormData({...formData,[key]:e.target.value})}><option value="">— Sélectionner —</option>{choices.map(item => <option key={item.id} value={item.id}>{item.id} — {item.nom ? `${item.prenom || ''} ${item.nom}` : item.nom_marque || item.nom_modele || item.immatriculation || item.numero_facture || item.reference || item.intitule || item.libelle || item.designation || item.date_heure || item.date_debut || item.email || `Enregistrement ${item.id}`}</option>)}</select> : type === 'textarea' ? <textarea rows="3" value={formData[key] ?? ''} required={required} onChange={e => setFormData({...formData,[key]:e.target.value})}/> : <input type={type} step={type === 'number' ? '0.01' : undefined} min={type === 'number' ? '0' : undefined} required={required} value={formData[key] ?? ''} onChange={e => setFormData({...formData,[key]:e.target.value})}/>}</label>})}</div>
        {formError && <div className="alert alert-error form-error"><CircleAlert size={18}/><span>{formError}</span></div>}<div className="modal-actions"><button type="button" className="btn btn-ghost" disabled={saving} onClick={() => setShowForm(false)}>Annuler</button><button type="submit" className="btn btn-primary" disabled={saving}><Save size={16}/>{saving ? 'Enregistrement…' : editing ? 'Enregistrer les modifications' : 'Créer'}</button></div></form></section></div>}
  </div>
}
