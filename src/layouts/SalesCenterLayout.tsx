import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts'
import './CommonLayout.css'

export function SalesCenterLayout() {
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
          <h1 className="header-title">销售中心端</h1>
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
            <Link to="/sales-center" className="nav-item">
              首页
            </Link>
            <Link to="/sales-center/team" className="nav-item">
              团队管理
            </Link>
            <Link to="/sales-center/reports" className="nav-item">
              报表分析
            </Link>
            <Link to="/sales-center/targets" className="nav-item">
              目标管理
            </Link>
            <Link to="/sales-center/settings" className="nav-item">
              中心设置
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
