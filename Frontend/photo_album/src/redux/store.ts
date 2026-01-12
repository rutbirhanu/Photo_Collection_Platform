import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import uploadSlice from './uploadSlice'
import eventSlice from './eventSlice'
import albumSlice from './albumSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice,
      event: eventSlice,
      album: albumSlice,
      upload: uploadSlice
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']