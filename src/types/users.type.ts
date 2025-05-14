export interface Role {
  name: string
}

export interface TableUser {
  id: string
  email: string
  username: string
  isActive: boolean
  lastLogin: string
  roles: Role[]
}

export interface UpdateRole {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export interface UpdateUser {
  id: string
  email: string
  username: string
  isActive: boolean
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
  roles: UpdateRole[]
}
