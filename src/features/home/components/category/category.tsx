import React, { FC } from 'react'

import classNames from 'classnames'

import removeIcon from 'common/assets/REMOVE.svg'

import { ALT_IMG } from 'common/constants/constants'
import { ICategory } from 'common/interfaces/IProduct'

interface IProps {
  user: any
  category: ICategory
  activeCategoryName: string
  handleChangeCategory: (categoryName: string) => void
  handleDeleteCategory: (categoryName: ICategory) => void
}

export const Category: FC<IProps> = ({
  user,
  category,
  activeCategoryName,
  handleChangeCategory,
  handleDeleteCategory,
}) => (
  <button
    onClick={() => handleChangeCategory(category.category)}
    className={classNames(
      'category',
      category.category === activeCategoryName && 'activeCategory',
    )}>
    {category.category}
    {user && (
      <img
        src={removeIcon}
        alt={ALT_IMG.REMOVE_ICON}
        onClick={(event) => {
          event.stopPropagation()
          handleDeleteCategory(category)
        }}
      />
    )}
  </button>
)
