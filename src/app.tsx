import React, { useCallback, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { UPDATE_ALERT_INFO } from 'store/alert-slice'
import { UPDATE_CATEGORIES, UPDATE_PRODUCTS } from 'store/products-slice'

import { Alert } from 'common/components/alert/alert'
import { useFirebaseTable } from 'common/hooks/hooks'
import { useAppDispatch, useAppSelector } from 'common/hooks/redux'

import Header from 'layout/header/header'
import { PATHS } from 'layout/paths'
import { Router } from 'layout/router'

export const App = () => {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { alertInfo } = useAppSelector((state) => state.alertReducer)
  const categories = useFirebaseTable('categories')
  const products = useFirebaseTable('products')

  const isActiveLoginRoute = useMemo(
    (): boolean => location.pathname.includes(PATHS.LOGIN),
    [location.pathname],
  )

  useEffect(() => {
    products.createRequest()
    categories.createRequest()
  }, [])

  useEffect(() => {
    if (categories.data) dispatch(UPDATE_CATEGORIES(categories.data))
  }, [categories.data])

  useEffect(() => {
    if (products.data) dispatch(UPDATE_PRODUCTS(products.data))
  }, [products.data])

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
