import React, { FC } from 'react'

import { IProduct } from 'common/interfaces/IProduct'

import { CartProduct } from 'features/cart/components/cart-product/cart-product'

import styles from './cart-product-list.module.scss'

interface IProps {
  products: IProduct[]
  handleRemoveProduct: (product: IProduct) => void
  handleChangeTotalProduct: (product: IProduct, total: number) => void
}

export const CartProductList: FC<IProps> = ({
  products,
  handleRemoveProduct,
  handleChangeTotalProduct,
}) => (
  <div className={styles.parent}>
    {products.map(
      (product: IProduct): JSX.Element => (
        <React.Fragment key={product.id}>
          <CartProduct
            product={product}
            handleRemoveProduct={handleRemoveProduct}
            handleChangeTotalProduct={handleChangeTotalProduct}
          />
        </React.Fragment>
      ),
    )}
  </div>
)
