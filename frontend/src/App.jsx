import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PublicLayout from './layout/PublicLayout'
import DashboardLayout from './layout/DashboardLayout'
import Home from './pages/Home'
import Katalog from './pages/Katalog'
import Portfolio from './pages/Portfolio'
import Kontak from './pages/Kontak'
import StatusPesanan from './pages/StatusPesanan'
import Invoice from './pages/Invoice'
import Auth from './pages/Auth'
import { AdminDashboard, CustomerDashboard, EditorDashboard } from './pages/dashboard'
const router=createBrowserRouter([
 {path:'/',element:<PublicLayout/>,children:[{index:true,element:<Home/>},{path:'katalog',element:<Katalog/>},{path:'portofolio',element:<Portfolio/>},{path:'kontak',element:<Kontak/>},{path:'status-pesanan',element:<StatusPesanan/>},{path:'invoice',element:<Invoice/>}]},
 {path:'/login',element:<Auth mode="login"/>},{path:'/register',element:<Auth mode="register"/>},
 {path:'/dashboard',element:<DashboardLayout/>,children:[{path:'admin',element:<AdminDashboard/>},{path:'editor',element:<EditorDashboard/>},{path:'pelanggan',element:<CustomerDashboard/>}]}
])
export default function App(){return <RouterProvider router={router}/>}
