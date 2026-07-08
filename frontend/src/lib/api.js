import { packages as mockPackages, portfolio as mockPortfolio, orders as mockOrders } from '../data/mockData'
import { brand } from '../data/brandData'

const API_BASE = (import.meta.env.VITE_BACKEND_BASE_URL || import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
async function request(path, fallback) {
  if (!API_BASE) return fallback
  try {
    const res = await fetch(`${API_BASE}${path}`, { headers: { Accept: 'application/json' }, credentials: 'include' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    return json.data ?? json
  } catch (error) {
    console.warn(`API fallback for ${path}:`, error)
    return fallback
  }
}
export const api = {
  packages: () => request('/api/packages', mockPackages),
  portfolio: () => request('/api/portfolio', mockPortfolio),
  orderStatus: (kode) => request(`/api/order-status?kode=${encodeURIComponent(kode || '')}`, kode ? mockOrders.find(o => o.kode_pemesanan.toLowerCase() === kode.toLowerCase()) || null : null),
  adminSummary: () => request('/api/dashboard/admin-summary', { totalOrders: 128, pendingPayments: 9, activeSchedules: 17, completedProjects: 84 }),
  brand: () => request('/api/brand', brand),
}
export const backendUrl = (path = '') => `${API_BASE || ''}${path}`
