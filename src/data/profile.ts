import { siteUrl } from '../lib/urls'

export const profile = {
  name: 'Roushan Kumar',
  firstName: 'Roushan',
  role: 'Lead Data Engineer',
  location: 'Hyderabad, India',
  email: 'rkkr901@gmail.com',
  phone: '+91 7765883382',
  phoneHref: 'tel:+917765883382',
  linkedIn: 'https://www.linkedin.com/in/roushan-kumar-2453b0182/',
  resumeUrl: siteUrl('resume/Roushan-Kumar-Resume.pdf'),
  portrait: siteUrl('assets/roushan.webp'),
  casualPortrait: siteUrl('assets/roushan-outdoors.webp'),
  summary:
    'I turn complex data into clear possibilities. From enterprise-scale pipelines to intelligent agents, I build reliable systems that help people make better decisions.',
  about:
    'A data engineer with a software engineering foundation, working at the intersection of cloud, analytics, and applied AI. My work spans healthcare billing, telecom data platforms, and business intelligence for Microsoft client environments. I care about thoughtful architecture, traceable data, and making complex things useful.',
  availability: 'Open to the right opportunity',
  currentEmployer: 'Insight Global',
  currentClient: 'CCC',
  sourceDate: '20 September 2026',
}

export interface Experience {
  id: string
  role: string
  company: string
  client?: string
  period: string
  start: string
  end: string | null
  location: string
  summary: string
  highlights: string[]
  tags: string[]
}

export const experiences: Experience[] = [
  {
    id: 'ccc',
    role: 'Lead Data Engineer',
    company: 'Insight Global',
    client: 'CCC',
    period: 'Mar 2026 - Present',
    start: '2026-03',
    end: null,
    location: 'Hyderabad / Hybrid',
    summary: 'Building the foundations for enterprise Data & AI in healthcare billing.',
    highlights: [
      'Leading canonical data modeling, AI-ready pipelines, and cloud-native analytics initiatives.',
      'Building healthcare billing models from the ground up, with end-to-end traceability, reconciliation, and certification.',
      'Supporting engineering hiring and onboarding across the organization.',
    ],
    tags: ['Data modeling', 'Healthcare', 'AI-ready pipelines', 'Technical leadership'],
  },
  {
    id: 'tmobile',
    role: 'Senior Data Engineer',
    company: 'Insight Global',
    client: 'T-Mobile',
    period: 'Apr 2024 - Feb 2026',
    start: '2024-04',
    end: '2026-02',
    location: 'Hyderabad, India',
    summary: 'Connecting large-scale telecom data with cloud analytics and agentic AI.',
    highlights: [
      'Owned Snowflake pipelines across data layering, orchestration, and analytics using Azure services.',
      'Automated SQL and storage object cleanup, cutting operational time by 50%.',
      'Built multimodal recommendation tools using multiple LLMs and MCP servers for database connectivity.',
      'Integrated LangChain and LangSmith for workflow orchestration and tracing.',
    ],
    tags: ['Snowflake', 'Azure', 'MCP', 'LangChain', 'Agentic AI'],
  },
  {
    id: 'microsoft',
    role: 'Software Engineer 2',
    company: 'MAQ Software',
    client: 'Microsoft',
    period: 'Aug 2023 - Mar 2024',
    start: '2023-08',
    end: '2024-03',
    location: 'Hyderabad, India',
    summary: 'Making enterprise business intelligence faster, clearer, and more useful.',
    highlights: [
      'Designed modern BI and Dataverse architectures, improving data processing efficiency by 30%.',
      'Optimized tabular datasets of up to 200 million rows and reduced update time by 40%.',
      'Delivered more than 50 ad-hoc data manipulation tasks per month for business stakeholders.',
    ],
    tags: ['Power BI', 'Dataverse', 'Data modeling', 'Automation'],
  },
  {
    id: 'maq',
    role: 'Software Engineer 1',
    company: 'MAQ Software',
    period: 'Sep 2021 - Jul 2023',
    start: '2021-09',
    end: '2023-07',
    location: 'Hyderabad, India',
    summary: 'Turning diverse data sources into dependable analytics for Microsoft clients.',
    highlights: [
      'Built Power BI business analytics models with a 30% efficiency improvement.',
      'Designed Power Automate flows that reduced data processing time by 25%.',
      'Integrated data sources through ETL and ELT pipelines, improving data accessibility by 40%.',
    ],
    tags: ['Power BI', 'Power Automate', 'ETL / ELT', 'SQL'],
  },
]

export type ProjectCategory = 'Data engineering' | 'Applied AI' | 'Analytics'
export type ArtworkKind = 'pipeline' | 'network' | 'analytics' | 'warehouse'

export interface Project {
  id: string
  number: string
  title: string
  subtitle: string
  category: ProjectCategory
  client: string
  company: string
  period: string
  summary: string
  challenge: string
  approach: string[]
  outcomes: string[]
  stack: string[]
  metric: { value: string; label: string }
  kind: ArtworkKind
}

