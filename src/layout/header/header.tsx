import React, { FC, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import classNames from 'classnames'

import cartIcon from 'common/assets/cart.svg'
import logo from 'common/assets/logo.svg'

import { ALT_IMG } from 'common/constants/constants'
import { AuthService } from 'common/services/auth-service'

import { PATHS } from 'layout/paths'

import styles from './header.module.scss'

const Header: FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 0 && headerRef && headerRef.current)
        headerRef.current.classList.add(styles.headerSticky)
      else if (
        headerRef &&
        headerRef.current &&
        headerRef.current.classList.contains(styles.headerSticky)
      )
        headerRef.current.classList.remove(styles.headerSticky)
    }
    document.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleNavigateToAddProducts = (): void => {
    if (!location.pathname.includes(PATHS.ADD_PRODUCT))
      navigate(PATHS.ADD_PRODUCT)
  }

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.headerContent}>
        <img src={logo} alt={ALT_IMG.APP_LOGO} className={styles.headerLogo} />
        {!AuthService.getToken() ? (
          <button className={styles.headerBtn}>
            <span className={classNames(styles.headerCart, styles.headerPrice)}>
              20 RON
            </span>
            <span className={classNames(styles.headerCart, styles.headerTotal)}>
              <img className={styles.headerCartIcon} src={cartIcon} alt='' />3
            </span>
          </button>
        ) : (
          <button
            onClick={handleNavigateToAddProducts}
            className={classNames(styles.headerBtn, styles.headerCart)}>
            Adauga produse
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
