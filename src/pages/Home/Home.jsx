import Header from '../../components/layout/Header/Header'
import HelpFab from '../../components/layout/HelpFab/HelpFab'
import Hero from '../../components/landing/Hero/Hero'

function Home() {
  return (
    <div className="relative min-h-svh">
      <Header />
      <main>
        <Hero />
      </main>
      <HelpFab />
    </div>
  )
}

export default Home
