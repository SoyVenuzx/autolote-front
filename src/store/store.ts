import { create } from 'zustand'
import { createUserSlice } from './slices/user.slice'
import type { UserSliceType } from './types/user.types'
import { createEmployeeSlice } from './slices/employee.slice'
import type { EmployeeSliceType } from './types/employee.types'

export const Store = create<UserSliceType & EmployeeSliceType>()((...args) => ({
  ...createUserSlice(...args),
  ...createEmployeeSlice(...args)
}))
