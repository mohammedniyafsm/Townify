import LandingLoop from "@/components/Landing-page/LandingLoop"
import Landing from "../components/Landing-page/Landing"
import LandingNav from "../components/Landing-page/LandingNav"
import LandDetail from "@/components/Landing-page/LandDetail"

function Home() {
  return (
    <div className="bg-[#f7f7f5]">
      <LandingNav />
      <Landing />
      <LandingLoop />
      <LandDetail />
    </div>
  )
}

export default Home
