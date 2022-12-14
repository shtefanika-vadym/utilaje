import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { PATHS } from 'layout/paths'

import { Cart, CartOrder } from 'features/cart/index'
import { Home, ProductDetails } from 'features/home/index'
import { Login } from 'features/login/index'
import { NewProduct } from 'features/new-product/index'

export const Router = () => (
  <Routes>
    <Route path={PATHS.CART} element={<Cart />} />
    <Route path={PATHS.HOME} element={<Home />} />
    <Route path={PATHS.LOGIN} element={<Login />} />
    <Route path={PATHS.PRODUCTS} element={<ProductDetails />} />
    <Route path={PATHS.ORDER_NOW} element={<CartOrder />} />
    <Route path={PATHS.ADD_PRODUCT} element={<NewProduct />} />
    <Route path={PATHS.UPDATE_PRODUCT} element={<NewProduct />} />
    <Route path='*' element={<Navigate to={PATHS.HOME} replace />} />
  </Routes>
)
