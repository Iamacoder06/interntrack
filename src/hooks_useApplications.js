import { useEffect, useState } from 'react'

const STORAGE_KEY = 'interntrack-applications'
const demoApplications = [
  { id: 'demo-1', company: 'Google', title: 'Software Engineering Intern', location: 'Mountain View, CA', type: 'Internship', date: '2026-10-08', status: 'Interview', url: 'https://careers.google.com/', interviewDate: '2026-10-18', notes: 'Technical screen with the search team.' },
  { id: 'demo-2', company: 'Microsoft', title: 'Software Engineer Intern', location: 'Redmond, WA', type: 'Internship', date: '2026-10-06', status: 'Applied', url: '', interviewDate: '', notes: '' },
  { id: 'demo-3', company: 'Figma', title: 'Product Design Intern', location: 'New York, NY · Remote', type: 'Internship', date: '2026-10-04', status: 'Applied', url: '', interviewDate: '', notes: 'Portfolio submitted.' },
  { id: 'demo-4', company: 'Stripe', title: 'Frontend Engineering Intern', location: 'Remote', type: 'Internship', date: '2026-10-02', status: 'Offer', url: '', interviewDate: '2026-10-12', notes: 'Offer received — respond by Oct 20.' },
  { id: 'demo-5', company: 'Notion', title: 'Software Engineer Intern', location: 'San Francisco, CA', type: 'Internship', date: '2026-09-28', status: 'Rejected', url: '', interviewDate: '', notes: '' },
]

export function useApplications() {
  const [applications, setApplications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored === null ? demoApplications : JSON.parse(stored)
    } catch { return demoApplications }
  })
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(applications)) }, [applications])
  return [applications, setApplications]
}
