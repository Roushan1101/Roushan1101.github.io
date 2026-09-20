import { useState, type FormEvent } from 'react'
import { ArrowUpRight, Mail } from 'lucide-react'
import { profile } from '../data/profile'
import { buildMailto } from '../lib/urls'
import { CopyEmailButton } from './CopyEmailButton'
import { Dialog } from './Dialog'

export function ContactDialog({ onClose }: { onClose: () => void }) {
  const [draftUrl, setDraftUrl] = useState('')

  function validateRequiredText(event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const field = event.currentTarget
    const minimum = Math.max(field.minLength, 1)
    field.setCustomValidity(field.value.trim().length < minimum
      ? field.name === 'name'
        ? 'Please enter your name, not just spaces.'
        : 'Please write a message of at least 10 characters, not just spaces.'
      : '')
  }

  function prepareDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setDraftUrl(
      buildMailto(profile.email, {
        name: String(data.get('name') ?? ''),
        email: String(data.get('email') ?? ''),
        company: String(data.get('company') ?? ''),
        message: String(data.get('message') ?? ''),
      }),
    )
  }

  return (
    <Dialog title="Good things start with a hello." eyebrow="LET'S BUILD SOMETHING MEANINGFUL" onClose={onClose} className="contact-dialog">
      <p className="dialog-intro">A role, an idea, or a particularly interesting data problem. I'd love to hear about it.</p>
      <div className="contact-direct">
        <a href={`mailto:${profile.email}`}><Mail size={18} />{profile.email}<ArrowUpRight size={16} /></a>
        <CopyEmailButton />
      </div>
      <form className="contact-form" onSubmit={prepareDraft} onChange={() => setDraftUrl('')}>
        <div className="form-row">
          <label>Your name<input name="name" autoComplete="name" required maxLength={100} onInput={validateRequiredText} placeholder="Alex Morgan" /></label>
          <label>Your email<input name="email" type="email" autoComplete="email" required maxLength={160} placeholder="alex@company.com" /></label>
        </div>
        <label>Company <span className="optional">(optional)</span><input name="company" autoComplete="organization" maxLength={120} placeholder="Where you're building" /></label>
        <label>What's on your mind?<textarea name="message" rows={4} required minLength={10} maxLength={1200} onInput={validateRequiredText} placeholder="Tell me a little about the role or project..." /></label>
        <p className="form-note">No inbox in the middle. Prepare a draft, then open your email app to review and send it. Nothing is sent or stored by this website.</p>
        <button className="shared-button primary" type="submit">Prepare email <ArrowUpRight size={17} /></button>
        {draftUrl && (
          <div className="email-draft" role="status">
            <strong>Your draft is ready. It has not been sent.</strong>
            <a className="shared-button primary" href={draftUrl}>Open email draft <Mail size={17} /></a>
            <p>If no email app opens, email <a href={`mailto:${profile.email}`}>{profile.email}</a> directly.</p>
          </div>
        )}
      </form>
    </Dialog>
  )
}
