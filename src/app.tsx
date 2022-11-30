import React, { useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import Header from 'layout/header/header'
import { PATHS } from 'layout/paths'
import { Router } from 'layout/router'
import { UPDATE_ALERT_INFO } from 'store/alert-slice'

import { Alert } from 'common/components/alert/alert'
import { useAppDispatch, useAppSelector } from 'common/hooks/redux'

export const App = () => {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { alertInfo } = useAppSelector((state) => state.alertReducer)

  const isActiveLoginRoute = useMemo(
    (): boolean => location.pathname.includes(PATHS.LOGIN),
    [location.pathname],
  )

  const handleResetAlert = useCallback((): void => {
    dispatch(UPDATE_ALERT_INFO(null))
  }, [])

  return (
    <main className='parent'>
      <div className='content'>
        {alertInfo && <Alert {...alertInfo} onClose={handleResetAlert} />}
        {!isActiveLoginRoute && <Header />}
        <Router />
      </div>
    </main>
  )
}
