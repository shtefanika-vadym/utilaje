import React, { useMemo, useState } from 'react'
import { useToggle } from 'react-use'

import classNames from 'classnames'
import { nanoid } from 'nanoid'

import removeIcon from 'common/assets/REMOVE.svg'
import searchIcon from 'common/assets/search.svg'

import { Button } from 'common/components/Button/Button'
import { Input } from 'common/components/Input/Input'
import { Select } from 'common/components/select/select'
import { ALT_IMG } from 'common/constants/constants'
import { useAppSelector } from 'common/hooks/redux'
import { ICategory, IProduct } from 'common/interfaces/IProduct'
import { AuthService } from 'common/services/auth-service'

import { AddCategoryModal } from 'features/home/components/add-category-modal/add-category-modal'
import { RemoveCategoryModal } from 'features/home/components/remove-category-modal/remove-category-modal'

import styles from './home.module.scss'

export const Home = () => {
  const [removedCategory, setRemovedCategory] = useState<ICategory | null>(null)
  const [isOpenRemoveModal, toggleIsOpenRemoveModal] = useToggle(false)
  const [isOpenAddCategory, toggleIsOpenAddCategory] = useToggle(false)

  const [activeCategory, setActiveCategory] = useState<string>('toate')
  const { categories, products } = useAppSelector(
    (state) => state.productsReducer,
  )

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
    if (activeCategory === 'toate') return products
    return products.filter(
      (product: IProduct): boolean => product.category === activeCategory,
    )
  }, [products, activeCategory])

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
      <div className={styles.parentFilterBlock}>
        <div className={styles.parentSearch}>
          <Input
            name='filter'
            label='Filtrare'
            suffix={<img src={searchIcon} alt={ALT_IMG.SEARCH_ICON} />}
            placeholder='Filtreaza dupa numele produsului...'
          />
        </div>
        <div className={styles.parentSort}>
          <Select
            label={'Sortare'}
            name={'sort'}
            listOptions={[]}
            placeholder={'Sorteaza dupa'}
          />
        </div>
      </div>
      <div className={styles.parentCategoriesContent}>
        <div className={styles.parentCategories}>
          <button
            onClick={() => handleChangeCategory('toate')}
            className={classNames(
              styles.parentCategory,
              'toate' === activeCategory && styles.parentCategoryActive,
            )}>
            toate
          </button>
          {categories?.map(
            (categoryItem: ICategory): JSX.Element => (
              <button
                key={categoryItem.id}
                onClick={() => handleChangeCategory(categoryItem.category)}
                className={classNames(
                  styles.parentCategory,
                  categoryItem.category === activeCategory &&
                    styles.parentCategoryActive,
                )}>
                {categoryItem.category}
                {AuthService.getToken() && (
                  <img
                    src={removeIcon}
                    alt={ALT_IMG.REMOVE_ICON}
                    onClick={(event) => {
                      event.stopPropagation()
                      handleDeleteCategory(categoryItem)
                    }}
                  />
                )}
              </button>
            ),
          )}
        </div>
        {AuthService.getToken() && (
          <Button modifier={'primary'} onClick={toggleIsOpenAddCategory}>
            Adauga o categorie
          </Button>
        )}
      </div>
      <div className={styles.parentProductsList}>
        {adjustedProducts?.map((product: IProduct): JSX.Element => {
          console.log(product)
          return (
            <div className={styles.parentProduct} key={nanoid()}>
              <div>
                <img src={product.image} alt='' />
                <div className={styles.parentProductTitle}>{product.title}</div>
                <p className={styles.parentProductDescription}>
                  {product.description}
                </p>
                <span className={styles.parentProductPrice}>
                  {product.price}Lei
                </span>
              </div>

              <div className={styles.parentProductButton}>
                <Button modifier={'outline'}>Adauga in cos</Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
