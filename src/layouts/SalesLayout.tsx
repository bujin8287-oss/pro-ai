import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts'
import './CommonLayout.css'

export function SalesLayout() {
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
          <h1 className="header-title">机构端</h1>
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
            <Link to="/sales" className="nav-item">
              首页
            </Link>
            <Link to="/sales/customers" className="nav-item">
              客户管理
            </Link>
            <Link to="/sales/tasks" className="nav-item">
              任务管理
            </Link>
            <Link to="/sales/performance" className="nav-item">
              业绩统计
            </Link>
            <Link to="/sales/profile" className="nav-item">
              个人中心
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
