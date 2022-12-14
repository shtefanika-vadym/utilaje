import React, { useCallback, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import Header from 'layout/header/header'
import { PATHS } from 'layout/paths'
import { Router } from 'layout/router'
import { UPDATE_ALERT_INFO } from 'store/alert-slice'
import {
  SET_CART,
  SET_IS_FETCHING_PRODUCTS,
  SET_USER,
  UPDATE_CATEGORIES,
  UPDATE_PRODUCTS,
} from 'store/products-slice'

import { IProduct } from './common/interfaces/IProduct'
import { Alert } from 'common/components/alert/alert'
import { useFirebaseTable } from 'common/hooks/hooks'
import { useAppDispatch, useAppSelector } from 'common/hooks/redux'
import { auth } from 'firebaseInit'

export const App = () => {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const firebaseCategories = useFirebaseTable('categories')

  const firebaseProducts = useFirebaseTable('products')
  const { alertInfo } = useAppSelector((state) => state.alertReducer)
  const { cart } = useAppSelector((state) => state.productsReducer)

  const cartLocaleStorage = useMemo(
    () => window.localStorage.getItem('utilajes-cos'),
    [],
  )

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      dispatch(SET_USER(user))
    })
    if (Array.isArray(JSON.parse(cartLocaleStorage)))
      dispatch(SET_CART(JSON.parse(cartLocaleStorage)))
  }, [])

  useEffect(() => {
    setLocaleStorageCart(cart)
  }, [cart])

  const setLocaleStorageCart = (products: IProduct[]): void => {
    window.localStorage.setItem('utilajes-cos', JSON.stringify(products))
  }

  const isActiveLoginRoute = useMemo(
    (): boolean => location.pathname.includes(PATHS.LOGIN),
    [location.pathname],
  )

  const handleResetAlert = useCallback((): void => {
    dispatch(UPDATE_ALERT_INFO(null))
  }, [])

  useEffect(() => {
    firebaseCategories.createRequest()
    firebaseProducts.createRequest()
    // window.setInterval(() => {
    //   const user = AuthService.getUser()
    //   if (
    //     AuthService.getToken() &&
    //     user &&
    //     new Date(user.stsTokenManager.expirationTime) < new Date()
    //   )
    //     auth.
    // }, 10000)
    return () => {
      window.clearInterval(10000)
    }
  }, [])

  useEffect(() => {
    if (Array.isArray(firebaseProducts.data)) {
      const adjustedProducts = firebaseProducts.data.map((product) => {
        return {
          ...product,
          images: !Array.isArray(product?.images)
            ? JSON.parse(product?.images)
            : product?.images,
        }
      })
      dispatch(UPDATE_PRODUCTS(adjustedProducts))
      if (!!cart.length) {
        const uniqueCart: IProduct[] = []
        for (let i = 0; i < firebaseProducts.data.length; i++) {
          const storeProduct: IProduct = firebaseProducts.data[i]
          const cartProduct: IProduct | undefined = cart.find(
            (product: IProduct): boolean => product.id === storeProduct.id,
          )
          if (cartProduct)
            uniqueCart.push({
              total: cartProduct.total,
              ...storeProduct,
            })
        }
        dispatch(SET_CART(uniqueCart))
      }
    }
  }, [firebaseProducts.data])

  useEffect(() => {
    if (Array.isArray(firebaseCategories.data))
      dispatch(UPDATE_CATEGORIES(firebaseCategories.data))
  }, [firebaseCategories.data])

  useEffect(() => {
    dispatch(SET_IS_FETCHING_PRODUCTS(firebaseProducts.loading))
  }, [firebaseProducts.loading])

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
