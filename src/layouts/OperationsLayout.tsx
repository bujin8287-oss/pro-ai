import { useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts'
import './CommonLayout.css'

export function OperationsLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [accountMenuOpen, setAccountMenuOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const isAccountActive = () => {
    return (
      location.pathname.startsWith('/operations/account') ||
      location.pathname.startsWith('/operations/role') ||
      location.pathname.startsWith('/operations/account-settings')
    )
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
            <Link to="/operations" className={`nav-item ${isActive('/operations') ? 'active' : ''}`}>
              首页
            </Link>

            <Link
              to="/operations/organization"
              className={`nav-item ${isActive('/operations/organization') ? 'active' : ''}`}
            >
              机构管理
            </Link>

            <div className={`nav-item-group ${isAccountActive() ? 'active' : ''}`}>
              <div
                className="nav-item nav-item-parent"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              >
                <span>账户设置</span>
                <span className={`nav-arrow ${accountMenuOpen ? 'open' : ''}`}>▼</span>
              </div>

              {accountMenuOpen && (
                <div className="nav-submenu">
                  <Link
                    to="/operations/account"
                    className={`nav-subitem ${isActive('/operations/account') ? 'active' : ''}`}
                  >
                    账号管理
                  </Link>
                  <Link
                    to="/operations/role"
                    className={`nav-subitem ${isActive('/operations/role') ? 'active' : ''}`}
                  >
                    角色管理
                  </Link>
                  <Link
                    to="/operations/account-settings"
                    className={`nav-subitem ${isActive('/operations/account-settings') ? 'active' : ''}`}
                  >
                    账号设置
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </aside>

        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
