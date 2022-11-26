import React from 'react'

import logo from 'common/assets/logo.svg'

import { ALT_IMG } from 'common/constants/constants'

// eslint-disable-next-line css-modules/no-unused-class
import styles from './sidebar.module.scss'

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <img className={styles.sidebarLogo} src={logo} alt={ALT_IMG.APP_LOGO} />
      <div className={styles.sidebarNavigation}>
        {/*{navigationItems?.map(*/}
        {/*  (navigationItem: INavigation): JSX.Element => (*/}
        {/*    <NavLink*/}
        {/*      onMouseLeave={() => setHoveredNavigation(null)}*/}
        {/*      onMouseOver={() => handleChangeHoveredIcon(navigationItem.title)}*/}
        {/*      key={nanoid()}*/}
        {/*      className={({ isActive }) =>*/}
        {/*        classNames(styles.navigationItem, isActive && styles.activeNavigationItem)*/}
        {/*      }*/}
        {/*      to={navigationItem.route}>*/}
        {/*      {({ isActive }): JSX.Element => (*/}
        {/*        <>*/}
        {/*          {UtilService.getNavigationIcon(navigationItem.title, hoveredNavigation)}*/}
        {/*          {navigationItem.title}*/}
        {/*          {isActive ? (*/}
        {/*            <img*/}
        {/*              className={styles.activeLink}*/}
        {/*              src={activeLinkIcon}*/}
        {/*              alt={AltImg.activeRouteIcon}*/}
        {/*            />*/}
        {/*          ) : (*/}
        {/*            hoveredNavigation === navigationItem.title && (*/}
        {/*              <img*/}
        {/*                className={styles.activeLinkHovered}*/}
        {/*                src={activeLinkHoverIcon}*/}
        {/*                alt={AltImg.activeRouteIcon}*/}
        {/*              />*/}
        {/*            )*/}
        {/*          )}*/}
        {/*        </>*/}
        {/*      )}*/}
        {/*    </NavLink>*/}
        {/*  ),*/}
        {/*)}*/}
      </div>
    </div>
  )
}

export default Sidebar
