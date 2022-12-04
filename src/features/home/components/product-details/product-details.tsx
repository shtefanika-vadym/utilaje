import React, { FC, useMemo } from 'react'

import { Navigate, useParams } from 'react-router-dom'
import { useAppSelector } from 'common/hooks/redux'
import { IProduct } from 'common/interfaces/IProduct'
import { PATHS } from 'layout/paths'

import { Carousel } from 'antd'
import { nanoid } from 'nanoid'
import { ALT_IMG } from 'common/constants/constants'
import { UtilService } from 'common/services/services'

import styles from './product-details.module.scss'
import { GoBack } from 'common/components/go-back/go-back'

export const ProductDetails: FC = () => {
  const params = useParams()
  const { products } = useAppSelector((state) => state.productsReducer)

  const product = useMemo(
    (): IProduct | undefined =>
      products.find((product: IProduct): boolean => product.id === params.id),
    [params.id],
  )

  if (!product) return <Navigate to={PATHS.HOME} />

  return (
    <div className={styles.parent}>
      <GoBack />
      <div className={styles.parentContent}>
        <div className={styles.parentInfo}>
          <div className={styles.parentPhoto}>
            <Carousel dotPosition={'bottom'} className={styles.parentCarousel}>
              {product.images.map((image: any) => (
                <div key={nanoid()} className={styles.parentPhotoContainer}>
                  <img
                    src={image.url}
                    className={styles.parentImage}
                    alt={ALT_IMG.PRODUCT_IMAGE}
                  />
                </div>
              ))}
            </Carousel>
          </div>
          <div className={styles.parentDetails}>
            <div>
              <h1 className={styles.parentTitle}>{product.title}</h1>
              <p className={styles.parentCategory}>
                <span className={styles.parentType}>Categorie:</span>{' '}
                {UtilService.capitalizeString(product.category)}
              </p>
              <p className={styles.parentCategory}>
                <span className={styles.parentType}>Disponbiltate:</span> În
                stoc
              </p>
            </div>
            <p className={styles.parentPrice}>
              {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
              Lei
            </p>
          </div>
        </div>

        <div className={styles.parentDescription}>
          <p className={styles.parentCategory}>Descrierea:</p>
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      </div>
    </div>
  )
}
