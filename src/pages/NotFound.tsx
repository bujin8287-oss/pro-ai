import { useNavigate } from 'react-router-dom'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1 style={{ fontSize: '72px', margin: '0' }}>404</h1>
      <p style={{ fontSize: '24px', color: '#666' }}>页面不存在</p>
      <button
        onClick={() => navigate('/login')}
        style={{
          marginTop: '20px',
          padding: '10px 24px',
          fontSize: '16px',
          background: '#1890ff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        返回登录
      </button>
    </div>
  )
}
