import { useDocumentTitle } from '@/hooks'
import { logger } from '@/utils'

export function HomePage() {
  useDocumentTitle('首页')

  return (
    <section>
      <h1 style={{ margin: '0 0 8px' }}>首页</h1>
      <p style={{ margin: 0, opacity: 0.8 }}>
        路由已配置完成。接下来你可以在 <code>src/pages</code> 里继续加页面，并在{' '}
        <code>src/router</code> 里维护路由表。
      </p>

      <div style={{ marginTop: 16 }}>
        <button type="button" onClick={() => logger.info('hello from HomePage')}>
          点我打印日志
        </button>
      </div>
    </section>
  )
}


