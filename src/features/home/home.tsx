import React from 'react'

import searchIcon from 'common/assets/search.svg'

import { Input } from 'common/components/Input/Input'
import { Select } from 'common/components/select/select'
import { ALT_IMG } from 'common/constants/constants'

import styles from './home.module.scss'

export const Home = () => {
  return (
    <div className={styles.parent}>
      <div className={styles.parentFilterBlock}>
        <div className={styles.parentSearch}>
          <Input
            name='filter'
            label='Filtrare'
            suffix={<img src={searchIcon} alt={ALT_IMG.SEARCH_ICON} />}
            placeholder='Filtreaza dupa numele produsului...'
          />
        </div>

        <div className={styles.parentSort}>
          <Select
            label={'Sortare'}
            name={'sort'}
            listOptions={[]}
            placeholder={'Sorteaza dupa'}
          />
        </div>
      </div>
    </div>
  )
}
