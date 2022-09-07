import dynamic from 'next/dynamic'

const LazyContainer = dynamic(() => import('@c/layouts/LayoutWithoutFooter'), {
  suspense: false,
  ssr: false,
})

export default LazyContainer
