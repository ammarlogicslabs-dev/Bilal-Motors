import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home'
import UsedCar from './pages/UsedCar'
import VideosPage from './pages/VideosPage'
import VideoDetail from './pages/VideoDetail'
import BlogsPage from './pages/BlogsPage'
import BlogDetail from './pages/BlogDetail'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="used-car" element={<UsedCar />} />
        <Route path="used-car/:name" element={<UsedCar />} />
        <Route path="videos" element={<VideosPage />} />
        <Route path="videos/:slug" element={<VideoDetail />} />
        <Route path="blogs" element={<BlogsPage />} />
        <Route path="blogs/:slug" element={<BlogDetail />} />
        <Route path="used-cars" element={<Navigate to="/used-car" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
