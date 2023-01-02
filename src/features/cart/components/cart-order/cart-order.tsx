import React, { useMemo } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import emailjs from '@emailjs/browser'
import { db } from 'firebaseInit'
import { FormikValues, useFormik } from 'formik'
import { PATHS } from 'layout/paths'
import { nanoid } from 'nanoid'

import * as Yup from 'yup'
import { Button } from 'common/components/Button/Button'
import { Input } from 'common/components/Input/Input'
import { Select } from 'common/components/select/select'
import { useAppDispatch, useAppSelector } from 'common/hooks/redux'
import { IProduct } from 'common/interfaces/IProduct'

import { RO_COUNTY } from 'features/cart/constants/county'
import { SET_CART } from 'store/products-slice'
import { UPDATE_ALERT_INFO } from 'store/alert-slice'
import { GoBack } from 'common/components/go-back/go-back'

import styles from './cart-order.module.scss'
import { useToggle } from 'react-use'

export const CartOrder = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [loading, toggleIsLoading] = useToggle(false)
  const { cart } = useAppSelector((state: any) => state.productsReducer)

  const cartPrice = useMemo(
    (): number =>
      cart.reduce(
        (acc: number, val: IProduct) => acc + val.price * val?.total,
        0,
      ),
    [cart],
  )

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      county: '',
      town: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Numele este obligatoriu.'),
      lastName: Yup.string().required('Prenumele este obligatoriu.'),
      phone: Yup.number()
        .required('Numărul de telefon este obligatoriu.')
        .min(9),
      address: Yup.string().required('Adresa este obligatorie.'),
      county: Yup.string().required('Județul este obligatoriu.'),
      town: Yup.string().required('Localitatea este obligatorie.'),
    }),
    onSubmit: async (values: FormikValues) => {
      toggleIsLoading()
      const orderId: string = nanoid()
      const orderDetails = {
        ...values,
        id: orderId,
      }
      try {
        await db.collection('orders').add({
          id: orderId,
          price: cartPrice,
          userDetails: values,
          products: cart,
          finished: false,
        })
        dispatch(
          UPDATE_ALERT_INFO({
            title: 'Comandă creată cu succes.',
            description: 'Comanda o fost creată, curând veți fi contactat.',
          }),
        )
        dispatch(SET_CART([]))
        navigate(PATHS.HOME)
        emailjs.send(
          'service_0zf68ur',
          'template_2gi9hch',
          orderDetails,
          'uBCaKes6Zz4v4RQFl',
        )
      } catch (e) {
        dispatch(
          UPDATE_ALERT_INFO({
            title: 'Eroare la cearea comenzii.',
            description: 'Vă rugăm mai încercați odată.',
          }),
        )
      } finally {
        setTimeout(() => {
          dispatch(UPDATE_ALERT_INFO(null))
        }, 3000)
      }
    },
  })

  const countyList = useMemo(
    (): string[] => RO_COUNTY.map((county: any): string => county.nume),
    [],
  )

  const townList = useMemo(
    () =>
      RO_COUNTY.find(
        (county: any): boolean => county.nume === formik.values.county,
      )?.localitati.map((town: any): string => town.nume),
    [formik.values.county],
  )

  if (
    !cart.length &&
    !JSON.parse(window.localStorage.getItem('utilajes-cos')).length
  )
    return <Navigate to={PATHS.HOME} />

  return (
    <div className={styles.parent}>
      <GoBack />
      <form className={styles.parentForm} onSubmit={formik.handleSubmit}>
        <h1 className={styles.parentTitle}>Finalizare comandă</h1>
        <div>
          <Input
            type='text'
            id='firstName'
            name='firstName'
            label='Nume'
            placeholder='Nume'
            value={formik.values.firstName}
            onChange={formik.handleChange}
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <p className={styles.parentErrorMessage}>
              {formik.errors.firstName}
            </p>
          ) : null}
        </div>
        <div>
          <Input
            type='text'
            id='lastName'
            name='lastName'
            label='Prenume'
            placeholder='Prenume'
            value={formik.values.lastName}
            onChange={formik.handleChange}
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <p className={styles.parentErrorMessage}>
              {formik.errors.lastName}
            </p>
          ) : null}
        </div>
        <div>
          <Input
            type='text'
            id='phone'
            name='phone'
            label='Număr de telefon'
            placeholder='Număr de telefon'
            value={formik.values.phone}
            onChange={formik.handleChange}
          />
          {formik.touched.phone && formik.errors.phone ? (
            <p className={styles.parentErrorMessage}>{formik.errors.phone}</p>
          ) : null}
        </div>
        <div>
          <Input
            type='text'
            id='address'
            name='address'
            label='Adresa'
            placeholder='Adresa'
            value={formik.values.address}
            onChange={formik.handleChange}
          />
          {formik.touched.address && formik.errors.address ? (
            <p className={styles.parentErrorMessage}>{formik.errors.address}</p>
          ) : null}
        </div>
        <div>
          <Select
            showSearch
            id='country'
            name='country'
            label='Județul'
            placeholder='Județul'
            value={!formik.values.county ? undefined : formik.values.county}
            onChange={(selectedCounty: string) =>
              formik.setFieldValue('county', selectedCounty)
            }
            listOptions={countyList}
          />
          {formik.touched.county && formik.errors.county ? (
            <p className={styles.parentErrorMessage}>{formik.errors.county}</p>
          ) : null}
        </div>

        <div>
          <Select
            id='town'
            showSearch
            name='town'
            label='Localitatea'
            placeholder='Localitatea'
            disabled={!formik.values.county}
            value={!formik.values.town ? undefined : formik.values.town}
            onChange={(selectedTown: string) =>
              formik.setFieldValue('town', selectedTown)
            }
            listOptions={townList}
          />
          {formik.touched.county && formik.errors.county ? (
            <p className={styles.parentErrorMessage}>{formik.errors.county}</p>
          ) : null}
        </div>

        <div className={styles.parentSubmit}>
          <Button disabled={loading} htmlType='submit' modifier='primary'>
            Trimite comanda
          </Button>
        </div>
      </form>
    </div>
  )
}
