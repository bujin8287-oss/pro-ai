import { useState, useEffect } from 'react'
import { get, post, put, del } from '@/request/http'
import './OrganizationPage.css'

interface Organization {
  id: number
  name: string
  region: string
  type: string
  phone: string
  status: string
  packageCount: string
  admin: string
  createTime: string
}

export function OrganizationPage() {
  const [searchName, setSearchName] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [allOrganizations, setAllOrganizations] = useState<Organization[]>([])

  // 计算分页数据
  const totalPages = Math.ceil(organizations.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentData = organizations.slice(startIndex, endIndex)

  const loadData = async () => {
    try {
      const data = await get<Organization[]>('/organizations')
      setAllOrganizations(data)
      setOrganizations(data)
    } catch {
      // 忽略错误
    }
  }

  // 加载数据
  useEffect(() => {
    loadData() // eslint-disable-line react-hooks/set-state-in-effect
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    region: '',
    type: '',
    phone: '',
    status: '',
    packageCount: '',
    admin: '',
  })

  const handleSearch = () => {
    // 过滤数据
    const filtered = allOrganizations.filter(org => {
      const matchName = searchName ? org.name.includes(searchName) : true
      const matchPhone = searchPhone ? org.type.includes(searchPhone) : true
      return matchName && matchPhone
    })
    setOrganizations(filtered)
    setCurrentPage(1)
  }

  const handleReset = () => {
    setSearchName('')
    setSearchPhone('')
    setOrganizations(allOrganizations)
    setCurrentPage(1)
  }

  const handleAdd = () => {
    setEditingOrg(null)
    setFormData({
      name: '',
      region: '',
      type: '',
      phone: '',
      status: '',
      packageCount: '',
      admin: '',
    })
    setShowModal(true)
  }

  const handleEdit = (org: Organization) => {
    setEditingOrg(org)
    setFormData({
      name: org.name,
      region: org.region,
      type: org.type,
      phone: org.phone,
      status: org.status,
      packageCount: org.packageCount,
      admin: org.admin,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      try {
        await del(`/organizations/${id}`)
        await loadData()
      } catch (error) {
        console.error('删除失败:', error)
        alert('删除失败')
      }
    }
  }

  const handleSubmit = async () => {
    try {
      if (editingOrg) {
        // 编辑
        await put(`/organizations/${editingOrg.id}`, formData)
      } else {
        // 新增
        await post('/organizations', formData)
      }
      setShowModal(false)
      await loadData()
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败')
    }
  }

  return (
    <div className="organization-page">
      {/* 搜索栏 */}
      <div className="search-bar">
        <div className="search-item">
          <label>机构名称：</label>
          <input
            type="text"
            placeholder="请输入"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
          />
        </div>
        <div className="search-item">
          <label>管理员姓名：</label>
          <input
            type="text"
            placeholder="请输入"
            value={searchPhone}
            onChange={e => setSearchPhone(e.target.value)}
          />
        </div>
        <div className="search-buttons">
          <button className="btn-primary" onClick={handleSearch}>
            查询
          </button>
          <button className="btn-default" onClick={handleReset}>
            重置
          </button>
        </div>
        <button className="btn-add" onClick={handleAdd}>
          新增
        </button>
      </div>

      {/* 表格 */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>序号</th>
              <th>机构名称</th>
              <th>区域</th>
              <th>管理员姓名</th>
              <th>联系电话</th>
              <th>包裹类型号</th>
              <th>管理员账号</th>
              <th>创建人</th>
              <th>创建日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((org, index) => (
              <tr key={org.id}>
                <td>{startIndex + index + 1}</td>
                <td>{org.name}</td>
                <td>{org.region}</td>
                <td>{org.type}</td>
                <td>{org.phone}</td>
                <td>{org.status}</td>
                <td>{org.packageCount}</td>
                <td>{org.admin}</td>
                <td>{org.createTime}</td>
                <td>
                  <button className="btn-link" onClick={() => handleEdit(org)}>
                    插入表格
                  </button>
                  <button className="btn-link" onClick={() => handleEdit(org)}>
                    编辑
                  </button>
                  <button className="btn-link danger" onClick={() => handleDelete(org.id)}>
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 分页 */}
        <div className="pagination">
          <span className="total">共{organizations.length}条</span>
          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
            // 只显示当前页附近的页码
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
            onChange={e => {
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
            onKeyPress={e => {
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

      {/* 弹窗 */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingOrg ? '编辑机构' : '新增机构'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <label>机构名称：</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label>区域：</label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={e => setFormData({ ...formData, region: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label>管理员姓名：</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label>联系电话：</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label>包裹类型号：</label>
                <input
                  type="text"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label>管理员账号：</label>
                <input
                  type="text"
                  value={formData.packageCount}
                  onChange={e => setFormData({ ...formData, packageCount: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label>创建人：</label>
                <input
                  type="text"
                  value={formData.admin}
                  onChange={e => setFormData({ ...formData, admin: e.target.value })}
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
    </div>
  )
}
