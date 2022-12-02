import React, { FC } from 'react'

import { Skeleton, Space } from 'antd'
import { nanoid } from 'nanoid'

import { IProduct } from 'common/interfaces/IProduct'

import { Product } from 'features/home/components/product/product'
import { HOME_LABELS } from 'features/home/constants/constants'

import styles from './product-list.module.scss'

interface IProps {
  isFetching: boolean
  products: IProduct[]
  onAddToCart: (product: IProduct) => void
}

export const ProductList: FC<IProps> = ({
  products,
  isFetching,
  onAddToCart,
}) => (
  <div className={styles.parent}>
    {isFetching ? (
      <>
        <Space className={styles.parentSkeletonCard}>
          <Skeleton.Image className={styles.parentSkeletonImg} active />
          <div className={styles.parentSkeletonContent}>
            <Skeleton active paragraph className={styles.parentSkeletonDesc} />
            <Skeleton.Button
              active
              block
              className={styles.parentSkeletonBtn}
            />
          </div>
        </Space>
        <Space className={styles.parentSkeletonCard}>
          <Skeleton.Image className={styles.parentSkeletonImg} active />
          <div className={styles.parentSkeletonContent}>
            <Skeleton active paragraph className={styles.parentSkeletonDesc} />
            <Skeleton.Button
              active
              block
              className={styles.parentSkeletonBtn}
            />
          </div>
        </Space>
        <Space className={styles.parentSkeletonCard}>
          <Skeleton.Image className={styles.parentSkeletonImg} active />
          <div className={styles.parentSkeletonContent}>
            <Skeleton active paragraph className={styles.parentSkeletonDesc} />
            <Skeleton.Button
              active
              block
              className={styles.parentSkeletonBtn}
            />
          </div>
        </Space>
      </>
    ) : !!products.length ? (
      products.map(
        (product: IProduct): JSX.Element => (
          <React.Fragment key={nanoid()}>
            <Product product={product} onAddToCart={onAddToCart} />
          </React.Fragment>
        ),
      )
    ) : (
      <p className='message'>{HOME_LABELS.NO_PRODUCTS}</p>
    )}
  </div>
)
