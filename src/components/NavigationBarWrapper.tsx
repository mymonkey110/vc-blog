'use client'

import { usePathname } from 'next/navigation'
import NavigationBar from './NavigationBar'

interface NavigationBarWrapperProps {
  showUserActions?: boolean
  showSearchMenu?: boolean
  userAvatar?: string
}

export default function NavigationBarWrapper({ 
  showUserActions, 
  showSearchMenu,
  userAvatar
}: NavigationBarWrapperProps) {
  const pathname = usePathname()
  
  return (
    <NavigationBar 
      showUserActions={showUserActions}
      showSearchMenu={showSearchMenu}
      userAvatar={userAvatar}
      pathname={pathname}
    />
  )
}