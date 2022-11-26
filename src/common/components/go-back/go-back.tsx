import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'

import backIcon from 'common/assets/Back.svg'

import { ALT_IMG } from 'common/constants/constants'

import styles from './go-back.module.scss'

export const GoBack = memo(() => {
  const navigate = useNavigate()

  const handleGoBack = (): void => {
    navigate(-1)
  }
  return (
    <button className={styles.parent} onClick={handleGoBack}>
      <img src={backIcon} alt={ALT_IMG.BACK_ICON} />
      Acasa
    </button>
  )
})
