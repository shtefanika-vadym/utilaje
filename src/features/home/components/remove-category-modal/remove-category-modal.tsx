import React, { FC } from 'react'

import { Modal } from 'antd'
import { db } from 'firebaseInit'
import { UPDATE_ALERT_INFO } from 'store/alert-slice'

import { Button } from 'common/components/Button/Button'
import { useAppDispatch } from 'common/hooks/redux'
import { ICategory } from 'common/interfaces/IProduct'

import styles from './remove-category-modal.module.scss'

interface IProps {
  isOpen: boolean
  category: ICategory
  onClose: () => void
}

export const RemoveCategoryModal: FC<IProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  const dispatch = useAppDispatch()
  const onRemove = async () => {
    try {
      await db.collection('categories').doc(category.id).delete()
      dispatch(
        UPDATE_ALERT_INFO({
          title: 'Ștergere categorie',
          description: `Categoria ${category.category} a fost creata cu succes.`,
        }),
      )
      onClose()
    } catch (e) {
      dispatch(
        UPDATE_ALERT_INFO({
          title: 'Eroarea la ștergerea categoriei.',
          description: e.message,
        }),
      )
    } finally {
      setTimeout(() => {
        dispatch(UPDATE_ALERT_INFO(null))
      }, 3000)
    }
  }
  return (
    <Modal
      open={isOpen}
      title={'Confirmă ștergerea'}
      footer={null}
      onCancel={onClose}>
      <div className={styles.parent}>
        <h3 className={styles.parentRemoveMessage}>
          Dacă confirmi ștergerea categoriei "{category?.category}" automat vor
          fi șterse toate produsele din această categorie.
        </h3>
        <div className={styles.parentConfirm}>
          <Button modifier={'outline'} onClick={onClose}>
            Înapoi
          </Button>
          <Button modifier={'primary'} onClick={onRemove}>
            Șterge
          </Button>
        </div>
      </div>
    </Modal>
  )
}
