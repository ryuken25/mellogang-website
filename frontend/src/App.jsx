import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import PublicLayout from './layout/PublicLayout'
import DashboardLayout from './layout/DashboardLayout'
import AppErrorBoundary from './components/AppErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './components/NotFound'
import Home from './pages/Home'
import Katalog from './pages/Katalog'
import Portfolio from './pages/Portfolio'
import Kontak from './pages/Kontak'
import StatusPesanan from './pages/StatusPesanan'
import Invoice from './pages/Invoice'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import CreateBooking from './pages/customer/CreateBooking'
import { AdminDashboard, CustomerDashboard, EditorDashboard } from './pages/dashboard'

const router=createBrowserRouter([
 {path:'/',element:<PublicLayout/>,errorElement:<AppErrorBoundary/>,children:[
  {index:true,element:<Home/>},
  {path:'katalog',element:<Katalog/>},
  {path:'portofolio',element:<Portfolio/>},
  {path:'portfolio',element:<Navigate to="/portofolio" replace/>},
  {path:'kontak',element:<Kontak/>},
  {path:'status-pesanan',element:<StatusPesanan/>},
  {path:'status',element:<StatusPesanan/>},
  {path:'invoice',element:<ProtectedRoute redirectTo="/status"><Invoice/></ProtectedRoute>},
  {path:'invoice/:kode',element:<ProtectedRoute redirectTo="/status"><Invoice/></ProtectedRoute>},
  {path:'profile',element:<ProtectedRoute><Profile/></ProtectedRoute>},
  {path:'profile/edit',element:<ProtectedRoute><EditProfile/></ProtectedRoute>},
  {path:'pelanggan',element:<Navigate to="/pelanggan/dashboard" replace/>},
  {path:'pelanggan/dashboard',element:<ProtectedRoute><CustomerDashboard/></ProtectedRoute>},
  {path:'pelanggan/status',element:<Navigate to="/status" replace/>},
  {path:'pelanggan/pemesanan/buat/:packageId',element:<ProtectedRoute><CreateBooking/></ProtectedRoute>},
  {path:'admin',element:<AdminDashboard/>},
  {path:'editor',element:<EditorDashboard/>},
  {path:'*',element:<NotFound/>},
 ]},
 {path:'/auth',element:<Auth defaultMode="signin"/>,errorElement:<AppErrorBoundary/>},
 {path:'/login',element:<Navigate to="/auth?mode=signin" replace/>},
 {path:'/register',element:<Navigate to="/auth?mode=signup" replace/>},
 {path:'/dashboard',element:<DashboardLayout/>,errorElement:<AppErrorBoundary/>,children:[{path:'admin',element:<AdminDashboard/>},{path:'editor',element:<EditorDashboard/>},{path:'pelanggan',element:<CustomerDashboard/>}]}
])
export default function App(){return <ThemeProvider><AuthProvider><RouterProvider router={router}/></AuthProvider></ThemeProvider>}
