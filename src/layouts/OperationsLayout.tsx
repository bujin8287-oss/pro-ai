import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts'
import './CommonLayout.css'

export function OperationsLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="header-left">
          <h1 className="header-title">运营端</h1>
        </div>
        <div className="header-right">
          <span className="user-info">
            {user?.name} | {user?.username}
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            退出登录
          </button>
        </div>
      </header>

      <div className="layout-body">
        <aside className="layout-sidebar">
          <nav className="sidebar-nav">
            <Link to="/operations" className="nav-item">
              首页
            </Link>
            <Link to="/operations/platform" className="nav-item">
              平台管理
            </Link>
            <Link to="/operations/users" className="nav-item">
              用户管理
            </Link>
            <Link to="/operations/orders" className="nav-item">
              订单管理
            </Link>
            <Link to="/operations/settings" className="nav-item">
              系统设置
            </Link>
          </nav>
        </aside>

        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
