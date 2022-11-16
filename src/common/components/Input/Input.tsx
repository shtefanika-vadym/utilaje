import React, { FC } from 'react'

import { Input as AntInput, InputProps } from 'antd'

import styles from './input.module.scss'

interface IProps extends InputProps {
  name: string
  label?: string | JSX.Element
}

export const Input: FC<IProps> = ({ label, name, ...rest }) => {
  return (
    <>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.container}>
        <AntInput id={name} {...rest} />
      </div>
    </>
  )
}
