import {
  Hero,
  TrustStats,
  SelectedVisualStories,
  StoriesAndPackages,
  PackagesPreview,
  FilmsAndMotion,
  HowBookingWorks,
  FAQ,
  ContactCTA,
} from '../sections/HomeSections'
import CinematicScrollStories from '../sections/CinematicScrollStories'

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStats />
      {/* Full landing scroll stories (non-GSAP) for premium film-studio feel */}
      <CinematicScrollStories />
      <SelectedVisualStories />
      {/* Keep existing GSAP pinned chapter experience */}
      <StoriesAndPackages />
      <PackagesPreview />
      <FilmsAndMotion />
      <HowBookingWorks />
      <FAQ />
      <ContactCTA />
    </>
  )
}
