import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useToggle } from 'react-use'

import classNames from 'classnames'
import { db } from 'firebaseInit'
import { PATHS } from 'layout/paths'
import { UPDATE_CART, UPDATE_CATEGORIES } from 'store/products-slice'

import { Button } from 'common/components/Button/Button'
import { useAppDispatch, useAppSelector } from 'common/hooks/redux'
import { ICategory, IProduct } from 'common/interfaces/IProduct'
import { AuthService } from 'common/services/auth-service'

import { AddCategoryModal } from 'features/home/components/add-category-modal/add-category-modal'
import { CategoryList } from 'features/home/components/category-list/category-list'
import { ProductList } from 'features/home/components/product-list/product-list'
import { RemoveCategoryModal } from 'features/home/components/remove-category-modal/remove-category-modal'
import { HOME_LABELS } from 'features/home/constants/constants'

import styles from './home.module.scss'

export const Home = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const [removedCategory, setRemovedCategory] = useState<ICategory | null>(null)
  const [isOpenRemoveModal, toggleIsOpenRemoveModal] = useToggle(false)
  const [isOpenAddCategory, toggleIsOpenAddCategory] = useToggle(false)
  const [isFetchingCategories, toggleIsFetchingCategories] = useToggle(false)

  const [activeCategory, setActiveCategory] = useState<string>('toate')
  const { categories, products, searchValue } = useAppSelector(
    (state) => state.productsReducer,
  )

  // const firebaseCategories = useFirebaseTable('categories')
  // const firebaseProducts = useFirebaseTable('products')

  useEffect(() => {
    const fetchCategoryData = async () => {
      toggleIsFetchingCategories()
      try {
        const collectionRef = db.collection('categories')
        await collectionRef.onSnapshot((docSnapshot) => {
          const data = docSnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as ICategory[]
          dispatch(UPDATE_CATEGORIES(data))
        })
      } catch (e) {
        console.error(e.message)
      } finally {
        toggleIsFetchingCategories()
      }
    }
    fetchCategoryData()
  }, [])

  const handleChangeCategory = (category: string): void => {
    setActiveCategory(category)
  }

  const handleDeleteCategory = (category: ICategory) => {
    setRemovedCategory(category)
    toggleIsOpenRemoveModal()
  }

  const handleCloseModal = () => {
    toggleIsOpenRemoveModal()
    setRemovedCategory(null)
  }

  const adjustedProducts = useMemo((): IProduct[] => {
    const filteredProducts = products.filter((product: IProduct): boolean =>
      product.title?.toLowerCase().includes(searchValue?.toLowerCase()),
    )
    if (activeCategory === 'toate') return filteredProducts
    return filteredProducts.filter(
      (product: IProduct): boolean => product.category === activeCategory,
    )
  }, [products, activeCategory, searchValue])

  const isEmptyCategory = useMemo(
    () =>
      !products.filter(
        (product: IProduct): boolean => product.category === activeCategory,
      ).length && activeCategory !== 'toate',
    [products, activeCategory],
  )

  const handleNavigateToAddProducts = (): void => {
    if (!location.pathname.includes(PATHS.ADD_PRODUCT))
      navigate(PATHS.ADD_PRODUCT)
  }

  const handleUpdateCart = (product: IProduct): void => {
    dispatch(UPDATE_CART(product))
  }

  return (
    <div className={styles.parent}>
      <RemoveCategoryModal
        isOpen={isOpenRemoveModal}
        category={removedCategory}
        onClose={handleCloseModal}
      />
      <AddCategoryModal
        isOpen={isOpenAddCategory}
        onClose={toggleIsOpenAddCategory}
      />
      <div className={styles.parentCategoriesContent}>
        <div className={styles.parentCategories}>
          <button
            onClick={() => handleChangeCategory('toate')}
            className={classNames(
              'category',
              'toate' === activeCategory && 'activeCategory',
            )}>
            {HOME_LABELS.ALL}
          </button>
          <CategoryList
            categories={categories}
            activeCategoryName={activeCategory}
            handleDeleteCategory={handleDeleteCategory}
            handleChangeCategory={handleChangeCategory}
          />
        </div>
        {AuthService.getToken() && (
          <div className={styles.parentManager}>
            <Button modifier={'outline'} onClick={toggleIsOpenAddCategory}>
              {HOME_LABELS.ADD_CATEGORY}
            </Button>
            <Button modifier={'primary'} onClick={handleNavigateToAddProducts}>
              {HOME_LABELS.ADD_PRODUCT}
            </Button>
          </div>
        )}
      </div>
      {!!products.length &&
      !isEmptyCategory &&
      !adjustedProducts.length &&
      !!searchValue.length ? (
        <p className='message' style={{ margin: '40px 0 0 0' }}>
          {HOME_LABELS.NO_PRODUCT_BY}"{searchValue}"
        </p>
      ) : (
        <ProductList
          products={adjustedProducts}
          onAddToCart={handleUpdateCart}
          isFetching={isFetchingCategories}
        />
      )}
    </div>
  )
}
