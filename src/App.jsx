import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home'
import UsedCar from './pages/UsedCar'
import CarDetail from './pages/CarDetail'
import VideosPage from './pages/VideosPage'
import VideoDetail from './pages/VideoDetail'
import BlogsPage from './pages/BlogsPage'
import BlogDetail from './pages/BlogDetail'
import AdminLayout from './admin/AdminLayout'
import AdminLogin from './admin/pages/AdminLogin'
import AdminDashboard from './admin/pages/AdminDashboard'
import AdminCars from './admin/pages/AdminCars'
import AdminBlogs from './admin/pages/AdminBlogs'
import AdminVideos from './admin/pages/AdminVideos'
import AdminRequests from './admin/pages/AdminRequests'
import AdminUsers from './admin/pages/AdminUsers'
import Login from './pages/Login'
import SellCar from './pages/SellCar'
import PostFreeAd from './pages/PostFreeAd'
import SellItForMe from './pages/SellItForMe'

function App() {
  return (
    <>
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="cars" element={<AdminCars />} />
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="videos" element={<AdminVideos />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="sell-car" element={<SellCar />} />
        <Route path="sell-car/post-ad" element={<PostFreeAd />} />
        <Route path="sell-car/sell-it-for-me" element={<SellItForMe />} />
        <Route path="used-car" element={<UsedCar />} />
        <Route path="used-car/ad/:id" element={<CarDetail />} />
        <Route path="used-car/:name" element={<UsedCar />} />
        <Route path="videos" element={<VideosPage />} />
        <Route path="videos/:slug" element={<VideoDetail />} />
        <Route path="blogs" element={<BlogsPage />} />
        <Route path="blogs/:slug" element={<BlogDetail />} />
        <Route path="used-cars" element={<Navigate to="/used-car" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>

    <ToastContainer
      position="top-right"
      autoClose={2800}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastClassName="!rounded-xl !border !border-border-soft !shadow-soft !font-sans !text-[13px]"
    />
    </>
  )
}

export default App
