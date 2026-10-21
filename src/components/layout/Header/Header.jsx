import TopBar from './TopBar'
import Navbar from './Navbar'

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full">
      <TopBar />
      <div className="px-6">
        <Navbar />
      </div>
    </header>
  )
}

export default Header
