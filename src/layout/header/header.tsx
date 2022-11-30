import React, { ChangeEvent, FC, useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { PATHS } from 'layout/paths'
import { SET_SEARCH_VALUE } from 'store/products-slice'

import cartIcon from 'common/assets/cart.svg'
import logo from 'common/assets/logo.svg'
import searchIcon from 'common/assets/search.svg'

import { Input } from 'common/components/Input/Input'
import { ALT_IMG } from 'common/constants/constants'
import { useAppDispatch, useAppSelector } from 'common/hooks/redux'
import { IProduct } from 'common/interfaces/IProduct'

import styles from './header.module.scss'

const Header: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const headerRef = useRef<HTMLElement>(null)

  const { searchValue, cart } = useAppSelector((state) => state.productsReducer)

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

  const cartPrice = useMemo(
    (): string =>
      cart
        .reduce((acc: number, val: IProduct) => acc + val.price * val?.total, 0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    [cart],
  )

  const handleGoToCart = (): void => {
    if (location.pathname !== PATHS.CART) navigate(PATHS.CART)
  }

  const handleChangeSearchValue = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    dispatch(SET_SEARCH_VALUE(event.target.value))
  }

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerDefault}>
          <img
            src={logo}
            alt={ALT_IMG.APP_LOGO}
            className={styles.headerLogo}
          />
          <Input
            name='filter'
            value={searchValue}
            onChange={handleChangeSearchValue}
            suffix={<img src={searchIcon} alt={ALT_IMG.SEARCH_ICON} />}
            placeholder='Cauta dupa numele produsului...'
          />
        </div>

        <button className={styles.headerBtn} onClick={handleGoToCart}>
          <img
            className={styles.headerCartIcon}
            src={cartIcon}
            alt={ALT_IMG.CART_ICON}
          />
          {cartPrice} Lei
        </button>
      </div>
    </header>
  )
}

export default Header
