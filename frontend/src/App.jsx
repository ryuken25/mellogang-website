import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import PublicLayout from './layout/PublicLayout'
import DashboardLayout from './layout/DashboardLayout'
import AppErrorBoundary from './components/AppErrorBoundary'
import Home from './pages/Home'
import Katalog from './pages/Katalog'
import Portfolio from './pages/Portfolio'
import Kontak from './pages/Kontak'
import StatusPesanan from './pages/StatusPesanan'
import Invoice from './pages/Invoice'
import Auth from './pages/Auth'
import { AdminDashboard, CustomerDashboard, EditorDashboard } from './pages/dashboard'
const router=createBrowserRouter([
 {path:'/',element:<PublicLayout/>,errorElement:<AppErrorBoundary/>,children:[{index:true,element:<Home/>},{path:'katalog',element:<Katalog/>},{path:'portofolio',element:<Portfolio/>},{path:'kontak',element:<Kontak/>},{path:'status-pesanan',element:<StatusPesanan/>},{path:'status',element:<StatusPesanan/>},{path:'invoice',element:<Invoice/>},{path:'invoice/:kode',element:<Invoice/>}]},
 {path:'/auth',element:<Auth defaultMode="signin"/>,errorElement:<AppErrorBoundary/>},
 {path:'/login',element:<Navigate to="/auth?mode=signin" replace/>},
 {path:'/register',element:<Navigate to="/auth?mode=signup" replace/>},
 {path:'/dashboard',element:<DashboardLayout/>,errorElement:<AppErrorBoundary/>,children:[{path:'admin',element:<AdminDashboard/>},{path:'editor',element:<EditorDashboard/>},{path:'pelanggan',element:<CustomerDashboard/>}]}
])
export default function App(){return <RouterProvider router={router}/>}
