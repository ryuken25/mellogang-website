import { brand } from '../data/brandData'

const prefill = encodeURIComponent('Halo Mellogang Visuals, saya ingin konsultasi booking.')

export default function WhatsAppFloat() {
  return (
    <a
      href={`${brand.whatsapp}?text=${prefill}`}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat WhatsApp Mellogang Visuals +62 822-3600-4917"
      className="group fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-[100] grid h-14 w-14 place-items-center rounded-full bg-[#25D366] shadow-[0_12px_40px_rgba(37,211,102,0.45)] transition hover:scale-105 hover:shadow-[0_16px_48px_rgba(37,211,102,0.55)] sm:bottom-10 sm:right-10 sm:h-16 sm:w-16"
    >
      <img
        src={brand.socialIcons.whatsappFloat || brand.socialIcons.whatsapp}
        alt="WhatsApp"
        className="h-9 w-9 object-contain sm:h-10 sm:w-10"
      />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-black/80 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100 md:block">
        +62 822-3600-4917
      </span>
    </a>
  )
}
