// Every logo file in assets/logos, keyed by file name without extension. Adding a file is enough.
const FILES = import.meta.glob<string>('../assets/logos/*.{svg,png,webp}', { eager: true, query: '?url', import: 'default' })
const LOGOS = Object.fromEntries(Object.entries(FILES).map(([path, url]) => [path.split('/').pop()!.replace(/\.\w+$/, ''), url]))

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/**
 * Row of organisations: each shows its official logo when a file for it exists in assets/logos,
 * and a mono name tag otherwise. The files are monochrome ink on a transparent background.
 */
export function LogoRow({ names }: { names: readonly string[] }) {
  return (
    <ul className="grid grid-cols-2 border-t border-l border-line sm:grid-cols-3">
      {names.map((name) => {
        const src = LOGOS[slug(name)]
        return (
          <li key={name} className="flex h-20 items-center justify-center border-r border-b border-line bg-paper px-4 md:h-24">
            {src ? <img src={src} alt={name} loading="lazy" className="max-h-8 max-w-[82%] object-contain md:max-h-10" /> : <span className="bg-ink px-1.5 py-0.5 font-mono text-[13px] font-medium text-white">{name}</span>}
          </li>
        )
      })}
    </ul>
  )
}
