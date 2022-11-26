import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

export const products = createSlice({
  name: 'products',
  initialState: initialState,
  reducers: {},
})

export default products.reducer

export const {} = products.actions
