import React from 'react'

import { FormikValues, useFormik } from 'formik'
import * as Yup from 'yup'

import loginBg from 'features/login/assets/login-bg.svg'

import { Button } from 'common/components/Button/Button'
import { ALT_IMG, BUTTON_LABELS } from 'common/components/constants/constants'
import { Input } from 'common/components/Input/Input'

import { LOGIN_LABELS } from 'features/login/constants/constants'

import styles from './login.module.scss'

export const Login = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Adresa de email este invalida.')
        .required('Adresa de email este obligatorie'),
      password: Yup.string().required('Parola este obligatorie'),
    }),
    onSubmit: (values: FormikValues) => {
      console.log(values)
    },
  })

  console.log(formik)

  return (
    <div className={styles.parent}>
      <div className={styles.parentContent}>
        <span className={styles.parentFirst}>
          <img
            src={loginBg}
            alt={ALT_IMG.LOGIN_BG}
            className={styles.parentBackgroundImg}
          />
        </span>
        <span className={styles.parentSecond}>
          <h1 className={styles.parentTitle}>{LOGIN_LABELS.LOGIN}</h1>
          <form className={styles.parentForm} onSubmit={formik.handleSubmit}>
            <div className={styles.parentFormItem}>
              <Input
                type='email'
                id='email'
                name='email'
                label='Email'
                placeholder='Email'
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.touched.email && formik.errors.email ? (
                <p className={styles.parentErrorMessage}>
                  {formik.errors.email}
                </p>
              ) : null}
            </div>

            <div className={styles.parentFormItem}>
              <Input
                id='password'
                type='password'
                name='password'
                label='Parola'
                placeholder='Parola'
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              {formik.touched.password && formik.errors.password ? (
                <p className={styles.parentErrorMessage}>
                  {formik.errors.password}
                </p>
              ) : null}
            </div>

            <div className={styles.parentSubmit}>
              <Button htmlType='submit' modifier='primary'>
                {BUTTON_LABELS.LOGIN}
              </Button>
            </div>
          </form>
        </span>
      </div>
    </div>
  )
}
