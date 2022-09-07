import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

export function makeStore() {
  return configureStore({
    reducer: {},
  })
}
const store = makeStore()

export type RootState = ReturnType<typeof store.getState>

export type RootDispatch = typeof store.dispatch

export type RootThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>

export default store
