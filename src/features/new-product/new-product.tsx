import React, { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import { PlusOutlined } from '@ant-design/icons'
import { InputNumber, Modal, Upload, UploadFile } from 'antd'
import { RcFile, UploadProps } from 'antd/es/upload/index'
import { db, storage } from 'firebaseInit'
import { FormikValues, useFormik } from 'formik'
import { PATHS } from 'layout/paths'
import { nanoid } from 'nanoid'
import { UPDATE_ALERT_INFO } from 'store/alert-slice'
import * as Yup from 'yup'
import ReactQuill from 'react-quill'

import { Button } from 'common/components/Button/Button'
import { GoBack } from 'common/components/go-back/go-back'
import { Input } from 'common/components/Input/Input'
import { Select } from 'common/components/select/select'
import { useAppDispatch, useAppSelector } from 'common/hooks/redux'
import { ICategory, IProduct } from 'common/interfaces/IProduct'

import styles from './new-product.module.scss'
import 'react-quill/dist/quill.snow.css'

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

export const NewProduct = () => {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { categories, products, user } = useAppSelector(
    (state) => state.productsReducer,
  )

  const product = useMemo(
    (): IProduct | undefined =>
      products.find((product: IProduct): boolean => product.id === params.id),
    [params.id],
  )

  useEffect(() => {
    if (product) setUploadedFiles(product.images)
  }, [product])

  const formik = useFormik({
    initialValues: product || {
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
            return arr?.length >= 2
          },
        }),
      category: Yup.string().required('Categoria este obligatorie.'),
    }),
    onSubmit: async (values: FormikValues) => {
      if (params?.id) handleUpdateProduct(values)
      else handleCreateProduct(values)
    },
  })

  const handleUpdateProduct = async (values: FormikValues): Promise<void> => {
    try {
      await db
        .collection('products')
        .doc(values.id)
        .update({ ...values, images: JSON.stringify(values.images) })
      navigate(-1)
      dispatch(
        UPDATE_ALERT_INFO({
          title: 'Produs modificat',
          description: 'Produsul a fost modificat cu succes',
        }),
      )
    } catch (e) {
      dispatch(
        UPDATE_ALERT_INFO({
          title: 'Eroare la modificarea produsului',
          description: e.message,
        }),
      )
    } finally {
      setTimeout(() => {
        dispatch(UPDATE_ALERT_INFO(null))
      }, 3000)
    }
  }

  const handleCreateProduct = async (values: FormikValues): Promise<void> => {
    try {
      await db
        .collection('products')
        .add({ ...values, images: JSON.stringify(values.images), id: nanoid() })
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
  }

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
    const files: any[] = []
    for (let i = 0; i < newFileList.length; i++) {
      const file = newFileList[i]
      const storageRef = storage.ref('products')
      // @ts-ignore
      const fileRef = storageRef.child(file.name)
      await fileRef.put(file.originFileObj)
      const url = await fileRef.getDownloadURL()
      files.push({ ...file, status: 'done', url: url })
    }
    setUploadedFiles(files)
    formik.setFieldValue('images', files)
  }

  const adjustedCategories = useMemo(
    (): string[] =>
      categories.map((category: ICategory): string => category.category),
    [categories],
  )

  const handleRemoveProduct = async (): Promise<void> => {
    try {
      await db.collection('products').doc(params?.id).delete()
      navigate(-1)
      dispatch(
        UPDATE_ALERT_INFO({
          title: 'Produs șters',
          description: 'Produsul a fost șters cu succes',
        }),
      )
    } catch (e) {
      dispatch(
        UPDATE_ALERT_INFO({
          title: 'Eroare la ștergerea produsului',
          description: e.message,
        }),
      )
    } finally {
      setTimeout(() => {
        dispatch(UPDATE_ALERT_INFO(null))
      }, 3000)
    }
  }

  if (!user || (!product && params?.id)) return <Navigate to={PATHS.HOME} />
  return (
    <div className={styles.parent}>
      <GoBack />
      <form className={styles.parentForm} onSubmit={formik.handleSubmit}>
        <h1 className={styles.parentTitle}>
          {params.id ? 'Modificarea produsului' : 'Adaugarea unui produs'}
        </h1>
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
          <label className={styles.parentLabel} htmlFor='price'>
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
          <ReactQuill
            theme='snow'
            id={'description'}
            value={formik.values.description}
            onChange={(value: string) =>
              formik.setFieldValue('description', value)
            }
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
            {params.id ? 'Modifică produsul' : 'Adaugă produsul'}
          </Button>
        </div>
        {params.id && (
          <Button onClick={handleRemoveProduct} modifier='outline'>
            Șterge produsul
          </Button>
        )}
      </form>
    </div>
  )
}
