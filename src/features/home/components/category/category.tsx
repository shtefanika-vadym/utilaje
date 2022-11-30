import React, { FC } from 'react'

import classNames from 'classnames'

import removeIcon from 'common/assets/REMOVE.svg'

import { ALT_IMG } from 'common/constants/constants'
import { ICategory } from 'common/interfaces/IProduct'
import { AuthService } from 'common/services/auth-service'

interface IProps {
  category: ICategory
  activeCategoryName: string
  handleChangeCategory: (categoryName: string) => void
  handleDeleteCategory: (categoryName: ICategory) => void
}

export const Category: FC<IProps> = ({
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
    {AuthService.getToken() && (
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
