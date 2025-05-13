import { create } from 'zustand'
import { createUserSlice } from './slices/user.slice'
import type { UserSliceType } from './types/user.types'

export const Store = create<UserSliceType>()((...args) => ({
  ...createUserSlice(...args)
}))
