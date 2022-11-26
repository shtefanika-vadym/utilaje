import { ReactNode } from 'react'

import { SelectProps } from 'antd/lib/select/index'

export interface ISelect extends SelectProps<any, any> {
  name: string
  listOptions?: any[]
  label?: string | JSX.Element
  suffixSelectedIcon?: ReactNode
}
