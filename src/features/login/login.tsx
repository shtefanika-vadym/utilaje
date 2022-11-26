import React, { ChangeEvent, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from 'firebaseInit'
import { FormikValues, useFormik } from 'formik'
import * as Yup from 'yup'

import logo from 'common/assets/logo.svg'
import loginBg from 'features/login/assets/login-bg.svg'

import { Button } from 'common/components/Button/Button'
import { Input } from 'common/components/Input/Input'
import { ALT_IMG, BUTTON_LABELS } from 'common/constants/constants'
import { AuthService } from 'common/services/auth-service'

import { PATHS } from 'layout/paths'

import { LOGIN_LABELS } from 'features/login/constants/constants'

import styles from './login.module.scss'

export const Login = () => {
  const [loginError, setLoginError] = useState<string | null>(null)
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
    onSubmit: async (values: FormikValues) => {
      try {
        const credentials = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password,
        )
        AuthService.setToken(credentials.user.refreshToken)
      } catch (e) {
        let errorMessage = e.message.split('/')
        errorMessage = errorMessage[errorMessage.length - 1]
          .replace(').', '')
          .replaceAll('-', ' ')
        setLoginError(errorMessage)
      }
    },
  })

  if (AuthService.getToken()) return <Navigate to={PATHS.HOME} replace />

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
          <img
            className={styles.parentLogo}
            src={logo}
            alt={ALT_IMG.APP_LOGO}
          />
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
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  formik.handleChange(event)
                  if (loginError) setLoginError(null)
                }}
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
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  formik.handleChange(event)
                  if (loginError) setLoginError(null)
                }}
              />
              {formik.touched.password && formik.errors.password ? (
                <p className={styles.parentErrorMessage}>
                  {formik.errors.password}
                </p>
              ) : null}
            </div>

            {loginError ? (
              <p className={styles.parentLoginErrorMessage}>{loginError}</p>
            ) : null}

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
