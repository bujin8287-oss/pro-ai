import { useState, useEffect } from 'react'
import './SupplierPage.css'

interface Supplier {
  id: number
  name: string
  categoryCount: number
  contact: string
  phone: string
  createTime: string
}

export function SupplierPage() {
  const [searchName, setSearchName] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([])

  // 计算分页数据
  const totalPages = Math.ceil(suppliers.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentData = suppliers.slice(startIndex, endIndex)

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    phone: '',
  })

  const loadData = async () => {
    try {
      // 模拟数据
      const mockData: Supplier[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: ['幸福生活店', '光明超市店'][i % 2],
        categoryCount: [3, 2, 1, 5][i % 4],
        contact: 'admin',
        phone: '13877775555',
        createTime: '2022.02.22',
      }))
      setAllSuppliers(mockData)
      setSuppliers(mockData)
    } catch {
      // 忽略错误
    }
  }

  // 加载数据
  useEffect(() => {
    loadData() // eslint-disable-line react-hooks/set-state-in-effect
  }, [])

  const handleSearch = () => {
    const filtered = allSuppliers.filter(supplier => {
      return searchName ? supplier.name.includes(searchName) : true
    })
    setSuppliers(filtered)
    setCurrentPage(1)
  }

  const handleReset = () => {
    setSearchName('')
    setSuppliers(allSuppliers)
    setCurrentPage(1)
  }

  const handleAdd = () => {
    setEditingSupplier(null)
    setFormData({
      name: '',
      contact: '',
      phone: '',
    })
    setShowModal(true)
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      contact: supplier.contact,
      phone: supplier.phone,
    })
    setShowModal(true)
  }

  const handleDeleteClick = (id: number) => {
    setDeletingId(id)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (deletingId) {
      setSuppliers(suppliers.filter(supplier => supplier.id !== deletingId))
      setAllSuppliers(allSuppliers.filter(supplier => supplier.id !== deletingId))
      setShowDeleteModal(false)
      setDeletingId(null)
    }
  }

  const handleSubmit = async () => {
    // 验证必填项
    if (!formData.name || !formData.contact || !formData.phone) {
      alert('请填写所有必填项')
      return
    }

    if (editingSupplier) {
      // 编辑
      const updated = {
        ...editingSupplier,
        ...formData,
      }
      setSuppliers(suppliers.map(s => (s.id === editingSupplier.id ? updated : s)))
      setAllSuppliers(allSuppliers.map(s => (s.id === editingSupplier.id ? updated : s)))
    } else {
      // 新增
      const newSupplier: Supplier = {
        id: Math.max(...allSuppliers.map(s => s.id)) + 1,
        name: formData.name,
        categoryCount: 0,
        contact: formData.contact,
        phone: formData.phone,
        createTime: new Date().toLocaleDateString('zh-CN').replace(/\//g, '.'),
      }
      setSuppliers([...suppliers, newSupplier])
      setAllSuppliers([...allSuppliers, newSupplier])
    }
    setShowModal(false)
  }

  return (
    <div className="supplier-page">
      {/* 搜索栏 */}
      <div className="search-bar">
        <div className="search-item">
          <label>供应商：</label>
          <input
            type="text"
            placeholder="请输入"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
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
        <button className="btn-add" onClick={handleAdd} style={{ marginLeft: 'auto' }}>
          实验
        </button>
      </div>

      {/* 表格 */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>序号</th>
              <th>供应商名称</th>
              <th>供货品类数</th>
              <th>联系人</th>
              <th>联系电话</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((supplier, index) => (
              <tr key={supplier.id}>
                <td>{startIndex + index + 1}</td>
                <td>{supplier.name}</td>
                <td>{supplier.categoryCount}</td>
                <td>{supplier.contact}</td>
                <td>{supplier.phone}</td>
                <td>
                  <button className="btn-link" onClick={() => handleEdit(supplier)}>
                    编辑
                  </button>
                  <button
                    className="btn-link danger"
                    onClick={() => handleDeleteClick(supplier.id)}
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 分页 */}
        <div className="pagination">
          <span className="total">共{suppliers.length}条</span>
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

      {/* 新增/编辑弹窗 */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingSupplier ? '编辑供应商' : '新增/编辑供应商'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <label>
                  <span className="required">*</span>供应商名称：
                </label>
                <input
                  type="text"
                  placeholder="请输入供应商名称"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label>
                  <span className="required">*</span>联系人：
                </label>
                <input
                  type="text"
                  placeholder="请输入联系人姓名"
                  value={formData.contact}
                  onChange={e => setFormData({ ...formData, contact: e.target.value })}
                />
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
              <h3>警告提示</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <span className="warning-icon">⚠</span>
                <p>该供应商正在被使用该供应商</p>
                <p className="warning-sub">删除后将无法恢复</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={handleDeleteConfirm}>
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
