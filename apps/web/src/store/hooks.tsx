import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, RootDispatch } from './index'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<RootDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
