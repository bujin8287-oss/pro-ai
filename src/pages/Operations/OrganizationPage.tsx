import { useState, useEffect } from 'react'
import './OrganizationPage.css'

interface Organization {
  id: number
  name: string
  district: string
  type: string
  phone: string
  beds: number
  license: string
  manager: string
  createDate: string
}

export function OrganizationPage() {
  const [searchName, setSearchName] = useState('')
  const [searchType, setSearchType] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [allOrganizations, setAllOrganizations] = useState<Organization[]>([])

  const [formData, setFormData] = useState({
    name: '',
    district: '',
    type: '',
    phone: '',
    beds: '',
    license: '',
    manager: '',
  })

  // 计算分页数据
  const totalPages = Math.ceil(organizations.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentData = organizations.slice(startIndex, endIndex)

  const loadData = async () => {
    try {
      // 模拟数据
      const mockData: Organization[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: ['门诊大楼', '国际体检中心', '国际中山中心', '巴比伦医院'][i % 4],
        district: ['深圳-南山区', '深圳-福田区'][i % 2],
        type: ['组织', '机构'][i % 2],
        phone: '13288887777',
        beds: ['xieoj', 'admin'][i % 2] === 'xieoj' ? 0 : 625,
        license: '123456',
        manager: ['xieoj', 'admin'][i % 2],
        createDate: '2022.02.22',
      }))
      setAllOrganizations(mockData)
      setOrganizations(mockData)
    } catch {
      // 忽略错误
    }
  }

  useEffect(() => {
    loadData() // eslint-disable-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = () => {
    const filtered = allOrganizations.filter(org => {
      const nameMatch = searchName ? org.name.includes(searchName) : true
      const typeMatch = searchType ? org.type === searchType : true
      return nameMatch && typeMatch
    })
    setOrganizations(filtered)
    setCurrentPage(1)
  }

  const handleReset = () => {
    setSearchName('')
    setSearchType('')
    setOrganizations(allOrganizations)
    setCurrentPage(1)
  }

  const handleAdd = () => {
    setEditingOrg(null)
    setFormData({
      name: '',
      district: '',
      type: '',
      phone: '',
      beds: '',
      license: '',
      manager: '',
    })
    setShowModal(true)
  }

  const handleEdit = (org: Organization) => {
    setEditingOrg(org)
    setFormData({
      name: org.name,
      district: org.district,
      type: org.type,
      phone: org.phone,
      beds: org.beds.toString(),
      license: org.license,
      manager: org.manager,
    })
    setShowModal(true)
  }

  const handleDeleteClick = (id: number) => {
    setDeletingId(id)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (deletingId) {
      setOrganizations(organizations.filter(org => org.id !== deletingId))
      setAllOrganizations(allOrganizations.filter(org => org.id !== deletingId))
      setShowDeleteModal(false)
      setDeletingId(null)
    }
  }

  const handleSubmit = async () => {
    if (editingOrg) {
      // 编辑
      const updated = {
        ...editingOrg,
        ...formData,
        beds: Number(formData.beds),
      }
      setOrganizations(organizations.map(o => (o.id === editingOrg.id ? updated : o)))
      setAllOrganizations(allOrganizations.map(o => (o.id === editingOrg.id ? updated : o)))
    } else {
      // 新增
      const newOrg: Organization = {
        id: Math.max(...allOrganizations.map(o => o.id)) + 1,
        name: formData.name,
        district: formData.district,
        type: formData.type,
        phone: formData.phone,
        beds: Number(formData.beds),
        license: formData.license,
        manager: formData.manager,
        createDate: new Date().toLocaleDateString('zh-CN').replace(/\//g, '.'),
      }
      setOrganizations([...organizations, newOrg])
      setAllOrganizations([...allOrganizations, newOrg])
    }
    setShowModal(false)
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
          <label>管理员类型：</label>
          <select value={searchType} onChange={e => setSearchType(e.target.value)}>
            <option value="">请输入</option>
            <option value="组织">组织</option>
            <option value="机构">机构</option>
          </select>
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
              <th>管理员类型</th>
              <th>联系电话</th>
              <th>管理员账号</th>
              <th>管理员密码</th>
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
                <td>{org.district}</td>
                <td>{org.type}</td>
                <td>{org.phone}</td>
                <td>{org.manager}</td>
                <td>{org.license}</td>
                <td>{org.manager}</td>
                <td>{org.createDate}</td>
                <td>
                  <button className="btn-link" onClick={() => handleEdit(org)}>
                    编辑
                  </button>
                  <button className="btn-link danger" onClick={() => handleDeleteClick(org.id)}>
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
            onKeyDown={e => {
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
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingOrg ? '编辑机构' : '新增机构'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <label>
                  <span className="required">*</span>机构名称：
                </label>
                <input
                  type="text"
                  placeholder="请输入机构名称"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label>
                  <span className="required">*</span>区域：
                </label>
                <input
                  type="text"
                  placeholder="请输入区域"
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label>
                  <span className="required">*</span>管理员类型：
                </label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="">请选择</option>
                  <option value="组织">组织</option>
                  <option value="机构">机构</option>
                </select>
              </div>
              <div className="form-row">
                <label>
                  <span className="required">*</span>联系电话：
                </label>
                <input
                  type="text"
                  placeholder="请输入联系电话"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label>管理员账号：</label>
                <input
                  type="text"
                  placeholder="请输入管理员账号"
                  value={formData.manager}
                  onChange={e => setFormData({ ...formData, manager: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label>管理员密码：</label>
                <input
                  type="text"
                  placeholder="请输入管理员密码"
                  value={formData.license}
                  onChange={e => setFormData({ ...formData, license: e.target.value })}
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
          <div className="modal-content modal-small" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>删除机构</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <span className="warning-icon">⚠️</span>
                <p>确定删除该机构吗？删除后将无法恢复</p>
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
