import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ICategory, IProduct } from 'common/interfaces/IProduct'

interface IProductsSlice {
  categories: ICategory[]
  isFetchingProducts: boolean
  products: IProduct[]
  searchValue: string
  cart: IProduct[]
}

const initialState: IProductsSlice = {
  categories: [],
  products: [],
  searchValue: '',
  cart: [],
  isFetchingProducts: false,
}

export const products = createSlice({
  name: 'products',
  initialState: initialState,
  reducers: {
    SET_IS_FETCHING_PRODUCTS(state, action: PayloadAction<boolean>) {
      state.isFetchingProducts = action.payload
    },

    UPDATE_CATEGORIES(state, action: PayloadAction<ICategory[]>) {
      state.categories = action.payload
    },

    UPDATE_PRODUCTS(state, action: PayloadAction<IProduct[]>) {
      state.products = action.payload
    },

    UPDATE_CART(state, action: PayloadAction<IProduct>) {
      const { cart } = state
      if (
        cart.some(
          (product: IProduct): boolean => product.id === action.payload.id,
        )
      )
        state.cart = cart.map(
          (product: IProduct): IProduct =>
            product.id === action.payload.id
              ? { ...product, total: product.total + 1 }
              : product,
        )
      else state.cart.push({ ...action.payload, total: 1 })
    },

    UPDATE_TOTAL_PRODUCT(state, action: PayloadAction<IProduct>) {
      state.cart = state.cart.map(
        (product: IProduct): IProduct =>
          product.id === action.payload.id ? action.payload : product,
      )
    },

    SET_SEARCH_VALUE(state, action: PayloadAction<string>) {
      state.searchValue = action.payload
    },

    SET_CART(state, action: PayloadAction<IProduct[]>) {
      state.cart = action.payload
    },

    FILTER_CART(state, action: PayloadAction<IProduct>) {
      state.cart = state.cart.filter(
        (product: IProduct) => product.id !== action.payload.id,
      )
    },
  },
})

export default products.reducer

export const {
  UPDATE_CATEGORIES,
  UPDATE_CART,
  UPDATE_TOTAL_PRODUCT,
  SET_CART,
  FILTER_CART,
  SET_SEARCH_VALUE,
  UPDATE_PRODUCTS,
  SET_IS_FETCHING_PRODUCTS,
} = products.actions
