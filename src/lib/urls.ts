export function siteUrl(path = ''): string {
  const base = import.meta.env.BASE_URL || '/'
  return `${base.replace(/\/?$/, '/')}${path.replace(/^\/+/, '')}`
}

export interface ContactDraft {
  name: string
  email: string
  company: string
  message: string
}

export function buildMailto(recipient: string, draft: ContactDraft): string {
  const subject = `Let's connect - ${draft.company.trim() || draft.name.trim()}`
  const body = [
    'Hi Roushan,',
    '',
    draft.message.trim(),
    '',
    `From: ${draft.name.trim()}`,
    `Email: ${draft.email.trim()}`,
    ...(draft.company.trim() ? [`Company: ${draft.company.trim()}`] : []),
  ].join('\n')

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
