import { Link } from 'react-router-dom'

import { useDocumentTitle } from '@/hooks'

export function NotFoundPage() {
  useDocumentTitle('页面不存在')

  return (
    <section>
      <h1 style={{ margin: '0 0 8px' }}>404</h1>
      <p style={{ margin: '0 0 16px', opacity: 0.8 }}>页面不存在或已被移除。</p>
      <Link to="/">返回首页</Link>
    </section>
  )
}


