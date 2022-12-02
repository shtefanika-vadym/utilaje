import React from 'react'

import emptyCartIcon from 'common/assets/empty-cart.svg'

import { ALT_IMG } from 'common/constants/constants'

import { CART_LABELS } from 'features/cart/constants/constants'

import styles from './cart-empty.module.scss'

export const CartEmpty = () => {
  return (
    <div className={styles.parent}>
      <h1 className={styles.parentTitle}>{CART_LABELS.EMPTY_CART}</h1>
      <p className={styles.parentDescription}>
        {CART_LABELS.EMPTY_CART_DESCRIPTION}
      </p>
      <img
        className={styles.parentCartIcon}
        src={emptyCartIcon}
        alt={ALT_IMG.CART_ICON}
      />
    </div>
  )
}
