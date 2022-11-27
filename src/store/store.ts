import { combineReducers, configureStore } from '@reduxjs/toolkit'
import alertReducer from 'store/alert-slice'
import productsReducer from 'store/products-slice'

const rootReducer = combineReducers({
  productsReducer,
  alertReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  // A non-serializable value was detected in the state
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
