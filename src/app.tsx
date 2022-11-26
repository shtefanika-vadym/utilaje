import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import Header from 'layout/header/header'
import { Router } from 'layout/router'
import Sidebar from 'layout/sidebar/sidebar'

export const App = () => {
  const location = useLocation()

  const isActiveLoginRoute = useMemo(
    (): boolean => location.pathname.includes('login'),
    [location.pathname],
  )

  return (
    <main className='parent'>
      {!isActiveLoginRoute && <Sidebar />}
      <div className='content'>
        {!isActiveLoginRoute && <Header />}
        <Router />
      </div>
    </main>
  )
}
