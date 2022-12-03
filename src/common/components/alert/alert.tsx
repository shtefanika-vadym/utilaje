import { FC } from 'react'

import { Alert as AntAlert } from 'antd'

import closeIcon from 'common/assets/REMOVE.svg'

import { ALT_IMG } from 'common/constants/constants'
import { IAlert } from 'common/interfaces/IAlert'

import styles from './alerts.module.scss'

export const Alert: FC<IAlert> = ({ title, description, onClose }) => (
  <AntAlert
    closable
    type='error'
    onClose={onClose}
    closeIcon={
      <img
        src={closeIcon}
        className={styles.parentCloseIcon}
        alt={ALT_IMG.REMOVE_ICON}
      />
    }
    message={
      <>
        <div className={styles.parentTitle}>{title}</div>
        <p className={styles.parentDescription}>{description}</p>
      </>
    }
    className={styles.parent}
  />
)
