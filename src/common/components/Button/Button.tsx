import React, { FC } from 'react'

import { Button as AtnButton } from 'antd'
import { NativeButtonProps } from 'antd/lib/button/button'
import classNames from 'classnames'

import { UtilService } from 'common/services/services'

// I suppress next line with eslint-disable-next-line because i use dynamic class
// eslint-disable-next-line css-modules/no-unused-class
import styles from './button.module.scss'
import 'antd/lib/button/style/css'

interface IProps extends NativeButtonProps {
  children: JSX.Element | string
  modifier?: 'outline' | 'primary' | 'default'
}

export const Button: FC<IProps> = ({
  children,
  modifier = 'default',
  ...rest
}) => {
  return (
    // I suppress next line with @ts-ignore because there is an error TS2322
    // @ts-ignore
    <AtnButton
      className={classNames(
        styles.button,
        styles[`button${UtilService.capitalizeFirstLetter(modifier)}`],
      )}
      {...rest}>
      {children}
    </AtnButton>
  )
}
