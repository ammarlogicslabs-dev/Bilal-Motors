import Hero from '../components/landing/Hero/Hero'
import BrowseSection from '../components/landing/Browse/BrowseSection'
import Services from '../components/landing/Services'
import Videos from '../components/landing/Videos'
import Blogs from '../components/landing/Blogs'
import WhyUs from '../components/landing/WhyUs'
import Faq from '../components/landing/Faq'
import HomeCta from '../components/landing/HomeCta'

function Home() {
  return (
    <main>
      <Hero />
      <BrowseSection />
      <Services />
      <Videos />
      <Blogs />
      <WhyUs />
      <Faq />
      <HomeCta />
    </main>
  )
}

export default Home
