import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildMailto, siteUrl } from './urls'
import { experiences, profile, projects } from '../data/profile'

describe('portfolio links', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('builds same-origin asset and experience URLs', () => {
    expect(siteUrl('studio/')).toBe('/studio/')
    expect(siteUrl('/play/')).toBe('/play/')
    expect(profile.resumeUrl).toBe('/resume/Roushan-Kumar-Resume.pdf')
  })

  it('keeps all three websites and assets inside a configured hosting subdirectory', () => {
    vi.stubEnv('BASE_URL', '/my-portal/')
    expect(siteUrl()).toBe('/my-portal/')
    expect(siteUrl('studio/')).toBe('/my-portal/studio/')
    expect(siteUrl('/play/')).toBe('/my-portal/play/')
    expect(siteUrl('resume/Roushan-Kumar-Resume.pdf')).toBe('/my-portal/resume/Roushan-Kumar-Resume.pdf')
  })

  it('encodes contact details without injecting mailto parameters', () => {
    const url = buildMailto('rkkr901@gmail.com', {
      name: 'Sam & Team',
      email: 'sam@example.com',
      company: 'Data? & Co',
      message: 'A role with SQL & AI.\nLet us connect!',
    })
    const params = new URLSearchParams(url.split('?')[1])
    expect(params.get('subject')).toBe("Let's connect - Data? & Co")
    expect(params.get('body')).toContain('From: Sam & Team')
    expect(params.get('body')).toContain('A role with SQL & AI.\nLet us connect!')
    expect([...params.keys()]).toEqual(['subject', 'body'])
  })

  it('uses the contact name when a company is not provided', () => {
    const url = buildMailto('rkkr901@gmail.com', {
      name: '  Alex  ',
      email: 'alex@example.com',
      company: ' ',
      message: 'Hello there',
    })
    const params = new URLSearchParams(url.split('?')[1])
    expect(params.get('subject')).toBe("Let's connect - Alex")
    expect(params.get('body')).not.toContain('Company:')
  })
})

describe('verified portfolio content', () => {
  it('has unique projects, experience records, and a current role', () => {
    expect(new Set(projects.map((project) => project.id)).size).toBe(projects.length)
    expect(new Set(experiences.map((experience) => experience.id)).size).toBe(experiences.length)
    expect(experiences.filter((experience) => experience.end === null)).toHaveLength(1)
    expect(experiences[0].role).toBe(profile.role)
  })

  it('gives every project a substantive case study', () => {
    for (const project of projects) {
      expect(project.challenge.length).toBeGreaterThan(40)
      expect(project.approach.length).toBeGreaterThanOrEqual(3)
      expect(project.outcomes.length).toBeGreaterThan(0)
      expect(project.stack.length).toBeGreaterThan(2)
    }
  })
})
