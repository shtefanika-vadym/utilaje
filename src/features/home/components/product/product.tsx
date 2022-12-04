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
import { AuthService } from 'common/services/auth-service'

interface IProps {
  product: IProduct
  onAddToCart: (product: IProduct) => void
}

export const Product: FC<IProps> = ({ product, onAddToCart }) => {
  const navigate = useNavigate()

  const handleNavigateToProduct = (): void => {
    navigate(`/produse/${product.id}`)
  }

  const handleUpdateProduct = (): void => {
    navigate(`/produse/modificare/${product.id}`)
  }

  return (
    <div className={styles.parent}>
      <div>
        <Carousel dotPosition={'bottom'}>
          {product.images.map((image: any) => (
            <div key={nanoid()}>
              <img
                src={image?.url}
                alt={ALT_IMG.PRODUCT_IMAGE}
                className={styles.parentImage}
                onClick={handleNavigateToProduct}
              />
            </div>
          ))}
        </Carousel>
        <div className={styles.parentContent}>
          <div className={styles.parentTitle}>{product.title}</div>
          <div
            className={styles.parentDescription}
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      </div>

      <div className={classNames(styles.parentButton, styles.parentContent)}>
        <div className={styles.parentStock}>
          <span className={styles.parentPrice}>
            {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}Lei
          </span>
          În stoc
        </div>
        <div className={styles.parentBtns}>
          <Button modifier={'outline'} onClick={() => onAddToCart(product)}>
            {HOME_LABELS.ADD_TO_CART}
          </Button>
          {AuthService.getToken() && (
            <Button modifier={'outline'} onClick={handleUpdateProduct}>
              {HOME_LABELS.UPDATE}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
