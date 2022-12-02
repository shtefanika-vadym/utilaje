import React from 'react'

import { GoBack } from 'common/components/go-back/go-back'
import { useAppSelector } from 'common/hooks/redux'

import { CartContent } from 'features/cart/components/cart-content/cart-content'
import { CartEmpty } from 'features/cart/components/cart-empty/cart-empty'

import styles from './cart.module.scss'

export const Cart = () => {
  const { cart } = useAppSelector((state) => state.productsReducer)
  return (
    <div className={styles.parent}>
      <div className={styles.parentHead}>
        <GoBack />
      </div>
      {!!cart.length ? <CartContent /> : <CartEmpty />}
    </div>
  )
}
