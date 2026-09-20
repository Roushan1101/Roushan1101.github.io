import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { profile } from '../data/profile'

export function CopyEmailButton({ className = '' }: { className?: string }) {
  const [status, setStatus] = useState<'ready' | 'copied' | 'error'>('ready')

  useEffect(() => {
    if (status !== 'copied') return
    const timeout = window.setTimeout(() => setStatus('ready'), 3500)
    return () => window.clearTimeout(timeout)
  }, [status])

  async function copy() {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard access is not available in this browser context.')
      await navigator.clipboard.writeText(profile.email)
      setStatus('copied')
    } catch (error) {
      console.error('Unable to copy the contact email:', error)
      setStatus('error')
    }
  }

  return (
    <span className="copy-email-control">
      <button className={`shared-button secondary ${className}`} onClick={copy}>
        {status === 'copied' ? <Check size={16} /> : <Copy size={16} />}
        {status === 'copied' ? 'Email copied' : 'Copy email'}
      </button>
      <span className="copy-status" role={status === 'error' ? 'alert' : 'status'}>
        {status === 'error' ? `Copy unavailable. Select the address instead: ${profile.email}` : status === 'copied' ? 'Copied to your clipboard.' : ''}
      </span>
    </span>
  )
}
