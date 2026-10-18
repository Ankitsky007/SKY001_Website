import { useLenis } from '@skyfall/core/motion'
import { useEffect, useRef, useState } from 'react'

/**
 * A dialog that opens from any link to `href` (and from a URL that already carries it), stops the
 * page scrolling while open, and closes with ✕, Esc or a tap outside.
 */
export function useHrefDialog(href: string, onOpen?: () => void) {
  const ref = useRef<HTMLDialogElement>(null)
  const lenis = useLenis()
  const [isOpen, setIsOpen] = useState(false)

  const open = () => {
    const d = ref.current
    if (!d || d.open) return
    onOpen?.()
    d.showModal()
    setIsOpen(true)
    lenis?.stop()
  }
  const close = () => ref.current?.close()

  const openRef = useRef(open)
  useEffect(() => {
    openRef.current = open
  })
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.(`a[href="${href}"]`)
      if (!a || e.button !== 0 || e.metaKey || e.ctrlKey) return
      e.preventDefault()
      openRef.current()
    }
    const onHash = () => window.location.hash === href && openRef.current()
    document.addEventListener('click', onClick)
    window.addEventListener('hashchange', onHash)
    onHash()
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('hashchange', onHash)
    }
  }, [href])

  useEffect(() => {
    const d = ref.current
    if (!d) return
    const onClose = () => {
      lenis?.start()
      setIsOpen(false)
    }
    d.addEventListener('close', onClose)
    return () => d.removeEventListener('close', onClose)
  }, [lenis])

  return { ref, isOpen, open, close }
}
