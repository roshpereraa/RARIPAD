import { Suspense } from 'react'
import { SearchResults } from '@/components/SearchResults'

export const metadata = { title: 'Search — RARIPAD' }

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResults />
    </Suspense>
  )
}
