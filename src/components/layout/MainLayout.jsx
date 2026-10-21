import { Outlet } from 'react-router-dom'
import ScrollToTop from '../ScrollToTop'
import Header from './Header/Header'
import Footer from './Footer'
import HelpFab from './HelpFab'

function MainLayout() {
  return (
    <div className="relative min-h-svh bg-bg">
      <ScrollToTop />
      <Header />
      <Outlet />
      <Footer />
      <HelpFab />
    </div>
  )
}

export default MainLayout
