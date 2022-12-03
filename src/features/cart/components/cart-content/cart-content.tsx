import React, { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { PATHS } from 'layout/paths'
import {
  FILTER_CART,
  SET_CART,
  UPDATE_TOTAL_PRODUCT,
} from 'store/products-slice'

import cartIcon from 'common/assets/cart-icon.svg'
import removeIcon from 'common/assets/remove-icon.svg'

import { Button } from 'common/components/Button/Button'
import { ALT_IMG } from 'common/constants/constants'
import { useAppDispatch, useAppSelector } from 'common/hooks/redux'
import { IProduct } from 'common/interfaces/IProduct'

import { CartProductList } from 'features/cart/components/cart-product-list/cart-product-list'
import { CART_LABELS } from 'features/cart/constants/constants'

import styles from './cart-content.module.scss'

export const CartContent = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { cart } = useAppSelector((state) => state.productsReducer)

  const handleClearCart = (): void => {
    dispatch(SET_CART([]))
  }

  const handleRemoveProduct = useCallback(
    (product: IProduct): void => {
      dispatch(FILTER_CART(product))
    },
    [cart],
  )

  const cartPrice = useMemo(
    (): string =>
      cart
        .reduce((acc: number, val: IProduct) => acc + val.price * val?.total, 0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    [cart],
  )

  const handleChangeTotalProduct = (product: IProduct, total: number): void => {
    dispatch(UPDATE_TOTAL_PRODUCT({ ...product, total: total }))
  }

  const handleOrderNow = (): void => {
    navigate(PATHS.ORDER_NOW)
  }

  return (
    <div className={styles.parent}>
      <div className={styles.parentHead}>
        <span className={styles.parentHeadTitle}>
          <img src={cartIcon} alt={ALT_IMG.CART_ICON} />
          <h1 className={styles.parentTitle}>{CART_LABELS.CART}</h1>
        </span>
        <button onClick={handleClearCart} className={styles.parentHeadClear}>
          <img src={removeIcon} alt={ALT_IMG.REMOVE_ICON} />
          {CART_LABELS.CLEAR_CART}
        </button>
      </div>

      <CartProductList
        products={cart}
        handleRemoveProduct={handleRemoveProduct}
        handleChangeTotalProduct={handleChangeTotalProduct}
      />
      <div className={styles.parentOrder}>
        <span className={styles.parentTotalPrice}>
          {CART_LABELS.CURRENT_PRICE}
          <span className={styles.parentPrice}>{cartPrice} Lei</span>
        </span>
        <span className={styles.parentOrderBtn}>
          <Button modifier='primary' onClick={handleOrderNow}>
            {CART_LABELS.ORDER_NOW}
          </Button>
        </span>
      </div>
    </div>
  )
}
