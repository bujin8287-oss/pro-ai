import { useState, useEffect } from 'react'
import { get, post, put, del } from '@/request/http'
import './PurchasePage.css'

interface Purchase {
  id: number
  organization: string
  applicant: string
  supplierCount: number
  categoryCount: number
  expectedDate: string
  status: '未发货' | '已发货'
  createTime: string
}

export function PurchasePage() {
  const [searchOrg, setSearchOrg] = useState('')
  const [searchDate, setSearchDate] = useState('')
  const [searchStatus, setSearchStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)

  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [allPurchases, setAllPurchases] = useState<Purchase[]>([])

  // 计算分页数据
  const totalPages = Math.ceil(purchases.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentData = purchases.slice(startIndex, endIndex)

  // 加载数据
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      // 模拟数据
      const mockData: Purchase[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        organization: ['幸福生活店', '光明超市店', '幸福超市店'][i % 3],
        applicant: '李四',
        supplierCount: [3, 4, 2, 5, 7, 8, 9, 1][i % 8],
        categoryCount: [3, 4, 2, 5, 7, 8, 9, 1][i % 8],
        expectedDate: '2022-11-23',
        status: i === 0 ? '未发货' : ['未发货', '已发货'][i % 2] as '未发货' | '已发货',
        createTime: '2022-11-23',
      }))
      setAllPurchases(mockData)
      setPurchases(mockData)
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    const filtered = allPurchases.filter((purchase) => {
      const matchOrg = searchOrg ? purchase.organization.includes(searchOrg) : true
      const matchDate = searchDate ? purchase.expectedDate.includes(searchDate) : true
      const matchStatus = searchStatus ? purchase.status === searchStatus : true
      return matchOrg && matchDate && matchStatus
    })
    setPurchases(filtered)
    setCurrentPage(1)
  }

  const handleReset = () => {
    setSearchOrg('')
    setSearchDate('')
    setSearchStatus('')
    setPurchases(allPurchases)
    setCurrentPage(1)
  }

  const handleShip = (id: number) => {
    // 发货功能
    console.log('发货采购申请:', id)
    alert('发货功能')
  }

  const handleViewDetail = (id: number) => {
    // 查看详情功能
    console.log('查看详情:', id)
    alert('查看详情功能')
  }

  return (
    <div className="purchase-page">
      {/* 搜索栏 */}
      <div className="search-bar">
        <div className="search-item">
          <label>机构名称：</label>
          <input
            type="text"
            placeholder="请输入"
            value={searchOrg}
            onChange={(e) => setSearchOrg(e.target.value)}
          />
        </div>
        <div className="search-item">
          <label>期望到货日期：</label>
          <select value={searchDate} onChange={(e) => setSearchDate(e.target.value)}>
            <option value="">请选择</option>
            <option value="2022-11-23">2022-11-23</option>
            <option value="2022-11-24">2022-11-24</option>
            <option value="2022-11-25">2022-11-25</option>
          </select>
        </div>
        <div className="search-item">
          <label>状态：</label>
          <select value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)}>
            <option value="">请选择</option>
            <option value="未发货">未发货</option>
            <option value="已发货">已发货</option>
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
      </div>

      {/* 表格 */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>序号</th>
              <th>仓储机构</th>
              <th>申请人</th>
              <th>供货商数</th>
              <th>总类数</th>
              <th>期望到货日期</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((purchase, index) => (
              <tr key={purchase.id}>
                <td>{startIndex + index + 1}</td>
                <td>{purchase.organization}</td>
                <td>{purchase.applicant}</td>
                <td>{purchase.supplierCount}</td>
                <td>{purchase.categoryCount}</td>
                <td>{purchase.expectedDate}</td>
                <td>
                  <span className={`status-badge ${purchase.status === '未发货' ? 'pending' : 'completed'}`}>
                    {purchase.status}
                  </span>
                </td>
                <td>
                  {startIndex + index === 0 && (
                    <button className="btn-link" onClick={() => handleShip(purchase.id)}>
                      发货
                    </button>
                  )}
                  <button className="btn-link" onClick={() => handleViewDetail(purchase.id)}>
                    查看详情
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 分页 */}
        <div className="pagination">
          <span className="total">共{purchases.length}条</span>
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
    </div>
  )
}
