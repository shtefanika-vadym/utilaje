import { combineReducers, configureStore } from '@reduxjs/toolkit'
import productsReducer from 'store/productsSlice'

const rootReducer = combineReducers({
  productsReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  // A non-serializable value was detected in the state
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
