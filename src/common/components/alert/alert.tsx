import { FC, useEffect } from 'react'

import { notification } from 'antd'

import { IAlert } from 'common/interfaces/IAlert'

export const Alert: FC<IAlert> = ({ title, description, onClose }) => {
  const [api, contextHolder] = notification.useNotification()
  useEffect(() => {
    if (title) {
      api.open({
        key: `open${Date.now()}`,
        message: title,
        description: description,
        onClose: onClose,
      })
      window.setTimeout(() => onClose(), 8000)
    }
  }, [title, description])
  return contextHolder
}
