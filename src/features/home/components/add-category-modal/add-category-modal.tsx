import React, { ChangeEvent, FC, useState } from 'react'

import { Modal } from 'antd'
import { db } from 'firebaseInit'
import { UPDATE_ALERT_INFO } from 'store/alert-slice'

import { Button } from 'common/components/Button/Button'
import { Input } from 'common/components/Input/Input'
import { useAppDispatch } from 'common/hooks/redux'

import styles from './add-category.module.scss'

interface IProps {
  isOpen: boolean
  onClose: () => void
}

export const AddCategoryModal: FC<IProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch()
  const [category, setCategory] = useState<string>('')

  const onCreate = async () => {
    if (!!category.length)
      try {
        onClose()
        await db.collection('categories').add({ category: category })
        dispatch(
          UPDATE_ALERT_INFO({
            title: 'Categorie creată.',
            description: `Categoria ${category} a fost creată cu succes.`,
          }),
        )
        setCategory('')
      } catch (e) {
        dispatch(
          UPDATE_ALERT_INFO({
            title: 'Eroarea la crearea categoriei.',
            description: e.message,
          }),
        )
      } finally {
        setTimeout(() => {
          dispatch(UPDATE_ALERT_INFO(null))
        }, 3000)
      }
  }

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>): void => {
    setCategory(event.target.value)
  }

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={onClose}
      title={'Crează o categorie'}>
      <div className={styles.parent}>
        <h3 className={styles.parentRemoveMessage}>
          Crează o categorie nouă și apoi poți crea produse pentru această
          categorie
        </h3>
        <Input
          value={category}
          name={'creare-categorie'}
          label={'Numele categoriei'}
          placeholder={'Numele categoriei'}
          onChange={handleChangeInput}
        />
        <div className={styles.parentConfirm}>
          <Button modifier={'outline'} onClick={onClose}>
            Înapoi
          </Button>
          <Button modifier={'primary'} onClick={onCreate}>
            Crează
          </Button>
        </div>
      </div>
    </Modal>
  )
}
