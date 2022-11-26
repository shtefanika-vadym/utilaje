import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { PATHS } from 'layout/paths'

import { Home } from 'features/home/index'
import { Login } from 'features/login/index'
import { NewProduct } from 'features/new-product/index'

export const Router = () => (
  <Routes>
    <Route path={PATHS.HOME} element={<Home />} />
    <Route path={PATHS.LOGIN} element={<Login />} />
    <Route path={PATHS.ADD_PRODUCT} element={<NewProduct />} />
    <Route path='*' element={<Navigate to={PATHS.LOGIN} replace />} />
  </Routes>
)
