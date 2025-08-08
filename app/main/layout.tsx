import React from 'react'

import FAB from '@/components/ui/fab'

const RootLayout = ({ children } : {
    children: React.ReactNode
}) => {
  return (
    <>
        {children}
        <FAB/>
    </>
  )
}

export default RootLayout