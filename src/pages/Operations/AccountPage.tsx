import { useState, useEffect } from 'react'
import './AccountPage.css'

interface Account {
  id: number
  username: string
  phone: string
  beds: number
  license: string
  creator: string
  createDate: string
}

export function AccountPage() {
  const [searchName, setSearchName] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [accounts, setAccounts] = useState<Account[]>([])
  const [allAccounts, setAllAccounts] = useState<Account[]>([])

  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    beds: '',
    license: '',
  })

  // 计算分页数据
  const totalPages = Math.ceil(accounts.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentData = accounts.slice(startIndex, endIndex)

  const loadData = async () => {
    try {
      // 模拟数据
      const mockData: Account[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        username: ['芹菜', '孙绍宝', '孙绍宝'][i % 3],
        phone: '13288887777',
        beds: ['xieoj', 'admin'][i % 2] === 'xieoj' ? 0 : 123456,
        license: '123456',
        creator: 'admin',
        createDate: '2022.02.22 17:32',
      }))
      setAllAccounts(mockData)
      setAccounts(mockData)
    } catch {
      // 忽略错误
    }
  }

  useEffect(() => {
    loadData() // eslint-disable-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = () => {
    const filtered = allAccounts.filter(account => {
      const nameMatch = searchName ? account.username.includes(searchName) : true
      const phoneMatch = searchPhone ? account.phone.includes(searchPhone) : true
      return nameMatch && phoneMatch
    })
    setAccounts(filtered)
    setCurrentPage(1)
  }

  const handleReset = () => {
    setSearchName('')
    setSearchPhone('')
    setAccounts(allAccounts)
    setCurrentPage(1)
  }

  const handleAdd = () => {
    setEditingAccount(null)
    setFormData({
      username: '',
      phone: '',
      beds: '',
      license: '',
    })
    setShowModal(true)
  }

  const handleEdit = (account: Account) => {
    setEditingAccount(account)
    setFormData({
      username: account.username,
      phone: account.phone,
      beds: account.beds.toString(),
      license: account.license,
    })
    setShowModal(true)
  }

  const handleDeleteClick = (id: number) => {
    setDeletingId(id)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (deletingId) {
      setAccounts(accounts.filter(account => account.id !== deletingId))
      setAllAccounts(allAccounts.filter(account => account.id !== deletingId))
      setShowDeleteModal(false)
      setDeletingId(null)
    }
  }

  const handleSubmit = async () => {
    if (editingAccount) {
      // 编辑
      const updated = {
        ...editingAccount,
        ...formData,
        beds: Number(formData.beds),
      }
      setAccounts(accounts.map(a => (a.id === editingAccount.id ? updated : a)))
      setAllAccounts(allAccounts.map(a => (a.id === editingAccount.id ? updated : a)))
    } else {
      // 新增
      const newAccount: Account = {
        id: Math.max(...allAccounts.map(a => a.id)) + 1,
        username: formData.username,
        phone: formData.phone,
        beds: Number(formData.beds),
        license: formData.license,
        creator: 'admin',
        createDate: new Date().toLocaleString('zh-CN').replace(/\//g, '.'),
      }
      setAccounts([...accounts, newAccount])
      setAllAccounts([...allAccounts, newAccount])
    }
    setShowModal(false)
  }

  return (
    <div className="account-page">
      {/* 搜索栏 */}
      <div className="search-bar">
        <div className="search-item">
          <label>姓名：</label>
          <input
            type="text"
            placeholder="请输入"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
          />
        </div>
        <div className="search-item">
          <label>手机号：</label>
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
              <th>姓名</th>
              <th>手机号</th>
              <th>编号</th>
              <th>密码</th>
              <th>创建人</th>
              <th>创建日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((account, index) => (
              <tr key={account.id}>
                <td>{startIndex + index + 1}</td>
                <td>{account.username}</td>
                <td>{account.phone}</td>
                <td>{account.beds}</td>
                <td>{account.license}</td>
                <td>{account.creator}</td>
                <td>{account.createDate}</td>
                <td>
                  <button className="btn-link" onClick={() => handleEdit(account)}>
                    编辑
                  </button>
                  <button className="btn-link danger" onClick={() => handleDeleteClick(account.id)}>
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 分页 */}
        <div className="pagination">
          <span className="total">共{accounts.length}条</span>
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
              <h3>{editingAccount ? '编辑账号' : '新增账号'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <label>
                  <span className="required">*</span>姓名：
                </label>
                <input
                  type="text"
                  placeholder="请输入姓名"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label>
                  <span className="required">*</span>手机号：
                </label>
                <input
                  type="text"
                  placeholder="请输入手机号"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label>
                  <span className="required">*</span>编号：
                </label>
                <input
                  type="text"
                  placeholder="请输入编号"
                  value={formData.beds}
                  onChange={e => setFormData({ ...formData, beds: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label>
                  <span className="required">*</span>密码：
                </label>
                <input
                  type="text"
                  placeholder="请输入密码"
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
              <h3>删除账号</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <span className="warning-icon">⚠️</span>
                <p>确定删除该账号吗？删除后将无法恢复</p>
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
