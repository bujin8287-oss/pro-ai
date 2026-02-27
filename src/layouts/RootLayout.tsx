import { Link, Outlet } from 'react-router-dom'

import { Button } from '@/components'
import { useBoolean } from '@/hooks'
import { cn } from '@/utils'

export function RootLayout() {
  const navOpen = useBoolean(false)

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__left">
          <div className="app-brand">My React App</div>
        </div>

        <div className="app-header__right">
          <Button variant="ghost" onClick={navOpen.toggle} aria-expanded={navOpen.value}>
            {navOpen.value ? '关闭菜单' : '打开菜单'}
          </Button>
        </div>
      </header>

      <div className="app-body">
        <aside className={cn('app-nav', navOpen.value && 'is-open')}>
          <nav className="app-nav__inner">
            <Link to="/">首页</Link>
            <Link to="/not-exist">404 示例</Link>
          </nav>
        </aside>

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}


