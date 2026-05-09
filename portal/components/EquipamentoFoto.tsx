'use client'

export default function EquipamentoFoto({ src, alt }: { src: string | null; alt: string }) {
  return (
    <div className="relative h-64 sm:h-80 bg-gray-100 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-8xl">
        🏗️
      </div>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      )}
    </div>
  )
}
