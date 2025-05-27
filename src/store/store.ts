import { create } from 'zustand'

import type { ClienteSliceType } from './types/client.type'
import type { EmployeeSliceType } from './types/employee.types'
import type { GlobalSliceType } from './types/globalData.type'
import type { SupplierSliceType } from './types/supplier.type'
import type { UserSliceType } from './types/user.types'
import type { VehiculoSliceType } from './types/vehicle.types'

import { createClienteSlice } from './slices/client.slice'
import { createEmployeeSlice } from './slices/employee.slice'
import { createGlobalSlice } from './slices/global.slice'
import { createSupplierSlice } from './slices/supplier.slice'
import { createUserSlice } from './slices/user.slice'
import { createVehiculoSlice } from './slices/vehicle.slice'

export const Store = create<
  UserSliceType &
    EmployeeSliceType &
    GlobalSliceType &
    ClienteSliceType &
    VehiculoSliceType &
    SupplierSliceType
>()((...args) => ({
  ...createUserSlice(...args),
  ...createEmployeeSlice(...args),
  ...createGlobalSlice(...args),
  ...createClienteSlice(...args),
  ...createVehiculoSlice(...args),
  ...createSupplierSlice(...args)
}))