export const projects: Project[] = [
  {
    id: 'healthcare',
    number: '01',
    title: 'Healthcare, connected.',
    subtitle: 'A foundation built for trust.',
    category: 'Data engineering',
    client: 'CCC',
    company: 'Insight Global',
    period: '2026 - Present',
    summary:
      'Canonical data models and AI-ready pipelines that bring structure, traceability, and confidence to healthcare billing.',
    challenge:
      'Build a healthcare billing data modeling system from the ground up, with a clear path from source data to reconciliation and certification.',
    approach: [
      'Establish canonical data models for a consistent enterprise view.',
      'Design cloud-native, AI-ready pipelines across billing workflows.',
      'Make end-to-end traceability, reconciliation, and certification part of the foundation.',
    ],
    outcomes: [
      'A traceable foundation for healthcare billing data.',
      'An ongoing enterprise Data & AI initiative, led in the current role.',
    ],
    stack: ['Canonical modeling', 'Data pipelines', 'Cloud architecture', 'Data governance'],
    metric: { value: 'End-to-end', label: 'billing traceability' },
    kind: 'pipeline',
  },
  {
    id: 'telecom',
    number: '02',
    title: 'Data at telecom scale.',
    subtitle: 'Less friction. More signal.',
    category: 'Data engineering',
    client: 'T-Mobile',
    company: 'Insight Global',
    period: '2024 - 2026',
    summary:
      'Snowflake and Azure pipelines for cellular and broadband data, with automated object optimization and proactive monitoring.',
    challenge:
      'Manage massive telecom datasets from ingestion through analytics while reducing the effort spent maintaining SQL and storage objects.',
    approach: [
      'Connect data layering, orchestration, and analytics through end-to-end pipelines.',
      'Transform Azure Log Analytics data into actionable monitoring and reports.',
      'Automate identification and cleanup of unused SQL and storage objects.',
    ],
    outcomes: [
      '50% less operational time through object-usage optimization.',
      'Monitoring and reporting that support proactive decisions.',
    ],
    stack: ['Snowflake', 'Azure', 'SQL', 'Azure Log Analytics'],
    metric: { value: '50%', label: 'less operational time' },
    kind: 'warehouse',
  },
  {
    id: 'agents',
    number: '03',
    title: 'Agents that connect.',
    subtitle: 'Intelligence, in conversation.',
    category: 'Applied AI',
    client: 'T-Mobile',
    company: 'Insight Global',
    period: '2024 - 2026',
    summary:
      'Multimodal recommendations and MCP-connected workflows that bring language models closer to real-world data.',
    challenge:
      'Connect multiple language models, external databases, and workflow orchestration in an interactive recommendation system.',
    approach: [
      'Build a multimodal agentic recommendation tool using more than one LLM.',
      'Develop MCP servers to enable communication with external database servers.',
      'Use LangChain and LangSmith for orchestration, tracing, and workflow transparency.',
    ],
    outcomes: [
      'An interactive, multimodal recommendation workflow.',
      'Connected database tools with end-to-end workflow tracing.',
    ],
    stack: ['MCP', 'LLMs', 'LangChain', 'LangSmith', 'Python'],
    metric: { value: 'Multi-LLM', label: 'agentic intelligence' },
    kind: 'network',
  },
  {
    id: 'business-intelligence',
    number: '04',
    title: 'Big data. Clear decisions.',
    subtitle: '200 million rows. One clear view.',
    category: 'Analytics',
    client: 'Microsoft',
    company: 'MAQ Software',
    period: '2023 - 2024',
    summary:
      'Modern BI architecture and optimized tabular models that turn enterprise-scale datasets into timely business insight.',
    challenge:
      'Keep analytics useful and responsive as tabular datasets grow to 200 million rows and business reporting needs evolve.',
    approach: [
      'Design a modern BI architecture with Dataverse.',
      'Optimize large tabular datasets and automate daily update processes.',
      'Deliver visualization pages and ad-hoc data work for business stakeholders.',
    ],
    outcomes: [
      '30% improvement in data processing efficiency.',
      '40% reduction in update time through daily process automation.',
      'Tabular datasets of up to 200 million rows managed and optimized.',
    ],
    stack: ['Power BI', 'Dataverse', 'Tabular models', 'Automation'],
    metric: { value: '200M', label: 'rows, made useful' },
    kind: 'analytics',
  },
]

export const metrics = [
  { value: '200M', label: 'rows, made useful', detail: 'Tabular models for Microsoft client work' },
  { value: '50%', label: 'less operational time', detail: 'SQL and storage optimization at T-Mobile' },
  { value: '30%', label: 'processing efficiency gain', detail: 'BI architecture for Microsoft client work' },
]

export const skillGroups = [
  { title: 'Data & cloud', skills: ['Snowflake', 'Microsoft Azure', 'Databricks', 'GCP', 'BigQuery', 'Data Factory'] },
  { title: 'Engineering', skills: ['Python', 'SQL', 'Apache Spark', 'Scala', 'Apache Airflow', 'ETL / ELT'] },
  { title: 'Intelligence', skills: ['LLM integration', 'Agentic systems', 'MCP', 'LangChain', 'Vector databases', 'Machine learning'] },
  { title: 'Analytics & delivery', skills: ['Power BI', 'Dataverse', 'Power Automate', 'Data modeling', 'CI/CD', 'Data governance'] },
]

export const certifications = [
  { name: 'Databricks Certified Data Engineer Associate', issuer: 'Databricks', detail: 'Credential ID: 130445583' },
  { name: 'Fabric Analytics Engineer Associate', issuer: 'Microsoft', detail: 'DP-600' },
]

export const education = {
  degree: 'BTech in Computer Science',
  institution: 'Chandigarh University',
  period: '2018 - 2022',
  detail: '7.5 CGPA / Focus on data science, machine learning, and visualization',
}

export const awards = [
  { title: 'Quarter Champion & Person of the Month nomination', organization: 'Insight Global', year: '2025' },
  { title: 'Client appreciation for complex, high-quality delivery', organization: 'Microsoft client work', year: '2024' },
  { title: 'Recognition for contributions across multiple teams', organization: 'T-Mobile client work', year: '' },
]

export const projectDisclosure =
  'These are experience-based case studies drawn from my résumé, not public product demos. Visuals are original conceptual illustrations. No private client code or data is shared.'
