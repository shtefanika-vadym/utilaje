import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IAlert } from 'common/interfaces/IAlert'

const initialState: { alertInfo: IAlert | null } = {
  alertInfo: null,
}

export const alertSlice = createSlice({
  name: 'alert',
  initialState: initialState,
  reducers: {
    UPDATE_ALERT_INFO(state, action: PayloadAction<IAlert | null>) {
      console.log(action.payload)
      state.alertInfo = action.payload
    },
  },
})

export default alertSlice.reducer

export const { UPDATE_ALERT_INFO } = alertSlice.actions
