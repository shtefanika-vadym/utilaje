import React, { FC } from 'react'

import { Select as AntSelect } from 'antd'
import { nanoid } from 'nanoid'

import stateIcon from 'common/assets/state-dropdown.svg'

import { ALT_IMG } from 'common/constants/constants'
import { ISelect } from 'common/interfaces/ISelect'

import styles from './select.module.scss'

const { Option } = AntSelect

export const Select: FC<ISelect> = ({
  label,
  suffixSelectedIcon,
  name,
  listOptions,
  ...rest
}) => {
  return (
    <>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <AntSelect
        {...rest}
        id={name}
        suffixIcon={<img src={stateIcon} alt={ALT_IMG.STATUS_ICON} />}
        optionFilterProp='children'
        className={styles.parent}
        filterOption={(input, option) =>
          (option!.children as unknown as string)
            .toLowerCase()
            .includes(input.toLowerCase())
        }>
        {listOptions?.map((option: any) => {
          return (
            <Option
              key={nanoid()}
              value={option?.category || option?.id || option?.value || option}>
              {option.name || option}
            </Option>
          )
        })}
      </AntSelect>
    </>
  )
}
