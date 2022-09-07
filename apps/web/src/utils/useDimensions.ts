import { useState, useEffect } from 'react'

export interface IWindowDimensions {
  width: number
  height: number
}

export function useDimensions() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [dimensions, setDimensions] = useState<IWindowDimensions>({
    width: NaN,
    height: NaN,
  })

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return dimensions
}
