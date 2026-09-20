import { ArrowUpRight, Download, MapPin } from 'lucide-react'
import { certifications, education, metrics, profile, skillGroups } from '../data/profile'
import { CopyEmailButton } from './CopyEmailButton'
import { Dialog } from './Dialog'

export function RecruiterDialog({ onClose }: { onClose: () => void }) {
  return (
    <Dialog title="The 30-second introduction." eyebrow="FOR RECRUITERS & HIRING TEAMS" onClose={onClose}>
      <div className="recruiter-profile">
        <img src={profile.portrait} alt="Roushan Kumar" width="88" height="88" />
        <div><h3>{profile.name}</h3><p>{profile.role} / {profile.currentEmployer}</p><span><MapPin size={13} />{profile.location}</span></div>
      </div>
      <p className="dialog-intro">{profile.summary}</p>
      <div className="recruiter-stats">{metrics.map((metric) => <div key={metric.value}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>
      <section className="case-section"><h3>Where I can make a difference</h3><p>Lead and senior data engineering, cloud data platforms, analytics engineering, and applied AI systems.</p></section>
      <div className="shared-tags">{skillGroups.flatMap((group) => group.skills.slice(0, 3)).map((skill) => <span key={skill}>{skill}</span>)}</div>
      <section className="case-section"><h3>Learning, backed up.</h3><p>{education.degree} / {education.institution}</p><ul>{certifications.map((certificate) => <li key={certificate.name}>{certificate.name} - {certificate.detail}</li>)}</ul></section>
      <div className="dialog-actions">
        <a className="shared-button primary" href={profile.resumeUrl} download><Download size={17} />Download résumé</a>
        <a className="shared-button secondary" href={profile.linkedIn} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={16} /></a>
        <CopyEmailButton />
      </div>
      <p className="case-disclosure">Figures and roles are from the supplied résumé, updated {profile.sourceDate}. Client work was delivered through the employers named in each case study.</p>
    </Dialog>
  )
}
