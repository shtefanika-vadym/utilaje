import React, { FC } from 'react'

import { InputNumber } from 'antd'

import removeIcon from 'common/assets/remove-icon.svg'

import { ALT_IMG } from 'common/constants/constants'
import { IProduct } from 'common/interfaces/IProduct'

// eslint-disable-next-line css-modules/no-unused-class
import styles from './cart-product.module.scss'

interface IProps {
  product: IProduct
  handleRemoveProduct: (product: IProduct) => void
  handleChangeTotalProduct: (product: IProduct, total: number) => void
}

export const CartProduct: FC<IProps> = ({
  product,
  handleRemoveProduct,
  handleChangeTotalProduct,
}) => {
  return (
    <div className={styles.parent}>
      <span className={styles.parentInfo}>
        <h3 className={styles.parentTitle}>{product.title}</h3>

        {product.description}
      </span>

      <div className={styles.parentSmallDevice}>
        <span className={styles.parentTotal}>
          <InputNumber
            min={1}
            max={100}
            className='total-input-number'
            defaultValue={product.total}
            onChange={(total: number) =>
              handleChangeTotalProduct(product, total)
            }
          />
        </span>
        <span className={styles.parentPrice}>
          {(product.price * product.total)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
          Lei
        </span>

        <button
          className={styles.parentRemove}
          onClick={() => handleRemoveProduct(product)}>
          <img src={removeIcon} alt={ALT_IMG.REMOVE_ICON} />
        </button>
      </div>

      <span className={styles.parentTotal}>
        <InputNumber
          min={1}
          max={100}
          className='total-input-number'
          defaultValue={product.total}
          onChange={(total: number) => handleChangeTotalProduct(product, total)}
        />
      </span>
      <span className={styles.parentPrice}>
        {(product.price * product.total)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
        Lei
      </span>

      <button
        className={styles.parentRemove}
        onClick={() => handleRemoveProduct(product)}>
        <img src={removeIcon} alt={ALT_IMG.REMOVE_ICON} />
      </button>
    </div>
  )
}
