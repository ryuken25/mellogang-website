export default function SmartImage({ src, alt, objectPosition = '50% 35%', className = '' }) {
  return <img src={src} alt={alt} loading="lazy" decoding="async" className={`h-full w-full object-cover ${className}`} style={{ objectPosition }} />
}
