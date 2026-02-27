// 用户角色类型
export const UserRole = {
  OPERATIONS: 'operations', // 运营端
  SALES: 'sales', // 销售端
  SALES_CENTER: 'sales_center', // 销售中心端
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

// 用户信息
export interface User {
  id: string
  username: string
  role: UserRole
  name: string
}

// 登录表单
export interface LoginForm {
  username: string
  password: string
}
