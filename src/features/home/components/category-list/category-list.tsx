import React, { FC } from 'react'

import classNames from 'classnames'
import { nanoid } from 'nanoid'

import { ICategory } from 'common/interfaces/IProduct'

import { Category } from 'features/home/components/category/category'
import { HOME_LABELS } from 'features/home/constants/constants'

import styles from './category-list.module.scss'

interface IProps {
  categories: ICategory[]
  activeCategoryName: string
  handleChangeCategory: (categoryName: string) => void
  handleDeleteCategory: (categoryName: ICategory) => void
}

export const CategoryList: FC<IProps> = ({
  categories,
  activeCategoryName,
  handleDeleteCategory,
  handleChangeCategory,
}) => (
  <div className={styles.parent}>
    <button
      onClick={() => handleChangeCategory('toate')}
      className={classNames(
        'category',
        'toate' === activeCategoryName && 'activeCategory',
      )}>
      {HOME_LABELS.ALL}
    </button>
    {categories.map(
      (category: ICategory): JSX.Element => (
        <React.Fragment key={nanoid()}>
          <Category
            category={category}
            activeCategoryName={activeCategoryName}
            handleChangeCategory={handleChangeCategory}
            handleDeleteCategory={handleDeleteCategory}
          />
        </React.Fragment>
      ),
    )}
  </div>
)
