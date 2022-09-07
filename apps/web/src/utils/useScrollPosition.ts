import { useEffect, useState } from 'react'

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState<number>(NaN)
  useEffect(() => {
    function onScroll() {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return scrollPosition
}
