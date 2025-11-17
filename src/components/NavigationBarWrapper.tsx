'use client'

import { usePathname } from 'next/navigation'
import NavigationBar from './NavigationBar'

export default function NavigationBarWrapper() {
  const pathname = usePathname()
  
  return (
    <NavigationBar 
      pathname={pathname}
    />
  )
}