import React, { FC } from 'react'

import { nanoid } from 'nanoid'

import { ICategory } from 'common/interfaces/IProduct'

import { Category } from 'features/home/components/category/category'

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
