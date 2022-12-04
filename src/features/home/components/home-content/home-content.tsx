import React, { ChangeEvent, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useToggle } from 'react-use'

import { PATHS } from 'layout/paths'
import { SET_SEARCH_VALUE, UPDATE_CART } from 'store/products-slice'

import searchIcon from 'common/assets/search.svg'

import { Button } from 'common/components/Button/Button'
import { Input } from 'common/components/Input/Input'
import { ALT_IMG } from 'common/constants/constants'
import { useAppDispatch, useAppSelector } from 'common/hooks/redux'
import { ICategory, IProduct } from 'common/interfaces/IProduct'
import { AuthService } from 'common/services/auth-service'

import { AddCategoryModal } from 'features/home/components/add-category-modal/add-category-modal'
import { CategoryList } from 'features/home/components/category-list/category-list'
import { ProductList } from 'features/home/components/product-list/product-list'
import { RemoveCategoryModal } from 'features/home/components/remove-category-modal/remove-category-modal'
import { HOME_LABELS } from 'features/home/constants/constants'

import styles from './home-content.module.scss'

export const HomeContent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const [removedCategory, setRemovedCategory] = useState<ICategory | null>(null)
  const [isOpenRemoveModal, toggleIsOpenRemoveModal] = useToggle(false)
  const [isOpenAddCategory, toggleIsOpenAddCategory] = useToggle(false)

  const [activeCategory, setActiveCategory] = useState<string>('toate')
  const { categories, products, searchValue, isFetchingProducts } =
    useAppSelector((state) => state.productsReducer)

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

  const handleChangeSearchValue = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    dispatch(SET_SEARCH_VALUE(event.target.value))
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
      <div className={styles.parentSearch}>
        <Input
          name='filter'
          value={searchValue}
          onChange={handleChangeSearchValue}
          suffix={
            <img
              src={searchIcon}
              alt={ALT_IMG.SEARCH_ICON}
              className={styles.parentSearchIcon}
            />
          }
          placeholder='Cauta dupa numele produsului...'
        />
      </div>
      <CategoryList
        categories={categories}
        activeCategoryName={activeCategory}
        handleDeleteCategory={handleDeleteCategory}
        handleChangeCategory={handleChangeCategory}
      />
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
          isFetching={isFetchingProducts}
        />
      )}
    </div>
  )
}
