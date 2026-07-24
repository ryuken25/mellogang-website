import { brand } from '../data/brandData'

const prefill = encodeURIComponent('Halo Mellogang Visuals, saya ingin konsultasi booking.')

// Floating WA — dibikin nyatu sama vibe brand: base gelap, ring gold tipis,
// glow lembut. Ikon WhatsApp tetap (recognizable), bukan bubble hijau default.
export default function WhatsAppFloat() {
  return (
    <a
      href={`${brand.whatsapp}?text=${prefill}`}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat WhatsApp Mellogang Visuals +62 822-3600-4917"
      className="group fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-[100] grid h-14 w-14 place-items-center rounded-full border border-[#c9a26a]/60 bg-[#12100d]/95 shadow-[0_10px_36px_rgba(0,0,0,0.55),0_0_24px_rgba(201,162,106,0.22)] backdrop-blur-sm transition duration-200 hover:scale-105 hover:border-[#e8caa0] hover:shadow-[0_14px_44px_rgba(0,0,0,0.6),0_0_34px_rgba(201,162,106,0.38)] sm:bottom-10 sm:right-10 sm:h-16 sm:w-16"
    >
      <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-[#c9a26a]/10 to-transparent" />
      <img
        src={brand.socialIcons.whatsappFloat || brand.socialIcons.whatsapp}
        alt="WhatsApp"
        className="relative h-8 w-8 object-contain opacity-90 transition group-hover:opacity-100 sm:h-9 sm:w-9"
      />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full border border-[#c9a26a]/40 bg-[#12100d]/95 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-[#e8caa0] opacity-0 shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition group-hover:opacity-100 md:block">
        Konsultasi via WhatsApp
      </span>
    </a>
  )
}
