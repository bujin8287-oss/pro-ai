import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts'
import { UserRole } from '@/types'
import './LoginPage.css'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // 模拟登录逻辑 - 根据用户名判断角色
    // 实际项目中应该调用后端 API
    let role: UserRole
    let name: string

    if (username.includes('operations') || username.includes('运营')) {
      role = UserRole.OPERATIONS
      name = '运营管理员'
    } else if (username.includes('center') || username.includes('中心')) {
      role = UserRole.SALES_CENTER
      name = '机构中心管理员'
    } else {
      role = UserRole.SALES
      name = '机构人员'
    }

    const user = {
      id: Date.now().toString(),
      username,
      role,
      name,
    }

    login(user)

    // 根据角色跳转到对应的主页
    switch (role) {
      case UserRole.OPERATIONS:
        navigate('/operations')
        break
      case UserRole.SALES:
        navigate('/sales')
        break
      case UserRole.SALES_CENTER:
        navigate('/sales-center')
        break
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">登录</div>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="请输入用户名"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="请输入登录密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            登录
          </button>
        </form>
        <div className="login-tips">
          <p>测试账号提示：</p>
          <p>- 用户名包含 "operations" 或 "运营" → 运营端</p>
          <p>- 用户名包含 "center" 或 "中心" → 机构中心端</p>
          <p>- 其他用户名 → 机构端</p>
        </div>
      </div>
    </div>
  )
}
