import React, { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { PlusOutlined } from '@ant-design/icons'
import { Modal, Upload, UploadFile } from 'antd'
import { RcFile, UploadProps } from 'antd/es/upload/index'
import { db, storage } from 'firebaseInit'
import { FormikValues, useFormik } from 'formik'
import { UPDATE_ALERT_INFO } from 'store/alert-slice'
import * as Yup from 'yup'

import { Button } from 'common/components/Button/Button'
import { GoBack } from 'common/components/go-back/go-back'
import { Input } from 'common/components/Input/Input'
import { Select } from 'common/components/select/select'
import { useAppDispatch, useAppSelector } from 'common/hooks/redux'
import { ICategory } from 'common/interfaces/IProduct'
import { AuthService } from 'common/services/auth-service'

import { PATHS } from 'layout/paths'

import styles from './new-product.module.scss'

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

export const NewProduct = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { categories } = useAppSelector((state) => state.productsReducer)
  const formik = useFormik({
    initialValues: {
      price: '',
      title: '',
      category: '',
      description: '',
      image: '',
    },
    validationSchema: Yup.object({
      price: Yup.string().required('Pretul este obligatoriu.'),
      title: Yup.string().required('Titlu este obligatoriu.'),
      description: Yup.string().required('Descrierea este obligatorie.'),
      image: Yup.string().required('Imaginea este obligatorie.'),
      category: Yup.string().required('Categoria este obligatorie.'),
    }),
    onSubmit: async (values: FormikValues) => {
      try {
        console.log(values)
        await db.collection('products').add(values)
        navigate(-1)
        dispatch(
          UPDATE_ALERT_INFO({
            title: 'Produs creat',
            description: 'Produs creat cu succes',
          }),
        )
      } catch (e) {
        dispatch(
          UPDATE_ALERT_INFO({
            title: 'Eroare la cearea produsului',
            description: e.message,
          }),
        )
      } finally {
        setTimeout(() => {
          dispatch(UPDATE_ALERT_INFO(null))
        }, 3000)
      }
    },
  })

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const handleCancel = () => setPreviewOpen(false)

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    )
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Incarca</div>
    </div>
  )

  const handleChange: UploadProps['onChange'] = async ({
    file,
    fileList: newFileList,
  }) => {
    setFileList(newFileList)
    const storageRef = storage.ref('products')
    // @ts-ignore
    const fileRef = storageRef.child(file.name)
    await fileRef.put(file.originFileObj)
    const url = await fileRef.getDownloadURL()
    formik.setFieldValue('image', url)
  }

  const adjustedCategories = useMemo(
    (): string[] =>
      categories.map((category: ICategory): string => category.category),
    [categories],
  )

  if (!AuthService.getToken()) return <Navigate to={PATHS.HOME} />
  return (
    <div className={styles.parent}>
      <div className={styles.parentHead}>
        <GoBack />
      </div>
      <form className={styles.parentForm} onSubmit={formik.handleSubmit}>
        <h1 className={styles.parentTitle}>Adaugarea unui produs</h1>
        <div>
          <Input
            type='text'
            id='title'
            name='title'
            label='Titlu'
            placeholder='Titlu produsului'
            value={formik.values.title}
            onChange={formik.handleChange}
          />
          {formik.touched.title && formik.errors.title ? (
            <p className={styles.parentErrorMessage}>{formik.errors.title}</p>
          ) : null}
        </div>
        <div>
          <Input
            type='text'
            id='price'
            name='price'
            label='Pret'
            placeholder='Pretul produsului'
            value={formik.values.price}
            onChange={formik.handleChange}
          />
          {formik.touched.price && formik.errors.price ? (
            <p className={styles.parentErrorMessage}>{formik.errors.price}</p>
          ) : null}
        </div>
        <div>
          <Select
            id='category'
            name='category'
            label='Categoria'
            placeholder='Categoria produsului'
            value={!formik.values.category ? undefined : formik.values.category}
            onChange={(category: string) =>
              formik.setFieldValue('category', category)
            }
            listOptions={adjustedCategories}
          />
          {formik.touched.category && formik.errors.category ? (
            <p className={styles.parentErrorMessage}>
              {formik.errors.category}
            </p>
          ) : null}
        </div>
        <div className={styles.parentAreaField}>
          <label className={styles.parentLabel} htmlFor='description'>
            Descriere
          </label>
          <textarea
            id={'description'}
            name={'description'}
            onChange={formik.handleChange}
            value={formik.values.description}
            placeholder={'Descrierea produsului'}
            className={styles.parentTextArea}
          />
          {formik.touched.description && formik.errors.description ? (
            <p className={styles.parentErrorMessage}>
              {formik.errors.description}
            </p>
          ) : null}
        </div>

        <div>
          <label className={styles.parentLabel} htmlFor='image'>
            Imagine
          </label>
          <Upload
            id={'image'}
            listType='picture-card'
            fileList={fileList}
            onPreview={handlePreview}
            onChange={(ev: any) => {
              console.log(ev)
              handleChange(ev)
            }}>
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          {formik.touched.image && formik.errors.image ? (
            <p className={styles.parentErrorMessage}>{formik.errors.image}</p>
          ) : null}
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}>
            <img alt='example' style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>

        <div className={styles.parentSubmit}>
          <Button htmlType='submit' modifier='primary'>
            Adauga produsul
          </Button>
        </div>
      </form>
    </div>
  )
}
