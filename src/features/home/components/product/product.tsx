import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { Carousel } from 'antd'
import classNames from 'classnames'
import { nanoid } from 'nanoid'

import { Button } from 'common/components/Button/Button'
import { ALT_IMG } from 'common/constants/constants'
import { IProduct } from 'common/interfaces/IProduct'

import { HOME_LABELS } from 'features/home/constants/constants'

import styles from './product.module.scss'
import 'antd/lib/carousel/style/css'

interface IProps {
  product: IProduct
  onAddToCart: (product: IProduct) => void
}

export const Product: FC<IProps> = ({ product, onAddToCart }) => {
  const navigate = useNavigate()

  const handleNavigateToProduct = (): void => {
    navigate(`produse/${product.id}`)
  }

  return (
    <div className={styles.parent}>
      <div>
        <Carousel dotPosition={'bottom'}>
          {product.images.map((image: string) => (
            <div key={nanoid()}>
              <img
                src={image}
                alt={ALT_IMG.PRODUCT_IMAGE}
                className={styles.parentImage}
                onClick={handleNavigateToProduct}
              />
            </div>
          ))}
        </Carousel>
        <div className={styles.parentContent}>
          <div className={styles.parentTitle}>{product.title}</div>
          <p className={styles.parentDescription}>{product.description}</p>
        </div>
      </div>

      <div className={classNames(styles.parentButton, styles.parentContent)}>
        <div className={styles.parentStock}>
          <span className={styles.parentPrice}>
            {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}Lei
          </span>
          In stoc
        </div>
        <Button modifier={'outline'} onClick={() => onAddToCart(product)}>
          {HOME_LABELS.ADD_TO_CART}
        </Button>
      </div>
    </div>
  )
}
