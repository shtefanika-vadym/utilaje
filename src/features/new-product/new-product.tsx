import React, { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { PlusOutlined } from '@ant-design/icons'
import { InputNumber, Modal, Upload, UploadFile } from 'antd'
import { RcFile, UploadProps } from 'antd/es/upload/index'
import { db, storage } from 'firebaseInit'
import { FormikValues, useFormik } from 'formik'
import { PATHS } from 'layout/paths'
import { nanoid } from 'nanoid'
import { UPDATE_ALERT_INFO } from 'store/alert-slice'
import * as Yup from 'yup'

import { Button } from 'common/components/Button/Button'
import { GoBack } from 'common/components/go-back/go-back'
import { Input } from 'common/components/Input/Input'
import { Select } from 'common/components/select/select'
import { useAppDispatch, useAppSelector } from 'common/hooks/redux'
import { ICategory } from 'common/interfaces/IProduct'
import { AuthService } from 'common/services/auth-service'

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
      images: '',
    },
    validationSchema: Yup.object({
      price: Yup.number().required('Pretul este obligatoriu.'),
      title: Yup.string().required('Titlu este obligatoriu.'),
      description: Yup.string().required('Descrierea este obligatorie.'),
      images: Yup.array()
        .required('Imaginea este obligatorie.')
        .test({
          message: 'Minim 2 imagini',
          test: (arr) => {
            console.log(arr)
            return arr?.length >= 2
          },
        }),
      category: Yup.string().required('Categoria este obligatorie.'),
    }),
    onSubmit: async (values: FormikValues) => {
      try {
        await db.collection('products').add({ ...values, id: nanoid() })
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
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])

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
      <div style={{ marginTop: 8 }}>Încarcă</div>
    </div>
  )

  const handleChange: UploadProps['onChange'] = async ({
    fileList: newFileList,
  }) => {
    const files: string[] = []
    for (let i = 0; i < newFileList.length; i++) {
      const file = newFileList[i]
      const storageRef = storage.ref('products')
      // @ts-ignore
      const fileRef = storageRef.child(file.name)
      await fileRef.put(file.originFileObj)
      const url = await fileRef.getDownloadURL()
      files.push(url)
    }
    setUploadedFiles(newFileList.map((file) => ({ ...file, status: 'done' })))
    formik.setFieldValue('images', files)
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
        <div className={styles.parentField}>
          <label className={styles.parentLabel} htmlFor='description'>
            Pret
          </label>
          <InputNumber
            min={0}
            id='price'
            addonAfter='Lei'
            // @ts-ignore
            value={formik.values.price}
            placeholder='Prețul produsului'
            className='new-product-input-number'
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            // @ts-ignore
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            onChange={(price: number) => formik.setFieldValue('price', price)}
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
        <div className={styles.parentField}>
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
            Imagini
          </label>
          <Upload
            id={'image'}
            listType='picture-card'
            fileList={uploadedFiles}
            onPreview={handlePreview}
            onChange={handleChange}>
            {uploadedFiles.length >= 3 ? null : uploadButton}
          </Upload>
          {formik.touched.images && formik.errors.images ? (
            <p className={styles.parentErrorMessage}>{formik.errors.images}</p>
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
            Adaugă produsul
          </Button>
        </div>
      </form>
    </div>
  )
}
