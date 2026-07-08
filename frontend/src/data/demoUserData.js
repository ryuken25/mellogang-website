// Frontend-only demo account for static Vercel preview. Not a real credential.
export const demoUsers = [
  {
    id: 'user-dummy-001',
    name: 'Dummy Client',
    email: 'dummy@dummy.com',
    password: 'dummy',
    whatsapp: '+6282236004917',
    role: 'customer',
    avatarInitials: 'DC',
    preferredEventType: 'Wedding Cinematic Highlight',
    location: 'Bali, Indonesia',
    notes: 'Suka tone cinematic warm, natural light, dan dokumentasi adat Bali.',
  },
]
export const demoSessionKey = 'mellogang_demo_session'
export function getDemoSession(){ try { return JSON.parse(localStorage.getItem('mellogang_auth_user') || localStorage.getItem(demoSessionKey) || 'null') } catch { return null } }
export function setDemoSession(user){ const { password, ...safe } = user; localStorage.setItem('mellogang_auth_user', JSON.stringify({ ...safe, loggedInAt:new Date().toISOString() })) }
export function clearDemoSession(){ localStorage.removeItem('mellogang_auth_user'); localStorage.removeItem(demoSessionKey) }
