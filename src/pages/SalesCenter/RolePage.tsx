import { useState, useEffect } from 'react'
import { get, post, put, del } from '@/request/http'
import './RolePage.css'

interface Role {
  id: number
  name: string
  accountCount: number
  creator: string
  createTime: string
}

export function RolePage() {
  const [searchName, setSearchName] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)

  const [roles, setRoles] = useState<Role[]>([])
  const [allRoles, setAllRoles] = useState<Role[]>([])

  // 计算分页数据
  const totalPages = Math.ceil(roles.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentData = roles.slice(startIndex, endIndex)

  const [formData, setFormData] = useState({
    name: '',
  })

  // 加载数据
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      // 模拟数据
      const mockData: Role[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: ['管理员', '中介管理员', '机构管理员'][i % 3],
        accountCount: [3, 2, 1, 5, 3, 12, 3, 2, 5, 2][i % 10],
        creator: 'admin',
        createTime: '2022.02.22 17:32',
      }))
      setAllRoles(mockData)
      setRoles(mockData)
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    const filtered = allRoles.filter((role) => {
      return searchName ? role.name.includes(searchName) : true
    })
    setRoles(filtered)
    setCurrentPage(1)
  }

  const handleReset = () => {
    setSearchName('')
    setRoles(allRoles)
    setCurrentPage(1)
  }

  const handleExport = () => {
    // 导出功能
    console.log('导出角色数据')
    alert('导出功能')
  }

  const handleAdd = () => {
    setEditingRole(null)
    setFormData({
      name: '',
    })
    setShowModal(true)
  }

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
    })
    setShowModal(true)
  }

  const handleDeleteClick = (id: number) => {
    setDeletingId(id)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (deletingId) {
      try {
        setRoles(roles.filter((role) => role.id !== deletingId))
        setAllRoles(allRoles.filter((role) => role.id !== deletingId))
        setShowDeleteModal(false)
        setDeletingId(null)
      } catch (error) {
        console.error('删除失败:', error)
        alert('删除失败')
      }
    }
  }

  const handleSubmit = async () => {
    // 验证必填项
    if (!formData.name) {
      alert('请填写角色名称')
      return
    }

    try {
      if (editingRole) {
        // 编辑
        const updated = {
          ...editingRole,
          ...formData,
        }
        setRoles(roles.map((r) => (r.id === editingRole.id ? updated : r)))
        setAllRoles(allRoles.map((r) => (r.id === editingRole.id ? updated : r)))
      } else {
        // 新增
        const newRole: Role = {
          id: Math.max(...allRoles.map((r) => r.id)) + 1,
          name: formData.name,
          accountCount: 0,
          creator: 'admin',
          createTime: new Date().toLocaleString('zh-CN').replace(/\//g, '.'),
        }
        setRoles([...roles, newRole])
        setAllRoles([...allRoles, newRole])
      }
      setShowModal(false)
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败')
    }
  }

  return (
    <div className="role-page">
      {/* 搜索栏 */}
      <div className="search-bar">
        <div className="search-item">
          <label>角色名称：</label>
          <input
            type="text"
            placeholder="请输入"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="search-buttons">
          <button className="btn-primary" onClick={handleSearch}>
            查询
          </button>
          <button className="btn-default" onClick={handleReset}>
            出口
          </button>
        </div>
        <button className="btn-add" onClick={handleAdd} style={{ marginLeft: 'auto' }}>
          新增
        </button>
      </div>

      {/* 表格 */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>序号</th>
              <th>角色名称</th>
              <th>关联账号数</th>
              <th>创建人</th>
              <th>创建日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((role, index) => (
              <tr key={role.id}>
                <td>{startIndex + index + 1}</td>
                <td>{role.name}</td>
                <td>{role.accountCount}</td>
                <td>{role.creator}</td>
                <td>{role.createTime}</td>
                <td>
                  <button className="btn-link" onClick={() => handleEdit(role)}>
                    编辑
                  </button>
                  <button className="btn-link danger" onClick={() => handleDeleteClick(role.id)}>
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 分页 */}
        <div className="pagination">
          <span className="total">共{roles.length}条</span>
          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 2 && page <= currentPage + 2)
            ) {
              return (
                <button
                  key={page}
                  className={`page-btn ${page === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            } else if (page === currentPage - 3 || page === currentPage + 3) {
              return (
                <span key={page} className="page-ellipsis">
                  ...
                </span>
              )
            }
            return null
          })}
          <button
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            &gt;
          </button>
          <select
            className="page-size-select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setCurrentPage(1)
            }}
          >
            <option value={10}>10条/页</option>
            <option value={20}>20条/页</option>
            <option value={50}>50条/页</option>
          </select>
          <span className="page-jump-label">跳至</span>
          <input
            type="number"
            className="page-jump-input"
            min={1}
            max={totalPages}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const page = Number((e.target as HTMLInputElement).value)
                if (page >= 1 && page <= totalPages) {
                  setCurrentPage(page)
                }
              }
            }}
          />
          <span className="page-jump-label">页</span>
        </div>
      </div>

      {/* 新增/编辑弹窗 */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingRole ? '编辑角色' : '新增角色'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <label>
                  <span className="required">*</span>角色名称：
                </label>
                <input
                  type="text"
                  placeholder="请输入角色名称"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-default" onClick={() => setShowModal(false)}>
                取消
              </button>
              <button className="btn-primary" onClick={handleSubmit}>
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认弹窗 */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>删除角色</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <span className="warning-icon">⚠</span>
                <p>确定删除该角色吗？删除后将无法恢复</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-default" onClick={() => setShowDeleteModal(false)}>
                取消
              </button>
              <button className="btn-danger" onClick={handleDeleteConfirm}>
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
