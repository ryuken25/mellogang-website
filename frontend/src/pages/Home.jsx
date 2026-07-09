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

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStats />
      <SelectedVisualStories />
      <StoriesAndPackages />
      <PackagesPreview />
      <FilmsAndMotion />
      <HowBookingWorks />
      <FAQ />
      <ContactCTA />
    </>
  )
}
