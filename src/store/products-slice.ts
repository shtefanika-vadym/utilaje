import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ICategory, IProduct } from 'common/interfaces/IProduct'

interface IProductsSlice {
  categories: ICategory[]
  products: IProduct[]
}

const initialState: IProductsSlice = {
  categories: [],
  products: [],
}

export const products = createSlice({
  name: 'products',
  initialState: initialState,
  reducers: {
    UPDATE_CATEGORIES(state, action: PayloadAction<ICategory[]>) {
      state.categories = action.payload
    },

    UPDATE_PRODUCTS(state, action: PayloadAction<IProduct[]>) {
      state.products = action.payload
    },
  },
})

export default products.reducer

export const { UPDATE_CATEGORIES, UPDATE_PRODUCTS } = products.actions
