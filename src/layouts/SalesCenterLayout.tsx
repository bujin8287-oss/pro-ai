import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts'
import './CommonLayout.css'

export function SalesCenterLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['膳食管理', '账户设置'])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupName) ? prev.filter((g) => g !== groupName) : [...prev, groupName]
    )
  }

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="header-left">
          <h1 className="header-title">机构中心端</h1>
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
            
            <Link to="/sales-center/organization" className="nav-item">
              分机构管理
            </Link>

            <div className="nav-group">
              <div
                className="nav-group-title"
                onClick={() => toggleGroup('膳食管理')}
                style={{ cursor: 'pointer' }}
              >
                膳食管理
                <span className={`nav-arrow ${expandedGroups.includes('膳食管理') ? 'expanded' : ''}`}>
                  ▼
                </span>
              </div>
              <div
                className={`nav-group-items ${expandedGroups.includes('膳食管理') ? 'expanded' : ''}`}
              >
                <Link to="/sales-center/food" className="nav-sub-item">
                  食材管理
                </Link>
                <Link to="/sales-center/supplier" className="nav-sub-item">
                  供应商管理
                </Link>
                <Link to="/sales-center/purchase" className="nav-sub-item">
                  采购申请
                </Link>
              </div>
            </div>

            <div className="nav-group">
              <div
                className="nav-group-title"
                onClick={() => toggleGroup('账户设置')}
                style={{ cursor: 'pointer' }}
              >
                账户设置
                <span className={`nav-arrow ${expandedGroups.includes('账户设置') ? 'expanded' : ''}`}>
                  ▼
                </span>
              </div>
              <div
                className={`nav-group-items ${expandedGroups.includes('账户设置') ? 'expanded' : ''}`}
              >
                <Link to="/sales-center/account" className="nav-sub-item">
                  账号管理
                </Link>
                <Link to="/sales-center/role" className="nav-sub-item">
                  角色管理
                </Link>
                <Link to="/sales-center/settings" className="nav-sub-item">
                  账号设置
                </Link>
              </div>
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
